import * as R from 'ramda';
import { createMaybeSelector } from '../App/Utils/createMaybeSelector';
import { Maybe, OrderedMap } from '../utils/dataUtils';
import { getPets } from './stateSelectors';

export const getPet = createMaybeSelector (
  getPets,
  R.pipe (
    Maybe.fmap (OrderedMap.elems),
    Maybe.bind_ (Maybe.listToMaybe)
  )
);

export const getAllPets = createMaybeSelector (
  getPets,
  maybePets => maybePets.fmap (pets => pets.elems ())
);
