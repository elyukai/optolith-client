import Debug from "debug"
import { dirname, join } from "node:path"
import { parentPort } from "node:process"
import { fileURLToPath } from "node:url"
import { getAllValidData, getCache } from "optolith-database-schema"
import { getAbsoluteCachePaths, getAbsoluteEntityPaths } from "./contents/src/config.js"
const debug = Debug("util:database")

const root = join(dirname(fileURLToPath(import.meta.url)), "contents")

debug("loading database ...")

const get = async () => {
  const raw = await getAllValidData(getAbsoluteEntityPaths(root))
  const cache = await getCache(getAbsoluteCachePaths(root))
  return { raw, cache }
}

get()
  .then(database => {
    debug("database loaded")
    parentPort.postMessage(database)
  })
  .catch(() => {})

export type Database = {
  raw: Awaited<ReturnType<typeof getAllValidData>>
  cache: Awaited<ReturnType<typeof getCache>>
}
