import { ActivatableDependent } from '../types/data.d';
import * as IDUtils from './IDUtils';
import { match } from './match';
import { pipe } from './pipe';
import { getBlessedTradition, getMagicalTraditions } from './traditionUtils';

const getAttributeIdByMagicalNumericId = (id: number): string | undefined => {
  return match<number, string | undefined>(id)
    .on(x => [1, 4, 10].includes(x), () => 'ATTR_2')
    .on(3, () => 'ATTR_3')
    .on(x => [2, 5, 6, 7].includes(x), () => 'ATTR_4')
    .otherwise(() => undefined);
};

const getAttributeIdByBlessedNumericId = (id: number): string | undefined => {
  return match<number, string | undefined>(id)
    .on(x => [2, 3, 9, 13, 16, 18].includes(x), () => 'ATTR_1')
    .on(x => [1, 4, 8, 17].includes(x), () => 'ATTR_2')
    .on(x => [5, 6, 11, 14].includes(x), () => 'ATTR_3')
    .on(x => [7, 10, 12, 15].includes(x), () => 'ATTR_4')
    .otherwise(() => undefined);
};

/**
 *
 * @param state Special abilities
 * @param type
 */
export function getPrimaryAttributeId(
  state: Map<string, ActivatableDependent>,
  type: 1 | 2,
): string | undefined {
  return match<(1 | 2), string | undefined>(type)
    .on(1, () => {
      const traditions = getMagicalTraditions(state);
      if (traditions.length > 0) {
        return pipe(
          IDUtils.getNumericMagicalTraditionIdByInstanceId,
          getAttributeIdByMagicalNumericId,
        )(traditions[0].id);
      }
      return;
    })
    .on(2, () => {
      const tradition = getBlessedTradition(state);
      if (tradition) {
        return pipe(
          IDUtils.getNumericBlessedTraditionIdByInstanceId,
          getAttributeIdByBlessedNumericId,
        )(tradition.id);
      }
      return;
    })
    .otherwise(() => undefined);
}
