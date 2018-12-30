import { SkillDependent } from '../activeEntries/SkillDependent';
import { fromDefault, Record } from '../structures/Record';
import { CombatTechnique } from '../wikiData/CombatTechnique';

export interface CombatTechniqueCombined {
  wikiEntry: Record<CombatTechnique>
  stateEntry: Record<SkillDependent>
}

export const CombatTechniqueCombined =
  fromDefault<CombatTechniqueCombined> ({
    wikiEntry: CombatTechnique .default,
    stateEntry: SkillDependent .default,
  })
