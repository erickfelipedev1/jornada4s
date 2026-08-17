ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS session_id text;
CREATE INDEX IF NOT EXISTS page_views_session_idx ON public.page_views (session_id);
CREATE INDEX IF NOT EXISTS page_views_created_idx ON public.page_views (created_at);

CREATE TABLE IF NOT EXISTS public.site_sessions (
  session_id text PRIMARY KEY,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  device text,
  referrer text,
  utm_source text,
  path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.site_sessions TO service_role;
ALTER TABLE public.site_sessions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_site_sessions_updated_at ON public.site_sessions;
CREATE TRIGGER update_site_sessions_updated_at BEFORE UPDATE ON public.site_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.sync_site_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- métricas diárias dos últimos 3 dias (histórico importado é preservado)
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
    visitantes = EXCLUDED.visitantes,
    pageviews = EXCLUDED.pageviews,
    views_por_visita = EXCLUDED.views_por_visita,
    duracao_sessao = EXCLUDED.duracao_sessao,
    bounce_rate = EXCLUDED.bounce_rate;

  -- rankings dos últimos 30 dias
  DELETE FROM public.analytics_listas WHERE periodo_dias = 30 AND tipo IN ('origem','pagina','dispositivo');

  INSERT INTO public.analytics_listas (tipo, label, visitantes, periodo_dias)
  SELECT 'origem',
         coalesce(nullif(utm_source, ''), nullif(split_part(regexp_replace(coalesce(referrer,''), '^https?://', ''), '/', 1), ''), 'Direto'),
         count(DISTINCT coalesce(session_id, id::text)),
         30
  FROM public.page_views
  WHERE created_at >= now() - interval '30 days'
  GROUP BY 2 ORDER BY 3 DESC LIMIT 12;

  INSERT INTO public.analytics_listas (tipo, label, visitantes, periodo_dias)
  SELECT 'pagina', coalesce(nullif(path, ''), '/'), count(DISTINCT coalesce(session_id, id::text)), 30
  FROM public.page_views
  WHERE created_at >= now() - interval '30 days'
  GROUP BY 2 ORDER BY 3 DESC LIMIT 12;

  INSERT INTO public.analytics_listas (tipo, label, visitantes, periodo_dias)
  SELECT 'dispositivo', coalesce(nullif(device, ''), 'desconhecido'), count(DISTINCT coalesce(session_id, id::text)), 30
  FROM public.page_views
  WHERE created_at >= now() - interval '30 days'
  GROUP BY 2 ORDER BY 3 DESC LIMIT 12;
END;
$$;

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.unschedule('sync-site-analytics') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'sync-site-analytics');
SELECT cron.schedule('sync-site-analytics', '*/15 * * * *', $$SELECT public.sync_site_analytics();$$);
SELECT public.sync_site_analytics();