CREATE TABLE public.analytics_diario (
  dia date PRIMARY KEY,
  visitantes integer,
  pageviews integer,
  views_por_visita numeric,
  duracao_sessao numeric,
  bounce_rate numeric
);
GRANT ALL ON public.analytics_diario TO service_role;
ALTER TABLE public.analytics_diario ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.analytics_listas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL,
  label text NOT NULL,
  visitantes integer NOT NULL DEFAULT 0,
  periodo_dias integer NOT NULL DEFAULT 30,
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tipo, label, periodo_dias)
);
GRANT ALL ON public.analytics_listas TO service_role;
ALTER TABLE public.analytics_listas ENABLE ROW LEVEL SECURITY;