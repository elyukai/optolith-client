import { pipe } from 'ramda';
import { getBlessedTradition, getMagicalTraditions } from './activatable/traditionUtils';
import { ActivatableDependent, ActivatableDependentG } from './activeEntries/ActivatableDependent';
import * as IDUtils from './IDUtils';
import { match } from './match';
import { cnst } from './structures/Function';
import { elem_, fromElements } from './structures/List';
import { bind_, Just, listToMaybe, Maybe, Nothing } from './structures/Maybe';
import { OrderedMap } from './structures/OrderedMap';
import { Record } from './structures/Record';

const { id } = ActivatableDependentG

const getAttributeIdByMagicalNumericId =
  bind_ (
    (numericId: number) => match<number, Maybe<string>> (numericId)
      .on (elem_ (fromElements (1, 4, 10)), cnst (Just ('ATTR_2')))
      .on (3, cnst (Just ('ATTR_3')))
      .on (elem_ (fromElements (2, 5, 6, 7)), cnst (Just ('ATTR_4')))
      .otherwise (cnst (Nothing))
  )

const getAttributeIdByBlessedNumericId =
  bind_ (
    (numericId: number) => match<number, Maybe<string>> (numericId)
      .on (elem_ (fromElements (2, 3, 9, 13, 16, 18)), cnst (Just ('ATTR_1')))
      .on (elem_ (fromElements (1, 4, 8, 17)), cnst (Just ('ATTR_2')))
      .on (elem_ (fromElements (5, 6, 11, 14)), cnst (Just ('ATTR_3')))
      .on (elem_ (fromElements (7, 10, 12, 15)), cnst (Just ('ATTR_4')))
      .otherwise (cnst (Nothing))
  )

/**
 * Returns the primaty attribute id based on given type.
 * @param state Special abilities
 * @param type 1 = magical, 2 = blessed
 */
export const getPrimaryAttributeId =
  (state: OrderedMap<string, Record<ActivatableDependent>>) => (type: 1 | 2): Maybe<string> =>
    match<(1 | 2), Maybe<string>> (type)
      .on (
        1,
        () => bind_ (pipe (
                      id,
                      IDUtils.getNumericMagicalTraditionIdByInstanceId,
                      getAttributeIdByMagicalNumericId
                    ))
                    (listToMaybe (getMagicalTraditions (state)))
      )
      .on (
        2,
        () => bind_ (pipe (
                      id,
                      IDUtils.getNumericBlessedTraditionIdByInstanceId,
                      getAttributeIdByBlessedNumericId
                    ))
                    (getBlessedTradition (state))
      )
      .otherwise (cnst (Nothing))
