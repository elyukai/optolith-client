/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { Either, fromRight_, isLeft, Left, lefts, Right } from "../../../Data/Either"
import { concatMap, fromArray, List, toArray } from "../../../Data/List"
import { OrderedMap } from "../../../Data/OrderedMap"
import { Record, RecordIBase } from "../../../Data/Record"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { pipe_ } from "../pipe"
import { toAdvantages } from "./Entries/ToAdvantages"
import { toAnimistForces } from "./Entries/ToAnimistForces"
import { toArcaneBardTraditions } from "./Entries/ToArcaneBardTraditions"
import { toArcaneDancerTraditions } from "./Entries/ToArcaneDancerTraditions"
import { toArmorTypes } from "./Entries/ToArmorTypes"
import { toAspects } from "./Entries/ToAspects"
import { toAttributes } from "./Entries/ToAttributes"
import { toBlessedTraditions } from "./Entries/ToBlessedTraditions"
import { toBlessings } from "./Entries/ToBlessings"
import { toBooks } from "./Entries/ToBooks"
import { toBrews } from "./Entries/ToBrews"
import { toCantrips } from "./Entries/ToCantrips"
import { toCombatSpecialAbilityGroups } from "./Entries/ToCombatSpecialAbilityGroups"
import { toCombatTechniqueGroups } from "./Entries/ToCombatTechniqueGroups"
import { toCombatTechniques } from "./Entries/ToCombatTechniques"
import { toConditions } from "./Entries/ToConditions"
import { toCultures } from "./Entries/ToCultures"
import { toCurses } from "./Entries/ToCurses"
import { toDerivedCharacteristics } from "./Entries/ToDerivedCharacteristics"
import { toDisadvantages } from "./Entries/ToDisadvantages"
import { toDominationRituals } from "./Entries/ToDominationRituals"
import { toElvenMagicalSongs } from "./Entries/ToElvenMagicalSongs"
import { toItemTemplates } from "./Entries/ToEquipment"
import { toEquipmentGroups } from "./Entries/ToEquipmentGroups"
import { toEquipmentPackages } from "./Entries/ToEquipmentPackages"
import { toExperienceLevels } from "./Entries/ToExperienceLevels"
import { toEyeColors } from "./Entries/ToEyeColors"
import { toFocusRules } from "./Entries/ToFocusRules"
import { toGeodeRituals } from "./Entries/ToGeodeRituals"
import { toHairColors } from "./Entries/ToHairColors"
import { toLiturgicalChantEnhancements } from "./Entries/ToLiturgicalChantEnhancements"
import { toLiturgicalChantGroups } from "./Entries/ToLiturgicalChantGroups"
import { toLiturgicalChants } from "./Entries/ToLiturgicalChants"
import { toMagicalDances } from "./Entries/ToMagicalDances"
import { toMagicalMelodies } from "./Entries/ToMagicalMelodies"
import { toMagicalTraditions } from "./Entries/ToMagicalTraditions"
import { toOptionalRules } from "./Entries/ToOptionalRules"
import { toPacts } from "./Entries/ToPacts"
import { toProfessions } from "./Entries/ToProfessions"
import { toProfessionVariants } from "./Entries/ToProfessionVariants"
import { toProperties } from "./Entries/ToProperties"
import { toRaces } from "./Entries/ToRaces"
import { toRaceVariants } from "./Entries/ToRaceVariants"
import { toReaches } from "./Entries/ToReaches"
import { toRogueSpells } from "./Entries/ToRogueSpells"
import { toSkills } from "./Entries/ToSkills"
import { toSocialStatuses } from "./Entries/ToSocialStatuses"
import { toSpecialAbilities } from "./Entries/ToSpecialAbilities"
import { toSpellEnhancements } from "./Entries/ToSpellEnhancements"
import { toSpellGroups } from "./Entries/ToSpellGroups"
import { toSpells } from "./Entries/ToSpells"
import { toStates } from "./Entries/ToStates"
import { toSubjects } from "./Entries/ToSubjects"
import { toTribes } from "./Entries/ToTribes"
import { toUI } from "./Entries/ToUI"
import { toZibiljaRituals } from "./Entries/ToZibiljaRituals"
import { YamlNameMap } from "./SchemaMap"


