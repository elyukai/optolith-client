import { Maybe } from "../../../Data/Maybe"

export interface Armor {
  id: string
  name: string
  st: Maybe<number>
  loss: Maybe<number>
  pro: Maybe<number>
  enc: Maybe<number>
  mov: number
  ini: number
  weight: Maybe<number>
  where: Maybe<string>
}
