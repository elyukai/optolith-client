import { fmap } from "../../../../Data/Functor";
import { empty, List, map } from "../../../../Data/List";
import { fromMaybe, Nothing } from "../../../../Data/Maybe";
import { first, fst, Pair, snd } from "../../../../Data/Pair";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { Race } from "../../../Models/Wiki/Race";
import { Die } from "../../../Models/Wiki/sub/Die";
import { prefixId } from "../../IDUtils";
import { toInt, toNatural } from "../../NumberUtils";
import { mergeRowsById } from "../mergeTableRows";
import { maybePrefix } from "../rawConversionUtils";
import { mensureMapInteger, mensureMapIntegerOptional, mensureMapNaturalFixedListOptional, mensureMapNaturalList, mensureMapNaturalListOptional, mensureMapPairList, mensureMapPairListOptional } from "../validateMapValueUtils";
import { Expect, lookupKeyMapValidNatural, lookupKeyMapValidNonEmptyString, lookupKeyValid, mapMNamed } from "../validateValueUtils";
import { toSourceLinks } from "./Sub/toSourceLinks";

const stringToAttributeAdjustments =
  mensureMapPairList ("&")
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
        lookupKeyMapValidNonEmptyString (lookup_l10n)

      const checkUnivNaturalNumber =
        lookupKeyMapValidNatural (lookup_univ)

      const checkUnivNaturalNumberList =
        lookupKeyValid (mensureMapNaturalList ("&")) (lookup_univ)

      const checkOptionalUnivNaturalNumberList =
        lookupKeyValid (mensureMapNaturalListOptional ("&")) (lookup_univ)

      const checkOptionalUnivNaturalNumberList20 =
        lookupKeyValid (mensureMapNaturalFixedListOptional (20) ("&")) (lookup_univ)

      const checkUnivInteger =
        lookupKeyValid (mensureMapInteger) (lookup_univ)

      const checkOptionalUnivInteger =
        lookupKeyValid (mensureMapIntegerOptional) (lookup_univ)

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
                       (lookup_univ)
                       ("attributeAdjustments")

      const eattributeAdjustmentsText =
        checkL10nNonEmptyString ("attributeAdjustments")

      const eattributeAdjustmentsSelectionValue =
        checkUnivInteger ("attributeAdjustmentsSelectionValue")

      const eattributeAdjustmentsSelectionList =
        checkUnivNaturalNumberList ("attributeAdjustmentsSelectionList")

      const ecommonCultures =
        checkUnivNaturalNumberList ("commonCultures")

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
                       (lookup_univ)
                       ("sizeRandom")

      const eweightBase =
        checkUnivInteger ("weightBase")

      const eweightRandom =
        lookupKeyValid (stringToNegativeDiceList)
                       (lookup_univ)
                       ("weightRandom")

      const evariants =
        checkOptionalUnivNaturalNumberList ("variants")

      const esrc = toSourceLinks (lookup_l10n)

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
              (rs.eattributeAdjustments),

          attributeAdjustmentsSelection:
            Pair (
              rs.eattributeAdjustmentsSelectionValue,
              map (prefixId (IdPrefixes.ATTRIBUTES)) (rs.eattributeAdjustmentsSelectionList)
            ),

          attributeAdjustmentsText: rs.eattributeAdjustmentsText,

          commonCultures:
            map (prefixId (IdPrefixes.CULTURES)) (rs.ecommonCultures),

          automaticAdvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (map (prefixId (IdPrefixes.ADVANTAGES)))
                    (rs.eautomaticAdvantages)),

          automaticAdvantagesText,

          stronglyRecommendedAdvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (map (prefixId (IdPrefixes.ADVANTAGES)))
                    (rs.estronglyRecommendedAdvantages)),

          stronglyRecommendedAdvantagesText,

          stronglyRecommendedDisadvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (map (prefixId (IdPrefixes.DISADVANTAGES)))
                    (rs.estronglyRecommendedDisadvantages)),

          stronglyRecommendedDisadvantagesText,

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

          category: Nothing,
        }))
    })