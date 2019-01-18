import { RawProfessionRequireActivatable, RawRequireActivatable } from './Prerequisites/ActivatableRequirement';
import { RawCultureRequirement } from './Prerequisites/CultureRequirement';
import { RawProfessionRequireIncreasable, RawRequireIncreasable } from './Prerequisites/IncreasableRequirement';
import { RawPactRequirement } from './Prerequisites/PactRequirement';
import { RawRequirePrimaryAttribute } from './Prerequisites/PrimaryAttributeRequirement';
import { RawRaceRequirement } from './Prerequisites/RaceRequirement';
import { RawSexRequirement } from './Prerequisites/SexRequirement';
import { RawCantripsSelection } from "./ProfessionSelections/CantripsSelection";
import { RawCombatTechniquesSelection } from "./ProfessionSelections/CombatTechniquesSelection";
import { RawCursesSelection } from "./ProfessionSelections/CursesSelection";
import { RawLanguagesScriptsSelection } from "./ProfessionSelections/LanguagesScriptsSelection";
import { RawVariantCombatTechniquesSelection } from "./ProfessionSelections/RemoveCombatTechniquesSelection";
import { RawVariantCombatTechniquesSecondSelection } from "./ProfessionSelections/RemoveSecondCombatTechniquesSelection";
import { RawVariantSpecializationSelection } from "./ProfessionSelections/RemoveSpecializationSelection";
import { RawCombatTechniquesSecondSelection } from "./ProfessionSelections/SecondCombatTechniquesSelection";
import { RawSkillsSelection } from "./ProfessionSelections/SkillsSelection";
import { RawSpecializationSelection } from "./ProfessionSelections/SpecializationSelection";
import { RawTerrainKnowledgeSelection } from "./ProfessionSelections/TerrainKnowledgeSelection";

export type AnyRawProfessionSelection = RawSpecializationSelection
                                      | RawLanguagesScriptsSelection
                                      | RawCombatTechniquesSelection
                                      | RawCombatTechniquesSecondSelection
                                      | RawCantripsSelection
                                      | RawCursesSelection
                                      | RawSkillsSelection
                                      | RawTerrainKnowledgeSelection

export type AnyRawProfessionVariantSelection = RawVariantSpecializationSelection
                                             | RawLanguagesScriptsSelection
                                             | RawVariantCombatTechniquesSelection
                                             | RawVariantCombatTechniquesSecondSelection
                                             | RawCantripsSelection
                                             | RawCursesSelection
                                             | RawSkillsSelection
                                             | RawTerrainKnowledgeSelection

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

export type AllRawRequirements = 'RCP' | AllRawRequirementObjects
