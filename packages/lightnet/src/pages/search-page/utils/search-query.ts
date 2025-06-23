export type SearchQuery = {
  search: string
  category: string
  language: string
  type: string
}

// URL search params
export const SEARCH = "search"
export const LANGUAGE = "language"
export const TYPE = "type"
export const CATEGORY = "category"

export const UPDATE_QUERY_EVENT = "ln:update-search-query"

type SearchQueryParam =
  | typeof SEARCH
  | typeof LANGUAGE
  | typeof TYPE
  | typeof CATEGORY

export function updateSearchQuery({
  search,
  category,
  language,
  type,
}: SearchQuery) {
  const url = new URL(window.location.href)
  const updateSearchParam = (paramName: SearchQueryParam, value: string) => {
    // Only update when value before and after are different and both are non empty.
    if (value === (url.searchParams.get(paramName) ?? "")) {
      return
    }
    url.searchParams.set(paramName, value)
  }

  updateSearchParam(SEARCH, search)
  updateSearchParam(LANGUAGE, language)
  updateSearchParam(TYPE, type)
  updateSearchParam(CATEGORY, category)
  history.replaceState({ ...history.state }, "", url.toString())
  document.dispatchEvent(new Event(UPDATE_QUERY_EVENT))
}

export function getSearchQueryParam(
  paramName: SearchQueryParam,
  defaultValue = "",
) {
  // be lazy to avoid parsing search params all the time
  return () => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get(paramName) ?? defaultValue
  }
}

export function observeSearchQuery(callback: (query: SearchQuery) => void) {
  const onUpdateQuery = () => {
    const searchParams = new URL(window.location.href).searchParams
    const query = {
      search: searchParams.get(SEARCH) ?? "",
      category: searchParams.get(CATEGORY) ?? "",
      language: searchParams.get(LANGUAGE) ?? "",
      type: searchParams.get(TYPE) ?? "",
    }
    callback(query)
  }
  document.addEventListener(UPDATE_QUERY_EVENT, onUpdateQuery)
  onUpdateQuery()
  return () => document.removeEventListener(UPDATE_QUERY_EVENT, onUpdateQuery)
}
