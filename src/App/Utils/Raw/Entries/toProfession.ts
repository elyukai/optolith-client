import { pipe } from "ramda";
import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Cons, empty, fromArray, List, map, splitOn } from "../../../../Data/List";
import { all, fmap, fromJust, fromMaybe, fromNullable, maybe, Nothing } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { ProfessionRequireActivatable, RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { CultureRequirement } from "../../../Models/Wiki/prerequisites/CultureRequirement";
import { ProfessionRequireIncreasable, RequireIncreasable } from "../../../Models/Wiki/prerequisites/IncreasableRequirement";
import { RaceRequirement } from "../../../Models/Wiki/prerequisites/RaceRequirement";
import { SexRequirement } from "../../../Models/Wiki/prerequisites/SexRequirement";
import { Profession } from "../../../Models/Wiki/Profession";
import { CantripsSelection } from "../../../Models/Wiki/professionSelections/CantripsSelection";
import { CombatTechniquesSelection } from "../../../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { CursesSelection } from "../../../Models/Wiki/professionSelections/CursesSelection";
import { LanguagesScriptsSelection } from "../../../Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { CombatTechniquesSecondSelection } from "../../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { SkillsSelection } from "../../../Models/Wiki/professionSelections/SkillsSelection";
import { SpecializationSelection } from "../../../Models/Wiki/professionSelections/SpecializationSelection";
import { TerrainKnowledgeSelection } from "../../../Models/Wiki/professionSelections/TerrainKnowledgeSelection";
import { IncreaseSkill } from "../../../Models/Wiki/sub/IncreaseSkill";
import { NameBySex } from "../../../Models/Wiki/sub/NameBySex";
import { prefixId } from "../../IDUtils";
import { unsafeToInt } from "../../NumberUtils";
import { naturalNumber } from "../../RegexUtils";
import { listLengthRx, listRx, qmPairRx } from "../csvRegexUtils";
import { mergeRowsById } from "../mergeTableRows";
import { allRights, lookupKeyValid, validateRawProp, validateRequiredNaturalNumberProp, validateRequiredNonEmptyStringProp } from "../validateValueUtils";
import { isRawProfessionRequiringActivatable } from "./Prerequisites/ActivatableRequirement";
import { isRawCultureRequirement } from "./Prerequisites/CultureRequirement";
import { isRawProfessionRequiringIncreasable } from "./Prerequisites/IncreasableRequirement";
import { isRawRaceRequirement } from "./Prerequisites/RaceRequirement";
import { isRawSexRequirement } from "./Prerequisites/SexRequirement";
import { isRawCantripsSelection } from "./ProfessionSelections/CantripsSelection";
import { isRawCombatTechniquesSelection } from "./ProfessionSelections/CombatTechniquesSelection";
import { isRawCursesSelection } from "./ProfessionSelections/CursesSelection";
import { isRawLanguagesScriptsSelection } from "./ProfessionSelections/LanguagesScriptsSelection";
import { isRawSecondCombatTechniquesSelection } from "./ProfessionSelections/SecondCombatTechniquesSelection";
import { isRawSkillsSelection } from "./ProfessionSelections/SkillsSelection";
import { isRawSpecializationSelection } from "./ProfessionSelections/SpecializationSelection";
import { isRawTerrainKnowledgeSelection } from "./ProfessionSelections/TerrainKnowledgeSelection";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

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
            || isRawLanguagesScriptsSelection (obj)
            || isRawCombatTechniquesSelection (obj)
            || isRawSecondCombatTechniquesSelection (obj)
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

const naturalNumberListWithAndDel =
  new RegExp (listRx ("&") (naturalNumber.source))

const checkNaturalNumberListWithAndDel =
  (x: string) => naturalNumberListWithAndDel .test (x)

const skill = qmPairRx (naturalNumber.source, naturalNumber.source)

const skills = new RegExp (listRx ("&") (skill))

const checkSkills =
  (x: string) => skills .test (x)

const blessings =
  new RegExp (
    `(${listLengthRx (9) ("&") (naturalNumber.source)})|`
    + `(${listLengthRx (12) ("&") (naturalNumber.source)})`
  )

const checkBlessings =
  (x: string) => blessings .test (x)

export const toProfession =
  mergeRowsById
    ("toProfession")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (validateRequiredNonEmptyStringProp)

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (validateRequiredNaturalNumberProp)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const nameFemale = lookup_l10n ("nameFemale")

      const subname = lookup_l10n ("subname")

      const subnameFemale = lookup_l10n ("subnameFemale")

      const ecost =
        checkUnivNaturalNumber ("cost")

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

      const eprerequisitesL10n =
        lookupKeyValid (lookup_l10n)
                       (validateRawProp
                         (
                           "Maybe (List ("
                           + "ProfessionRequireActivatable "
                           + "| ProfessionRequireIncreasable"
                           + "))"
                         )
                         (all (validatePrerequisites)))
                       ("prerequisites")

      const prerequisitesStart = lookup_l10n ("prerequisitesStart")

      const prerequisitesEnd = lookup_l10n ("prerequisitesEnd")

      const eselections =
        lookupKeyValid (lookup_univ)
                       (validateRawProp
                         (
                           "Maybe (List ("
                           + "SpecializationSelection "
                           + "| LanguagesScriptsSelection "
                           + "| CombatTechniquesSelection "
                           + "| CombatTechniquesSecondSelection "
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
                                        (all (checkSkills)))
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

      const esuggestedAdvantages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("suggestedAdvantages")

      const suggestedAdvantagesText =
        lookup_l10n ("suggestedAdvantages")

      const esuggestedDisadvantages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("suggestedDisadvantages")

      const suggestedDisadvantagesText =
        lookup_l10n ("suggestedDisadvantages")

      const eunsuitableAdvantages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("unsuitableAdvantages")

      const unsuitableAdvantagesText =
        lookup_l10n ("unsuitableAdvantages")

      const eunsuitableDisadvantages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("unsuitableDisadvantages")

      const unsuitableDisadvantagesText =
        lookup_l10n ("unsuitableDisadvantages")

      const evariants =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("variants")

      const egr =
        checkUnivNaturalNumber ("gr")

      const esgr =
        checkUnivNaturalNumber ("sgr")

      const esrc = lookupValidSourceLinks (lookup_l10n)

      // Return error or result

      return allRights
        ({
          ename,
          ecost,
          edependencies,
          eprerequisites,
          eprerequisitesL10n,
          eselections,
          especialAbilities,
          ecombatTechniques,
          eskills,
          espells,
          eliturgicalChants,
          eblessings,
          esuggestedAdvantages,
          esuggestedDisadvantages,
          eunsuitableAdvantages,
          eunsuitableDisadvantages,
          evariants,
          egr,
          esgr,
          esrc,
        })
        (rs => Profession ({
          id: prefixId (IdPrefixes.PROFESSIONS) (id),

          name:
            maybe<string, Profession["name"]>
              (fromJust (rs.ename))
              (f => NameBySex ({ m: fromJust (rs.ename), f }))
              (nameFemale),

          subname:
            fmap<string, Profession["name"]>
              (m => maybe<string, Profession["name"]>
                (m)
                (f => NameBySex ({ m, f }))
                (subnameFemale))
              (subname),

          ap: unsafeToInt (fromJust (rs.ecost)),

          dependencies:
            maybe<string, Profession["dependencies"]>
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
            maybe<string, Profession["prerequisites"]>
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

          prerequisitesStart,
          prerequisitesEnd,

          selections:
            maybe<string, Profession["selections"]>
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
                    : isRawSecondCombatTechniquesSelection (x)
                    ? CombatTechniquesSecondSelection ({
                        id: Nothing,
                        amount: x .amount,
                        value: x .value,
                        sid: fromArray (x .sid),
                      })
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
            maybe<string, Profession["specialAbilities"]>
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
            maybe<string, Profession["combatTechniques"]>
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
            maybe<string, Profession["skills"]>
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
            maybe<string, Profession["spells"]>
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
            maybe<string, Profession["liturgicalChants"]>
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
            maybe<string, Profession["blessings"]>
              (empty)
              (pipe (
                splitOn ("&"),
                map (prefixId (IdPrefixes.BLESSINGS))
              ))
              (rs.eblessings),

          suggestedAdvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.ADVANTAGES))))
                    (rs.esuggestedAdvantages)),

          suggestedAdvantagesText,

          suggestedDisadvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.DISADVANTAGES))))
                    (rs.esuggestedDisadvantages)),

          suggestedDisadvantagesText,

          unsuitableAdvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.ADVANTAGES))))
                    (rs.eunsuitableAdvantages)),

          unsuitableAdvantagesText,

          unsuitableDisadvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.DISADVANTAGES))))
                    (rs.eunsuitableDisadvantages)),

          unsuitableDisadvantagesText,

          isVariantRequired: Nothing,

          variants:
            fromMaybe<List<string>>
              (empty)
              (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.PROFESSION_VARIANTS))))
                    (rs.evariants)),

          gr: unsafeToInt (fromJust (rs.egr)),
          subgr: unsafeToInt (fromJust (rs.esgr)),

          src: toSourceLinks (rs.esrc),

          category: Nothing,
        }))
    })
