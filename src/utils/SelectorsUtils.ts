import { AppState } from '../reducers/appReducer';
import { Maybe, OrderedMap } from './dataUtils';

export const mapGetToMaybeSlice = <T>(
  sliceSelector: (state: AppState) => Maybe<OrderedMap<string, T>>,
  id: string
) => (state: AppState) => sliceSelector (state).bind (slice => slice.lookup (id));

export const mapGetToSlice = <T>(sliceSelector: (state: AppState) => OrderedMap<string, T>) =>
  (state: AppState) =>
    (id: string) => sliceSelector (state) .lookup (id);

export const mapSliceToGet = <T>(
  sliceSelector: (state: AppState) => Maybe<OrderedMap<string, T>>
) => (state: AppState) => (id: string) => sliceSelector (state).bind (slice => slice.lookup (id));
