import { createServerFn } from "@tanstack/react-start";
import { PAINEL_SLUG } from "./painel";

type LeadInput = {
  nome?: string;
  empresa?: string;
  email?: string;
  telefone?: string;
  instagram?: string;
  cnpj?: string;
  area_fornecedor?: string;
  faturamento_mensal?: string;
  faixa_investimento?: string;
  qualificado?: boolean;
  origem?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export const saveLead = createServerFn({ method: "POST" })
  .inputValidator((data: LeadInput) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const clean = (v: unknown) => (typeof v === "string" ? v.slice(0, 300) : null);
    const { error } = await supabaseAdmin.from("leads").insert({
      nome: clean(data.nome),
      empresa: clean(data.empresa),
      email: clean(data.email),
      telefone: clean(data.telefone),
      instagram: clean(data.instagram),
      cnpj: clean(data.cnpj),
      area_fornecedor: clean(data.area_fornecedor),
      faturamento_mensal: clean(data.faturamento_mensal),
      faixa_investimento: clean(data.faixa_investimento),
      qualificado: data.qualificado !== false,
      origem: clean(data.origem),
      utm_source: clean(data.utm_source),
      utm_medium: clean(data.utm_medium),
      utm_campaign: clean(data.utm_campaign),
      utm_term: clean(data.utm_term),
      utm_content: clean(data.utm_content),
    });
    if (error) console.error("saveLead", error.message);
    return { ok: !error };
  });

type ViewInput = {
  path?: string;
  referrer?: string;
  device?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

export const trackPageView = createServerFn({ method: "POST" })
  .inputValidator((data: ViewInput) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const clean = (v: unknown) => (typeof v === "string" ? v.slice(0, 300) : null);
    await supabaseAdmin.from("page_views").insert({
      path: clean(data.path),
      referrer: clean(data.referrer),
      device: clean(data.device),
      utm_source: clean(data.utm_source),
      utm_medium: clean(data.utm_medium),
      utm_campaign: clean(data.utm_campaign),
    });
    return { ok: true };
  });

export type PainelData = {
  leads: Array<{
    id: string;
    created_at: string;
    nome: string | null;
    empresa: string | null;
    email: string | null;
    telefone: string | null;
    faturamento_mensal: string | null;
    faixa_investimento: string | null;
    area_fornecedor: string | null;
    cnpj: string | null;
    qualificado: boolean;
    utm_source: string | null;
    utm_campaign: string | null;
  }>;
  totals: { leads: number; qualificados: number; desqualificados: number; views: number };
  viewsPorDia: Array<{ dia: string; total: number }>;
  leadsPorDia: Array<{ dia: string; total: number }>;
  fontes: Array<{ label: string; total: number }>;
  site: {
    dias: Array<{
      dia: string;
      visitantes: number | null;
      pageviews: number | null;
      views_por_visita: number | null;
      duracao_sessao: number | null;
      bounce_rate: number | null;
    }>;
    resumo: {
      visitantes: number;
      pageviews: number;
      viewsPorVisita: number | null;
      duracao: number | null;
      bounce: number | null;
    };
    listas: Record<string, Array<{ label: string; visitantes: number }>>;
  };
};

export const getPainelData = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; dias?: number }) => data)
  .handler(async ({ data }): Promise<PainelData> => {
    if (data.token !== PAINEL_SLUG) throw new Error("Não autorizado");
    const dias = Math.min(Math.max(data.dias ?? 30, 1), 180);
    const since = new Date(Date.now() - dias * 86400000).toISOString();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [leadsRes, viewsRes, diarioRes, listasRes] = await Promise.all([
      supabaseAdmin
        .from("leads")
        .select(
          "id, created_at, nome, empresa, email, telefone, faturamento_mensal, faixa_investimento, area_fornecedor, cnpj, qualificado, utm_source, utm_campaign",
        )
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(1000),
      supabaseAdmin
        .from("page_views")
        .select("created_at, referrer, utm_source")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000),
      supabaseAdmin
        .from("analytics_diario")
        .select("dia, visitantes, pageviews, views_por_visita, duracao_sessao, bounce_rate")
        .gte("dia", since.slice(0, 10))
        .order("dia", { ascending: true }),
      supabaseAdmin
        .from("analytics_listas")
        .select("tipo, label, visitantes")
        .order("visitantes", { ascending: false }),
    ]);

    const leads = leadsRes.data ?? [];
    const views = viewsRes.data ?? [];
    const diarioRows = diarioRes.data ?? [];
    const listasRows = listasRes.data ?? [];
    const listas: Record<string, Array<{ label: string; visitantes: number }>> = {};
    for (const r of listasRows) {
      const arr = listas[r.tipo] ?? (listas[r.tipo] = []);
      arr.push({ label: r.label, visitantes: r.visitantes });
    }
    const media = (vals: Array<number | null>) => {
      const nums = vals.filter((v): v is number => typeof v === "number");
      return nums.length ? Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)) : null;
    };
    const soma = (vals: Array<number | null>) =>
      vals.reduce((acc: number, v) => acc + (typeof v === "number" ? v : 0), 0);
    const byDay = (rows: Array<{ created_at: string }>) => {
      const map = new Map<string, number>();
      for (const r of rows) {
        const dia = r.created_at.slice(0, 10);
        map.set(dia, (map.get(dia) ?? 0) + 1);
      }
      return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([dia, total]) => ({ dia, total }));
    };

    const fontesMap = new Map<string, number>();
    for (const v of views) {
      let label = v.utm_source && v.utm_source !== "n/a" ? v.utm_source : null;
      if (!label) {
        try {
          label = v.referrer ? new URL(v.referrer).hostname : "Direto";
        } catch {
          label = "Direto";
        }
      }
      fontesMap.set(label, (fontesMap.get(label) ?? 0) + 1);
    }

    return {
      leads,
      totals: {
        leads: leads.length,
        qualificados: leads.filter((l) => l.qualificado).length,
        desqualificados: leads.filter((l) => !l.qualificado).length,
        views: views.length,
      },
      viewsPorDia: byDay(views),
      leadsPorDia: byDay(leads),
      fontes: [...fontesMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, total]) => ({ label, total })),
      site: {
        dias: diarioRows.map((d) => ({
          dia: d.dia,
          visitantes: d.visitantes,
          pageviews: d.pageviews,
          views_por_visita: d.views_por_visita === null ? null : Number(d.views_por_visita),
          duracao_sessao: d.duracao_sessao === null ? null : Number(d.duracao_sessao),
          bounce_rate: d.bounce_rate === null ? null : Number(d.bounce_rate),
        })),
        resumo: {
          visitantes: soma(diarioRows.map((d) => d.visitantes)),
          pageviews: soma(diarioRows.map((d) => d.pageviews)),
          viewsPorVisita: media(diarioRows.map((d) => (d.views_por_visita === null ? null : Number(d.views_por_visita)))),
          duracao: media(diarioRows.map((d) => (d.duracao_sessao === null ? null : Number(d.duracao_sessao)))),
          bounce: media(diarioRows.map((d) => (d.bounce_rate === null ? null : Number(d.bounce_rate)))),
        },
        listas,
      },
    };
  });
