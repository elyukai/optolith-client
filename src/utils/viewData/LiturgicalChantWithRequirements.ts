import { ActivatableSkillDependent } from '../activeEntries/activatableSkillDependent';
import { fromDefault, makeGetters } from '../structures/Record';
import { LiturgicalChantCreator } from '../wikiData/LiturgicalChantCreator';
import { LiturgicalChantCombined } from './LiturgicalChantCombined';
import { IncreasableWithRequirements } from './viewTypeHelpers';

export interface LiturgicalChantWithRequirements
  extends LiturgicalChantCombined, IncreasableWithRequirements { }

export const LiturgicalChantWithRequirements =
  fromDefault<LiturgicalChantWithRequirements> ({
    wikiEntry: LiturgicalChantCreator .default,
    stateEntry: ActivatableSkillDependent .default,
    isIncreasable: false,
    isDecreasable: false,
  })

export const LiturgicalChantWithRequirementsG = makeGetters (LiturgicalChantWithRequirements)
