import { fromDefault, Record } from "../../../Data/Record";
import { Spell } from "../Wiki/Spell";
import { IsActive } from "./viewTypeHelpers";

export interface SpellIsActive extends IsActive {
  wikiEntry: Record<Spell>
}

const SpellIsActive =
  fromDefault<SpellIsActive> ({
    wikiEntry: Spell .default,
    active: false,
  })
