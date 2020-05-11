import { RawActiveObject } from "../../Utilities/Raw/RawData"

export interface ActiveObject {
  sid?: string | number
  sid2?: string | number
  sid3?: string | number
  tier?: number
  cost?: number
}

export const activeObjectFromRaw =
  (x: RawActiveObject): ActiveObject => ({
    cost: x.cost,
    sid: x.sid,
    sid2: x.sid2,
    sid3: x.sid3,
    tier: x.tier,
  })
