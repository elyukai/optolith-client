/**
 * This file provides several helper functions for working with `Activatable`s.
 *
 * @file src/Utilities/activatableConvertUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { fmap } from "../../../Data/Functor"
import { append, elemF, empty, imap, List } from "../../../Data/List"
import { alt, guard, isJust, Nothing, or, then } from "../../../Data/Maybe"
import { foldr } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../../Constants/Ids"
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject"
import { toActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId"
import { pipe, pipe_ } from "../pipe"

const ADA = ActivatableDependent.A
const AAOA = ActivatableActivationOptions.A

/**
 * Converts the object generated by the list item to an object that can be
 * inserted into an array of ActiveObjects.
 * @param obj The entry for which you want to convert the object.
 * @param activate The object generated by the list item.
 */
export const convertUIStateToActiveObject =
  (activate: Record<ActivatableActivationOptions>): Record<ActiveObject> => {
    const id = AAOA.id (activate)
    const selectOptionId1 = AAOA.selectOptionId1 (activate)
    const selectOptionId2 = AAOA.selectOptionId2 (activate)
    const selectOptionId3 = AAOA.selectOptionId3 (activate)
    const input = AAOA.input (activate)
    const level = AAOA.level (activate)
    const customCost = AAOA.customCost (activate)

    return id === AdvantageId.HatredOf
      ? ActiveObject ({
          sid: selectOptionId1,
          sid2: input,
          cost: customCost,
        })
      : id === DisadvantageId.PersonalityFlaw
      ? ActiveObject ({
          sid: selectOptionId1,
          sid2: or (fmap (elemF (List<number | string> (7, 8)))
                         (selectOptionId1))
            ? input
            : Nothing,
          cost: customCost,
        })
      : id === SpecialAbilityId.SkillSpecialization
      ? ActiveObject ({
          sid: selectOptionId1,
          sid2: alt<number | string> (input)
                                     (selectOptionId2),
          cost: customCost,
        })
      : isJust (input) && isJust (selectOptionId1)
      ? ActiveObject ({
          sid: selectOptionId1,
          sid2: input,
          sid3: selectOptionId2,
          tier: level,
          cost: customCost,
        })
      : ActiveObject ({
          sid: alt<number | string> (input)
                                    (selectOptionId1),
          sid2: then (guard (isJust (input) || isJust (selectOptionId1)))
                     (selectOptionId2),
          sid3: selectOptionId3,
          tier: level,
          cost: customCost,
        })
  }

/**
 * Generates a list of ActiveObjects based on the given instance.
 */
export const convertActivatableToArray =
  (x: Record<ActivatableDependent>) =>
    pipe_ (
            x,
            ADA.active,
            imap (index => toActiveObjectWithId (index) (ADA.id (x)))
          )

/**
 * Get all active items in an array.
 * @param state A state slice.
 */
export const getActiveFromState =
  foldr (pipe (convertActivatableToArray, append)) (empty)

export interface ActiveObjectAny extends ActiveObject {
  [key: string]: any
}
