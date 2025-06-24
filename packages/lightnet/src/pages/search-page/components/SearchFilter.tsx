import { useRef } from "react"

import Icon from "../../../components/Icon"
import { useDebounce } from "../hooks/use-debounce"
import type { MediaType, TranslatedLanguage } from "../types"
import { CATEGORY, LANGUAGE, SEARCH, TYPE } from "../utils/search-query"
import type { Translations } from "../utils/search-translations"
import { useProvidedTranslations } from "../utils/use-provided-translations"
import Select from "./Select"
import { useSearchQueryParam } from "../hooks/use-search-query-param"

interface Props {
  contentLanguages: TranslatedLanguage[]
  categories: Record<string, string>
  mediaTypes: MediaType[]
  locale?: string
  translations: Translations
  filterByLocale: boolean
}

export default function SearchFilter({
  categories,
  mediaTypes,
  translations,
  filterByLocale,
  locale,
  contentLanguages,
}: Props) {
  const languageFilterEnabled = contentLanguages.length > 1
  const typesFilterEnabled = mediaTypes.length > 1
  // Not every media item has a category. So it makes
  // sense to have the filter when there is only one category.
  // todo calculate this once during build time
  const categoriesFilterEnabled = Object.keys(categories).length > 0

  const [search, setSearch] = useSearchQueryParam(SEARCH)
  // todo calculate this once during build time
  let initialLanguageFilter = ""
  const hasContentLanguage = contentLanguages.find(
    ({ code }) => code === locale,
  )
  if (filterByLocale && locale && hasContentLanguage && languageFilterEnabled) {
    initialLanguageFilter = locale
  }

  const [language, setLanguage] = useSearchQueryParam(
    LANGUAGE,
    initialLanguageFilter,
  )
  const [type, setType] = useSearchQueryParam(TYPE)
  const [category, setCategory] = useSearchQueryParam(CATEGORY)

  const searchInput = useRef<HTMLInputElement | null>(null)

  const t = useProvidedTranslations(translations)

  const debouncedSetSearch = useDebounce((value: string) => {
    setSearch(value)
  }, 300)

  return (
    <>
      <label className="dy-input dy-input-bordered mb-2 flex items-center gap-2">
        <input
          type="search"
          className="grow"
          ref={searchInput}
          placeholder={t("ln.search.placeholder")}
          enterKeyHint="search"
          defaultValue={search}
          onInput={(e) => debouncedSetSearch(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && searchInput.current?.blur()}
        />
        <Icon className="mdi--magnify text-xl" ariaLabel="" />
      </label>
      <div className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-6 md:mb-10">
        {languageFilterEnabled && (
          <Select
            label={t("ln.language")}
            initialValue={language}
            valueChange={(val) => setLanguage(val)}
            options={[
              { id: "", label: t("ln.search.all-languages") },
              ...contentLanguages.map(({ code: id, name: label }) => ({
                id,
                label,
              })),
            ]}
          />
        )}

        {typesFilterEnabled && (
          <Select
            label={t("ln.type")}
            initialValue={type}
            valueChange={(val) => setType(val)}
            options={[
              { id: "", label: t("ln.search.all-types") },
              ...mediaTypes,
            ]}
          />
        )}

        {categoriesFilterEnabled && (
          <Select
            label={t("ln.category")}
            initialValue={category}
            valueChange={(val) => setCategory(val)}
            options={[
              { id: "", label: t("ln.search.all-categories") },
              ...Object.entries(categories)
                .sort((a, b) => a[1].localeCompare(b[1], locale))
                .map(([id, label]) => ({ id, label })),
            ]}
          />
        )}
      </div>
    </>
  )
}
