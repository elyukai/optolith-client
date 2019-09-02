import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";

export interface DependencyObject {
  "@@name": "DependencyObject"
  origin: Maybe<string>;
  active: Maybe<boolean>;
  sid: Maybe<string | number | List<number>>;
  sid2: Maybe<string | number>;
  tier: Maybe<number>;
}

export const DependencyObject =
  fromDefault ("DependencyObject")
              <DependencyObject> ({
                origin: Nothing,
                active: Nothing,
                sid: Nothing,
                sid2: Nothing,
                tier: Nothing,
              })
