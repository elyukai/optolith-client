import { ActivatableSkillDependent } from '../../types/data';
import { Spell } from '../../types/wiki';
import { ActivatableSkillDependentCreator } from '../activeEntries/activatableSkillDependent';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { SpellCreator } from '../wikiData/SpellCreator';

export interface SpellCombined {
  wikiEntry: Record<Spell>
  stateEntry: Record<ActivatableSkillDependent>
}

const SpellCombined =
  fromDefault<SpellCombined> ({
    wikiEntry: SpellCreator .default,
    stateEntry: ActivatableSkillDependentCreator .default,
  })

export const SpellCombinedG = makeGetters (SpellCombined)
