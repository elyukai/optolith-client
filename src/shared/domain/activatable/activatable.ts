import { partition } from "@elyukai/utils/array/groups"
import { ensureNonEmpty, isEmpty, isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { count, countBy, sum, sumWith } from "@elyukai/utils/array/reductions"
import { deepEqual } from "@elyukai/utils/equality"
import { isNotNullish } from "@elyukai/utils/nullable"
import { range, type RangeBounds } from "@elyukai/utils/range"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import {
  getAdventurePointsDependingOnActiveForInactiveActivatableInstance,
  getAdventurePointsDependingOnActiveInstancesForInactiveActivatableInstance,
  getAdventurePointsForActiveActivatableInstances,
} from "@optolith/adventure-points/activatable"
import type {
  Activatable as RawActivatable,
  ActivatableInstance as RawActivatableInstance,
} from "@optolith/character-schema/types"
import type {
  ResolvedSelectOption,
  ResolvedSelectOptionIdentifier,
  ResolvedSkillApplicationIdentifier,
} from "@optolith/database-schema/cache"
import type {
  ActivatableIdentifier,
  AdvantageDisadvantagePrerequisites,
  AdventurePointsValueByLevel,
  EntityMap,
  FixedAdventurePointsValue,
  GeneralPrerequisites,
  PrerequisitesForLevels,
  RulePrerequisite,
  SelectOptionRules,
  SpecialAbilityIdentifier,
} from "@optolith/database-schema/gen"
import {
  getNameComponents,
  renderActivatableNameComponents,
  renderActivatableNameComponentsWithoutLevel,
} from "@optolith/entity-descriptions/entities/partial/activatableNameChunks"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { action, computed, observable, toJS } from "mobx"
import type { Global } from "../../global.ts"
import type { LocaleMap } from "../../utils/locale.ts"
import {
  addAdventurePointsCaches,
  AdventurePointsCache,
  emptyAdventurePointsCache,
} from "../adventurePoints/cache.ts"
import type { BaseCharacter } from "../character.ts"
import { Case, equalsCase, fromUniformCase } from "../databaseEnum.ts"
import {
  registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies,
  registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
} from "../dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { addOrRemoveDependency, RegistrationMethod } from "../dependencies/registrationHelpers.ts"
import { checkMultipleDisjunctionPartsAreValid } from "../prerequisites/disjunctionPrerequisiteMultipartValidation.ts"
import {
  checkPreconditions,
  checkPrerequisitesOfAdvantageOrDisadvantage,
  checkPrerequisitesOfGeneralEntryWithLevels,
} from "../prerequisites/fullPrerequisiteValidationForType.ts"
import type {
  ActivatableNameComponentsWithFull,
  DisplayedActiveActivatableCost,
} from "./activatableActive.ts"
import {
  appliesToInstanceStrict,
  isGeneralDependency,
  type ActivatableDependency,
} from "./activatableDependency.ts"
import {
  getMaxLevelByPrerequisites,
  hasGeneralProhibitingDependency,
  type DisplayedInactiveActivatableOption,
} from "./activatableInactive.ts"
import {
  isAdvancedSpecialAbilityEntityName,
  type AdvancedSpecialAbilityEntityName,
} from "./specialAbilities.ts"

/**
 * Bound adventure points are granted by the GM and can only be spent on the
 * entry. They don’t affect the costs of  buying the activatable entry. They may
 * specify for which configuration of  an entry they count, just like a
 * prerequisite.
 */
export type BoundAdventurePointsForActivatable = {
  /**
   * The granted adventure points.
   */
  adventurePoints: number

  /**
   * The level for which the adventure points have been granted.
   */
  level?: number

  /**
   * The set of options for which the adventure points have been granted.
   */
  options?: ActivatableOption[]
}

/**
 * A single activation of an activatable entry.
 */
export class CharacterActivatableInstance {
  /**
   * One or multiple options for the activatable. The meaning depends on the activatable.
   */
  @observable accessor options: ActivatableOption[] | undefined

  /**
   * The instance level (if the activatable has levels).
   */
  @observable accessor level: number | undefined

  /**
   * If provided, a custom adventure points value has been set for this instance.
   */
  @observable accessor customAdventurePointsValue: number | undefined

  /**
   * A list of used bound adventure points for this instance.
   */
  @observable accessor usedBoundAdventurePoints: BoundAdventurePointsForActivatable[]

  readonly parent: CharacterActivatable<ActivatableIdentifier["kind"]>

  constructor(
    instance: SerializedActivatableInstance,
    parent: CharacterActivatable<ActivatableIdentifier["kind"]>,
  ) {
    this.parent = parent
    this.options = instance.options
    this.level = instance.level
    this.customAdventurePointsValue = instance.customAdventurePointsValue
    this.usedBoundAdventurePoints = instance.usedBoundAdventurePoints ?? []
  }

  @computed
  get adventurePoints(): DisplayedActiveActivatableCost {
    const isAutomatic = false // TODO

    if (this.hasCustomAdventurePointsValue()) {
      return { type: "Fixed", isAutomatic, value: this.customAdventurePointsValue }
    }

    const apValue = this.parent.preparedActiveAdventurePointsValue

    switch (apValue.kind) {
      case "Fixed":
        return { type: "Fixed", isAutomatic, value: apValue.Fixed * (this.level ?? 1) }
      case "ByLevel":
        return {
          type: "Fixed",
          isAutomatic,
          value: this.level === undefined ? 0 : (apValue.ByLevel.list[this.level - 1] ?? 0),
        }
      case "DerivedFromSelection": {
        const selectedOptions =
          this.options
            ?.filter(isPredefinedActivatableOption)
            .map(opt => this.parent.getSelectOptionById(opt.id)?.content.ap_value) ?? []

        return {
          type: "Fixed",
          isAutomatic,
          value: selectedOptions.some(isNotNullish)
            ? sumWith(selectedOptions, opt => opt?.Fixed ?? 0)
            : 0,
        }
      }
      case "Range":
        return { type: "Range", isAutomatic, ...apValue.Range }
      default:
        return assertExhaustive(apValue)
    }
  }

  toJSON(): RawActivatableInstance {
    return {
      options: toJS(this.options),
      level: this.level,
      customAdventurePointsValue: this.customAdventurePointsValue,
    }
  }

  toSerialized(): SerializedActivatableInstance {
    return {
      options: toJS(this.options),
      level: this.level,
      customAdventurePointsValue: this.customAdventurePointsValue,
      usedBoundAdventurePoints: toJS(this.usedBoundAdventurePoints),
    }
  }

  hasCustomAdventurePointsValue(): this is CharacterActivatableInstance & {
    customAdventurePointsValue: number
  } {
    return this.customAdventurePointsValue !== undefined
  }

  getEntrySpecificMinimumLevel(): number | undefined {
    switch (this.parent.entityName) {
      case "Advantage":
        switch (this.parent.id) {
          case "AdvantageIdentifier.LargeSpellSelection":
            return undefined // TODO ensure(caps.activeSpellworksCount - 3, x => x > 0)
          case "AdvantageIdentifier.ManySermons":
            return undefined // TODO ensure(caps.activeSermonsCount - 3, x => x > 0)
          case "AdvantageIdentifier.ManyVisions":
            return undefined // TODO ensure(caps.activeVisionsCount - 3, x => x > 0)
          default:
            return undefined
        }
      case "GeneralSpecialAbility":
        switch (this.parent.id) {
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
        switch (this.parent.id) {
          case "MagicalSpecialAbilityIdentifier.Imitationszauberei":
            return undefined // TODO caps.activeSpellworksCount
          default:
            return undefined
        }

      default:
        return undefined
    }
  }

  @computed
  get minimumLevel(): number | undefined {
    return this.parent.applyingDependencies.reduce<number | undefined>(
      (acc, dep) =>
        dep.active === true && dep.level !== undefined && appliesToInstanceStrict(dep, this)
          ? acc === undefined
            ? dep.level
            : Math.max(acc, dep.level)
          : acc,
      this.getEntrySpecificMinimumLevel(),
    )
  }

  getEntrySpecificIsRemovable(): boolean {
    const { entityName, id } = this.parent
    const taggedId = Case(entityName, id)

    if (equalsCase(taggedId, this.parent.global.settings.skills.maximumSkillRatingBonusEntry)) {
      if (this.parent.character.experienceLevel.start === undefined) {
        return true
      }

      const skillId = this.options?.[0]?.type === "Predefined" ? this.options[0].id : undefined

      if (skillId === undefined) {
        return true
      }

      const value = (() => {
        switch (skillId.kind) {
          case "Skill":
            return this.parent.character.getRatingById(skillId)
          case "Spell":
          case "Ritual":
          case "LiturgicalChant":
          case "Ceremony":
            return this.parent.character.getActivatableRatingById(skillId)
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
          case "NewSkillApplication":
          case "Region":
          case "SkillGroup":
            return undefined
          default:
            return assertExhaustive(skillId)
        }
      })()

      if (value === undefined) {
        return true
      }

      const activations = this.parent.countOptions(skillId)
      return value < this.parent.character.experienceLevel.start.max_skill_rating + activations
    } else if (
      equalsCase(
        taggedId,
        this.parent.global.settings.combatTechniques.maximumCombatTechniqueRatingBonusEntry,
      )
    ) {
      if (this.parent.character.experienceLevel.start === undefined) {
        return true
      }

      const ctId = this.options?.[0]?.type === "Predefined" ? this.options[0].id : undefined

      if (ctId === undefined) {
        return true
      }

      const value = (() => {
        switch (ctId.kind) {
          case "CloseCombatTechnique":
          case "RangedCombatTechnique":
            return this.parent.character.getRatingById(ctId)
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
          case "NewSkillApplication":
          case "Region":
          case "SkillGroup":
            return undefined
          default:
            return assertExhaustive(ctId)
        }
      })()

      if (value === undefined) {
        return true
      }

      return value <= this.parent.character.experienceLevel.start.max_combat_technique_rating
    }

    switch (entityName) {
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
          this.parent.character.cantrips.activeCount +
            this.parent.character.spells.activeCount +
            this.parent.character.rituals.activeCount +
            this.parent.character.magicalActions.activeCount ===
          0
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
          this.parent.character.blessings.activeCount +
            this.parent.character.liturgicalChants.activeCount +
            this.parent.character.ceremonies.activeCount ===
          0
        )
      default:
        return true
    }
  }

  @computed
  get isDependedOn(): boolean {
    return (
      this.parent.dependenciesForActiveInstances.every(
        dep => isGeneralDependency(dep) || appliesToInstanceStrict(dep, this),
      ) ||
      (this.parent.entityName !== "Advantage" &&
        this.parent.entityName !== "Disadvantage" &&
        this.parent.character.specialAbilities.applyingDependencies.some(
          dep => dep.group === this.parent.entityName,
        ) &&
        this.parent.activationsCount < 2 &&
        this.parent.character.specialAbilities.getSpecialAbilitiesCollection(this.parent.entityName)
          .activeCount < 2)
    )
  }

  @computed
  get isRemovable(): boolean {
    return (
      this.minimumLevel === undefined &&
      !this.isDependedOn &&
      // // Disable if style special ability is required for
      // // extended special abilities
      // TODO: isStyleSpecialAbilityRemovalDisabled(hero)(wiki_entry) ||
      this.getEntrySpecificIsRemovable()
    )
  }
}

export const getAdventurePointsForInactiveActivatableInstance = (
  apValue: DisplayedInactiveActivatable["apValue"],
  instance: SerializedActivatableInstance,
  getSelectOptionWithResolvedAPValueById: (
    id: SelectOptionIdentifier,
  ) => ResolvedSelectOptionWithResolvedAPValue | undefined,
): number => {
  if (instance.customAdventurePointsValue !== undefined) {
    return instance.customAdventurePointsValue
  }

  switch (apValue.kind) {
    case "Fixed":
      return apValue.Fixed * (instance.level ?? 1)
    case "ByLevel":
      return instance.level === undefined ? 0 : (apValue.ByLevel.list[instance.level - 1] ?? 0)
    case "DerivedFromSelection": {
      const selectedOptions =
        instance.options
          ?.filter(isPredefinedActivatableOption)
          .map(opt => getSelectOptionWithResolvedAPValueById(opt.id)?.content.ap_value) ?? []

      return selectedOptions.some(isNotNullish)
        ? sumWith(selectedOptions, opt => opt?.Fixed ?? 0)
        : 0
    }
    default:
      return assertExhaustive(apValue)
  }
}

export class CharacterActivatable<
  Entity extends ActivatableIdentifier["kind"] = ActivatableIdentifier["kind"],
> {
  readonly global: Global
  readonly character: BaseCharacter
  readonly entityName: Entity
  readonly parent: CharacterActivatables<Entity>

  /**
   * The activatable identifier.
   */
  readonly id: string

  readonly dbEntry: EntityMap[Entity]
  readonly resolvedSelectOptions: ResolvedSelectOption[] | undefined

  /**
   * One or multiple activations of the activatable.
   */
  @observable accessor instances: CharacterActivatableInstance[] = []

  /**
   * The accumulated used adventure points value of all instances.
   */
  @computed
  get adventurePoints(): AdventurePointsCache {
    // TODO: Bound adventure points should be taken into account here

    // FOR INSTANCE ALONE
    //
    //   case DisadvantageIdentifier.PersonalityFlaw: {
    //     const isPersonalityFlawNotPaid = (generalId: number, paidEntries: number) => {
    //       const instanceOption = instance.options?.[0]
    //       if (instanceOption === undefined) {
    //         return false
    //       }
    //       const optionId: GeneralIdentifier = { tag: "General", general: generalId }
    //       return (
    //         matchesOptionId(optionId, instanceOption) &&
    //         countOptions(instances, optionId, { ignoreWithCustomAdventurePointsValue: true }) >
    //           (isEntryToAdd ? paidEntries - 1 : paidEntries)
    //       )
    //     }

    //     if (
    //       // 7 = "Prejudice" => more than one entry possible
    //       // more than one entry of Prejudice does not contribute to AP spent
    //       isPersonalityFlawNotPaid(7, 1) ||
    //       // 8 = "Unworldly" => more than one entry possible
    //       // more than two entries of Unworldly do not contribute to AP spent
    //       isPersonalityFlawNotPaid(8, 2)
    //     ) {
    //       return 0
    //     }

    //     return undefined
    //   }

    //   case DisadvantageIdentifier.Principles:
    //   case DisadvantageIdentifier.Obligations: {
    //     if (count(instances, not(hasCustomAdventurePointsValue)) < 2) {
    //       return undefined
    //     }

    //     const highestLevel = instances.reduce<{ level: number; count: number }>(
    //       (acc, ins) =>
    //         ins.level === undefined || hasCustomAdventurePointsValue(ins)
    //           ? acc
    //           : ins.level > acc.level
    //             ? { level: ins.level, count: 1 }
    //             : ins.level === acc.level
    //               ? { level: acc.level, count: acc.count + 1 }
    //               : acc,
    //       { level: 0, count: 0 },
    //     )

    //     const singleHighestLevel = ensure(highestLevel, x => x.count === 1)?.level

    //     const secondHighestLevel =
    //       singleHighestLevel === undefined
    //         ? undefined
    //         : instances.reduce<number | undefined>(
    //             (acc, ins) =>
    //               ins.level === undefined || hasCustomAdventurePointsValue(ins)
    //                 ? acc
    //                 : acc === undefined || (ins.level > acc && ins.level < singleHighestLevel)
    //                   ? ins.level
    //                   : acc,
    //             undefined,
    //           )

    //     if (instance.level === undefined || apValue.tag !== "Fixed") {
    //       return undefined
    //     }

    //     if (highestLevel.level > instance.level) {
    //       return 0
    //     }

    //     if (highestLevel.level === instance.level) {
    //       return singleHighestLevel === undefined || isEntryToAdd
    //         ? 0
    //         : secondHighestLevel === undefined
    //           ? instance.level * apValue.fixed
    //           : (instance.level - secondHighestLevel) * apValue.fixed
    //     }

    //     return isEntryToAdd ? (instance.level - highestLevel.level) * apValue.fixed : 0
    //   }

    //   case DisadvantageIdentifier.BadHabit: {
    //     // more than three entries cannot contribute to AP spent; entries with
    //     // custom cost are ignored for the rule's effect
    //     return count(instances, not(hasCustomAdventurePointsValue)) > (isEntryToAdd ? 2 : 3)
    //       ? 0
    //       : undefined
    //   }

    //   default:
    //     return undefined
    // }

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

    // FOR DIFFS IN ADDING INSTANCE COST

    // TODO: Calculare DependingOnActiveInstances for select options correctly (do not use resolved value alone)
    // case "DisadvantageIdentifier.PersonalityFlaw": {
    //   const getPersonalityFlawNotPaidDifference = (generalId: number, paidEntries: number) => {
    //     const optionId = createIdentifierObject("General", generalId)
    //     return countOptions(instances, optionId, {
    //       ignoreWithCustomAdventurePointsValue: true,
    //     }) > paidEntries
    //       ? (getSelectOptionById(optionId)?.ap_value ?? 0) * paidEntries
    //       : 0
    //   }

    //   return sum([
    //     // 7 = "Prejudice" => more than one entry possible
    //     // more than one entry of Prejudice does not contribute to AP spent
    //     getPersonalityFlawNotPaidDifference(7, 1),
    //     // 8 = "Unworldly" => more than one entry possible
    //     // more than two entries of Unworldly do not contribute to AP spent
    //     getPersonalityFlawNotPaidDifference(8, 2),
    //   ])
    // }

    // TODO: Add to schema for generalized handling of this case
    // case "DisadvantageIdentifier.Principles":
    // case "DisadvantageIdentifier.Obligations": {
    //   if (count(instances, not(hasCustomAdventurePointsValue)) < 2 || apValue.tag !== "Fixed") {
    //     return 0
    //   }

    //   const highestLevel = instances.reduce<{ level: number; count: number }>(
    //     (acc, ins) =>
    //       ins.level === undefined || hasCustomAdventurePointsValue(ins)
    //         ? acc
    //         : ins.level > acc.level
    //           ? { level: ins.level, count: 1 }
    //           : ins.level === acc.level
    //             ? { level: acc.level, count: acc.count + 1 }
    //             : acc,
    //     { level: 0, count: 0 },
    //   )

    //   const singleHighestLevel = ensure(highestLevel, x => x.count === 1)?.level

    //   if (singleHighestLevel === undefined) {
    //     return highestLevel.level * apValue.fixed
    //   }

    //   const secondHighestLevel = instances.reduce<number | undefined>(
    //     (acc, ins) =>
    //       ins.level === undefined || hasCustomAdventurePointsValue(ins)
    //         ? acc
    //         : acc === undefined || (ins.level > acc && ins.level < singleHighestLevel)
    //           ? ins.level
    //           : acc,
    //     undefined,
    //   )

    //   return (secondHighestLevel ?? 0) * apValue.fixed
    // }

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

    const [instancesWithCustom, instancesWithoutCustom] = partition(this.instances, instance =>
      instance.hasCustomAdventurePointsValue(),
    )

    const withCustom = isNotEmpty(instancesWithCustom)
      ? new AdventurePointsCache(
          sumWith(instancesWithCustom, instance => instance.customAdventurePointsValue),
          0,
        )
      : AdventurePointsCache.empty

    const withoutCustom = isNotEmpty(instancesWithoutCustom)
      ? new AdventurePointsCache(
          getAdventurePointsForActiveActivatableInstances(
            typeof this.dbEntry.ap_value === "number"
              ? Case("Fixed", this.dbEntry.ap_value)
              : this.dbEntry.ap_value,
            instancesWithoutCustom,
            option =>
              option.type === "Custom"
                ? 0
                : (this.getSelectOptionById(option.id)?.content.ap_value?.Fixed ?? 0),
            id => this.character.isActivatableActive(id),
            "medium",
          ),
          0,
        )
      : AdventurePointsCache.empty

    return withCustom.add(withoutCustom)
  }

  /**
   * The activatable's dependencies.
   */
  @observable accessor dependencies: ActivatableDependency[] = []

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t affect the costs of
   * buying the activatable entry. They may specify for which configuration of
   * an entry they count, just like a prerequisite.
   */
  @observable accessor boundAdventurePoints: BoundAdventurePointsForActivatable[] = []

  readonly prerequisites: Entity extends "Advantage" | "Disadvantage"
    ? AdvantageDisadvantagePrerequisites
    : GeneralPrerequisites

  constructor(
    global: Global,
    character: BaseCharacter,
    parent: CharacterActivatables<Entity>,
    entity: Entity,
    id: string,
    dbEntry: EntityMap[Entity],
  ) {
    this.global = global
    this.character = character
    this.parent = parent
    this.entityName = entity
    this.id = id
    this.dbEntry = dbEntry
    this.resolvedSelectOptions = global.cache.activatableSelectOptions[entity][id]
    this.prerequisites = getActivatablePrerequisites(
      this.entityName,
      this.dbEntry,
      this.global,
    ) as Entity extends "Advantage" | "Disadvantage"
      ? AdvantageDisadvantagePrerequisites
      : GeneralPrerequisites
  }

  /**
   * Get the level of the first instance of a given activatable entry, if it is
   * active.
   */
  @computed
  get firstLevel(): number | undefined {
    return this.instances?.[0]?.level
  }

  /**
   * Returns the number of instances of a given activatable entry.
   */
  @computed
  get activationsCount(): number {
    return this.instances.length
  }

  /**
   * Returns the number of instances of a given activatable entry.
   */
  @computed
  get activationsCountWithoutCustomAPValues(): number {
    return count(this.instances, instance => !instance.hasCustomAdventurePointsValue())
  }

  /**
   * Returns if a present activatable entry is active. Defaults to `false`.
   */
  @computed
  get isActive(): boolean {
    return this.activationsCount > 0
  }

  /**
   * Returns if a given option is active in any instance of a given activatable.
   * It defaults to the first option in the options array, but a different index
   * can be specified.
   */
  isOptionActive(optionId: PredefinedActivatableOption["id"], atIndex = 0): boolean {
    return (
      this.instances.some(instance => {
        const optionAtIndex = instance.options?.[atIndex]
        return optionAtIndex?.type === "Predefined" && equalsCase(optionAtIndex.id, optionId)
      }) ?? false
    )
  }

  /**
   * Returns if a given activatable entry is active with a given configuration.
   */
  isActiveWithConfiguration(config: {
    level?: number
    options?: PredefinedActivatableOption["id"][]
  }): boolean {
    return this.getInstanceIndexWithConfiguration(config) > -1
  }

  /**
   * Returns if a given activatable entry is active with a given configuration.
   */
  getInstanceIndexWithConfiguration(config: {
    level?: number
    options?: PredefinedActivatableOption["id"][]
  }): number {
    const { level, options } = config
    return this.instances.findIndex(instance => {
      const levelMatches = level === undefined || instance.level === level
      const optionsMatch =
        options === undefined ||
        (instance.options ?? []).some(
          option => option.type === "Predefined" && options.some(id => equalsCase(option.id, id)),
        )
      return levelMatches && optionsMatch
    })
  }

  /**
   * Returns the number of instances of a given activatable entry that have a
   * given option active. It defaults to the first option in the options array,
   * but a different index can be specified.
   */
  countOptions(
    optionId: SelectOptionIdentifier,
    options: { atIndex?: number; ignoreWithCustomAdventurePointsValue?: boolean } = {},
  ): number {
    const { atIndex = 0, ignoreWithCustomAdventurePointsValue = false } = options
    return this.instances.filter(instance => {
      const optionAtIndex = instance.options?.[atIndex]
      return (
        optionAtIndex?.type === "Predefined" &&
        equalsCase(optionAtIndex.id, optionId) &&
        (!ignoreWithCustomAdventurePointsValue || !instance.hasCustomAdventurePointsValue())
      )
    }).length
  }

  /**
   * Returns the option value of the first instance of a given activatable entry.
   * It defaults to the first option in the options array, but a different index
   * can be specified.
   */
  getFirstOption(atIndex = 0): ActivatableOption | undefined {
    return this.instances[0]?.options?.[atIndex]
  }

  /**
   * Returns the option value of the first instance of a given activatable entry
   * if it corresponds to a given predefined type. It defaults to the first option
   * in the options array, but a different index can be specified.
   */
  getFirstOptionOfType(
    tag: ResolvedSelectOptionIdentifier["kind"],
    atIndex = 0,
  ): string | undefined {
    const firstOption = this.getFirstOption(atIndex)
    if (firstOption?.type === "Predefined" && firstOption.id.kind === tag) {
      return fromUniformCase(firstOption.id)
    }
    return undefined
  }

  /**
   * Returns option values of instances of a given activatable entry. It defaults
   * to the first option in the options array, but a different index can be
   * specified.
   */
  getOptions(atIndex = 0): ActivatableOption[] {
    return this.instances.map(instance => instance.options?.[atIndex]).filter(isNotNullish)
  }

  toJSON(): RawActivatable | undefined {
    const safeInstances = ensureNonEmpty(this.instances.map(instance => instance.toJSON()))
    if (safeInstances === undefined) {
      return undefined
    }

    return {
      instances: safeInstances,
      boundAdventurePoints: ensureNonEmpty(toJS(this.boundAdventurePoints)),
    }
  }

  // const getEntrySpecificMaximumLevel = (
  //   id: ActivatableIdentifier,
  //   caps: {
  //     activeSermonsCount: number
  //     activeVisionsCount: number
  //     activeSpellworksCount: number
  //   },
  // ): number | undefined => {
  //   switch (id.kind) {
  //     case "Disadvantage":
  //       switch (id.Disadvantage) {
  //         case "DisadvantageIdentifier.SmallSpellSelection":
  //           return 3 - caps.activeSpellworksCount
  //         case "DisadvantageIdentifier.FewerSermons":
  //           return 3 - caps.activeSermonsCount
  //         case "DisadvantageIdentifier.FewerVisions":
  //           return 3 - caps.activeVisionsCount
  //         default:
  //           return undefined
  //       }
  //     default:
  //       return undefined
  //   }
  // }

  /**
   * Returns the maximum level of an activatable entry.
   */
  getMaximumLevel(
    instance: CharacterActivatableInstance | undefined,
    dependencies: ActivatableDependency[],
  ): number | undefined {
    const levels = "levels" in this.dbEntry ? this.dbEntry.levels : undefined

    if (levels === undefined) {
      return undefined
    }

    return Math.min(
      getMaxLevelByPrerequisites(l => this.checkPrerequisitesForLevel(l), levels),
      dependencies.reduce(
        (acc, dep) =>
          dep.active === false &&
          dep.level !== undefined &&
          deepEqual(
            instance?.options,
            dep.options?.map(opt => ({ type: "Predefined", id: opt }) as const),
          )
            ? Math.min(acc, dep.level - 1)
            : acc,
        Infinity,
      ),
      /* TODO: getEntrySpecificMaximumLevel(id, caps) ?? */ levels,
    )
  }

  /**
   * Filters out dependencies that multiple instances of this activatable entry match. A dependency only needs to be enforced if there is only one instance matching it.
   */
  @computed
  get dependenciesForActiveInstances(): ActivatableDependency[] {
    return this.applyingDependencies.filter(
      dep =>
        dep.active === false ||
        count(this.instances, instance => appliesToInstanceStrict(dep, instance)) < 2,
    )
  }

  toJSONActive(): DisplayedActiveActivatable<Entity>[] {
    const dependencies = this.dependenciesForActiveInstances

    return this.instances.map((instance, instanceIndex): DisplayedActiveActivatable<Entity> => {
      const { minimumLevel: minLevel, isRemovable } = instance
      const maxLevel = this.getMaximumLevel(instance, dependencies)

      //   TODO: Ignore selection for name when above level 1
      // case SpecialAbilityId.Exorzist:
      //     return pipe_ (
      //       hero_entry,
      //       AOWIA.tier,
      //       Maybe.product,
      //       ensure (equals (1)),
      //       thenF (AOWIA.sid (hero_entry)),
      //       findSelectOption (wiki_entry),
      //       fmap (SOA.name)
      //     )

      const nameComponents = getNameComponents<{ name: string }>(
        this.global.locale.translate,
        Case(this.entityName satisfies ActivatableIdentifier["kind"], this.id),
        instance.options?.map(o => {
          switch (o.type) {
            case "Predefined":
              return o.id
            case "Custom":
              return Case("Text", o.value)
            default:
              return assertExhaustive(o)
          }
        }),
        instance.level,
        "nameBuilderRules" in this.dbEntry ? this.dbEntry.nameBuilderRules : undefined,
        this.dbEntry.translations,
        t => t.name,
        this.global.db.getInstanceOfEntityById.bind(this.global.db),
        this.global.getResolvedSelectOptionById,
        this.global.getResolvedSkillApplicationById,
        false,
      )

      const fullWithoutLevel = renderActivatableNameComponentsWithoutLevel(
        this.global.locale.translateMap,
        nameComponents,
      )

      return {
        type: this.entityName,
        active: true,
        id: this.id,
        instance: instance.toSerialized(),
        instanceIndex,
        isRemovable,
        levels: "levels" in this.dbEntry ? this.dbEntry.levels : undefined,
        minLevel,
        maxLevel,
        cost: instance.adventurePoints,
        name: {
          ...nameComponents,
          full: renderActivatableNameComponents(
            this.global.locale.translateMap,
            nameComponents,
            false,
          ),
          fullWithoutLevel, // TODO: This is a hack to make the type system happy. The function should return the array directly.
        },
      }
    })
  }

  checkOtherPrerequisitesForLevel(
    prerequisites: GeneralPrerequisites | undefined,
    level: number,
  ): boolean {
    return prerequisites === undefined
      ? true
      : checkPrerequisitesOfGeneralEntryWithLevels(
          prerequisites,
          level,
          this.character.prerequisiteCapabilities,
        )
  }

  checkPrerequisitesForLevel(level: number): boolean {
    return isEmpty(this.prerequisites)
      ? true
      : this.entityName === "Advantage" || this.entityName === "Disadvantage"
        ? checkPrerequisitesOfAdvantageOrDisadvantage(
            this.prerequisites,
            level,
            this.entityName,
            this.id,
            this.character.prerequisiteCapabilities,
          )
        : checkPrerequisitesOfGeneralEntryWithLevels(
            this.prerequisites as GeneralPrerequisites,
            level,
            this.character.prerequisiteCapabilities,
          )
  }

  @computed
  get hasReachedMaximumEntries(): boolean {
    const maximum = "maximum" in this.dbEntry ? this.dbEntry.maximum : undefined
    const defaultMaximum =
      this.entityName === "Advantage" ||
      this.entityName === "Disadvantage" ||
      (this.resolvedSelectOptions?.length ?? 0) === 0
        ? 1
        : Infinity
    return this.activationsCount >= (maximum ?? defaultMaximum)
  }

  /**
   * Returns the activatable entry with its corresponding dynamic entry,
   * extended by whether it can be activated and configuration options.
   */
  toJSONInactive(): DisplayedInactiveActivatable<Entity> | undefined {
    if (this.hasReachedMaximumEntries) {
      return undefined
    }

    const dependencies = this.applyingDependencies
    const maxLevel = this.getMaximumLevel(undefined, dependencies)
    const hasrReachedImpossibleMaxLevel = maxLevel !== undefined && maxLevel < 1
    const hasNoEmptySelectOptionConfiguration = this.selectOptionConfiguration.every(
      config => config.kind === "text" || isNotEmpty(config.options),
    )

    return {
      type: this.entityName,
      active: false,
      id: this.id,
      name:
        this.global.locale.translateMap<{ name: string }>(this.dbEntry.translations)?.name ?? "",
      instances: this.instances.map(instance => instance.toSerialized()),
      isAvailable:
        !hasGeneralProhibitingDependency(dependencies) &&
        this.checkPrerequisitesForLevel(1) &&
        this.checkCustomPrerequisites() &&
        hasNoEmptySelectOptionConfiguration &&
        !hasrReachedImpossibleMaxLevel,
      options: this.selectOptionConfiguration,
      apValue: this.preparedInactiveAdventurePointsValue,
      level:
        "levels" in this.dbEntry && this.dbEntry.levels !== undefined && maxLevel !== undefined
          ? {
              maximum: maxLevel,
              placement:
                this.dbEntry.nameBuilderRules?.levelPlacement?.kind === "BeforeOptions"
                  ? "before"
                  : "after",
            }
          : undefined,
    }
  }

  isOfEntity<E extends ActivatableIdentifier["kind"]>(
    entityName: E,
  ): this is CharacterActivatable<E> {
    return (this.entityName satisfies ActivatableIdentifier["kind"]) === entityName
  }

  checkCustomPrerequisites(): boolean {
    if (this.isOfEntity("BlessedTradition")) {
      // Only one Blessed Tradition can be active at the same time
      return this.character.activeBlessedTradition === undefined
    } else if (this.isOfEntity("MagicalTradition")) {
      // Only one Magical Tradition can be active at the same time, unless the activatable allows multiple traditions
      const allowsMultiple = this.dbEntry.allows_multiple_traditions
      const validWithOtherTraditions = allowsMultiple
        ? this.character.activeMagicalTraditions.every(
            trad => trad.dbEntry.allows_multiple_traditions,
          )
        : isEmpty(this.character.activeMagicalTraditions)
      // TODO: Removing a tradition with multiple traditions must check if the highest primary attribute might get changed and thus certain dependencies might not be fulfilled anymore.

      const validWithReducedAPForAdvantagesAndDisadvantages =
        this.dbEntry.alternative_magical_adventure_points_maximum === undefined
          ? true
          : this.character.adventurePointsStats.spentOnMagicalAdvantages <=
              this.dbEntry.alternative_magical_adventure_points_maximum &&
            this.character.adventurePointsStats.spentOnMagicalDisadvantages <=
              this.dbEntry.alternative_magical_adventure_points_maximum

      return validWithOtherTraditions && validWithReducedAPForAdvantagesAndDisadvantages
    } else if (
      this.isOfEntity("AdvancedCombatSpecialAbility") ||
      this.isOfEntity("AdvancedKarmaSpecialAbility") ||
      this.isOfEntity("AdvancedMagicalSpecialAbility") ||
      this.isOfEntity("AdvancedSkillSpecialAbility")
    ) {
      const available = this.character.specialAbilities.availableAdvancedSpecialAbilities
      if (available.any > 0) {
        return true
      }
      return available.specific.some(spec =>
        equalsCase(
          spec.id,
          Case(this.entityName satisfies AdvancedSpecialAbilityEntityName, this.id),
        ),
      )
    } else if (this.isOfEntity("CombatStyleSpecialAbility")) {
      const hasCombination = this.character.isActivatableActive(
        this.global.settings.focusRules.styles.combatCombination,
      )
      const countByType = countBy(
        this.character.specialAbilities.getSpecialAbilitiesCollection(this.entityName).active,
        entry => entry.dbEntry.type.kind,
      )
      const thisCount = countByType[this.dbEntry.type.kind] ?? 0
      const { Armed: armedCount = 0, Unarmed: unarmedCount = 0 } = countByType
      return thisCount < (hasCombination ? 2 : 1) && armedCount + unarmedCount < 3
    } else if (this.isOfEntity("MagicStyleSpecialAbility")) {
      const hasCombination = this.character.isActivatableActive(
        this.global.settings.focusRules.styles.magicCombination,
      )
      return (
        this.character.specialAbilities.getSpecialAbilitiesCollection(this.entityName).activeCount <
        (hasCombination ? 2 : 1)
      )
    } else if (
      this.isOfEntity("LiturgicalStyleSpecialAbility") ||
      this.isOfEntity("SkillStyleSpecialAbility")
    ) {
      return !this.character.specialAbilities.getSpecialAbilitiesCollection(this.entityName)
        .hasActive
    } else if (this.isOfEntity("PactGift")) {
      return false // TODO: Implement pact gift logic here
    } else if (this.isOfEntity("Sermon") || this.isOfEntity("Vision")) {
      // TODO: implement logic for Sermon and Vision prerequisites
      return (
        this.character.advantages.isActive(
          this.global.settings.supernaturalBaseAdvantages.blessed,
        ) || !this.parent.hasActive
      )
    }

    return true
  }

  @action
  add(instance: SerializedActivatableInstance) {
    this.instances.push(new CharacterActivatableInstance(instance, this))
    if (isNotEmpty(this.prerequisites)) {
      const levelRange: RangeBounds = [1, instance.level ?? 1]
      if (this.entityName === "Advantage" || this.entityName === "Disadvantage") {
        registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies(
          this.prerequisites,
          RegistrationMethod.Add,
          this.character,
          Case(this.entityName satisfies "Advantage" | "Disadvantage", this.id),
          levelRange,
        )
      } else {
        registerOrUnregisterPrerequisitesOfGeneralAsDependencies(
          this.prerequisites as GeneralPrerequisites,
          RegistrationMethod.Add,
          this.character,
          Case(this.entityName satisfies SpecialAbilityIdentifier["kind"], this.id),
          levelRange,
        )
      }
    }
  }

  @action
  setLevel(index: number, newLevel: number) {
    if (this.instances[index]?.level !== undefined) {
      const oldLevel = this.instances[index].level
      this.instances[index].level = newLevel
      if (isNotEmpty(this.prerequisites)) {
        const method = newLevel > oldLevel ? RegistrationMethod.Add : RegistrationMethod.Remove
        const levelRange: RangeBounds =
          newLevel > oldLevel ? [oldLevel + 1, newLevel] : [newLevel + 1, oldLevel]
        if (this.entityName === "Advantage" || this.entityName === "Disadvantage") {
          registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies(
            this.prerequisites,
            method,
            this.character,
            Case(this.entityName satisfies "Advantage" | "Disadvantage", this.id),
            levelRange,
          )
        } else {
          registerOrUnregisterPrerequisitesOfGeneralAsDependencies(
            this.prerequisites as GeneralPrerequisites,
            method,
            this.character,
            Case(this.entityName satisfies SpecialAbilityIdentifier["kind"], this.id),
            levelRange,
          )
        }
      }
    }
  }

  @action
  remove(index: number) {
    const instance = this.instances[index]
    if (instance === undefined) {
      return
    }
    this.instances.splice(index, 1)
    if (isNotEmpty(this.prerequisites)) {
      const levelRange: RangeBounds = [1, instance.level ?? 1]
      if (this.entityName === "Advantage" || this.entityName === "Disadvantage") {
        registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies(
          this.prerequisites,
          RegistrationMethod.Remove,
          this.character,
          Case(this.entityName satisfies "Advantage" | "Disadvantage", this.id),
          levelRange,
        )
      } else {
        registerOrUnregisterPrerequisitesOfGeneralAsDependencies(
          this.prerequisites as GeneralPrerequisites,
          RegistrationMethod.Remove,
          this.character,
          Case(this.entityName satisfies SpecialAbilityIdentifier["kind"], this.id),
          levelRange,
        )
      }
    }
  }

  get resolvedSelectOptionsWithResolvedAPValue():
    | ResolvedSelectOptionWithResolvedAPValue[]
    | undefined {
    const restrictedOptionsForAdvanced = isAdvancedSpecialAbilityEntityName(this.entityName)
      ? this.character.specialAbilities.availableAdvancedSpecialAbilities.specific.find(
          spec => spec.id === Case(this.entityName as AdvancedSpecialAbilityEntityName, this.id),
        )?.restrictedOptions
      : undefined
    return this.resolvedSelectOptions === undefined
      ? undefined
      : resolveAPValuesForResolvedSelectOptions(
          this.resolvedSelectOptions,
          this.global,
          this.character,
          id =>
            this.applyingDependencies.some(
              dep =>
                dep.active === false &&
                (id.kind === "Skill"
                  ? appliesToInstanceStrict(dep, { options: [{ type: "Predefined", id }] }) ||
                    appliesToInstanceStrict(dep, {
                      options: [
                        {
                          type: "Predefined",
                          id: Case(
                            "SkillGroup",
                            this.global.db.getInstanceOfEntityById(id)?.group ?? id.Skill,
                          ),
                        },
                      ],
                    })
                  : appliesToInstanceStrict(dep, { options: [{ type: "Predefined", id }] })),
            ) ||
            (restrictedOptionsForAdvanced !== undefined &&
              !restrictedOptionsForAdvanced.some(opt => equalsCase(opt, id))),
          id => this.countOptions(id, { ignoreWithCustomAdventurePointsValue: true }),
        )
  }

  getSelectOptionById(
    id: SelectOptionIdentifier,
  ): ResolvedSelectOptionWithResolvedAPValue | undefined {
    return this.resolvedSelectOptionsWithResolvedAPValue?.find(ro => equalsCase(ro.id, id))
  }

  get selectOptionConfiguration(): DisplayedInactiveActivatableOption[] {
    return getSelectOptionConfiguration(
      this.resolvedSelectOptionsWithResolvedAPValue,
      this.entityName,
      this.id,
      "select_options" in this.dbEntry ? this.dbEntry.select_options?.rules : undefined,
      this.global,
    )
  }

  get preparedActiveAdventurePointsValue():
    | Case<"Fixed", number>
    | Case<"ByLevel", AdventurePointsValueByLevel>
    | Case<"DerivedFromSelection">
    | Case<"Range", { min: number; max: number; total: number; diffWhenRemoved: number }> {
    if (typeof this.dbEntry.ap_value === "number") {
      return Case("Fixed", this.dbEntry.ap_value)
    }

    switch (this.dbEntry.ap_value.kind) {
      case "Fixed":
      case "ByLevel":
      case "DerivedFromSelection":
        return this.dbEntry.ap_value
      case "DependingOnActive":
        return Case(
          "Fixed",
          getAdventurePointsDependingOnActiveForInactiveActivatableInstance(
            this.dbEntry.ap_value.DependingOnActive,
            id => this.character.isActivatableActive(id),
          ),
        )
      case "DependingOnActiveInstances": {
        const config = this.dbEntry.ap_value.DependingOnActiveInstances
        const values = range(0, this.activationsCountWithoutCustomAPValues - 1).map(i =>
          getAdventurePointsDependingOnActiveInstancesForInactiveActivatableInstance(config, i),
        )
        const total = sum(values)
        const diffWhenRemoved = values.at(-1) ?? 0
        const min = Math.min(...values)
        const max = Math.max(...values)
        return Case("Range", {
          min,
          max,
          total,
          diffWhenRemoved,
        })
      }
      case "Indefinite":
        return Case("Fixed", 0)
      default:
        return assertExhaustive(this.dbEntry.ap_value)
    }
  }

  get preparedInactiveAdventurePointsValue():
    | Case<"Fixed", number>
    | Case<"ByLevel", AdventurePointsValueByLevel>
    | Case<"DerivedFromSelection"> {
    if (typeof this.dbEntry.ap_value === "number") {
      return Case("Fixed", this.dbEntry.ap_value)
    }

    switch (this.dbEntry.ap_value.kind) {
      case "Fixed":
      case "ByLevel":
      case "DerivedFromSelection":
        return this.dbEntry.ap_value
      case "DependingOnActive":
        return Case(
          "Fixed",
          getAdventurePointsDependingOnActiveForInactiveActivatableInstance(
            this.dbEntry.ap_value.DependingOnActive,
            id => this.character.isActivatableActive(id),
          ),
        )
      case "DependingOnActiveInstances":
        return Case(
          "Fixed",
          getAdventurePointsDependingOnActiveInstancesForInactiveActivatableInstance(
            this.dbEntry.ap_value.DependingOnActiveInstances,
            this.activationsCountWithoutCustomAPValues,
          ),
        )
      case "Indefinite":
        return Case("Fixed", 0)
      default:
        return assertExhaustive(this.dbEntry.ap_value)
    }
  }

  /**
   * Flattens the list of dependencies to
   * usable values. That means, optional dependencies (objects) will be evaluated
   * and will be included in the resulting list, depending on whether it has to
   * follow the optional dependency or not. The result is a plain `List` of all
   * non-optional dependencies.
   */
  @computed
  get applyingDependencies(): ActivatableDependency[] {
    return this.dependencies.filter(dep => {
      if (
        dep.when !== undefined &&
        !checkPreconditions(dep.when, this.character.prerequisiteCapabilities)
      ) {
        return false
      }

      if (dep.isPartOfDisjunction) {
        return checkMultipleDisjunctionPartsAreValid(
          this.global.db.getInstanceOfEntityById,
          this.character.prerequisiteCapabilities,
          dep.sourceId,
          dep.index,
        )
      }

      return true
    })
  }

  @action
  addOrRemoveDependency(method: RegistrationMethod, dependency: ActivatableDependency) {
    addOrRemoveDependency(method, this.dependencies, dependency)
  }
}

// const checkPrerequisitesForLevel = (entityName: ActivatableIdentifier["kind"], id: string, prerequisites: GeneralPrerequisites | AdvantageDisadvantagePrerequisites, level: number, caps: BaseCharacter["prerequisiteCapabilities"]): boolean =>
//   isEmpty(prerequisites)
//     ? true
//     : entityName === "Advantage" || entityName === "Disadvantage"
//       ? checkPrerequisitesOfAdvantageOrDisadvantage(
//           prerequisites,
//           level,
//           entityName,
//           id,
//           caps,
//         )
//       : checkPrerequisitesOfGeneralEntryWithLevels(
//           prerequisites as GeneralPrerequisites,
//           level,
//           caps,
//         )

// /**
//  * Returns the maximum level of an activatable entry.
//  */
// const getMaximumLevel = (
//   entityName: ActivatableIdentifier["kind"],
//   id: string,
//   prerequisites: GeneralPrerequisites | AdvantageDisadvantagePrerequisites,
//   levels: number | undefined,
//   instance: CharacterActivatableInstance | undefined,
//   dependencies: ActivatableDependency[], caps: BaseCharacter["prerequisiteCapabilities"]
// ): number | undefined => {
//   if (levels === undefined) {
//     return undefined
//   }

//   return Math.min(
//     getMaxLevelByPrerequisites(l => checkPrerequisitesForLevel(entityName, id, prerequisites, l, caps), levels),
//     dependencies.reduce(
//       (acc, dep) =>
//         dep.active === false &&
//         dep.level !== undefined &&
//         deepEqual(
//           instance?.options,
//           dep.options?.map(opt => ({ type: "Predefined", id: opt }) as const),
//         )
//           ? Math.min(acc, dep.level - 1)
//           : acc,
//       Infinity,
//     ),
//     /* TODO: getEntrySpecificMaximumLevel(id, caps) ?? */ levels,
//   )
// }

// /**
//  * Returns the activatable entry with its corresponding dynamic entry,
//  * extended by whether it can be activated and configuration options.
//  */
// const getInactiveActivatable = <Entity extends ActivatableIdentifier["kind"]>(entityName: Entity, id: string, dbEntry: EntityMap[Entity], entry: CharacterActivatable<Entity> | undefined, character: BaseCharacter, global: Global): DisplayedInactiveActivatable<Entity> | undefined => {
//   if (entry &&
//     hasReachedMaximumEntries(
//       entry.activationsCount,
//       "maximum" in entry.dbEntry ? entry.dbEntry.maximum : undefined,
//       entityName === "Advantage" || entityName === "Disadvantage" ? 1 : Infinity,
//     )
//   ) {
//     return undefined
//   }

//   // TODO const idObject = Case(this.entityName satisfies ActivatableIdentifier["kind"], this.id)
//   const dependencies = entry?.applyingDependencies ?? []

//   // TODO const countOptionsForCurrent = (optionId: ResolvedSelectOptionIdentifier, atIndex?: number) =>
//   //   this.countOptions(optionId, { atIndex })

//   // TODO const hasProhibitingDependency = (optionId: ResolvedSelectOptionIdentifier) =>
//   //   dependencies.some(
//   //     dep =>
//   //       dep.active === false &&
//   //       appliesToInstanceLoose(dep, { options: [{ type: "Predefined", id: optionId }] }),
//   //   )

//   const maxLevel = getMaximumLevel(entityName, id, prerequisites, levels, undefined, dependencies, character.prerequisiteCapabilities)

//   if (entry?.isActive ?? false) {
//     const defaultMaximum =
//       entityName === "Advantage" || entityName === "Disadvantage"
//         ? 1
//         : (this.resolvedSelectOptions?.length ?? 0) > 0
//           ? undefined
//           : 1

//     const maximum =
//       "maximum" in dbEntry && dbEntry.maximum !== undefined
//         ? dbEntry.maximum
//         : defaultMaximum

//     if (maximum !== undefined && (entry?.activationsCount ?? 0) >= maximum) {
//       return undefined
//     }
//   }

//   return {
//     type: entityName,
//     active: false,
//     id,
//     name:
//       global.locale.translateMap<{ name: string }>(dbEntry.translations)?.name ?? "",
//     instances: entry?.instances.map(instance => instance.toSerialized()) ?? [],
//     isAvailable:
//       !hasGeneralProhibitingDependency(dependencies) &&
//       checkPrerequisitesForLevel(1) &&
//       this.checkAdvancedForMatchingStyle() &&
//       this.selectOptionConfiguration.every(
//         config => config.kind === "text" || isNotEmpty(config.options),
//       ) &&
//       (maxLevel === undefined || maxLevel > 0),
//     options: this.selectOptionConfiguration,
//     apValue: this.preparedInactiveAdventurePointsValue,
//     level:
//       "levels" in dbEntry && dbEntry.levels !== undefined && maxLevel !== undefined
//         ? {
//             maximum: maxLevel,
//             placement:
//               dbEntry.nameBuilderRules?.levelPlacement?.kind === "BeforeOptions"
//                 ? "before"
//                 : "after",
//           }
//         : undefined,
//   }
// }

export const getActivatablePrerequisites = <P>(
  entityName: ActivatableIdentifier["kind"],
  dbEntry: { prerequisites?: PrerequisitesForLevels<P>; translations: LocaleMap<{ name: string }> },
  global: Global,
): PrerequisitesForLevels<P | Case<"Rule", RulePrerequisite>> => {
  const staticPrerequisites: PrerequisitesForLevels<P | Case<"Rule", RulePrerequisite>> =
    dbEntry.prerequisites ?? []

  const dynamicPrerequisite: RulePrerequisite | undefined = (() => {
    switch (entityName) {
      case "CombatStyleSpecialAbility":
        return { id: Case("FocusRule", global.settings.focusRules.styles.combat), active: true }
      case "LiturgicalStyleSpecialAbility":
        return { id: Case("FocusRule", global.settings.focusRules.styles.liturgical), active: true }
      case "MagicStyleSpecialAbility":
        return { id: Case("FocusRule", global.settings.focusRules.styles.magic), active: true }
      case "SkillStyleSpecialAbility":
        return { id: Case("FocusRule", global.settings.focusRules.styles.skill), active: true }
      default:
        return undefined
    }
  })()

  return staticPrerequisites.concat(
    dynamicPrerequisite === undefined
      ? []
      : [{ level: 1, prerequisite: Case("Single", Case("Rule", dynamicPrerequisite)) }],
  )
}

export const resolveAPValuesForResolvedSelectOptions = (
  resolvedSelectOptions: ResolvedSelectOption[],
  global: Global,
  character: BaseCharacter,
  blockedByDependency: (optionId: ResolvedSelectOptionIdentifier) => boolean,
  countOptionsWithoutCustomAPValues: (optionId: ResolvedSelectOptionIdentifier) => number,
) =>
  resolvedSelectOptions
    .filter(
      option =>
        isEntryFromIncludedPublication(
          option.content,
          global.db.getInstanceOfEntityById.bind(global.db),
          global.locale.translateMap,
          character.rules.publicationOptions,
        ) && !blockedByDependency(option.id),
    )
    // oxlint-disable-next-line oxc/no-map-spread
    .map((option): ResolvedSelectOptionWithResolvedAPValue => ({
      ...option,
      content: {
        ...option.content,
        ap_value:
          option.content.ap_value?.kind === "DependingOnActiveInstances"
            ? Case(
                "Fixed",
                getAdventurePointsDependingOnActiveInstancesForInactiveActivatableInstance(
                  option.content.ap_value.DependingOnActiveInstances,
                  countOptionsWithoutCustomAPValues(option.id),
                ),
              )
            : option.content.ap_value,
      },
    }))

export const getSelectOptionConfiguration = (
  options: ResolvedSelectOptionWithResolvedAPValue[] | undefined,
  entityName: ActivatableIdentifier["kind"],
  id: string,
  selectOptionRules: SelectOptionRules | undefined,
  global: Global,
): DisplayedInactiveActivatableOption[] => {
  // TODO: Do not allow the same select option (combination?) to be selected multiple times unless specified otherwise
  // TODO: Select Options may restrict available levels with prerequisites or in general with Languages
  if (options) {
    if (selectOptionRules !== undefined) {
      return selectOptionRules.map((rule): DisplayedInactiveActivatableOption => {
        switch (rule.value.kind) {
          case "Child":
            return {
              kind: "choice",
              options: global.db
                .getAllInstanceContainersOfEntity(rule.value.Child.entity.kind)
                .map((container): ResolvedSelectOptionWithResolvedAPValue => ({
                  id: Case("SkillApplication", container.id),
                  content: {
                    ...container.content,
                    parent: Case(entityName, id),
                  },
                  newApplications: [],
                  uses: [],
                  parentSelectOption: Case("Skill", container.content.parent),
                })),
              parentIndex: rule.value.Child.parentIndex,
            }
          case "Predefined":
            return {
              kind: "choice",
              options,
            }
          case "PredefinedOrTextInput":
            return {
              kind: "choiceOrCustomizableText",
              options,
              textLabel: rule.value.PredefinedOrTextInput.translations,
            }
          case "TextInput":
            return {
              kind: "text",
              textLabel: rule.value.TextInput.translations,
            }
          default:
            return assertExhaustive(rule.value)
        }
      })
    } else {
      return [
        {
          kind: "choice",
          options,
        },
      ]
    }
  } else {
    return []
  }
}

export type ResolvedSelectOptionWithResolvedAPValue = ResolvedSelectOption & {
  content: {
    ap_value?: Case<"Fixed", number>
  }
  parentSelectOption?: ResolvedSelectOptionIdentifier
}

/**
 * A combination of a static and corresponding dynamic skill entry, extended by value bounds and full logic for if the value can be increased or decreased.
 */
export type DisplayedActiveActivatable<
  Entity extends ActivatableIdentifier["kind"] = ActivatableIdentifier["kind"],
> = {
  [E in Entity]: {
    type: E
    active: true
    id: string
    instance: SerializedActivatableInstance
    instanceIndex: number
    isRemovable: boolean
    levels?: number
    minLevel?: number
    maxLevel?: number
    cost: DisplayedActiveActivatableCost
    name: ActivatableNameComponentsWithFull
  }
}[Entity]

/**
 * A combination of a static and corresponding dynamic skill entry, extended by value bounds and full logic for if the value can be increased or decreased.
 */
export type DisplayedInactiveActivatable<
  Entity extends ActivatableIdentifier["kind"] = ActivatableIdentifier["kind"],
> = {
  [E in Entity]: {
    type: E
    active: false
    id: string
    name: string
    instances: SerializedActivatableInstance[]
    isAvailable: boolean
    options: DisplayedInactiveActivatableOption[]
    level?: {
      maximum: number
      placement: "before" | "after"
    }
    /**
     * A modified version or the adventure points value of the entry.
     */
    apValue:
      | Case<"Fixed", FixedAdventurePointsValue>
      | Case<"ByLevel", AdventurePointsValueByLevel>
      | Case<"DerivedFromSelection">
  }
}[Entity]

export class CharacterActivatables<Entity extends ActivatableIdentifier["kind"]> {
  readonly global: Global
  readonly #character: BaseCharacter
  readonly #entity: Entity
  @observable accessor #activatables: Map<string, CharacterActivatable<Entity>> = new Map()

  constructor(
    global: Global,
    character: BaseCharacter,
    entity: Entity,
    raw?: Record<string, RawActivatable>,
  ) {
    this.global = global
    this.#character = character
    this.#entity = entity
    for (const container of global.db.getAllInstanceContainersOfEntity(entity)) {
      this.#activatables.set(
        container.id,
        new CharacterActivatable<Entity>(
          global,
          character,
          this,
          entity,
          container.id,
          container.content,
        ),
      )
    }
    if (raw !== undefined) {
      for (const [id, rawEntry] of Object.entries(raw)) {
        for (const rawInstance of rawEntry.instances) {
          this.add(id, rawInstance)
        }

        for (const rawBoundAP of rawEntry.boundAdventurePoints ?? []) {
          this.bindAdventurePoints(id, rawBoundAP)
        }
      }
    }
  }

  getById(id: string): CharacterActivatable<Entity> | undefined {
    return this.#activatables.get(id)
  }

  getInstancesById(id: string): SerializedActivatableInstance[] {
    return this.getById(id)?.instances ?? []
  }

  isActive(id: string): boolean {
    return this.#activatables.get(id)?.isActive ?? false
  }

  @computed
  get adventurePointsTotal() {
    return this.#activatables
      .values()
      .reduce(
        (acc, entry) =>
          entry.isActive ? addAdventurePointsCaches(acc, entry.adventurePoints) : acc,
        emptyAdventurePointsCache,
      )
  }

  getAdventurePointsTotalForSubtype(
    this: CharacterActivatables<"Advantage" | "Disadvantage">,
    subtype: "Magical" | "Blessed",
  ): AdventurePointsCache {
    const cachePart =
      this.global.cache.magicalAndBlessedAdvantagesAndDisadvantages[this.#entity][subtype]
    return this.#activatables
      .values()
      .reduce(
        (acc, entry) =>
          entry.isActive && cachePart.includes(entry.id)
            ? addAdventurePointsCaches(acc, entry.adventurePoints)
            : acc,
        emptyAdventurePointsCache,
      )
  }

  @computed
  get hasActive(): boolean {
    return this.#activatables.values().some(entry => entry.isActive)
  }

  @computed
  get activeCount(): number {
    return this.#activatables.values().reduce((acc, entry) => (entry.isActive ? acc + 1 : acc), 0)
  }

  @computed
  get active(): CharacterActivatable<Entity>[] {
    return this.#activatables
      .values()
      .filter(entry => entry.isActive)
      .toArray()
  }

  @computed
  get activeForDisplay(): DisplayedActiveActivatable<Entity>[] {
    return this.#activatables
      .values()
      .flatMap(entry => entry.toJSONActive())
      .toArray()
  }

  @computed
  get inactive(): DisplayedInactiveActivatable<Entity>[] {
    return this.#activatables
      .values()
      .map((entry): DisplayedInactiveActivatable<Entity> | undefined => {
        if (
          !isEntryFromIncludedPublication(
            entry.dbEntry,
            this.global.db.getInstanceOfEntityById.bind(this.global.db),
            this.global.locale.translateMap,
            this.#character.rules.publicationOptions,
          )
        ) {
          return undefined
        }

        return entry.toJSONInactive()
      })
      .filter(isNotNullish)
      .toArray()
  }

  @action
  add(id: string, instance: SerializedActivatableInstance) {
    this.getById(id)?.add(instance)
  }

  @action
  setLevel(id: string, index: number, newLevel: number) {
    this.getById(id)?.setLevel(index, newLevel)
  }

  @action
  remove(id: string, index: number) {
    this.getById(id)?.remove(index)
  }

  @action
  bindAdventurePoints(id: string, config: BoundAdventurePointsForActivatable) {
    this.getById(id)?.boundAdventurePoints.push(config)
  }

  addOrRemoveDependency(id: string, method: RegistrationMethod, dependency: ActivatableDependency) {
    this.getById(id)?.addOrRemoveDependency(method, dependency)
  }

  toJSON(): Record<string, RawActivatable> | undefined {
    const entries = ensureNonEmpty(
      this.#activatables
        .entries()
        .map(([id, entry]): [string, RawActivatable | undefined] => [id, entry.toJSON()])
        .filter((p): p is [(typeof p)[0], NonNullable<(typeof p)[1]>] => p[1] !== undefined)
        .toArray(),
    )

    return entries === undefined ? undefined : Object.fromEntries(entries)
  }
}

/**
 * A single activation of an activatable entry.
 */
export type SerializedActivatableInstance = {
  /**
   * One or multiple options for the activatable. The meaning depends on the activatable.
   */
  options?: ActivatableOption[]

  /**
   * The instance level (if the activatable has levels).
   */
  level?: number

  /**
   * If provided, a custom adventure points value has been set for this instance.
   */
  customAdventurePointsValue?: number

  /**
   * A list of used bound adventure points for this instance.
   */
  usedBoundAdventurePoints?: BoundAdventurePointsForActivatable[]
}

/**
 * An option for an activatable entry.
 */
export type ActivatableOption = PredefinedActivatableOption | CustomActivatableOption

export type SelectOptionIdentifier =
  | ResolvedSelectOptionIdentifier
  | ResolvedSkillApplicationIdentifier

/**
 * A predefined option for an activatable entry.
 */
export type PredefinedActivatableOption = {
  type: "Predefined"

  /**
   * An identifier referencing a different entry.
   */
  id: SelectOptionIdentifier
}

/**
 * A predicate for a predefined option on an activatable entry.
 */
export const isPredefinedActivatableOption = (
  option: ActivatableOption,
): option is PredefinedActivatableOption => option.type === "Predefined"

/**
 * A custom option for an activatable entry, handled as user-entered text.
 */
export type CustomActivatableOption = {
  type: "Custom"

  /**
   * A user-entered text.
   */
  value: string
}

/**
 * A predicate for a custom option on an activatable entry.
 */
export const isCustomActivatableOption = (
  option: ActivatableOption,
): option is CustomActivatableOption => option.type === "Custom"

/**
 * Returns whether a select option matches a given activatable option.
 */
export const matchesOptionId = (id: ResolvedSelectOptionIdentifier, option: ActivatableOption) =>
  isPredefinedActivatableOption(option) && equalsCase(option.id, id)

/**
 * Maps the special ability tag names to their corresponding translations.
 */
// prettier-ignore
export const activatableGroupTranslationKeys = Object.freeze({
  Advantage: undefined,
  Disadvantage: undefined,
  Adoruzepterzauber: "Adoruzepterzauber",
  AdvancedCombatSpecialAbility: "Advanced Combat Special Abilities",
  AdvancedKarmaSpecialAbility: "Advanced Karma Special Abilities",
  AdvancedMagicalSpecialAbility: "Advanced Magical Special Abilities",
  AdvancedSkillSpecialAbility: "Advanced Skill Special Abilities",
  AncestorGlyph: "Ancestor Glyphs",
  ArcaneOrbEnchantment: "Arcane Orb Enchantments",
  AttireEnchantment: "Attire Enchantments",
  Beutelzauber: "Beutelzauber",
  BlessedTradition: "Blessed Traditions",
  BowlEnchantment: "Bowl Enchantments",
  BrawlingSpecialAbility: "Brawling Special Abilities",
  CauldronEnchantment: "Cauldron Enchantments",
  CeremonialItemSpecialAbility: "Ceremonial Item Special Abilities",
  ChronicleEnchantment: "Chronicle Enchantments",
  CombatSpecialAbility: "Combat Special Abilities",
  CombatStyleSpecialAbility: "Combat Style Special Abilities",
  CommandSpecialAbility: "Command Special Abilities",
  DaggerRitual: "Dagger Rituals",
  FamiliarSpecialAbility: "Familiar Special Abilities",
  FatePointSexSpecialAbility: "Fate Point Sex Special Abilities",
  FatePointSpecialAbility: "Fate Point Special Abilities",
  FoolsHatEnchantment: "Fools Hat Enchantments",
  GeneralSpecialAbility: "General Special Abilities",
  Haubenzauber: "Haubenzauber",
  Hauerkettenzauber: "Hauerkettenzauber",
  InstrumentEnchantment: "Instrument Enchantments",
  KarmaSpecialAbility: "Karma Special Abilities",
  Keulenzauber: "Keulenzauber",
  Krallenkettenzauber: "Krallenkettenzauber",
  Kristallkugelzauber: "Kristallkugelzauber",
  LiturgicalStyleSpecialAbility: "Liturgical Style Special Abilities",
  LycantropicGift: "Lycantropic Gifts",
  MagicalSign: "Magical Signs",
  MagicalSpecialAbility: "Magical Special Abilities",
  MagicalTradition: "Magical Traditions",
  MagicStyleSpecialAbility: "Magic Style Special Abilities",
  OrbEnchantment: "Orb Enchantments",
  PactGift: "Pact Gifts",
  ProtectiveWardingCircleSpecialAbility: "Protective/Warding Circle Special Abilities",
  RingEnchantment: "Ring Enchantments",
  Schweinetrommelzauber: "Schweinetrommelzauber",
  Sermon: "Sermons",
  SexSpecialAbility: "Sex Special Abilities",
  SickleRitual: "Sickle Rituals",
  SikaryanDrainSpecialAbility: "Sikaryan Drain Special Abilities",
  SkillStyleSpecialAbility: "Skill Style Special Abilities",
  SpellSwordEnchantment: "Spell Sword Enchantments",
  StaffEnchantment: "Staff Enchantments",
  ToyEnchantment: "Toy Enchantments",
  Trinkhornzauber: "Trinkhornzauber",
  VampiricGift: "Vampiric Gifts",
  Vision: "Visions",
  WandEnchantment: "Wand Enchantments",
  WeaponEnchantment: "Weapon Enchantments",
})
