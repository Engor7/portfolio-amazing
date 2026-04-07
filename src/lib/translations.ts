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
      skills: {
         title: "Навыки",
         paragraph:
            "Знать все на свете невозможно, однако современный Frontend-разработчик должен оставаться гибким, способным усваивать новые технологии. Сегодня, когда веб разработка стремится к универсальности во всем, быстрое погружение и применение мощных инструментов становится не самой сложной задачей.",
         frontend: "Frontend",
         webDev: "Web development",
         design: "Дизайн и UI/UX",
         other: "Другие навыки",
         crossBrowser: "Кроссбраузерная и адаптивная верстка",
         oop: "ООП",
         prototyping: "Прототипирование",
         uxPrinciples: "Принципы UX\\UI",
         adaptiveErgonomics: "Эргономика адаптивного веб интерфейса",
         bem: "БЭМ",
         seoBasics: "Основы SEO",
         designTheory: "Теория дизайна",
         artHistory: "История искусств",
         identity: "Айдентика",
         colorTheory: "Теория цвета",
         photography: "Фотография",
         colorCorrection: "Цветокоррекция",
         retouching: "Ретушь",
         touchTyping: "Слепой метод печати",
      },
      experience: {
         title: "Опыт",
         paragraph:
            "Мой общий опыт веб-разработки свыше 8 лет. Интерес к программированию, и к вебу в частности, возник еще в школьные годы.",
         ecos: {
            role: "Frontend-разработчик",
            period: "Июнь 2024 — Декабрь 2025 (1 год и 7 месяцев)",
            p1: "Отвечал за разработку Telegram Mini App — построение архитектуры приложения, создание дизайн-системы и интерфейсов.",
            p2: "Приложение предназначено для покупки и аренды ASIC-майнеров, с возможностью пополнения средств различными способами: через банк, переводами в TON и Bitcoin. Реализовал оплату в TON и через Telegram Start App.",
            functionality: "Функциональность включала:",
            li1: "Дашборд и мониторинг активов, статистику доходов;",
            li2: "Реферальную программу и личный кабинет с настройкой профиля;",
            li3: "Калькуляторы доходности и маркетплейс оборудования;",
            li4: "Авторизацию, регистрацию, восстановление пароля и 2FA-аутентификацию;",
            li5: "Мультиязычность, поддержку светлой и тёмной темы.",
            backoffice:
               "Также разрабатывал Backoffice — админ-панель для управления инфраструктурой всех проектов компании:",
            bo1: "Настройка баннеров на сайте и в приложении, управление сторис и товарами (в том числе продажей ASIC-ов);",
            bo2: "Редактор расчётных параметров калькулятора доходности;",
            bo3: "Собственный UI Kit и библиотека компонентов, выдержанные в общей стилистике компании;",
            bo4: "Мультиязычность, светлая/тёмная тема, авторизация и разграничение прав доступа администраторов.",
            wordpress:
               "Также создавал новые страницы и поддерживал текущий функционал на WordPress. Иногда занимался поддержкой на бэкенде (Node.js, Nest.js, PHP).",
         },
         cityads: {
            role: "Frontend-разработчик",
            period: "Март 2024 — Сентябрь 2024 (7 месяцев)",
            p1: "Занимался разработкой и поддержкой сайтов на Nuxt 3. Один из ключевых - страница с промокодами для Т-банка. Участвовал в создании систем промокодов для клиентов по всему миру.",
            p2: "Кроме того, разрабатывал браузерные расширения для Chrome и Firefox, создавал сайт с отзывами и работал над проектом формата маркетплейса. Основные задачи включали разработку пользовательских интерфейсов, интеграцию с API и оптимизацию производительности фронтенда.",
         },
         openSchool: {
            name: "Образовательная онлайн-платформа «Открытая школа»",
            role: "Frontend-разработчик, Дизайнер",
            period: "Февраль 2023 — Январь 2024 (1 год)",
            p1: "Занимался поддержкой существующей версии платформы и разработкой новой, включая полный редизайн интерфейса. Работал над адаптивной вёрсткой сложных Vue-компонентов, интеграцией с API и обработкой данных.",
            p2: "Участвовал в прототипировании новых страниц и создании дизайна в рамках новой дизайн-системы платформы. Среди наиболее интересных задач - разработка видео и аудиоплеера, текстового редактора, а также календарей и интерактивных таблиц для работы с данными.",
         },
         freelance: {
            name: "Частная практика",
            role: "Frontend-разработчик, Fullstack",
            period: "Март 2017 — Декабрь 2022 (5 лет и 10 месяцев)",
            p1: "Занимался вёрсткой адаптивных сайтов различной сложности и разработкой проектов под CMS WordPress и Bitrix. В общей сложности создал более 60 сайтов за чуть более чем 5 лет работы.",
            p2: "Помимо CMS-решений, разрабатывал собственный движок на PHP, а также работал с Node.js - создавал серверную логику. Сотрудничал преимущественно с частными клиентами, а также с веб-студиями и компаниями.",
         },
         closing:
            "Часть моего опыта была получена в процессе разработки веб-приложений, движимой не коммерческими интересами, а любопытством. Особое удовлетворение для меня — осознание, что мне удалось создать программное решение, которое ранее казалось сложным.",
      },
      heroFooter: {
         portfolio: "Портфолио",
      },
      readMore: {
         expand: "Читать полностью",
         collapse: "Свернуть",
      },
      footer: {
         wip: "Сайт в процессе разработки",
      },
      notFound: {
         title: "Страница не найдена",
         description:
            "Кажется, такой страницы нет. Возможно, она была перемещена, удалена или просто никогда не существовала.",
         start: "Нажмите или коснитесь, чтобы начать игру",
         win: "Вы победили!",
         restart: "Нажмите, чтобы сыграть снова",
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
      skills: {
         title: "Skills",
         paragraph:
            "It's impossible to know everything, but a modern Frontend developer must stay flexible and able to absorb new technologies. Today, as web development strives for universality in everything, quickly diving into and applying powerful tools is not the hardest task.",
         frontend: "Frontend",
         webDev: "Web development",
         design: "Design & UI/UX",
         other: "Other skills",
         crossBrowser: "Cross-browser & responsive layout",
         oop: "OOP",
         prototyping: "Prototyping",
         uxPrinciples: "UX\\UI principles",
         adaptiveErgonomics: "Responsive web interface ergonomics",
         bem: "BEM",
         seoBasics: "SEO basics",
         designTheory: "Design theory",
         artHistory: "Art history",
         identity: "Brand identity",
         colorTheory: "Color theory",
         photography: "Photography",
         colorCorrection: "Color correction",
         retouching: "Retouching",
         touchTyping: "Touch typing",
      },
      experience: {
         title: "Experience",
         paragraph:
            "My overall web development experience spans over 8 years. My interest in programming, and web development in particular, started back in my school years.",
         ecos: {
            role: "Frontend Developer",
            period: "June 2024 — December 2025 (1 year and 7 months)",
            p1: "Responsible for developing a Telegram Mini App — building the application architecture, creating a design system and interfaces.",
            p2: "The app is designed for purchasing and renting ASIC miners, with the ability to top up funds in various ways: via bank transfer, TON and Bitcoin. Implemented TON payments and Telegram Start App integration.",
            functionality: "Functionality included:",
            li1: "Dashboard and asset monitoring, income statistics;",
            li2: "Referral program and personal account with profile settings;",
            li3: "Profitability calculators and equipment marketplace;",
            li4: "Authorization, registration, password recovery and 2FA authentication;",
            li5: "Multi-language support, light and dark theme.",
            backoffice:
               "Also developed Backoffice — an admin panel for managing the infrastructure of all company projects:",
            bo1: "Website and app banner management, stories and product management (including ASIC sales);",
            bo2: "Profitability calculator parameter editor;",
            bo3: "Custom UI Kit and component library, consistent with the company's overall style;",
            bo4: "Multi-language support, light/dark theme, authorization and admin access control.",
            wordpress:
               "Also created new pages and maintained existing functionality on WordPress. Occasionally worked on backend support (Node.js, Nest.js, PHP).",
         },
         cityads: {
            role: "Frontend Developer",
            period: "March 2024 — September 2024 (7 months)",
            p1: "Developed and maintained websites on Nuxt 3. One of the key projects was a promo code page for T-Bank. Participated in building promo code systems for clients worldwide.",
            p2: "Additionally, developed browser extensions for Chrome and Firefox, created a review website and worked on a marketplace-style project. Main tasks included developing user interfaces, API integration and frontend performance optimization.",
         },
         openSchool: {
            name: 'Online Educational Platform "Open School"',
            role: "Frontend Developer, Designer",
            period: "February 2023 — January 2024 (1 year)",
            p1: "Maintained the existing version of the platform and developed a new one, including a complete interface redesign. Worked on responsive layouts of complex Vue components, API integration and data processing.",
            p2: "Participated in prototyping new pages and creating designs within the platform's new design system. Among the most interesting tasks were developing video and audio players, a text editor, as well as calendars and interactive data tables.",
         },
         freelance: {
            name: "Freelance",
            role: "Frontend Developer, Fullstack",
            period: "March 2017 — December 2022 (5 years and 10 months)",
            p1: "Built responsive websites of varying complexity and developed projects on WordPress and Bitrix CMS. Created over 60 websites in just over 5 years of work.",
            p2: "Beyond CMS solutions, developed a custom engine in PHP and worked with Node.js for server-side logic. Collaborated primarily with private clients, as well as web studios and companies.",
         },
         closing:
            "Part of my experience was gained through developing web applications driven not by commercial interests, but by curiosity. I find particular satisfaction in realizing that I managed to create a software solution that previously seemed complex.",
      },
      heroFooter: {
         portfolio: "Portfolio",
      },
      readMore: {
         expand: "Read more",
         collapse: "Collapse",
      },
      footer: {
         wip: "Site is under development",
      },
      notFound: {
         title: "Page not found",
         description:
            "This page doesn't seem to exist. It may have been moved, deleted, or never existed in the first place.",
         start: "Click or tap to start the game",
         win: "You won!",
         restart: "Click to play again",
      },
   },
} as const;
