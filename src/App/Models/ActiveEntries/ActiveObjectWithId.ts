import { ActiveObject } from "./ActiveObject"

export interface ActiveObjectWithId {
  id: string
  index: number
  sid?: string | number
  sid2?: string | number
  sid3?: string | number
  tier?: number
  cost?: number
}

export const toActiveObjectWithId = (index: number) =>
                                    (id: string) =>
                                    (active: ActiveObject): ActiveObjectWithId =>
                                      ({
                                        id,
                                        index,
                                        cost: active.cost,
                                        sid: active.sid,
                                        sid2: active.sid2,
                                        sid3: active.sid3,
                                        tier: active.tier,
                                      })

export const fromActiveObjectWithId =
  (active: ActiveObjectWithId): ActiveObject =>
    ({
      cost: active.cost,
      sid: active.sid,
      sid2: active.sid2,
      sid3: active.sid3,
      tier: active.tier,
    })
