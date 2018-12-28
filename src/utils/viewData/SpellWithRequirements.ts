import { ActivatableSkillDependent } from '../activeEntries/activatableSkillDependent';
import { fromDefault, makeGetters } from '../structures/Record';
import { SpellCreator } from '../wikiData/SpellCreator';
import { SpellCombined } from './SpellCombined';
import { IncreasableWithRequirements } from './viewTypeHelpers';

export interface SpellWithRequirements extends SpellCombined, IncreasableWithRequirements { }

const SpellWithRequirements =
  fromDefault<SpellWithRequirements> ({
    wikiEntry: SpellCreator .default,
    stateEntry: ActivatableSkillDependent .default,
    isIncreasable: false,
    isDecreasable: false,
  })

export const SpellWithRequirementsG = makeGetters (SpellWithRequirements)
