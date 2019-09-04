import { fmap } from "../../../../Data/Functor";
import { empty, List, map } from "../../../../Data/List";
import { fromMaybe, Nothing } from "../../../../Data/Maybe";
import { OrderedSet } from "../../../../Data/OrderedSet";
import { MagicalGroup, MagicalTradition, Property } from "../../../Constants/Groups";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { Spell } from "../../../Models/Wiki/Spell";
import { CheckModifier } from "../../../Models/Wiki/wikiTypeHelpers";
import { isCheckMod, prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { modifyNegIntNoBreak } from "../rawConversionUtils";
import { mensureMapBoolean, mensureMapNatural, mensureMapNaturalFixedList, mensureMapNaturalListOptional, mensureMapNonEmptyString, mensureMapNumEnum, mensureMapNumEnumList, mensureMapStringPredSetOptional } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed, TableType } from "../validateValueUtils";
import { toSpellPrerequisites } from "./Sub/toPrerequisites";
import { toSourceLinks } from "./Sub/toSourceLinks";

export const toSpell =
  mergeRowsById
    ("toSpell")
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

      const checkUnivNaturalNumberListOptional =
        lookupKeyValid (mensureMapNaturalListOptional ("&")) (TableType.Univ) (lookup_univ)

      const checkUnivBoolean =
        lookupKeyValid (mensureMapBoolean) (TableType.Univ) (lookup_univ)

      const checkSpellTraditions =
        lookupKeyValid (mensureMapNumEnumList ("MagicalTradition")
                                              (MagicalTradition)
                                              ("&"))
                       (TableType.Univ)
                       (lookup_univ)

      const checkSpellGroup =
        lookupKeyValid (mensureMapNumEnum ("MagicalGroup")
                                          (MagicalGroup))
                       (TableType.Univ)
                       (lookup_univ)

      const checkProperty =
        lookupKeyValid (mensureMapNumEnum ("Property")
                                          (Property))
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

      const etraditions = checkSpellTraditions ("traditions")

      const esubtraditions = checkUnivNaturalNumberListOptional ("subtraditions")

      const eproperty = checkProperty ("property")

      const eeffect = checkL10nNonEmptyString ("effect")

      const castingTime = lookup_l10n ("castingTime")

      const ecastingTimeShort = checkL10nNonEmptyString ("castingTimeShort")

      const ecastingTimeNoMod = checkUnivBoolean ("castingTimeNoMod")

      const eaeCost = checkL10nNonEmptyString ("aeCost")

      const eaeCostShort = checkL10nNonEmptyString ("aeCostShort")

      const eaeCostNoMod = checkUnivBoolean ("aeCostNoMod")

      const range = lookup_l10n ("range")

      const erangeShort = checkL10nNonEmptyString ("rangeShort")

      const erangeNoMod = checkUnivBoolean ("rangeNoMod")

      const duration = lookup_l10n ("duration")

      const durationShort = lookup_l10n ("durationShort")

      const edurationNoMod = checkUnivBoolean ("durationNoMod")

      const target = lookup_l10n ("target")

      const egr = checkSpellGroup ("gr")

      const eprerequisites = toSpellPrerequisites (lookup_univ)

      const esrc = toSourceLinks (lookup_l10n)

      // Return error or result

      return mapMNamed
        ({
          ename,
          echeck,
          echeckMod,
          eic,
          etraditions,
          esubtraditions,
          eproperty,
          eeffect,
          ecastingTimeShort,
          ecastingTimeNoMod,
          eaeCost,
          eaeCostShort,
          eaeCostNoMod,
          erangeShort,
          erangeNoMod,
          edurationNoMod,
          egr,
          eprerequisites,
          esrc,
        })
        (rs => Spell ({
          id: prefixId (IdPrefixes.SPELLS) (id),
          name: rs.ename,
          check: rs.echeck,
          checkmod: fromMaybe<OrderedSet<CheckModifier>> (OrderedSet.empty) (rs.echeckMod),
          ic: rs.eic,
          tradition: rs.etraditions,
          subtradition: fromMaybe<List<number>> (empty) (rs.esubtraditions),
          property: rs.eproperty,
          effect: modifyNegIntNoBreak (rs.eeffect),
          castingTime: fromMaybe ("") (castingTime),
          castingTimeShort: rs.ecastingTimeShort,
          castingTimeNoMod: rs.ecastingTimeNoMod,
          cost: rs.eaeCost,
          costShort: rs.eaeCostShort,
          costNoMod: rs.eaeCostNoMod,
          range: fromMaybe ("") (range),
          rangeShort: rs.erangeShort,
          rangeNoMod: rs.erangeNoMod,
          duration: fromMaybe ("") (duration),
          durationShort: fromMaybe ("") (durationShort),
          durationNoMod: rs.edurationNoMod,
          target: fromMaybe ("") (target),
          gr: rs.egr,
          prerequisites: rs.eprerequisites,
          src: rs.esrc,
          category: Nothing,
        }))
    })
