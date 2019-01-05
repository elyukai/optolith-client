import { fromDefault, Record } from "../../../Data/Record";
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent";
import { LiturgicalChant } from "../Wiki/LiturgicalChant";

export interface LiturgicalChantCombined {
  wikiEntry: Record<LiturgicalChant>
  stateEntry: Record<ActivatableSkillDependent>
}

export const LiturgicalChantCombined =
  fromDefault<LiturgicalChantCombined> ({
    wikiEntry: LiturgicalChant .default,
    stateEntry: ActivatableSkillDependent .default,
  })
