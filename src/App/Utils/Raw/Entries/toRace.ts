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
import { listLengthRx, listRx, pairRx, qmPairRx } from "../csvRegexUtils";
import { mergeRowsById } from "../mergeTableRows";
import { allRights, lookupKeyValid, validateOptionalIntegerProp, validateRawProp, validateRequiredIntegerProp, validateRequiredNaturalNumberProp, validateRequiredNonEmptyStringProp } from "../validateValueUtils";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

const attributeAdjustment = qmPairRx (naturalNumber.source, integer.source)

const attributeAdjustments = new RegExp (listRx ("&") (attributeAdjustment))

const checkAttributeAdjustments =
  (x: string) => attributeAdjustments .test (x)

const naturalNumberListWithAndDel =
  new RegExp (listRx ("&") (naturalNumber.source))

const checkNaturalNumberListWithAndDel =
  (x: string) => naturalNumberListWithAndDel .test (x)

const naturalNumberListOfLength20WithAndDel =
  new RegExp (listLengthRx (20) ("&") (naturalNumber.source))

const checkNaturalNumberListOfLength20WithAndDel =
  (x: string) => naturalNumberListOfLength20WithAndDel .test (x)

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
        lookupKeyValid (lookup_l10n) (validateRequiredNonEmptyStringProp)

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (validateRequiredNaturalNumberProp)

      const checkUnivInteger =
        lookupKeyValid (lookup_univ) (validateRequiredIntegerProp)

      const checkOptionalUnivInteger =
        lookupKeyValid (lookup_univ) (validateOptionalIntegerProp)

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
                       (validateRawProp ("Maybe (List (Natural, Int))")
                                        (all (checkAttributeAdjustments)))
                       ("attributeAdjustments")

      const eattributeAdjustmentsText =
        checkL10nNonEmptyString ("attributeAdjustments")

      const eattributeAdjustmentsSelectionValue =
        checkUnivInteger ("attributeAdjustmentsSelectionValue")

      const eattributeAdjustmentsSelectionList =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("List Natural")
                                        (any (checkNaturalNumberListWithAndDel)))
                       ("attributeAdjustmentsSelectionList")

      const ecommonCultures =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("List Natural")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("commonCultures")

      const eautomaticAdvantages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("automaticAdvantages")

      const automaticAdvantagesText =
        lookup_l10n ("automaticAdvantages")

      const estronglyRecommendedAdvantages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("stronglyRecommendedAdvantages")

      const stronglyRecommendedAdvantagesText =
        lookup_l10n ("stronglyRecommendedAdvantages")

      const estronglyRecommendedDisadvantages =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("stronglyRecommendedDisadvantages")

      const stronglyRecommendedDisadvantagesText =
        lookup_l10n ("stronglyRecommendedDisadvantages")

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

      const ehairColors =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural { length = 20 })")
                                        (all (checkNaturalNumberListOfLength20WithAndDel)))
                       ("hairColors")

      const eeyeColors =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural { length = 20 })")
                                        (all (checkNaturalNumberListOfLength20WithAndDel)))
                       ("eyeColors")

      const esizeBase =
        checkOptionalUnivInteger ("sizeBase")

      const esizeRandom =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List (Natural, Natural))")
                                        (all (checkDiceList)))
                       ("sizeRandom")

      const eweightBase =
        checkUnivInteger ("weightBase")

      const eweightRandom =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("List (Int, Natural)")
                                        (any (checkNegativeDiceList)))
                       ("weightRandom")

      const evariants =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("Maybe (List Natural)")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("variants")

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
          name: fromJust (rs.ename),
          lp: unsafeToInt (fromJust (rs.elp)),
          spi: unsafeToInt (fromJust (rs.espi)),
          tou: unsafeToInt (fromJust (rs.etou)),
          mov: unsafeToInt (fromJust (rs.emov)),
          ap: unsafeToInt (fromJust (rs.ecost)),

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
              unsafeToInt (fromJust (rs.eattributeAdjustmentsSelectionValue)),
              pipe (splitOn ("&"), map (prefixId (IdPrefixes.ATTRIBUTES)))
                   (fromJust (rs.eattributeAdjustmentsSelectionList))
            ),

          attributeAdjustmentsText: fromJust (rs.eattributeAdjustmentsText),

          commonCultures:
            fromMaybe<List<string>>
              (empty)
              (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.CULTURES))))
                    (rs.ecommonCultures)),

          automaticAdvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.ADVANTAGES))))
                    (rs.eautomaticAdvantages)),

          automaticAdvantagesText,

          stronglyRecommendedAdvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.ADVANTAGES))))
                    (rs.estronglyRecommendedAdvantages)),

          stronglyRecommendedAdvantagesText,

          stronglyRecommendedDisadvantages:
            fromMaybe<List<string>>
              (empty)
              (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.DISADVANTAGES))))
                    (rs.estronglyRecommendedDisadvantages)),

          stronglyRecommendedDisadvantagesText,

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

          hairColors: fmap (pipe (splitOn ("&"), map (unsafeToInt))) (rs.ehairColors),

          eyeColors: fmap (pipe (splitOn ("&"), map (unsafeToInt))) (rs.eeyeColors),

          sizeBase: fmap (unsafeToInt) (rs.esizeBase),
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

          weightBase: unsafeToInt (fromJust (rs.eweightBase)),
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
            fromMaybe<List<string>>
              (empty)
              (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.RACE_VARIANTS))))
                    (rs.evariants)),

          src: toSourceLinks (rs.esrc),

          category: Nothing,
        }))
    })
