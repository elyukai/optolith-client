import { fromDefault, makeLenses } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
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

const LCWRA = LiturgicalChantWithRequirements.A
const LCA = LiturgicalChant.A
const ASDA = ActivatableSkillDependent.A

export const LiturgicalChantWithRequirementsA_ = {
  check: pipe (LCWRA.wikiEntry, LCA.check),
  checkmod: pipe (LCWRA.wikiEntry, LCA.checkmod),
  ic: pipe (LCWRA.wikiEntry, LCA.ic),
  gr: pipe (LCWRA.wikiEntry, LCA.gr),
  value: pipe (LCWRA.stateEntry, ASDA.value),
}

export const LiturgicalChantWithRequirementsL = makeLenses (LiturgicalChantWithRequirements)