/**
 * Takes the map of all loaded data and either returns a generated `OrderedMap`
 * from the data used in the function or returns a list of errors that happened
 * while trying to generate the `OrderedMap`.
 */
export type YamlFileConverter<K, V>
  = (yamlMap : YamlNameMap) => Either<Error[], OrderedMap<K, V>>


/**
 * Convert a pair of matching objects from the YAML files into a key-value pair
 * where the key is the ID of the object and the value is the actual object.
 */
export type YamlPairConverter<U, L, K, R extends RecordIBase<any>>
  = (x : [U, L]) => [K, Record<R>]


/**
 * Convert a pair of matching objects from the YAML files into a `Right` with
 * key-value pair where the key is the ID of the object and the value is the
 * actual object. If at least one error happens in this function, a `Left` with
 * a list of all errors is returned instead.
 */
export type YamlPairConverterE<U, L, K, R extends RecordIBase<any>>
  = (x : [U, L]) => Either<Error[], [K, Record<R>]>


export const toWiki : (locale : string) => (mp : YamlNameMap) => Either<Error[], WikiModelRecord>
                    = locale => mp => {
                        const eanimistForces = toAnimistForces (mp)
                        const earcaneBardTraditions = toArcaneBardTraditions (mp)
                        const earcaneDancerTraditions = toArcaneDancerTraditions (mp)
                        const earmorTypes = toArmorTypes (mp)
                        const easpects = toAspects (mp)
                        const eattributes = toAttributes (mp)
                        console.log ("attributes done")
                        const eblessedTraditions = toBlessedTraditions (mp)
                        console.log ("blessedTraditions done")
                        const eblessings = toBlessings (mp)
                        console.log ("blessings done")
                        const ebooks = toBooks (mp)
                        console.log ("books done")
                        const ebrews = toBrews (mp)
                        console.log ("brews done")
                        const ecantrips = toCantrips (mp)
                        console.log ("cantrips done")
                        const ecombatSpecialAbilityGroups = toCombatSpecialAbilityGroups (mp)
                        console.log ("combatSpecialAbilityGroups done")
                        const ecombatTechniqueGroups = toCombatTechniqueGroups (mp)
                        console.log ("combatTechniqueGroups done")
                        const ecombatTechniques = toCombatTechniques (mp)
                        console.log ("combatTechniques done")
                        const econditions = toConditions (mp)
                        console.log ("conditions done")
                        const ecultures = toCultures (mp)
                        console.log ("cultures done")
                        const ecurses = toCurses (mp)
                        console.log ("curses done")
                        const ederivedCharacteristics = toDerivedCharacteristics (mp)
                        console.log ("derivedCharacteristics done")
                        const edominationRituals = toDominationRituals (mp)
                        console.log ("dominationRituals done")
                        const eelvenMagicalSongs = toElvenMagicalSongs (mp)
                        console.log ("elvenMagicalSongs done")
                        const eitemTemplates = toItemTemplates (mp)
                        console.log ("itemTemplates done")
                        const eequipmentGroups = toEquipmentGroups (mp)
                        console.log ("equipmentGroups done")
                        const eequipmentPackages = toEquipmentPackages (mp)
                        console.log ("equipmentPackages done")
                        const eexperienceLevels = toExperienceLevels (mp)
                        console.log ("experienceLevels done")
                        const eeyeColors = toEyeColors (mp)
                        console.log ("eyeColors done")
                        const efocusRules = toFocusRules (mp)
                        console.log ("focusRules done")
                        const egeodeRituals = toGeodeRituals (mp)
                        console.log ("geodeRituals done")
                        const ehairColors = toHairColors (mp)
                        console.log ("hairColors done")
                        const eliturgicalChantEnhancements = toLiturgicalChantEnhancements (mp)
                        console.log ("liturgicalChantEnhancements done")
                        const eliturgicalChantGroups = toLiturgicalChantGroups (mp)
                        console.log ("liturgicalChantGroups done")
                        const eliturgicalChants = toLiturgicalChants (mp)
                        console.log ("liturgicalChants done")
                        const emagicalDances = toMagicalDances (mp)
                        console.log ("magicalDances done")
                        const emagicalMelodies = toMagicalMelodies (mp)
                        console.log ("magicalMelodies done")
                        const emagicalTraditions = toMagicalTraditions (mp)
                        console.log ("magicalTraditions done")
                        const eoptionalRules = toOptionalRules (mp)
                        console.log ("optionalRules done")
                        const epacts = toPacts (mp)
                        console.log ("pacts done")
                        const eprofessions = toProfessions (mp)
                        console.log ("professions done")
                        const eprofessionVariants = toProfessionVariants (mp)
                        console.log ("professionVariants done")
                        const eproperties = toProperties (mp)
                        console.log ("properties done")
                        const eraces = toRaces (mp)
                        console.log ("races done")
                        const eraceVariants = toRaceVariants (mp)
                        console.log ("raceVariants done")
                        const ereaches = toReaches (mp)
                        console.log ("reaches done")
                        const erogueSpells = toRogueSpells (mp)
                        console.log ("rogueSpells done")
                        const eskills = toSkills (mp)
                        console.log ("skills done")
                        const esocialStatuses = toSocialStatuses (mp)
                        console.log ("socialStatuses done")
                        const espellEnhancements = toSpellEnhancements (mp)
                        console.log ("spellEnhancements done")
                        const espellGroups = toSpellGroups (mp)
                        console.log ("spellGroups done")
                        const espells = toSpells (mp)
                        console.log ("spells done")
                        const estates = toStates (mp)
                        console.log ("states done")
                        const esubjects = toSubjects (mp)
                        console.log ("subjects done")
                        const etribes = toTribes (mp)
                        console.log ("tribes done")
                        const ui = toUI (locale) (mp)
                        console.log ("i done")
                        const ezibiljaRituals = toZibiljaRituals (mp)
                        console.log ("zibiljaRituals done")

                        if (isLeft (eanimistForces)
                            || isLeft (earcaneBardTraditions)
                            || isLeft (earcaneDancerTraditions)
                            || isLeft (earmorTypes)
                            || isLeft (easpects)
                            || isLeft (eattributes)
                            || isLeft (eblessedTraditions)
                            || isLeft (eblessings)
                            || isLeft (ebooks)
                            || isLeft (ebrews)
                            || isLeft (ecantrips)
                            || isLeft (ecombatSpecialAbilityGroups)
                            || isLeft (ecombatTechniqueGroups)
                            || isLeft (ecombatTechniques)
                            || isLeft (econditions)
                            || isLeft (ecultures)
                            || isLeft (ecurses)
                            || isLeft (ederivedCharacteristics)
                            || isLeft (edominationRituals)
                            || isLeft (eelvenMagicalSongs)
                            || isLeft (eitemTemplates)
                            || isLeft (eequipmentGroups)
                            || isLeft (eequipmentPackages)
                            || isLeft (eexperienceLevels)
                            || isLeft (eeyeColors)
                            || isLeft (efocusRules)
                            || isLeft (egeodeRituals)
                            || isLeft (ehairColors)
                            || isLeft (eliturgicalChantEnhancements)
                            || isLeft (eliturgicalChantGroups)
                            || isLeft (eliturgicalChants)
                            || isLeft (emagicalDances)
                            || isLeft (emagicalMelodies)
                            || isLeft (emagicalTraditions)
                            || isLeft (eoptionalRules)
                            || isLeft (epacts)
                            || isLeft (eprofessions)
                            || isLeft (eprofessionVariants)
                            || isLeft (eproperties)
                            || isLeft (eraces)
                            || isLeft (eraceVariants)
                            || isLeft (ereaches)
                            || isLeft (erogueSpells)
                            || isLeft (eskills)
                            || isLeft (esocialStatuses)
                            || isLeft (espellEnhancements)
                            || isLeft (espellGroups)
                            || isLeft (espells)
                            || isLeft (estates)
                            || isLeft (esubjects)
                            || isLeft (etribes)
                            || isLeft (ezibiljaRituals)) {
                          return pipe_ (
                            List<Either<Error[], OrderedMap<any, Record<any>>>> (
                              eanimistForces,
                              earcaneBardTraditions,
                              earcaneDancerTraditions,
                              earmorTypes,
                              easpects,
                              eattributes,
                              eblessedTraditions,
                              eblessings,
                              ebooks,
                              ebrews,
                              ecantrips,
                              ecombatSpecialAbilityGroups,
                              ecombatTechniqueGroups,
                              ecombatTechniques,
                              econditions,
                              ecultures,
                              ecurses,
                              ederivedCharacteristics,
                              edominationRituals,
                              eelvenMagicalSongs,
                              eitemTemplates,
                              eequipmentGroups,
                              eequipmentPackages,
                              eexperienceLevels,
                              eeyeColors,
                              efocusRules,
                              egeodeRituals,
                              ehairColors,
                              eliturgicalChantEnhancements,
                              eliturgicalChantGroups,
                              eliturgicalChants,
                              emagicalDances,
                              emagicalMelodies,
                              emagicalTraditions,
                              eoptionalRules,
                              epacts,
                              eprofessions,
                              eprofessionVariants,
                              eproperties,
                              eraces,
                              eraceVariants,
                              ereaches,
                              erogueSpells,
                              eskills,
                              esocialStatuses,
                              espellEnhancements,
                              espellGroups,
                              espells,
                              estates,
                              esubjects,
                              etribes,
                              ezibiljaRituals,
                            ),
                            lefts,
                            concatMap (fromArray),
                            toArray,
                            Left
                          )
                        }

                        const animistForces = fromRight_ (eanimistForces)
                        const arcaneBardTraditions = fromRight_ (earcaneBardTraditions)
                        const arcaneDancerTraditions = fromRight_ (earcaneDancerTraditions)
                        const armorTypes = fromRight_ (earmorTypes)
                        const aspects = fromRight_ (easpects)
                        const attributes = fromRight_ (eattributes)
                        const blessedTraditions = fromRight_ (eblessedTraditions)
                        const blessings = fromRight_ (eblessings)
                        const books = fromRight_ (ebooks)
                        const brews = fromRight_ (ebrews)
                        const cantrips = fromRight_ (ecantrips)
                        const combatSpecialAbilityGroups = fromRight_ (ecombatSpecialAbilityGroups)
                        const combatTechniqueGroups = fromRight_ (ecombatTechniqueGroups)
                        const combatTechniques = fromRight_ (ecombatTechniques)
                        const conditions = fromRight_ (econditions)
                        const cultures = fromRight_ (ecultures)
                        const curses = fromRight_ (ecurses)
                        const derivedCharacteristics = fromRight_ (ederivedCharacteristics)
                        const dominationRituals = fromRight_ (edominationRituals)
                        const elvenMagicalSongs = fromRight_ (eelvenMagicalSongs)
                        const itemTemplates = fromRight_ (eitemTemplates)
                        const equipmentGroups = fromRight_ (eequipmentGroups)
                        const equipmentPackages = fromRight_ (eequipmentPackages)
                        const experienceLevels = fromRight_ (eexperienceLevels)
                        const eyeColors = fromRight_ (eeyeColors)
                        const focusRules = fromRight_ (efocusRules)
                        const geodeRituals = fromRight_ (egeodeRituals)
                        const hairColors = fromRight_ (ehairColors)
                        const liturgicalChantEnhancements =
                          fromRight_ (eliturgicalChantEnhancements)
                        const liturgicalChantGroups = fromRight_ (eliturgicalChantGroups)
                        const liturgicalChants = fromRight_ (eliturgicalChants)
                        const magicalDances = fromRight_ (emagicalDances)
                        const magicalMelodies = fromRight_ (emagicalMelodies)
                        const magicalTraditions = fromRight_ (emagicalTraditions)
                        const optionalRules = fromRight_ (eoptionalRules)
                        const pacts = fromRight_ (epacts)
                        const professions = fromRight_ (eprofessions)
                        const professionVariants = fromRight_ (eprofessionVariants)
                        const properties = fromRight_ (eproperties)
                        const races = fromRight_ (eraces)
                        const raceVariants = fromRight_ (eraceVariants)
                        const reaches = fromRight_ (ereaches)
                        const rogueSpells = fromRight_ (erogueSpells)
                        const skills = fromRight_ (eskills)
                        const socialStatuses = fromRight_ (esocialStatuses)
                        const spellEnhancements = fromRight_ (espellEnhancements)
                        const spellGroups = fromRight_ (espellGroups)
                        const spells = fromRight_ (espells)
                        const states = fromRight_ (estates)
                        const subjects = fromRight_ (esubjects)
                        const tribes = fromRight_ (etribes)
                        const zibiljaRituals = fromRight_ (ezibiljaRituals)

                        const eadvantages = toAdvantages (blessings)
                                                         (cantrips)
                                                         (combatTechniques)
                                                         (liturgicalChants)
                                                         (skills)
                                                         (spells)
                                                         (mp)
                        console.log ("advantages")

                        const edisadvantages = toDisadvantages (blessings)
                                                               (cantrips)
                                                               (combatTechniques)
                                                               (liturgicalChants)
                                                               (skills)
                                                               (spells)
                                                               (mp)
                        console.log ("disadvantages")

                        const especialAbilities = toSpecialAbilities (blessings)
                                                                     (cantrips)
                                                                     (combatTechniques)
                                                                     (liturgicalChants)
                                                                     (skills)
                                                                     (spells)
                                                                     (spellEnhancements)
                                                                     (liturgicalChantEnhancements)
                                                                     (mp)
                        console.log ("specialAbilities")

                        if (isLeft (eadvantages)
                            || isLeft (edisadvantages)
                            || isLeft (especialAbilities)) {
                          return pipe_ (
                            List<Either<Error[], OrderedMap<string, Record<any>>>> (
                              eadvantages,
                              edisadvantages,
                              especialAbilities,
                            ),
                            lefts,
                            concatMap (fromArray),
                            toArray,
                            Left
                          )
                        }

                        const advantages = fromRight_ (eadvantages)
                        const disadvantages = fromRight_ (edisadvantages)
                        const specialAbilities = fromRight_ (especialAbilities)

                        return Right (WikiModel ({
                          advantages,
                          animistForces,
                          arcaneBardTraditions,
                          arcaneDancerTraditions,
                          armorTypes,
                          aspects,
                          attributes,
                          blessedTraditions,
                          blessings,
                          books,
                          brews,
                          cantrips,
                          combatSpecialAbilityGroups,
                          combatTechniqueGroups,
                          combatTechniques,
                          conditions,
                          cultures,
                          curses,
                          derivedCharacteristics,
                          disadvantages,
                          dominationRituals,
                          elvenMagicalSongs,
                          itemTemplates,
                          equipmentGroups,
                          equipmentPackages,
                          experienceLevels,
                          eyeColors,
                          focusRules,
                          geodeRituals,
                          hairColors,
                          liturgicalChantEnhancements,
                          liturgicalChantGroups,
                          liturgicalChants,
                          magicalDances,
                          magicalMelodies,
                          magicalTraditions,
                          optionalRules,
                          pacts,
                          professions,
                          professionVariants,
                          properties,
                          races,
                          raceVariants,
                          reaches,
                          rogueSpells,
                          skills,
                          socialStatuses,
                          specialAbilities,
                          spellEnhancements,
                          spellGroups,
                          spells,
                          states,
                          subjects,
                          tribes,
                          ui,
                          zibiljaRituals,
                        }))
                      }
