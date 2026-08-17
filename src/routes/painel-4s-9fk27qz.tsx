import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPainelData } from "@/lib/tracking.functions";
import { PAINEL_SLUG } from "@/lib/painel";

export const Route = createFileRoute("/painel-4s-9fk27qz")({
  head: () => ({
    meta: [
      { title: "Painel de Analytics | Jornada 4S" },
      { name: "description", content: "Painel interno com leads e visitas do site da Jornada 4S." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel de Analytics | Jornada 4S" },
      { property: "og:description", content: "Painel interno de leads e visitas." },
    ],
  }),
  component: Painel,
});

const PERIODOS = [7, 30, 90];

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function Barras({ titulo, dados }: { titulo: string; dados: Array<{ dia: string; total: number }> }) {
  const max = Math.max(1, ...dados.map((d) => d.total));
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">{titulo}</h2>
      {dados.length === 0 ? (
        <p className="text-sm text-white/40">Sem dados no período.</p>
      ) : (
        <div className="flex h-48 items-stretch gap-1">
          {dados.map((d) => (
            <div key={d.dia} className="group flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] text-white/60">{d.total}</span>
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t bg-orange-500/80"
                  style={{ height: `${(d.total / max) * 100}%`, minHeight: 3 }}
                  title={`${d.dia}: ${d.total}`}
                />
              </div>
              <span className="text-[9px] text-white/35">{d.dia.slice(8)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Lista({
  titulo,
  dados,
}: {
  titulo: string;
  dados: Array<{ label: string; visitantes: number }> | undefined;
}) {
  const itens = dados ?? [];
  const max = Math.max(1, ...itens.map((i) => i.visitantes));
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="mb-4 flex items-center justify-between text-sm font-semibold uppercase tracking-wide text-white/60">
        <span>{titulo}</span>
        <span className="text-white/35">Visitantes</span>
      </h2>
      {itens.length === 0 ? (
        <p className="text-sm text-white/40">Sem dados.</p>
      ) : (
        <ul className="space-y-2">
          {itens.map((i) => (
            <li key={i.label} className="relative flex items-center justify-between overflow-hidden rounded-lg px-3 py-2 text-sm">
              <span
                className="absolute inset-y-0 left-0 rounded-lg bg-orange-500/25"
                style={{ width: `${(i.visitantes / max) * 100}%` }}
              />
              <span className="relative text-white/85">{i.label}</span>
              <span className="relative text-white/60">{i.visitantes}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Painel() {
  const [dias, setDias] = useState(30);
  const { data, isLoading, error } = useQuery({
    queryKey: ["painel", dias],
    queryFn: () => getPainelData({ data: { token: PAINEL_SLUG, dias } }),
  });

  const exportar = () => {
    if (!data) return;
    const head = [
      "data","nome","empresa","email","telefone","cnpj","area_fornecedor","faturamento","investimento","qualificado","utm_source","utm_campaign",
    ];
    const linhas = data.leads.map((l) =>
      [
        new Date(l.created_at).toLocaleString("pt-BR"),
        l.nome, l.empresa, l.email, l.telefone, l.cnpj, l.area_fornecedor,
        l.faturamento_mensal, l.faixa_investimento, l.qualificado ? "Sim" : "Não",
        l.utm_source, l.utm_campaign,
      ]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob(["\uFEFF" + [head.join(","), ...linhas].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads-jornada4s-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="min-h-screen bg-[#0b1029] px-4 py-10 text-white antialiased">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Painel Jornada 4S</h1>
            <p className="text-sm text-white/50">Leads do formulário e visitas do site.</p>
          </div>
          <div className="flex items-center gap-2">
            {PERIODOS.map((p) => (
              <button
                key={p}
                onClick={() => setDias(p)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  dias === p ? "bg-orange-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {p}d
              </button>
            ))}
            <button
              onClick={exportar}
              className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/20"
            >
              Exportar CSV
            </button>
          </div>
        </header>

        {isLoading && <p className="text-white/60">Carregando…</p>}
        {error && <p className="text-red-400">Não foi possível carregar os dados.</p>}

        {data && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Card label="Visitas (site)" value={data.site.resumo.visitantes} />
              <Card label="Leads" value={data.totals.leads} />
              <Card label="Qualificados" value={data.totals.qualificados} />
              <Card
                label="Conversão"
                value={
                  data.site.resumo.visitantes > 0
                    ? `${((data.totals.leads / data.site.resumo.visitantes) * 100).toFixed(1)}%`
                    : "—"
                }
              />
            </div>

            <div className="mb-6 grid gap-4 lg:grid-cols-2">
              <Barras titulo="Visitas registradas no site (formulário)" dados={data.viewsPorDia} />
              <Barras titulo="Leads por dia" dados={data.leadsPorDia} />
            </div>

            <h2 className="mb-3 mt-10 text-lg font-semibold">Analytics do site</h2>
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
              <Card label="Visitantes" value={data.site.resumo.visitantes} />
              <Card label="Page views" value={data.site.resumo.pageviews} />
              <Card label="Views por visita" value={data.site.resumo.viewsPorVisita ?? "—"} />
              <Card
                label="Duração da visita"
                value={data.site.resumo.duracao === null ? "—" : `${Math.round(data.site.resumo.duracao)}s`}
              />
              <Card
                label="Taxa de rejeição"
                value={data.site.resumo.bounce === null ? "—" : `${Math.round(data.site.resumo.bounce)}%`}
              />
            </div>

            <div className="mb-6 grid gap-4 lg:grid-cols-2">
              <Barras
                titulo="Visitantes por dia (analytics)"
                dados={data.site.dias.map((d) => ({ dia: d.dia, total: d.visitantes ?? 0 }))}
              />
              <Barras
                titulo="Page views por dia (analytics)"
                dados={data.site.dias.map((d) => ({ dia: d.dia, total: d.pageviews ?? 0 }))}
              />
            </div>

            <div className="mb-6 grid gap-4 lg:grid-cols-2">
              <Lista titulo="Origem" dados={data.site.listas["origem"]} />
              <Lista titulo="Página" dados={data.site.listas["pagina"]} />
              <Lista titulo="Dispositivo" dados={data.site.listas["dispositivo"]} />
              <Lista titulo="País" dados={data.site.listas["pais"]} />
            </div>

            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">Origem do tráfego</h2>
              {data.fontes.length === 0 ? (
                <p className="text-sm text-white/40">Sem dados no período.</p>
              ) : (
                <ul className="space-y-2">
                  {data.fontes.map((f) => (
                    <li key={f.label} className="flex items-center justify-between text-sm">
                      <span className="text-white/80">{f.label}</span>
                      <span className="text-white/50">{f.total}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Empresa</th>
                    <th className="px-4 py-3">Contato</th>
                    <th className="px-4 py-3">Faturamento</th>
                    <th className="px-4 py-3">Investimento</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Origem</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-white/40">
                        Nenhum lead no período.
                      </td>
                    </tr>
                  )}
                  {data.leads.map((l) => (
                    <tr key={l.id} className="border-t border-white/5">
                      <td className="px-4 py-3 text-white/60">
                        {new Date(l.created_at).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">{l.nome ?? "—"}</td>
                      <td className="px-4 py-3">{l.empresa ?? "—"}</td>
                      <td className="px-4 py-3 text-white/70">
                        <div>{l.email ?? "—"}</div>
                        <div className="text-white/45">{l.telefone ?? "—"}</div>
                      </td>
                      <td className="px-4 py-3">{l.faturamento_mensal ?? "—"}</td>
                      <td className="px-4 py-3">{l.faixa_investimento ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            l.qualificado ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/60"
                          }`}
                        >
                          {l.qualificado ? "Qualificado" : "Guia PDF"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/60">{l.utm_source ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
