import { List } from "../structures/List";
import { Maybe, Nothing } from "../structures/Maybe";
import { fromDefault } from "../structures/Record";

export interface EditPrimaryAttributeDamageThreshold {
  primary: Maybe<string>
  threshold: string | List<string>
}

export const EditPrimaryAttributeDamageThreshold =
  fromDefault<EditPrimaryAttributeDamageThreshold> ({
    primary: Nothing,
    threshold: List.empty,
  })
