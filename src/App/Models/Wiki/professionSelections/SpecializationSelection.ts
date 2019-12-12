import { List } from "../../../../Data/List";
import { fromDefault, Record } from "../../../../Data/Record";
import { AnyProfessionSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";

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

export const isSpecializationSelection =
  (obj: AnyProfessionSelection): obj is Record<SpecializationSelection> =>
    SpecializationSelection.AL.id (obj) === ProfessionSelectionIds.SPECIALIZATION
