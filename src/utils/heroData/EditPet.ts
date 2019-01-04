import { Maybe, Nothing } from "../structures/Maybe";
import { fromDefault } from "../structures/Record";
import { PetBase } from "./Pet";

export interface EditPet extends PetBase {
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

export const EditPet =
  fromDefault<EditPet> ({
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
