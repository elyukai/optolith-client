import { fmap } from "../../../../Data/Functor";
import { empty, List, map, notNull } from "../../../../Data/List";
import { fromMaybe, maybe, Nothing } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { fst, Pair, snd } from "../../../../Data/Tuple";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { Culture } from "../../../Models/Wiki/Culture";
import { CommonProfession } from "../../../Models/Wiki/sub/CommonProfession";
import { IncreaseSkill } from "../../../Models/Wiki/sub/IncreaseSkill";
import { prefixId, prefixProf } from "../../IDUtils";
import { toNatural, unsafeToInt } from "../../NumberUtils";
import { exactR, isNaturalNumber, naturalNumberU } from "../../RegexUtils";
import { mergeRowsById } from "../mergeTableRows";
import { maybePrefix, modifyNegIntNoBreak } from "../rawConversionUtils";
import { Expect } from "../showExpected";
import { mensureMapBoolean, mensureMapNatural, mensureMapNaturalList, mensureMapNaturalListOptional, mensureMapNonEmptyString, mensureMapPairList, mensureMapStringPredListOptional } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed, TableType } from "../validateValueUtils";
import { toSourceLinks } from "./Sub/toSourceLinks";

const exception =
  new RegExp (exactR (`${naturalNumberU}|${prefixProf (naturalNumberU)}`), "u")

const checkException =
  (x: string) => exception .test (x)

const toExceptions =
  maybe<List<string | number>>
    (empty)
    (map ((x: string) => isNaturalNumber (x) ? unsafeToInt (x) : x))

export const toCulture =
  mergeRowsById
    ("toCulture")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkOptionalExceptionList =
        lookupKeyValid (mensureMapStringPredListOptional (checkException)
                                                         ("Group | ProfessionId")
                                                         (","))
                       (TableType.Univ)
                       (lookup_univ)

      const checkUnivNaturalNumber =
        lookupKeyValid (mensureMapNatural) (TableType.Univ) (lookup_univ)

      const checkUnivNaturalNumberList =
        lookupKeyValid (mensureMapNaturalList ("&")) (TableType.Univ) (lookup_univ)

      const checkOptionalUnivNaturalNumberList =
        lookupKeyValid (mensureMapNaturalListOptional ("&")) (TableType.Univ) (lookup_univ)

      const checkUnivBoolean =
        lookupKeyValid (mensureMapBoolean) (TableType.Univ) (lookup_univ)

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

      const commonMagicProfessions =
        lookup_l10n ("commonMagicProfessions")

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
        lookupKeyValid (mensureMapPairList ("&")
                                           ("?")
                                           (Expect.NaturalNumber)
                                           (Expect.NaturalNumber)
                                           (toNatural)
                                           (toNatural))
                       (TableType.Univ)
                       (lookup_univ)
                       ("culturalPackageSkills")

      const esrc = toSourceLinks (lookup_l10n)

      // Return error or result

      return mapMNamed
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

            commonProfessions: List (
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

            commonMundaneProfessions: fmap (modifyNegIntNoBreak) (commonMundaneProfessions),
            commonMagicProfessions: fmap (modifyNegIntNoBreak) (commonMagicProfessions),
            commonBlessedProfessions: fmap (modifyNegIntNoBreak) (commonBlessedProfessions),

            commonAdvantages:
              maybePrefix (IdPrefixes.ADVANTAGES) (rs.ecommonAdvantages),

            commonAdvantagesText: fmap (modifyNegIntNoBreak) (commonAdvantagesText),

            commonDisadvantages:
              maybePrefix (IdPrefixes.DISADVANTAGES) (rs.ecommonDisadvantages),

            commonDisadvantagesText: fmap (modifyNegIntNoBreak) (commonDisadvantagesText),

            uncommonAdvantages:
              maybePrefix (IdPrefixes.ADVANTAGES) (rs.euncommonAdvantages),

            uncommonAdvantagesText: fmap (modifyNegIntNoBreak) (uncommonAdvantagesText),

            uncommonDisadvantages:
              maybePrefix (IdPrefixes.DISADVANTAGES) (rs.euncommonDisadvantages),

            uncommonDisadvantagesText: fmap (modifyNegIntNoBreak) (uncommonDisadvantagesText),

            commonSkills:
              map (prefixId (IdPrefixes.SKILLS)) (rs.ecommonSkills),

            uncommonSkills:
              maybePrefix (IdPrefixes.SKILLS) (rs.euncommonSkills),

            commonNames: fromMaybe ("") (mcommonNames),

            culturalPackageAdventurePoints: rs.eculturalPackageCost,

            culturalPackageSkills:
              map<Pair<number, number>, Record<IncreaseSkill>>
                (p => IncreaseSkill ({
                  id: prefixId (IdPrefixes.SKILLS) (fst (p)),
                  value: snd (p),
                }))
                (rs.eculturalPackageSkills),

            src: rs.esrc,

            category: Nothing,
          })
      })
    })
