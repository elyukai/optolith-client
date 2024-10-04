import { Translate } from "../../../utils/translate.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { ResponsiveTextSize } from "../responsiveText.ts"
import { Entity } from "./entity.ts"
import { ModifiableParameter } from "./modifiableParameter.ts"

/**
 * Returns the suffix for the text of a non-modifiable parameter that indicates
 * that the parameter cannot be modified.
 */
export const getTextForNonModifiableSuffix = (
  translate: Translate,
  entity: Entity,
  param: ModifiableParameter,
  responsiveText: ResponsiveTextSize,
): string => {
  if (responsiveText === ResponsiveTextSize.Compressed) {
    switch (entity) {
      case Entity.Spell:
      case Entity.Ritual:
      case Entity.LiturgicalChant:
      case Entity.Ceremony:
        return translate(" (cannot modify)")
      case Entity.Cantrip:
      case Entity.Blessing:
        return ""
      default:
        return assertExhaustive(entity)
    }
  }

  switch (entity) {
    case Entity.Spell:
      switch (param) {
        case ModifiableParameter.CastingTime:
          return translate(" (you cannot use a modification on this spell’s casting time)")
        case ModifiableParameter.Cost:
          return translate(" (you cannot use a modification on this spell’s cost)")
        case ModifiableParameter.Range:
          return translate(" (you cannot use a modification on this spell’s range)")
        default:
          return assertExhaustive(param)
      }
    case Entity.Ritual:
      switch (param) {
        case ModifiableParameter.CastingTime:
          return translate(" (you cannot use a modification on this ritual’s ritual time)")
        case ModifiableParameter.Cost:
          return translate(" (you cannot use a modification on this ritual’s cost)")
        case ModifiableParameter.Range:
          return translate(" (you cannot use a modification on this ritual’s range)")
        default:
          return assertExhaustive(param)
      }
    case Entity.LiturgicalChant:
      switch (param) {
        case ModifiableParameter.CastingTime:
          return translate(" (you cannot use a modification on this chant’s liturgical time)")
        case ModifiableParameter.Cost:
          return translate(" (you cannot use a modification on this chant’s cost)")
        case ModifiableParameter.Range:
          return translate(" (you cannot use a modification on this chant’s range)")
        default:
          return assertExhaustive(param)
      }
    case Entity.Ceremony:
      switch (param) {
        case ModifiableParameter.CastingTime:
          return translate(" (you cannot use a modification on this ceremony’s ceremonial time)")
        case ModifiableParameter.Cost:
          return translate(" (you cannot use a modification on this ceremony’s cost)")
        case ModifiableParameter.Range:
          return translate(" (you cannot use a modification on this ceremony’s range)")
        default:
          return assertExhaustive(param)
      }
    case Entity.Cantrip:
    case Entity.Blessing:
      return ""
    default:
      return assertExhaustive(entity)
  }
}
