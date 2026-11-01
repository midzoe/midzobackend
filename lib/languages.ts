/**
 * Langues du site : la seule liste à modifier pour en ajouter une côté serveur (traduction du
 * catalogue, `?locale=`). Côté site : midzoweb/src/i18n/languages.ts, plus un dossier
 * `src/i18n/locales/<code>/` pour les textes de l'interface.
 */
export const SITE_LANGS = ["fr", "en", "de"] as const;
export type SiteLang = (typeof SITE_LANGS)[number];
/** Langue de saisie du catalogue en admin. */
export const SOURCE_LANG: SiteLang = "fr";

/** Langue cible DeepL, et vouvoiement quand la langue le distingue. */
export const LANGUAGE_CONFIG: Record<SiteLang, { deepl: string; formality?: "prefer_more" }> = {
  fr: { deepl: "FR", formality: "prefer_more" },
  en: { deepl: "EN-GB" },
  de: { deepl: "DE", formality: "prefer_more" },
};

export const isSiteLang = (v: unknown): v is SiteLang => SITE_LANGS.includes(v as SiteLang);
/** Langues dans lesquelles le catalogue (saisi en français) doit être traduit. */
export const TARGET_LANGS: SiteLang[] = SITE_LANGS.filter((l) => l !== SOURCE_LANG);
