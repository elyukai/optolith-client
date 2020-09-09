/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { CantripSelectOptions, CombatTechniqueSelectOptions, CurseSelectOptions, LanguageScriptSelectOptions, SkillSelectOptions, SkillSpecializationSelectOptions, TerrainKnowledgeSelectOptions, VariantCombatTechniqueSelectOptions, VariantSkillSpecializationSelectOptions } from "../../../../../app/Database/Schema/ProfessionSelectOptions/ProfessionSelectOptions"
import { fromArray } from "../../../../Data/List"
import { Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { CantripsSelection } from "../../../Models/Wiki/professionSelections/CantripsSelection"
import { CombatTechniquesSelection } from "../../../Models/Wiki/professionSelections/CombatTechniquesSelection"
import { CursesSelection } from "../../../Models/Wiki/professionSelections/CursesSelection"
import { LanguagesScriptsSelection } from "../../../Models/Wiki/professionSelections/LanguagesScriptsSelection"
import { RemoveCombatTechniquesSelection, VariantCombatTechniquesSelection } from "../../../Models/Wiki/professionSelections/RemoveCombatTechniquesSelection"
import { RemoveSpecializationSelection, VariantSpecializationSelection } from "../../../Models/Wiki/professionSelections/RemoveSpecializationSelection"
import { CombatTechniquesSecondSelection } from "../../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection"
import { SkillsSelection } from "../../../Models/Wiki/professionSelections/SkillsSelection"
import { SpecializationSelection } from "../../../Models/Wiki/professionSelections/SpecializationSelection"
import { TerrainKnowledgeSelection } from "../../../Models/Wiki/professionSelections/TerrainKnowledgeSelection"


export const toSkillSpecializationSO : (x : SkillSpecializationSelectOptions)
                                     => Record<SpecializationSelection>
                                     = x => SpecializationSelection ({
                                              id: Nothing,
                                              sid: typeof x === "object" ? fromArray (x) : x,
                                            })


export const toSkillSpecializationSOV : (x : VariantSkillSpecializationSelectOptions)
                                      => VariantSpecializationSelection
                                      = x => typeof x === "boolean"
                                             ? RemoveSpecializationSelection
                                             : toSkillSpecializationSO (x)


export const toLanguageScriptSO : (x : LanguageScriptSelectOptions)
                                => Record<LanguagesScriptsSelection>
                                = x => LanguagesScriptsSelection ({
                                         id: Nothing,
                                         value: x,
                                       })


export const toCombatTechniqueSO : (x : CombatTechniqueSelectOptions)
                                 => Record<CombatTechniquesSelection>
                                 = x => CombatTechniquesSelection ({
                                          id: Nothing,
                                          amount: x.amount,
                                          value: x.value,
                                          second: typeof x.second === "object"
                                                  ? Just (
                                                      CombatTechniquesSecondSelection (x.second)
                                                    )
                                                  : Nothing,
                                          sid: fromArray (x.sid),
                                        })


export const toCombatTechniqueSOV : (x : VariantCombatTechniqueSelectOptions)
                                  => VariantCombatTechniquesSelection
                                  = x => typeof x === "boolean"
                                         ? RemoveCombatTechniquesSelection
                                         : CombatTechniquesSelection ({
                                             id: Nothing,
                                             amount: x.amount,
                                             value: x.value,
                                             second: typeof x.second === "object"
                                                     ? Just (
                                                         CombatTechniquesSecondSelection (x.second)
                                                       )
                                                     : Nothing,
                                             sid: fromArray (x.sid),
                                           })


export const toSkillSO : (x : SkillSelectOptions)
                       => Record<SkillsSelection>
                       = x => SkillsSelection ({
                                id: Nothing,
                                value: x.value,
                                gr: Maybe (x.gr),
                              })


export const toCantripSO : (x : CantripSelectOptions)
                         => Record<CantripsSelection>
                         = x => CantripsSelection ({
                                  id: Nothing,
                                  amount: x.amount,
                                  sid: fromArray (x.sid),
                                })


export const toCurseSO : (x : CurseSelectOptions)
                       => Record<CursesSelection>
                       = x => CursesSelection ({
                                id: Nothing,
                                value: x,
                              })


export const toTerrainKnowledgeSO : (x : TerrainKnowledgeSelectOptions)
                                  => Record<TerrainKnowledgeSelection>
                                  = x => TerrainKnowledgeSelection ({
                                           id: Nothing,
                                           sid: fromArray (x),
                                         })
