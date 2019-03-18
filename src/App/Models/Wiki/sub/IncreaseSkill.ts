import { fst, Pair, snd } from "../../../../Data/Pair";
import { fromDefault } from "../../../../Data/Record";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { prefixId } from "../../../Utilities/IDUtils";

export interface IncreaseSkill {
  id: string
  value: number
}

export const IncreaseSkill =
  fromDefault<IncreaseSkill> ({
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
