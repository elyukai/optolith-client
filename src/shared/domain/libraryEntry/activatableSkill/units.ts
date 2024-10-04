import { Translate } from "../../../utils/translate.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { responsive, ResponsiveTextSize } from "../responsiveText.ts"
import { Entity } from "./entity.ts"

type TimeSpanUnit =
  | "Seconds"
  | "Minutes"
  | "Hours"
  | "Days"
  | "Weeks"
  | "Months"
  | "Years"
  | "Centuries"
  | "Actions"
  | "CombatRounds"
  | "SeductionActions"
  | "Rounds"

/**
 * Returns the text for a time span unit.
 */
export const formatTimeSpan = (
  translate: Translate,
  responsiveTextSize: ResponsiveTextSize,
  unit: TimeSpanUnit,
  value: number | string,
): string => {
  switch (unit) {
    case "Seconds":
      return responsive(
        responsiveTextSize,
        () => translate("{0} seconds", value),
        () => translate("{0} s", value),
      )
    case "Minutes":
      return responsive(
        responsiveTextSize,
        () => translate("{0} minutes", value),
        () => translate("{0} min", value),
      )
    case "Hours":
      return responsive(
        responsiveTextSize,
        () => translate("{0} hours", value),
        () => translate("{0} h", value),
      )
    case "Days":
      return responsive(
        responsiveTextSize,
        () => translate("{0} days", value),
        () => translate("{0} d", value),
      )
    case "Weeks":
      return responsive(
        responsiveTextSize,
        () => translate("{0} weeks", value),
        () => translate("{0} wks.", value),
      )
    case "Months":
      return responsive(
        responsiveTextSize,
        () => translate("{0} months", value),
        () => translate("{0} mos.", value),
      )
    case "Years":
      return responsive(
        responsiveTextSize,
        () => translate("{0} years", value),
        () => translate("{0} yrs.", value),
      )
    case "Centuries":
      return responsive(
        responsiveTextSize,
        () => translate("{0} centuries", value),
        () => translate("{0} cent.", value),
      )
    case "Actions":
      return responsive(
        responsiveTextSize,
        () => translate("{0} actions", value),
        () => translate("{0} act", value),
      )
    case "CombatRounds":
      return responsive(
        responsiveTextSize,
        () => translate("{0} combat rounds", value),
        () => translate("{0} CR", value),
      )
    case "SeductionActions":
      return responsive(
        responsiveTextSize,
        () => translate("{0} seduction actions", value),
        () => translate("{0} SA", value),
      )
    case "Rounds":
      return responsive(
        responsiveTextSize,
        () => translate("{0} rounds", value),
        () => translate("{0} rnds", value),
      )
    default:
      return assertExhaustive(unit)
  }
}

/**
 * Returns the text for a cost unit that is based on the entity type.
 */
export const formatCost = (translate: Translate, entity: Entity, value: number | string) => {
  switch (entity) {
    case Entity.Cantrip:
    case Entity.Spell:
    case Entity.Ritual:
      return translate("{0} AE", value)
    case Entity.Blessing:
    case Entity.LiturgicalChant:
    case Entity.Ceremony:
      return translate("{0} KP", value)
    default:
      return assertExhaustive(entity)
  }
}
