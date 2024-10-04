import {
  CostMap,
  IndefiniteOneTimeCost,
  ModifiableOneTimeCost,
  MultipleOneTimeCosts,
  NonModifiableOneTimeCost,
  NonModifiableOneTimeCostPerCountable,
  OneTimeCost,
  SingleOneTimeCost,
  SustainedCost,
} from "optolith-database-schema/types/_ActivatableSkillCost"
import { mapNullable, mapNullableDefault } from "../../../utils/nullable.ts"
import { Translate, TranslateMap } from "../../../utils/translate.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { GetById } from "../../getTypes.ts"
import {
  getResponsiveText,
  getResponsiveTextOptional,
  replaceTextIfRequested,
  responsive,
  ResponsiveTextSize,
} from "../responsiveText.ts"
import { MISSING_VALUE } from "../unknown.ts"
import { Entity } from "./entity.ts"
import { ModifiableParameter } from "./modifiableParameter.ts"
import { getTextForNonModifiableSuffix } from "./nonModifiable.ts"
import { getModifiableBySpeed, Speed } from "./speed.ts"
import { formatCost, formatTimeSpan } from "./units.ts"

const getTextForModifiableOneTimeCost = (
  deps: {
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    translate: Translate
    translateMap: TranslateMap
  },
  value: ModifiableOneTimeCost,
  env: {
    speed: Speed
    entity: Entity
    responsiveText: ResponsiveTextSize
  },
): string =>
  mapNullable(
    deps.getSkillModificationLevelById(value.initial_modification_level),
    modificationLevel => {
      const cost = getModifiableBySpeed(
        modificationLevel,
        env.speed,
        config => config.cost,
        config => config.cost,
      )

      return replaceTextIfRequested(
        value.translations,
        formatCost(deps.translate, env.entity, cost),
        deps.translateMap,
        env.responsiveText,
      )
    },
  ) ?? MISSING_VALUE

const getMinimumText = (
  isMinimum: boolean | undefined,
  translate: Translate,
  responsiveText: ResponsiveTextSize,
) =>
  isMinimum !== true
    ? ""
    : responsive(
        responsiveText,
        () => translate("at least "),
        () => translate("min. "),
      )

const getTextForNonModifiableOneTimeCostPerCountable = (
  deps: {
    translate: Translate
    translateMap: TranslateMap
    formatCost: (x: number | string) => string
  },
  value: NonModifiableOneTimeCostPerCountable | undefined,
  env: {
    responsiveText: ResponsiveTextSize
  },
) =>
  mapNullable(value, perCountable => {
    const countableText = responsive(
      env.responsiveText,
      entity => deps.translate(" per {0}", entity),
      entity => deps.translate("/{0}", entity),
      getResponsiveText(
        deps.translateMap(perCountable.translations)?.countable,
        env.responsiveText,
      ),
    )

    const minimumTotalText =
      mapNullable(perCountable.minimum_total, minimumTotal =>
        deps.translate(", minimum of {0}", deps.formatCost(minimumTotal)),
      ) ?? ""

    return countableText + minimumTotalText
  }) ?? ""

const getTextForPermanentValue = (
  value: number | undefined,
  responsiveText: ResponsiveTextSize,
  translate: Translate,
) =>
  value === undefined
    ? ""
    : responsive(
        responsiveText,
        perm => translate(", {0} of which are permanent", perm),
        perm => translate(" ({0} perm.)", perm),
        value,
      )

const getTextForNonModifiableOneTimeCost = (
  deps: { translate: Translate; translateMap: TranslateMap },
  value: NonModifiableOneTimeCost,
  env: {
    responsiveText: ResponsiveTextSize
    entity: Entity
  },
): string => {
  const isMinimum = getMinimumText(value.is_minimum, deps.translate, env.responsiveText)
  const formatCostP = formatCost.bind(this, deps.translate, env.entity)
  const per = getTextForNonModifiableOneTimeCostPerCountable(
    { ...deps, formatCost: formatCostP },
    value.per,
    env,
  )
  const permanent = getTextForPermanentValue(
    value.permanent_value,
    env.responsiveText,
    deps.translate,
  )
  const translation = deps.translateMap(value.translations)
  const note = mapNullableDefault(
    translation === undefined || translation.note === undefined
      ? undefined
      : getResponsiveTextOptional(translation.note, env.responsiveText),
    noteIfPresent => ` (${noteIfPresent})`,
    "",
  )

  const cannotModify = getTextForNonModifiableSuffix(
    deps.translate,
    env.entity,
    ModifiableParameter.Cost,
    env.responsiveText,
  )

  return isMinimum + formatCostP(value.value) + per + permanent + note + cannotModify
}

