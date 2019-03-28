import { Book } from "../../../Models/Wiki/Book";
import { fromRow } from "../mergeTableRows";
import { mensureMapBoolean, mensureMapNonEmptyString } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed } from "../validateValueUtils";

export const toBook =
  fromRow
    ("toBook")
    (id => lookup_l10n => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (lookup_l10n)

      const checkL10nBoolean =
        lookupKeyValid (mensureMapBoolean) (lookup_l10n)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const eshort = checkL10nNonEmptyString ("short")

      const eisCore = checkL10nBoolean ("isCore")

      const eisAdultContent = checkL10nBoolean ("isAdultContent")

      // Return error or result

      return mapMNamed
        ({
          ename,
          eshort,
          eisCore,
          eisAdultContent,
        })
        (rs => Book ({
          id,
          name: rs.ename,
          short: rs.eshort,
          isCore: rs.eisCore,
          isAdultContent: rs.eisAdultContent,
        }))
    })
