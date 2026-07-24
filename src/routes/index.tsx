import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import video1 from "@/assets/videos/video1.mp4.asset.json";
import video2 from "@/assets/videos/video2.mp4.asset.json";
import video3 from "@/assets/videos/video3.mp4.asset.json";
import video4 from "@/assets/videos/video4.mp4.asset.json";
import video5 from "@/assets/videos/video5.mp4.asset.json";
import video6 from "@/assets/videos/video6.mp4.asset.json";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jornada 4S | Assessoria de Importação da China" },
      {
        name: "description",
        content:
          "Assessoria completa em importação da China: sourcing, gestão, logística, seguro e desembaraço aduaneiro para empresas que querem importar com segurança e previsibilidade.",
      },
      { property: "og:title", content: "Jornada 4S | Assessoria de Importação da China" },
      {
        property: "og:description",
        content:
          "Importe da China com segurança: sourcing, gestão, logística e desembaraço conduzidos por especialistas.",
      },
    ],
  }),
  component: Index,
});

const WEBHOOK_URL =
  "https://functions-api.clint.digital/endpoints/integration/webhook/cc2d26ac-5471-44af-8b4d-59b0acb92a93";


const NOT_ITEMS = [
  "Tênis","Roupas","Chuteira","Camisas de time","Produtos de Marca",
  "Vinhos","Animais","Celulares","Perfumes","Jogos de Videogame",
];

const FAQS: [string, string][] = [
  ["Qual o melhor produto para começar a importar?","O melhor produto é aquele em que você já tem conhecimento de mercado, fornecedor ou canal de venda. Durante o diagnóstico inicial, nossa equipe analisa viabilidade, margem e demanda para te ajudar a validar — ou ajustar — essa escolha antes de qualquer investimento."],
  ["A Jornada 4S pode importar produtos de marca para mim?","Não. Não realizamos a importação de produtos de marcas registradas como Nike, Adidas, Apple, Xiaomi ou JBL sem autorização do detentor da marca, o que inclui réplicas, camisas de time, celulares, perfumes e jogos licenciados. Trabalhamos apenas com operações dentro da legalidade aduaneira."],
  ["Existe um valor mínimo para contratar a assessoria?","Não há um valor fixo de entrada. O investimento na importação varia conforme o produto, a quantidade e o modal de transporte escolhidos, pontos definidos junto com você durante o diagnóstico."],
  ["Por que pago por uma estimativa de custos antes de importar?","Porque levantar um custo confiável envolve cotação com fornecedores, cálculo de frete, impostos, taxas portuárias e câmbio. É um trabalho técnico que evita que você feche um pedido com base em números irreais e descubra prejuízo só depois do embarque."],
  ["E se a estimativa ficar acima do que eu esperava?","Buscamos alternativas: outros fornecedores, ajustes de especificação, volume ou modal de transporte, até encontrar uma configuração viável dentro da sua margem, sem comprometer a qualidade do produto."],
  ["Em quanto tempo minha carga chega ao Brasil?","Em uma importação formal via modal marítimo, o prazo médio entre a produção e a chegada ao porto brasileiro é de cerca de 90 dias, podendo variar conforme origem, porto de destino e época do ano."],
  ["O que preciso ter para começar a importar com a Jornada 4S?","Você precisa de CNPJ ativo, Radar SISCOMEX habilitado e um produto definido. Se algum desses itens ainda não estiver pronto, nossa equipe orienta a regularização durante o processo de diagnóstico."],
];

const TESTI: [string, string, string][] = [
  ["Renato Faustino","Nicoboco Surf School","O processo foi bem rápido, recomendo muito para quem necessita importar."],
  ["Luís Júnior","Comunix RH","Com a 4S, você tem todo um acompanhamento sobre cada etapa da sua importação, isso traz segurança."],
  ["Luís Júnior","Infocell Celulares","A equipe coloca o mercado chinês mais próximo da minha empresa."],
  ["Wolney Cyrillo","Academia W2","Estou feliz demais, todos os nossos aparelhos chegaram em perfeito estado. Pode confiar."],
];

