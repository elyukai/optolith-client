import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, makeLenses_ } from '../structures/Record';

export interface ActiveObject {
  sid: Maybe<string | number>;
  sid2: Maybe<string | number>;
  tier: Maybe<number>;
  cost: Maybe<number>;
}

export const ActiveObject =
  fromDefault<ActiveObject> ({
    cost: Nothing,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,
  })

export const ActiveObjectL = makeLenses_ (ActiveObject)
