import { remote } from "electron";
import { tryIO } from "../../Control/Exception";
import { Either, fromLeft_, fromRight_, isLeft, Left, Right } from "../../Data/Either";
import { cnst } from "../../Data/Function";
import { fmap, fmapF } from "../../Data/Functor";
import { Internals } from "../../Data/Internals";
import { flength, fromArray, List, subscript } from "../../Data/List";
import { fromMaybe, normalize, Nothing } from "../../Data/Maybe";
import { bimap, fst, Pair, snd } from "../../Data/Tuple";
import { Unit } from "../../Data/Unit";
import { bind, pure } from "../../System/IO";
import { divideBy, inc } from "./mathUtils";
import { pipe } from "./pipe";

import IO = Internals.IO

/**
 * Prints windows' web page as PDF with Chromium's preview printing custom settings.
 */
export const windowPrintToPDF =
  (options: Electron.PrintToPDFOptions) =>
    IO (async () => new Promise<Buffer> ((res, rej) => remote
                                                         .getCurrentWindow ()
                                                         .webContents
                                                         .printToPDF (
                                                           options,
                                                           (error, data) => error !== null
                                                                              ? rej (error)
                                                                              : res (data)
                                                         )))

/**
 * Shows a native save dialog.
 */
export const showSaveDialog =
  (options: Electron.SaveDialogOptions) =>
    IO (async () => new Promise<string> (res => remote.dialog.showSaveDialog (
                                                 remote .getCurrentWindow (),
                                                 options,
                                                 res
                                               )))

/**
 * Shows a native open dialog.
 */
export const showOpenDialog =
  (options: Electron.OpenDialogOptions) =>
    IO (async () => new Promise<List<string>> (res => remote.dialog.showOpenDialog (
                                                       remote .getCurrentWindow (),
                                                       options,
                                                       pipe (
                                                         normalize,
                                                         fmap (pipe (fromArray, res, cnst (Unit))
                                                       ))
                                                     )))

export const NothingIO = pure (Nothing)

export const LeftIO = pipe (Left, pure)

/**
 * `catchIOEither :: (a -> IO b) -> IO a -> IO (Either Error b)`
 *
 * `catchIOEither f x` executes `x` and maps `f` over the result, if no error
 * occured. The resulting `IO` will either return an error raised by the first
 * function or the result of the generated `IO`, when executed.
 */
export const catchIOEither =
  <A, B>
  (f: (x: A) => IO<B>) =>
  (x: IO<A>) =>
    bindIOEither (f) (tryIO (x))

export const bindIOEither =
  <A, B>
  (f: (x: A) => IO<B>) =>
  <E>
  (x: IO<Either<E, A>>) =>
    bind (x)
         ((e): IO<Either<E, B>> => isLeft (e)
                 ? LeftIO (fromLeft_ (e))
                 : fmapF (f (fromRight_ (e))) (Right))

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
