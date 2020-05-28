/**
 * Filter and count `ActivatableSkill` entries.
 *
 * @author Lukas Obermann
 */

import { filter, size } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent"
import { HeroModelRecord } from "../../Models/Hero/Hero"
import { pipe } from "../pipe"

type ActivatableSkillEntriesAccessor =
  (hero: HeroModelRecord) => StrMap<Record<ActivatableSkillDependent>>

const { active } = ActivatableSkillDependent.AL

/**
 * Get all active `ActivatableSkillDependent` entries from the specified domain.
 */
export const getActiveSkillEntries =
  (domain: "spells" | "liturgicalChants") =>
    pipe (
      HeroModel.AL[domain] as ActivatableSkillEntriesAccessor,
      filter (active)
    )

/**
 * Count all active skills from the specified domain.
 */
export const countActiveSkillEntries =
  (domain: "spells" | "liturgicalChants") =>
    pipe (
      getActiveSkillEntries (domain),
      size
    )
