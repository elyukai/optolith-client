import Debug from "debug"
import { dirname, join } from "node:path"
import { parentPort } from "node:process"
import { fileURLToPath } from "node:url"
import { getAllValidData } from "optolith-database-schema"
import { getAbsoluteEntityPaths } from "./contents/src/config.js"
const debug = Debug("util:database")

const root = join(dirname(fileURLToPath(import.meta.url)), "contents")

debug("loading database ...")

getAllValidData(getAbsoluteEntityPaths(root))
  .then(database => {
    debug("database loaded")
    parentPort.postMessage(database)
  })
  .catch(() => {})

export type Database = Awaited<ReturnType<typeof getAllValidData>>
