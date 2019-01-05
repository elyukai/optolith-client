import { fromDefault } from "../../../Data/Record";
import { SkillDependent } from "../ActiveEntries/SkillDependent";
import { Skill } from "../Wiki/Skill";
import { SkillCombined } from "./SkillCombined";
import { IncreasableWithRequirements } from "./viewTypeHelpers";

export interface SkillWithRequirements extends SkillCombined, IncreasableWithRequirements { }

const SkillWithRequirements =
  fromDefault<SkillWithRequirements> ({
    wikiEntry: Skill .default,
    stateEntry: SkillDependent .default,
    isIncreasable: false,
    isDecreasable: false,
  })
