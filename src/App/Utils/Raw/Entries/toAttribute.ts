import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { fromJust, Nothing } from "../../../../Data/Maybe";
import { Attribute } from "../../../Models/Wiki/Attribute";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { allRights, validateRequiredNonEmptyStringProp } from "../validateValueUtils";

export const toAttribute =
  mergeRowsById
    ("toAttribute")
    (id => lookup_l10n => _ => {
      // Check fields

      const ename =
        validateRequiredNonEmptyStringProp (lookup_l10n ("name"))

      const eshort =
        validateRequiredNonEmptyStringProp (lookup_l10n ("short"))

      // Return error or result

      return allRights
        ({
          ename,
          eshort,
        })
        (rs => Attribute ({
          id: prefixId (IdPrefixes.ATTRIBUTES) (id),
          name: fromJust (rs.ename),
          short: fromJust (rs.eshort),
          category: Nothing,
        }))
    })
