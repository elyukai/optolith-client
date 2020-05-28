import { fmapF, fromMaybe, Maybe } from "../../../Data/Maybe"
import { ValueBasedDependent } from "../../Models/Hero/heroTypeHelpers"
import { IncreasableEntry } from "../../Models/Wiki/wikiTypeHelpers"
import { getMissingAP } from "../AdventurePoints/adventurePointsUtils"
import * as IC from "../IC.gen"

export const addPoint =
  <T extends ValueBasedDependent>(instance: T): T => ({
      ...instance,
      value: {
        ...instance.value,
        value: instance.value.value + 1,
      },
    })

export const removePoint =
  <T extends ValueBasedDependent>(instance: T): T => ({
      ...instance,
      value: {
        ...instance.value,
        value: instance.value.value - 1,
      },
    })

export const getBaseValueByCategory =
  (current_category: IncreasableEntry) => {
    switch (current_category.tag) {
      case "Attribute":
        return 8

      case "CombatTechnique":
        return 6

      default:
        return 0
    }
  }


const getValueFromHeroStateEntry =
  (wikiEntry: IncreasableEntry) =>
  (maybeEntry: Maybe<ValueBasedDependent>) =>
    fromMaybe (getBaseValueByCategory (wikiEntry))
              (fmapF (maybeEntry) (entry => entry.value.value))

const getIcForIncreasable = (wikiEntry: IncreasableEntry): IC.t => {
  switch (wikiEntry.tag) {
    case "Attribute":
      return "E"

    default:
      return wikiEntry.value.ic
  }
}

export const getAreSufficientAPAvailableForIncrease =
  (negativeApValid: boolean) =>
  <T extends ValueBasedDependent>
  (instance: Maybe<T>) =>
  (wikiEntry: IncreasableEntry) => {
    const ic = getIcForIncreasable (wikiEntry)

    return getMissingAP (negativeApValid)
                        (IC.getAPForInc (ic, getValueFromHeroStateEntry (wikiEntry) (instance)))
  }
