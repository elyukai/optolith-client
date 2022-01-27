import { join } from "path"
import { handleE } from "../../Control/Exception"
import { parseJSON } from "../../Data/String/JSON"
import { readFile, writeFile } from "../../System/IO"
import { user_data_path } from "../Selectors/envSelectors"
import { ensure } from "./Maybe"
import { pipe } from "./pipe"
import { isObject } from "./typeCheckUtils"

const property_name = "update"

const file_path = join (user_data_path, "update.json")

/**
 * Check for the update file. If the `update` property in the JSON is set to
 * `True`, the IO returns `True`, otherwise `False`. Also returns `True` if
 * there is no file present.
 */
export const readUpdate =
  async () => (await handleE (readFile (file_path)))
    .toMaybe ()
    .bind (parseJSON)
    .bind (json => ensure (json, isObject))
    .maybe (true, x => (x as any) [property_name] === true)

/**
 * Pass in if an update has been downloaded or not, and then create/overwrite
 * an update file.
 */
export const writeUpdate =
  pipe (
    (x: boolean) => ({ [property_name]: x }),
    JSON.stringify,
    writeFile (file_path),
    handleE
  )
