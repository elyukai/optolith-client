/**
 * @module System.Directory
 *
 * System-independent interface to directory manipulation.
 *
 * @author Lukas Obermann
 * @see IO
 */

import * as fs from "fs";
import { fromArray, List } from "../Data/List";

/**
 * `getDirectoryContents :: FilePath -> IO [FilePath]`
 *
 * `getDirectoryContents dir` returns a list of *all* entries in `dir`.
 */
export const getDirectoryContents: (path: string) => Promise<List<string>> =
  async (path: string) => {
    const res_array = await fs.promises.readdir (path)

    return fromArray (res_array)
  }
