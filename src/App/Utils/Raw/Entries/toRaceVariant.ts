import { pipe } from "ramda";
import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Cons, empty, List, map, splitOn } from "../../../../Data/List";
import { all, fmap, fromJust, fromMaybe, Nothing } from "../../../../Data/Maybe";
import { RaceVariant } from "../../../Models/Wiki/RaceVariant";
import { Die } from "../../../Models/Wiki/sub/Die";
import { prefixId } from "../../IDUtils";
import { unsafeToInt } from "../../NumberUtils";
import { naturalNumber } from "../../RegexUtils";
import { listLengthRx, listRx, pairRx } from "../csvRegexUtils";
import { mergeRowsById } from "../mergeTableRows";
import { allRights, lookupKeyValid, validateOptionalIntegerProp, validateRawProp, validateRequiredNonEmptyStringProp } from "../validateValueUtils";

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

export const toRaceVariant =
  mergeRowsById
    ("toRaceVariant")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (validateRequiredNonEmptyStringProp)

      const checkOptionalUnivInteger =
        lookupKeyValid (lookup_univ) (validateOptionalIntegerProp)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const ecommonCultures =
        lookupKeyValid (lookup_univ)
                       (validateRawProp ("List Natural")
                                        (all (checkNaturalNumberListWithAndDel)))
                       ("commonCultures")

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

      // Return error or result

      return allRights
        ({
          ename,
          ecommonCultures,
          ecommonAdvantages,
          ecommonDisadvantages,
          euncommonAdvantages,
          euncommonDisadvantages,
          ehairColors,
          eeyeColors,
          esizeBase,
          esizeRandom,
        })
        (rs => RaceVariant ({
          id: prefixId (IdPrefixes.RACE_VARIANTS) (id),

          name: fromJust (rs.ename),

          commonCultures:
            fromMaybe<List<string>>
              (empty)
              (fmap (pipe (splitOn ("&"), map (prefixId (IdPrefixes.CULTURES))))
                    (rs.ecommonCultures)),

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

          category: Nothing,
        }))
    })
