import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, makeLenses } from "../../../Data/Record"
import { RawActiveObject } from "../../Utilities/Raw/RawData"

export interface ActiveObject {
  "@@name": "ActiveObject"
  sid: Maybe<string | number>
  sid2: Maybe<string | number>
  sid3: Maybe<string | number>
  tier: Maybe<number>
  cost: Maybe<number>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActiveObject =
  fromDefault ("ActiveObject")
              <ActiveObject> ({
                cost: Nothing,
                sid: Nothing,
                sid2: Nothing,
                sid3: Nothing,
                tier: Nothing,
              })

export const ActiveObjectL = makeLenses (ActiveObject)

export const activeObjectFromRaw = (x: RawActiveObject) => ActiveObject ({
                                                             cost: Maybe (x.cost),
                                                             sid: Maybe (x.sid),
                                                             sid2: Maybe (x.sid2),
                                                             sid3: Maybe (x.sid3),
                                                             tier: Maybe (x.tier),
                                                           })
