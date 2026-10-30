const byteTags = ["", "K", "M", "G", "T"]

const foldByteLevels = (index: number, value: number): [number, number] =>
  index < byteTags.length - 1 && value > 1023
    ? foldByteLevels(index + 1, value / 1024)
    : [index, value]

/**
 * `bytify :: String -> Int -> String`
 *
 * `bytify id value` returns a string representation of `value`, the amount of
 * bytes, based on the locale specified by `id`. It reduces the value to KB, MB
 * etc so its readable.
 *
 * Examples:
 *
 * ```haskell
 * bytify "de-DE" 1234567 == "1,2 MB"
 * bytify "en-US" 1234567 == "1.2 MB"
 * bytify "en-US" 1024 == "1 KB"
 * bytify "de-DE" 0 == "0 B"
 * ```
 */
export const bytify = (value: number, selectedLocale: string | undefined, systemLocale: string) => {
  const [index, categorizedValue] = foldByteLevels(0, value)
  const rounded = Math.round(categorizedValue * 10) / 10
  const localizedNumber = rounded.toLocaleString(selectedLocale ?? systemLocale)

  return `${localizedNumber} ${byteTags[index] ?? ""}B`
}
