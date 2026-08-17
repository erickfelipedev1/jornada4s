CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT,
  empresa TEXT,
  email TEXT,
  telefone TEXT,
  instagram TEXT,
  cnpj TEXT,
  area_fornecedor TEXT,
  faturamento_mensal TEXT,
  faixa_investimento TEXT,
  qualificado BOOLEAN NOT NULL DEFAULT true,
  origem TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT,
  referrer TEXT,
  device TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);