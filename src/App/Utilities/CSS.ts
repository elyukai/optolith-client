import { intercalate, List } from "../../Data/List"
import { catMaybes, Maybe } from "../../Data/Maybe"
import { pipe } from "./pipe"

export const classListMaybe: (xs: List<Maybe<string>>) => string =
  pipe (catMaybes, intercalate (" "))
