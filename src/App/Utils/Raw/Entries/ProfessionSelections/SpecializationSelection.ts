import { IdPrefixes } from "../../../../../constants/IdPrefixes";
import { ProfessionSelectionIds } from "../../../../Models/Wiki/wikiTypeHelpers";
import { prefixId } from "../../../IDUtils";
import { naturalNumber } from "../../../RegexUtils";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";

export interface RawSpecializationSelection {
  id: ProfessionSelectionIds
  sid: string | string[]
}

const skillId =
  new RegExp (prefixId (IdPrefixes.SKILLS) (naturalNumber.source))

export const isSkillId = (x: string) => skillId .test (x)

export const isRawSpecializationSelection =
  (obj: AnyRawProfessionSelection): obj is RawSpecializationSelection =>
    obj.id === ProfessionSelectionIds.SPECIALIZATION
    // @ts-ignore
    && typeof obj.sid === "string"
    // @ts-ignore
    || Array.isArray (obj) && obj .every (isSkillId)
