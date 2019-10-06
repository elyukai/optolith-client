import { List } from "../../../../Data/List";
import { fromDefault } from "../../../../Data/Record";
import { ProfessionSelectionIds } from "../wikiTypeHelpers";

export interface SpecialAbilitySelection {
  "@@name": "SpecialAbilitySelection"
  id: ProfessionSelectionIds
  sid: string | List<string>
}

export const SpecialAbilitySelection =
  fromDefault ("SpecialAbilitySelection")
              <SpecialAbilitySelection> ({
                id: ProfessionSelectionIds.SPECIALIZATION,
                sid: "",
              })
