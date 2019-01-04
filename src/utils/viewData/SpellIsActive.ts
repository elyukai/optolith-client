import { fromDefault, Record } from "../structures/Record";
import { Spell } from "../wikiData/Spell";
import { IsActive } from "./viewTypeHelpers";

export interface SpellIsActive extends IsActive {
  wikiEntry: Record<Spell>
}

const SpellIsActive =
  fromDefault<SpellIsActive> ({
    wikiEntry: Spell .default,
    active: false,
  })
