import { mapNullable, mapNullableDefault } from "../../utils/nullable.ts"
import { All, GetById } from "../getTypes.ts"
import { getSingleHighestPair } from "../idValue.ts"
import { getAttributeValue } from "./attribute.ts"
import { getHighestRequiredAttributeForCombatTechnique } from "./combatTechnique.ts"
import { getHighestRequiredAttributeForLiturgicalChant } from "./liturgicalChant.ts"
import { getHighestRequiredAttributeForSkill } from "./skill.ts"
import { getSingleHighestCheckAttributeId } from "./skillCheck.ts"
import { getHighestRequiredAttributeForSpellwork } from "./spell.ts"

const getAttributeMinimaForEntity = <
  D extends { id: number; value: number | undefined },
  S extends object,
>(
  dynamicEntries: D[],
  getStaticEntryById: (id: number) => S | undefined,
  getHighestRequiredAttributeForEntry: (
    dynamicEntry: D,
    staticEntry: S,
  ) => { id: number; value: number } | undefined,
): { id: number; value: number }[] =>
  dynamicEntries.flatMap(dynamicEntry =>
    // optimize performance by filtering out all entries that are below the
    // attribute minimum of 8
    (dynamicEntry.value ?? 0) < 8
      ? []
      : mapNullableDefault(
          mapNullable(getStaticEntryById(dynamicEntry.id), staticEntry =>
            getHighestRequiredAttributeForEntry(dynamicEntry, staticEntry),
          ),
          x => [x],
          [],
        ),
  )

/**
 * Returns the accumulated minimum values for attributes based on the associated
 * attributes of all entries with ratings (skills, combat techniques,
 * spellworks, magical actions, liturgical chants). Associated attributes means
 * either the check attributes (for all except combat techniques) or the primary
 * attributes (combat techniques). This covers the implied dependency of the
 * rule that allows a rating to be as high as the highest associated attribute +
 * 2, maybe further increased by entries such as *Exceptional Skill*
 * or *Exceptional Combat Technique*.
 */
export const getAttributeMinimaByAssociatedAttributes = (
  getStaticSkillById: GetById.Static.Skill,
  getStaticCloseCombatTechniqueById: GetById.Static.CloseCombatTechnique,
  getStaticRangedCombatTechniqueById: GetById.Static.RangedCombatTechnique,
  getStaticSpellById: GetById.Static.Spell,
  getStaticRitualById: GetById.Static.Ritual,
  getStaticLiturgicalChantById: GetById.Static.LiturgicalChant,
  getStaticCeremonyById: GetById.Static.Ceremony,
  getStaticCurseById: GetById.Static.Curse,
  getStaticElvenMagicalSongById: GetById.Static.ElvenMagicalSong,
  getStaticDominationRitualById: GetById.Static.DominationRitual,
  getStaticMagicalDanceById: GetById.Static.MagicalDance,
  getStaticMagicalMelodyById: GetById.Static.MagicalMelody,
  getStaticJesterTrickById: GetById.Static.JesterTrick,
  getStaticAnimistPowerById: GetById.Static.AnimistPower,
  getStaticGeodeRitualById: GetById.Static.GeodeRitual,
  getStaticZibiljaRitualById: GetById.Static.ZibiljaRitual,
  getDynamicAttributeById: GetById.Dynamic.Attribute,
  dynamicSkills: All.Dynamic.Skills,
  dynamicCloseCombatTechniques: All.Dynamic.CloseCombatTechniques,
  dynamicRangedCombatTechniques: All.Dynamic.RangedCombatTechniques,
  dynamicSpells: All.Dynamic.Spells,
  dynamicRituals: All.Dynamic.Rituals,
  dynamicLiturgicalChants: All.Dynamic.LiturgicalChants,
  dynamicCeremonies: All.Dynamic.Ceremonies,
  dynamicCurses: All.Dynamic.Curses,
  dynamicElvenMagicalSongs: All.Dynamic.ElvenMagicalSongs,
  dynamicDominationRituals: All.Dynamic.DominationRituals,
  dynamicMagicalDances: All.Dynamic.MagicalDances,
  dynamicMagicalMelodies: All.Dynamic.MagicalMelodies,
  dynamicJesterTricks: All.Dynamic.JesterTricks,
  dynamicAnimistPowers: All.Dynamic.AnimistPowers,
  dynamicGeodeRituals: All.Dynamic.GeodeRituals,
  dynamicZibiljaRituals: All.Dynamic.ZibiljaRituals,
  exceptionalSkill: Activatable | undefined,
  exceptionalCombatTechnique: Activatable | undefined,
): Record<number, number> => {
  const getSingleHighestPrimaryAttributeId = (primaryAttributeIds: number[]) =>
    getSingleHighestPair(
      primaryAttributeIds.map(id => ({
        id,
        value: getAttributeValue(getDynamicAttributeById(id)),
      })),
    )?.id

  return [
    ...getAttributeMinimaForEntity(dynamicSkills, getStaticSkillById, (dynamicEntry, staticEntry) =>
      getHighestRequiredAttributeForSkill(
        check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
        staticEntry,
        dynamicEntry,
        exceptionalSkill,
      ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicCloseCombatTechniques,
      getStaticCloseCombatTechniqueById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForCombatTechnique(
          getSingleHighestPrimaryAttributeId,
          { tag: "CloseCombatTechnique", closeCombatTechnique: staticEntry },
          dynamicEntry,
          exceptionalCombatTechnique,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicRangedCombatTechniques,
      getStaticRangedCombatTechniqueById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForCombatTechnique(
          getSingleHighestPrimaryAttributeId,
          { tag: "RangedCombatTechnique", rangedCombatTechnique: staticEntry },
          dynamicEntry,
          exceptionalCombatTechnique,
        ),
    ),
    ...getAttributeMinimaForEntity(dynamicSpells, getStaticSpellById, (dynamicEntry, staticEntry) =>
      getHighestRequiredAttributeForSpellwork(
        check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
        staticEntry,
        dynamicEntry,
        exceptionalSkill,
        "Spell",
      ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicRituals,
      getStaticRitualById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          exceptionalSkill,
          "Ritual",
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicLiturgicalChants,
      getStaticLiturgicalChantById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForLiturgicalChant(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          exceptionalSkill,
          "LiturgicalChant",
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicCeremonies,
      getStaticCeremonyById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForLiturgicalChant(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          exceptionalSkill,
          "Ceremony",
        ),
    ),
    ...getAttributeMinimaForEntity(dynamicCurses, getStaticCurseById, (dynamicEntry, staticEntry) =>
      getHighestRequiredAttributeForSpellwork(
        check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
        staticEntry,
        dynamicEntry,
        undefined,
        undefined,
      ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicElvenMagicalSongs,
      getStaticElvenMagicalSongById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicDominationRituals,
      getStaticDominationRitualById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicMagicalDances,
      getStaticMagicalDanceById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicMagicalMelodies,
      getStaticMagicalMelodyById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicJesterTricks,
      getStaticJesterTrickById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicAnimistPowers,
      getStaticAnimistPowerById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicGeodeRituals,
      getStaticGeodeRitualById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicZibiljaRituals,
      getStaticZibiljaRitualById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
  ].reduce<Record<number, number>>(
    (acc, { id, value }) => ({
      ...acc,
      [id]: mapNullableDefault(acc[id], prev => Math.max(prev, value), value),
    }),
    {},
  )
}