const SERVICES = [
  { img: "https://importacao4s.lovable.app/assets/service-sourcing-B4cy0-UW.jpg", title: "Sourcing Internacional", desc: "Mapeamos e auditamos fornecedores na China para o melhor equilíbrio entre preço, qualidade e prazo." },
  { img: "https://importacao4s.lovable.app/assets/service-consulting-gnfKYHXs.jpg", title: "Gestão da Importação", desc: "Negociação, contratos, documentação e comunicação com fornecedores conduzidos pela nossa equipe." },
  { img: "https://importacao4s.lovable.app/assets/service-logistics-DW_tWhk-.jpg", title: "Logística de Ponta a Ponta", desc: "Follow-up de produção, transporte marítimo e coordenação com despachantes até a entrega no Brasil." },
  { img: "https://importacao4s.lovable.app/assets/service-customs-3iHe8vBX.jpg", title: "Seguro & Conformidade", desc: "Seguro de carga internacional e adequação fiscal e aduaneira para reduzir riscos da operação." },
];

const PRODUCTS = [
  { img: "https://importacao4s.lovable.app/assets/product-kitchen-B92Fsfwx.jpg", title: "Itens de Cozinha", desc: "Linha completa de utensílios e acessórios com excelente custo-benefício para o varejo." },
  { img: "https://importacao4s.lovable.app/assets/product-machinery-z3ctZ7Ix.jpg", title: "Maquinários", desc: "Equipamentos industriais para empresas que buscam ganho de produtividade." },
  { img: "https://importacao4s.lovable.app/assets/product-gym-qz3O5-86.jpg", title: "Aparelhos de Academia", desc: "Equipamentos fitness com forte demanda e margens atrativas no mercado nacional." },
  { img: "https://importacao4s.lovable.app/assets/product-autoparts-CCAunTiK.jpg", title: "Autopeças", desc: "Peças e acessórios automotivos, um dos segmentos com maior crescimento na importação da China." },
];

function sanitizeUTM(v: string | null) {
  if (!v) return "n/a";
  const s = String(v).trim().substring(0, 200);
  return s || "n/a";
}

function getUTMs() {
  if (typeof window === "undefined") {
    return { utm_source: "n/a", utm_medium: "n/a", utm_campaign: "n/a", utm_term: "n/a", utm_content: "n/a" };
  }
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: sanitizeUTM(p.get("utm_source")),
    utm_medium: sanitizeUTM(p.get("utm_medium")),
    utm_campaign: sanitizeUTM(p.get("utm_campaign")),
    utm_term: sanitizeUTM(p.get("utm_term")),
    utm_content: sanitizeUTM(p.get("utm_content")),
  };
}

type LeadStatus = { kind: "idle" | "ok" | "err"; text: string };

