import { pipe } from "ramda";
import { ActivatableDependent } from "../App/Models/ActiveEntries/ActivatableDependent";
import { cnst } from "../Data/Function";
import { elem_, fromElements } from "../Data/List";
import { bindF, Just, listToMaybe, Maybe, Nothing } from "../Data/Maybe";
import { OrderedMap } from "../Data/OrderedMap";
import { Record } from "../Data/Record";
import { getBlessedTradition, getMagicalTraditions } from "./activatable/traditionUtils";
import * as IDUtils from "./IDUtils";
import { match } from "./match";

const { id } = ActivatableDependent.A

const getAttributeIdByMagicalNumericId =
  bindF (
    (numericId: number) => match<number, Maybe<string>> (numericId)
      .on (elem_ (fromElements (1, 4, 10)), cnst (Just ("ATTR_2")))
      .on (3, cnst (Just ("ATTR_3")))
      .on (elem_ (fromElements (2, 5, 6, 7)), cnst (Just ("ATTR_4")))
      .otherwise (cnst (Nothing))
  )

const getAttributeIdByBlessedNumericId =
  bindF (
    (numericId: number) => match<number, Maybe<string>> (numericId)
      .on (elem_ (fromElements (2, 3, 9, 13, 16, 18)), cnst (Just ("ATTR_1")))
      .on (elem_ (fromElements (1, 4, 8, 17)), cnst (Just ("ATTR_2")))
      .on (elem_ (fromElements (5, 6, 11, 14)), cnst (Just ("ATTR_3")))
      .on (elem_ (fromElements (7, 10, 12, 15)), cnst (Just ("ATTR_4")))
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
        () => bindF (pipe (
                      id,
                      IDUtils.getNumericMagicalTraditionIdByInstanceId,
                      getAttributeIdByMagicalNumericId
                    ))
                    (listToMaybe (getMagicalTraditions (state)))
      )
      .on (
        2,
        () => bindF (pipe (
                      id,
                      IDUtils.getNumericBlessedTraditionIdByInstanceId,
                      getAttributeIdByBlessedNumericId
                    ))
                    (getBlessedTradition (state))
      )
      .otherwise (cnst (Nothing))
