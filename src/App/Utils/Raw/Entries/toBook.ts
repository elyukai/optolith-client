import { Book } from "../../../Models/Wiki/Book";
import { fromRow } from "../mergeTableRows";
import { mensureMapNonEmptyString } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed } from "../validateValueUtils";

export const toBook =
  fromRow
    ("toBlessing")
    (id => lookup_l10n => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (lookup_l10n)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const eshort = checkL10nNonEmptyString ("short")

      // Return error or result

      return mapMNamed
        ({
          ename,
          eshort,
        })
        (rs => Book ({
          id,
          name: rs.ename,
          short: rs.eshort,
        }))
    })
