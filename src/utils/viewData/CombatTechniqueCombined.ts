import { CombatTechnique } from '../../types/wiki';
import { SkillDependent } from '../activeEntries/skillDependent';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { CombatTechniqueCreator } from '../wikiData/CombatTechniqueCreator';

export interface CombatTechniqueCombined {
  wikiEntry: Record<CombatTechnique>
  stateEntry: Record<SkillDependent>
}

export const CombatTechniqueCombined =
  fromDefault<CombatTechniqueCombined> ({
    wikiEntry: CombatTechniqueCreator .default,
    stateEntry: SkillDependent .default,
  })

export const CombatTechniqueCombinedG = makeGetters (CombatTechniqueCombined)
