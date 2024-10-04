import {
  CastingTime,
  CastingTimeDuringLovemaking,
  FastCastingTime,
  FastSkillNonModifiableCastingTime,
  ModifiableCastingTime,
  SlowCastingTime,
  SlowSkillNonModifiableCastingTime,
} from "optolith-database-schema/types/_ActivatableSkillCastingTime"
import { isNotNullish, mapNullable } from "../../../utils/nullable.ts"
import { Translate } from "../../../utils/translate.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { GetById } from "../../getTypes.ts"
import { ResponsiveTextSize } from "../responsiveText.ts"
import { MISSING_VALUE } from "../unknown.ts"
import { Entity } from "./entity.ts"
import { ModifiableParameter } from "./modifiableParameter.ts"
import { getTextForNonModifiableSuffix } from "./nonModifiable.ts"
import { Speed } from "./speed.ts"
import { formatTimeSpan } from "./units.ts"

const getTextForModifiableCastingTime = (
  deps: {
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    translate: Translate
  },
  value: ModifiableCastingTime,
  env: {
    speed: Speed
    responsiveText: ResponsiveTextSize
  },
): string =>
  mapNullable(
    deps.getSkillModificationLevelById(value.initial_modification_level),
    ({ fast: { casting_time: fastTime }, slow: { casting_time: slowTime } }) => {
      switch (env.speed) {
        case Speed.Fast:
          return formatTimeSpan(deps.translate, env.responsiveText, "Actions", fastTime)
        case Speed.Slow:
          return formatTimeSpan(deps.translate, env.responsiveText, slowTime.unit, slowTime.value)
        default:
          return assertExhaustive(env.speed)
      }
    },
  ) ?? MISSING_VALUE

const getTextForFastSkillNonModifiableCastingTime = (
  deps: {
    translate: Translate
  },
  value: FastSkillNonModifiableCastingTime,
  env: {
    entity: Entity
    responsiveText: ResponsiveTextSize
  },
): string =>
  formatTimeSpan(deps.translate, env.responsiveText, "Actions", value.actions) +
  getTextForNonModifiableSuffix(
    deps.translate,
    env.entity,
    ModifiableParameter.CastingTime,
    env.responsiveText,
  )

const getTextForSlowSkillNonModifiableCastingTime = (
  deps: {
    translate: Translate
  },
  value: SlowSkillNonModifiableCastingTime,
  env: {
    entity: Entity
    responsiveText: ResponsiveTextSize
  },
): string =>
  formatTimeSpan(deps.translate, env.responsiveText, value.unit, value.value) +
  getTextForNonModifiableSuffix(
    deps.translate,
    env.entity,
    ModifiableParameter.CastingTime,
    env.responsiveText,
  )

const getTextForCastingTime = <NonModifiable extends object>(
  deps: {
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    translate: Translate
  },
  value: CastingTime<NonModifiable>,
  env: {
    speed: Speed
    responsiveText: ResponsiveTextSize
  },
  getTextForNonModifiableCastingTime: (value: NonModifiable) => string,
): string => {
  switch (value.tag) {
    case "Modifiable":
      return getTextForModifiableCastingTime(deps, value.modifiable, env)
    case "NonModifiable":
      return getTextForNonModifiableCastingTime(value.non_modifiable)
    default:
      return assertExhaustive(value)
  }
}

const getTextForCastingTimeDuringLovemaking = (
  deps: {
    translate: Translate
  },
  value: CastingTimeDuringLovemaking,
  env: {
    responsiveText: ResponsiveTextSize
  },
): string => formatTimeSpan(deps.translate, env.responsiveText, value.unit, value.value)

/**
 * Get the text for the casting time of a fast activatable skill.
 */
export const getTextForFastCastingTime = (
  deps: {
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    translate: Translate
  },
  value: FastCastingTime,
  env: {
    entity: Entity
    responsiveText: ResponsiveTextSize
  },
): string =>
  [
    mapNullable(value.default, def =>
      getTextForCastingTime(deps, def, { ...env, speed: Speed.Fast }, nonModifiableValue =>
        getTextForFastSkillNonModifiableCastingTime(deps, nonModifiableValue, env),
      ),
    ),
    mapNullable(value.during_lovemaking, duringLovemaking =>
      getTextForCastingTimeDuringLovemaking(deps, duringLovemaking, env),
    ),
  ]
    .filter(isNotNullish)
    .join(" / ")

/**
 * Get the text for the casting time of a slow activatable skill.
 */
export const getTextForSlowCastingTime = (
  deps: {
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    translate: Translate
  },
  value: SlowCastingTime,
  env: {
    entity: Entity
    responsiveText: ResponsiveTextSize
  },
): string =>
  [
    mapNullable(value.default, def =>
      getTextForCastingTime(deps, def, { ...env, speed: Speed.Slow }, nonModifiableValue =>
        getTextForSlowSkillNonModifiableCastingTime(deps, nonModifiableValue, env),
      ),
    ),
    mapNullable(value.during_lovemaking, duringLovemaking =>
      getTextForCastingTimeDuringLovemaking(deps, duringLovemaking, env),
    ),
  ]
    .filter(isNotNullish)
    .join(" / ")
