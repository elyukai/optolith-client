import { SkillDependent } from '../activeEntries/skillDependent';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';
import { CombatTechniqueCreator } from '../wikiData/CombatTechniqueCreator';
import { CombatTechniqueWithAttackParryBase } from './CombatTechniqueWithAttackParryBase';

export interface CombatTechniqueWithRequirements extends CombatTechniqueWithAttackParryBase {
  max: number
  min: number
}

export const CombatTechniqueWithRequirements =
  fromDefault<CombatTechniqueWithRequirements> ({
    wikiEntry: CombatTechniqueCreator .default,
    stateEntry: SkillDependent .default,
    at: 0,
    pa: Nothing,
    max: 0,
    min: 0,
  })

export const CombatTechniqueWithRequirementsG = makeGetters (CombatTechniqueWithRequirements)
