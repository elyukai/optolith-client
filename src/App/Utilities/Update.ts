import { join } from "path"
import { handleE } from "../../Control/Exception"
import { eitherToMaybe } from "../../Data/Either"
import * as Maybe from "../../Data/Maybe"
import { parseJSON } from "../../Data/String/JSON"
import { fmap, readFile, writeFile } from "../../System/IO"
import { user_data_path } from "../Selectors/envSelectors"
import { pipe, pipe_ } from "./pipe"
import { isObject } from "./typeCheckUtils"

const property_name = "update"

const file_path = join (user_data_path, "update.json")

/**
 * Check for the update file. If the `update` property in the JSON is set to
 * `True`, the IO returns `True`, otherwise `False`. Also returns `True` if
 * there is no file present.
 */
export const readUpdate =
  async () =>
    pipe_ (
      file_path,
      readFile,
      handleE,
      fmap (pipe (
        eitherToMaybe,
        Maybe.bindF (parseJSON),
        Maybe.bindF (Maybe.ensure (isObject)),
        Maybe.fmap (x => (x as any) [property_name] === true),
        Maybe.and
      ))
    )

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
