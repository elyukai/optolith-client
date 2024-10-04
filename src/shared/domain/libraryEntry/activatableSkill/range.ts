import { Range, RangeUnit } from "optolith-database-schema/types/_ActivatableSkillRange"
import { BlessingRange } from "optolith-database-schema/types/Blessing"
import { CantripRange } from "optolith-database-schema/types/Cantrip"
import { Translate, TranslateMap } from "../../../utils/translate.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { GetById } from "../../getTypes.ts"
import {
  getResponsiveText,
  getResponsiveTextOptional,
  responsive,
  ResponsiveTextSize,
} from "../responsiveText.ts"
import { MISSING_VALUE } from "../unknown.ts"
import { getTextForCheckResultBased } from "./checkResultBased.ts"
import { Entity } from "./entity.ts"
import { getTextForIsMaximum } from "./isMaximum.ts"
import { ModifiableParameter } from "./modifiableParameter.ts"
import { getTextForNonModifiableSuffix } from "./nonModifiable.ts"
import { Speed } from "./speed.ts"

const toRangeUnit = (
  unit: RangeUnit,
  value: number | string,
  translate: Translate,
  responsiveText: ResponsiveTextSize,
) => {
  switch (unit) {
    case "Steps":
      return responsive(
        responsiveText,
        () => translate("{0} yards", value),
        () => translate("{0} yd", value),
      )
    case "Miles":
      return responsive(
        responsiveText,
        () => translate("{0} miles", value),
        () => translate("{0} mi.", value),
      )
    default:
      return assertExhaustive(unit)
  }
}

/**
 * Returns the text for the range of an activatable skill.
 */
export const getTextForActivatableSkillRange = (
  deps: {
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    translate: Translate
    translateMap: TranslateMap
  },
  value: Range,
  env: {
    speed: Speed
    responsiveText: ResponsiveTextSize
    entity: Entity
  },
): string => {
  const translation = deps.translateMap(value.translations)

  if (value.translations !== undefined && translation === undefined) {
    return MISSING_VALUE
  }

  const rangeValue = (() => {
    switch (value.value.tag) {
      case "Modifiable": {
        const modificationLevel = deps.getSkillModificationLevelById(
          value.value.modifiable.initial_modification_level,
        )

        if (modificationLevel === undefined) {
          return MISSING_VALUE
        }

        const range = (() => {
          switch (env.speed) {
            case Speed.Fast:
              return modificationLevel.fast.range
            case Speed.Slow:
              return modificationLevel.slow.range
            default:
              return assertExhaustive(env.speed)
          }
        })()

        if (range === 1) {
          return deps.translate("Touch")
        }

        return toRangeUnit("Steps", range, deps.translate, env.responsiveText)
      }
      case "Sight":
        return deps.translate("Sight")
      case "Self":
        return deps.translate("Self")
      case "Global":
        return deps.translate("Global")
      case "Touch":
        return (
          deps.translate("Touch") +
          getTextForNonModifiableSuffix(
            deps.translate,
            env.entity,
            ModifiableParameter.Range,
            env.responsiveText,
          )
        )
      case "Fixed": {
        return (
          toRangeUnit(
            value.value.fixed.unit,
            value.value.fixed.value,
            deps.translate,
            env.responsiveText,
          ) +
          getTextForNonModifiableSuffix(
            deps.translate,
            env.entity,
            ModifiableParameter.Range,
            env.responsiveText,
          )
        )
      }
      case "CheckResultBased": {
        const isMaximum = getTextForIsMaximum(
          value.value.check_result_based.is_maximum,
          deps.translate,
          env.responsiveText,
        )

        const isRadius =
          value.value.check_result_based.is_radius === true ? ` ${deps.translate("Radius")}` : ""

        return (
          isMaximum +
          toRangeUnit(
            value.value.check_result_based.unit,
            getTextForCheckResultBased(value.value.check_result_based, deps.translate),
            deps.translate,
            env.responsiveText,
          ) +
          isRadius +
          getTextForNonModifiableSuffix(
            deps.translate,
            env.entity,
            ModifiableParameter.Range,
            env.responsiveText,
          )
        )
      }
      default:
        return assertExhaustive(value.value)
    }
  })()

  const withReplacement =
    translation?.replacement !== undefined
      ? getResponsiveText(translation.replacement, env.responsiveText).replace("$1", rangeValue)
      : rangeValue

  const withNote = (() => {
    if (translation?.note === undefined) {
      return withReplacement
    }

    const note = getResponsiveTextOptional(translation.note, env.responsiveText)

    if (note === undefined) {
      return withReplacement
    }

    return `${withReplacement} (${note})`
  })()

  return withNote
}

/**
 * Returns the text for the range of a cantrip.
 */
export const getTextForCantripRange = (
  deps: { translate: Translate },
  value: CantripRange,
  env: { responsiveText: ResponsiveTextSize },
): string => {
  switch (value.tag) {
    case "Self":
      return deps.translate("Self")
    case "Touch":
      return deps.translate("Touch")
    case "Fixed": {
      return toRangeUnit(value.fixed.unit, value.fixed.value, deps.translate, env.responsiveText)
    }
    default:
      return assertExhaustive(value)
  }
}

/**
 * Returns the text for the range of a blessing.
 */
export const getTextForBlessingRange = (
  deps: { translate: Translate },
  value: BlessingRange,
  env: { responsiveText: ResponsiveTextSize },
): string => {
  switch (value.tag) {
    case "Self":
      return deps.translate("Self")
    case "Touch":
      return deps.translate("Touch")
    case "Fixed": {
      return toRangeUnit(value.fixed.unit, value.fixed.value, deps.translate, env.responsiveText)
    }
    default:
      return assertExhaustive(value)
  }
}
