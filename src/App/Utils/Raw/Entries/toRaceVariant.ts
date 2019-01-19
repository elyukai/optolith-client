import { pipe } from "ramda";
import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Cons, map, splitOn } from "../../../../Data/List";
import { all, fmap, Nothing } from "../../../../Data/Maybe";
import { RaceVariant } from "../../../Models/Wiki/RaceVariant";
import { Die } from "../../../Models/Wiki/sub/Die";
import { prefixId } from "../../IDUtils";
import { unsafeToInt } from "../../NumberUtils";
import { naturalNumber } from "../../RegexUtils";
import { listRx, pairRx } from "../csvRegexUtils";
import { mergeRowsById } from "../mergeTableRows";
import { maybePrefix } from "../rawConversionUtils";
import { validateMapOptionalIntegerProp, validateMapOptionalNaturalNumberFixedListProp, validateMapOptionalNaturalNumberListProp, validateMapRequiredNonEmptyStringProp } from "../validateMapValueUtils";
import { allRights, lookupKeyValid, validateRawProp } from "../validateValueUtils";

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
        lookupKeyValid (lookup_l10n) (validateMapRequiredNonEmptyStringProp)

      const checkOptionalUnivNaturalNumberList =
        lookupKeyValid (lookup_univ) (validateMapOptionalNaturalNumberListProp ("&"))

      const checkOptionalUnivNaturalNumberList20 =
        lookupKeyValid (lookup_univ) (validateMapOptionalNaturalNumberFixedListProp (20) ("&"))

      const checkOptionalUnivInteger =
        lookupKeyValid (lookup_univ) (validateMapOptionalIntegerProp)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const ecommonCultures =
        checkOptionalUnivNaturalNumberList ("commonCultures")

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

          name: rs.ename,

          commonCultures:
            maybePrefix (IdPrefixes.CULTURES) (rs.ecommonCultures),

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

          category: Nothing,
        }))
    })
