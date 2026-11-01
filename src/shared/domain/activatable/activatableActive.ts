// /**
//  * This file provides combining functions for displaying `Activatable`
//  * entries.
//  * @file src/Utilities/activatableActiveUtils.ts
//  * @author Lukas Obermann
//  * @since 1.1.0
//  */

import { ensure } from "@elyukai/utils/nullable"
import type { RangeBounds } from "@elyukai/utils/range"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ActivatableIdentifier, ExperienceLevel } from "@optolith/database-schema/gen"
import type {
  ActivatableNameChunk,
  ActivatableNameComponents,
} from "@optolith/entity-descriptions/entities/partial/activatableNameChunks"
import type { Character } from "../character.ts"
import type { Case } from "../databaseEnum.ts"
import type { CharacterActivatableInstance, SerializedActivatableInstance } from "./activatable.ts"
import {
  appliesToInstanceStrict,
  isGeneralDependency,
  type ActivatableDependency,
} from "./activatableDependency.ts"

// const isStyleSpecialAbilityRemovalDisabled =
//   (hero: HeroModelRecord) =>
//   (wiki_entry: Activatable): boolean =>
//     SpecialAbility.is(wiki_entry) && !isStyleValidToRemove(hero)(Just(wiki_entry))

/**
 * The cost of an activatable instance. It may be fix or varies depending on
 * other instances.
 */
export type DisplayedActiveActivatableCost =
  | Case<"Fixed", number>
  | Case<"Range", { min: number; max: number; total: number; diffWhenRemoved: number }>

/**
 * Returns the cost difference when removing the instance.
 */
export const getCostDifferenceOnRemove = (cost: DisplayedActiveActivatableCost): number => {
  switch (cost.kind) {
    case "Fixed":
      return cost.Fixed
    case "Range":
      return cost.Range.diffWhenRemoved
    default:
      return assertExhaustive(cost)
  }
}

/**
 * This instance has a fix AP value.
 */
export type DisplayedFixActiveActivatableCost = {
  kind: "fix"
  fix: number
}

/**
 * This instance does not have a fix AP value. Its AP value depends on other
 * instances. This way, the AP value of this instance may change when other
 * instances are removed or added.
 */
export type DisplayedVariableActiveActivatableCost = {
  kind: "variable"
  instancesTotal: number
  range: RangeBounds
  differenceOnRemove: number
}

/**
 * Returns the full name of the activatable entry as well as its components.
 */
export type ActivatableNameComponentsWithFull = ActivatableNameComponents & {
  full: ActivatableNameChunk
  fullWithoutLevel: [ActivatableNameChunk, ActivatableNameChunk?]
}

