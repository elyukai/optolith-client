import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromDefault } from "../../../../Data/Record"
import { Pair } from "../../../../Data/Tuple"

export interface PrimaryAttributeDamageThreshold {
  "@@name": "PrimaryAttributeDamageThreshold"
  primary: Maybe<string | Pair<string, string>>
  threshold: number | Pair<number, number>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PrimaryAttributeDamageThreshold =
  fromDefault ("PrimaryAttributeDamageThreshold")
              <PrimaryAttributeDamageThreshold> ({
                primary: Nothing,
                threshold: 0,
              })
