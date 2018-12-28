import { LiturgicalChant } from '../../types/wiki';
import { ActivatableSkillDependent } from '../activeEntries/activatableSkillDependent';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { LiturgicalChantCreator } from '../wikiData/LiturgicalChantCreator';

export interface LiturgicalChantCombined {
  wikiEntry: Record<LiturgicalChant>
  stateEntry: Record<ActivatableSkillDependent>
}

export const LiturgicalChantCombined =
  fromDefault<LiturgicalChantCombined> ({
    wikiEntry: LiturgicalChantCreator .default,
    stateEntry: ActivatableSkillDependent .default,
  })

export const LiturgicalChantCombinedG = makeGetters (LiturgicalChantCombined)
