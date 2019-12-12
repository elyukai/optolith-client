import { isJust, Just, Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { HitZoneArmorBase } from "./HitZoneArmor";

export interface EditHitZoneArmor extends HitZoneArmorBase {
  "@@name": "EditHitZoneArmor"
  id: Maybe<string>
}

export interface EditHitZoneArmorSafe extends EditHitZoneArmor {
  id: Just<string>
}

export const EditHitZoneArmor =
  fromDefault ("EditHitZoneArmor")
              <EditHitZoneArmor> ({
                id: Nothing,
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

export const EditHitZoneArmorL = makeLenses (EditHitZoneArmor)

export const ensureHitZoneArmorId =
  (x: Record<EditHitZoneArmor>): x is Record<EditHitZoneArmorSafe> =>
    isJust (EditHitZoneArmor.AL.id (x))
