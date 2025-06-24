import ResultList from "./components/ResultList"
import type { MediaType, TranslatedLanguage } from "./types"
import type { Translations } from "./utils/search-translations"

export default function Search({
  locale,
  contentLanguages,
  categories,
  mediaTypes,
  direction,
  translations,
}: {
  locale?: string
  contentLanguages: TranslatedLanguage[]
  categories: Record<string, string>
  translations: Translations
  mediaTypes: MediaType[]
  direction: "rtl" | "ltr"
}) {
  return (
    <ResultList
      locale={locale}
      direction={direction}
      translations={translations}
      categories={categories}
      mediaTypes={mediaTypes}
      contentLanguages={contentLanguages}
    />
  )
}
