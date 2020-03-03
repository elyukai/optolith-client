import { fromDefault } from "../../../../Data/Record"

export interface SocialPrerequisite {
  "@@name": "SocialPrerequisite"
  value: number
}

export const SocialPrerequisite =
  fromDefault ("SocialPrerequisite")
              <SocialPrerequisite> ({
                value: 1,
              })
