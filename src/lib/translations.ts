export type Locale = "ru" | "en";

export const translations = {
   ru: {
      nav: {
         home: "Главная",
         skills: "Навыки",
         experience: "Опыт",
      },
      roles: [
         "Frontend-разработчик",
         "UX/UI дизайнер",
         "Мелочи имеют значение",
      ],
      hero: {
         greeting: "Привет, это Егор",
         title: "Я Frontend-разработчик",
         paragraph:
            "У меня обширный опыт в веб-разработке. Я начал свой путь более 9 лет назад. Есть опыт не только во Frontend, но и в Backend разработке. Отличные знания и опыт в UX/UI дизайне. Прошёл огонь и воду с разными командами, а иногда и в одиночку.",
      },
      heroFooter: {
         portfolio: "Портфолио",
      },
      footer: {
         wip: "Сайт в процессе разработки",
      },
   },
   en: {
      nav: {
         home: "Home",
         skills: "Skills",
         experience: "Experience",
      },
      roles: ["Frontend developer", "UX/UI designer", "Small details matter"],
      hero: {
         greeting: "Hi, I'm Egor",
         title: "I'm a Frontend Developer",
         paragraph:
            "I have extensive experience in web development. I started my journey over 9 years ago. I have experience not only in Frontend but also in Backend development. Excellent knowledge and experience in UX/UI design. I've been through thick and thin with various teams, and sometimes on my own.",
      },
      heroFooter: {
         portfolio: "Portfolio",
      },
      footer: {
         wip: "Site is under development",
      },
   },
} as const;
