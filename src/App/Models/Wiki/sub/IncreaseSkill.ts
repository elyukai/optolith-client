import { fromDefault } from "../../../../Data/Record";
import { fst, Pair, snd } from "../../../../Data/Tuple";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { prefixId } from "../../../Utilities/IDUtils";

export interface IncreaseSkill {
  "@@name": "IncreaseSkill"
  id: string
  value: number
}

export const IncreaseSkill =
  fromDefault ("IncreaseSkill")
              <IncreaseSkill> ({
                id: "",
                value: 0,
              })

export const pairToIncreaseSkill =
  (prefix: IdPrefixes) =>
  (p: Pair<number, number>) =>
    IncreaseSkill ({
      id: prefixId (prefix) (fst (p)),
      value: snd (p),
    })