async function submitLead(form: HTMLFormElement, includeInstagram: boolean) {
  const fd = new FormData(form);
  const payload = {
    nome: fd.get("nome")?.toString().trim(),
    empresa: fd.get("empresa")?.toString().trim() || "",
    email: fd.get("email")?.toString().trim(),
    telefone: fd.get("telefone")?.toString().trim(),
    instagram: includeInstagram ? (fd.get("instagram")?.toString().trim() || "") : "",
    cnpj: fd.get("cnpj")?.toString().trim() || "",
    area_fornecedor: fd.get("area_fornecedor")?.toString().trim() || "",
    faixa_investimento: fd.get("faixa_investimento"),
    origem: "site-4s-comex-assessoria",
    enviado_em: new Date().toISOString(),
    ...getUTMs(),
  };
  await fetch(WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inlineStatus, setInlineStatus] = useState<LeadStatus>({ kind: "idle", text: "" });
  const [modalStatus, setModalStatus] = useState<LeadStatus>({ kind: "idle", text: "" });
  const [inlineLoading, setInlineLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const openLead = () => setModalOpen(true);
  const closeLead = () => setModalOpen(false);
  const scrollToDiagnostico = () => {
    document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  const onInlineSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const cnpj = new FormData(form).get("cnpj")?.toString();
    if (cnpj !== "Sim") {
      setInlineStatus({ kind: "err", text: "Para prosseguir, é necessário possuir CNPJ." });
      return;
    }
    setInlineLoading(true);
    try {
      await submitLead(form, false);
      setInlineStatus({ kind: "ok", text: "Recebemos seu contato! Nossa equipe falará com você em breve." });
      form.reset();
    } catch {
      setInlineStatus({ kind: "err", text: "Erro ao enviar. Tente novamente." });
    } finally {
      setInlineLoading(false);
    }
  };

  const onModalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const cnpj = new FormData(form).get("cnpj")?.toString();
    if (cnpj !== "Sim") {
      setModalStatus({ kind: "err", text: "Para prosseguir, é necessário possuir CNPJ." });
      return;
    }
    setModalLoading(true);
    try {
      await submitLead(form, true);
      setModalStatus({ kind: "ok", text: "Recebemos seu contato! Nossa equipe falará com você em breve." });
      form.reset();
      setTimeout(() => setModalOpen(false), 1800);
    } catch {
      setModalStatus({ kind: "err", text: "Erro ao enviar. Tente novamente." });
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white antialiased main-bg"
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundAttachment: "fixed",
      }}
    >
      <style>{`
        .main-bg {
          background: linear-gradient(180deg, #0E1331 0%, #0D1128 30%, #11101E 60%, #0E1331 100%);
        }
        @media (max-width: 768px) {
          .main-bg {
            background: linear-gradient(180deg, #0E1331 0%, #0D1128 40%, #11101E 70%, #0E1331 100%);
          }
        }
        h1,h2,h3,h4 { font-family: 'Poppins', sans-serif; }
        html { scroll-behavior: smooth; }
        .text-gradient-gold { background: linear-gradient(135deg,#FF8B3D 0%,#F96706 50%,#C44C00 100%); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .bg-gold-grad { background: linear-gradient(135deg,#F96706 0%,#C44C00 100%); }
        .shadow-gold { box-shadow: 0 8px 30px -4px rgba(249,103,6,.45); }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .animate-marquee { animation: marquee 20s linear infinite; }
        details[open] summary .chev { transform: rotate(180deg); }
        details summary::-webkit-details-marker { display:none; }
      `}</style>

      {/* URGENCY BAR */}
      <div className="sticky top-0 z-50 bg-[#F96706] text-center py-2.5 px-4">
        <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-wide">
          PARA EMPRESAS QUE VÃO IMPORTAR ACIMA DE 100 MIL
        </p>
      </div>


      {/* LEAD FORM INLINE */}
      <section id="diagnostico" className="pt-10 pb-16 sm:pt-14 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-lg mx-auto mb-8 flex items-center justify-center gap-3 bg-[#0A1628] border border-white/10 rounded-2xl px-6 py-4">
            <img src="/logo-4s.png" alt="Logo Jornada 4S" className="h-9 sm:h-11 w-auto shrink-0 rounded-xl" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight">
              Sua importação da<br />China começa aqui.
            </h2>
          </div>
          <div className="max-w-lg mx-auto bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <form onSubmit={onInlineSubmit} className="space-y-4">
              <p className="text-[#FF8B3D] text-xs font-bold uppercase tracking-wider border-b border-white/10 pb-2.5">Seus dados</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nome completo" name="nome" placeholder="Seu nome" required />
                <Field label="Nome da empresa" name="empresa" placeholder="Nome da empresa" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="WhatsApp" name="telefone" type="tel" placeholder="(00) 00000-0000" required />
                <Field label="E-mail" name="email" type="email" placeholder="seu@email.com" required />
              </div>
              <p className="text-[#FF8B3D] text-xs font-bold uppercase tracking-wider border-b border-white/10 pb-2.5 pt-2">Sobre você</p>
              <div>
                <Label>Você possui CNPJ?</Label>
                <DarkSelect name="cnpj" required>
                  <option value="">Selecione uma opção</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </DarkSelect>
              </div>
              <div>
                <Label>Qual área representa melhor o tipo de fornecedor que você procura?</Label>
                <DarkSelect name="area_fornecedor" required>
                  <option value="">Selecione uma área</option>
                  <option value="Insumos e Matéria-prima para a indústria">Insumos e Matéria-prima para a indústria</option>
                  <option value="Máquinas e Equipamentos">Máquinas e Equipamentos</option>
                  <option value="Eletrônicos e Tecnologia">Eletrônicos e Tecnologia</option>
                  <option value="Itens para Varejo">Itens para Varejo</option>
                  <option value="Outros">Outros</option>
                </DarkSelect>
              </div>
              <div>
                <Label>Qual o valor que pretende investir?</Label>
                <DarkSelect name="faixa_investimento" required>
                  <option value="">Selecione uma faixa</option>
                  <option value="75 - 100 mil">75 - 100 mil</option>
                  <option value="100 - 200 mil">100 - 200 mil</option>
                  <option value="Acima de 200 mil">Acima de 200 mil</option>
                </DarkSelect>
              </div>
              <button type="submit" disabled={inlineLoading} className="w-full bg-[#F96706] hover:bg-[#C44C00] disabled:opacity-60 text-white font-bold py-4 rounded-lg shadow-gold uppercase tracking-wide text-sm mt-2 transition-colors">
                {inlineLoading ? "Enviando..." : "Enviar"}
              </button>
              {inlineStatus.kind !== "idle" && (
                <p className={`text-sm text-center ${inlineStatus.kind === "ok" ? "text-green-400" : "text-red-400"}`}>{inlineStatus.text}</p>
              )}
              <p className="text-white/30 text-xs text-center flex items-center justify-center gap-1.5">🔒 Seus dados estão protegidos. Sem spam.</p>
            </form>
          </div>
        </div>
      </section>

      {/* CLIENT VIDEOS CAROUSEL */}
      <section className="pb-8 sm:pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <ClientVideosCarousel />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <span className="inline-block text-[#FF8B3D] font-semibold text-sm uppercase tracking-wider mb-3">● Quem Somos</span>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 text-white">Mais do que uma assessoria: um parceiro operacional para a sua importação.</h2>
              <p className="text-white/70 leading-relaxed mb-6 text-sm sm:text-base">
                Com mais de 20 anos de experiência no comércio exterior brasileiro, a Jornada 4S conecta sua empresa aos melhores fornecedores da China e assume, na prática, a gestão da sua importação — da cotação ao desembaraço aduaneiro. Enquanto você foca no seu negócio, nossa equipe cuida de cada etapa da operação.
              </p>
              <a href="#diagnostico" className="inline-block border-2 border-white/40 text-white hover:bg-white hover:text-[#1E0E08] font-semibold px-6 py-3 rounded-lg transition-colors">CONHEÇA NOSSOS SERVIÇOS</a>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img src="https://importacao4s.lovable.app/assets/about-ship-AOM8hCww.jpg" alt="Navio cargueiro no porto" className="w-full h-64 sm:h-80 lg:h-96 object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-14 max-w-2xl">
            <span className="inline-block text-[#FF8B3D] font-semibold text-sm uppercase tracking-wider mb-3">● Diferenciais</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Importar da China <span className="text-white/40">por conta própria</span> ou <span className="text-gradient-gold">com a Jornada 4S?</span>
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <span className="inline-block text-white/40 text-xs font-bold uppercase tracking-widest mb-5">Sem assessoria</span>
              <ul className="space-y-3.5">
                {[
                  "Negociação direta com fornecedores chineses, sem domínio do idioma e da cultura de negócios local",
                  "Risco de pagar por fornecedores não auditados e receber produto fora do combinado",
                  "Toda a parte documental, cambial e fiscal concentrada na sua equipe",
                  "Pouca visibilidade da operação até a carga chegar ao porto",
                  "Erros de classificação fiscal podem gerar multa, retenção ou perda da carga",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                    <span className="text-white/60 text-sm leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative bg-white/5 border-2 border-[#F96706] rounded-2xl p-6 sm:p-8 shadow-gold backdrop-blur-sm">
              <span className="absolute -top-3 right-6 bg-gold-grad text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Caminho recomendado</span>
              <span className="inline-block text-[#FF8B3D] text-xs font-bold uppercase tracking-widest mb-5">Com a Jornada 4S</span>
              <ul className="space-y-3.5">
                {[
                  "Equipe especializada negocia diretamente com fábricas e fornecedores auditados",
                  "Sourcing com controle de qualidade e amostras antes do embarque",
                  "Documentação, câmbio e desembaraço conduzidos pela nossa equipe",
                  "Acompanhamento etapa a etapa, com relatórios de status da operação",
                  "Classificação fiscal correta, dentro da legislação aduaneira vigente",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="text-[#FF8B3D] shrink-0 mt-0.5">✓</span>
                    <span className="text-white text-sm leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 text-center">
            <button onClick={scrollToDiagnostico} className="bg-[#F96706] hover:bg-[#C44C00] text-white font-bold px-8 py-4 rounded-lg shadow-gold transition-colors">Quero falar com um especialista!</button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicos" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-14">
            <span className="inline-block text-[#FF8B3D] font-semibold text-sm uppercase tracking-wider mb-3">● Serviços</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Uma assessoria pensada para a sua operação, do início ao fim.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s) => (
              <div key={s.title} className="group rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#F96706]/40 backdrop-blur-sm transition-all">
                <div className="h-48 overflow-hidden"><img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                <div className="p-5">
                  <h3 className="font-semibold mb-1.5 text-white">{s.title}</h3>
                  <p className="text-sm text-white/60">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={scrollToDiagnostico} className="bg-[#F96706] hover:bg-[#C44C00] text-white font-bold px-8 py-4 rounded-lg shadow-gold transition-colors">Quero falar com um especialista!</button>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="processo" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-14">
            <span className="inline-block text-[#FF8B3D] font-semibold text-sm uppercase tracking-wider mb-3">● Como Funciona</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Do diagnóstico à entrega: nosso processo em <span className="text-gradient-gold">4 etapas.</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              ["1","Diagnóstico & Sourcing","Avaliamos seu produto, mapeamos fornecedores e fábricas qualificadas na China e levantamos as melhores condições de preço e prazo."],
              ["2","Negociação & Gestão","Cuidamos de toda a negociação, contratos, amostras e comunicação com os fornecedores chineses em seu nome."],
              ["3","Follow-up & Embarque","Acompanhamento detalhado da produção e do controle de qualidade até o embarque e transporte marítimo."],
              ["4","Desembaraço & Entrega","Conduzimos toda a parte fiscal e aduaneira para que sua carga chegue sem problemas até o seu endereço."],
            ].map(([n, t, d]) => (
              <div key={n}>
                <span className="text-6xl font-bold block mb-2 text-gradient-gold">{n}</span>
                <h3 className="text-xl font-bold text-white mb-3">{t}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-14">
            <span className="inline-block text-[#FF8B3D] font-semibold text-sm uppercase tracking-wider mb-3">● Segmentos</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Setores em que a Jornada 4S já atua</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p) => (
              <div key={p.title} className="group relative rounded-2xl overflow-hidden h-80 ring-1 ring-white/10">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1331] via-[#0E1331]/40 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{p.title}</h3>
                  <p className="text-white/70 text-sm">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={scrollToDiagnostico} className="bg-[#F96706] hover:bg-[#C44C00] text-white font-bold px-8 py-4 rounded-lg shadow-gold transition-colors">Quero falar com um especialista!</button>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <span className="inline-block text-[#FF8B3D] font-semibold text-sm uppercase tracking-wider mb-3">● Clientes</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Empresas que confiam na Jornada 4S</h2>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {["Petz","Maxfix","Deceuninck","Omega Importadora","Eletromidia"].map((c) => (
              <div key={c} className="bg-white/5 border border-white/10 rounded-xl px-8 py-5 backdrop-blur-sm">
                <span className="font-bold text-lg text-white">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOT IMPORT */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div>
              <span className="inline-block text-red-400 font-semibold text-sm uppercase tracking-wider mb-3">● Fora do nosso escopo</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Confira os produtos que <span className="text-red-400">não fazem parte da nossa assessoria.</span></h2>
              <p className="text-white/60 text-sm sm:text-base">Atendemos exclusivamente empresas com CNPJ ativo. Por questões de marca, regulação e risco fiscal, os itens abaixo estão fora do nosso escopo de atuação.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {NOT_ITEMS.map((i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                  <span className="text-red-400">✕</span>
                  <span className="text-white/80 text-sm font-medium">{i}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <button onClick={scrollToDiagnostico} className="bg-[#F96706] hover:bg-[#C44C00] text-white font-bold px-8 py-4 rounded-lg shadow-gold transition-colors">Quero falar com um especialista!</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="mb-10">
            <span className="inline-block text-[#FF8B3D] font-semibold text-sm uppercase tracking-wider mb-3">● FAQ</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Perguntas Frequentes</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className="bg-white/5 border border-white/10 rounded-xl px-5 backdrop-blur-sm group">
                <summary className="cursor-pointer list-none flex justify-between items-center py-4 font-semibold text-sm sm:text-base text-white">
                  <span>{q}</span>
                  <span className="chev transition-transform text-[#FF8B3D]">▼</span>
                </summary>
                <div className="text-white/70 text-sm pb-4 leading-relaxed">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-[#FF8B3D] font-semibold text-sm uppercase tracking-wider mb-3">● Depoimentos</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Empresas que já transformaram sua operação de importação com a Jornada 4S.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {TESTI.map(([n, r, t]) => (
              <div key={n + r} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-[#FF8B3D] mb-3">★★★★★</div>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">{t}</p>
                <p className="font-semibold text-white text-sm">{n}</p>
                <p className="text-white/50 text-xs">{r}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={scrollToDiagnostico} className="bg-[#F96706] hover:bg-[#C44C00] text-white font-bold px-8 py-4 rounded-lg shadow-gold transition-colors">Quero falar com um especialista!</button>
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section id="contact" className="py-16 lg:py-24">
        <div className="overflow-hidden mb-12">
          <div className="flex animate-marquee whitespace-nowrap">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="mx-10 text-sm font-bold tracking-[0.25em] uppercase text-white/80">
                {i % 2 === 0 ? "JORNADA 4S" : "ASSESSORIA DE IMPORTAÇÃO"}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <img src="https://importacao4s.lovable.app/assets/logo-footer-CKZfiSSJ.png" alt="Jornada 4S" className="h-12 w-auto mb-4" />
              <p className="text-white/50 text-sm">Assessoria completa em importação da China para o seu negócio.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Endereço</h4>
              <p className="text-white/60 text-sm">📍 Praça Antônio Teles, 12 - Andar 8 - Centro, Santos - SP</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Contato</h4>
              <p className="text-white/60 text-sm mb-2">📞 +55 (13) 99130-9727</p>
              <p className="text-white/60 text-sm">✉ jornada4s@gmail.com</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Menu</h4>
              <div className="space-y-2">
                {[["#diagnostico","Início"],["#about","Quem somos"],["#diferenciais","Diferenciais"],["#servicos","Serviços"],["#contact","Contato"]].map(([h,l]) => (
                  <a key={h} href={h} className="block text-white/60 hover:text-[#FF8B3D] text-sm">{l}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs">© 2024 Jornada 4S — Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* LEAD MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0E1331]/70 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeLead(); }}
        >
          <div className="bg-[#1E0E08] border border-white/10 text-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
            <button onClick={closeLead} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl leading-none">×</button>
            <h3 className="text-2xl font-bold mb-1 text-white">Agende seu diagnóstico gratuito</h3>
            <p className="text-sm text-white/60 mb-5">Preencha os dados abaixo e nossa equipe entrará em contato em até 1 dia útil.</p>
            <form onSubmit={onModalSubmit} className="space-y-4">
              <Field label="Nome" name="nome" required />
              <Field label="Nome da empresa" name="empresa" placeholder="Nome da empresa" required />
              <Field label="E-mail" name="email" type="email" required />
              <Field label="Telefone" name="telefone" type="tel" placeholder="(00) 00000-0000" required />
              <Field label="Site ou Instagram da empresa" name="instagram" placeholder="@suaempresa ou seusite.com.br" />
              <div>
                <Label>Você possui CNPJ?</Label>
                <DarkSelect name="cnpj" required>
                  <option value="">Selecione uma opção</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </DarkSelect>
              </div>
              <div>
                <Label>Qual área representa melhor o tipo de fornecedor que você procura?</Label>
                <DarkSelect name="area_fornecedor" required>
                  <option value="">Selecione uma área</option>
                  <option value="Insumos e Matéria-prima para a indústria">Insumos e Matéria-prima para a indústria</option>
                  <option value="Máquinas e Equipamentos">Máquinas e Equipamentos</option>
                  <option value="Eletrônicos e Tecnologia">Eletrônicos e Tecnologia</option>
                  <option value="Itens para Varejo">Itens para Varejo</option>
                  <option value="Outros">Outros</option>
                </DarkSelect>
              </div>
              <div>
                <Label>Qual o valor que pretende investir na importação?</Label>
                <DarkSelect name="faixa_investimento" required>
                  <option value="">Selecione uma faixa</option>
                  <option value="75 - 100 mil">75 - 100 mil</option>
                  <option value="100 - 200 mil">100 - 200 mil</option>
                  <option value="Acima de 200 mil">Acima de 200 mil</option>
                </DarkSelect>
              </div>
              <button type="submit" disabled={modalLoading} className="w-full bg-[#F96706] hover:bg-[#C44C00] disabled:opacity-60 text-white font-bold py-4 rounded-lg shadow-gold transition-colors">
                {modalLoading ? "Enviando..." : "QUERO MEU DIAGNÓSTICO"}
              </button>
              {modalStatus.kind !== "idle" && (
                <p className={`text-sm text-center ${modalStatus.kind === "ok" ? "text-green-400" : "text-red-400"}`}>{modalStatus.text}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wide">
      {children} <span className="text-[#FF8B3D]">*</span>
    </label>
  );
}

function Field({
  label, name, type = "text", placeholder, required,
}: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-[#FF8B3D]">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={180}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/15 text-white placeholder-white/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F96706] focus:border-[#F96706]"
      />
    </div>
  );
}

function DarkSelect({
  name, required, children,
}: { name: string; required?: boolean; children: React.ReactNode }) {
  return (
    <select
      name={name}
      required={required}
      className="w-full bg-white/5 border border-white/15 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F96706] focus:border-[#F96706] [&>option]:bg-[#1E0E08] [&>option]:text-white"
    >
      {children}
    </select>
  );
}

const CLIENT_VIDEOS = [video1.url, video2.url, video3.url, video4.url, video5.url, video6.url];

function ClientVideosCarousel() {
  const loop = [...CLIENT_VIDEOS, ...CLIENT_VIDEOS];
  return (
    <div className="mt-12">
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex gap-5 w-max animate-marquee-x">
          {loop.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="shrink-0 w-[240px] sm:w-[260px] aspect-[9/16] bg-[#0E1331] rounded-2xl overflow-hidden border border-white/10 shadow-lg"
            >
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee-x { animation: marquee-x 20s linear infinite; }
        @media (max-width: 640px) {
          .animate-marquee-x { animation: marquee-x 10s linear infinite; }
        }
      `}</style>
    </div>
  );
}
