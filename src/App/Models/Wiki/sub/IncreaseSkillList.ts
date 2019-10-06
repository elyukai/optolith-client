import { isList, List, map } from "../../../../Data/List";
import { fromDefault } from "../../../../Data/Record";
import { fst, Pair, snd } from "../../../../Data/Tuple";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { prefixId } from "../../../Utilities/IDUtils";
import { pairToIncreaseSkill } from "./IncreaseSkill";

export interface IncreaseSkillList {
  "@@name": "IncreaseSkillList"
  id: List<string>
  value: number
}

export const IncreaseSkillList =
  fromDefault ("IncreaseSkillList")
              <IncreaseSkillList> ({
                id: List.empty,
                value: 0,
              })

export const pairToIncreaseSkillList =
  (prefix: IdPrefixes) =>
  (p: Pair<List<number>, number>) =>
    IncreaseSkillList ({
      id: map (prefixId (prefix)) (fst (p)),
      value: snd (p),
    })

export const pairToIncreaseSkillOrList =
  (prefix: IdPrefixes) =>
  (p: Pair<number | List<number>, number>) =>
    isList (fst (p))
      ? pairToIncreaseSkillList (prefix) (p as Pair<List<number>, number>)
      : pairToIncreaseSkill (prefix) (p as Pair<number, number>)