const getTextForIndefiniteOneTimeCost = (
  deps: { translate: Translate; translateMap: TranslateMap },
  value: IndefiniteOneTimeCost,
  env: {
    responsiveText: ResponsiveTextSize
    entity: Entity
  },
): string =>
  (getResponsiveText(deps.translateMap(value.translations)?.description, env.responsiveText) ??
    "") +
  getTextForNonModifiableSuffix(
    deps.translate,
    env.entity,
    ModifiableParameter.Cost,
    env.responsiveText,
  )

const getTextForSingleOneTimeCost = (
  deps: {
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    translate: Translate
    translateMap: TranslateMap
  },
  value: SingleOneTimeCost,
  env: {
    speed: Speed
    responsiveText: ResponsiveTextSize
    entity: Entity
  },
): string => {
  switch (value.tag) {
    case "Modifiable":
      return getTextForModifiableOneTimeCost(deps, value.modifiable, env)
    case "NonModifiable":
      return getTextForNonModifiableOneTimeCost(deps, value.non_modifiable, env)
    case "Indefinite":
      return getTextForIndefiniteOneTimeCost(deps, value.indefinite, env)
    default:
      return assertExhaustive(value)
  }
}

const getTextForMultipleOneTimeCosts = (
  deps: {
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    translate: Translate
    translateMap: TranslateMap
  },
  value: MultipleOneTimeCosts,
  type: "conjunction" | "disjunction",
  env: {
    speed: Speed
    responsiveText: ResponsiveTextSize
    entity: Entity
  },
): string => {
  const modifiable = !value.every(part => part.tag === "Modifiable")
    ? getTextForNonModifiableSuffix(
        deps.translate,
        env.entity,
        ModifiableParameter.Cost,
        env.responsiveText,
      )
    : ""

  return (
    value
      .map(part => getTextForSingleOneTimeCost(deps, part, env))
      .join(
        (() => {
          switch (type) {
            case "conjunction":
              return responsive(
                env.responsiveText,
                () => deps.translate(" and "),
                () => deps.translate(" + "),
              )
            case "disjunction":
              return responsive(
                env.responsiveText,
                () => deps.translate(" or "),
                () => deps.translate(" / "),
              )
            default:
              return assertExhaustive(type)
          }
        })(),
      ) + modifiable
  )
}

const getTextForCostMap = (
  deps: {
    translate: Translate
    translateMap: TranslateMap
  },
  value: CostMap,
  env: {
    responsiveText: ResponsiveTextSize
    entity: Entity
  },
): string => {
  const translation = deps.translateMap(value.translations)

  if (value.translations !== undefined && translation === undefined) {
    return MISSING_VALUE
  }

  if (translation?.replacement !== undefined) {
    return translation.replacement
  }

  const costs = value.options.map(option => option.value).join("/")
  const labels = value.options
    .map(option => deps.translateMap(option.translations)?.label ?? MISSING_VALUE)
    .join("/")
  const permanentCosts = value.options.every(option => option.permanent_value !== undefined)
    ? value.options.map(option => option.permanent_value!).join("/")
    : undefined

  const formatCostP = formatCost.bind(this, deps.translate, env.entity)
  const notModifiable = getTextForNonModifiableSuffix(
    deps.translate,
    env.entity,
    ModifiableParameter.Cost,
    env.responsiveText,
  )

  return (
    formatCostP(costs) +
    deps.translate(" for ") +
    mapNullableDefault(translation?.list_prepend, listPrepend => `${listPrepend} `, "") +
    labels +
    (translation?.list_append ?? "") +
    (permanentCosts !== undefined
      ? deps.translate(", {0} of which are permanent", formatCostP(permanentCosts))
      : "") +
    notModifiable
  )
}

