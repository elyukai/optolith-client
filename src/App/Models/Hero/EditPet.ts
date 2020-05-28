import { PetBase } from "./Pet"

export interface EditPet extends PetBase {
  id?: string
  size: string
  type: string
  attack: string
  dp: string
  reach: string
  actions: string
  talents: string
  skills: string
  notes: string
  spentAp: string
  totalAp: string
  cou: string
  sgc: string
  int: string
  cha: string
  dex: string
  agi: string
  con: string
  str: string
  lp: string
  ae: string
  spi: string
  tou: string
  pro: string
  ini: string
  mov: string
  at: string
  pa: string
}

export interface EditPetSafe extends EditPet {
  id: string
}
