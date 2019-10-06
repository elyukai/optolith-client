import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent";
import { Spell } from "../Wiki/Spell";
import { IncreasableWithRequirements } from "./viewTypeHelpers";

export interface SpellWithRequirements extends IncreasableWithRequirements {
  "@@name": "SpellWithRequirements"
  wikiEntry: Record<Spell>
  stateEntry: Record<ActivatableSkillDependent>
  isUnfamiliar: boolean
}

export const SpellWithRequirements =
  fromDefault ("SpellWithRequirements")
              <SpellWithRequirements> ({
                wikiEntry: Spell .default,
                stateEntry: ActivatableSkillDependent .default,
                isIncreasable: false,
                isDecreasable: false,
                isUnfamiliar: false,
              })

const SWRA = SpellWithRequirements.A
const SA = Spell.A
const ASDA = ActivatableSkillDependent.A

export const SpellWithRequirementsA_ = {
  id: pipe (SWRA.wikiEntry, SA.id),
  name: pipe (SWRA.wikiEntry, SA.name),
  check: pipe (SWRA.wikiEntry, SA.check),
  checkmod: pipe (SWRA.wikiEntry, SA.checkmod),
  ic: pipe (SWRA.wikiEntry, SA.ic),
  gr: pipe (SWRA.wikiEntry, SA.gr),
  value: pipe (SWRA.stateEntry, ASDA.value),
  costShort: pipe (SWRA.wikiEntry, SA.costShort),
  castingTimeShort: pipe (SWRA.wikiEntry, SA.castingTimeShort),
  rangeShort: pipe (SWRA.wikiEntry, SA.rangeShort),
  durationShort: pipe (SWRA.wikiEntry, SA.durationShort),
  property: pipe (SWRA.wikiEntry, SA.property),
  tradition: pipe (SWRA.wikiEntry, SA.tradition),
}

export const SpellWithRequirementsL = makeLenses (SpellWithRequirements)
