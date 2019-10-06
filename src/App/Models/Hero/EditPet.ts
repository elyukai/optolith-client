import { Just, Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses } from "../../../Data/Record";
import { PetBase } from "./Pet";

export interface EditPet extends PetBase {
  "@@name": "EditPet"
  id: Maybe<string>;
  size: string;
  type: string;
  attack: string;
  dp: string;
  reach: string;
  actions: string;
  talents: string;
  skills: string;
  notes: string;
  spentAp: string;
  totalAp: string;
  cou: string;
  sgc: string;
  int: string;
  cha: string;
  dex: string;
  agi: string;
  con: string;
  str: string;
  lp: string;
  ae: string;
  spi: string;
  tou: string;
  pro: string;
  ini: string;
  mov: string;
  at: string;
  pa: string;
}

export interface EditPetSafe extends EditPet {
  id: Just<string>
}

export const EditPet =
  fromDefault ("EditPet")
              <EditPet> ({
                id: Nothing,
                name: "",
                avatar: Nothing,
                size: "",
                type: "",
                attack: "",
                dp: "",
                reach: "",
                actions: "",
                talents: "",
                skills: "",
                notes: "",
                spentAp: "",
                totalAp: "",
                cou: "",
                sgc: "",
                int: "",
                cha: "",
                dex: "",
                agi: "",
                con: "",
                str: "",
                lp: "",
                ae: "",
                spi: "",
                tou: "",
                pro: "",
                ini: "",
                mov: "",
                at: "",
                pa: "",
              })

export const EditPetL = makeLenses (EditPet)