/**
 * Returns the text for the cost of a one-time activatable skill.
 */
export const getTextForOneTimeCost = (
  deps: {
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    translate: Translate
    translateMap: TranslateMap
  },
  value: OneTimeCost,
  env: {
    speed: Speed
    responsiveText: ResponsiveTextSize
    entity: Entity
  },
): string => {
  switch (value.tag) {
    case "Single":
      return getTextForSingleOneTimeCost(deps, value.single, env)
    case "Conjunction":
      return getTextForMultipleOneTimeCosts(deps, value.conjunction, "conjunction", env)
    case "Disjunction":
      return getTextForMultipleOneTimeCosts(deps, value.disjunction, "disjunction", env)
    case "Map":
      return getTextForCostMap(deps, value.map, env)
    default:
      return assertExhaustive(value)
  }
}

/**
 * Returns the text for the cost of a sustained activatable skill.
 */
export const getTextForSustainedCost = (
  deps: {
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    translate: Translate
    translateMap: TranslateMap
  },
  value: SustainedCost,
  env: {
    speed: Speed
    responsiveText: ResponsiveTextSize
    entity: Entity
  },
): string => {
  switch (value.tag) {
    case "Modifiable": {
      const modificationLevel = deps.getSkillModificationLevelById(
        value.modifiable.initial_modification_level,
      )

      if (modificationLevel === undefined) {
        return MISSING_VALUE
      }

      const cost = (() => {
        switch (env.speed) {
          case Speed.Fast:
            return modificationLevel.fast.cost
          case Speed.Slow:
            return modificationLevel.slow.cost
          default:
            return assertExhaustive(env.speed)
        }
      })()

      const formatCostP = formatCost.bind(this, deps.translate, env.entity)
      const interval = formatTimeSpan(
        deps.translate,
        env.responsiveText,
        value.modifiable.interval.unit,
        value.modifiable.interval.value,
      )

      return responsive(
        env.responsiveText,
        () =>
          `${formatCostP(cost) + deps.translate(" (casting)")} + ${
            formatCostP(cost / 2) + deps.translate(" per {0}", interval)
          }`,
        () => `${formatCostP(cost)} + ${formatCostP(cost / 2) + deps.translate("/{0}", interval)}`,
      )
    }
    case "NonModifiable": {
      const isMinimum = getMinimumText(
        value.non_modifiable.is_minimum,
        deps.translate,
        env.responsiveText,
      )
      const cost = value.non_modifiable.value
      const formatCostP = formatCost.bind(this, deps.translate, env.entity)

      const per = (() => {
        if (value.non_modifiable.per === undefined) {
          return { countable: "", minimumTotal: "" }
        }

        const countable = responsive(
          env.responsiveText,
          entity => deps.translate(" per {0}", entity),
          entity => deps.translate("/{0}", entity),
          getResponsiveText(
            deps.translateMap(value.non_modifiable.per.translations)?.countable,
            env.responsiveText,
          ),
        )

        const minimumTotal =
          value.non_modifiable.per.minimum_total !== undefined
            ? deps.translate(
                ", minimum of {0}",
                formatCostP(value.non_modifiable.per.minimum_total),
              )
            : ""

        return { countable, minimumTotal }
      })()

      const interval = formatTimeSpan(
        deps.translate,
        env.responsiveText,
        value.non_modifiable.interval.unit,
        value.non_modifiable.interval.value,
      )

      return (
        isMinimum +
        responsive(
          env.responsiveText,
          () =>
            `${formatCostP(cost) + deps.translate(" (casting)")} + ${
              (value.non_modifiable.is_minimum === true
                ? deps.translate("half of the activation cost")
                : formatCostP(cost / 2)) +
              per.countable +
              deps.translate(" per {0}", interval)
            }`,
          () =>
            `${formatCostP(cost)} + ${
              (value.non_modifiable.is_minimum === true ? "50%" : formatCostP(cost / 2)) +
              per.countable +
              deps.translate("/{0}", interval)
            }`,
        ) +
        per.minimumTotal +
        getTextForNonModifiableSuffix(
          deps.translate,
          env.entity,
          ModifiableParameter.Cost,
          env.responsiveText,
        )
      )
    }
    default:
      return assertExhaustive(value)
  }
}
