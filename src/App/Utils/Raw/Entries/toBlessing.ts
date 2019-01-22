import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Nothing } from "../../../../Data/Maybe";
import { Blessing } from "../../../Models/Wiki/Blessing";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapNaturalList, mensureMapNonEmptyString } from "../validateMapValueUtils";
import { allRights, lookupKeyValid } from "../validateValueUtils";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

export const toBlessing =
  mergeRowsById
    ("toBlessing")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (mensureMapNonEmptyString)

      const checkUnivNaturalNumberList =
        lookupKeyValid (lookup_univ) (mensureMapNaturalList ("&"))

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const etraditions = checkUnivNaturalNumberList ("traditions")

      const eeffect = checkL10nNonEmptyString ("effect")

      const erange = checkL10nNonEmptyString ("range")

      const eduration = checkL10nNonEmptyString ("duration")

      const etarget = checkL10nNonEmptyString ("target")

      const esrc = lookupValidSourceLinks (lookup_l10n)

      // Return error or result

      return allRights
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
          src: toSourceLinks (rs.esrc),
          category: Nothing,
        }))
    })
