import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent";
import { LiturgicalChant } from "../Wiki/LiturgicalChant";
import { IncreasableWithRequirements } from "./viewTypeHelpers";

export interface LiturgicalChantWithRequirements extends IncreasableWithRequirements {
    "@@name": "LiturgicalChantWithRequirements"
    wikiEntry: Record<LiturgicalChant>
    stateEntry: Record<ActivatableSkillDependent>
  }

export const LiturgicalChantWithRequirements =
  fromDefault ("LiturgicalChantWithRequirements")
              <LiturgicalChantWithRequirements> ({
                wikiEntry: LiturgicalChant .default,
                stateEntry: ActivatableSkillDependent .default,
                isIncreasable: false,
                isDecreasable: false,
              })

const LCWRA = LiturgicalChantWithRequirements.A
const LCA = LiturgicalChant.A
const ASDA = ActivatableSkillDependent.A

export const LiturgicalChantWithRequirementsA_ = {
  id: pipe (LCWRA.wikiEntry, LCA.id),
  name: pipe (LCWRA.wikiEntry, LCA.name),
  check: pipe (LCWRA.wikiEntry, LCA.check),
  checkmod: pipe (LCWRA.wikiEntry, LCA.checkmod),
  ic: pipe (LCWRA.wikiEntry, LCA.ic),
  gr: pipe (LCWRA.wikiEntry, LCA.gr),
  value: pipe (LCWRA.stateEntry, ASDA.value),
  costShort: pipe (LCWRA.wikiEntry, LCA.costShort),
  castingTimeShort: pipe (LCWRA.wikiEntry, LCA.castingTimeShort),
  rangeShort: pipe (LCWRA.wikiEntry, LCA.rangeShort),
  durationShort: pipe (LCWRA.wikiEntry, LCA.durationShort),
  aspects: pipe (LCWRA.wikiEntry, LCA.aspects),
}

export const LiturgicalChantWithRequirementsL = makeLenses (LiturgicalChantWithRequirements)
