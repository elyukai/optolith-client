import { ActivatableSkillDependent } from "../activeEntries/ActivatableSkillDependent";
import { fromDefault, Record } from "../structures/Record";
import { LiturgicalChant } from "../wikiData/LiturgicalChant";

export interface LiturgicalChantCombined {
  wikiEntry: Record<LiturgicalChant>
  stateEntry: Record<ActivatableSkillDependent>
}

export const LiturgicalChantCombined =
  fromDefault<LiturgicalChantCombined> ({
    wikiEntry: LiturgicalChant .default,
    stateEntry: ActivatableSkillDependent .default,
  })
