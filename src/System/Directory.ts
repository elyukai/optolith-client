/**
 * @module System.Directory
 *
 * System-independent interface to directory manipulation.
 *
 * @author Lukas Obermann
 * @see IO
 */

import * as fs from "fs";
import { fromArray } from "../Data/List";
import { IO } from "./IO";


/**
 * `getDirectoryContents :: FilePath -> IO [FilePath]`
 *
 * `getDirectoryContents dir` returns a list of *all* entries in `dir`.
 */
export const getDirectoryContents =
  (path: string) =>
    IO (() => fromArray (fs.readdirSync (path)))
