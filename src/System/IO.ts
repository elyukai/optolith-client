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
import { showP } from "../Data/Show";


// CONSTRUCTOR

interface IOPrototype {
  readonly isIO: true
}

export interface IO<A> extends IOPrototype {
  // readonly f: () => Promise<A>
  readonly f: () => A
}

const IOPrototype =
  Object.freeze<IOPrototype> ({
    isIO: true,
  })

// export const IO = <A> (f: () => Promise<A>): IO<A> => {
export const IO = <A> (f: () => A): IO<A> => {
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


// MONAD

/**
 * `(>>=) :: IO a -> (a -> IO b) -> IO b`
 */
export const bind =
  <A>
  (x: IO<A>) =>
  <B>
  (f: (x: A) => IO<B>): IO<B> => {
    return f (x .f ())
    // let y

    // x
    //   .f ()
    //   .then (x1 => { y = f (x1)})
    //   .catch (err => { throw new Error (err) })

    // return y
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
 * second.s
 */
export const thenF =
  <A> (x: IO<A>) => (y: IO<any>): IO<A> =>
    bind<any> (y) (_ => x)

IO.thenF = thenF


// OPENING AND CLOSING FILES

/**
 * `readFile :: FilePath -> IO String`
 *
 * The `readFile` function reads a file and returns the contents of the file as
 * a string.
 */
export const readFile =
  (path: string) =>
    IO (() => fs.readFileSync (path, "utf8"))

IO.readFile = readFile

/**
 * `writeFile :: FilePath -> String -> IO ()`
 *
 * The computation `writeFile file str` function writes the string `str`, to the
 * file `file`.
 */
export const writeFile =
  (path: string) =>
  (data: string | Buffer) =>
    IO (() => fs.writeFileSync (path, data, "utf8"))

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
    IO (() => console.log (showP (x)))

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
 * `fromIO :: IO a -> a`
 *
 * Runs the `IO` and unwraps the value contained within the `IO`. Only use this
 * function if you can ensure the `IO` action will not fail! Throws if it *does*
 * fail.
 *
 * @throws
 */
export const fromIO =
  <A> (x: IO<A>): A => x .f ()

IO.fromIO = fromIO
  // {
  //   let res: A

  //   x
  //     .f ()
  //     .then (x1 => { res = x1 })
  //     .catch (ex => { throw new Error (ex) })

  //   return res
  // }
