import { remote } from "electron";
import { fmap } from "../../Data/Functor";
import { flength, fromArray, List, subscript } from "../../Data/List";
import { fromMaybe, guard, joinMaybeList, Maybe, normalize, then } from "../../Data/Maybe";
import { divideBy, inc } from "../../Data/Num";
import { bimap, fst, Pair, snd } from "../../Data/Tuple";
import { pipe_ } from "./pipe";

/**
 * Prints windows' web page as PDF with Chromium's preview printing custom settings.
 */
export const windowPrintToPDF: (options: Electron.PrintToPDFOptions) => Promise<Buffer> =
  async options => remote .getCurrentWindow () .webContents .printToPDF (options)

/**
 * Shows a native save dialog.
 */
export const showSaveDialog: (options: Electron.SaveDialogOptions) => Promise<Maybe<string>> =
  async options => {
    const res = await remote.dialog.showSaveDialog (
      remote .getCurrentWindow (),
      options
    )

    return then (guard (!res .canceled)) (normalize (res .filePath))
  }

/**
 * Shows a native open dialog.
 */
export const showOpenDialog: (options: Electron.OpenDialogOptions) => Promise<List<string>> =
  async options => pipe_ (
    await remote.dialog.showOpenDialog (
      remote .getCurrentWindow (),
      options
    ),
    res => res .filePaths,
    normalize,
    fmap (fromArray),
    joinMaybeList
  )

export const getSystemLocale = () => {
  const systemLocale = remote.app.getLocale ()

  return /^de/u .test (systemLocale)
    ? "de-DE"
    : /^nl/u .test (systemLocale)
    ? "nl-BE"
    : "en-US"
}

const byteTags = List ("", "K", "M", "G", "T")

const foldByteLevels =
  (x: Pair<number, number>): Pair<number, number> =>
    fst (x) < flength (byteTags)
    && snd (x) > 1023
    ? foldByteLevels (bimap (inc) (divideBy (1024)) (x))
    : x

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
export const bytify =
  (localeId: string) =>
  (value: number) => {
    const levelAndNumber = foldByteLevels (Pair (0, value))
    const rounded = Math.round (snd (levelAndNumber) * 10)
    const localizedNumber = (rounded / 10) .toLocaleString (localeId)

    return `${localizedNumber} ${fromMaybe ("") (subscript (byteTags) (fst (levelAndNumber)))}B`
  }
