import { pipe } from 'ramda';
import { SkillDependent, SkillDependentG } from '../activeEntries/SkillDependent';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { Skill, SkillG } from '../wikiData/Skill';

export interface SkillCombined {
  wikiEntry: Record<Skill>
  stateEntry: Record<SkillDependent>
}

export const SkillCombined =
  fromDefault<SkillCombined> ({
    wikiEntry: Skill .default,
    stateEntry: SkillDependent .default,
  })

const getters = makeGetters (SkillCombined)

const { wikiEntry, stateEntry } = getters
const { id, check } = SkillG
const { value, dependencies } = SkillDependentG

export const SkillCombinedG = {
  ...getters,
  id: pipe (wikiEntry, id),
  check: pipe (wikiEntry, check),
  value: pipe (stateEntry, value),
  dependencies: pipe (stateEntry, dependencies),
}
