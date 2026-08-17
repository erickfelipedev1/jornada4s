UPDATE public.analytics_diario
SET visitantes = 81, pageviews = 130, views_por_visita = 1.60, duracao_sessao = 79.65, bounce_rate = 85
WHERE dia = '2026-08-17';

CREATE OR REPLACE FUNCTION public.sync_site_analytics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  p int;
BEGIN
  INSERT INTO public.analytics_diario (dia, visitantes, pageviews, views_por_visita, duracao_sessao, bounce_rate)
  SELECT
    d.dia,
    d.visitantes,
    d.pageviews,
    CASE WHEN d.visitantes > 0 THEN round(d.pageviews::numeric / d.visitantes, 2) END,
    d.duracao,
    d.bounce
  FROM (
    SELECT
      (pv.created_at AT TIME ZONE 'America/Sao_Paulo')::date AS dia,
      count(*) AS pageviews,
      count(DISTINCT coalesce(pv.session_id, pv.id::text)) AS visitantes,
      round(coalesce(avg(s.dur), 0)) AS duracao,
      round(
        100.0 * coalesce(sum(CASE WHEN s.views = 1 THEN 1 ELSE 0 END), 0)
        / greatest(count(DISTINCT coalesce(pv.session_id, pv.id::text)), 1)
      ) AS bounce
    FROM public.page_views pv
    LEFT JOIN (
      SELECT p.session_id,
             count(*) AS views,
             extract(epoch FROM (max(coalesce(ss.last_seen, p.created_at)) - min(p.created_at))) AS dur
      FROM public.page_views p
      LEFT JOIN public.site_sessions ss ON ss.session_id = p.session_id
      WHERE p.session_id IS NOT NULL
      GROUP BY p.session_id
    ) s ON s.session_id = pv.session_id
    WHERE pv.created_at >= now() - interval '3 days'
    GROUP BY 1
  ) d
  ON CONFLICT (dia) DO UPDATE SET
    visitantes = greatest(coalesce(public.analytics_diario.visitantes, 0), EXCLUDED.visitantes),
    pageviews = greatest(coalesce(public.analytics_diario.pageviews, 0), EXCLUDED.pageviews),
    views_por_visita = coalesce(public.analytics_diario.views_por_visita, EXCLUDED.views_por_visita),
    duracao_sessao = coalesce(public.analytics_diario.duracao_sessao, EXCLUDED.duracao_sessao),
    bounce_rate = coalesce(public.analytics_diario.bounce_rate, EXCLUDED.bounce_rate);

  FOREACH p IN ARRAY ARRAY[7, 30, 90] LOOP
    DELETE FROM public.analytics_listas
    WHERE periodo_dias = p AND tipo IN ('origem','pagina','dispositivo')
      AND atualizado_em > now() - interval '400 days'
      AND EXISTS (
        SELECT 1 FROM public.page_views
        WHERE created_at >= now() - (p || ' days')::interval
        HAVING count(*) > 0
      );

    INSERT INTO public.analytics_listas (tipo, label, visitantes, periodo_dias)
    SELECT 'origem',
           coalesce(nullif(utm_source, ''), nullif(split_part(regexp_replace(coalesce(referrer,''), '^https?://', ''), '/', 1), ''), 'Direto'),
           count(DISTINCT coalesce(session_id, id::text)),
           p
    FROM public.page_views
    WHERE created_at >= now() - (p || ' days')::interval
    GROUP BY 2 ORDER BY 3 DESC LIMIT 12;

    INSERT INTO public.analytics_listas (tipo, label, visitantes, periodo_dias)
    SELECT 'pagina', coalesce(nullif(path, ''), '/'), count(DISTINCT coalesce(session_id, id::text)), p
    FROM public.page_views
    WHERE created_at >= now() - (p || ' days')::interval
    GROUP BY 2 ORDER BY 3 DESC LIMIT 12;

    INSERT INTO public.analytics_listas (tipo, label, visitantes, periodo_dias)
    SELECT 'dispositivo', coalesce(nullif(device, ''), 'desconhecido'), count(DISTINCT coalesce(session_id, id::text)), p
    FROM public.page_views
    WHERE created_at >= now() - (p || ' days')::interval
    GROUP BY 2 ORDER BY 3 DESC LIMIT 12;
  END LOOP;
END;
$function$;