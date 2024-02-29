// /**
//  * This file provides combining functions for displaying `Activatable`
//  * entries.
//  * @file src/Utilities/activatableActiveUtils.ts
//  * @author Lukas Obermann
//  * @since 1.1.0
//  */

import { ResolvedSelectOption } from "optolith-database-schema/cache/activatableSelectOptions"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { AdventurePointsValue } from "optolith-database-schema/types/_Activatable"
import { GeneralIdentifier } from "optolith-database-schema/types/_Identifier"
import {
  ActivatableIdentifier,
  SelectOptionIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import { count, sum, sumWith } from "../../utils/array.ts"
import { not } from "../../utils/function.ts"
import { ensure, isNotNullish } from "../../utils/nullable.ts"
import { mapObject } from "../../utils/object.ts"
import { RangeBounds } from "../../utils/range.ts"
import { romanize } from "../../utils/roman.ts"
import { Translate, TranslateMap } from "../../utils/translate.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { FilterApplyingActivatableDependencies } from "../dependencies/filterApplyingDependencies.ts"
import { GetById } from "../getTypes.ts"
import {
  AdvantageIdentifier,
  DisadvantageIdentifier,
  GeneralSpecialAbilityIdentifier,
  MagicalSpecialAbilityIdentifier,
  createIdentifierObject,
  equalsIdentifier,
} from "../identifier.ts"
import { getCombatTechniqueValue } from "../rated/combatTechnique.ts"
import { getLiturgicalChantValue } from "../rated/liturgicalChant.ts"
import { getSkillValue } from "../rated/skill.ts"
import { getSpellValue } from "../rated/spell.ts"
import {
  ActivatableDependency,
  appliesToInstanceStrict,
  isGeneralDependency,
} from "./activatableDependency.ts"
import {
  Activatable,
  ActivatableInstance,
  countOptions,
  hasCustomAdventurePointsValue,
  isPredefinedActivatableOption,
  matchesOptionId,
} from "./activatableEntry.ts"
import { getMaximumLevel } from "./activatableInactive.ts"

// import { ActivatableCategory, Category } from "../../../App/Constants/Categories.ts"
// import { ActivatableDependent } from "../../../App/Models/ActiveEntries/ActivatableDependent.ts"
// import { ActiveObjectWithId } from "../../../App/Models/ActiveEntries/ActiveObjectWithId.ts"
// import { HeroModel, HeroModelRecord } from "../../../App/Models/Hero/HeroModel.ts"
// import { ActivatableActivationValidation } from "../../../App/Models/View/ActivatableActivationValidationObject.ts"
// import { ActivatableCombinedName } from "../../../App/Models/View/ActivatableCombinedName.ts"
// import {
//   ActivatableNameCost,
//   ActivatableNameCostSafeCost,
// } from "../../../App/Models/View/ActivatableNameCost.ts"
// import { ActiveActivatable } from "../../../App/Models/View/ActiveActivatable.ts"
// import { Advantage } from "../../../App/Models/Wiki/Advantage.ts"
// import { Disadvantage } from "../../../App/Models/Wiki/Disadvantage.ts"
// import { SpecialAbility } from "../../../App/Models/Wiki/SpecialAbility.ts"
// import { StaticData, StaticDataRecord } from "../../../App/Models/Wiki/WikiModel.ts"
// import { WikiEntryByCategory } from "../../../App/Models/Wiki/wikiTypeHelpers.ts"
// import { MatchingScriptAndLanguageRelated } from "../../../App/Selectors/activatableSelectors.ts"
// import { getActiveFromState } from "../../../App/Utilities/Activatable/activatableConvertUtils.ts"
// import { getName } from "../../../App/Utilities/Activatable/activatableNameUtils.ts"
// import {
//   convertPerTierCostToFinalCost,
//   getCost,
// } from "../../../App/Utilities/AdventurePoints/activatableCostUtils.ts"
// import { pipe_ } from "../../../App/Utilities/pipe.ts"
// import { fmap } from "../../../Data/Functor.ts"
// import { List } from "../../../Data/List.ts"
// import { bind, liftM2, mapMaybe, Maybe } from "../../../Data/Maybe.ts"
// import { lookup, OrderedMap } from "../../../Data/OrderedMap.ts"
// import { Record } from "../../../Data/Record.ts"
// import { fst, Pair, snd } from "../../../Data/Tuple.ts"
// import { getIsRemovalOrChangeDisabled } from "./activatableActiveValidationUtils"

// const SDA = StaticData.A
// const HA = HeroModel.A

// /**
//  * Takes an Activatable category and a hero and returns the state slice matching
//  * the passed category.
//  */
// export const getActivatableHeroSliceByCategory =
//   (category: ActivatableCategory) =>
//   (hero: HeroModelRecord): OrderedMap<string, Record<ActivatableDependent>> =>
//     category === Category.ADVANTAGES
//       ? HA.advantages(hero)
//       : category === Category.DISADVANTAGES
//       ? HA.disadvantages(hero)
//       : HA.specialAbilities(hero)

// type ActivatableWikiSliceByCategory<A extends ActivatableCategory> = A extends Category.ADVANTAGES
//   ? Record<Advantage>
//   : A extends Category.ADVANTAGES
//   ? Record<Disadvantage>
//   : Record<SpecialAbility>

// /**
//  * Takes an Activatable category and a hero and returns the state slice matching
//  * the passed category.
//  */
// export const getActivatableWikiSliceByCategory =
//   <A extends ActivatableCategory>(category: A) =>
//   (wiki: StaticDataRecord): OrderedMap<string, ActivatableWikiSliceByCategory<A>> =>
//     category === Category.ADVANTAGES
//       ? (SDA.advantages(wiki) as OrderedMap<string, ActivatableWikiSliceByCategory<A>>)
//       : category === Category.DISADVANTAGES
//       ? (SDA.disadvantages(wiki) as OrderedMap<string, ActivatableWikiSliceByCategory<A>>)
//       : (SDA.specialAbilities(wiki) as OrderedMap<string, ActivatableWikiSliceByCategory<A>>)

// /**
//  * Returns name, splitted and combined, as well as the AP you get when removing
//  * the ActiveObject.
//  * @param obj The ActiveObject with origin id.
//  * @param wiki The wiki state.
//  * @param state The current hero's state.
//  * @param isEntryToAdd If the cost are going to be added or removed from AP left.
//  * @param locale The locale-dependent messages.
//  */
// export const getNameCost =
//   (isEntryToAdd: boolean) =>
//   (automatic_advantages: List<string>) =>
//   (staticData: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (entry: Record<ActiveObjectWithId>): Maybe<Record<ActivatableNameCost>> =>
//     liftM2(
//       (finalCost: Pair<number | List<number>, boolean>) =>
//         (naming: Record<ActivatableCombinedName>) =>
//           ActivatableNameCost({
//             naming,
//             active: entry,
//             finalCost: fst(finalCost),
//             isAutomatic: snd(finalCost),
//           }),
//     )(getCost(isEntryToAdd)(automatic_advantages)(staticData)(hero)(entry))(
//       getName(staticData)(entry),
//     )

// /**
//  * Returns name, splitted and combined, as well as the AP you get when removing
//  * the ActiveObject.
//  * @param obj The ActiveObject with origin id.
//  * @param wiki The wiki state.
//  * @param l10n The locale-dependent messages.
//  */
// export const getNameCostForWiki =
//   (staticData: StaticDataRecord) =>
//   (active: Record<ActiveObjectWithId>): Maybe<Record<ActivatableNameCost>> =>
//     liftM2(
//       (finalCost: Pair<number | List<number>, boolean>) =>
//         (naming: Record<ActivatableCombinedName>) =>
//           ActivatableNameCost({
//             active,
//             naming,
//             finalCost: fst(finalCost),
//             isAutomatic: snd(finalCost),
//           }),
//     )(getCost(true)(List())(staticData)(HeroModel.default)(active))(getName(staticData)(active))

//// Validation

// const isStyleSpecialAbilityRemovalDisabled =
//   (hero: HeroModelRecord) =>
//   (wiki_entry: Activatable): boolean =>
//     SpecialAbility.is(wiki_entry) && !isStyleValidToRemove(hero)(Just(wiki_entry))

/**
 * A combination of a static activatable entry and its dynamic counterpart,
 * extended by which activation/instance of the entry it represents.
 */
export type DisplayedActiveActivatable<T> = {
  static: T
  dynamic: Activatable
  instanceIndex: number
  isRemovable: boolean
  minLevel?: number
  maxLevel?: number
  cost: DisplayedActiveActivatableCost
  name: ActivatableNameComponents
}

/**
 * The cost of an activatable instance. It may be fix or varies depending on
 * other instances.
 */
export type DisplayedActiveActivatableCost =
  | DisplayedFixActiveActivatableCost
  | DisplayedVariableActiveActivatableCost

/**
 * Returns the cost difference when removing the instance.
 */
export const getCostDifferenceOnRemove = (cost: DisplayedActiveActivatableCost): number => {
  switch (cost.kind) {
    case "fix":
      return cost.fix
    case "variable":
      return cost.differenceOnRemove
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
export type ActivatableNameComponents = {
  full: ActivatableNameChunk
  fullWithoutLevel: ActivatableNameChunk | [ActivatableNameChunk, ActivatableNameChunk]
  base: ActivatableNameChunk
  options: (ActivatableNameChunk | [ActivatableNameChunk, ActivatableNameChunk])[]
}

/**
 * A part of the name, which can be a locale map, a string for all locales or a
 * function returning a string.
 */
export type ActivatableNameChunk =
  | LocaleMap<string>
  | string
  | ((fs: { translate: Translate; translateMap: TranslateMap }) => string)

const getEntrySpecificIsRemovable = (
  id: ActivatableIdentifier,
  instances: ActivatableInstance[],
  instance: ActivatableInstance,
  caps: {
    startExperienceLevel?: ExperienceLevel
    activeCantripsCount: number
    activeSpellworksCount: number
    activeMagicalActionsCount: number
    activeBlessingsCount: number
    activeLiturgicalChantsCount: number
    activeCeremoniesCount: number
    getDynamicSkillById: GetById.Dynamic.Skill
    getDynamicLiturgicalChantById: GetById.Dynamic.LiturgicalChant
    getDynamicCeremonyById: GetById.Dynamic.Ceremony
    getDynamicSpellById: GetById.Dynamic.Spell
    getDynamicRitualById: GetById.Dynamic.Ritual
    getDynamicCloseCombatTechniqueById: GetById.Dynamic.CloseCombatTechnique
    getDynamicRangedCombatTechniqueById: GetById.Dynamic.RangedCombatTechnique
  },
): boolean => {
  switch (id.tag) {
    case "Advantage":
      switch (id.advantage) {
        case AdvantageIdentifier.ExceptionalSkill: {
          if (caps.startExperienceLevel === undefined) {
            return true
          }

          const skillId =
            instance.options?.[0]?.type === "Predefined" ? instance.options[0].id : undefined

          if (skillId === undefined) {
            return true
          }

          const value = (() => {
            switch (skillId.tag) {
              case "Skill":
                return getSkillValue(caps.getDynamicSkillById(skillId.skill))
              case "LiturgicalChant":
                return getLiturgicalChantValue(
                  caps.getDynamicLiturgicalChantById(skillId.liturgical_chant),
                )
              case "Ceremony":
                return getLiturgicalChantValue(caps.getDynamicCeremonyById(skillId.ceremony))
              case "Spell":
                return getSpellValue(caps.getDynamicSpellById(skillId.spell))
              case "Ritual":
                return getSpellValue(caps.getDynamicRitualById(skillId.ritual))
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
                return undefined
              default:
                return assertExhaustive(skillId)
            }
          })()

          if (value === undefined) {
            return true
          }

          const activations = countOptions(instances, skillId)
          return value < caps.startExperienceLevel.max_skill_rating + activations
        }

        case AdvantageIdentifier.ExceptionalCombatTechnique: {
          if (caps.startExperienceLevel === undefined) {
            return true
          }

          const ctId =
            instance.options?.[0]?.type === "Predefined" ? instance.options[0].id : undefined

          if (ctId === undefined) {
            return true
          }

          const value = (() => {
            switch (ctId.tag) {
              case "CloseCombatTechnique":
                return getCombatTechniqueValue(
                  caps.getDynamicCloseCombatTechniqueById(ctId.close_combat_technique),
                )
              case "RangedCombatTechnique":
                return getCombatTechniqueValue(
                  caps.getDynamicRangedCombatTechniqueById(ctId.ranged_combat_technique),
                )
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
      switch (id.general_special_ability) {
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
      switch (id.combat_special_ability) {
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
      switch (id.magical_special_ability) {
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
      switch (id.magic_style_special_ability) {
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
      switch (id.karma_special_ability) {
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
      switch (id.liturgical_style_special_ability) {
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

const getIsRemovable = (
  id: ActivatableIdentifier,
  minLevel: number | undefined,
  dependencies: ActivatableDependency[],
  instances: ActivatableInstance[],
  instance: ActivatableInstance,
  caps: {
    startExperienceLevel?: ExperienceLevel
    activeCantripsCount: number
    activeSpellworksCount: number
    activeMagicalActionsCount: number
    activeBlessingsCount: number
    activeLiturgicalChantsCount: number
    activeCeremoniesCount: number
    getDynamicSkillById: GetById.Dynamic.Skill
    getDynamicLiturgicalChantById: GetById.Dynamic.LiturgicalChant
    getDynamicCeremonyById: GetById.Dynamic.Ceremony
    getDynamicSpellById: GetById.Dynamic.Spell
    getDynamicRitualById: GetById.Dynamic.Ritual
    getDynamicCloseCombatTechniqueById: GetById.Dynamic.CloseCombatTechnique
    getDynamicRangedCombatTechniqueById: GetById.Dynamic.RangedCombatTechnique
  },
): boolean =>
  minLevel === undefined &&
  dependencies.every(dep => !isGeneralDependency(dep) && !appliesToInstanceStrict(dep, instance)) &&
  // // Disable if style special ability is required for
  // // extended special abilities
  // TODO: isStyleSpecialAbilityRemovalDisabled(hero)(wiki_entry) ||
  getEntrySpecificIsRemovable(id, instances, instance, caps)

const getEntrySpecificMinimumLevel = (
  id: ActivatableIdentifier,
  caps: {
    activeSermonsCount: number
    activeVisionsCount: number
    activeSpellworksCount: number
  },
): number | undefined => {
  switch (id.tag) {
    case "Advantage":
      switch (id.advantage) {
        case AdvantageIdentifier.LargeSpellSelection:
          return ensure(caps.activeSpellworksCount - 3, x => x > 0)
        case AdvantageIdentifier.ManySermons:
          return ensure(caps.activeSermonsCount - 3, x => x > 0)
        case AdvantageIdentifier.ManyVisions:
          return ensure(caps.activeVisionsCount - 3, x => x > 0)
        default:
          return undefined
      }
    case "GeneralSpecialAbility":
      switch (id.general_special_ability) {
        case GeneralSpecialAbilityIdentifier.Literacy: {
          // TODO: return isEntryRequiringMatchingScriptAndLangActive &&
          //   scriptsWithMatchingLanguages.length < 2 &&
          //   toNewMaybe(AOWIA.sid(x))
          //     .bind(sid => newEnsure(sid, isNumber))
          //     .maybe(false, sid => scriptsWithMatchingLanguages.includes(sid))
          //   ? 3
          //   : undefined
          return undefined
        }
        case GeneralSpecialAbilityIdentifier.Language: {
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
      switch (id.magical_special_ability) {
        case MagicalSpecialAbilityIdentifier.Imitationszauberei:
          return caps.activeSpellworksCount
        default:
          return undefined
      }

    default:
      return undefined
  }
}

const getMinimumLevel = (
  id: ActivatableIdentifier,
  dependencies: ActivatableDependency[],
  instance: ActivatableInstance,
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

const getEntrySpecificCostOfInstance = (
  id: ActivatableIdentifier,
  apValue: AdventurePointsValue,
  instances: ActivatableInstance[],
  instance: ActivatableInstance,
  isEntryToAdd: boolean,
) => {
  switch (id.tag) {
    case "Disadvantage":
      switch (id.disadvantage) {
        case DisadvantageIdentifier.PersonalityFlaw: {
          const isPersonalityFlawNotPaid = (generalId: number, paidEntries: number) => {
            const instanceOption = instance.options?.[0]
            if (instanceOption === undefined) {
              return false
            }
            const optionId: GeneralIdentifier = { tag: "General", general: generalId }
            return (
              matchesOptionId(optionId, instanceOption) &&
              countOptions(instances, optionId, { ignoreWithCustomAdventurePointsValue: true }) >
                (isEntryToAdd ? paidEntries - 1 : paidEntries)
            )
          }

          if (
            // 7 = "Prejudice" => more than one entry possible
            // more than one entry of Prejudice does not contribute to AP spent
            isPersonalityFlawNotPaid(7, 1) ||
            // 8 = "Unworldly" => more than one entry possible
            // more than two entries of Unworldly do not contribute to AP spent
            isPersonalityFlawNotPaid(8, 2)
          ) {
            return 0
          }

          return undefined
        }

        case DisadvantageIdentifier.Principles:
        case DisadvantageIdentifier.Obligations: {
          if (count(instances, not(hasCustomAdventurePointsValue)) < 2) {
            return undefined
          }

          const highestLevel = instances.reduce<{ level: number; count: number }>(
            (acc, ins) =>
              ins.level === undefined || hasCustomAdventurePointsValue(ins)
                ? acc
                : ins.level > acc.level
                ? { level: ins.level, count: 1 }
                : ins.level === acc.level
                ? { level: acc.level, count: acc.count + 1 }
                : acc,
            { level: 0, count: 0 },
          )

          const singleHighestLevel = ensure(highestLevel, x => x.count === 1)?.level

          const secondHighestLevel =
            singleHighestLevel === undefined
              ? undefined
              : instances.reduce<number | undefined>(
                  (acc, ins) =>
                    ins.level === undefined || hasCustomAdventurePointsValue(ins)
                      ? acc
                      : acc === undefined || (ins.level > acc && ins.level < singleHighestLevel)
                      ? ins.level
                      : acc,
                  undefined,
                )

          if (instance.level === undefined || apValue.tag !== "Fixed") {
            return undefined
          }

          if (highestLevel.level > instance.level) {
            return 0
          }

          if (highestLevel.level === instance.level) {
            return singleHighestLevel === undefined || isEntryToAdd
              ? 0
              : secondHighestLevel === undefined
              ? instance.level * apValue.fixed
              : (instance.level - secondHighestLevel) * apValue.fixed
          }

          return isEntryToAdd ? (instance.level - highestLevel.level) * apValue.fixed : 0
        }

        case DisadvantageIdentifier.BadHabit: {
          // more than three entries cannot contribute to AP spent; entries with
          // custom cost are ignored for the rule's effect
          return count(instances, not(hasCustomAdventurePointsValue)) > (isEntryToAdd ? 2 : 3)
            ? 0
            : undefined
        }

        default:
          return undefined
      }

    // TODO: case SpecialAbilityId.SkillSpecialization: {
    //   return pipe_ (
    //     mcurrent_sid,
    //     misStringM,
    //     bindF (
    //       current_sid =>
    //         fmapF (lookup (current_sid)
    //                       (StaticData.A.skills (wiki)))
    //               (skill =>

    //                 // Multiply number of final occurences of the
    //                 // same skill...
    //                 (countWith ((e: Record<ActiveObject>) =>
    //                             pipe (
    //                                    ActiveObject.AL.sid,
    //                                    elem<string | number> (current_sid)
    //                                  )
    //                                  (e)

    //                             // Entries with custom cost are ignored for the rule
    //                             && isNothing (ActiveObject.AL.cost (e)))
    //                           (all_active) + (isEntryToAdd ? 1 : 0))

    //                 // ...with the skill's IC
    //                 * getAPForActivatation (Skill.AL.ic (skill)))
    //     )
    //   )
    // }

    // TODO: case SpecialAbilityId.Language: {
    //   // Native Tongue (level 4) does not cost anything
    //   return elem (4) (mcurrent_level) ? Nothing : mcurrent_cost
    // }

    // TODO: case SpecialAbilityId.PropertyKnowledge:
    // case SpecialAbilityId.AspectKnowledge: {
    //   // Does not include custom cost activations in terms of calculated cost
    //   const amount = countWith (pipe (ActiveObject.AL.cost, isNothing))
    //                            (all_active)

    //   const index = amount + (isEntryToAdd ? 0 : -1)

    //   if (isNothing (mcurrent_cost)) {
    //     return Nothing
    //   }

    //   const current_cost = fromJust (mcurrent_cost)

    //   return isList (current_cost) ? subscript (current_cost) (index) : Nothing
    // }

    // TODO: case SpecialAbilityId.TraditionWitches: {
    //   // There are two disadvantages that, when active, decrease the cost of
    //   // this tradition by 10 AP each
    //   const decreaseCost = (id: string) => (cost: number) =>
    //     isDisadvantageActive (id) (hero) ? cost - 10 : cost

    //   return pipe_ (
    //     mcurrent_cost,
    //     misNumberM,
    //     fmap (pipe (
    //       decreaseCost (DisadvantageId.NoFlyingBalm),
    //       decreaseCost (DisadvantageId.NoFamiliar)
    //     ))
    //   )
    // }

    // TODO: case SpecialAbilityId.Recherchegespuer: {
    //   // The AP cost for this SA consist of two parts: AP based on the IC of
    //   // the main subject (from "SA_531"/Wissensdurst) in addition to AP based
    //   // on the IC of the side subject selected in this SA.

    //   const mhero_entry_SA_531 = lookup<string> (SpecialAbilityId.Wissensdurst)
    //                                             (HA.specialAbilities (hero))

    //   if (isNothing (mhero_entry_SA_531)) {
    //     return Nothing
    //   }

    //   if (isNothing (mcurrent_cost) || isNothing (mcurrent_cost)) {
    //     return Nothing
    //   }

    //   const current_cost = fromJust (mcurrent_cost)

    //   if (isNumber (current_cost)) {
    //     return Nothing
    //   }

    //   const hero_entry_SA_531 = fromJust (mhero_entry_SA_531)

    //   const getCostFromHeroEntry =
    //     pipe (
    //       ActiveObject.AL.sid,
    //       misStringM,
    //       bindF (lookupF (StaticData.A.skills (wiki))),
    //       bindF (pipe (Skill.A.ic, icToIx, subscript (current_cost)))
    //     )

    //   return liftM2 (add)
    //                 (getCostFromHeroEntry (entry))
    //                 (pipe_ (
    //                   hero_entry_SA_531,
    //                   ActivatableDependent.A.active,
    //                   listToMaybe,
    //                   bindF (getCostFromHeroEntry)
    //                 ))
    // }
    default:
      return undefined
  }
}

/**
 * Returns the cost for a single activation of an activatable.
 */
export const getCostOfInstance = (
  id: ActivatableIdentifier,
  apValue: AdventurePointsValue,
  instances: ActivatableInstance[],
  instance: ActivatableInstance,
  getSelectOptionById: (id: SelectOptionIdentifier) => ResolvedSelectOption | undefined,
  isToAdd: boolean,
): number | undefined => {
  if (instance.customAdventurePointsValue !== undefined) {
    return instance.customAdventurePointsValue
  }

  const entrySpecific = getEntrySpecificCostOfInstance(id, apValue, instances, instance, isToAdd)

  if (entrySpecific !== undefined) {
    return entrySpecific
  }

  switch (apValue.tag) {
    case "Fixed":
      return apValue.fixed * (instance.level ?? 1)
    case "ByLevel":
      return instance.level === undefined ? undefined : apValue.by_level[instance.level - 1]
    case "DerivedFromSelection": {
      const selectedOptions =
        instance.options
          ?.filter(isPredefinedActivatableOption)
          .map(opt => getSelectOptionById(opt.id)?.ap_value) ?? []
      return selectedOptions.some(isNotNullish)
        ? sumWith(selectedOptions, opt => opt ?? 0)
        : undefined
    }
    case "Indefinite":
      return 0
    default:
      assertExhaustive(apValue)
  }
}

const getEntrySpecificTotalCostDifference = (
  id: ActivatableIdentifier,
  apValue: AdventurePointsValue,
  instances: ActivatableInstance[],
  getSelectOptionById: (id: SelectOptionIdentifier) => ResolvedSelectOption | undefined,
) => {
  switch (id.tag) {
    case "Disadvantage":
      switch (id.disadvantage) {
        case DisadvantageIdentifier.PersonalityFlaw: {
          const getPersonalityFlawNotPaidDifference = (generalId: number, paidEntries: number) => {
            const optionId = createIdentifierObject("General", generalId)
            return countOptions(instances, optionId, {
              ignoreWithCustomAdventurePointsValue: true,
            }) > paidEntries
              ? (getSelectOptionById(optionId)?.ap_value ?? 0) * paidEntries
              : 0
          }

          return sum([
            // 7 = "Prejudice" => more than one entry possible
            // more than one entry of Prejudice does not contribute to AP spent
            getPersonalityFlawNotPaidDifference(7, 1),
            // 8 = "Unworldly" => more than one entry possible
            // more than two entries of Unworldly do not contribute to AP spent
            getPersonalityFlawNotPaidDifference(8, 2),
          ])
        }

        case DisadvantageIdentifier.Principles:
        case DisadvantageIdentifier.Obligations: {
          if (count(instances, not(hasCustomAdventurePointsValue)) < 2 || apValue.tag !== "Fixed") {
            return 0
          }

          const highestLevel = instances.reduce<{ level: number; count: number }>(
            (acc, ins) =>
              ins.level === undefined || hasCustomAdventurePointsValue(ins)
                ? acc
                : ins.level > acc.level
                ? { level: ins.level, count: 1 }
                : ins.level === acc.level
                ? { level: acc.level, count: acc.count + 1 }
                : acc,
            { level: 0, count: 0 },
          )

          const singleHighestLevel = ensure(highestLevel, x => x.count === 1)?.level

          if (singleHighestLevel === undefined) {
            return highestLevel.level * apValue.fixed
          }

          const secondHighestLevel = instances.reduce<number | undefined>(
            (acc, ins) =>
              ins.level === undefined || hasCustomAdventurePointsValue(ins)
                ? acc
                : acc === undefined || (ins.level > acc && ins.level < singleHighestLevel)
                ? ins.level
                : acc,
            undefined,
          )

          return (secondHighestLevel ?? 0) * apValue.fixed
        }

        case DisadvantageIdentifier.BadHabit: {
          // more than three entries cannot contribute to AP spent; entries with
          // custom cost are ignored for the rule's effect
          return count(instances, not(hasCustomAdventurePointsValue)) > 3 && apValue.tag === "Fixed"
            ? apValue.fixed * 3
            : 0
        }

        default:
          return 0
      }

    // TODO: case SpecialAbilityId.SkillSpecialization: {
    //   return pipe_ (
    //     mcurrent_sid,
    //     misStringM,
    //     bindF (
    //       current_sid =>
    //         fmapF (lookup (current_sid)
    //                       (StaticData.A.skills (wiki)))
    //               (skill =>

    //                 // Multiply number of final occurences of the
    //                 // same skill...
    //                 (countWith ((e: Record<ActiveObject>) =>
    //                             pipe (
    //                                    ActiveObject.AL.sid,
    //                                    elem<string | number> (current_sid)
    //                                  )
    //                                  (e)

    //                             // Entries with custom cost are ignored for the rule
    //                             && isNothing (ActiveObject.AL.cost (e)))
    //                           (all_active) + (isEntryToAdd ? 1 : 0))

    //                 // ...with the skill's IC
    //                 * getAPForActivatation (Skill.AL.ic (skill)))
    //     )
    //   )
    // }

    // TODO: case SpecialAbilityId.Language: {
    //   // Native Tongue (level 4) does not cost anything
    //   return elem (4) (mcurrent_level) ? Nothing : mcurrent_cost
    // }

    // TODO: case SpecialAbilityId.PropertyKnowledge:
    // case SpecialAbilityId.AspectKnowledge: {
    //   // Does not include custom cost activations in terms of calculated cost
    //   const amount = countWith (pipe (ActiveObject.AL.cost, isNothing))
    //                            (all_active)

    //   const index = amount + (isEntryToAdd ? 0 : -1)

    //   if (isNothing (mcurrent_cost)) {
    //     return Nothing
    //   }

    //   const current_cost = fromJust (mcurrent_cost)

    //   return isList (current_cost) ? subscript (current_cost) (index) : Nothing
    // }

    // TODO: case SpecialAbilityId.TraditionWitches: {
    //   // There are two disadvantages that, when active, decrease the cost of
    //   // this tradition by 10 AP each
    //   const decreaseCost = (id: string) => (cost: number) =>
    //     isDisadvantageActive (id) (hero) ? cost - 10 : cost

    //   return pipe_ (
    //     mcurrent_cost,
    //     misNumberM,
    //     fmap (pipe (
    //       decreaseCost (DisadvantageId.NoFlyingBalm),
    //       decreaseCost (DisadvantageId.NoFamiliar)
    //     ))
    //   )
    // }

    // TODO: case SpecialAbilityId.Recherchegespuer: {
    //   // The AP cost for this SA consist of two parts: AP based on the IC of
    //   // the main subject (from "SA_531"/Wissensdurst) in addition to AP based
    //   // on the IC of the side subject selected in this SA.

    //   const mhero_entry_SA_531 = lookup<string> (SpecialAbilityId.Wissensdurst)
    //                                             (HA.specialAbilities (hero))

    //   if (isNothing (mhero_entry_SA_531)) {
    //     return Nothing
    //   }

    //   if (isNothing (mcurrent_cost) || isNothing (mcurrent_cost)) {
    //     return Nothing
    //   }

    //   const current_cost = fromJust (mcurrent_cost)

    //   if (isNumber (current_cost)) {
    //     return Nothing
    //   }

    //   const hero_entry_SA_531 = fromJust (mhero_entry_SA_531)

    //   const getCostFromHeroEntry =
    //     pipe (
    //       ActiveObject.AL.sid,
    //       misStringM,
    //       bindF (lookupF (StaticData.A.skills (wiki))),
    //       bindF (pipe (Skill.A.ic, icToIx, subscript (current_cost)))
    //     )

    //   return liftM2 (add)
    //                 (getCostFromHeroEntry (entry))
    //                 (pipe_ (
    //                   hero_entry_SA_531,
    //                   ActivatableDependent.A.active,
    //                   listToMaybe,
    //                   bindF (getCostFromHeroEntry)
    //                 ))
    // }
    default:
      return 0
  }
}

/**
 * Returns the cost for all activations of an activatable.
 */
export const getCost = (
  id: ActivatableIdentifier,
  apValue: AdventurePointsValue,
  instances: ActivatableInstance[],
  getSelectOptionById: (id: SelectOptionIdentifier) => ResolvedSelectOption | undefined,
): { total: number; diff: number; range: RangeBounds; values: number[] } => {
  const values = instances.map(
    instance =>
      getCostOfInstance(id, apValue, instances, instance, getSelectOptionById, false) ?? 0,
  )

  const diff = getEntrySpecificTotalCostDifference(id, apValue, instances, getSelectOptionById)

  return {
    total: sum(values) + diff,
    diff,
    range: [Math.min(...values), Math.max(...values)],
    values,
  }
}

const combineChunks = (
  a: ActivatableNameChunk,
  b: ActivatableNameChunk,
  join: (a: string, b: string) => string,
): ActivatableNameChunk => {
  if (typeof a === "string") {
    if (typeof b === "string") {
      return join(a, b)
    } else if (typeof b === "function") {
      return fs => join(a, b(fs))
    } else if (typeof b === "object") {
      return mapObject(b, bValue => join(a, bValue))
    }
    return b
  } else if (typeof a === "function") {
    if (typeof b === "string") {
      return fs => join(a(fs), b)
    } else if (typeof b === "function") {
      return fs => join(a(fs), b(fs))
    } else if (typeof b === "object") {
      return fs => join(a(fs), fs.translateMap(b) ?? "???")
    }
    return b
  } else if (typeof a === "object") {
    if (typeof b === "string") {
      return mapObject(a, aValue => join(aValue, b))
    } else if (typeof b === "function") {
      return fs => join(fs.translateMap(a) ?? "???", b(fs))
    } else if (typeof b === "object") {
      const ret: LocaleMap<string> = {}
      for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
        ret[key] = join(a[key] ?? "???", b[key] ?? "???")
      }
      return ret
    }
    return b
  }
  return a
}

const mapChunk = (
  chunk: ActivatableNameChunk,
  map: (str: string) => string,
): ActivatableNameChunk => {
  if (typeof chunk === "string") {
    return map(chunk)
  } else if (typeof chunk === "function") {
    return fs => map(chunk(fs))
  } else if (typeof chunk === "object") {
    return mapObject(chunk, chunkValue => map(chunkValue))
  }
  return chunk
}

const zipChunks = (
  chunks: (ActivatableNameChunk | [ActivatableNameChunk, ActivatableNameChunk])[],
): ActivatableNameChunk => {
  const withNormalizedPairs = chunks.map(chunk => {
    if (Array.isArray(chunk)) {
      return combineChunks(chunk[0], chunk[1], (a, b) => `${a}: ${b}`)
    }

    return chunk
  })

  return withNormalizedPairs.reduce(
    (acc, chunk) => (acc === "" ? chunk : combineChunks(acc, chunk, (a, b) => `${a}, ${b}`)),
    "",
  )
}

const combineBaseName = (
  base: ActivatableNameChunk,
  level: number | undefined,
  options: ActivatableNameComponents["options"],
  config: { levelPlacement?: "before" | "after"; useParenthesis?: boolean } = {},
): Pick<ActivatableNameComponents, "full" | "fullWithoutLevel"> => {
  const { levelPlacement = "after", useParenthesis = true } = config
  const appendLevel: (str: string) => string =
    level === undefined ? x => x : x => `${x} ${romanize(level)}`

  const wrapParens = (str: string) => `(${str})`

  const appendOptions = useParenthesis
    ? (baseStr: string, optionsStr: string) =>
        optionsStr === "" ? baseStr : `${baseStr} ${wrapParens(optionsStr)}`
    : (baseStr: string, optionsStr: string) =>
        optionsStr === "" ? baseStr : `${baseStr} ${optionsStr}`

  const full = combineChunks(
    base,
    zipChunks(options),
    (() => {
      switch (levelPlacement) {
        case "before":
          return (a, b) => appendOptions(appendLevel(a), b)
        case "after":
          return (a, b) => appendLevel(appendOptions(a, b))
        default:
          return assertExhaustive(levelPlacement)
      }
    })(),
  )

  switch (levelPlacement) {
    case "before":
      return { full, fullWithoutLevel: [base, mapChunk(zipChunks(options), wrapParens)] }
    case "after":
      return { full, fullWithoutLevel: combineChunks(base, zipChunks(options), appendOptions) }
    default:
      return assertExhaustive(levelPlacement)
  }
}

const getEntrySpecificFullName = (
  id: ActivatableIdentifier,
  base: ActivatableNameChunk,
  level: number | undefined,
  options: ActivatableNameComponents["options"],
): Pick<ActivatableNameComponents, "full" | "fullWithoutLevel"> | undefined => {
  switch (id.tag) {
    case "Advantage":
      switch (id.advantage) {
        case AdvantageIdentifier.HatredOf: {
          const [firstOption, ...rest] = options
          if (firstOption === undefined || Array.isArray(firstOption)) {
            return undefined
          }
          return combineBaseName(
            combineChunks(base, firstOption, (a, b) => `${a} ${b}`),
            level,
            rest,
          )
        }
        case AdvantageIdentifier.ImmunityToPoison:
        case AdvantageIdentifier.ImmunityToDisease:
          return combineBaseName(base, level, options, { useParenthesis: false })
        default:
          return undefined
      }
    case "Disadvantage":
      switch (id.disadvantage) {
        case DisadvantageIdentifier.PersonalityFlaw: {
          const [selection, optionalText, ...rest] = options
          if (selection === undefined || Array.isArray(selection) || Array.isArray(optionalText)) {
            return undefined
          }
          return combineBaseName(base, level, [
            optionalText === undefined ? selection : [selection, optionalText],
            ...rest,
          ])
        }
        case DisadvantageIdentifier.AfraidOf:
          return combineBaseName(base, level, options, { useParenthesis: false })
        case DisadvantageIdentifier.Principles:
        case DisadvantageIdentifier.Obligations:
          return combineBaseName(base, level, options, { levelPlacement: "before" })
        default:
          return undefined
      }
    case "GeneralSpecialAbility":
      switch (id.general_special_ability) {
        //   TODO: case SpecialAbilityId.SkillSpecialization:
        //     return pipe (
        //                   AOWIA.sid,
        //                   misStringM,
        //                   bindF (lookupF (SDA.skills (staticData))),
        //                   bindF (skill => pipe (
        //                                     AOWIA.sid2,
        //                                     // If input string use input
        //                                     misStringM,
        //                                     // Otherwise lookup application name
        //                                     altF_ (() => pipe (
        //                                                         SA.applications,
        //                                                         find<Record<Application>> (pipe (
        //                                                           Application.AL.id,
        //                                                           elemF (AOWIA.sid2 (hero_entry))
        //                                                         )),
        //                                                         fmap (AA.name)
        //                                                       )
        //                                                       (skill)),
        //                                     // Merge skill name and application name
        //                                     fmap (appl => `${SA.name (skill)}: ${appl}`)
        //                                   )
        //                                   (hero_entry))
        //                 )
        //                 (hero_entry)
        default:
          return undefined
      }
    // switch (AOWIA.id (hero_entry)) {
    //   TODO: case SpecialAbilityId.Exorzist:
    //     return pipe_ (
    //       hero_entry,
    //       AOWIA.tier,
    //       Maybe.product,
    //       ensure (equals (1)),
    //       thenF (AOWIA.sid (hero_entry)),
    //       findSelectOption (wiki_entry),
    //       fmap (SOA.name)
    //     )
    //   TODO: case SpecialAbilityId.SpellEnhancement:
    //   case SpecialAbilityId.ChantEnhancement:
    //     return pipe (
    //                   AOWIA.sid,
    //                   findSelectOption (wiki_entry),
    //                   bindF (ext => pipe (
    //                                        bindF ((target_id: string) => {
    //                                          const acc =
    //                                            AOWIA.id (hero_entry)
    //                                            === SpecialAbilityId.SpellEnhancement
    //                                              ? SDA.spells
    //                                              : SDA.liturgicalChants
    //                                          return lookupF<string, ActivatableSkillEntry>
    //                                            (acc (staticData))
    //                                            (target_id)
    //                                        }),
    //                                        fmap (
    //                                          (target_entry: ActivatableSkillEntry) =>
    //                                            `${SAL.name (target_entry)}: ${SOA.name (ext)}`
    //                                        )
    //                                      )
    //                                      (SOA.target (ext)))
    //                 )
    //                 (hero_entry)
    //   TODO: case SpecialAbilityId.TraditionSavant:
    //     return pipe (
    //                   AOWIA.sid,
    //                   misStringM,
    //                   bindF (lookupF (SDA.skills (staticData))),
    //                   fmap (SA.name)
    //                 )
    //                 (hero_entry)
    //   TODO: case SpecialAbilityId.LanguageSpecializations:
    //     return pipe (
    //                   SDA.specialAbilities,
    //                   lookup<string> (SpecialAbilityId.Language),
    //                   bindF (pipe (
    //                     findSelectOption,
    //                     thrush (AOWIA.sid (hero_entry))
    //                   )),
    //                   bindF (lang => pipe (
    //                                         AOWIA.sid2,
    //                                         bindF (
    //                                           ifElse<string | number, string>
    //                                             (isString)
    //                                             <Maybe<string>>
    //                                             (Just)
    //                                             (spec_id => bind (SOA.specializations (lang))
    //                                                              (subscriptF (spec_id - 1)))
    //                                         ),
    //                                         fmap (spec => `${SOA.name (lang)}: ${spec}`)
    //                                       )
    //                                       (hero_entry))
    //                 )
    //                 (staticData)
    //   TODO: case SpecialAbilityId.Fachwissen: {
    //     const getApp = (getSid: (r: Record<ActiveObjectWithId>) => Maybe<string | number>) =>
    //                      pipe (
    //                        SA.applications,
    //                        filter (pipe (AA.prerequisite, isNothing)),
    //                        find (pipe (AA.id, elemF (getSid (hero_entry)))),
    //                        fmap (AA.name)
    //                      )
    //     return pipe_ (
    //       hero_entry,
    //       AOWIA.sid,
    //       misStringM,
    //       bindF (lookupF (SDA.skills (staticData))),
    //       bindF (skill => pipe_ (
    //                         List (
    //                           getApp (AOWIA.sid2) (skill),
    //                           getApp (AOWIA.sid3) (skill)
    //                         ),
    //                         catMaybes,
    //                         ensure (xs => flength (xs) === 2),
    //                         fmap (pipe (
    //                           sortStrings (staticData),
    //                           formatList ("conjunction") (staticData),
    //                           apps => `${SA.name (skill)}: ${apps}`
    //                         ))
    //                       ))
    //     )
    //   }
    //   TODO: case SpecialAbilityId.GebieterDesAspekts:
    //     return maybeMap (name_add => `${AAL.name (wiki_entry)} ${name_add}`)
    //   TODO: case SpecialAbilityId.TraditionArcaneBard:
    //   case SpecialAbilityId.TraditionArcaneDancer:
    //   case SpecialAbilityId.TraditionSavant: {
    //     return maybeMap (flip (addSndinParenthesis) (AAL.name (wiki_entry)))
    //   }
    // }
    default:
      return undefined
  }
}

const getNameComponents = <T>(
  id: ActivatableIdentifier,
  instance: ActivatableInstance,
  translations: LocaleMap<T>,
  getBaseName: (translation: T) => string,
  getSelectOptionById: (id: SelectOptionIdentifier) => ResolvedSelectOption | undefined,
  displayedInProfession: boolean,
): ActivatableNameComponents => {
  const base = mapObject(translations, getBaseName)
  const { level } = instance
  const options: ActivatableNameComponents["options"] =
    instance.options?.map(opt => {
      switch (opt.type) {
        case "Predefined": {
          const optTranslations = getSelectOptionById(opt.id)?.translations
          return optTranslations === undefined
            ? "???"
            : mapObject(optTranslations, t10n =>
                displayedInProfession ? t10n.name_in_profession ?? t10n.name : t10n.name,
              ) ?? "???"
        }
        case "Custom":
          return opt.value
        default:
          return assertExhaustive(opt)
      }
    }) ?? []

  return {
    ...(getEntrySpecificFullName(id, base, level, options) ??
      combineBaseName(base, level, options)),
    base,
    options,
  }
}

/**
 * Converts a name chunk to a displayable string.
 */
export const nameChunkToString = (
  chunk: ActivatableNameChunk,
  translate: Translate,
  translateMap: TranslateMap,
): string => {
  if (typeof chunk === "string") {
    return chunk
  } else if (typeof chunk === "function") {
    return chunk({ translate, translateMap })
  } else if (typeof chunk === "object") {
    return translateMap(chunk) ?? "???"
  }
  return chunk
}

/**
 * Returns all activatable entries with their corresponding dynamic entry,
 * extended by which activation/instance of the entry it represents.
 */
export const getActiveActivatables = <
  T extends {
    id: number
    levels?: number
    prerequisites?: P[]
    ap_value: AdventurePointsValue
    translations: LocaleMap<T10n>
  },
  P = T extends { prerequisites?: (infer P1)[] } ? P1 : never,
  T10n = T extends { translations: LocaleMap<infer T10n1> } ? T10n1 : never,
>(
  getStaticActivatableById: (id: number) => T | undefined,
  dynamicActivatables: Activatable[],
  checkPrerequisites: (prerequisites: P[], level: number, id: number) => boolean,
  getSelectOptionsById: (id: ActivatableIdentifier) => ResolvedSelectOption[] | undefined,
  createActivatableIdentifierObject: (id: number) => ActivatableIdentifier,
  filterApplyingDependencies: FilterApplyingActivatableDependencies,
  getBaseName: (translation: T10n) => string,
  caps: {
    startExperienceLevel?: ExperienceLevel
    activeSermonsCount: number
    activeVisionsCount: number
    activeCantripsCount: number
    activeSpellworksCount: number
    activeMagicalActionsCount: number
    activeBlessingsCount: number
    activeLiturgicalChantsCount: number
    activeCeremoniesCount: number
    getDynamicSkillById: GetById.Dynamic.Skill
    getDynamicLiturgicalChantById: GetById.Dynamic.LiturgicalChant
    getDynamicCeremonyById: GetById.Dynamic.Ceremony
    getDynamicSpellById: GetById.Dynamic.Spell
    getDynamicRitualById: GetById.Dynamic.Ritual
    getDynamicCloseCombatTechniqueById: GetById.Dynamic.CloseCombatTechnique
    getDynamicRangedCombatTechniqueById: GetById.Dynamic.RangedCombatTechnique
  },
): DisplayedActiveActivatable<T>[] => {
  const getSelectOptionById = (idObject: ActivatableIdentifier, optionId: SelectOptionIdentifier) =>
    getSelectOptionsById(idObject)?.find(opt => equalsIdentifier(opt.id, optionId))

  return dynamicActivatables.flatMap(dynamicActivatable => {
    const staticActivatable = getStaticActivatableById(dynamicActivatable.id)

    if (staticActivatable === undefined) {
      return []
    }

    const idObject = createActivatableIdentifierObject(staticActivatable.id)
    const dependencies =
      dynamicActivatable === undefined
        ? []
        : filterApplyingDependencies(dynamicActivatable.dependencies).filter(
            dep =>
              dep.active === false ||
              count(dynamicActivatable.instances, instance =>
                appliesToInstanceStrict(dep, instance),
              ) < 2,
          )

    const {
      total: totalCost,
      range: costRange,
      diff: totalCostDiff,
      values,
    } = getCost(idObject, staticActivatable.ap_value, dynamicActivatable.instances, optionId =>
      getSelectOptionById(idObject, optionId),
    )

    return dynamicActivatable.instances.map(
      (instance, instanceIndex): DisplayedActiveActivatable<T> => {
        const minLevel = getMinimumLevel(idObject, dependencies, instance, caps)
        const maxLevel = getMaximumLevel(
          idObject,
          staticActivatable.levels,
          {},
          dependencies,
          level =>
            checkPrerequisites(staticActivatable.prerequisites ?? [], level, staticActivatable.id),
          caps,
        )

        const isRemovable = getIsRemovable(
          idObject,
          minLevel,
          dependencies,
          dynamicActivatable.instances,
          instance,
          caps,
        )

        return {
          static: staticActivatable,
          dynamic: dynamicActivatable,
          instanceIndex,
          isRemovable,
          minLevel,
          maxLevel,
          cost:
            totalCostDiff !== 0 && !hasCustomAdventurePointsValue(instance)
              ? {
                  kind: "variable",
                  instancesTotal: totalCost,
                  differenceOnRemove: values[instanceIndex] ?? 0,
                  range: costRange,
                }
              : {
                  kind: "fix",
                  fix: values[instanceIndex] ?? 0,
                },
          name: getNameComponents(
            idObject,
            instance,
            staticActivatable.translations,
            getBaseName,
            optionId => getSelectOptionById(idObject, optionId),
            false,
          ),
        }
      },
    )
  })
}
