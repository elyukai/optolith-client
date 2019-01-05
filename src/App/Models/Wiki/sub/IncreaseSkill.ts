import { fromDefault } from "../../../../Data/Record";

export interface IncreaseSkill {
  id: string
  value: number
}

export const IncreaseSkill =
  fromDefault<IncreaseSkill> ({
    id: "",
    value: 0,
  })
