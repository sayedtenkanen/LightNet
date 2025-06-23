import { useEffect, useRef, useState } from "react"

import Icon from "../../../components/Icon"
import { useDebounce } from "../hooks/use-debounce"
import type { MediaType, TranslatedLanguage } from "../types"
import {
  CATEGORY,
  getSearchQueryParam,
  LANGUAGE,
  SEARCH,
  TYPE,
  updateSearchQuery,
} from "../utils/search-query"
import type { Translations } from "../utils/search-translations"
import { useProvidedTranslations } from "../utils/use-provided-translations"
import Select from "./Select"

interface Props {
  contentLanguages: TranslatedLanguage[]
  // todo move this to a json file
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

  const [search, setSearch] = useState(getSearchQueryParam(SEARCH))
  // todo calculate this once during build time
  const [language, setLanguage] = useState(() => {
    let initialLanguageFilter = ""
    const hasContentLanguage = contentLanguages.find(
      ({ code }) => code === locale,
    )
    if (
      filterByLocale &&
      locale &&
      hasContentLanguage &&
      languageFilterEnabled
    ) {
      initialLanguageFilter = locale
    }
    return getSearchQueryParam(LANGUAGE, initialLanguageFilter)()
  })
  const [type, setType] = useState(getSearchQueryParam(TYPE))
  const [category, setCategory] = useState(getSearchQueryParam(CATEGORY))

  const searchInput = useRef<HTMLInputElement | null>(null)

  const t = useProvidedTranslations(translations)

  const debouncedSetSearch = useDebounce((value: string) => {
    setSearch(value)
  }, 300)

  useEffect(
    () => updateSearchQuery({ search, category, language, type }),
    [search, language, type, category],
  )

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
