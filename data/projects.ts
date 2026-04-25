export type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
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
    image: "/images/five.png",
    technologies: ["HTML", "CSS", "JavaScript"],
    accent: "from-violet-500/30 via-fuchsia-400/10 to-transparent"
  },
  {
    id: 2,
    title: "Notas",
    category: "Projeto Academico",
    description:
      "Aplicacao criada na disciplina de Autoria Web com foco em clareza de interface, fluxo intuitivo e organizacao de informacoes. O resultado reforca fundamentos de front-end e uma apresentacao mais consistente para uso academico.",
    image: "/images/notas.png",
    technologies: ["HTML", "CSS", "UX Basico"],
    accent: "from-indigo-500/25 via-violet-400/10 to-transparent"
  },
  {
    id: 3,
    title: "Login",
    category: "Desafio de Interface",
    description:
      "Tela de login desenvolvida como exercicio pratico para consolidar hierarquia visual, estrutura de formularios e equilibrio de espacamentos. Um estudo direto, mas importante, para evoluir a apresentacao de interfaces web.",
    image: "/images/login.png",
    technologies: ["HTML", "CSS", "Layout Responsivo"],
    accent: "from-purple-500/25 via-sky-400/10 to-transparent"
  },
  {
    id: 4,
    title: "Cook It",
    category: "Receitas com IA",
    description:
      "Aplicativo inteligente que sugere receitas personalizadas com base nos ingredientes disponíveis em casa. Com inteligência artificial generativa, transforma qualquer geladeira em uma cozinha criativa, reduzindo o desperdício e tornando o dia a dia mais saboroso.",
    image: "/images/cook-it.png",
    technologies: ["React Native", "Gemini API", "TypeScript"],
    accent: "from-orange-400/30 via-amber-300/10 to-transparent"
  }
];
