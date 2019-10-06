import { fmap } from "../../../../Data/Functor";
import { List, map } from "../../../../Data/List";
import { fromMaybe, Nothing } from "../../../../Data/Maybe";
import { OrderedSet } from "../../../../Data/OrderedSet";
import { Aspect, BlessedGroup, BlessedTradition } from "../../../Constants/Groups";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant";
import { CheckModifier } from "../../../Models/Wiki/wikiTypeHelpers";
import { isCheckMod, prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { modifyNegIntNoBreak } from "../rawConversionUtils";
import { mensureMapBoolean, mensureMapNatural, mensureMapNaturalFixedList, mensureMapNonEmptyString, mensureMapNumEnum, mensureMapNumEnumList, mensureMapNumEnumListOptional, mensureMapStringPredSetOptional } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed, TableType } from "../validateValueUtils";
import { toSourceLinks } from "./Sub/toSourceLinks";

export const toLiturgicalChant =
  mergeRowsById
    ("toLiturgicalChant")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkSkillCheck =
        lookupKeyValid (mensureMapNaturalFixedList (3) ("&"))
                       (TableType.Univ)
                       (lookup_univ)

      const checkCheckModifier =
        lookupKeyValid (mensureMapStringPredSetOptional (isCheckMod)
                                                        (`"SPI" | "TOU"`)
                                                        (","))
                       (TableType.Univ)
                       (lookup_univ)

      const checkUnivNaturalNumber =
        lookupKeyValid (mensureMapNatural) (TableType.Univ) (lookup_univ)

      const checkUnivBoolean =
        lookupKeyValid (mensureMapBoolean) (TableType.Univ) (lookup_univ)

      const checkBlessedTraditions =
        lookupKeyValid (mensureMapNumEnumList ("BlessedTradition")
                                              (BlessedTradition)
                                              ("&"))
                       (TableType.Univ)
                       (lookup_univ)

      const checkBlessedGroup =
        lookupKeyValid (mensureMapNumEnum ("BlessedGroup")
                                          (BlessedGroup))
                       (TableType.Univ)
                       (lookup_univ)

      const checkAspects =
        lookupKeyValid (mensureMapNumEnumListOptional ("Aspect")
                                                      (Aspect)
                                                      ("&"))
                       (TableType.Univ)
                       (lookup_univ)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const echeck =
        fmap<List<string | number>, List<string>>
          (map (prefixId (IdPrefixes.ATTRIBUTES)))
          (checkSkillCheck ("check"))

      const echeckMod = checkCheckModifier ("checkMod")

      const eic = checkUnivNaturalNumber ("ic")

      const etraditions = checkBlessedTraditions ("traditions")

      const easpects = checkAspects ("aspects")

      const eeffect = checkL10nNonEmptyString ("effect")

      const ecastingTime = checkL10nNonEmptyString ("castingTime")

      const ecastingTimeShort = checkL10nNonEmptyString ("castingTimeShort")

      const ecastingTimeNoMod = checkUnivBoolean ("castingTimeNoMod")

      const ekpCost = checkL10nNonEmptyString ("kpCost")

      const ekpCostShort = checkL10nNonEmptyString ("kpCostShort")

      const ekpCostNoMod = checkUnivBoolean ("kpCostNoMod")

      const range = lookup_l10n ("range")

      const erangeShort = checkL10nNonEmptyString ("rangeShort")

      const erangeNoMod = checkUnivBoolean ("rangeNoMod")

      const duration = lookup_l10n ("duration")

      const durationShort = lookup_l10n ("durationShort")

      const edurationNoMod = checkUnivBoolean ("durationNoMod")

      const target = lookup_l10n ("target")

      const egr = checkBlessedGroup ("gr")

      const esrc = toSourceLinks (lookup_l10n)

      // Return error or result

      return mapMNamed
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
          ecastingTimeNoMod,
          ekpCost,
          ekpCostShort,
          ekpCostNoMod,
          erangeShort,
          erangeNoMod,
          edurationNoMod,
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
          aspects: fromMaybe (List<number> ()) (rs.easpects),
          effect: modifyNegIntNoBreak (rs.eeffect),
          castingTime: rs.ecastingTime,
          castingTimeShort: rs.ecastingTimeShort,
          castingTimeNoMod: rs.ecastingTimeNoMod,
          cost: rs.ekpCost,
          costShort: rs.ekpCostShort,
          costNoMod: rs.ekpCostNoMod,
          range: fromMaybe ("") (range),
          rangeShort: rs.erangeShort,
          rangeNoMod: rs.erangeNoMod,
          duration: fromMaybe ("") (duration),
          durationShort: fromMaybe ("") (durationShort),
          durationNoMod: rs.edurationNoMod,
          target: fromMaybe ("") (target),
          gr: rs.egr,
          src: rs.esrc,
          category: Nothing,
        }))
    })
