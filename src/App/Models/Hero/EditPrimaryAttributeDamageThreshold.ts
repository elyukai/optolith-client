import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses } from "../../../Data/Record";
import { Pair } from "../../../Data/Tuple";

export interface EditPrimaryAttributeDamageThreshold {
  "@@name": "EditPrimaryAttributeDamageThreshold"
  primary: Maybe<string>
  threshold: string | Pair<string, string>
}

export const EditPrimaryAttributeDamageThreshold =
  fromDefault ("EditPrimaryAttributeDamageThreshold")
              <EditPrimaryAttributeDamageThreshold> ({
                primary: Nothing,
                threshold: "",
              })

export const EditPrimaryAttributeDamageThresholdL =
  makeLenses (EditPrimaryAttributeDamageThreshold)
