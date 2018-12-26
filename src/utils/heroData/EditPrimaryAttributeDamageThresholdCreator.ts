import { EditPrimaryAttributeDamageThreshold } from '../../types/data';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';

export const EditPrimaryAttributeDamageThresholdCreator =
  fromDefault<EditPrimaryAttributeDamageThreshold> ({
    primary: Nothing,
    threshold: List.empty,
  })

export const EditPrimaryAttributeDamageThresholdG =
  makeGetters (EditPrimaryAttributeDamageThresholdCreator)