const getEntrySpecificIsRemovable = (
  instance: CharacterActivatableInstance,
  caps: {
    startExperienceLevel?: ExperienceLevel
    activeCantripsCount: number
    activeSpellworksCount: number
    activeMagicalActionsCount: number
    activeBlessingsCount: number
    activeLiturgicalChantsCount: number
    activeCeremoniesCount: number
    getRatingById: Character["getRatingById"]
    getActivatableRatingById: Character["getActivatableRatingById"]
  },
): boolean => {
  const { entityName, id } = instance.parent
  switch (entityName) {
    case "Advantage":
      switch (id) {
        case "AdvantageIdentifier.ExceptionalSkill": {
          if (caps.startExperienceLevel === undefined) {
            return true
          }

          const skillId =
            instance.options?.[0]?.type === "Predefined" ? instance.options[0].id : undefined

          if (skillId === undefined) {
            return true
          }

          const value = (() => {
            switch (skillId.kind) {
              case "Skill":
                return caps.getRatingById(skillId)
              case "Spell":
              case "Ritual":
              case "LiturgicalChant":
              case "Ceremony":
                return caps.getActivatableRatingById(skillId)
              case "General":
              case "Blessing":
              case "Cantrip":
              case "TradeSecret":
              case "Script":
              case "AnimalShape":
              case "ArcaneBardTradition":
              case "ArcaneDancerTradition":
              case "SexPractice":
              case "Race":
              case "Culture":
              case "BlessedTradition":
              case "Element":
              case "Property":
              case "Aspect":
              case "Disease":
              case "Poison":
              case "Language":
              case "CloseCombatTechnique":
              case "RangedCombatTechnique":
              case "TargetCategory":
              case "Patron":
              case "Advantage":
              case "HomunculusType":
              case "SkillApplication":
                return undefined
              default:
                return assertExhaustive(skillId)
            }
          })()

          if (value === undefined) {
            return true
          }

          const activations = instance.parent.countOptions(skillId)
          return value < caps.startExperienceLevel.max_skill_rating + activations
        }

        case "AdvantageIdentifier.ExceptionalCombatTechnique": {
          if (caps.startExperienceLevel === undefined) {
            return true
          }

          const ctId =
            instance.options?.[0]?.type === "Predefined" ? instance.options[0].id : undefined

          if (ctId === undefined) {
            return true
          }

          const value = (() => {
            switch (ctId.kind) {
              case "CloseCombatTechnique":
              case "RangedCombatTechnique":
                return caps.getRatingById(ctId)
              case "General":
              case "Blessing":
              case "Cantrip":
              case "TradeSecret":
              case "Script":
              case "AnimalShape":
              case "ArcaneBardTradition":
              case "ArcaneDancerTradition":
              case "SexPractice":
              case "Race":
              case "Culture":
              case "BlessedTradition":
              case "Element":
              case "Property":
              case "Aspect":
              case "Disease":
              case "Poison":
              case "Language":
              case "Skill":
              case "LiturgicalChant":
              case "Ceremony":
              case "Spell":
              case "Ritual":
              case "TargetCategory":
              case "Patron":
              case "Advantage":
              case "HomunculusType":
              case "SkillApplication":
                return undefined
              default:
                return assertExhaustive(ctId)
            }
          })()

          if (value === undefined) {
            return true
          }

          return value <= caps.startExperienceLevel.max_combat_technique_rating
        }
        default:
          return true
      }
    case "GeneralSpecialAbility":
      switch (id) {
        //       TODO: case SpecialAbilityId.Literacy: {
        //         return (
        //           isEntryRequiringMatchingScriptAndLangActive &&
        //           scriptsWithMatchingLanguages.length < 2 &&
        //           toNewMaybe(AOWIA.sid(active))
        //             .bind(sid => newEnsure(sid, isNumber))
        //             .maybe(false, sid => scriptsWithMatchingLanguages.includes(sid))
        //         )
        //       }

        //       TODO: case SpecialAbilityId.Language: {
        //         const isRequiredByEntryRequiringMatchingScriptAndLanguage =
        //           isEntryRequiringMatchingScriptAndLangActive &&
        //           languagesWithMatchingScripts.length < 2 &&
        //           toNewMaybe(AOWIA.sid(active))
        //             .bind(sid => newEnsure(sid, isNumber))
        //             .maybe(false, sid => languagesWithMatchingScripts.includes(sid))

        //         const isRequiredByDependingLanguage = toNewMaybe(AOWIA.sid(active))
        //           .bind(sid => newEnsure(sid, isNumber))
        //           .maybe(false, sid =>
        //             languagesWithDependingScripts
        //               .findM(languageGroupOfScript => languageGroupOfScript.includes(sid))
        //               .maybe(
        //                 false,
        //                 languageGroupOfScript =>
        //                   languageGroupOfScript.mapMaybe(idOfGroup =>
        //                     toNewMaybe(
        //                       find((ao: Record<ActiveObject>) => Maybe.elemF(AOA.sid(ao))(idOfGroup))(
        //                         ADA.active(hero_entry),
        //                       ),
        //                     ),
        //                   ).length < 2,
        //               ),
        //           )

        //         return isRequiredByEntryRequiringMatchingScriptAndLanguage || isRequiredByDependingLanguage
        //       }
        default:
          return true
      }
    case "CombatSpecialAbility":
      switch (id) {
        //       TODO: case SpecialAbilityId.CombatStyleCombination: {
        //         const armedStyleActive = countActiveGroupEntries(wiki)(hero)(
        //           SpecialAbilityGroup.CombatStylesArmed,
        //         )

        //         const unarmedStyleActive = countActiveGroupEntries(wiki)(hero)(
        //           SpecialAbilityGroup.CombatStylesUnarmed,
        //         )

        //         const totalActive = armedStyleActive + unarmedStyleActive

        //         // default is 1 per group (armed/unarmed), but with this SA 1 more in
        //         // one group: maximum of 3, but max 2 per group. If max is reached, this
        //         // SA cannot be removed
        //         return totalActive >= 3 || armedStyleActive >= 2 || unarmedStyleActive >= 2
        //       }
        default:
          return true
      }
    case "MagicalSpecialAbility":
      switch (id) {
        //       TODO: case SpecialAbilityId.PropertyKnowledge:
        //         return pipe_(
        //           active,
        //           AOWIA.sid,
        //           misNumberM,
        //           maybe(false)(prop_id =>
        //             OrderedMap.any(
        //               (spell: Record<ActivatableSkillDependent>) =>
        //                 ASDA.value(spell) > 14 &&
        //                 pipe_(
        //                   spell,
        //                   ASDA.id,
        //                   lookupF(SDA.spells(wiki)),
        //                   maybe(true)(pipe(SA.property, equals(prop_id))),
        //                 ),
        //             )(HA.spells(hero)),
        //           ),
        //         )
        //       TODO: case SpecialAbilityId.MagicStyleCombination: {
        //         const totalActive = countActiveGroupEntries(wiki)(hero)(13)

        //         // default is 1, but with this SA its 2. If it's 2 this SA is neccessary
        //         // and cannot be removed
        //         return totalActive >= 2
        //       }
        default:
          return true
      }
    case "MagicStyleSpecialAbility":
      switch (id) {
        //       // entries transferring unfamiliar special abilities (start)

        //       TODO: case SpecialAbilityId.TraditionGuildMages:
        //       case SpecialAbilityId.MadaschwesternStil:
        //       case SpecialAbilityId.ScholarDesMagierkollegsZuHoningen:
        //       case SpecialAbilityId.Zaubervariabilitaet:
        //       case SpecialAbilityId.ScholarDerHalleDesLebensZuNorburg:
        //       case SpecialAbilityId.ScholarDesKreisesDerEinfuehlung: {
        //         const m_static_spell_enhancements = pipe_(
        //           wiki,
        //           SDA.specialAbilities,
        //           lookup<string>(SpecialAbilityId.SpellEnhancement),
        //         )

        //         const active_spell_enhancements = pipe_(
        //           hero,
        //           HA.specialAbilities,
        //           lookup<string>(SpecialAbilityId.SpellEnhancement),
        //           liftM2((static_spell_enhancements: Record<SpecialAbility>) =>
        //             pipe(
        //               ADA.active,
        //               mapMaybe(
        //                 pipe(
        //                   AOA.sid,
        //                   misNumberM,
        //                   findSelectOption(static_spell_enhancements),
        //                   bindF(SOA.target),
        //                 ),
        //               ),
        //             ),
        //           )(m_static_spell_enhancements),
        //           fromMaybe(List<string>()),
        //         )

        //         type Target = string | UnfamiliarGroup

        //         const targets =
        //           id === SpecialAbilityId.Zaubervariabilitaet
        //             ? List<Target>(UnfamiliarGroup.Spells)
        //             : catMaybes(
        //                 List(
        //                   pipe_(active, AOWIA.sid, misStringM),
        //                   pipe_(active, AOWIA.sid2, misStringM),
        //                   pipe_(active, AOWIA.sid3, misStringM),
        //                 ),
        //               )

        //         const target_matches_id = (target: Target) => (spell_id: string) =>
        //           typeof target === "string"
        //             ? // The target must be the same …
        //               target === spell_id
        //             : // … or it must be from the same category
        //               target === UnfamiliarGroup.Spells

        //         const relevant_spell_enhancements = pipe_(
        //           active_spell_enhancements,
        //           filter(spell_id => any(Functn.flip(target_matches_id)(spell_id))(targets)),
        //         )

        //         // spell enhancements must exist to possibly be a dependency
        //         // also, a spell must be selected and it has to have an active spell
        //         // enhancement to be relevant
        //         if (
        //           notNull(active_spell_enhancements) &&
        //           notNull(targets) &&
        //           notNull(relevant_spell_enhancements)
        //         ) {
        //           const transferred = HA.transferredUnfamiliarSpells(hero)

        //           return pipe_(
        //             relevant_spell_enhancements,
        //             // check for alternative transferred dependency matches for all
        //             // targets that would allow this entry to be removed
        //             all(spell_id =>
        //               pipe_(
        //                 transferred,
        //                 // It cannot be the same entry
        //                 any(tu => TUA.srcId(tu) !== id && target_matches_id(TUA.id(tu))(spell_id)),
        //               ),
        //             ),
        //             // if all spell enhancement have alternative, it can be safely
        //             // removed and thus removal is "not" disabled
        //             not,
        //           )
        //         }

        //         return false
        //       }

        //       default:
        //         return false
        //     }
        default:
          return true
      }
    case "MagicalTradition":
      return (
        caps.activeCantripsCount + caps.activeSpellworksCount + caps.activeMagicalActionsCount === 0
      )
    case "KarmaSpecialAbility":
      switch (id) {
        //       TODO: case SpecialAbilityId.AspectKnowledge: {
        //         const all_aspcs = getActiveSelections(hero_entry)

        //         return pipe_(
        //           active,
        //           AOWIA.sid,
        //           misNumberM,
        //           maybe(false)(aspc_id => {
        //             const other_aspcs = sdelete<string | number>(aspc_id)(all_aspcs)

        //             return OrderedMap.any(
        //               (chant: Record<ActivatableSkillDependent>) =>
        //                 ASDA.value(chant) > 14 &&
        //                 pipe_(
        //                   chant,
        //                   ASDA.id,
        //                   lookupF(SDA.liturgicalChants(wiki)),
        //                   maybe(true)(
        //                     pipe(
        //                       LCA.aspects,
        //                       aspcs => elem(aspc_id)(aspcs) && all(notElemF(other_aspcs))(aspcs),
        //                     ),
        //                   ),
        //                 ),
        //             )(HA.liturgicalChants(hero))
        //           }),
        //         )
        //       }
        default:
          return true
      }
    case "LiturgicalStyleSpecialAbility":
      switch (id) {
        //       // Extended Blessed Special Abilities that allow to learn liturgical
        //       // chants of different traditions
        //       TODO: case SpecialAbilityId.Zugvoegel:
        //       case SpecialAbilityId.JaegerinnenDerWeissenMaid:
        //       case SpecialAbilityId.AnhaengerDesGueldenen: {
        //         const mblessed_tradition = getBlessedTraditionFromWiki(SDA.specialAbilities(wiki))(
        //           HA.specialAbilities(hero),
        //         )

        //         // Wiki entries for all active liturgical chants
        //         const active_chants = pipe_(
        //           hero,
        //           HA.liturgicalChants,
        //           elems,
        //           filter<Record<ActivatableSkillDependent>>(ASDA.active),
        //           mapByIdKeyMap(SDA.liturgicalChants(wiki)),
        //         )

        //         // If there are chants active that do not belong to the own tradition
        //         const mactive_unfamiliar_chants = fmap(
        //           pipe(isOwnTradition, notP, any, thrush(active_chants)),
        //         )(mblessed_tradition)

        //         return or(mactive_unfamiliar_chants)
        //       }
        default:
          return true
      }
    case "BlessedTradition":
      return (
        caps.activeBlessingsCount +
          caps.activeLiturgicalChantsCount +
          caps.activeCeremoniesCount ===
        0
      )
    default:
      return true
  }
}

