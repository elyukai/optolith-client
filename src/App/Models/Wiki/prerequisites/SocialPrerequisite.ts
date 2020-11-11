import { fromDefault } from "../../../../Data/Record"

export interface SocialPrerequisite {
  "@@name": "SocialPrerequisite"
  value: number
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SocialPrerequisite =
  fromDefault ("SocialPrerequisite")
              <SocialPrerequisite> ({
                value: 1,
              })
