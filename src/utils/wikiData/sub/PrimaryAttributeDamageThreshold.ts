import { List } from '../../structures/List';
import { Maybe, Nothing } from '../../structures/Maybe';
import { fromDefault, makeGetters } from '../../structures/Record';

export interface PrimaryAttributeDamageThreshold {
  primary: Maybe<string>
  threshold: number | List<number>
}

export const PrimaryAttributeDamageThreshold =
  fromDefault<PrimaryAttributeDamageThreshold> ({
    primary: Nothing,
    threshold: List.empty,
  })

export const PrimaryAttributeDamageThresholdG = makeGetters (PrimaryAttributeDamageThreshold)
