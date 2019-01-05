import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";

export interface HitZoneArmorBase {
  name: string
  head: Maybe<string>
  headLoss: Maybe<number>
  leftArm: Maybe<string>
  leftArmLoss: Maybe<number>
  rightArm: Maybe<string>
  rightArmLoss: Maybe<number>
  torso: Maybe<string>
  torsoLoss: Maybe<number>
  leftLeg: Maybe<string>
  leftLegLoss: Maybe<number>
  rightLeg: Maybe<string>
  rightLegLoss: Maybe<number>
}

export interface HitZoneArmor extends HitZoneArmorBase {
  id: string
}

export const HitZoneArmor =
  fromDefault<HitZoneArmor> ({
    id: "",
    name: "",
    head: Nothing,
    headLoss: Nothing,
    leftArm: Nothing,
    leftArmLoss: Nothing,
    rightArm: Nothing,
    rightArmLoss: Nothing,
    torso: Nothing,
    torsoLoss: Nothing,
    leftLeg: Nothing,
    leftLegLoss: Nothing,
    rightLeg: Nothing,
    rightLegLoss: Nothing,
  })
