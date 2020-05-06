/**
 * @module System.Directory
 *
 * System-independent interface to directory manipulation.
 *
 * @author Lukas Obermann
 * @see IO
 */

import * as fs from "fs"
import { homedir } from "os"
import { join } from "path"
import { fromArray, List } from "../Data/List"
import { fromMaybe, Maybe } from "../Data/Maybe"

type FilePath = string


// ACTIONS ON DIRECTORIES

/**
 * ```haskell
 * createDirectory :: FilePath -> IO ()
 * ```
 *
 * `createDirectory dir` creates a new directory `dir` which is initially empty,
 * or as near to empty as the operating system allows.
 */
export const createDirectory: (path: FilePath) => Promise<void> =
  async path => fs .promises .mkdir (path)

/**
 * ```haskell
 * createDirectoryIfMissing :: Bool     -- Create its parents too?
 *                          -> FilePath -- The path to the directory you want to make
 *                          -> IO ()
 * ```
 *
 * `createDirectoryIfMissing parents dir` creates a new directory `dir` if it
 * doesn't exist. If the first argument is `True` the function will also create
 * all parent directories if they are missing.
 */
export const createDirectoryIfMissing: (parents: boolean) => (path: FilePath) => Promise<void> =
  recursive => async path => {
    await fs .promises .mkdir (path, { recursive })

    return undefined
  }

/**
 * ```haskell
 * removeDirectory :: FilePath -> IO ()
 * ```
 *
 * `removeDirectory dir` removes an existing directory `dir` together with its
 * content and all subdirectories.
 */
export const removeDirectory: (path: FilePath) => Promise<void> =
  async path => fs .promises .rmdir (path)

/**
 * ```haskell
 * renameDirectory :: FilePath -> FilePath -> IO ()
 * ```
 *
 * `renameDirectory old new` changes the name of an existing directory from `old` to `new`.
 */
export const renameDirectory: (oldpath: FilePath) => (newpath: FilePath) => Promise<void> =
  oldpath => async newpath => fs .promises .rename (oldpath, newpath)

/**
 * ```haskell
 * getDirectoryContents :: FilePath -> IO [FilePath]
 * ```
 *
 * `getDirectoryContents dir` returns a list of *all* entries in `dir`.
 */
export const getDirectoryContents: (path: string) => Promise<List<string>> =
  async (path: string) => {
    const res_array = await fs.promises.readdir (path)

    return fromArray (res_array)
  }


// PRE-DEFINED DIRECTORIES

/**
 * ```haskell
 * getHomeDirectory :: IO FilePath
 * ```
 *
 * Returns the current user's home directory.
 */
export const getHomeDirectory: Promise<FilePath> = Promise.resolve (homedir ())

const getEnvSave = (name: string) => fromMaybe ("") (Maybe (process .env [name]))

/**
 * ```haskell
 * getAppUserDataDirectory :: String -> IO FilePath
 * ```
 *
 * Returns the pathname of a directory in which application-specific data for
 * the current user can be stored. The result of `getAppUserDataDirectory` for a
 * given application is specific to the current user.
 */
export const getAppUserDataDirectory: (appname: string) => Promise<FilePath> =
  async appname => Promise.resolve (
                     process.platform === "win32"
                     ? join (getEnvSave ("APPDATA"), appname)
                     : process.platform === "darwin"
                     ? join (getEnvSave ("HOME"), "Library", "Application Support", "appname")
                     : join (getEnvSave ("HOME"), ".config", appname)
                   )
