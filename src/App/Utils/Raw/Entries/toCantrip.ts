import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Nothing } from "../../../../Data/Maybe";
import { Cantrip } from "../../../Models/Wiki/Cantrip";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapNatural, mensureMapNaturalList, mensureMapNonEmptyString } from "../validateMapValueUtils";
import { allRights, lookupKeyValid } from "../validateValueUtils";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

export const toCantrip =
  mergeRowsById
    ("toCantrip")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (mensureMapNonEmptyString)

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (mensureMapNatural)

      const checkUnivNaturalNumberList =
        lookupKeyValid (lookup_univ) (mensureMapNaturalList ("&"))

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const eic = checkUnivNaturalNumber ("ic")

      const etraditions = checkUnivNaturalNumberList ("traditions")

      const eproperty = checkUnivNaturalNumber ("property")

      const eeffect = checkL10nNonEmptyString ("effect")

      const erange = checkL10nNonEmptyString ("range")

      const eduration = checkL10nNonEmptyString ("duration")

      const etarget = checkL10nNonEmptyString ("target")

      const note = lookup_l10n ("note")

      const esrc = lookupValidSourceLinks (lookup_l10n)

      // Return error or result

      return allRights
        ({
          ename,
          eic,
          etraditions,
          eproperty,
          eeffect,
          erange,
          eduration,
          etarget,
          esrc,
        })
        (rs => Cantrip ({
          id: prefixId (IdPrefixes.CANTRIPS) (id),
          name: rs.ename,
          tradition: rs.etraditions,
          property: rs.eproperty,
          effect: rs.eeffect,
          range: rs.erange,
          duration: rs.eduration,
          target: rs.etarget,
          note,
          src: toSourceLinks (rs.esrc),
          category: Nothing,
        }))
    })
