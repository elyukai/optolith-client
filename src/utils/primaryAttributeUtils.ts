import * as R from 'ramda';
import { ActivatableDependent } from '../types/data';
import { getBlessedTradition, getMagicalTraditions } from './activatable/traditionUtils';
import { Just, List, Maybe, Nothing, OrderedMap, Record } from './dataUtils';
import { flip } from './flip';
import * as IDUtils from './IDUtils';
import { match } from './match';

const getAttributeIdByMagicalNumericId = Maybe.bind_ (
  (id: number) => match<number, Maybe<string>> (id)
    .on (
      flip<number, List<number>, boolean> (List.elem) (List.of (1, 4, 10)),
      () => Just ('ATTR_2')
    )
    .on (3, () => Just ('ATTR_3'))
    .on (
      flip<number, List<number>, boolean> (List.elem) (List.of (2, 5, 6, 7)),
      () => Just ('ATTR_4')
    )
    .otherwise (Nothing)
);

const getAttributeIdByBlessedNumericId = Maybe.bind_ (
  (id: number) => match<number, Maybe<string>> (id)
    .on (
      flip<number, List<number>, boolean> (List.elem) (List.of (2, 3, 9, 13, 16, 18)),
      () => Just ('ATTR_1')
    )
    .on (
      flip<number, List<number>, boolean> (List.elem) (List.of (1, 4, 8, 17)),
      () => Just ('ATTR_2')
    )
    .on (
      flip<number, List<number>, boolean> (List.elem) (List.of (5, 6, 11, 14)),
      () => Just ('ATTR_3')
    )
    .on (
      flip<number, List<number>, boolean> (List.elem) (List.of (7, 10, 12, 15)),
      () => Just ('ATTR_4')
    )
    .otherwise (Nothing)
);

/**
 * Returns the primaty attribute id based on given type.
 * @param state Special abilities
 * @param type 1 = magical, 2 = blessed
 */
export const getPrimaryAttributeId = (
  state: OrderedMap<string, Record<ActivatableDependent>>,
  type: 1 | 2
): Maybe<string> =>
  match<(1 | 2), Maybe<string>> (type)
    .on (1, () => Maybe.listToMaybe (getMagicalTraditions (state))
      .bind (e => e.lookup ('id').bind (R.pipe (
        IDUtils.getNumericMagicalTraditionIdByInstanceId,
        getAttributeIdByMagicalNumericId
      )))
    )
    .on (2, () => getBlessedTradition (state)
      .bind (e => e.lookup ('id').bind (R.pipe (
        IDUtils.getNumericBlessedTraditionIdByInstanceId,
        getAttributeIdByBlessedNumericId
      )))
    )
    .otherwise (Nothing);
