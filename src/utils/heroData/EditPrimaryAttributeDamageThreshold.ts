import { List } from '../structures/List';
import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';

export interface EditPrimaryAttributeDamageThreshold {
  primary: Maybe<string>
  threshold: string | List<string>
}

export const EditPrimaryAttributeDamageThreshold =
  fromDefault<EditPrimaryAttributeDamageThreshold> ({
    primary: Nothing,
    threshold: List.empty,
  })

export const EditPrimaryAttributeDamageThresholdG =
  makeGetters (EditPrimaryAttributeDamageThreshold)
