import { List } from "../../../../Data/List"
import { fromDefault } from "../../../../Data/Record"
import { ProfessionSelectionIds } from "../wikiTypeHelpers"

export interface SpecializationSelection {
  "@@name": "SpecializationSelection"
  id: ProfessionSelectionIds
  sid: string | List<string>
}

export const SpecializationSelection =
  fromDefault ("SpecializationSelection")
              <SpecializationSelection> ({
                id: ProfessionSelectionIds.SPECIALIZATION,
                sid: "",
              })
