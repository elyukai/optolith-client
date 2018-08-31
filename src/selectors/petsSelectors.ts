import R from 'ramda';
import { createSelector } from 'reselect';
import { Maybe, OrderedMap } from '../utils/dataUtils';
import { getPets } from './stateSelectors';

export const getPet = createSelector (
  getPets,
  R.pipe (
    Maybe.fmap (OrderedMap.elems),
    Maybe.bind_ (Maybe.listToMaybe)
  )
);

export const getAllPets = createSelector (
  getPets,
  maybePets => maybePets.fmap (pets => pets.elems ())
);
