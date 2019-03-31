import { fromDefault, makeLenses } from "../../../Data/Record";
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent";
import { Spell } from "../Wiki/Spell";
import { SpellCombined } from "./SpellCombined";
import { IncreasableWithRequirements } from "./viewTypeHelpers";

export interface SpellWithRequirements extends SpellCombined, IncreasableWithRequirements { }

export const SpellWithRequirements =
  fromDefault<SpellWithRequirements> ({
    wikiEntry: Spell .default,
    stateEntry: ActivatableSkillDependent .default,
    isIncreasable: false,
    isDecreasable: false,
  })

export const SpellWithRequirementsL = makeLenses (SpellWithRequirements)
