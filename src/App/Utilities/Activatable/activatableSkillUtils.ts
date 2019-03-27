/**
 * Filter and count `ActivatableSkill` entries.
 *
 * @author Lukas Obermann
 */

import { filter, OrderedMap, size } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { pipe } from "../pipe";

type ActivatableSkillEntriesAccessor =
  (hero: HeroModelRecord) => OrderedMap<string, Record<ActivatableSkillDependent>>

const { active } = ActivatableSkillDependent.A

/**
 * Get all active `ActivatableSkillDependent` entries from the specified domain.
 */
export const getActiveSkillEntries =
  (domain: "spells" | "liturgicalChants") =>
    pipe (
      HeroModel.A[domain] as ActivatableSkillEntriesAccessor,
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
