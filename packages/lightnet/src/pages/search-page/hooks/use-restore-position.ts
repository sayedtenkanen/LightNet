import { useEffect, useRef } from "react"

export function useRestoreScrollPosition(isLoading: boolean) {
  const restoredPosition = useRef(0)

  // Astro's ClientRouter is writing a incorrect scroll position to
  // history.state.scrollY. We have seen this when having the search results
  // below the fold. This leads to incorrect scroll position restoration after
  // navigating back.
  //
  // We store the correct scroll value to a custom property "searchScrollY"
  // to be used by the scroll restoration.
  useEffect(() => {
    restoredPosition.current = history.state?.searchScrollY ?? 0
    let timeout: number | undefined
    const storeScrollPosition = () => {
      if (timeout) {
        window.clearTimeout(timeout)
      }
      timeout = window.setTimeout(() => {
        const state = history.state ?? {}
        history.pushState({ ...state, searchScrollY: window.scrollY }, "")
      }, 50)
    }
    document.addEventListener("scroll", storeScrollPosition)
    return () => {
      document.removeEventListener("scroll", storeScrollPosition)
    }
  }, [])

  // Restore scroll position after back navigation.
  // We need to implement this because default restoration is kicking in
  // before results are loaded. Also default restoration uses and incorrect scroll position.
  // This is why we rely on our custom property.
  useEffect(() => {
    const { state } = history
    if (!isLoading && state?.searchScrollY !== undefined) {
      requestAnimationFrame(() =>
        window.scrollTo({ top: restoredPosition.current }),
      )
    }
  }, [isLoading])
}
