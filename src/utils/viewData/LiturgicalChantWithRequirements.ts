import { ActivatableSkillDependent } from '../activeEntries/ActivatableSkillDependent';
import { fromDefault, makeGetters } from '../structures/Record';
import { LiturgicalChant } from '../wikiData/LiturgicalChant';
import { LiturgicalChantCombined } from './LiturgicalChantCombined';
import { IncreasableWithRequirements } from './viewTypeHelpers';

export interface LiturgicalChantWithRequirements
  extends LiturgicalChantCombined, IncreasableWithRequirements { }

export const LiturgicalChantWithRequirements =
  fromDefault<LiturgicalChantWithRequirements> ({
    wikiEntry: LiturgicalChant .default,
    stateEntry: ActivatableSkillDependent .default,
    isIncreasable: false,
    isDecreasable: false,
  })

export const LiturgicalChantWithRequirementsG = makeGetters (LiturgicalChantWithRequirements)
