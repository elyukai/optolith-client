import { SelectionObject } from '../../../types/wiki';
import { Nothing } from '../../structures/Maybe';
import { fromDefault, makeGetters } from '../../structures/Record';
import { PartialMaybeFunction } from './typeHelpers';

const SelectOptionCreator =
  fromDefault<SelectionObject> ({
    id: 0,
    name: '',
    cost: Nothing,
    // req: Nothing,
    prerequisites: Nothing,
    target: Nothing,
    tier: Nothing,
    spec: Nothing,
    specInput: Nothing,
    applications: Nothing,
    applicationsInput: Nothing,
    talent: Nothing,
    gr: Nothing,
  })

export const SelectOptionG = makeGetters (SelectOptionCreator)

export const createSelectOption: PartialMaybeFunction<SelectionObject> = SelectOptionCreator
