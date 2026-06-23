import { BASE_PATH } from "@/lib/base-path";

export type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  image?: string;
  technologies: string[];
  accent: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "The FIVE",
    category: "E-commerce Conceitual",
    description:
      "Projeto com proposta inspirada no universo do e-commerce, pensado para apresentar uma experiencia mais comercial, organizada e visualmente envolvente. O conceito valoriza a identidade do grupo e a distribuicao estrategica de cada participante na construcao do produto.",
    image: `${BASE_PATH}/images/five.png`,
    technologies: ["HTML", "CSS", "JavaScript"],
    accent: "from-violet-500/30 via-fuchsia-400/10 to-transparent"
  },
  {
    id: 2,
    title: "Notas",
    category: "Projeto Academico",
    description:
      "Aplicacao criada na disciplina de Autoria Web com foco em clareza de interface, fluxo intuitivo e organizacao de informacoes. O resultado reforca fundamentos de front-end e uma apresentacao mais consistente para uso academico.",
    technologies: ["HTML", "CSS", "UX Basico"],
    accent: "from-indigo-500/25 via-violet-400/10 to-transparent"
  },
  {
    id: 3,
    title: "Login",
    category: "Desafio de Interface",
    description:
      "Tela de login desenvolvida como exercicio pratico para consolidar hierarquia visual, estrutura de formularios e equilibrio de espacamentos. Um estudo direto, mas importante, para evoluir a apresentacao de interfaces web.",
    image: `${BASE_PATH}/images/login.png`,
    technologies: ["HTML", "CSS", "Layout Responsivo"],
    accent: "from-purple-500/25 via-sky-400/10 to-transparent"
  },
  {
    id: 4,
    title: "Cook It",
    category: "Receitas com IA",
    description:
      "Aplicativo inteligente que sugere receitas personalizadas com base nos ingredientes disponíveis em casa. Com inteligência artificial generativa, transforma qualquer geladeira em uma cozinha criativa, reduzindo o desperdício e tornando o dia a dia mais saboroso.",
    image: `${BASE_PATH}/images/cook-it.png`,
    technologies: ["React Native", "Gemini API", "TypeScript"],
    accent: "from-orange-400/30 via-amber-300/10 to-transparent"
  },
  {
    id: 5,
    title: "Mandacaru",
    category: "Hackathon · IA & Agentes Autônomos",
    description:
      "Assistente de IA autônomo idealizado para apoiar agricultores familiares do semiárido nordestino, integrando APIs meteorológicas e LLM para gerar recomendações personalizadas de cultivo e manejo.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "LLM", "Vercel"],
    accent: "from-emerald-400/30 via-teal-300/10 to-transparent"
  },
  {
    id: 6,
    title: "Patos Quest",
    category: "Jogo · Acessibilidade",
    description:
      "Jogo desenvolvido na engine Godot abordando os desafios de acessibilidade e inclusão social na cidade de Patos, PB, transformando um tema social em uma experiência jogável e educativa.",
    technologies: ["Godot", "GDScript", "Game Design"],
    accent: "from-sky-400/30 via-blue-300/10 to-transparent"
  },
  {
    id: 7,
    title: "Gap Bridge",
    category: "Jogo de Plataforma · Projeto Pessoal",
    description:
      "Jogo de plataforma desenvolvido na engine Unity, com foco em mecânicas de física e timing precisos para criar desafios de movimentação fluidos e recompensadores.",
    technologies: ["Unity", "C#", "Game Design"],
    accent: "from-rose-400/30 via-pink-300/10 to-transparent"
  }
];
