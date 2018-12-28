import { List } from '../structures/List';
import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';

export interface DependencyObject {
  origin: Maybe<string>;
  active: Maybe<boolean>;
  sid: Maybe<string | number | List<number>>;
  sid2: Maybe<string | number>;
  tier: Maybe<number>;
}

export const DependencyObject =
  fromDefault<DependencyObject> ({
    origin: Nothing,
    active: Nothing,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,
  })

export const DependencyObjectG = makeGetters (DependencyObject)
