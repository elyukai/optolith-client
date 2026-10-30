import { createSelector } from "@reduxjs/toolkit"
import { getCarryingCapacity } from "../../shared/domain/equipment.ts"
import { AdvantageIdentifier, AttributeIdentifier } from "../../shared/domain/identifier.ts"
import { getAttributeValue, type DisplayedAttribute } from "../../shared/domain/rated/attribute.ts"
import { getAttributeMinimaByAssociatedAttributes } from "../../shared/domain/rated/attributeBounds.ts"
import { isNotNullish } from "../../shared/utils/nullable.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import {
  selectAttributeAdjustmentId,
  selectDynamicAdvantages,
  selectDynamicAttributes,
} from "../slices/characterSlice.ts"
import { SelectAll, SelectGetById } from "./basicCapabilitySelectors.ts"
import { selectCurrentRace } from "./raceSelectors.ts"

const selectAttributeMinimaByAssociatedAttributes = createSelector(
  SelectGetById.Static.Skill,
  SelectGetById.Static.CloseCombatTechnique,
  SelectGetById.Static.RangedCombatTechnique,
  SelectGetById.Static.Spell,
  SelectGetById.Static.Ritual,
  SelectGetById.Static.LiturgicalChant,
  SelectGetById.Static.Ceremony,
  SelectGetById.Static.Curse,
  SelectGetById.Static.ElvenMagicalSong,
  SelectGetById.Static.DominationRitual,
  SelectGetById.Static.MagicalDance,
  SelectGetById.Static.MagicalMelody,
  SelectGetById.Static.JesterTrick,
  SelectGetById.Static.AnimistPower,
  SelectGetById.Static.GeodeRitual,
  SelectGetById.Static.ZibiljaRitual,
  SelectGetById.Dynamic.Attribute,
  SelectAll.Dynamic.Skills,
  SelectAll.Dynamic.CloseCombatTechniques,
  SelectAll.Dynamic.RangedCombatTechniques,
  SelectAll.Dynamic.Spells,
  SelectAll.Dynamic.Rituals,
  SelectAll.Dynamic.LiturgicalChants,
  SelectAll.Dynamic.Ceremonies,
  SelectAll.Dynamic.Curses,
  SelectAll.Dynamic.ElvenMagicalSongs,
  SelectAll.Dynamic.DominationRituals,
  SelectAll.Dynamic.MagicalDances,
  SelectAll.Dynamic.MagicalMelodies,
  SelectAll.Dynamic.JesterTricks,
  SelectAll.Dynamic.AnimistPowers,
  SelectAll.Dynamic.GeodeRituals,
  SelectAll.Dynamic.ZibiljaRituals,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalCombatTechnique),
  getAttributeMinimaByAssociatedAttributes,
)

/**
 * Returns the carrying capacity of the character.
 */
export const selectCarryingCapacity = createSelector(
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Strength),
  (strength): number => getCarryingCapacity(getAttributeValue(strength)),
)

/**
 * An adjustment value for an attribute that can be applied to one of the
 * provided attributes.
 */
export type DisplayedAttributeAdjustment = {
  value: number
  list: DisplayedAttribute[]
}

/**
 * Returns an attribute adjustment option, if any is available.
 */
export const selectAvailableAdjustments = createSelector(
  selectCurrentRace,
  selectAttributeAdjustmentId,
  (race, currentId, attributes): DisplayedAttributeAdjustment | undefined => {
    const selectableAdjustment = race?.attribute_adjustments?.selectable?.[0]

    if (selectableAdjustment === undefined) {
      return undefined
    } else {
      const current = attributes.find(attr => attr.static.id === currentId)

      const canNotSwitch =
        current !== undefined &&
        current.maximum !== undefined &&
        current.maximum - selectableAdjustment.value < getAttributeValue(current.dynamic)

      if (canNotSwitch) {
        return {
          value: selectableAdjustment.value,
          list: [current],
        }
      } else {
        return {
          value: selectableAdjustment.value,
          list: selectableAdjustment.list
            .map(id => attributes.find(attr => attr.static.id === id.id.attribute))
            .filter(isNotNullish),
        }
      }
    }
  },
)