export const getIsRemovable = (
  minLevel: number | undefined,
  dependencies: ActivatableDependency[],
  instance: CharacterActivatableInstance,
  caps: {
    startExperienceLevel?: ExperienceLevel
    activeCantripsCount: number
    activeSpellworksCount: number
    activeMagicalActionsCount: number
    activeBlessingsCount: number
    activeLiturgicalChantsCount: number
    activeCeremoniesCount: number
    getRatingById: Character["getRatingById"]
    getActivatableRatingById: Character["getActivatableRatingById"]
  },
): boolean =>
  minLevel === undefined &&
  dependencies.every(dep => !isGeneralDependency(dep) && !appliesToInstanceStrict(dep, instance)) &&
  // // Disable if style special ability is required for
  // // extended special abilities
  // TODO: isStyleSpecialAbilityRemovalDisabled(hero)(wiki_entry) ||
  getEntrySpecificIsRemovable(instance, caps)

const getEntrySpecificMinimumLevel = (
  id: ActivatableIdentifier,
  caps: {
    activeSermonsCount: number
    activeVisionsCount: number
    activeSpellworksCount: number
  },
): number | undefined => {
  switch (id.kind) {
    case "Advantage":
      switch (id.Advantage) {
        case "AdvantageIdentifier.LargeSpellSelection":
          return ensure(caps.activeSpellworksCount - 3, x => x > 0)
        case "AdvantageIdentifier.ManySermons":
          return ensure(caps.activeSermonsCount - 3, x => x > 0)
        case "AdvantageIdentifier.ManyVisions":
          return ensure(caps.activeVisionsCount - 3, x => x > 0)
        default:
          return undefined
      }
    case "GeneralSpecialAbility":
      switch (id.GeneralSpecialAbility) {
        case "GeneralSpecialAbilityIdentifier.Literacy": {
          // TODO: return isEntryRequiringMatchingScriptAndLangActive &&
          //   scriptsWithMatchingLanguages.length < 2 &&
          //   toNewMaybe(AOWIA.sid(x))
          //     .bind(sid => newEnsure(sid, isNumber))
          //     .maybe(false, sid => scriptsWithMatchingLanguages.includes(sid))
          //   ? 3
          //   : undefined
          return undefined
        }
        case "GeneralSpecialAbilityIdentifier.Language": {
          // TODO: return isEntryRequiringMatchingScriptAndLangActive &&
          //   languagesWithMatchingScripts.length < 2 &&
          //   toNewMaybe(AOWIA.sid(x))
          //     .bind(sid => newEnsure(sid, isNumber))
          //     .maybe(false, sid => languagesWithMatchingScripts.includes(sid))
          //   ? 3
          //   : undefined
          return undefined
        }
        default:
          return undefined
      }
    case "MagicalSpecialAbility":
      switch (id.MagicalSpecialAbility) {
        case "MagicalSpecialAbilityIdentifier.Imitationszauberei":
          return caps.activeSpellworksCount
        default:
          return undefined
      }

    default:
      return undefined
  }
}

export const getMinimumActiveLevel = (
  id: ActivatableIdentifier,
  dependencies: ActivatableDependency[],
  instance: SerializedActivatableInstance,
  caps: {
    activeSermonsCount: number
    activeVisionsCount: number
    activeSpellworksCount: number
  },
): number | undefined =>
  dependencies.reduce<number | undefined>(
    (acc, dep) =>
      dep.active === true && dep.level !== undefined && appliesToInstanceStrict(dep, instance)
        ? acc === undefined
          ? dep.level
          : Math.max(acc, dep.level)
        : acc,
    getEntrySpecificMinimumLevel(id, caps),
  )
