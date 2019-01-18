import { pipe } from "ramda";
import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Cons, empty, List, map, notNull, splitOn } from "../../../../Data/List";
import { all, any, fmap, fromJust, fromMaybe, maybe, Nothing } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { Culture } from "../../../Models/Wiki/Culture";
import { CommonProfession } from "../../../Models/Wiki/sub/CommonProfession";
import { IncreaseSkill } from "../../../Models/Wiki/sub/IncreaseSkill";
import { prefixId } from "../../IDUtils";
import { unsafeToInt } from "../../NumberUtils";
import { isNaturalNumber, naturalNumber } from "../../RegexUtils";
import { listRx, qmPairRx } from "../csvRegexUtils";
import { mergeRowsById } from "../mergeTableRows";
import { allRights, lookupKeyValid, maybeRawToBoolean, validateBooleanProp, validateRawProp, validateRequiredNaturalNumberProp, validateRequiredNonEmptyStringProp } from "../validateValueUtils";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

const naturalNumberListWithAndDel =
  new RegExp (listRx ("&") (naturalNumber.source))

const checkNaturalNumberListWithAndDel =
  (x: string) => naturalNumberListWithAndDel .test (x)

const exceptions =
  new RegExp (
    listRx (",")
           (`${naturalNumber.source}|(?:${IdPrefixes.PROFESSIONS}_${naturalNumber.source})`)
  )

const checkExceptions =
  (x: string) => exceptions .test (x)

const culturalPackageSkill = qmPairRx (naturalNumber.source, naturalNumber.source)

const culturalPackageSkills = new RegExp (listRx ("&") (culturalPackageSkill))

const checkCulturalPackageSkills =
  (x: string) => culturalPackageSkills .test (x)

const toExceptions =
  maybe<string, List<string | number>> (empty)
                                       (pipe (
                                         splitOn (","),
                                         map (x => isNaturalNumber (x) ? unsafeToInt (x) : x)
                                       ))

