import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses } from "../../../Data/Record";

export interface PetBase {
  name: string
  avatar: Maybe<string>
}

export interface Pet extends PetBase {
  "@@name": "Pet"
  id: string
  size: Maybe<string>
  type: Maybe<string>
  attack: Maybe<string>
  dp: Maybe<string>
  reach: Maybe<string>
  actions: Maybe<string>
  talents: Maybe<string>
  skills: Maybe<string>
  notes: Maybe<string>
  spentAp: Maybe<string>
  totalAp: Maybe<string>
  cou: Maybe<string>
  sgc: Maybe<string>
  int: Maybe<string>
  cha: Maybe<string>
  dex: Maybe<string>
  agi: Maybe<string>
  con: Maybe<string>
  str: Maybe<string>
  lp: Maybe<string>
  ae: Maybe<string>
  spi: Maybe<string>
  tou: Maybe<string>
  pro: Maybe<string>
  ini: Maybe<string>
  mov: Maybe<string>
  at: Maybe<string>
  pa: Maybe<string>
}

export const Pet =
  fromDefault ("Pet")
              <Pet> ({
                id: "",
                name: "",
                avatar: Nothing,
                size: Nothing,
                type: Nothing,
                attack: Nothing,
                dp: Nothing,
                reach: Nothing,
                actions: Nothing,
                talents: Nothing,
                skills: Nothing,
                notes: Nothing,
                spentAp: Nothing,
                totalAp: Nothing,
                cou: Nothing,
                sgc: Nothing,
                int: Nothing,
                cha: Nothing,
                dex: Nothing,
                agi: Nothing,
                con: Nothing,
                str: Nothing,
                lp: Nothing,
                ae: Nothing,
                spi: Nothing,
                tou: Nothing,
                pro: Nothing,
                ini: Nothing,
                mov: Nothing,
                at: Nothing,
                pa: Nothing,
              })

export const PetL = makeLenses (Pet)
