import { fmap } from "../../../../Data/Functor";
import { map } from "../../../../Data/List";
import { Nothing } from "../../../../Data/Maybe";
import { fst, Pair, snd } from "../../../../Data/Tuple";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { RaceVariant } from "../../../Models/Wiki/RaceVariant";
import { Die } from "../../../Models/Wiki/sub/Die";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { maybePrefix } from "../rawConversionUtils";
import { mensureMapIntegerOptional, mensureMapNaturalFixedListOptional, mensureMapNaturalListOptional, mensureMapNonEmptyString } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed, TableType } from "../validateValueUtils";
import { stringToDiceList } from "./toRace";

export const toRaceVariant =
  mergeRowsById
    ("toRaceVariant")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkOptionalUnivNaturalNumberList =
        lookupKeyValid (mensureMapNaturalListOptional ("&")) (TableType.Univ) (lookup_univ)

      const checkOptionalUnivNaturalNumberList20 =
        lookupKeyValid (mensureMapNaturalFixedListOptional (20) ("&"))
                       (TableType.Univ)
                       (lookup_univ)

      const checkOptionalUnivInteger =
        lookupKeyValid (mensureMapIntegerOptional) (TableType.Univ) (lookup_univ)

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
        lookupKeyValid (stringToDiceList)
                       (TableType.Univ)
                       (lookup_univ)
                       ("sizeRandom")

      // Return error or result

      return mapMNamed
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
             fmap (map ((p: Pair<number, number>) =>
                    Die ({
                      amount: fst (p),
                      sides: snd (p),
                    })))
                  (rs.esizeRandom),

          category: Nothing,
        }))
    })
