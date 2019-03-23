import { elem, OrderedSet } from "../../../Data/OrderedSet";
import { fromDefault, Record } from "../../../Data/Record";
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent";
import { Cantrip } from "../Wiki/Cantrip";
import { Spell } from "../Wiki/Spell";

export interface SpellCombined {
  wikiEntry: Record<Spell>
  stateEntry: Record<ActivatableSkillDependent>
}

export const SpellCombined =
  fromDefault<SpellCombined> ({
    wikiEntry: Spell .default,
    stateEntry: ActivatableSkillDependent .default,
  })

export const isSpellCombined =
  (x: Record<SpellCombined> | Record<Cantrip>): x is Record<SpellCombined> =>
    elem<keyof SpellCombined> ("wikiEntry") (x .keys as OrderedSet<keyof SpellCombined>)
