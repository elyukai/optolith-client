import { remote } from "electron";
import * as fs from "fs";
import { flength, List, subscript } from "../../Data/List";
import { fromMaybe, Maybe } from "../../Data/Maybe";
import { bimap, fromBoth, fst, Pair, snd } from "../../Data/Pair";
import { divideBy, inc } from "./mathUtils";

export const readFile =
  async (path: string) =>
    new Promise<string | Buffer> (
      (resolve, reject) =>
        fs.readFile (
          path,
          "utf8",
          (error, data) => error !== null ? reject (error) : resolve (data)
        )
    )

export const readDir =
  async (path: string) =>
    new Promise<string[]> (
      (resolve, reject) =>
        fs.readdir (
          path, (error, data) =>
            error !== null ? reject (error) : resolve (data)
        )
    )

export const writeFile =
  (path: string) =>
  async (data: any) =>
    new Promise<void> (
      (resolve, reject) =>
        fs.writeFile (
          path,
          data,
          error => error !== null ? reject (error) : resolve ()
        )
    )

/**
 * Prints windows' web page as PDF with Chromium's preview printing custom settings.
 */
export const windowPrintToPDF =
  async (options: Electron.PrintToPDFOptions) =>
    new Promise<Buffer> (
      (resolve, reject) =>
        remote
          .getCurrentWindow ()
          .webContents
          .printToPDF (
            options,
            (error, data) => error !== null ? reject (error) : resolve (data)
          )
    )

/**
 * Shows a native save dialog.
 */
export const showSaveDialog =
  async (options: Electron.SaveDialogOptions) =>
    new Promise<Maybe<string>> (
      resolve =>
        remote.dialog.showSaveDialog (
          remote .getCurrentWindow (),
          options,
          filename => resolve (Maybe (filename))
        )
    )

/**
 * Shows a native open dialog.
 */
export const showOpenDialog =
  async (options: Electron.OpenDialogOptions) =>
    new Promise<Maybe<string[]>> (
      resolve => remote.dialog.showOpenDialog (
        remote .getCurrentWindow (),
        options,
        filenames => resolve (Maybe (filenames))
      )
    )

export const getSystemLocale = () => {
  const systemLocale = remote.app.getLocale ()

  return /^de/ .test (systemLocale)
    ? "de-DE"
    : /^nl/ .test (systemLocale)
    ? "nl-BE"
    : "en-US"
}

const byteTags = List ("", "K", "M", "G", "T")

const foldByteLevels =
  (x: Pair<number, number>): Pair<number, number> =>
    fst (x) < flength (byteTags)
    && snd (x) > 1023
    ? foldByteLevels (bimap<number, number, number, number> (inc) (divideBy (1024)) (x))
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
    const levelAndNumber = foldByteLevels (fromBoth<number, number> (0) (value))
    const rounded = Math.round (snd (levelAndNumber) * 10)
    const localizedNumber = (rounded / 10) .toLocaleString (localeId)

    return `${localizedNumber} ${fromMaybe ("") (subscript (byteTags) (fst (levelAndNumber)))}B`
  }
