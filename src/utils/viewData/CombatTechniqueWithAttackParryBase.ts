import { SkillDependent } from '../activeEntries/SkillDependent';
import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault } from '../structures/Record';
import { CombatTechnique } from '../wikiData/CombatTechnique';
import { CombatTechniqueCombined } from './CombatTechniqueCombined';

export interface CombatTechniqueWithAttackParryBase extends CombatTechniqueCombined {
  at: number
  pa: Maybe<number>
}

export const CombatTechniqueWithAttackParryBase =
  fromDefault<CombatTechniqueWithAttackParryBase> ({
    wikiEntry: CombatTechnique .default,
    stateEntry: SkillDependent .default,
    at: 0,
    pa: Nothing,
  })
