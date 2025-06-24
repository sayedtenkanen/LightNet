import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { useEffect, useRef } from "react"

import Icon from "../../../components/Icon"
import { detailsPagePath } from "../../../utils/paths"
import { useSearch } from "../hooks/use-search"
import type { TranslationKey, Translations } from "../utils/search-translations"

type MediaType = {
  name: string
  icon: string
}

type TranslatedLanguage = {
  name: string
  direction: "rtl" | "ltr"
}

interface Props {
  currentLocale: string | undefined
  translations: Translations
  direction: "rtl" | "ltr"
  categories: Record<string, string>
  languages: Record<string, TranslatedLanguage>
  showLanguage: boolean
  mediaTypes: Record<string, MediaType>
}

export default function ResultList({
  currentLocale,
  categories,
  translations,
  languages,
  direction,
  showLanguage,
  mediaTypes,
}: Props) {
  const { results, isLoading } = useSearch()

  // restore scroll position after back navigation
  useEffect(() => {
    const { state } = history
    if (!isLoading && state?.scrollY) {
      window.scrollTo(0, state.scrollY)
    }
  }, [isLoading])
  const t = (key: TranslationKey) => translations[key]

  const listRef = useRef<HTMLDivElement | null>(null)

  const virtualizer = useWindowVirtualizer({
    count: results.length,
    estimateSize: () => 225,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  })

  return (
    <>
      <div ref={listRef} className="px-4 md:px-8">
        <ol
          className="relative w-full divide-y divide-gray-200"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const item = results[virtualRow.index]
            return (
              <li
                key={virtualRow.key}
                className="absolute left-0 top-0 block w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${
                    virtualRow.start - virtualizer.options.scrollMargin
                  }px)`,
                }}
                lang={item.language}
              >
                <a
                  href={detailsPagePath(currentLocale, {
                    id: item.id,
                  })}
                  ref={virtualizer.measureElement}
                  data-index={virtualRow.index}
                  className="group flex overflow-hidden py-6 transition-colors ease-in-out md:rounded-sm md:py-10 md:hover:bg-gray-100"
                >
                  <div className="flex h-36 w-36 shrink-0 flex-col items-start justify-center">
                    <img
                      className="max-h-36 w-auto max-w-36 rounded-sm object-contain shadow-md"
                      src={item.image.src}
                      width={item.image.width}
                      height={item.image.height}
                      alt=""
                      decoding="async"
                      loading="eager"
                    />
                  </div>

                  <div className="ms-5 flex grow flex-col justify-center text-xs sm:ms-8">
                    <h2 className="mb-1 line-clamp-3 text-sm font-bold text-gray-700 md:mb-3 md:text-base">
                      <Icon
                        className={`${mediaTypes[item.type].icon} me-2 align-bottom text-2xl text-gray-700`}
                        ariaLabel={mediaTypes[item.type].name}
                      />
                      <span>{item.title}</span>
                    </h2>
                    <div className="mb-3 flex flex-col flex-wrap items-start gap-2 md:flex-row md:items-center md:gap-3">
                      {!!item.authors?.length && (
                        <p className="mb-1 md:mb-0 md:text-base">
                          {item.authors.join(", ")}
                        </p>
                      )}
                      {showLanguage && (
                        <span className="rounded-lg border border-gray-300 px-2 py-1 text-gray-500">
                          {languages[item.language].name}
                        </span>
                      )}
                      <ul lang={currentLocale} className="flex flex-wrap gap-1">
                        {item.categories?.map((category) => (
                          <li
                            key={category}
                            className="rounded-lg bg-gray-200 px-2 py-1 text-gray-600"
                          >
                            {categories[category]}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="hidden sm:block">
                      <p
                        className="line-clamp-3 max-w-screen-sm text-xs"
                        lang={item.language}
                        dir={languages[item.language].direction}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <Icon
                    className="mdi--chevron-right md:group-hover:text-primary my-auto me-4 ms-2 hidden shrink-0 text-2xl text-gray-300 sm:block"
                    flipIcon={direction === "rtl"}
                    ariaLabel=""
                  />
                </a>
              </li>
            )
          })}
        </ol>
      </div>
      {!results.length && !isLoading && (
        <div className="mt-24 text-center font-bold text-gray-500">
          {t("ln.search.no-results")}
        </div>
      )}
    </>
  )
}
