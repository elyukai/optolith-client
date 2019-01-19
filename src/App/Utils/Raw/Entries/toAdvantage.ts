import { pipe } from "ramda";
import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Either, Left, Right } from "../../../../Data/Either";
import { Cons, empty, fromArray, length, List, map, splitOn, zip } from "../../../../Data/List";
import { all, fmap, fromJust, fromMaybe, fromNullable, maybe, Maybe, Nothing } from "../../../../Data/Maybe";
import { fromList } from "../../../../Data/OrderedMap";
import { Record } from "../../../../Data/Record";
import { Advantage } from "../../../Models/Wiki/Advantage";
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
import { LevelAwarePrerequisites } from "../../../Models/Wiki/wikiTypeHelpers";
import { prefixId } from "../../IDUtils";
import { unsafeToInt } from "../../NumberUtils";
import { naturalNumber } from "../../RegexUtils";
import { listLengthRx, listRx, qmPairRx } from "../csvRegexUtils";
import { mergeRowsById } from "../mergeTableRows";
import { validateMapOptionalNaturalNumberListProp, validateMapOptionalNonEmptyStringListProp, validateMapRequiredNonEmptyStringProp } from "../validateMapValueUtils";
import { allRights, lookupKeyValid, mstrToMaybe, validateMapOptionalNaturalNumberProp, validateMapRequiredNaturalNumberProp, validateRawProp } from "../validateValueUtils";
import { isRawProfessionRequiringActivatable } from "./Prerequisites/ActivatableRequirement";
import { isRawRaceRequirement } from "./Prerequisites/RaceRequirement";
import { isRawSexRequirement } from "./Prerequisites/SexRequirement";
import { isRawCantripsSelection } from "./ProfessionSelections/CantripsSelection";
import { isRawCombatTechniquesSelection } from "./ProfessionSelections/CombatTechniquesSelection";
import { isRawCursesSelection } from "./ProfessionSelections/CursesSelection";
import { isRawLanguagesScriptsSelection } from "./ProfessionSelections/LanguagesScriptsSelection";
import { isRawSecondCombatTechniquesSelection } from "./ProfessionSelections/SecondCombatTechniquesSelection";
import { isRawSpecializationSelection } from "./ProfessionSelections/SpecializationSelection";
import { isRawTerrainKnowledgeSelection } from "./ProfessionSelections/TerrainKnowledgeSelection";
import { toPrerequisites } from "./Sub/toPrerequisites";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

const cost = new RegExp (`${naturalNumber.source}|${listRx ("&") (naturalNumber.source)}`)

const checkCost =
  (x: string) => cost .test (x)

const category = "[A-Z_]+"

const categories = new RegExp (listRx ("&") (category))

const checkCategories =
  (x: string) => categories .test (x)

const naturalNumberListWithAndDel =
  new RegExp (listRx ("&") (naturalNumber.source))

const checkNaturalNumberListWithAndDel =
  (x: string) => naturalNumberListWithAndDel .test (x)

const skill = qmPairRx (naturalNumber.source, naturalNumber.source)

const skills = new RegExp (listRx ("&") (skill))

const checkSkills =
  (x: string) => skills .test (x)

const combatTechnique = qmPairRx (naturalNumber.source, "[1-6]")

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

export const toAdvantage =
  mergeRowsById
    ("toAdvantage")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (validateMapRequiredNonEmptyStringProp)

      const checkOptionalL10nNonEmptyStringList =
        lookupKeyValid (lookup_l10n) (validateMapOptionalNonEmptyStringListProp ("&"))

      const checkOptionalUnivNaturalNumberList =
        lookupKeyValid (lookup_univ) (validateMapOptionalNaturalNumberListProp ("&"))

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (validateMapRequiredNaturalNumberProp)

      const checkOptionalUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (validateMapOptionalNaturalNumberProp)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const nameInWiki = lookup_l10n ("nameInWiki")

      const ecost =
        lookupKeyValid (lookup_univ)
                       (validateRawProp
                         ("Maybe (Natural | List Natural)")
                         (all (checkCost)))
                       ("dependencies")

      const etiers =
        checkOptionalUnivNaturalNumber ("tiers")

      const emax =
        checkOptionalUnivNaturalNumber ("max")

      const eselect =
        lookupKeyValid (lookup_univ)
                       (validateRawProp
                         ("Maybe (List Category)")
                         (all (checkCategories)))
                       ("select")

      const input = lookup_l10n ("input")

      const rules = lookup_l10n ("rules")

      const range = lookup_l10n ("range")

      const actions = lookup_l10n ("actions")

      const apValue = lookup_l10n ("apValue")

      const apValueAppend = lookup_l10n ("apValueAppend")

      const eprerequisites =
        lookupKeyValid (lookup_univ)
                       (pipe (
                         mstrToMaybe,
                         fmap (toPrerequisites),
                         fromMaybe<Either<string, LevelAwarePrerequisites>> (Right (List.empty))
                       ))
                       ("prerequisites")

      const prerequisites = lookup_l10n ("prerequisites")

      const eprerequisitesIndexUniv =
        checkOptionalUnivNaturalNumberList ("prerequisitesIndex")

      const eprerequisitesIndexL10n =
        checkOptionalL10nNonEmptyStringList ("prerequisitesIndex")

      const eprerequisitesIndex =
        Either.bindF<string, Maybe<List<number>>, Advantage["prerequisitesTextIndex"]>
          (prerequisitesIndexUniv =>
            Either.bindF<string, Maybe<List<string>>, Advantage["prerequisitesTextIndex"]>
              (prerequisitesIndexL10n => {
                const univ = fromMaybe<List<number>> (empty) (prerequisitesIndexUniv)
                const l10n = fromMaybe<List<string>> (empty) (prerequisitesIndexL10n)

                const isSameLength = length (univ) === length (l10n)

                if (isSameLength) {
                  return Right (
                    fromList (zip<number, string> (univ) (l10n))
                  )
                }

                return Left ("prerequisitesIndex lists do not have the same length.")
              })
              (eprerequisitesIndexL10n))
          (eprerequisitesIndexUniv)

      const eprerequisitesL10n =
        lookupKeyValid (lookup_l10n)
                       (validateRawProp
                         (
                           "Maybe (List ("
                           + "ProfessionRequireActivatable "
                           + "| ProfessionRequireIncreasable"
                           + "))"
                         )
                         (all (toPrerequisites)))
                       ("prerequisites")

      const prerequisitesStart = lookup_l10n ("prerequisitesStart")

      const prerequisitesEnd = lookup_l10n ("prerequisitesEnd")

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
        (rs => Advantage ({
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
