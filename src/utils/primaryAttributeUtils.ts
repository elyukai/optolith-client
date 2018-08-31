import R from 'ramda';
import { ActivatableDependent } from '../types/data';
import { Maybe, OrderedMap, Record } from './dataUtils';
import * as IDUtils from './IDUtils';
import { match } from './match';
import { getBlessedTradition, getMagicalTraditions } from './traditionUtils';

const getAttributeIdByMagicalNumericId = (id: Maybe<number>): Maybe<string> =>
  id.bind (justId =>
    match<number, Maybe<string>> (justId)
      .on ([1, 4, 10].includes, () => Maybe.pure ('ATTR_2'))
      .on (3, () => Maybe.pure ('ATTR_3'))
      .on ([2, 5, 6, 7].includes, () => Maybe.pure ('ATTR_4'))
      .otherwise (Maybe.empty)
  );

const getAttributeIdByBlessedNumericId = (id: Maybe<number>): Maybe<string> =>
  id.bind (justId =>
    match<number, Maybe<string>> (justId)
      .on ([2, 3, 9, 13, 16, 18].includes, () => Maybe.pure ('ATTR_1'))
      .on ([1, 4, 8, 17].includes, () => Maybe.pure ('ATTR_2'))
      .on ([5, 6, 11, 14].includes, () => Maybe.pure ('ATTR_3'))
      .on ([7, 10, 12, 15].includes, () => Maybe.pure ('ATTR_4'))
      .otherwise (Maybe.empty)
  );

/**
 * Returns the primaty attribute id based on given type.
 * @param state Special abilities
 * @param type 1 = magical, 2 = blessed
 */
export const getPrimaryAttributeId = (
  state: OrderedMap<string, Record<ActivatableDependent>>,
  type: 1 | 2,
): Maybe<string> =>
  match<(1 | 2), Maybe<string>> (type)
    .on (1, () => Maybe.listToMaybe (getMagicalTraditions (state))
      .bind (e => e.lookup ('id').bind (R.pipe (
        IDUtils.getNumericMagicalTraditionIdByInstanceId,
        getAttributeIdByMagicalNumericId,
      )))
    )
    .on (2, () => getBlessedTradition (state)
      .bind (e => e.lookup ('id').bind (R.pipe (
        IDUtils.getNumericBlessedTraditionIdByInstanceId,
        getAttributeIdByBlessedNumericId,
      )))
    )
    .otherwise (Maybe.empty);
