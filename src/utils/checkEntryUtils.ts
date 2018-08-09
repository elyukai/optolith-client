import * as Data from '../types/data';
import { Just, Maybe, Record } from './dataUtils';

type JR<T> = Just<Record<T>>;

type OrMaybe<T> = Maybe<T> | T;

export const isActivatableDependent =
  (entry: Maybe<Data.Dependent>): entry is JR<Data.ActivatableDependent> =>
    Maybe.isJust(entry) &&
    Maybe.fromJust(entry).member('active') &&
    !Maybe.fromJust(entry).member('value');

export const isActivatableSkillDependent =
  (entry: Maybe<Data.Dependent>): entry is JR<Data.ActivatableSkillDependent> =>
    Maybe.isJust(entry) &&
    Maybe.fromJust(entry).member('value') &&
    Maybe.fromJust(entry).member('active');

export const isDependentSkill =
  (entry: OrMaybe<Data.Dependent>): entry is JR<Data.SkillDependent> =>
  entry instanceof Maybe ? (
    Maybe.isJust(entry) &&
    Maybe.fromJust(entry).member('value') &&
    !Maybe.fromJust(entry).member('mod') &&
    !Maybe.fromJust(entry).member('active')
  ) : (
    entry.member('value') &&
    !entry.member('mod') &&
    !entry.member('active')
  );

export const isDependentSkillExtended =
  (entry: Data.Dependent): entry is Data.ExtendedSkillDependent =>
    entry.member('value') &&
    !entry.member('mod');
