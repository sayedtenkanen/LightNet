import type { TranslationKey, Translations } from "./search-translations"

// todo delete
export const useProvidedTranslations = (translations: Translations) => {
  return (key: TranslationKey) => translations[key]
}
