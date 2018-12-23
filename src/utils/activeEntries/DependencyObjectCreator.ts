import { DependencyObject } from '../../types/data';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';

export const DependencyObjectCreator =
  fromDefault<DependencyObject> ({
    origin: Nothing,
    active: Nothing,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,
  })

export const DependencyObjectG = makeGetters (DependencyObjectCreator)