export const toCulture =
  mergeRowsById
    ("toCulture")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (validateRequiredNonEmptyStringProp)

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (validateRequiredNaturalNumberProp)

      const checkUnivBoolean =
        lookupKeyValid (lookup_univ) (validateBooleanProp)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const eareaKnowledge =
        checkL10nNonEmptyString ("areaKnowledge")

      const eareaKnowledgeShort =
        checkL10nNonEmptyString ("areaKnowledgeShort")

      const elanguages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("List (Natural)")
                                        (any (checkNaturalNumberListWithAndDel)))
                       ("languages")

      const eliteracy =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List (Natural))")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("literacy")

      const esocial =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("List (Natural)")
                                        (any (checkNaturalNumberListWithAndDel)))
                       ("social")

      const ecommonMundaneProfessionsAll =
        checkUnivBoolean ("commonMundaneProfessionsAll")

      const ecommonMundaneProfessionsExceptions =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("List (Natural | String)")
                                        (any (checkExceptions)))
                       ("commonMundaneProfessionsExceptions")

      const commonMundaneProfessions =
        lookup_l10n ("commonMundaneProfessions")

      const ecommonMagicalProfessionsAll =
        checkUnivBoolean ("commonMagicalProfessionsAll")

      const ecommonMagicalProfessionsExceptions =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("List (Natural | String)")
                                        (any (checkExceptions)))
                       ("commonMagicalProfessionsExceptions")

      const commonMagicalProfessions =
        lookup_l10n ("commonMagicalProfessions")

      const ecommonBlessedProfessionsAll =
        checkUnivBoolean ("commonBlessedProfessionsAll")

      const ecommonBlessedProfessionsExceptions =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("List (Natural | String)")
                                        (any (checkExceptions)))
                       ("commonBlessedProfessionsExceptions")

      const commonBlessedProfessions =
        lookup_l10n ("commonBlessedProfessions")

      const ecommonAdvantages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("commonAdvantages")

      const commonAdvantagesText =
        lookup_l10n ("commonAdvantages")

      const ecommonDisadvantages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("commonDisadvantages")

      const commonDisadvantagesText =
        lookup_l10n ("commonDisadvantages")

      const euncommonAdvantages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("uncommonAdvantages")

      const uncommonAdvantagesText =
        lookup_l10n ("uncommonAdvantages")

      const euncommonDisadvantages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("uncommonDisadvantages")

      const uncommonDisadvantagesText =
        lookup_l10n ("uncommonDisadvantages")

      const ecommonSkills =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("List Natural")
                                        (any (checkNaturalNumberListWithAndDel)))
                       ("commonSkills")

      const euncommonSkills =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("uncommonSkills")

      const mcommonNames = lookup_l10n ("commonNames")

      const eculturalPackageCost =
        checkUnivNaturalNumber ("culturalPackageCost")

      const eculturalPackageSkills =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("List (Natural, Natural)")
                                        (any (checkCulturalPackageSkills)))
                       ("culturalPackageSkills")

      const esrc = lookupValidSourceLinks (lookup_l10n)

      // Return error or result

      return allRights
        ({
          ename,
          eareaKnowledge,
          eareaKnowledgeShort,
          elanguages,
          eliteracy,
          esocial,
          ecommonMundaneProfessionsAll,
          ecommonMundaneProfessionsExceptions,
          ecommonMagicalProfessionsAll,
          ecommonMagicalProfessionsExceptions,
          ecommonBlessedProfessionsAll,
          ecommonBlessedProfessionsExceptions,
          ecommonAdvantages,
          ecommonDisadvantages,
          euncommonAdvantages,
          euncommonDisadvantages,
          ecommonSkills,
          euncommonSkills,
          eculturalPackageCost,
          eculturalPackageSkills,
          esrc,
        })
        (rs => {
          const mundaneAll = maybeRawToBoolean (rs.ecommonMundaneProfessionsAll)
          const mundaneExceptions = toExceptions (rs.ecommonMundaneProfessionsExceptions)
          const magicalAll = maybeRawToBoolean (rs.ecommonMagicalProfessionsAll)
          const magicalExceptions = toExceptions (rs.ecommonMagicalProfessionsExceptions)
          const blessedAll = maybeRawToBoolean (rs.ecommonBlessedProfessionsAll)
          const blessedExceptions = toExceptions (rs.ecommonBlessedProfessionsExceptions)

          return Culture ({
            id: prefixId (IdPrefixes.CULTURES) (id),
            name: fromJust (rs.ename),
            areaKnowledge: fromJust (rs.eareaKnowledge),
            areaKnowledgeShort: fromJust (rs.eareaKnowledgeShort),

            languages:
              pipe (splitOn ("&"), map (unsafeToInt))
                   (fromJust (rs.elanguages)),

            scripts:
              fromMaybe<List<number>>
                (empty)
                (fmap (pipe (splitOn ("&"), map (unsafeToInt)))
                      (rs.eliteracy)),

            socialStatus:
              pipe (splitOn ("&"), map (unsafeToInt))
                   (fromJust (rs.esocial)),

            commonProfessions: List.fromElements (
              notNull (mundaneExceptions)
              ? CommonProfession ({ list: mundaneExceptions, reverse: mundaneAll })
              : mundaneAll,

              notNull (magicalExceptions)
              ? CommonProfession ({ list: magicalExceptions, reverse: magicalAll })
              : magicalAll,

              notNull (blessedExceptions)
              ? CommonProfession ({ list: blessedExceptions, reverse: blessedAll })
              : blessedAll
            ),

            commonMundaneProfessions,
            commonMagicProfessions: commonMagicalProfessions,
            commonBlessedProfessions,

            commonAdvantages:
              fromMaybe<List<string>>
                (empty)
                (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.ADVANTAGES))))
                      (rs.ecommonAdvantages)),

            commonAdvantagesText,

            commonDisadvantages:
              fromMaybe<List<string>>
                (empty)
                (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.DISADVANTAGES))))
                      (rs.ecommonDisadvantages)),

            commonDisadvantagesText,

            uncommonAdvantages:
              fromMaybe<List<string>>
                (empty)
                (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.ADVANTAGES))))
                      (rs.euncommonAdvantages)),

            uncommonAdvantagesText,

            uncommonDisadvantages:
              fromMaybe<List<string>>
                (empty)
                (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.DISADVANTAGES))))
                      (rs.euncommonDisadvantages)),

            uncommonDisadvantagesText,

            commonSkills:
              fromMaybe<List<string>>
                (empty)
                (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.SKILLS))))
                      (rs.ecommonSkills)),

            uncommonSkills:
              fromMaybe<List<string>>
                (empty)
                (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.SKILLS))))
                      (rs.euncommonSkills)),

            commonNames: fromMaybe ("") (mcommonNames),

            culturalPackageAdventurePoints: unsafeToInt (fromJust (rs.eculturalPackageCost)),

            culturalPackageSkills:
              maybe<string, List<Record<IncreaseSkill>>>
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
                (rs.eculturalPackageSkills),

            src: toSourceLinks (rs.esrc),

            category: Nothing,
          })
      })
    })
