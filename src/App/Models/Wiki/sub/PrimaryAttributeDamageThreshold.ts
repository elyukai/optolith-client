import { Maybe, Nothing } from "../../../../Data/Maybe";
import { fromDefault } from "../../../../Data/Record";
import { Pair } from "../../../../Data/Tuple";

export interface PrimaryAttributeDamageThreshold {
  "@@name": "PrimaryAttributeDamageThreshold"
  primary: Maybe<string>
  threshold: number | Pair<number, number>
}

export const PrimaryAttributeDamageThreshold =
  fromDefault ("PrimaryAttributeDamageThreshold")
              <PrimaryAttributeDamageThreshold> ({
                primary: Nothing,
                threshold: 0,
              })
