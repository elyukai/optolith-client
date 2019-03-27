import { fromDefault, makeLenses } from "../../../Data/Record";
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent";
import { LiturgicalChant } from "../Wiki/LiturgicalChant";
import { LiturgicalChantCombined } from "./LiturgicalChantCombined";
import { IncreasableWithRequirements } from "./viewTypeHelpers";

export interface LiturgicalChantWithRequirements
  extends LiturgicalChantCombined, IncreasableWithRequirements { }

export const LiturgicalChantWithRequirements =
  fromDefault<LiturgicalChantWithRequirements> ({
    wikiEntry: LiturgicalChant .default,
    stateEntry: ActivatableSkillDependent .default,
    isIncreasable: false,
    isDecreasable: false,
  })

export const LiturgicalChantWithRequirementsL = makeLenses (LiturgicalChantWithRequirements)
