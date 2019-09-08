import { Nothing } from "../../../../Data/Maybe";
import { BlessedTradition } from "../../../Constants/Groups";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { Blessing } from "../../../Models/Wiki/Blessing";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { modifyNegIntNoBreak } from "../rawConversionUtils";
import { mensureMapNonEmptyString, mensureMapNumEnumList } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed, TableType } from "../validateValueUtils";
import { toSourceLinks } from "./Sub/toSourceLinks";

export const toBlessing =
  mergeRowsById
    ("toBlessing")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkBlessedTraditions =
        lookupKeyValid (mensureMapNumEnumList ("BlessedTradition")
                                              (BlessedTradition)
                                              ("&"))
                       (TableType.Univ)
                       (lookup_univ)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const etraditions = checkBlessedTraditions ("traditions")

      const eeffect = checkL10nNonEmptyString ("effect")

      const erange = checkL10nNonEmptyString ("range")

      const eduration = checkL10nNonEmptyString ("duration")

      const etarget = checkL10nNonEmptyString ("target")

      const esrc = toSourceLinks (lookup_l10n)

      // Return error or result

      return mapMNamed
        ({
          ename,
          etraditions,
          eeffect,
          erange,
          eduration,
          etarget,
          esrc,
        })
        (rs => Blessing ({
          id: prefixId (IdPrefixes.BLESSINGS) (id),
          name: rs.ename,
          tradition: rs.etraditions,
          effect: modifyNegIntNoBreak (rs.eeffect),
          range: rs.erange,
          duration: rs.eduration,
          target: rs.etarget,
          src: rs.esrc,
          category: Nothing,
        }))
    })
