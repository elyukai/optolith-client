import { SocialStatusId } from "../../../../Constants/Ids";
import { SocialPrerequisite } from "../../../../Models/Wiki/prerequisites/SocialPrerequisite";
import { isInNumEnum } from "../../validateMapValueUtils";
import { AllRawRequirementObjects } from "../rawTypeHelpers";

export interface RawSocialPrerequisite {
  id: "SOCIAL"
  value: SocialStatusId
}

export const isRawSocialPrerequisite =
  (req: AllRawRequirementObjects): req is RawSocialPrerequisite =>
    req.id === "SOCIAL"
    // @ts-ignore
    && typeof req.value === "number"
    // @ts-ignore
    && isInNumEnum (SocialStatusId) (req.value)

export const fromRawSocialPrerequisiteToRecord =
  (req: RawSocialPrerequisite) =>
    SocialPrerequisite ({
      value: req .value,
    })
