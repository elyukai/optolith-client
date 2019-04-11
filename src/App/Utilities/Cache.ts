import { join } from "path";
import { tryIO } from "../../Control/Exception";
import { eitherToMaybe } from "../../Data/Either";
import { ident } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { all, fromArray, List } from "../../Data/List";
import { bindF, ensure, mapM, Maybe } from "../../Data/Maybe";
import { fromList, toObjectWith } from "../../Data/OrderedMap";
import { Pair } from "../../Data/Pair";
import { deleteFile, readFile, writeFile } from "../../System/IO";
import { current_version, user_data_path } from "../Selectors/envSelectors";
import { pipe, pipe_ } from "./pipe";
import { isObject } from "./typeCheckUtils";

const file_path = join (user_data_path, "cache.json")

/**
 * Key in cache file to store adventure points.
 */
export const AP_KEY = "ap"

const APP_VERSION_KEY = "appVersion"

interface APCache {
  spent: number
  available: number
  spentOnAdvantages: number
  spentOnMagicalAdvantages: number
  spentOnBlessedAdvantages: number
  spentOnDisadvantages: number
  spentOnMagicalDisadvantages: number
  spentOnBlessedDisadvantages: number
  spentOnAttributes: number
  spentOnSkills: number
  spentOnCombatTechniques: number
  spentOnSpells: number
  spentOnLiturgicalChants: number
  spentOnCantrips: number
  spentOnBlessings: number
  spentOnSpecialAbilities: number
  spentOnEnergies: number
}

const ap_cache_keys: List<keyof APCache> =
  List (
    "spent",
    "available",
    "spentOnAdvantages",
    "spentOnMagicalAdvantages",
    "spentOnBlessedAdvantages",
    "spentOnDisadvantages",
    "spentOnMagicalDisadvantages",
    "spentOnBlessedDisadvantages",
    "spentOnAttributes",
    "spentOnSkills",
    "spentOnCombatTechniques",
    "spentOnSpells",
    "spentOnLiturgicalChants",
    "spentOnCantrips",
    "spentOnBlessings",
    "spentOnSpecialAbilities",
    "spentOnEnergies"
  )

export const readCache =
  pipe_ (
    file_path,
    readFile,
    tryIO,
    fmap (pipe (
      eitherToMaybe,
      bindF (pipe (JSON.parse, x => Maybe (x [AP_KEY]))),
      bindF (ensure (isObject)),
      bindF (pipe (
        Object.entries,
        fromArray,
        mapM (pipe (
          ensure ((e): e is [string, APCache] =>
                   all ((k: keyof APCache) => typeof e [1] [k] === "number")
                       (ap_cache_keys)),
          fmap (Pair.fromArray)
        ))
      )),
      fmap (fromList)
    ))
  )

export const writeCache =
  pipe (
    toObjectWith (ident as ident<APCache>),
    m => ({
      [APP_VERSION_KEY]: current_version,
      [AP_KEY]: m,
    }),
    JSON.stringify,
    writeFile (file_path),
    tryIO
  )

export const deleteCache = () => tryIO (deleteFile (file_path))
