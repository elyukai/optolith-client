import { pipe } from "ramda";
import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Cons, empty, List, map, notNull, splitOn } from "../../../../Data/List";
import { any, fromMaybe, maybe, Nothing } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { Culture } from "../../../Models/Wiki/Culture";
import { CommonProfession } from "../../../Models/Wiki/sub/CommonProfession";
import { IncreaseSkill } from "../../../Models/Wiki/sub/IncreaseSkill";
import { prefixId } from "../../IDUtils";
import { unsafeToInt } from "../../NumberUtils";
import { isNaturalNumber, naturalNumber } from "../../RegexUtils";
import { listRx, qmPairRx } from "../csvRegexUtils";
import { mergeRowsById } from "../mergeTableRows";
import { maybePrefix } from "../rawConversionUtils";
import { validateMapBooleanProp, validateMapOptionalNaturalNumberListProp, validateMapOptionalStringListProp, validateMapRequiredNaturalNumberListProp, validateMapRequiredNaturalNumberProp, validateMapRequiredNonEmptyStringProp } from "../validateMapValueUtils";
import { allRights, lookupKeyValid, validateRawProp } from "../validateValueUtils";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

const exception =
  new RegExp (`${naturalNumber.source}|(${IdPrefixes.PROFESSIONS}_${naturalNumber.source})`)

const checkException =
  (x: string) => exception .test (x)

const culturalPackageSkill = qmPairRx (naturalNumber.source, naturalNumber.source)

const culturalPackageSkills = new RegExp (listRx ("&") (culturalPackageSkill))

const checkCulturalPackageSkills =
  (x: string) => culturalPackageSkills .test (x)

const toExceptions =
  maybe<List<string>, List<string | number>>
    (empty)
    (map (x => isNaturalNumber (x) ? unsafeToInt (x) : x))

export const toCulture =
  mergeRowsById
    ("toCulture")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (validateMapRequiredNonEmptyStringProp)

      const checkOptionalExceptionList =
        lookupKeyValid (lookup_univ) (validateMapOptionalStringListProp (checkException) (","))

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (validateMapRequiredNaturalNumberProp)

      const checkUnivNaturalNumberList =
        lookupKeyValid (lookup_univ) (validateMapRequiredNaturalNumberListProp ("&"))

      const checkOptionalUnivNaturalNumberList =
        lookupKeyValid (lookup_univ) (validateMapOptionalNaturalNumberListProp ("&"))

      const checkUnivBoolean =
        lookupKeyValid (lookup_univ) (validateMapBooleanProp)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const eareaKnowledge =
        checkL10nNonEmptyString ("areaKnowledge")

      const eareaKnowledgeShort =
        checkL10nNonEmptyString ("areaKnowledgeShort")

      const elanguages =
        checkUnivNaturalNumberList ("languages")

      const eliteracy =
        checkOptionalUnivNaturalNumberList ("literacy")

      const esocial =
        checkUnivNaturalNumberList ("social")

      const ecommonMundaneProfessionsAll =
        checkUnivBoolean ("commonMundaneProfessionsAll")

      const ecommonMundaneProfessionsExceptions =
        checkOptionalExceptionList ("commonMundaneProfessionsExceptions")

      const commonMundaneProfessions =
        lookup_l10n ("commonMundaneProfessions")

      const ecommonMagicalProfessionsAll =
        checkUnivBoolean ("commonMagicalProfessionsAll")

      const ecommonMagicalProfessionsExceptions =
        checkOptionalExceptionList ("commonMagicalProfessionsExceptions")

      const commonMagicalProfessions =
        lookup_l10n ("commonMagicalProfessions")

      const ecommonBlessedProfessionsAll =
        checkUnivBoolean ("commonBlessedProfessionsAll")

      const ecommonBlessedProfessionsExceptions =
        checkOptionalExceptionList ("commonBlessedProfessionsExceptions")

      const commonBlessedProfessions =
        lookup_l10n ("commonBlessedProfessions")

      const ecommonAdvantages =
        checkOptionalUnivNaturalNumberList ("commonAdvantages")

      const commonAdvantagesText =
        lookup_l10n ("commonAdvantages")

      const ecommonDisadvantages =
        checkOptionalUnivNaturalNumberList ("commonDisadvantages")

      const commonDisadvantagesText =
        lookup_l10n ("commonDisadvantages")

      const euncommonAdvantages =
        checkOptionalUnivNaturalNumberList ("uncommonAdvantages")

      const uncommonAdvantagesText =
        lookup_l10n ("uncommonAdvantages")

      const euncommonDisadvantages =
        checkOptionalUnivNaturalNumberList ("uncommonDisadvantages")

      const uncommonDisadvantagesText =
        lookup_l10n ("uncommonDisadvantages")

      const ecommonSkills =
        checkUnivNaturalNumberList ("commonSkills")

      const euncommonSkills =
        checkOptionalUnivNaturalNumberList ("uncommonSkills")

      const mcommonNames =
        lookup_l10n ("commonNames")

      const eculturalPackageCost =
        checkUnivNaturalNumber ("culturalPackageCost")

      const eculturalPackageSkills =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("[(Natural, Natural)]")
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
          const mundaneAll = rs.ecommonMundaneProfessionsAll
          const mundaneExceptions = toExceptions (rs.ecommonMundaneProfessionsExceptions)
          const magicalAll = rs.ecommonMagicalProfessionsAll
          const magicalExceptions = toExceptions (rs.ecommonMagicalProfessionsExceptions)
          const blessedAll = rs.ecommonBlessedProfessionsAll
          const blessedExceptions = toExceptions (rs.ecommonBlessedProfessionsExceptions)

          return Culture ({
            id: prefixId (IdPrefixes.CULTURES) (id),
            name: rs.ename,
            areaKnowledge: rs.eareaKnowledge,
            areaKnowledgeShort: rs.eareaKnowledgeShort,

            languages: rs.elanguages,

            scripts: fromMaybe<List<number>> (empty) (rs.eliteracy),

            socialStatus: rs.esocial,

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
              maybePrefix (IdPrefixes.ADVANTAGES) (rs.ecommonAdvantages),

            commonAdvantagesText,

            commonDisadvantages:
              maybePrefix (IdPrefixes.DISADVANTAGES) (rs.ecommonDisadvantages),

            commonDisadvantagesText,

            uncommonAdvantages:
              maybePrefix (IdPrefixes.ADVANTAGES) (rs.euncommonAdvantages),

            uncommonAdvantagesText,

            uncommonDisadvantages:
              maybePrefix (IdPrefixes.DISADVANTAGES) (rs.euncommonDisadvantages),

            uncommonDisadvantagesText,

            commonSkills:
              map (prefixId (IdPrefixes.SKILLS)) (rs.ecommonSkills),

            uncommonSkills:
              maybePrefix (IdPrefixes.SKILLS) (rs.euncommonSkills),

            commonNames: fromMaybe ("") (mcommonNames),

            culturalPackageAdventurePoints: rs.eculturalPackageCost,

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
