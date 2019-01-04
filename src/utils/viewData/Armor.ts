import { Maybe, Nothing } from "../structures/Maybe";
import { fromDefault } from "../structures/Record";

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

export const Armor =
  fromDefault<Armor> ({
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
