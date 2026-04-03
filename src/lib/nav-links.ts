type NavTranslations = { home: string; skills: string; experience: string };

export const NAV_HREFS = ["#hero", "#skills", "#experience"] as const;

export const getNavLinks = (nav: NavTranslations) =>
   [
      { href: "#hero" as const, label: nav.home },
      { href: "#skills" as const, label: nav.skills },
      { href: "#experience" as const, label: nav.experience },
   ] as const;
