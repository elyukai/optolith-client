import {
  CheckResultBasedDuration,
  DurationForOneTime,
  DurationForSustained,
  FixedDuration,
  Immediate,
  PermanentDuration,
} from "optolith-database-schema/types/_ActivatableSkillDuration"
import { BlessingDuration } from "optolith-database-schema/types/Blessing"
import { CantripDuration } from "optolith-database-schema/types/Cantrip"
import { mapNullableDefault } from "../../../utils/nullable.ts"
import { Translate, TranslateMap } from "../../../utils/translate.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import {
  ResponsiveTextSize,
  getResponsiveText,
  replaceTextIfRequested,
  responsive,
} from "../responsiveText.ts"
import { getTextForCheckResultBased } from "./checkResultBased.ts"
import { getTextForIsMaximum } from "./isMaximum.ts"
import { formatTimeSpan } from "./units.ts"

const getTextForImmediateDuration = (
  deps: {
    translate: Translate
    translateMap: TranslateMap
  },
  value: Immediate,
  env: {
    responsiveText: ResponsiveTextSize
  },
): string => {
  const text =
    deps.translate("Immediate") +
    mapNullableDefault(
      value.maximum,
      max => {
        const maxText = formatTimeSpan(deps.translate, env.responsiveText, max.unit, max.value)

        return responsive(
          env.responsiveText,
          () => deps.translate(" (no more than {0})", maxText),
          () => deps.translate(" (max. {0})", maxText),
        )
      },
      "",
    )

  return replaceTextIfRequested(value.translations, text, deps.translateMap, env.responsiveText)
}

const getTextForPermanentDuration = (
  deps: {
    translate: Translate
    translateMap: TranslateMap
  },
  value: PermanentDuration,
  env: {
    responsiveText: ResponsiveTextSize
  },
): string => {
  const translation = deps.translateMap(value.translations)
  const text = deps.translate("Permanent")

  if (translation?.replacement !== undefined) {
    return getResponsiveText(translation.replacement, env.responsiveText).replace("$1", text)
  } else {
    return text
  }
}

const getTextForFixedDuration = (
  deps: {
    translate: Translate
    translateMap: TranslateMap
  },
  value: FixedDuration,
  env: {
    responsiveText: ResponsiveTextSize
  },
): string => {
  const isMaximum = getTextForIsMaximum(value.is_maximum, deps.translate, env.responsiveText)
  const unitValue = formatTimeSpan(deps.translate, env.responsiveText, value.unit, value.value)
  const text = isMaximum + unitValue
  const translation = deps.translateMap(value.translations)

  if (translation?.replacement !== undefined) {
    return getResponsiveText(translation.replacement, env.responsiveText).replace("$1", text)
  } else {
    return text
  }
}

const getTextForCheckResultBasedDuration = (
  deps: {
    translate: Translate
    translateMap: TranslateMap
  },
  value: CheckResultBasedDuration,
  env: {
    responsiveText: ResponsiveTextSize
  },
): string => {
  const isMaximum = getTextForIsMaximum(value.is_maximum, deps.translate, env.responsiveText)

  return formatTimeSpan(
    deps.translate,
    env.responsiveText,
    value.unit,
    isMaximum + getTextForCheckResultBased(value, deps.translate),
  )
}

/**
 * Returns the text for the duration of a one-time activatable skill.
 */
export const getTextForDurationForOneTime = (
  deps: {
    translate: Translate
    translateMap: TranslateMap
  },
  value: DurationForOneTime,
  env: {
    responsiveText: ResponsiveTextSize
  },
): string => {
  switch (value.tag) {
    case "Immediate":
      return getTextForImmediateDuration(deps, value.immediate, env)
    case "Permanent":
      return getTextForPermanentDuration(deps, value.permanent, env)
    case "Fixed":
      return getTextForFixedDuration(deps, value.fixed, env)
    case "CheckResultBased":
      return getTextForCheckResultBasedDuration(deps, value.check_result_based, env)
    case "Indefinite":
      return getResponsiveText(
        deps.translateMap(value.indefinite.translations)?.description,
        env.responsiveText,
      )
    default:
      return assertExhaustive(value)
  }
}

/**
 * Returns the text for the duration of a sustained activatable skill.
 */
export const getTextForDurationForSustained = (
  deps: { translate: Translate },
  value: DurationForSustained | undefined,
  env: {
    responsiveText: ResponsiveTextSize
  },
): string =>
  value === undefined
    ? responsive(
        env.responsiveText,
        () => deps.translate("Sustained"),
        () => deps.translate("(S)"),
      )
    : responsive(
        env.responsiveText,
        () => deps.translate("no more than "),
        () => deps.translate("max. "),
      ) +
      formatTimeSpan(deps.translate, env.responsiveText, value.maximum.unit, value.maximum.value)

/**
 * Returns the text for the duration of a cantrip.
 */
export const getTextForCantripDuration = (
  deps: { translate: Translate; translateMap: TranslateMap },
  value: CantripDuration,
  env: {
    responsiveText: ResponsiveTextSize
  },
): string => {
  switch (value.tag) {
    case "Immediate":
      return getTextForImmediateDuration(deps, value.immediate, env)
    case "Fixed":
      return getTextForFixedDuration(deps, value.fixed, env)
    case "Indefinite":
      return getResponsiveText(
        deps.translateMap(value.indefinite.translations)?.description,
        env.responsiveText,
      )
    case "DuringLovemaking": {
      const { value: lovemakingValue, unit: lovemakingUnit } = value.during_lovemaking
      return formatTimeSpan(deps.translate, env.responsiveText, lovemakingUnit, lovemakingValue)
    }
    default:
      return assertExhaustive(value)
  }
}

/**
 * Returns the text for the duration of a blessing.
 */
export const getTextForBlessingDuration = (
  deps: { translate: Translate; translateMap: TranslateMap },
  value: BlessingDuration,
  env: {
    responsiveText: ResponsiveTextSize
  },
): string => {
  switch (value.tag) {
    case "Immediate":
      return getTextForImmediateDuration(deps, value.immediate, env)
    case "Fixed":
      return getTextForFixedDuration(deps, value.fixed, env)
    case "Indefinite":
      return getResponsiveText(
        deps.translateMap(value.indefinite.translations)?.description,
        env.responsiveText,
      )
    default:
      return assertExhaustive(value)
  }
}
