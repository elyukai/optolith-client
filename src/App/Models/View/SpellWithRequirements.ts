import { fromDefault } from "../../../Data/Record";
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent";
import { Spell } from "../Wiki/Spell";
import { SpellCombined } from "./SpellCombined";
import { IncreasableWithRequirements } from "./viewTypeHelpers";

export interface SpellWithRequirements extends SpellCombined, IncreasableWithRequirements { }

const SpellWithRequirements =
  fromDefault<SpellWithRequirements> ({
    wikiEntry: Spell .default,
    stateEntry: ActivatableSkillDependent .default,
    isIncreasable: false,
    isDecreasable: false,
  })
