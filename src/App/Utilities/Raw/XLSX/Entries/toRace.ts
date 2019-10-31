import { fmap } from "../../../../../Data/Functor";
import { empty, List, map } from "../../../../../Data/List";
import { fromMaybe, Nothing } from "../../../../../Data/Maybe";
import { first, fst, Pair, snd } from "../../../../../Data/Tuple";
import { IdPrefixes } from "../../../../Constants/IdPrefixes";
import { Race } from "../../../../Models/Wiki/Race";
import { Die } from "../../../../Models/Wiki/sub/Die";
import { prefixId } from "../../../IDUtils";
import { toInt, toNatural } from "../../../NumberUtils";
import { Expect } from "../../Expect";
import { mergeRowsById } from "../MergeRows";
import { maybePrefix, modifyNegIntNoBreak } from "../SourceHelpers";
import { lookupKeyMapValidNatural, lookupKeyMapValidNonEmptyString, lookupKeyValid, mapMNamed, TableType } from "../Validators/Generic";
import { mensureMapInteger, mensureMapIntegerOptional, mensureMapNaturalFixedListOptional, mensureMapNaturalList, mensureMapNaturalListOptional, mensureMapPairList, mensureMapPairListOptional } from "../Validators/ToValue";
import { toErrata } from "./Sub/toErrata";
import { toSourceLinks } from "./Sub/toSourceLinks";

const stringToAttributeAdjustments =
  mensureMapPairListOptional ("&")
                             ("?")
                             (Expect.NaturalNumber)
                             (Expect.Integer)
                             (toNatural)
                             (toInt)

export const stringToDiceList =
  mensureMapPairListOptional ("&")
                             ("D")
                             (Expect.NaturalNumber)
                             (Expect.NaturalNumber)
                             (toNatural)
                             (toNatural)

const stringToNegativeDiceList =
  mensureMapPairList ("&")
                     ("D")
                     (Expect.Integer)
                     (Expect.NaturalNumber)
                     (toInt)
                     (toNatural)

