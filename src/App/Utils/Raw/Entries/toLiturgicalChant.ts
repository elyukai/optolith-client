import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Either } from "../../../../Data/Either";
import { List, map } from "../../../../Data/List";
import { fromMaybe, Nothing } from "../../../../Data/Maybe";
import { OrderedSet } from "../../../../Data/OrderedSet";
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant";
import { CheckModifier } from "../../../Models/Wiki/wikiTypeHelpers";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapNatural, mensureMapNaturalFixedList, mensureMapNaturalList, mensureMapNonEmptyString, mensureMapStringPredSetOptional } from "../validateMapValueUtils";
import { allRights, lookupKeyValid } from "../validateValueUtils";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

const checkMod = /SPI|TOU/

const checkCheckMod =
  (x: string): x is CheckModifier => checkMod .test (x)

export const toLiturgicalChant =
  mergeRowsById
    ("toLiturgicalChant")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (mensureMapNonEmptyString)

      const checkSkillCheck =
        lookupKeyValid (lookup_univ)
                       (mensureMapNaturalFixedList (3) ("&"))

      const checkCheckModifier =
        lookupKeyValid (lookup_univ)
                       (mensureMapStringPredSetOptional (checkCheckMod)
                                                        (`"SPI" | "TOU"`)
                                                        (","))

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (mensureMapNatural)

      const checkUnivNaturalNumberList =
        lookupKeyValid (lookup_univ) (mensureMapNaturalList ("&"))

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const echeck =
        Either.fmap<string, List<string | number>, List<string>>
          (map (prefixId (IdPrefixes.ATTRIBUTES)))
          (checkSkillCheck ("check"))

      const echeckMod = checkCheckModifier ("checkMod")

      const eic = checkUnivNaturalNumber ("ic")

      const etraditions = checkUnivNaturalNumberList ("traditions")

      const easpects = checkUnivNaturalNumberList ("easpects")

      const eeffect = checkL10nNonEmptyString ("effect")

      const ecastingTime = checkL10nNonEmptyString ("castingTime")

      const ecastingTimeShort = checkL10nNonEmptyString ("castingTimeShort")

      const eaeCost = checkL10nNonEmptyString ("aeCost")

      const eaeCostShort = checkL10nNonEmptyString ("aeCostShort")

      const range = lookup_l10n ("range")

      const erangeShort = checkL10nNonEmptyString ("rangeShort")

      const duration = lookup_l10n ("duration")

      const durationShort = lookup_l10n ("durationShort")

      const target = lookup_l10n ("target")

      const egr = checkUnivNaturalNumber ("gr")

      const esrc = lookupValidSourceLinks (lookup_l10n)

      // Return error or result

      return allRights
        ({
          ename,
          echeck,
          echeckMod,
          eic,
          etraditions,
          easpects,
          eeffect,
          ecastingTime,
          ecastingTimeShort,
          eaeCost,
          eaeCostShort,
          erangeShort,
          egr,
          esrc,
        })
        (rs => LiturgicalChant ({
          id: prefixId (IdPrefixes.LITURGICAL_CHANTS) (id),
          name: rs.ename,
          check: rs.echeck,
          checkmod: fromMaybe<OrderedSet<CheckModifier>> (OrderedSet.empty) (rs.echeckMod),
          ic: rs.eic,
          tradition: rs.etraditions,
          aspects: rs.easpects,
          effect: rs.eeffect,
          castingTime: rs.ecastingTime,
          castingTimeShort: rs.ecastingTimeShort,
          cost: rs.eaeCost,
          costShort: rs.eaeCostShort,
          range: fromMaybe ("") (range),
          rangeShort: rs.erangeShort,
          duration: fromMaybe ("") (duration),
          durationShort: fromMaybe ("") (durationShort),
          target: fromMaybe ("") (target),
          gr: rs.egr,
          src: toSourceLinks (rs.esrc),
          category: Nothing,
        }))
    })
