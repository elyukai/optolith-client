import { Nothing } from "../../../../../Data/Maybe";
import { IdPrefixes } from "../../../../Constants/IdPrefixes";
import { Attribute } from "../../../../Models/Wiki/Attribute";
import { prefixId } from "../../../IDUtils";
import { mergeRowsById } from "../MergeRows";
import { mapMNamed } from "../Validators/Generic";
import { mensureMapNonEmptyString } from "../Validators/ToValue";

export const toAttribute =
  mergeRowsById
    ("toAttribute")
    (id => lookup_l10n => _ => {
      // Check fields

      const ename =
        mensureMapNonEmptyString (lookup_l10n ("name"))

      const eshort =
        mensureMapNonEmptyString (lookup_l10n ("short"))

      // Return error or result

      return mapMNamed
        ({
          ename,
          eshort,
        })
        (rs => Attribute ({
          id: prefixId (IdPrefixes.ATTRIBUTES) (id),
          name: rs.ename,
          short: rs.eshort,
          category: Nothing,
        }))
    })
