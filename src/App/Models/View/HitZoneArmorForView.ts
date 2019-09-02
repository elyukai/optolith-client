import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";

export interface HitZoneArmorForView {
  "@@name": "HitZoneArmorForView"
  id: string
  name: string
  head: Maybe<number>
  leftArm: Maybe<number>
  leftLeg: Maybe<number>
  rightArm: Maybe<number>
  rightLeg: Maybe<number>
  torso: Maybe<number>
  enc: number
  addPenalties: boolean
  weight: number
}

export const HitZoneArmorForView =
  fromDefault ("HitZoneArmorForView")
              <HitZoneArmorForView> ({
                id: "",
                name: "",
                head: Nothing,
                leftArm: Nothing,
                leftLeg: Nothing,
                rightArm: Nothing,
                rightLeg: Nothing,
                torso: Nothing,
                enc: 0,
                addPenalties: false,
                weight: 0,
              })
