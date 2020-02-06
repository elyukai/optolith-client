import { join } from "path"
import { fmap } from "../../../Data/Functor"
import { splitOn, toArray } from "../../../Data/List"
import { IO, readFile } from "../../../System/IO"
import { app_path } from "../../Selectors/envSelectors"
import { pipe, pipe_ } from "../pipe"
import { map, mapM } from "./Array"
import { schema_ids } from "./SchemaMap"

const schemeIdToPath =
  pipe (splitOn ("/"), toArray, arr => join (app_path, "app", "Database", ...arr))

export const getAllSchemes = async (): IO<object[]> => pipe_ (
  schema_ids,
  map (schemeIdToPath),
  mapM (readFile),
  fmap (map<string, object> (JSON.parse))
)
