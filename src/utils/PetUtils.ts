import { EditPet } from './heroData/EditPet';
import { Pet } from './heroData/Pet';
import { fromMaybe, Just, Nothing } from './structures/Maybe';
import { Record } from './structures/Record';

const toStringM = fromMaybe ('')

export const toEditPet =
  (item: Record<Pet>): Record<EditPet> =>
    EditPet ({
      id: Just (Pet.A.id (item)),
      name: Pet.A.name (item),
      avatar: Pet.A.avatar (item),
      size: toStringM (Pet.A.size (item)),
      type: toStringM (Pet.A.type (item)),
      attack: toStringM (Pet.A.attack (item)),
      dp: toStringM (Pet.A.dp (item)),
      reach: toStringM (Pet.A.reach (item)),
      actions: toStringM (Pet.A.actions (item)),
      talents: toStringM (Pet.A.talents (item)),
      skills: toStringM (Pet.A.skills (item)),
      notes: toStringM (Pet.A.notes (item)),
      spentAp: toStringM (Pet.A.spentAp (item)),
      totalAp: toStringM (Pet.A.totalAp (item)),
      cou: toStringM (Pet.A.cou (item)),
      sgc: toStringM (Pet.A.sgc (item)),
      int: toStringM (Pet.A.int (item)),
      cha: toStringM (Pet.A.cha (item)),
      dex: toStringM (Pet.A.dex (item)),
      agi: toStringM (Pet.A.agi (item)),
      con: toStringM (Pet.A.con (item)),
      str: toStringM (Pet.A.str (item)),
      lp: toStringM (Pet.A.lp (item)),
      ae: toStringM (Pet.A.ae (item)),
      spi: toStringM (Pet.A.spi (item)),
      tou: toStringM (Pet.A.tou (item)),
      pro: toStringM (Pet.A.pro (item)),
      ini: toStringM (Pet.A.ini (item)),
      mov: toStringM (Pet.A.mov (item)),
      at: toStringM (Pet.A.at (item)),
      pa: toStringM (Pet.A.pa (item)),
    })

const mtoString = (x: string) => x .length > 0 ? Just (x) : Nothing

export const fromEditPet =
  (id: string) =>
  (item: Record<EditPet>): Record<Pet> =>
    Pet ({
      id,
      name: Pet.A.name (item),
      avatar: Pet.A.avatar (item),
      size: mtoString (EditPet.A.size (item)),
      type: mtoString (EditPet.A.type (item)),
      attack: mtoString (EditPet.A.attack (item)),
      dp: mtoString (EditPet.A.dp (item)),
      reach: mtoString (EditPet.A.reach (item)),
      actions: mtoString (EditPet.A.actions (item)),
      talents: mtoString (EditPet.A.talents (item)),
      skills: mtoString (EditPet.A.skills (item)),
      notes: mtoString (EditPet.A.notes (item)),
      spentAp: mtoString (EditPet.A.spentAp (item)),
      totalAp: mtoString (EditPet.A.totalAp (item)),
      cou: mtoString (EditPet.A.cou (item)),
      sgc: mtoString (EditPet.A.sgc (item)),
      int: mtoString (EditPet.A.int (item)),
      cha: mtoString (EditPet.A.cha (item)),
      dex: mtoString (EditPet.A.dex (item)),
      agi: mtoString (EditPet.A.agi (item)),
      con: mtoString (EditPet.A.con (item)),
      str: mtoString (EditPet.A.str (item)),
      lp: mtoString (EditPet.A.lp (item)),
      ae: mtoString (EditPet.A.ae (item)),
      spi: mtoString (EditPet.A.spi (item)),
      tou: mtoString (EditPet.A.tou (item)),
      pro: mtoString (EditPet.A.pro (item)),
      ini: mtoString (EditPet.A.ini (item)),
      mov: mtoString (EditPet.A.mov (item)),
      at: mtoString (EditPet.A.at (item)),
      pa: mtoString (EditPet.A.pa (item)),
    })
