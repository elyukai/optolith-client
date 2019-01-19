import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Nothing } from "../../../../Data/Maybe";
import { Attribute } from "../../../Models/Wiki/Attribute";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { validateMapRequiredNonEmptyStringProp } from "../validateMapValueUtils";
import { allRights } from "../validateValueUtils";

export const toAttribute =
  mergeRowsById
    ("toAttribute")
    (id => lookup_l10n => _ => {
      // Check fields

      const ename =
        validateMapRequiredNonEmptyStringProp (lookup_l10n ("name"))

      const eshort =
        validateMapRequiredNonEmptyStringProp (lookup_l10n ("short"))

      // Return error or result

      return allRights
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
