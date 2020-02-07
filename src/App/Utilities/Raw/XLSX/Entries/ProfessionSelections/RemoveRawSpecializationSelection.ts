import { ProfessionSelectionIds } from "../../../../../Models/Wiki/wikiTypeHelpers"
import { AnyRawProfessionVariantSelection } from "../rawTypeHelpers"
import { RawSpecializationSelection } from "./RawSpecializationSelection"

export interface RemoveRawSpecializationSelection {
  id: ProfessionSelectionIds
  active: false
}

export type RawVariantSpecializationSelection =
  RawSpecializationSelection |
  RemoveRawSpecializationSelection

export const isRemoveRawSpecializationSelection =
  (obj: AnyRawProfessionVariantSelection): obj is RemoveRawSpecializationSelection =>
    obj.id === ProfessionSelectionIds.SPECIALIZATION
    // @ts-ignore
    && obj.active === false
