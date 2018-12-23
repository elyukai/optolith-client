import { PrimaryAttributeDamageThreshold } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';

export const PrimaryAttributeDamageThresholdCreator =
  fromDefault<PrimaryAttributeDamageThreshold> ({
    primary: Nothing,
    threshold: List.empty,
  })

export const PrimaryAttributeDamageThresholdG = makeGetters (PrimaryAttributeDamageThresholdCreator)
