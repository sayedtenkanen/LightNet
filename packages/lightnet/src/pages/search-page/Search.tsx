import ResultList from "./components/ResultList"
import SearchFilter from "./components/SearchFilter"
import type { MediaType, TranslatedLanguage } from "./types"
import type { Translations } from "./utils/search-translations"
import { useProvidedTranslations } from "./utils/use-provided-translations"

export default function Search({
  locale,
  contentLanguages,
  categories,
  mediaTypes,
  direction,
  translations,
  filterByLocale,
}: {
  locale?: string
  contentLanguages: TranslatedLanguage[]
  categories: Record<string, string>
  translations: Translations
  mediaTypes: MediaType[]
  direction: "rtl" | "ltr"
  filterByLocale: boolean
}) {
  const t = useProvidedTranslations(translations)

  return (
    <>
      <div className="px-4 md:px-8">
        <h1 className="mb-4 mt-8 text-4xl md:mb-8 md:mt-12 md:text-5xl">
          {t("ln.search.title")}
        </h1>
        <SearchFilter
          contentLanguages={contentLanguages}
          mediaTypes={mediaTypes}
          translations={translations}
          categories={categories}
          locale={locale}
          filterByLocale={filterByLocale}
        />
      </div>

      <ResultList
        locale={locale}
        direction={direction}
        translations={translations}
        categories={categories}
        mediaTypes={mediaTypes}
        contentLanguages={contentLanguages}
      />
    </>
  )
}
