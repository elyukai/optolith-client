/**
 * Returns a string of class names from the given arguments. Filters out
 * nullable values and keys with falsey values.
 */
export const classList = (
  ...cls: (string | null | undefined | Record<string, boolean | undefined>)[]
): string =>
  cls
    .flatMap(cl => {
      if (cl === null || cl === undefined) {
        return []
      } else if (typeof cl === "string") {
        return [cl]
      } else {
        return Object.entries(cl).flatMap(([k, v]) => (v === true ? [k] : []))
      }
    })
    .join(" ")
