import { List } from "../../../../Data/List";
import { Maybe, Nothing } from "../../../../Data/Maybe";
import { fromDefault } from "../../../../Data/Record";

export interface PrimaryAttributeDamageThreshold {
  primary: Maybe<string>
  threshold: number | List<number>
}

export const PrimaryAttributeDamageThreshold =
  fromDefault<PrimaryAttributeDamageThreshold> ({
    primary: Nothing,
    threshold: List.empty,
  })
