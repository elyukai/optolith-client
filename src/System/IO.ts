/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
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

import * as fs from "fs"
import { showP } from "../Data/Show"


// CONSTRUCTOR


/**
 * A value of type `IO a` is a computation which, when performed, does some I/O
 * before returning a value of type `a`.
 *
 * `IO` is a monad, so `IO` actions can be combined using the `>>` and `>>=`
 * operations from the `Monad` class.
 */
export type IO<A> = Promise<A>


/**
 *
 * @param x
 */
export const pure : <A> (x : A) => IO<A>
                  = async x => Promise.resolve (x)


// MONAD


export const bind : <A> (x : IO<A>) => <B> (f : (x : A) => IO<B>) => IO<B>
                  = x => async f => x .then (f)


export const bindF : <A, B> (f : (x : A) => IO<B>) => (x : IO<A>) => IO<B>
                   = f => async x => x .then (f)


// OPENING AND CLOSING FILES


type FilePath = string


/**
 * `readFile :: FilePath -> IO String`
 *
 * The `readFile` function reads a file and returns the contents of the file as
 * a string.
 */
export const readFile : (path : FilePath) => IO<string>
                      = async path => fs.promises.readFile (path, "utf-8")


/**
 * `writeFile :: FilePath -> String -> IO ()`
 *
 * The computation `writeFile file str` function writes the string `str`, to the
 * file `file`.
 */
export const writeFile : (path : FilePath) => (data : string | Buffer) => IO<void>
                       = path => async data => fs.promises.writeFile (path, data, "utf-8")


/**
 * `deleteFile :: FilePath -> IO ()`
 *
 * The computation `deleteFile file` function deletes the file `file`.
 */
export const deleteFile : (path : FilePath) => IO<void>
                        = async path => fs.promises.unlink (path)


/**
 * `existsFile :: FilePath -> IO Bool`
 *
 * The computation `existsFile file` function checks if the file `file` exists.
 */
export const existsFile : (path : FilePath) => IO<boolean>
                        = async path => {
                          try {
                            await fs.promises.access (path, fs.constants.F_OK)

                            return true
                          }
                          catch {
                            return false
                          }
                        }


/**
 * `copyFile :: FilePath -> FilePath -> IO Bool`
 *
 * The computation `copyFile origin dest` function copies the file `origin` to
 * `dest`.
 */
export const copyFile : (origin : FilePath) => (dest : FilePath) => IO<void>
                      = origin => async dest => fs.promises.copyFile (origin, dest)


// TEXT OUTPUT


/**
 * `print :: Show a => a -> IO ()`
 *
 * The `print` function outputs a value of any printable type to the standard
 * output device. Printable types are those that are instances of class `Show`;
 * `print` converts values to strings for output using the `show` operation and
 * adds a newline.
 */
export const print : (x : any) => IO<void>
                   = async x => pure (console.log (showP (x)))
