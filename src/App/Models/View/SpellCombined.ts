import { fromDefault, Record } from "../../../Data/Record";
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent";
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
