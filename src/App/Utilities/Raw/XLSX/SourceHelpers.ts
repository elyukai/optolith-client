import { empty, List, map, replaceStrRx } from "../../../../Data/List";
import { maybe } from "../../../../Data/Maybe";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { prefixId } from "../../IDUtils";

export const maybePrefix =
  (p: IdPrefixes) =>
    maybe<List<string>> (empty) (map<string | number, string> (prefixId (p)))

export const modifyNegIntNoBreak = replaceStrRx (/[-−–](?<num>\d+)/gu) ("−\u2060$<num>")
