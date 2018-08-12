import { createSelector } from 'reselect';
import { getPets } from './stateSelectors';

export const getPet = createSelector(
  getPets,
  maybePets => maybePets.bind(pets => pets.elems().head())
);

export const getAllPets = createSelector(
  getPets,
  maybePets => maybePets.fmap(pets => pets.elems())
);
