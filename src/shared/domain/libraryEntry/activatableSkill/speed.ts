import {
  FastSkillModificationLevelConfig,
  SkillModificationLevel,
  SlowSkillModificationLevelConfig,
} from "optolith-database-schema/types/SkillModificationLevel"
import { assertExhaustive } from "../../../utils/typeSafety.ts"

/**
 * The speed of an activatable skill.
 */
export enum Speed {
  Fast,
  Slow,
}

/**
 * Returns a common value for a skill modification level depending on the speed.
 */
export const getModifiableBySpeed = <T>(
  level: SkillModificationLevel,
  speed: Speed,
  fast: (config: FastSkillModificationLevelConfig) => T,
  slow: (config: SlowSkillModificationLevelConfig) => T,
): T => {
  switch (speed) {
    case Speed.Fast:
      return fast(level.fast)
    case Speed.Slow:
      return slow(level.slow)
    default:
      return assertExhaustive(speed)
  }
}
