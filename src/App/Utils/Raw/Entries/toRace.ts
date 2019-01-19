import { pipe } from "ramda";
import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Cons, empty, List, map, splitOn } from "../../../../Data/List";
import { all, any, fmap, fromJust, fromMaybe, maybe, Nothing } from "../../../../Data/Maybe";
import { fromBinary, Pair } from "../../../../Data/Pair";
import { Race } from "../../../Models/Wiki/Race";
import { Die } from "../../../Models/Wiki/sub/Die";
import { prefixId } from "../../IDUtils";
import { unsafeToInt } from "../../NumberUtils";
import { integer, naturalNumber } from "../../RegexUtils";
import { listRx, pairRx, qmPairRx } from "../csvRegexUtils";
import { mergeRowsById } from "../mergeTableRows";
import { maybePrefix } from "../rawConversionUtils";
import { validateMapOptionalIntegerProp, validateMapOptionalNaturalNumberFixedListProp, validateMapOptionalNaturalNumberListProp, validateMapRequiredIntegerProp, validateMapRequiredNaturalNumberListProp, validateMapRequiredNaturalNumberProp, validateMapRequiredNonEmptyStringProp } from "../validateMapValueUtils";
import { allRights, lookupKeyValid, validateRawProp } from "../validateValueUtils";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

const attributeAdjustment = qmPairRx (naturalNumber.source, integer.source)

const attributeAdjustments = new RegExp (listRx ("&") (attributeAdjustment))

const checkAttributeAdjustments =
  (x: string) => attributeAdjustments .test (x)

const die = pairRx ("D") (naturalNumber.source, naturalNumber.source)

const diceList =
  new RegExp (listRx ("&") (die))

const checkDiceList =
  (x: string) => diceList .test (x)

const negativeDie = pairRx ("D") (integer.source, naturalNumber.source)

const negativeDiceList =
  new RegExp (listRx ("&") (negativeDie))

const checkNegativeDiceList =
  (x: string) => negativeDiceList .test (x)

export const toRace =
  mergeRowsById
    ("toRace")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (validateMapRequiredNonEmptyStringProp)

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (validateMapRequiredNaturalNumberProp)

      const checkUnivNaturalNumberList =
        lookupKeyValid (lookup_univ) (validateMapRequiredNaturalNumberListProp ("&"))

      const checkOptionalUnivNaturalNumberList =
        lookupKeyValid (lookup_univ) (validateMapOptionalNaturalNumberListProp ("&"))

      const checkOptionalUnivNaturalNumberList20 =
        lookupKeyValid (lookup_univ) (validateMapOptionalNaturalNumberFixedListProp (20) ("&"))

      const checkUnivInteger =
        lookupKeyValid (lookup_univ) (validateMapRequiredIntegerProp)

      const checkOptionalUnivInteger =
        lookupKeyValid (lookup_univ) (validateMapOptionalIntegerProp)

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
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe [(Natural, Int)]")
                                        (all (checkAttributeAdjustments)))
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
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe [(Natural, Natural)]")
                                        (all (checkDiceList)))
                       ("sizeRandom")

      const eweightBase =
        checkUnivInteger ("weightBase")

      const eweightRandom =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("[(Int, Natural)]")
                                        (any (checkNegativeDiceList)))
                       ("weightRandom")

      const evariants =
        checkOptionalUnivNaturalNumberList ("variants")

      const esrc = lookupValidSourceLinks (lookup_l10n)

      // Return error or result

      return allRights
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
            maybe<string, List<Pair<string, number>>>
              (empty)
              (pipe (
                splitOn ("&"),
                map (x => {
                  const xs = splitOn ("?") (x) as Cons<string>
                  const attrId = xs .x
                  const value = (xs .xs as Cons<string>) .x

                  return fromBinary (
                    prefixId (IdPrefixes.ATTRIBUTES) (attrId),
                    unsafeToInt (value)
                  )
                })
              ))
              (rs.eattributeAdjustments),

          attributeAdjustmentsSelection:
            fromBinary (
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
            fmap (pipe (
                   splitOn ("&"),
                   map (x => {
                     const xs = splitOn ("D") (x) as Cons<string>
                     const amount = xs .x
                     const sides = (xs .xs as Cons<string>) .x

                     return Die ({
                       amount: unsafeToInt (amount),
                       sides: unsafeToInt (sides),
                     })
                   })
                 ))
                 (rs.esizeRandom),

          weightBase: rs.eweightBase,
          weightRandom:
            pipe (
                   splitOn ("&"),
                   map (x => {
                     const xs = splitOn ("D") (x) as Cons<string>
                     const amount = xs .x
                     const sides = (xs .xs as Cons<string>) .x

                     return Die ({
                       amount: unsafeToInt (amount),
                       sides: unsafeToInt (sides),
                     })
                   })
                 )
                 (fromJust (rs.eweightRandom)),

          variants:
            maybePrefix (IdPrefixes.RACE_VARIANTS) (rs.evariants),

          src: toSourceLinks (rs.esrc),

          category: Nothing,
        }))
    })
