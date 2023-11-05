import Debug from "debug"
import { join } from "node:path"
import { parentPort } from "node:process"
import * as databaseSchema from "optolith-database-schema"
import { getAbsoluteCachePaths, getAbsoluteEntityPaths } from "./contents/src/config.js"
const debug = Debug("util:database")

// This is the relative path from the project root directory to the database
// root directory.
const root = join("src", "database", "contents")

debug("loading database ...")

// fix dynamic webpack import
;(databaseSchema as unknown as { default: Promise<typeof databaseSchema> }).default
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
