import { fromJust, fromMaybe, isJust, Just, Nothing } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { EditPet, EditPetSafe } from "../Models/Hero/EditPet";
import { Pet } from "../Models/Hero/Pet";
import { pipe } from "./pipe";

const toStringM = fromMaybe ("")

export const toEditPet =
  (item: Record<Pet>): Record<EditPet> =>
    EditPet ({
      id: Just (Pet.AL.id (item)),
      name: Pet.AL.name (item),
      avatar: Pet.AL.avatar (item),
      size: toStringM (Pet.AL.size (item)),
      type: toStringM (Pet.AL.type (item)),
      attack: toStringM (Pet.AL.attack (item)),
      dp: toStringM (Pet.AL.dp (item)),
      reach: toStringM (Pet.AL.reach (item)),
      actions: toStringM (Pet.AL.actions (item)),
      talents: toStringM (Pet.AL.talents (item)),
      skills: toStringM (Pet.AL.skills (item)),
      notes: toStringM (Pet.AL.notes (item)),
      spentAp: toStringM (Pet.AL.spentAp (item)),
      totalAp: toStringM (Pet.AL.totalAp (item)),
      cou: toStringM (Pet.AL.cou (item)),
      sgc: toStringM (Pet.AL.sgc (item)),
      int: toStringM (Pet.AL.int (item)),
      cha: toStringM (Pet.AL.cha (item)),
      dex: toStringM (Pet.AL.dex (item)),
      agi: toStringM (Pet.AL.agi (item)),
      con: toStringM (Pet.AL.con (item)),
      str: toStringM (Pet.AL.str (item)),
      lp: toStringM (Pet.AL.lp (item)),
      ae: toStringM (Pet.AL.ae (item)),
      spi: toStringM (Pet.AL.spi (item)),
      tou: toStringM (Pet.AL.tou (item)),
      pro: toStringM (Pet.AL.pro (item)),
      ini: toStringM (Pet.AL.ini (item)),
      mov: toStringM (Pet.AL.mov (item)),
      at: toStringM (Pet.AL.at (item)),
      pa: toStringM (Pet.AL.pa (item)),
    })

const mtoString = (x: string) => x .length > 0 ? Just (x) : Nothing

export const fromEditPet =
  (item: Record<EditPetSafe>): Record<Pet> =>
    Pet ({
      id: fromJust (EditPet.AL.id (item) as Just<string>),
      name: Pet.AL.name (item),
      avatar: Pet.AL.avatar (item),
      size: mtoString (EditPet.AL.size (item)),
      type: mtoString (EditPet.AL.type (item)),
      attack: mtoString (EditPet.AL.attack (item)),
      dp: mtoString (EditPet.AL.dp (item)),
      reach: mtoString (EditPet.AL.reach (item)),
      actions: mtoString (EditPet.AL.actions (item)),
      talents: mtoString (EditPet.AL.talents (item)),
      skills: mtoString (EditPet.AL.skills (item)),
      notes: mtoString (EditPet.AL.notes (item)),
      spentAp: mtoString (EditPet.AL.spentAp (item)),
      totalAp: mtoString (EditPet.AL.totalAp (item)),
      cou: mtoString (EditPet.AL.cou (item)),
      sgc: mtoString (EditPet.AL.sgc (item)),
      int: mtoString (EditPet.AL.int (item)),
      cha: mtoString (EditPet.AL.cha (item)),
      dex: mtoString (EditPet.AL.dex (item)),
      agi: mtoString (EditPet.AL.agi (item)),
      con: mtoString (EditPet.AL.con (item)),
      str: mtoString (EditPet.AL.str (item)),
      lp: mtoString (EditPet.AL.lp (item)),
      ae: mtoString (EditPet.AL.ae (item)),
      spi: mtoString (EditPet.AL.spi (item)),
      tou: mtoString (EditPet.AL.tou (item)),
      pro: mtoString (EditPet.AL.pro (item)),
      ini: mtoString (EditPet.AL.ini (item)),
      mov: mtoString (EditPet.AL.mov (item)),
      at: mtoString (EditPet.AL.at (item)),
      pa: mtoString (EditPet.AL.pa (item)),
    })

export const ensureEditPetId =
  (x: Record<EditPet>): x is Record<EditPetSafe> =>
    pipe (EditPet.AL.id, isJust) (x)
