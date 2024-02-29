import { ResolvedSelectOption } from "optolith-database-schema/cache/activatableSelectOptions"
import { AdventurePointsValue } from "optolith-database-schema/types/_Activatable"
import {
  ActivatableIdentifier,
  SelectOptionIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import { GeneralPrerequisites } from "optolith-database-schema/types/_Prerequisite"
import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"
import { filterNonNullable } from "../../utils/array.ts"
import { deepEqual } from "../../utils/compare.ts"
import { andEvery, orSome } from "../../utils/function.ts"
import { Lazy } from "../../utils/lazy.ts"
import { isNotNullish, mapNullableDefault } from "../../utils/nullable.ts"
import { mapObject } from "../../utils/object.ts"
import { range } from "../../utils/range.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { FilterApplyingActivatableDependencies } from "../dependencies/filterApplyingDependencies.ts"
import { GetById } from "../getTypes.ts"
import {
  AdvantageIdentifier,
  DisadvantageIdentifier,
  GeneralSpecialAbilityIdentifier,
  KarmaSpecialAbilityIdentifier,
  MagicStyleSpecialAbilityIdentifier,
  MagicalSpecialAbilityIdentifier,
  MagicalTraditionIdentifier,
  equalsIdentifier,
} from "../identifier.ts"
import {
  ActivatableDependency,
  appliesToInstanceLoose,
  isGeneralDependency,
} from "./activatableDependency.ts"
import { Activatable, ActivatableInstance, countOptions, isActive } from "./activatableEntry.ts"
import { modifierByLevel } from "./activatableModifiers.ts"

/**
 * A combination of a static activatable entry and its dynamic counterpart,
 * extended by whether the entry can be activated and configuration options.
 */
export type DisplayedInactiveActivatable<T> = {
  static: T
  dynamic: Activatable | undefined
  isAvailable: boolean
  options: DisplayedInactiveActivatableOption[]
  level?: {
    maximum: number
    placement: "before" | "after"
  }
  /**
   * A modified version or the adventure points value of the entry.
   */
  apValue?: AdventurePointsValue
}

/**
 * Configuration for a single option for an activatable entry.
 */
export type DisplayedInactiveActivatableOption =
  | DisplayedInactiveActivatableOptionChoice
  | DisplayedInactiveActivatableOptionChoiceOrCustomizableText
  | DisplayedInactiveActivatableOptionText

/**
 * An option where a value has to be selected from a list of options.
 */
export type DisplayedInactiveActivatableOptionChoice = {
  kind: "choice"
  options: ResolvedSelectOption[]
  count?: number
}

/**
 * Returns if a given displayed inactive activatable option is a choice.
 */
export const isDisplayedInactiveActivatableOptionChoice = (
  option: DisplayedInactiveActivatableOption,
): option is DisplayedInactiveActivatableOptionChoice => option.kind === "choice"

/**
 * An option where either a value has to be selected from a list of options or a
 * customizable text can be entered.
 */
export type DisplayedInactiveActivatableOptionChoiceOrCustomizableText = {
  kind: "choiceOrCustomizableText"
  options: ResolvedSelectOption[]
  textLabel: LocaleMap<string>
}

/**
 * Returns if a given displayed inactive activatable option is a choice or
 * customizable text.
 */
export const isDisplayedInactiveActivatableOptionChoiceOrCustomizableText = (
  option: DisplayedInactiveActivatableOption,
): option is DisplayedInactiveActivatableOptionChoiceOrCustomizableText =>
  option.kind === "choiceOrCustomizableText"

/**
 * An option where a customizable text can be entered.
 */
export type DisplayedInactiveActivatableOptionText = {
  kind: "text"
  textLabel: LocaleMap<string>
}

/**
 * Returns if a given displayed inactive activatable option is text.
 */
export const isDisplayedInactiveActivatableOptionText = (
  option: DisplayedInactiveActivatableOption,
): option is DisplayedInactiveActivatableOptionText => option.kind === "text"

const hasGeneralProhibitingDependency = (dependencies: ActivatableDependency[]) =>
  dependencies.some(dep => dep.active === false && isGeneralDependency(dep))

const hasReachedMaximumEntries = (
  currentCount: number,
  maximum: number | undefined,
  defaultMaximum: number,
) => currentCount >= (maximum ?? defaultMaximum)

const getIsSelectOptionAvailable = (
  isEntryAvailable: (src: PublicationRefs) => boolean,
  checkSelectOptionPrerequisites: (prerequisites: GeneralPrerequisites) => boolean,
  hasProhibitingDependency: (optionId: SelectOptionIdentifier) => boolean,
  isEntrySpecificAvailable: (option: ResolvedSelectOption) => boolean,
): ((option: ResolvedSelectOption) => boolean) =>
  andEvery<ResolvedSelectOption>(
    option => mapNullableDefault(option.src, isEntryAvailable, true),
    option => mapNullableDefault(option.prerequisites, checkSelectOptionPrerequisites, true),
    option => !hasProhibitingDependency(option.id),
    isEntrySpecificAvailable,
  )

const getOptions = (
  id: ActivatableIdentifier,
  getSelectOptionsById: (id: ActivatableIdentifier) => ResolvedSelectOption[] | undefined,
  isSelectOptionAvailable: (option: ResolvedSelectOption) => boolean,
  getEntrySpecificOptions: (
    validSelectOptions: ResolvedSelectOption[] | undefined,
  ) => DisplayedInactiveActivatableOption[] | undefined = selectOptions =>
    filterNonNullable([selectOptions ? { kind: "choice", options: selectOptions } : undefined]),
): DisplayedInactiveActivatableOption[] | undefined => {
  const selectOptions = getSelectOptionsById(id)?.filter(isSelectOptionAvailable)

  const hasValidSelectOptions = selectOptions === undefined || selectOptions.length > 0

  if (!hasValidSelectOptions) {
    return undefined
  }

  return getEntrySpecificOptions(selectOptions)

  // TODO
  //  ([
  //     AdvantageId.MagicalAttunement,
  //     DisadvantageId.AfraidOf,
  //     DisadvantageId.MagicalRestriction,
  //     DisadvantageId.Principles,
  //     DisadvantageId.BadHabit,
  //     DisadvantageId.Stigma,
  //     DisadvantageId.Obligations,
  //   ] as string[]) .includes (id)
}

const getMaxLevelByPrerequisites = (
  checkPrerequisitesForLevel: (level: number) => boolean,
  levels: number,
) => {
  const firstLevelNotMatching = range([2, levels]).find(level => !checkPrerequisitesForLevel(level))
  return firstLevelNotMatching === undefined ? levels : firstLevelNotMatching - 1
}

const getPropertyOrAspectKnowledgeCost = (
  apValue: AdventurePointsValue,
  instancesCount: number,
): EntrySpecificDisplayParameterModifiers | undefined => {
  switch (apValue.tag) {
    case "ByLevel": {
      const fixed = apValue.by_level[instancesCount]

      if (fixed === undefined) {
        return undefined
      }

      return {
        apValue: {
          tag: "Fixed",
          fixed,
        },
      }
    }
    case "Fixed":
    case "DerivedFromSelection":
    case "Indefinite":
      return undefined
    default:
      return assertExhaustive(apValue)
  }
}

type EntrySpecificDisplayParameterModifiers = Partial<{
  isSelectOptionAvailable: (option: ResolvedSelectOption) => boolean
  generateOptions: (
    validSelectOptions: ResolvedSelectOption[] | undefined,
  ) => DisplayedInactiveActivatableOption[] | undefined
  isAvailable: boolean
  levelPlacement: "before" | "after"
  apValue: AdventurePointsValue
}>

const getEntrySpecificDisplayParameterModifiers = <
  T extends { id: number; levels?: number; prerequisites?: P[]; src: PublicationRefs },
  P = T extends { prerequisites?: (infer P1)[] } ? P1 : never,
>(
  id: ActivatableIdentifier,
  instancesCount: number,
  apValue: AdventurePointsValue,
  countOptionsForContext: (optionId: SelectOptionIdentifier, atIndex?: number) => number,
  translations: LocaleMap<{ input?: string }>,
  caps: {
    activeSermonsCount: number
    activeVisionsCount: number
    activeSpellworksCount: number
    getDynamicAdvantageById: GetById.Dynamic.Advantage
    getDynamicDisadvantageById: GetById.Dynamic.Advantage
  },
): EntrySpecificDisplayParameterModifiers | undefined => {
  switch (id.tag) {
    case "Advantage":
      switch (id.advantage) {
        case AdvantageIdentifier.MagicalAttunement:
          return {
            generateOptions: selectOptions =>
              selectOptions
                ? [
                    {
                      kind: "choiceOrCustomizableText",
                      options: selectOptions,
                      textLabel: mapObject(translations, t10n => t10n.input),
                    },
                  ]
                : undefined,
          }
        case AdvantageIdentifier.ExceptionalSkill:
          return { isSelectOptionAvailable: option => countOptionsForContext(option.id) < 2 }
        case AdvantageIdentifier.HatredOf:
          return {
            generateOptions: selectOptions =>
              selectOptions
                ? [
                    {
                      kind: "text",
                      textLabel: mapObject(translations, t10n => t10n.input),
                    },
                    {
                      kind: "choice",
                      options: selectOptions,
                    },
                  ]
                : undefined,
          }
        case AdvantageIdentifier.InspireConfidence: {
          return {} // TODO: Implement as dynamic prerequisite instead
          // return toNewMaybe(
          //   lookup<string>(DisadvantageId.Incompetent)(HA.disadvantages(hero)),
          // ).maybe(false, incompetentStateEntry =>
          //   toArray(ADA.active(incompetentStateEntry)).some(ao =>
          //     toNewMaybe(AOA.sid(ao))
          //       .bind(skillId => ensure(skillId, isString))
          //       .bind(skillId => toNewMaybe(lookupF(SDA.skills(staticData))(skillId)))
          //       .maybe(false, skill => Skill.A.gr(skill) === SkillGroup.Social),
          //   ),
          // )
        }
        default:
          return {}
      }
    case "Disadvantage":
      switch (id.disadvantage) {
        case DisadvantageIdentifier.AfraidOf:
        case DisadvantageIdentifier.MagicalRestriction:
        case DisadvantageIdentifier.Principles:
        case DisadvantageIdentifier.BadHabit:
        case DisadvantageIdentifier.Stigma:
        case DisadvantageIdentifier.Obligations:
          return {
            generateOptions: selectOptions =>
              selectOptions
                ? [
                    {
                      kind: "choiceOrCustomizableText",
                      options: selectOptions,
                      textLabel: mapObject(translations, t10n => t10n.input),
                    },
                  ]
                : undefined,
          }
        case DisadvantageIdentifier.PersonalityFlaw: {
          return {
            isSelectOptionAvailable: option =>
              equalsIdentifier(option.id, { tag: "General", general: 7 }) ||
              equalsIdentifier(option.id, { tag: "General", general: 8 }) ||
              countOptionsForContext(option.id) < 1,
          }
        }
        case DisadvantageIdentifier.Incompetent: {
          return {} // TODO: Implement as dynamic prerequisite instead
          // const isAdvActive = pipe(lookupF(HA.advantages(hero)), isMaybeActive)
          // const isNotSocialSkill = notP(isSocialSkill(staticData))
          // return fmap(
          //   filterMapListT(
          //     composeT(
          //       isNoRequiredOrActiveSelection,
          //       filterT(e =>
          //         // Socially Adaptable and Inspire Confidence
          //         // require no Incompetence in social skills
          //         isAdvActive(AdvantageId.SociallyAdaptable) ||
          //         isAdvActive(AdvantageId.InspireConfidence)
          //           ? isNotSocialSkill(e)
          //           : true,
          //       ),
          //     ),
          //   ),
          // )
        }
        default:
          return {}
      }
    case "GeneralSpecialAbility":
      switch (id.general_special_ability) {
        case GeneralSpecialAbilityIdentifier.SkillSpecialization: {
          return {} // TODO
          // const mcounter = getActiveSecondarySelections(mhero_entry)
          // return fmap(
          //   filterMapListT(
          //     composeT(
          //       isNoRequiredSelection,
          //       filterT(e => {
          //         const curr_select_id = SOA.id(e)
          //         // if mcounter is available, mhero_entry must be a Just and thus
          //         // there can be active selections
          //         if (isJust(mcounter)) {
          //           const counter = fromJust(mcounter)
          //           if (member(curr_select_id)(counter)) {
          //             return isAddExistSkillSpecAllowed(hero)(counter)(curr_select_id)
          //           }
          //         }
          //         // otherwise we only need to check if the skill rating is at
          //         // least 6, as there can't be an activated selection.
          //         return isAddNotExistSkillSpecAllowed(hero)(curr_select_id)
          //       }),
          //       mapT(e => {
          //         const curr_select_id = SOA.id(e)
          //         const mcounts = bind(mcounter)(lookup(curr_select_id))
          //         const adjustSelectOption = pipe(
          //           over(SOL.cost)(
          //             isJust(mcounts)
          //               ? // Increase cost if there are active specializations
          //                 // for the same skill
          //                 fmap(multiply(flength(fromJust(mcounts)) + 1))
          //               : // otherwise return current cost
          //                 ident,
          //           ),
          //           over(SOL.applications)(
          //             fmap(
          //               filter((app: Record<Application>) => {
          //                 const isInactive = all(notElem<number | string>(AppA.id(app)))(mcounts)
          //                 const arePrerequisitesMet = validatePrerequisites(staticData)(hero)(
          //                   maybeToList(AppA.prerequisite(app)),
          //                 )(current_id)
          //                 return isInactive && arePrerequisitesMet
          //               }),
          //             ),
          //           ),
          //         )
          //         return adjustSelectOption(e)
          //       }),
          //     ),
          //   ),
          // )
        }
        case GeneralSpecialAbilityIdentifier.LanguageSpecialization: {
          return {} // TODO
          // return pipe_(
          //   staticData,
          //   SDA.specialAbilities,
          //   lookup<string>(SpecialAbilityId.Language),
          //   bindF(AAL.select),
          //   maybe(cnst(Nothing) as ident<Maybe<List<Record<SelectOption>>>>)(current_select => {
          //     const available_langs =
          //       // Pair: fst = sid, snd = current_level
          //       maybe(List<number>())(
          //         pipe(
          //           ADA.active,
          //           foldr((obj: Record<ActiveObject>) =>
          //             pipe_(
          //               obj,
          //               AOA.tier,
          //               bindF(current_level =>
          //                 pipe_(
          //                   guard(is3or4(current_level)),
          //                   thenF(AOA.sid(obj)),
          //                   misNumberM,
          //                   fmap((level: number) => consF(level)),
          //                 ),
          //               ),
          //               fromMaybe(ident as ident<List<number>>),
          //             ),
          //           )(List()),
          //         ),
          //       )(pipe_(hero, HA.specialAbilities, lookup<string>(SpecialAbilityId.Language)))
          //
          //     const filterLanguages = foldr(
          //       isNoRequiredSelection(e => {
          //         const lang = find((l: number) => l === SOA.id(e))(available_langs)
          //
          //         // a language must provide either a set of
          //         // possible specializations or an input where a
          //         // custom specialization can be entered.
          //         const provides_specific_or_input =
          //           Maybe.any(notNull)(SOA.specializations(e)) || isJust(SOA.specializationInput(e))
          //
          //         if (isJust(lang) && provides_specific_or_input) {
          //           return consF(e)
          //         }
          //
          //         return ident as ident<List<Record<SelectOption>>>
          //       }),
          //     )(List())
          //
          //     return cnst(Just(filterLanguages(current_select)))
          //   }),
          // )
        }

        //       case SpecialAbilityId.CraftInstruments: {
        //         return join(
        //           liftM2(
        //             (woodworking: Record<SkillDependent>) => (metalworking: Record<SkillDependent>) =>
        //               SkDA.value(woodworking) + SkDA.value(metalworking) >= 12 ? Just(ident) : Nothing,
        //           )(pipe(HA.skills, lookup<string>(SkillId.Woodworking))(hero))(
        //             pipe(HA.skills, lookup<string>(SkillId.Metalworking))(hero),
        //           ),
        //         )
        //       }

        //       case SpecialAbilityId.Hunter: {
        //         return pipe_(
        //           CombatTechniqueGroupId.Ranged,
        //           getAllEntriesByGroup(SDA.combatTechniques(wiki))(HA.combatTechniques(hero)),
        //           filter(pipe(SkDA.value, gte(10))),
        //           flength,
        //           ensure(gt(0)),
        //           mapReplace(ident),
        //         )
        //       }
        default:
          return {}
      }
    case "MagicalTradition":
      switch (id.magical_tradition) {
        case MagicalTraditionIdentifier.GuildMages: {
          return {} // TODO
          // return fmap(
          //   filterUnfamiliar(
          //     pipe(
          //       SpA.tradition,
          //       trads =>
          //         notElem(MagicalTradition.General)(trads) &&
          //         notElem(MagicalTradition.GuildMages)(trads),
          //     ),
          //   )(staticData),
          // )
        }
        default:
          return {}
      }
    case "MagicalSpecialAbility":
      switch (id.magical_special_ability) {
        case MagicalSpecialAbilityIdentifier.PropertyKnowledge:
          return getPropertyOrAspectKnowledgeCost(apValue, instancesCount)
        case MagicalSpecialAbilityIdentifier.Adaptation: {
          return {} // TODO
          // const isWikiEntryFromUnfamiliarTrad = isUnfamiliarSpell(
          //   HA.transferredUnfamiliarSpells(hero),
          // )(hero_magical_traditions)
          //
          // const isFromUnfamiliarTrad = pipe(
          //   SOA.id,
          //   ensure(isString),
          //   bindF(lookupF(SDA.spells(staticData))),
          //   maybe(false)(isWikiEntryFromUnfamiliarTrad),
          // )
          //
          // return fmap(
          //   filterMapListT(
          //     composeT(
          //       isNoRequiredOrActiveSelection,
          //       filterT(isFromUnfamiliarTrad),
          //     ),
          //   ),
          // )
        }
        default:
          return {}
      }
    case "MagicStyleSpecialAbility":
      switch (id.magic_style_special_ability) {
        case MagicStyleSpecialAbilityIdentifier.ScholarDesMagierkollegsZuHoningen: {
          return {} // TODO
          // const allowed_traditions = List(
          //   MagicalTradition.Druids,
          //   MagicalTradition.Elves,
          //   MagicalTradition.Witches,
          // )
          //
          // const mtransferred_spell_trads = pipe_(
          //   HA.specialAbilities(hero),
          //   lookup<string>(SpecialAbilityId.TraditionGuildMages),
          //   bindF(pipe(ADA.active, listToMaybe)),
          //   bindF(pipe(AOA.sid, isStringM)),
          //   bindF(lookupF(SDA.spells(staticData))),
          //   fmap(SpA.tradition),
          // )
          //
          // if (isNothing(mtransferred_spell_trads)) {
          //   return ident
          // }
          //
          // const transferred_spell_trads = fromJust(mtransferred_spell_trads)
          //
          // // Contains all allowed trads the first spell does not have
          // const trad_diff = filter(notElemF(transferred_spell_trads))(allowed_traditions)
          //
          // const has_transferred_all_traditions_allowed = fnull(trad_diff)
          //
          // return fmap(
          //   filterUnfamiliar(
          //     pipe(
          //       SpA.tradition,
          //       has_transferred_all_traditions_allowed
          //         ? trads =>
          //             notElem(MagicalTradition.General)(trads) &&
          //             List.any(elemF(allowed_traditions))(trads)
          //         : trads =>
          //             notElem(MagicalTradition.General)(trads) && List.any(elemF(trad_diff))(trads),
          //     ),
          //   )(staticData),
          // )
        }
        case MagicStyleSpecialAbilityIdentifier.MadaschwesternStil: {
          return {} // TODO
          // return fmap(
          //   filterUnfamiliar(
          //     pipe(
          //       SpA.tradition,
          //       trads =>
          //         notElem(MagicalTradition.General)(trads) &&
          //         notElem(MagicalTradition.Witches)(trads),
          //     ),
          //   )(staticData),
          // )
        }
        default:
          return {}
      }

    case "KarmaSpecialAbility": {
      switch (id.karma_special_ability) {
        case KarmaSpecialAbilityIdentifier.AspectKnowledge:
          return getPropertyOrAspectKnowledgeCost(apValue, instancesCount)
        default:
          return {}
      }
    }

    case "Sermon": {
      const isBlessedActive = Lazy.of(() =>
        isActive(caps.getDynamicAdvantageById(AdvantageIdentifier.Blessed)),
      )
      const isPreacherActive = Lazy.of(() =>
        isActive(caps.getDynamicAdvantageById(AdvantageIdentifier.Preacher)),
      )

      if (!isBlessedActive.value && !isPreacherActive.value) {
        return undefined
      }

      return {
        isAvailable:
          isBlessedActive.value ||
          (isPreacherActive.value &&
            3 +
              modifierByLevel(
                caps.getDynamicAdvantageById(AdvantageIdentifier.ManySermons),
                caps.getDynamicAdvantageById(DisadvantageIdentifier.FewerSermons),
              ) >
              caps.activeSermonsCount),
      }
    }

    case "Vision": {
      const isBlessedActive = Lazy.of(() =>
        isActive(caps.getDynamicAdvantageById(AdvantageIdentifier.Blessed)),
      )
      const isVisionaryActive = Lazy.of(() =>
        isActive(caps.getDynamicAdvantageById(AdvantageIdentifier.Visionary)),
      )

      if (!isBlessedActive.value && !isVisionaryActive.value) {
        return undefined
      }

      return {
        isAvailable:
          isBlessedActive.value ||
          (isVisionaryActive.value &&
            3 +
              modifierByLevel(
                caps.getDynamicAdvantageById(AdvantageIdentifier.ManyVisions),
                caps.getDynamicAdvantageById(DisadvantageIdentifier.FewerSermons),
              ) >
              caps.activeSermonsCount),
      }
    }

    // case SpecialAbilityId.SpellEnhancement:
    // case SpecialAbilityId.ChantEnhancement: {
    //   const getTargetHeroEntry =
    //     current_id === SpecialAbilityId.SpellEnhancement
    //       ? bindF(lookupF(HA.spells(hero)))
    //       : bindF(lookupF(HA.liturgicalChants(hero)))
    //
    //   const getTargetWikiEntry: (
    //     x: Maybe<string>,
    //   ) => Maybe<Record<Spell> | Record<LiturgicalChant>> =
    //     current_id === SpecialAbilityId.SpellEnhancement
    //       ? bindF(lookupF(SDA.spells(staticData)))
    //       : bindF(lookupF(SDA.liturgicalChants(staticData)))
    //
    //   const isNotUnfamiliar = (x: Record<Spell> | Record<LiturgicalChant>) =>
    //     LiturgicalChant.is(x) ||
    //     !isUnfamiliarSpell(HA.transferredUnfamiliarSpells(hero))(hero_magical_traditions)(x)
    //
    //   return fmap(
    //     foldr(
    //       isNoRequiredOrActiveSelection(e => {
    //         const mtarget_hero_entry = getTargetHeroEntry(SOA.target(e))
    //         const mtarget_wiki_entry = getTargetWikiEntry(SOA.target(e))
    //
    //         if (
    //           isJust(mtarget_wiki_entry) &&
    //           isJust(mtarget_hero_entry) &&
    //           isNotUnfamiliar(fromJust(mtarget_wiki_entry)) &&
    //           ASDA.value(fromJust(mtarget_hero_entry)) >=
    //             maybe(0)(pipe(multiply(4), add(4)))(SOA.level(e))
    //         ) {
    //           const target_wiki_entry = fromJust(mtarget_wiki_entry)
    //
    //           return consF(set(SOL.name)(`${SpAL.name(target_wiki_entry)}: ${SOA.name(e)}`)(e))
    //         }
    //
    //         return ident as ident<List<Record<SelectOption>>>
    //       }),
    //     )(List()),
    //   )
    // }

    // TODO: Magical Tradition restrictions
    //       case SpecialAbilityId.TraditionGuildMages:
    //       case SpecialAbilityId.TraditionWitches:
    //       case SpecialAbilityId.TraditionElves:
    //       case SpecialAbilityId.TraditionDruids:
    //       case SpecialAbilityId.TraditionIllusionist:
    //       case SpecialAbilityId.TraditionQabalyaMage:
    //       case SpecialAbilityId.TraditionGeoden:
    //       case SpecialAbilityId.TraditionZauberalchimisten:
    //       case SpecialAbilityId.TraditionSchelme:
    //       case SpecialAbilityId.TraditionBrobimGeoden: {
    //         return pipe_(
    //           hero,
    //           HA.specialAbilities,
    //           getMagicalTraditionsHeroEntries,
    //           ensure(List.fnull),
    //           mapReplace(ident),
    //         )
    //       }

    // TODO: Only one Blessed Tradition can be active at the same time
    //       case SpecialAbilityId.TraditionChurchOfPraios:
    //       case SpecialAbilityId.TraditionChurchOfRondra:
    //       case SpecialAbilityId.TraditionChurchOfBoron:
    //       case SpecialAbilityId.TraditionChurchOfHesinde:
    //       case SpecialAbilityId.TraditionChurchOfPhex:
    //       case SpecialAbilityId.TraditionChurchOfPeraine:
    //       case SpecialAbilityId.TraditionChurchOfEfferd:
    //       case SpecialAbilityId.TraditionChurchOfTravia:
    //       case SpecialAbilityId.TraditionChurchOfFirun:
    //       case SpecialAbilityId.TraditionChurchOfTsa:
    //       case SpecialAbilityId.TraditionChurchOfIngerimm:
    //       case SpecialAbilityId.TraditionChurchOfRahja:
    //       case SpecialAbilityId.TraditionCultOfTheNamelessOne:
    //       case SpecialAbilityId.TraditionChurchOfAves:
    //       case SpecialAbilityId.TraditionChurchOfIfirn:
    //       case SpecialAbilityId.TraditionChurchOfKor:
    //       case SpecialAbilityId.TraditionChurchOfNandus:
    //       case SpecialAbilityId.TraditionChurchOfSwafnir:
    //       case SpecialAbilityId.TraditionCultOfNuminoru: {
    //         return pipe_(hero, HA.specialAbilities, getBlessedTradition, x =>
    //           isJust(x) ? Nothing : Just(ident),
    //         )
    //       }

    // TODO
    //       case SpecialAbilityId.Recherchegespuer: {
    //         return pipe_(
    //           hero,
    //           HA.specialAbilities,
    //           lookup<string>(SpecialAbilityId.Wissensdurst),
    //           fmap(ADA.active),
    //           bindF(listToMaybe),
    //           bindF(AOA.sid),
    //           misStringM,
    //           bindF(lookupF(SDA.skills(wiki))),
    //           bindF(skill =>
    //             pipe(
    //               bindF<number | List<number>, List<number>>(ensure(isList)),
    //               fmap(pipe(map(add(getAPForActivatation(SA.ic(skill)))), Just, set(IAL.cost))),
    //             )(AAL.cost(wiki_entry)),
    //           ),
    //         )
    //       }

    // TODO: Traditions can only be bought if the maximum spent on or received from magical advantages and disadvantages is not above the tradition's limit
    //       case SpecialAbilityId.TraditionArcaneBard:
    //       case SpecialAbilityId.TraditionArcaneDancer:
    //       case SpecialAbilityId.TraditionIntuitiveMage:
    //       case SpecialAbilityId.TraditionSavant:
    //       case SpecialAbilityId.TraditionAnimisten: {
    //         return APCA.spentOnMagicalAdvantages(adventure_points) <= 25 &&
    //           APCA.spentOnMagicalDisadvantages(adventure_points) <= 25 &&
    //           pipe_(hero, HA.specialAbilities, getMagicalTraditionsHeroEntries, fnull)
    //           ? Just(ident)
    //           : Nothing
    //       }

    //// IS ACTIVATION DISABLED:

    //       const current_id = SAA.id(wiki_entry)

    //       if (CheckStyleUtils.isCombatStyleSpecialAbility(wiki_entry)) {
    //         return isAdditionDisabledForCombatStyle(staticData)(hero)(wiki_entry)
    //       }

    //       if (CheckStyleUtils.isMagicalStyleSpecialAbility(wiki_entry)) {
    //         const combination_hero_entry = lookup<string>(SpecialAbilityId.MagicStyleCombination)(
    //           HA.specialAbilities(hero),
    //         )

    //         const total_active = countActiveGroupEntries(staticData)(hero)(
    //           SpecialAbilityGroup.MagicalStyles,
    //         )

    //         return total_active >= (isMaybeActive(combination_hero_entry) ? 2 : 1)
    //       }

    //       if (CheckStyleUtils.isBlessedStyleSpecialAbility(wiki_entry)) {
    //         return hasActiveGroupEntry(staticData)(hero)(SpecialAbilityGroup.BlessedStyles)
    //       }

    //       if (current_id === SpecialAbilityId.CombatStyleCombination) {
    //         return !hasActiveGroupEntry(staticData)(hero)(
    //           SpecialAbilityGroup.CombatStylesArmed,
    //           SpecialAbilityGroup.CombatStylesUnarmed,
    //         )
    //       }

    //       if (current_id === SpecialAbilityId.MagicStyleCombination) {
    //         return !hasActiveGroupEntry(staticData)(hero)(SpecialAbilityGroup.MagicalStyles)
    //       }

    //       if (current_id === SpecialAbilityId.SpellEnhancement) {
    //         const traditionSchelme = toNewMaybe(
    //           lookup<string>(SpecialAbilityId.TraditionSchelme)(HA.specialAbilities(hero)),
    //         )

    //         if (traditionSchelme.isJust && isActive(traditionSchelme.value)) {
    //           return true
    //         }
    //       }

    //       if (current_id === SpecialAbilityId.DunklesAbbildDerBuendnisgabe) {
    //         return hasActiveGroupEntry(staticData)(hero)(SpecialAbilityGroup.Paktgeschenke)
    //       }

    //       if (current_id === SpecialAbilityId.WegDerSchreiberin) {
    //         return languagesWithMatchingScripts.length < 1 || scriptsWithMatchingLanguages.length < 1
    //       }

    //       if (SAA.gr(wiki_entry) === SpecialAbilityGroup.Paktgeschenke) {
    //         const dunkles_abbild = lookup<string>(SpecialAbilityId.DunklesAbbildDerBuendnisgabe)(
    //           HA.specialAbilities(hero),
    //         )

    //         const allPactPresents = getAllEntriesByGroup(SDA.specialAbilities(staticData))(
    //           HA.specialAbilities(hero),
    //         )(SpecialAbilityGroup.Paktgeschenke)

    //         const countPactPresents = foldr((obj: Record<ActivatableDependent>) => {
    //           if (isActive(obj)) {
    //             const wikiObj = lookup(ADA.id(obj))(SDA.specialAbilities(staticData))

    //             if (
    //               any(pipe(SAA.prerequisites, isOrderedMap))(wikiObj) &&
    //               any(pipe(SAA.cost, isList))(wikiObj) &&
    //               isJust(bind(wikiObj)(SAA.tiers))
    //             ) {
    //               return add(sum(bindF(AOA.tier)(listToMaybe(ADA.active(obj)))))
    //             }

    //             return inc
    //           }

    //           return ident as ident<number>
    //         })(0)(allPactPresents)

    //         // isFaeriePact?
    //         const isDisabled = all(pipe(PA.category, lte(1)))(HA.pact(hero))
    //           ? isMaybeActive(dunkles_abbild) ||
    //             all(pipe(PA.level, lte(countPactPresents)))(HA.pact(hero))
    //           : // is Lesser Pact?
    //           all(pipe(PA.level, lte(0)))(HA.pact(hero))
    //           ? // Lesser Pact only provides 3 PactGifts
    //             countPactPresents >= 3
    //           : // Normal DemonPact: KdV + 7 PactGifts
    //             all(pipe(PA.level, lte(countPactPresents - 7)))(HA.pact(hero))

    //         return isDisabled
    //       }

    //       if (current_id === SpecialAbilityId.LanguageSpecializations) {
    //         return pipe(HA.rules, RA.enableLanguageSpecializations, not)(hero)
    //       }

    //       if (elem(SAA.gr(wiki_entry))(List(31, 32))) {
    //         // TODO: add option to activate vampire or lycanthropy and activate this
    //         //       SAs based on that option
    //         return true
    //       }

    default:
      return {}
  }
}

const getEntrySpecificMaximumLevel = (
  id: ActivatableIdentifier,
  caps: {
    activeSermonsCount: number
    activeVisionsCount: number
    activeSpellworksCount: number
  },
): number | undefined => {
  switch (id.tag) {
    case "Disadvantage":
      switch (id.disadvantage) {
        case DisadvantageIdentifier.SmallSpellSelection:
          return 3 - caps.activeSpellworksCount
        case DisadvantageIdentifier.FewerSermons:
          return 3 - caps.activeSermonsCount
        case DisadvantageIdentifier.FewerVisions:
          return 3 - caps.activeVisionsCount
        default:
          return undefined
      }
    default:
      return undefined
  }
}

/**
 * Returns the maximum level of an activatable entry.
 */
export const getMaximumLevel = (
  id: ActivatableIdentifier,
  levels: number | undefined,
  instance: ActivatableInstance,
  dependencies: ActivatableDependency[],
  checkPrerequisites: (level: number) => boolean,
  caps: {
    activeSermonsCount: number
    activeVisionsCount: number
    activeSpellworksCount: number
  },
): number | undefined => {
  if (levels === undefined) {
    return undefined
  }

  return Math.min(
    getMaxLevelByPrerequisites(checkPrerequisites, levels),
    dependencies.reduce(
      (acc, dep) =>
        dep.active === false &&
        dep.level !== undefined &&
        deepEqual(
          instance.options,
          dep.options?.map(opt => ({ type: "Predefined", id: opt } as const)),
        )
          ? Math.min(acc, dep.level - 1)
          : acc,
      Infinity,
    ),
    getEntrySpecificMaximumLevel(id, caps) ?? levels,
  )
}

/**
 * Returns all activatable entries with their corresponding dynamic entry,
 * extended by whether the entry can be activated and configuration options.
 */
export const getInactiveActivatables = <
  T extends {
    id: number
    maximum?: number
    levels?: number
    prerequisites?: P[]
    ap_value: AdventurePointsValue
    src: PublicationRefs
    translations: LocaleMap<{ input?: string }>
  },
  P = T extends { prerequisites?: (infer P1)[] } ? P1 : never,
>(
  staticActivatables: T[],
  getDynamicActivatableById: (id: number) => Activatable | undefined,
  isEntryAvailable: (src: PublicationRefs) => boolean,
  checkPrerequisites: (prerequisites: P[], level: number, id: number) => boolean,
  checkSelectOptionPrerequisites: (prerequisites: GeneralPrerequisites) => boolean,
  getSelectOptionsById: (id: ActivatableIdentifier) => ResolvedSelectOption[] | undefined,
  createActivatableIdentifierObject: (id: number) => ActivatableIdentifier,
  filterApplyingDependencies: FilterApplyingActivatableDependencies,
  maximumEntriesCountDefault: number,
  caps: {
    activeSermonsCount: number
    activeVisionsCount: number
    activeSpellworksCount: number
    getDynamicAdvantageById: GetById.Dynamic.Advantage
    getDynamicDisadvantageById: GetById.Dynamic.Disadvantage
  },
): DisplayedInactiveActivatable<T>[] =>
  staticActivatables
    .map((staticActivatable): DisplayedInactiveActivatable<T> | undefined => {
      const idObject = createActivatableIdentifierObject(staticActivatable.id)
      const dynamicActivatable = getDynamicActivatableById(staticActivatable.id)
      const activations = dynamicActivatable?.instances.length ?? 0

      if (
        !isEntryAvailable(staticActivatable.src) ||
        hasReachedMaximumEntries(activations, staticActivatable.maximum, maximumEntriesCountDefault)
      ) {
        return undefined
      }

      const dependencies =
        dynamicActivatable === undefined
          ? []
          : filterApplyingDependencies(dynamicActivatable.dependencies)

      const countOptionsForCurrent = (optionId: SelectOptionIdentifier, atIndex?: number) =>
        countOptions(dynamicActivatable, optionId, { atIndex })

      const hasProhibitingDependency = (optionId: SelectOptionIdentifier) =>
        dependencies.some(
          dep =>
            dep.active === false &&
            appliesToInstanceLoose(dep, { options: [{ type: "Predefined", id: optionId }] }),
        )

      const paramModifiers = getEntrySpecificDisplayParameterModifiers(
        idObject,
        activations,
        staticActivatable.ap_value,
        countOptionsForCurrent,
        staticActivatable.translations,
        caps,
      )

      if (paramModifiers === undefined) {
        return undefined
      }

      const {
        isSelectOptionAvailable: isSelectOptionAvailableEntrySpecific = option =>
          countOptionsForCurrent(option.id) < 1,
        generateOptions,
        isAvailable: isAvailableEntrySpecific = true,
        levelPlacement: levelPlacementEntrySpecific = "before",
        apValue,
      } = paramModifiers

      // TODO: Select Options may restrict available levels with prerequisites or in general with Languages

      const options = getOptions(
        idObject,
        getSelectOptionsById,
        getIsSelectOptionAvailable(
          isEntryAvailable,
          checkSelectOptionPrerequisites,
          hasProhibitingDependency,
          isSelectOptionAvailableEntrySpecific,
        ),
        generateOptions,
      )

      const maxLevel = getMaximumLevel(
        idObject,
        staticActivatable.levels,
        {},
        dependencies,
        level =>
          checkPrerequisites(staticActivatable.prerequisites ?? [], level, staticActivatable.id),
        caps,
      )

      return {
        static: staticActivatable,
        dynamic: dynamicActivatable,
        isAvailable:
          !hasGeneralProhibitingDependency(dependencies) &&
          checkPrerequisites(staticActivatable.prerequisites ?? [], 1, staticActivatable.id) &&
          options !== undefined &&
          (maxLevel === undefined || maxLevel > 0) &&
          isAvailableEntrySpecific,
        // TODO: hasReachedImpossibleMaximumLevel(max_level) ||
        // TODO: doesNotApplyToMagActionsThoughRequired(required_apply_to_mag_actions)(wiki_entry)
        options: options ?? [],
        level:
          maxLevel === undefined
            ? undefined
            : {
                maximum: maxLevel,
                placement: levelPlacementEntrySpecific,
              },
        apValue,
      }
    })
    .filter(isNotNullish)

/**
 * Gets a single resolved select option from a list of displayed options.
 */
export const getSelectOptionFromDisplayedOption = (
  displayedOptions: DisplayedInactiveActivatableOption[],
  id: SelectOptionIdentifier,
): ResolvedSelectOption | undefined =>
  displayedOptions
    .find(
      orSome(
        isDisplayedInactiveActivatableOptionChoice,
        isDisplayedInactiveActivatableOptionChoiceOrCustomizableText,
      ),
    )
    ?.options.find(opt => equalsIdentifier(opt.id, id))

// const isSocialSkill = (staticData: StaticDataRecord) =>
//   pipe(
//     SOA.id,
//     ensure(isString),
//     bindF(lookupF(SDA.skills(staticData))),
//     fmap(pipe(SA.gr, equals(SkillGroup.Social))),
//     or,
//   )

// const isAddExistSkillSpecAllowed =
//   (hero: HeroModelRecord) =>
//   (counter: OrderedMap<string | number, List<string | number>>) =>
//   (curr_select_id: string | number) =>
//     pipe_(
//       curr_select_id,
//       ensure(isString),
//       bindF(lookupF(HA.skills(hero))),
//       liftM2(
//         (apps: List<string | number>) => (skill: Record<SkillDependent>) =>
//           flength(apps) < 3 && SkDA.value(skill) >= (flength(apps) + 1) * 6,
//       )(lookupF(counter)(curr_select_id)),
//       or,
//     )

// const isAddNotExistSkillSpecAllowed = (hero: HeroModelRecord) => (selectId: string | number) =>
//   newensure(selectId, isString)
//     .bind(id => toNewMaybe(lookup(id)(HA.skills(hero))))
//     .maybe(false, skill => SkDA.value(skill) >= 6)

// const is3or4 = (x: string | number): x is number => x === 3 || x === 4

// type OtherOptionsModifier = ident<Record<InactiveActivatable>>

// const getSermonOrVisionCountMax =
//   (hero: HeroModelRecord) => (adv_id: string) => (disadv_id: string) =>
//     modifyByLevel(3)(lookup(adv_id)(HA.advantages(hero)))(lookup(disadv_id)(HA.disadvantages(hero)))

// /**
//  * Calculates whether an Activatable is valid to add or not and, if valid,
//  * calculates and filters necessary properties and selection lists. Returns a
//  * Maybe of the result or `undefined` if invalid.
//  */
// TODO: export const getInactiveView =
//   (staticData: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (automatic_advantages: List<string>) =>
//   (required_apply_to_mag_actions: boolean) =>
//   (matchingScriptAndLanguageRelated: MatchingScriptAndLanguageRelated) =>
//   (adventure_points: Record<AdventurePointsCategories>) =>
//   (validExtendedSpecialAbilities: List<string>) =>
//   (hero_magical_traditions: List<Record<ActivatableDependent>>) =>
//   (wiki_entry: Activatable) =>
//   (mhero_entry: Maybe<Record<ActivatableDependent>>): Maybe<Record<InactiveActivatable>> => {
//     const current_id = AAL.id(wiki_entry)
//     const current_prerequisites = AAL.prerequisites(wiki_entry)

//     const max_level = isOrderedMap(current_prerequisites)
//       ? validateLevel(staticData)(hero)(current_prerequisites)(
//           maybe<ActivatableDependent["dependencies"]>(List())(ADA.dependencies)(mhero_entry),
//         )(current_id)
//       : Nothing

//     const isNotValid = isAdditionDisabled(staticData)(hero)(required_apply_to_mag_actions)(
//       validExtendedSpecialAbilities,
//     )(matchingScriptAndLanguageRelated)(wiki_entry)(mhero_entry)(max_level)

//     if (!isNotValid) {
//       return pipe_(
//         wiki_entry,
//         AAL.select,
//         modifySelectOptions(staticData)(hero)(hero_magical_traditions)(wiki_entry)(mhero_entry),
//         ensure(maybe(true)(notNull)),
//         fmap((select_options: Maybe<List<Record<SelectOption>>>) =>
//           InactiveActivatable({
//             id: current_id,
//             name: SpAL.name(wiki_entry),
//             cost: AAL.cost(wiki_entry),
//             maxLevel: max_level,
//             heroEntry: mhero_entry,
//             wikiEntry: wiki_entry as Record<RecordI<Activatable>>,
//             selectOptions: fmapF(select_options)(sortRecordsByName(staticData)),
//             isAutomatic: List.elem(AAL.id(wiki_entry))(automatic_advantages),
//           }),
//         ),
//         ap(modifyOtherOptions(staticData)(hero)(adventure_points)(wiki_entry)(mhero_entry)),
//         bindF(ensure(pipe(IAA.maxLevel, maybe(true)(notEquals(0))))),
//       )
//     }

//     return Nothing
//   }

//// Validation Utils

// TODO: const isAdditionDisabledForCombatStyle =
//   (staticData: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (wiki_entry: Record<SpecialAbility>): boolean => {
//     const combination_hero_entry = lookup<string>(SpecialAbilityId.CombatStyleCombination)(
//       HA.specialAbilities(hero),
//     )

//     // Combination-SA is active, which allows 3 styles to be active,
//     // but only a maximum of 2 from one type (armed/unarmed).
//     if (isMaybeActive(combination_hero_entry)) {
//       const totalActive = countActiveGroupEntries(staticData)(hero)(
//         SpecialAbilityGroup.CombatStylesArmed,
//         SpecialAbilityGroup.CombatStylesUnarmed,
//       )

//       const equalTypeStylesActive = countActiveGroupEntries(staticData)(hero)(SAA.gr(wiki_entry))

//       return totalActive >= 3 || equalTypeStylesActive >= 2
//     }

//     // Otherwise, only one of each type can be active.
//     else {
//       return pipe_(wiki_entry, SAA.gr, hasActiveGroupEntry(staticData)(hero))
//     }
//   }

// /**
//  * Checks if you can somehow add an ActiveObject to the given entry.
//  * @param state The present state of the current hero.
//  * @param instance The entry.
//  */
// const isAdditionDisabledEntrySpecific =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (matchingScriptAndLanguageRelated: MatchingScriptAndLanguageRelated) =>
//   (wiki_entry: Activatable): boolean =>
//     isAdditionDisabledSpecialAbilitySpecific(wiki)(hero)(matchingScriptAndLanguageRelated)(
//       wiki_entry,
//     ) ||
//     !validatePrerequisites(wiki)(hero)(getFirstLevelPrerequisites(AAL.prerequisites(wiki_entry)))(
//       AAL.id(wiki_entry),
//     )

// const hasReachedImpossibleMaximumLevel = Maybe.elem(0)

// const isInvalidExtendedSpecialAbility =
//   (wiki_entry: Activatable) => (validExtendedSpecialAbilities: List<string>) =>
//     CheckStyleUtils.isExtendedSpecialAbility(wiki_entry) &&
//     notElem(AAL.id(wiki_entry))(validExtendedSpecialAbilities)

// const doesNotApplyToMagActionsThoughRequired =
//   (required_apply_to_mag_actions: boolean) =>
//   (wiki_entry: Activatable): boolean =>
//     SpecialAbility.is(wiki_entry)
//       ? false
//       : required_apply_to_mag_actions && Advantage.AL.isExclusiveToArcaneSpellworks(wiki_entry)

// /**
//  * Checks if the given entry can be added.
//  * @param obj
//  * @param state The current hero's state.
//  */
// TODO: export const isAdditionDisabled =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (required_apply_to_mag_actions: boolean) =>
//   (validExtendedSpecialAbilities: List<string>) =>
//   (matchingScriptAndLanguageRelated: MatchingScriptAndLanguageRelated) =>
//   (wiki_entry: Activatable) =>
//   (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
//   (max_level: Maybe<number>): boolean =>
//     isAdditionDisabledEntrySpecific(wiki)(hero)(matchingScriptAndLanguageRelated)(wiki_entry) ||
//     hasGeneralRestrictionToAdd(mhero_entry) ||
//     hasReachedMaximumEntries(wiki_entry)(mhero_entry) ||
//     hasReachedImpossibleMaximumLevel(max_level) ||
//     isInvalidExtendedSpecialAbility(wiki_entry)(validExtendedSpecialAbilities) ||
//     doesNotApplyToMagActionsThoughRequired(required_apply_to_mag_actions)(wiki_entry)
