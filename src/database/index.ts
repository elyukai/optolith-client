import Debug from "debug"
import { join } from "node:path"
import { parentPort } from "node:process"
import type * as databaseSchema from "optolith-database-schema"
import { getAbsoluteCachePaths, getAbsoluteEntityPaths } from "./contents/src/config.js"
const debug = Debug("util:database")

const appPath = process.argv[2] ?? ""
const root = join(appPath, "src", "database", "contents")

debug("loading database ...")

import("optolith-database-schema")
  .then(async db => {
    const raw = await db.getAllValidData(getAbsoluteEntityPaths(root), {
      ajvOptions: { allErrors: true },
    })
    const cache = await db.getCache(getAbsoluteCachePaths(root))
    debug("database loaded")
    parentPort.postMessage({ raw, cache })
  })
  .catch(err => {
    debug("database error: %O", err)
  })

/**
 * The complate database content.
 */
export type Database = {
  raw: Awaited<ReturnType<typeof databaseSchema.getAllValidData>>
  cache: Awaited<ReturnType<typeof databaseSchema.getCache>>
}
