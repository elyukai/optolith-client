import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses } from "../../../Data/Record";

export interface ActiveObject {
  "@@name": "ActiveObject"
  sid: Maybe<string | number>;
  sid2: Maybe<string | number>;
  sid3: Maybe<string | number>;
  tier: Maybe<number>;
  cost: Maybe<number>;
}

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
