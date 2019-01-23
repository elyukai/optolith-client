import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Nothing } from "../../../../Data/Maybe";
import { Blessing } from "../../../Models/Wiki/Blessing";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapNaturalList, mensureMapNonEmptyString } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed } from "../validateValueUtils";
import { toSourceLinks } from "./Sub/toSourceLinks";

export const toBlessing =
  mergeRowsById
    ("toBlessing")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (lookup_l10n)

      const checkUnivNaturalNumberList =
        lookupKeyValid (mensureMapNaturalList ("&")) (lookup_univ)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const etraditions = checkUnivNaturalNumberList ("traditions")

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
          effect: rs.eeffect,
          range: rs.erange,
          duration: rs.eduration,
          target: rs.etarget,
          src: rs.esrc,
          category: Nothing,
        }))
    })
