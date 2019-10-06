import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";

export interface Armor {
  "@@name": "Armor"
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

export const Armor =
  fromDefault ("Armor")
              <Armor> ({
                id: "",
                name: "",
                st: Nothing,
                loss: Nothing,
                pro: Nothing,
                enc: Nothing,
                mov: 0,
                ini: 0,
                weight: Nothing,
                where: Nothing,
              })
