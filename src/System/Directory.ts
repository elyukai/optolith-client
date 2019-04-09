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
import { IO } from "./IO";


/**
 * `getDirectoryContents :: FilePath -> IO [FilePath]`
 *
 * `getDirectoryContents dir` returns a list of *all* entries in `dir`.
 */
export const getDirectoryContents =
  (path: string) =>
    IO (async () => new Promise<List<String>> ((res, rej) =>
                                                fs.readdir (path, (err, files) => {
                                                  if (err !== null) {
                                                    rej (err)
                                                  }
                                                  else {
                                                    res (fromArray (files))
                                                  }
                                                })))
