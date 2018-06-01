import R from 'ramda';
import { ActivatableDependent } from '../types/data.d';
import * as IDUtils from './IDUtils';
import { match } from './match';
import { getBlessedTradition, getMagicalTraditions } from './traditionUtils';

const getAttributeIdByMagicalNumericId = (id: number): string | undefined => {
  return match<number, string | undefined>(id)
    .on([1, 4, 10].includes, () => 'ATTR_2')
    .on(3, () => 'ATTR_3')
    .on([2, 5, 6, 7].includes, () => 'ATTR_4')
    .otherwise(() => undefined);
};

const getAttributeIdByBlessedNumericId = (id: number): string | undefined => {
  return match<number, string | undefined>(id)
    .on([2, 3, 9, 13, 16, 18].includes, () => 'ATTR_1')
    .on([1, 4, 8, 17].includes, () => 'ATTR_2')
    .on([5, 6, 11, 14].includes, () => 'ATTR_3')
    .on([7, 10, 12, 15].includes, () => 'ATTR_4')
    .otherwise(() => undefined);
};

/**
 * Returns the primaty attribute id based on given type.
 * @param state Special abilities
 * @param type 1 = magical, 2 = blessed
 */
export const getPrimaryAttributeId = (
  state: ReadonlyMap<string, ActivatableDependent>,
  type: 1 | 2,
): string | undefined => {
  return match<(1 | 2), string | undefined>(type)
    .on(1, () => {
      const traditions = getMagicalTraditions(state);
      if (traditions.length > 0) {
        return R.pipe(
          IDUtils.getNumericMagicalTraditionIdByInstanceId,
          getAttributeIdByMagicalNumericId,
        )(traditions[0].id);
      }
      return;
    })
    .on(2, () => {
      const tradition = getBlessedTradition(state);
      if (tradition) {
        return R.pipe(
          IDUtils.getNumericBlessedTraditionIdByInstanceId,
          getAttributeIdByBlessedNumericId,
        )(tradition.id);
      }
      return;
    })
    .otherwise(() => undefined);
};
