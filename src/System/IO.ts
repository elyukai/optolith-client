/**
 * @module System.IO
 *
 * A value of type `IO a` is a computation which, when performed, does some I/O
 * before returning a value of type `a`.
 *
 * `IO` is a monad, so `IO` actions can be combined using the `>>` and `>>=`
 * operations from the `Monad` class.
 *
 * @author Lukas Obermann
 */

import * as fs from "fs";
import { pipe } from "../App/Utilities/pipe";
import { fmapF } from "../Data/Functor";
import { showP } from "../Data/Show";


// CONSTRUCTOR

interface IOPrototype {
  readonly isIO: true
}

export interface IO<A> extends IOPrototype {
  readonly f: () => Promise<A>
}

const IOPrototype =
  Object.freeze<IOPrototype> ({
    isIO: true,
  })

export const IO = <A> (f: () => Promise<A>): IO<A> => {
  if (typeof f === "function") {
    return Object.create (
      IOPrototype,
      {
        f: {
          value: f,
        },
      }
    )
  }

  throw new TypeError ("Cannot create an IO action from a value that is not a function.")
}


// APPLICATIVE

/**
 * `pure :: a -> IO a`
 *
 * Lift a value.
 */
export const pure = <A> (x: A) => IO (() => Promise.resolve (x))

IO.pure = pure


// MONAD

/**
 * `(>>=) :: IO a -> (a -> IO b) -> IO b`
 */
export const bind =
  <A>
  (x: IO<A>) =>
  <B>
  (f: (x: A) => IO<B>): IO<B> =>
    IO (() => x .f ()
                .then (pipe (f, y => y.f ()))
                .catch (err => { throw err }))

IO.bind = bind

/**
 * `(=<<) :: Monad m => (a -> m b) -> m a -> m b`
 */
export const bindF =
  <A, B>
  (f: (x: A) => IO<B>) =>
  (x: IO<A>): IO<B> =>
    bind<A> (x) (f)

IO.bindF = bindF

/**
 * `(>>) :: IO a -> IO b -> IO b`
 *
 * Sequentially compose two actions, discarding any value produced by the
 * first, like sequencing operators (such as the semicolon) in imperative
 * languages.
 *
 * ```a >> b = a >>= \ _ -> b```
 */
export const then =
  (x: IO<any>) => <A> (y: IO<A>): IO<A> =>
    bind<any> (x) (_ => y)

IO.then = then

/**
 * `(<<) :: IO a -> IO b -> IO a`
 *
 * Sequentially compose two actions, discarding any value produced by the
 * second.
 */
export const thenF =
  <A> (x: IO<A>) => (y: IO<any>): IO<A> =>
    bind<any> (y) (_ => x)

IO.thenF = thenF

/**
 * `liftM2 :: (a1 -> a2 -> r) -> IO a1 -> IO a2 -> IO r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM2 =
  <A1, A2, B>
  (f: (a1: A1) => (a2: A2) => B) =>
  (x1: IO<A1>) =>
  (x2: IO<A2>): IO<B> =>
    bind<A1> (x1) (pipe (f, fmapF (x2)))

IO.liftM2 = liftM2

/**
 * `liftM3 :: (a1 -> a2 -> a3 -> r) -> IO a1 -> IO a2 -> IO a3 -> IO r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM3 =
  <A1, A2, A3, B>
  (f: (x1: A1) => (x2: A2) => (x3: A3) => B) =>
  (x1: IO<A1>) =>
  (x2: IO<A2>) =>
  (x3: IO<A3>): IO<B> =>
    bind<A1> (x1) (a1 => liftM2 (f (a1)) (x2) (x3))

IO.liftM3 = liftM3


// OPENING AND CLOSING FILES

type FilePath = string

/**
 * `readFile :: FilePath -> IO String`
 *
 * The `readFile` function reads a file and returns the contents of the file as
 * a string.
 */
export const readFile =
  (path: FilePath) =>
    IO (async () => new Promise<string> ((res, rej) =>
                                          fs.readFile (path, "utf8", (err, data) => {
                                            if (err !== null) {
                                              rej (err)
                                            }
                                            else {
                                              res (data)
                                            }
                                          })))

IO.readFile = readFile

/**
 * `writeFile :: FilePath -> String -> IO ()`
 *
 * The computation `writeFile file str` function writes the string `str`, to the
 * file `file`.
 */
export const writeFile =
  (path: FilePath) =>
  (data: string | Buffer) =>
    IO (async () => new Promise<void> ((res, rej) =>
                                        fs.writeFile (path, data, "utf8", err => {
                                          if (err !== null) {
                                            rej (err)
                                          }
                                          else {
                                            res ()
                                          }
                                        })))

IO.writeFile = writeFile

/**
 * `deleteFile :: FilePath -> IO ()`
 *
 * The computation `deleteFile file` function deletes the file `file`.
 */
export const deleteFile =
  (path: FilePath) =>
    IO (async () => new Promise<void> ((res, rej) =>
                                        fs.unlink (path, err => {
                                          if (err !== null) {
                                            rej (err)
                                          }
                                          else {
                                            res ()
                                          }
                                        })))

IO.writeFile = writeFile


// TEXT OUTPUT

/**
 * `print :: Show a => a -> IO ()`
 *
 * The `print` function outputs a value of any printable type to the standard
 * output device. Printable types are those that are instances of class `Show`;
 * `print` converts values to strings for output using the `show` operation and
 * adds a newline.
 */
export const print =
  (x: any) =>
    IO (() => Promise.resolve (console.log (showP (x))))

IO.print = print


// CUSTOM FUNCTIONS

/**
 * `isIO :: a -> Bool`
 *
 * The `isIO` function returns `True` if its argument is an `IO`.
 */
export const isIO =
  (x: any): x is IO<any> =>
    typeof x === "object" && x !== null && Object.getPrototypeOf (x) === IOPrototype

IO.isIO = isIO

/**
 * `fromIO :: IO a -> Promise a`
 *
 * Runs the `IO` and unwraps the `Promise` contained within the `IO`.
 */
export const fromIO =
  <A> (x: IO<A>): Promise<A> => x .f ()

IO.fromIO = fromIO