export const toRace =
  mergeRowsById
    ("toRace")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyMapValidNonEmptyString (TableType.L10n) (lookup_l10n)

      const checkUnivNaturalNumber =
        lookupKeyMapValidNatural (TableType.Univ) (lookup_univ)

      const checkUnivNaturalNumberList =
        lookupKeyValid (mensureMapNaturalList ("&")) (TableType.Univ) (lookup_univ)

      const checkOptionalUnivNaturalNumberList =
        lookupKeyValid (mensureMapNaturalListOptional ("&")) (TableType.Univ) (lookup_univ)

      const checkOptionalUnivNaturalNumberList20 =
        lookupKeyValid (mensureMapNaturalFixedListOptional (20) ("&"))
                       (TableType.Univ)
                       (lookup_univ)

      const checkUnivInteger =
        lookupKeyValid (mensureMapInteger) (TableType.Univ) (lookup_univ)

      const checkOptionalUnivInteger =
        lookupKeyValid (mensureMapIntegerOptional) (TableType.Univ) (lookup_univ)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const ecost =
        checkUnivNaturalNumber ("cost")

      const elp =
        checkUnivInteger ("lp")

      const espi =
        checkUnivInteger ("spi")

      const etou =
        checkUnivInteger ("tou")

      const emov =
        checkUnivNaturalNumber ("mov")

      const eattributeAdjustments =
        lookupKeyValid (stringToAttributeAdjustments)
                       (TableType.Univ)
                       (lookup_univ)
                       ("attributeAdjustments")

      const eattributeAdjustmentsText =
        checkL10nNonEmptyString ("attributeAdjustments")

      const eattributeAdjustmentsSelectionValue =
        checkUnivInteger ("attributeAdjustmentsSelectionValue")

      const eattributeAdjustmentsSelectionList =
        checkUnivNaturalNumberList ("attributeAdjustmentsSelectionList")

      const ecommonCultures =
        checkOptionalUnivNaturalNumberList ("commonCultures")

      const eautomaticAdvantages =
        checkOptionalUnivNaturalNumberList ("automaticAdvantages")

      const automaticAdvantagesText =
        lookup_l10n ("automaticAdvantages")

      const estronglyRecommendedAdvantages =
        checkOptionalUnivNaturalNumberList ("stronglyRecommendedAdvantages")

      const stronglyRecommendedAdvantagesText =
        lookup_l10n ("stronglyRecommendedAdvantages")

      const estronglyRecommendedDisadvantages =
        checkOptionalUnivNaturalNumberList ("stronglyRecommendedDisadvantages")

      const stronglyRecommendedDisadvantagesText =
        lookup_l10n ("stronglyRecommendedDisadvantages")

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

      const ehairColors =
        checkOptionalUnivNaturalNumberList20 ("hairColors")

      const eeyeColors =
        checkOptionalUnivNaturalNumberList20 ("eyeColors")

      const esizeBase =
        checkOptionalUnivInteger ("sizeBase")

      const esizeRandom =
        lookupKeyValid (stringToDiceList)
                       (TableType.Univ)
                       (lookup_univ)
                       ("sizeRandom")

      const eweightBase =
        checkUnivInteger ("weightBase")

      const eweightRandom =
        lookupKeyValid (stringToNegativeDiceList)
                       (TableType.Univ)
                       (lookup_univ)
                       ("weightRandom")

      const evariants =
        checkOptionalUnivNaturalNumberList ("variants")

      const esrc = toSourceLinks (lookup_l10n)

      const eerrata = toErrata (lookup_l10n)

      // Return error or result

      return mapMNamed
        ({
          ename,
          ecost,
          elp,
          espi,
          etou,
          emov,
          eattributeAdjustments,
          eattributeAdjustmentsText,
          eattributeAdjustmentsSelectionValue,
          eattributeAdjustmentsSelectionList,
          ecommonCultures,
          eautomaticAdvantages,
          estronglyRecommendedAdvantages,
          estronglyRecommendedDisadvantages,
          ecommonAdvantages,
          ecommonDisadvantages,
          euncommonAdvantages,
          euncommonDisadvantages,
          ehairColors,
          eeyeColors,
          esizeBase,
          esizeRandom,
          eweightBase,
          eweightRandom,
          evariants,
          esrc,
          eerrata,
        })
        (rs => Race ({
          id: prefixId (IdPrefixes.RACES) (id),
          name: rs.ename,
          lp: rs.elp,
          spi: rs.espi,
          tou: rs.etou,
          mov: rs.emov,
          ap: rs.ecost,

          attributeAdjustments:
            map<Pair<number, number>, Pair<string, number>>
              (first (prefixId (IdPrefixes.ATTRIBUTES)))
              (fromMaybe (List<Pair<number, number>> ()) (rs.eattributeAdjustments)),

          attributeAdjustmentsSelection:
            Pair (
              rs.eattributeAdjustmentsSelectionValue,
              map (prefixId (IdPrefixes.ATTRIBUTES)) (rs.eattributeAdjustmentsSelectionList)
            ),

          attributeAdjustmentsText: modifyNegIntNoBreak (rs.eattributeAdjustmentsText),

          commonCultures:
            map (prefixId (IdPrefixes.CULTURES)) (fromMaybe (List<number> ()) (rs.ecommonCultures)),

          automaticAdvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (map (prefixId (IdPrefixes.ADVANTAGES)))
                    (rs.eautomaticAdvantages)),

          automaticAdvantagesText:
            fmap (modifyNegIntNoBreak) (automaticAdvantagesText),

          stronglyRecommendedAdvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (map (prefixId (IdPrefixes.ADVANTAGES)))
                    (rs.estronglyRecommendedAdvantages)),

          stronglyRecommendedAdvantagesText:
            fmap (modifyNegIntNoBreak) (stronglyRecommendedAdvantagesText),

          stronglyRecommendedDisadvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (map (prefixId (IdPrefixes.DISADVANTAGES)))
                    (rs.estronglyRecommendedDisadvantages)),

          stronglyRecommendedDisadvantagesText:
            fmap (modifyNegIntNoBreak) (stronglyRecommendedDisadvantagesText),

          commonAdvantages:
            maybePrefix (IdPrefixes.ADVANTAGES) (rs.ecommonAdvantages),

          commonAdvantagesText:
            fmap (modifyNegIntNoBreak) (commonAdvantagesText),

          commonDisadvantages:
            maybePrefix (IdPrefixes.DISADVANTAGES) (rs.ecommonDisadvantages),

          commonDisadvantagesText:
            fmap (modifyNegIntNoBreak) (commonDisadvantagesText),

          uncommonAdvantages:
            maybePrefix (IdPrefixes.ADVANTAGES) (rs.euncommonAdvantages),

          uncommonAdvantagesText:
            fmap (modifyNegIntNoBreak) (uncommonAdvantagesText),

          uncommonDisadvantages:
            maybePrefix (IdPrefixes.DISADVANTAGES) (rs.euncommonDisadvantages),

          uncommonDisadvantagesText:
            fmap (modifyNegIntNoBreak) (uncommonDisadvantagesText),

          hairColors: rs.ehairColors,

          eyeColors: rs.eeyeColors,

          sizeBase: rs.esizeBase,
          sizeRandom:
            fmap (map ((p: Pair<number, number>) =>
                   Die ({
                     amount: fst (p),
                     sides: snd (p),
                   })))
                 (rs.esizeRandom),

          weightBase: rs.eweightBase,
          weightRandom:
            map ((p: Pair<number, number>) =>
                   Die ({
                     amount: fst (p),
                     sides: snd (p),
                   }))
                 (rs.eweightRandom),

          variants:
            maybePrefix (IdPrefixes.RACE_VARIANTS) (rs.evariants),

          src: rs.esrc,
          errata: rs.eerrata,

          category: Nothing,
        }))
    })
