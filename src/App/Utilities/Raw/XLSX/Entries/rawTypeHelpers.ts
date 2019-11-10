import { RawProfessionRequireActivatable, RawRequireActivatable } from "./Prerequisites/RawActivatableRequirement";
import { RawCultureRequirement } from "./Prerequisites/RawCultureRequirement";
import { RawProfessionRequireIncreasable, RawRequireIncreasable } from "./Prerequisites/RawIncreasableRequirement";
import { RawPactRequirement } from "./Prerequisites/RawPactRequirement";
import { RawRequirePrimaryAttribute } from "./Prerequisites/RawPrimaryAttributeRequirement";
import { RawRaceRequirement } from "./Prerequisites/RawRaceRequirement";
import { RawSexRequirement } from "./Prerequisites/RawSexRequirement";
import { RawSocialPrerequisite } from "./Prerequisites/RawSocialPrerequisite";
import { RawCantripsSelection } from "./ProfessionSelections/RawCantripsSelection";
import { RawCombatTechniquesSelection } from "./ProfessionSelections/RawCombatTechniquesSelection";
import { RawCursesSelection } from "./ProfessionSelections/RawCursesSelection";
import { RawLanguagesScriptsSelection } from "./ProfessionSelections/RawLanguagesScriptsSelection";
import { RawCombatTechniquesSecondSelection } from "./ProfessionSelections/RawSecondCombatTechniquesSelection";
import { RawSkillsSelection } from "./ProfessionSelections/RawSkillsSelection";
import { RawSpecialAbilitySelection } from "./ProfessionSelections/RawSpecialAbilitySelection";
import { RawSpecializationSelection } from "./ProfessionSelections/RawSpecializationSelection";
import { RawTerrainKnowledgeSelection } from "./ProfessionSelections/RawTerrainKnowledgeSelection";
import { RawVariantCombatTechniquesSelection } from "./ProfessionSelections/RemoveRawCombatTechniquesSelection";
import { RawVariantCombatTechniquesSecondSelection } from "./ProfessionSelections/RemoveRawSecondCombatTechniquesSelection";
import { RawVariantSpecializationSelection } from "./ProfessionSelections/RemoveRawSpecializationSelection";

export type AnyRawProfessionSelection = RawSpecializationSelection
                                      | RawLanguagesScriptsSelection
                                      | RawCombatTechniquesSelection
                                      | RawCombatTechniquesSecondSelection
                                      | RawCantripsSelection
                                      | RawCursesSelection
                                      | RawSkillsSelection
                                      | RawTerrainKnowledgeSelection
                                      | RawSpecialAbilitySelection

export type AnyRawProfessionVariantSelection = RawVariantSpecializationSelection
                                             | RawLanguagesScriptsSelection
                                             | RawVariantCombatTechniquesSelection
                                             | RawVariantCombatTechniquesSecondSelection
                                             | RawCantripsSelection
                                             | RawCursesSelection
                                             | RawSkillsSelection
                                             | RawTerrainKnowledgeSelection
                                             | RawSpecialAbilitySelection

export type RawSID = string | number | number[]

export type RawProfessionDependency = RawSexRequirement
                                    | RawRaceRequirement
                                    | RawCultureRequirement

export type RawProfessionPrerequisite = RawProfessionRequireActivatable
                                      | RawProfessionRequireIncreasable

export type AllRawRequirementObjects = RawProfessionDependency
                                     | RawRequireActivatable
                                     | RawRequireIncreasable
                                     | RawRequirePrimaryAttribute
                                     | RawPactRequirement
                                     | RawSocialPrerequisite

export type AllRawRequirements = "RCP" | AllRawRequirementObjects
