import { fromDefault } from "../../../../Data/Record";
import { SocialStatusId } from "../../../Constants/Ids";

export interface SocialPrerequisite {
  "@@name": "SocialPrerequisite"
  value: SocialStatusId
}

export const SocialPrerequisite =
  fromDefault ("SocialPrerequisite")
              <SocialPrerequisite> ({
                value: SocialStatusId.Free,
              })
