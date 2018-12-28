import { SkillDependent } from '../activeEntries/SkillDependent';
import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';
import { CombatTechniqueCreator } from '../wikiData/CombatTechniqueCreator';
import { CombatTechniqueCombined } from './CombatTechniqueCombined';

export interface CombatTechniqueWithAttackParryBase extends CombatTechniqueCombined {
  at: number
  pa: Maybe<number>
}

export const CombatTechniqueWithAttackParryBase =
  fromDefault<CombatTechniqueWithAttackParryBase> ({
    wikiEntry: CombatTechniqueCreator .default,
    stateEntry: SkillDependent .default,
    at: 0,
    pa: Nothing,
  })

export const CombatTechniqueWithAttackParryBaseG = makeGetters (CombatTechniqueWithAttackParryBase)
