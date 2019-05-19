import { ProfessionSelectionIds } from "../../../../Models/Wiki/wikiTypeHelpers";
import { prefixSkill } from "../../../IDUtils";
import { exactR, naturalNumberU } from "../../../RegexUtils";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";

export interface RawSpecializationSelection {
  id: ProfessionSelectionIds
  sid: string | string[]
}

const skillId =
  new RegExp (exactR (prefixSkill (naturalNumberU)))

export const isSkillId = (x: string) => skillId .test (x)

export const isRawSpecializationSelection =
  (obj: AnyRawProfessionSelection): obj is RawSpecializationSelection =>
    obj.id === ProfessionSelectionIds.SPECIALIZATION
    && (
      // @ts-ignore
      typeof obj.sid === "string" && isSkillId (obj.sid)

      // @ts-ignore
      || Array.isArray (obj.sid) && obj.sid .every (isSkillId)
    )
