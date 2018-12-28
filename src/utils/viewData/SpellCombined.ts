import { Spell } from '../../types/wiki';
import { ActivatableSkillDependent } from '../activeEntries/activatableSkillDependent';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { SpellCreator } from '../wikiData/SpellCreator';

export interface SpellCombined {
  wikiEntry: Record<Spell>
  stateEntry: Record<ActivatableSkillDependent>
}

const SpellCombined =
  fromDefault<SpellCombined> ({
    wikiEntry: SpellCreator .default,
    stateEntry: ActivatableSkillDependent .default,
  })

export const SpellCombinedG = makeGetters (SpellCombined)
