import { isJust } from "../../../Data/Maybe"
import { HitZoneArmorBase } from "./HitZoneArmor"

export interface EditHitZoneArmor extends HitZoneArmorBase {
  id?: string
}

export interface EditHitZoneArmorSafe extends EditHitZoneArmor {
  id: string
}

export const ensureHitZoneArmorId =
  (x: EditHitZoneArmor): x is EditHitZoneArmorSafe =>
    isJust (x.id)
