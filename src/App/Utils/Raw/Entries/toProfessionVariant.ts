import { pipe } from "ramda";
import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Cons, empty, fromArray, List, map, splitOn } from "../../../../Data/List";
import { all, fromJust, fromNullable, maybe, Nothing } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { ProfessionRequireActivatable, RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { CultureRequirement } from "../../../Models/Wiki/prerequisites/CultureRequirement";
import { ProfessionRequireIncreasable, RequireIncreasable } from "../../../Models/Wiki/prerequisites/IncreasableRequirement";
import { RaceRequirement } from "../../../Models/Wiki/prerequisites/RaceRequirement";
import { SexRequirement } from "../../../Models/Wiki/prerequisites/SexRequirement";
import { CantripsSelection } from "../../../Models/Wiki/professionSelections/CantripsSelection";
import { CombatTechniquesSelection } from "../../../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { CursesSelection } from "../../../Models/Wiki/professionSelections/CursesSelection";
import { LanguagesScriptsSelection } from "../../../Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { RemoveCombatTechniquesSelection } from "../../../Models/Wiki/professionSelections/RemoveCombatTechniquesSelection";
import { isRemoveCombatTechniquesSecondSelection, RemoveCombatTechniquesSecondSelection } from "../../../Models/Wiki/professionSelections/RemoveSecondCombatTechniquesSelection";
import { RemoveSpecializationSelection } from "../../../Models/Wiki/professionSelections/RemoveSpecializationSelection";
import { CombatTechniquesSecondSelection } from "../../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { SkillsSelection } from "../../../Models/Wiki/professionSelections/SkillsSelection";
import { SpecializationSelection } from "../../../Models/Wiki/professionSelections/SpecializationSelection";
import { TerrainKnowledgeSelection } from "../../../Models/Wiki/professionSelections/TerrainKnowledgeSelection";
import { ProfessionVariant } from "../../../Models/Wiki/ProfessionVariant";
import { IncreaseSkill } from "../../../Models/Wiki/sub/IncreaseSkill";
import { NameBySex } from "../../../Models/Wiki/sub/NameBySex";
import { prefixId } from "../../IDUtils";
import { unsafeToInt } from "../../NumberUtils";
import { naturalNumber } from "../../RegexUtils";
import { listLengthRx, listRx, qmPairRx } from "../csvRegexUtils";
import { mergeRowsById } from "../mergeTableRows";
import { allRights, lookupKeyValid, validateRawProp, validateRequiredIntegerProp, validateRequiredNonEmptyStringProp } from "../validateValueUtils";
import { isRawProfessionRequiringActivatable } from "./Prerequisites/ActivatableRequirement";
import { isRawCultureRequirement } from "./Prerequisites/CultureRequirement";
import { isRawProfessionRequiringIncreasable } from "./Prerequisites/IncreasableRequirement";
import { isRawRaceRequirement } from "./Prerequisites/RaceRequirement";
import { isRawSexRequirement } from "./Prerequisites/SexRequirement";
import { isRawCantripsSelection } from "./ProfessionSelections/CantripsSelection";
import { isRawCombatTechniquesSelection } from "./ProfessionSelections/CombatTechniquesSelection";
import { isRawCursesSelection } from "./ProfessionSelections/CursesSelection";
import { isRawLanguagesScriptsSelection } from "./ProfessionSelections/LanguagesScriptsSelection";
import { isRemoveRawCombatTechniquesSelection } from "./ProfessionSelections/RemoveCombatTechniquesSelection";
import { isRemoveRawSpecializationSelection } from "./ProfessionSelections/RemoveSpecializationSelection";
import { isRawSecondCombatTechniquesSelection } from "./ProfessionSelections/SecondCombatTechniquesSelection";
import { isRawSkillsSelection } from "./ProfessionSelections/SkillsSelection";
import { isRawSpecializationSelection } from "./ProfessionSelections/SpecializationSelection";
import { isRawTerrainKnowledgeSelection } from "./ProfessionSelections/TerrainKnowledgeSelection";

const validateDependencies =
  pipe (
    splitOn ("&"),
    List.all (
      x => {
        try {
          const obj = JSON.parse (x)

          if (typeof obj !== "object" || obj === null) return false

          return isRawSexRequirement (obj)
            || isRawRaceRequirement (obj)
            || isRawCultureRequirement (obj)
        } catch (e) {
          return false
        }
      }
    )
  )

const validatePrerequisites =
  pipe (
    splitOn ("&"),
    List.all (
      x => {
        try {
          const obj = JSON.parse (x)

          if (typeof obj !== "object" || obj === null) return false

          return isRawProfessionRequiringActivatable (obj)
            || isRawProfessionRequiringIncreasable (obj)
        } catch (e) {
          return false
        }
      }
    )
  )

const validateSelections =
  pipe (
    splitOn ("&"),
    List.all (
      x => {
        try {
          const obj = JSON.parse (x)

          if (typeof obj !== "object" || obj === null) return false

          return isRawSpecializationSelection (obj)
            || isRemoveRawSpecializationSelection (obj)
            || isRawLanguagesScriptsSelection (obj)
            || isRawCombatTechniquesSelection (obj)
            || isRemoveRawCombatTechniquesSelection (obj)
            || isRawSecondCombatTechniquesSelection (obj)
            || isRemoveCombatTechniquesSecondSelection (obj)
            || isRawCantripsSelection (obj)
            || isRawCursesSelection (obj)
            || isRawTerrainKnowledgeSelection (obj)
            || isRawSkillsSelection (obj)
        } catch (e) {
          return false
        }
      }
    )
  )

const validateSpecialAbilities =
  pipe (
    splitOn ("&"),
    List.all (
      x => {
        try {
          const obj = JSON.parse (x)

          if (typeof obj !== "object" || obj === null) return false

          return isRawProfessionRequiringActivatable (obj)
        } catch (e) {
          return false
        }
      }
    )
  )

const skill = qmPairRx (naturalNumber.source, naturalNumber.source)

const skills = new RegExp (listRx ("&") (skill))

const checkSkills =
  (x: string) => skills .test (x)

const combatTechnique = qmPairRx (naturalNumber.source, "-?[1-6]")

const combatTechniques = new RegExp (listRx ("&") (combatTechnique))

const checkCombatTechniques =
  (x: string) => combatTechniques .test (x)

const blessings =
  new RegExp (
    `(${listLengthRx (9) ("&") (naturalNumber.source)})|`
    + `(${listLengthRx (12) ("&") (naturalNumber.source)})`
  )

const checkBlessings =
  (x: string) => blessings .test (x)

export const toProfessionVariant =
  mergeRowsById
    ("toProfessionVariant")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (validateRequiredNonEmptyStringProp)

      const checkUnivInteger =
        lookupKeyValid (lookup_univ) (validateRequiredIntegerProp)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const nameFemale = lookup_l10n ("nameFemale")

      const ecost =
        checkUnivInteger ("cost")

      const edependencies =
        lookupKeyValid (lookup_univ)
                       (validateRawProp
                         (
                           "Maybe (List ("
                           + "SexRequirement "
                           + "| RaceRequirement "
                           + "| CultureRequirement"
                           + "))"
                         )
                         (all (validateDependencies)))
                       ("dependencies")

      const eprerequisites =
        lookupKeyValid (lookup_univ)
                       (validateRawProp
                         (
                           "Maybe (List ("
                           + "ProfessionRequireActivatable "
                           + "| ProfessionRequireIncreasable"
                           + "))"
                         )
                         (all (validatePrerequisites)))
                       ("prerequisites")

      const eselections =
        lookupKeyValid (lookup_univ)
                       (validateRawProp
                         (
                           "Maybe (List ("
                           + "SpecializationSelection "
                           + "| RemoveSpecializationSelection "
                           + "| LanguagesScriptsSelection "
                           + "| CombatTechniquesSelection "
                           + "| RemoveCombatTechniquesSelection "
                           + "| CombatTechniquesSecondSelection "
                           + "| RemoveCombatTechniquesSecondSelection "
                           + "| CantripsSelection "
                           + "| CursesSelection "
                           + "| TerrainKnowledgeSelection "
                           + "| SkillsSelection"
                           + "))"
                         )
                         (all (validateSelections)))
                       ("selections")

      const especialAbilities =
        lookupKeyValid (lookup_univ)
                       (validateRawProp
                         ("Maybe (List ProfessionRequireActivatable)")
                         (all (validateSpecialAbilities)))
                       ("specialAbilities")

      const ecombatTechniques =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List (Natural, Natural))")
                                        (all (checkCombatTechniques)))
                       ("combatTechniques")

      const eskills =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List (Natural, Natural))")
                                        (all (checkSkills)))
                       ("skills")

      const espells =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List (Natural, Natural))")
                                        (all (checkSkills)))
                       ("spells")

      const eliturgicalChants =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List (Natural, Natural))")
                                        (all (checkSkills)))
                       ("liturgicalChants")

      const eblessings =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural { length = 9 | 12})")
                                        (all (checkBlessings)))
                       ("blessings")

      const precedingText =
        lookup_l10n ("precedingText")

      const fullText =
        lookup_l10n ("fullText")

      const concludingText =
        lookup_l10n ("concludingText")

      // Return error or result

      return allRights
        ({
          ename,
          ecost,
          edependencies,
          eprerequisites,
          eselections,
          especialAbilities,
          ecombatTechniques,
          eskills,
          espells,
          eliturgicalChants,
          eblessings,
        })
        (rs => ProfessionVariant ({
          id: prefixId (IdPrefixes.PROFESSION_VARIANTS) (id),

          name:
            maybe<string, ProfessionVariant["name"]>
              (fromJust (rs.ename))
              (f => NameBySex ({ m: fromJust (rs.ename), f }))
              (nameFemale),

          ap: unsafeToInt (fromJust (rs.ecost)),

          dependencies:
            maybe<string, ProfessionVariant["dependencies"]>
              (empty)
              (pipe (
                splitOn ("&"),
                map (pipe (
                  (x: string) => JSON.parse (x),
                  x => isRawSexRequirement (x)
                    ? SexRequirement ({
                        id: Nothing,
                        value: x .value,
                      })
                    : isRawRaceRequirement (x)
                    ? RaceRequirement ({
                        id: Nothing,
                        value: Array.isArray (x .value) ? fromArray (x .value) : x .value,
                      })
                    : CultureRequirement ({
                      id: Nothing,
                      value: Array.isArray (x .value) ? fromArray (x .value) : x .value,
                    })
                ))
              ))
              (rs.edependencies),

          prerequisites:
            maybe<string, ProfessionVariant["prerequisites"]>
              (empty)
              (pipe (
                splitOn ("&"),
                map (pipe (
                  (x: string) => JSON.parse (x),
                  x => isRawProfessionRequiringActivatable (x)
                    ? RequireActivatable ({
                        id: x .id,
                        active: x .active,
                        sid: fromNullable (x .sid),
                        sid2: fromNullable (x .sid2),
                        tier: fromNullable (x .tier),
                      }) as Record<ProfessionRequireActivatable>
                    : RequireIncreasable ({
                        id: x .id,
                        value: x .value,
                      }) as Record<ProfessionRequireIncreasable>
                ))
              ))
              (rs.eprerequisites),

          selections:
            maybe<string, ProfessionVariant["selections"]>
              (empty)
              (pipe (
                splitOn ("&"),
                map (pipe (
                  (x: string) => JSON.parse (x),
                  x => isRawSpecializationSelection (x)
                    ? SpecializationSelection ({
                        id: Nothing,
                        sid: Array.isArray (x .sid) ? fromArray (x .sid) : x .sid,
                      })
                    : isRemoveRawSpecializationSelection (x)
                    ? RemoveSpecializationSelection
                    : isRawLanguagesScriptsSelection (x)
                    ? LanguagesScriptsSelection ({
                        id: Nothing,
                        value: x .value,
                      })
                    : isRawCombatTechniquesSelection (x)
                    ? CombatTechniquesSelection ({
                        id: Nothing,
                        amount: x .amount,
                        value: x .value,
                        sid: fromArray (x .sid),
                      })
                    : isRemoveRawCombatTechniquesSelection (x)
                    ? RemoveCombatTechniquesSelection
                    : isRawSecondCombatTechniquesSelection (x)
                    ? CombatTechniquesSecondSelection ({
                        id: Nothing,
                        amount: x .amount,
                        value: x .value,
                        sid: fromArray (x .sid),
                      })
                    : isRemoveCombatTechniquesSecondSelection (x)
                    ? RemoveCombatTechniquesSecondSelection
                    : isRawCantripsSelection (x)
                    ? CantripsSelection ({
                        id: Nothing,
                        amount: x .amount,
                        sid: fromArray (x .sid),
                      })
                    : isRawCursesSelection (x)
                    ? CursesSelection ({
                        id: Nothing,
                        value: x .value,
                      })
                    : isRawTerrainKnowledgeSelection (x)
                    ? TerrainKnowledgeSelection ({
                        id: Nothing,
                        sid: fromArray (x .sid),
                      })
                    : SkillsSelection ({
                        id: Nothing,
                        value: x .value,
                      })
                ))
              ))
              (rs.eselections),

          specialAbilities:
            maybe<string, ProfessionVariant["specialAbilities"]>
              (empty)
              (pipe (
                splitOn ("&"),
                map (pipe (
                  (x: string) => JSON.parse (x),
                  x => RequireActivatable ({
                    id: x .id,
                    active: x .active,
                    sid: fromNullable (x .sid),
                    sid2: fromNullable (x .sid2),
                    tier: fromNullable (x .tier),
                  }) as Record<ProfessionRequireActivatable>
                ))
              ))
              (rs.especialAbilities),

          combatTechniques:
            maybe<string, ProfessionVariant["combatTechniques"]>
              (empty)
              (pipe (
                splitOn ("&"),
                map (x => {
                  const xs = splitOn ("?") (x) as Cons<string>
                  const numericId = xs .x
                  const value = (xs .xs as Cons<string>) .x

                  return IncreaseSkill ({
                    id: prefixId (IdPrefixes.COMBAT_TECHNIQUES) (numericId),
                    value: unsafeToInt (value),
                  })
                })
              ))
              (rs.ecombatTechniques),

          skills:
            maybe<string, ProfessionVariant["skills"]>
              (empty)
              (pipe (
                splitOn ("&"),
                map (x => {
                  const xs = splitOn ("?") (x) as Cons<string>
                  const numericId = xs .x
                  const value = (xs .xs as Cons<string>) .x

                  return IncreaseSkill ({
                    id: prefixId (IdPrefixes.SKILLS) (numericId),
                    value: unsafeToInt (value),
                  })
                })
              ))
              (rs.eskills),

          spells:
            maybe<string, ProfessionVariant["spells"]>
              (empty)
              (pipe (
                splitOn ("&"),
                map (x => {
                  const xs = splitOn ("?") (x) as Cons<string>
                  const numericId = xs .x
                  const value = (xs .xs as Cons<string>) .x

                  return IncreaseSkill ({
                    id: prefixId (IdPrefixes.SPELLS) (numericId),
                    value: unsafeToInt (value),
                  })
                })
              ))
              (rs.espells),

          liturgicalChants:
            maybe<string, ProfessionVariant["liturgicalChants"]>
              (empty)
              (pipe (
                splitOn ("&"),
                map (x => {
                  const xs = splitOn ("?") (x) as Cons<string>
                  const numericId = xs .x
                  const value = (xs .xs as Cons<string>) .x

                  return IncreaseSkill ({
                    id: prefixId (IdPrefixes.LITURGICAL_CHANTS) (numericId),
                    value: unsafeToInt (value),
                  })
                })
              ))
              (rs.eliturgicalChants),

          blessings:
            maybe<string, ProfessionVariant["blessings"]>
              (empty)
              (pipe (
                splitOn ("&"),
                map (prefixId (IdPrefixes.BLESSINGS))
              ))
              (rs.eblessings),

          precedingText,
          fullText,
          concludingText,

          category: Nothing,
        }))
    })
