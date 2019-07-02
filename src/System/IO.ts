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
import * as util from "util";
import { pipe } from "../App/Utilities/pipe";
import { ident } from "../Data/Function";
import { fmapF } from "../Data/Functor";
import { showP } from "../Data/Show";


// PROTOTYPE

export interface IOPrototype {
  readonly isIO: true
}

export const IOPrototype =
  Object.freeze<IOPrototype> ({
    isIO: true,
  })


// CONSTRUCTOR

export interface IO<A> extends IOPrototype {
  readonly f: () => Promise<A>
}

interface IOConstructor {
  <A> (f: () => Promise<A>): IO<A>
  pure: <A> (x: A) => IO<A>
  bind: <A> (x: IO<A>) => <B> (f: (x: A) => IO<B>) => IO<B>
  bindF: <A, B> (f: (x: A) => IO<B>) => (x: IO<A>) => IO<B>
  then: (x: IO<any>) => <A> (y: IO<A>) => IO<A>
  thenF: <A> (x: IO<A>) => (y: IO<any>) => IO<A>
  join: <A> (x: IO<IO<A>>) => IO<A>
  liftM2: <A1, A2, B> (f: (a1: A1) => (a2: A2) => B) => (x1: IO<A1>) => (x2: IO<A2>) => IO<B>
  liftM3:
    <A1, A2, A3, B>
    (f: (x1: A1) => (x2: A2) => (x3: A3) => B) =>
    (x1: IO<A1>) =>
    (x2: IO<A2>) =>
    (x3: IO<A3>) => IO<B>
  readFile: (path: string) => IO<string>
  writeFile: (path: string) => (data: string | Buffer) => IO<void>
  deleteFile: (path: string) => IO<void>
  existsFile: (path: string) => IO<boolean>
  copyFile: (origin: string) => (dest: string) => IO<void>
  print: (x: any) => IO<void>
  isIO: (x: any) => x is IO<any>
  fromIO: <A> (x: IO<A>) => Promise<A>
  toIO: <A extends any[], B> (f: (...args: A) => Promise<B>) => (...args: A) => IO<B>
  runIO: <A>(x: IO<A>) => IO<void>
}

export const IO =
  (<A> (f: () => Promise<A>): IO<A> => {
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
  }) as IOConstructor


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
  (f: (x: A) => IO<B>): IO<B> => {
    const res = x .f ()

    return IO (() => res .then (pipe (f, y => y.f ()))
                                   .catch (err => { throw err }))
  }

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
 * `join :: IO (IO a) -> IO a`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join =
  <A> (x: IO<IO<A>>): IO<A> =>
    bind (x) (ident)

IO.join = join

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

const readFileP = util.promisify (fs.readFile)

/**
 * `readFile :: FilePath -> IO String`
 *
 * The `readFile` function reads a file and returns the contents of the file as
 * a string.
 */
export const readFile =
  (path: FilePath) =>
    IO (async () => readFileP (path, "utf8"))

IO.readFile = readFile

const writeFileP = util.promisify (fs.writeFile)

/**
 * `writeFile :: FilePath -> String -> IO ()`
 *
 * The computation `writeFile file str` function writes the string `str`, to the
 * file `file`.
 */
export const writeFile =
  (path: FilePath) =>
  (data: string | Buffer) =>
    IO (async () => writeFileP (path, data, "utf8"))

IO.writeFile = writeFile

const deleteFileP = util.promisify (fs.unlink)

/**
 * `deleteFile :: FilePath -> IO ()`
 *
 * The computation `deleteFile file` function deletes the file `file`.
 */
export const deleteFile =
  (path: FilePath) =>
    IO (async () => deleteFileP (path))

IO.deleteFile = deleteFile

const existsFileP = util.promisify (fs.access)

/**
 * `existsFile :: FilePath -> IO Bool`
 *
 * The computation `existsFile file` function checks if the file `file` exists.
 */
export const existsFile =
  (path: FilePath) =>
    IO (async () => existsFileP (path, fs.constants.F_OK)
                                .then (() => true)
                                .catch (() => false))

IO.existsFile = existsFile

const copyFileP = util.promisify (fs.copyFile)

/**
 * `copyFile :: FilePath -> FilePath -> IO Bool`
 *
 * The computation `copyFile origin dest` function copies the file `origin` to
 * `dest`.
 */
export const copyFile =
  (origin: FilePath) =>
  (dest: FilePath) =>
    IO (async () => copyFileP (origin, dest))

IO.copyFile = copyFile


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
    IO (async () => Promise.resolve (console.log (showP (x))))

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

/**
 * `toIO :: (...a -> Promise b) -> ...a -> IO b`
 *
 * Runs the `IO` and unwraps the `Promise` contained within the `IO`.
 */
export const toIO =
  <A extends any[], B>
  (f: (...args: A) => Promise<B>) =>
  (...args: A): IO<B> =>
    IO (() => f (...args))

IO.toIO = toIO

/**
 * `runIO :: IO a -> IO a`
 *
 * Runs the `IO` action and returns an `IO` with the resolved return value.
 */
export const runIO =
  <A> (x: IO<A>): IO<void> => {
    x .f () .catch (err => { throw err })

    return IO (async () => { return })
  }

IO.runIO = runIO
