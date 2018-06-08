import R from 'ramda';
import { ActivatableDependent } from '../types/data.d';
import { Maybe, ReadMap } from './dataUtils';
import * as IDUtils from './IDUtils';
import { match } from './match';
import { getBlessedTradition, getMagicalTraditions } from './traditionUtils';

const getAttributeIdByMagicalNumericId = (id: Maybe<number>): Maybe<string> => {
  return id.bind(id =>
    match<number, Maybe<string>>(id)
      .on([1, 4, 10].includes, () => Maybe.Just('ATTR_2'))
      .on(3, () => Maybe.Just('ATTR_3'))
      .on([2, 5, 6, 7].includes, () => Maybe.Just('ATTR_4'))
      .otherwise(Maybe.Nothing)
  );
};

const getAttributeIdByBlessedNumericId = (id: Maybe<number>): Maybe<string> => {
  return id.bind(id =>
    match<number, Maybe<string>>(id)
      .on([2, 3, 9, 13, 16, 18].includes, () => Maybe.Just('ATTR_1'))
      .on([1, 4, 8, 17].includes, () => Maybe.Just('ATTR_2'))
      .on([5, 6, 11, 14].includes, () => Maybe.Just('ATTR_3'))
      .on([7, 10, 12, 15].includes, () => Maybe.Just('ATTR_4'))
      .otherwise(Maybe.Nothing)
  );
};

/**
 * Returns the primaty attribute id based on given type.
 * @param state Special abilities
 * @param type 1 = magical, 2 = blessed
 */
export const getPrimaryAttributeId = (
  state: ReadMap<string, ActivatableDependent>,
  type: 1 | 2,
): Maybe<string> => {
  return match<(1 | 2), Maybe<string>>(type)
    .on(1, () => Maybe.listToMaybe(getMagicalTraditions(state))
      .bind(R.pipe(
        e => e.id,
        IDUtils.getNumericMagicalTraditionIdByInstanceId,
        getAttributeIdByMagicalNumericId,
      ))
    )
    .on(2, () => getBlessedTradition(state)
      .bind(R.pipe(
        e => e.id,
        IDUtils.getNumericBlessedTraditionIdByInstanceId,
        getAttributeIdByBlessedNumericId,
      ))
    )
    .otherwise(Maybe.Nothing);
};
