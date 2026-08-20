import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";


export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Obrigado | Jornada 4S" },
      {
        name: "description",
        content:
          "Recebemos seu contato. A equipe Jornada 4S entrará em breve para apoiar sua importação da China.",
      },
      { property: "og:title", content: "Obrigado | Jornada 4S" },
      {
        property: "og:description",
        content:
          "Recebemos seu contato. A equipe Jornada 4S entrará em breve para apoiar sua importação da China.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ObrigadoPage,
});

function ObrigadoPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && "dataLayer" in window && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "lead_gerado" });
    }
  }, []);


  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center text-white antialiased"
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(180deg, #0E1331 0%, #0D1128 40%, #11101E 70%, #0E1331 100%)",
      }}
    >
      <div className="max-w-xl mx-auto">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/30">
          <svg
            className="w-10 h-10 text-emerald-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          Obrigado pelo interesse!
        </h1>
        <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
          Recebemos suas informações com sucesso. Nossa equipe especializada vai analisar seu perfil e
          entrar em contato em breve para dar o próximo passo na sua importação da China.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://www.instagram.com/jornada4s"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-105 hover:shadow-orange-500/30"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Siga @jornada4s no Instagram
          </a>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-medium text-white transition-colors hover:bg-white/10"
          >
            Voltar para o site
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/50">
          Enquanto isso, acompanhe conteúdos exclusivos sobre importação da China.
        </p>
      </div>
    </div>
  );
}
