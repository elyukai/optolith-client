import { IdPrefixes } from "../../../constants/IdPrefixes";
import { empty, List, map } from "../../../Data/List";
import { maybe } from "../../../Data/Maybe";
import { prefixId } from "../IDUtils";

export const maybePrefix =
  (p: IdPrefixes) =>
    maybe<List<string | number>, List<string>> (empty) (map (prefixId (p)))
