import { createSelectorCreator, defaultMemoize } from 'reselect';
import { Maybe } from './dataUtils';

export const createMaybeSelector = createSelectorCreator (
  defaultMemoize,
  (currentVal: any, previousVal: any) =>
    currentVal instanceof Maybe
      ? currentVal.UNSAFE_shallowEquals (previousVal)
      : currentVal === previousVal
);
