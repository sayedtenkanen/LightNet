import { useState, useEffect } from "react"
import {
  getSearchQueryParam,
  setSearchQueryParam,
  type SearchQueryParam,
} from "../utils/search-query"

export function useSearchQueryParam(
  paramName: SearchQueryParam,
  initialValue?: string,
) {
  // be lazy to avoid parsing the query params all the time
  const loadSearchParam = () => getSearchQueryParam(paramName) ?? initialValue
  const [state, updateState] = useState(loadSearchParam)
  const updateParam = (value: string) => {
    setSearchQueryParam(paramName, value)
    updateState(value)
  }
  // set initial value
  useEffect(() => {
    if (initialValue === undefined) {
      return
    }
    // if there is already a parameter set, do not
    // override it with the initial value
    if (getSearchQueryParam(paramName) !== undefined) {
      return
    }
    setSearchQueryParam(paramName, initialValue)
  }, [])
  return [state, updateParam] as const
}
