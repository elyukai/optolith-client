import { deepEqual } from "@elyukai/utils/equality"
import { andEvery, orSome } from "@elyukai/utils/function"
import { Lazy } from "@elyukai/utils/lazy"
import { mapNullableDefault } from "@elyukai/utils/nullable"
import { range } from "@elyukai/utils/range"
import type {
  ResolvedSelectOption,
  ResolvedSelectOptionIdentifier,
} from "@optolith/database-schema/cache"
import type {
  ActivatableIdentifier,
  Advantage_ID,
  AdventurePointsValue,
  Disadvantage_ID,
  GeneralPrerequisites,
  PredefinedOrTextInputSelectOptionRuleValueTranslation,
  PublicationRefs,
  TextInputSelectOptionRuleValueTranslation,
} from "@optolith/database-schema/gen"
import type { LocaleMap } from "../../utils/locale.ts"
import { Case, equalsCase } from "../databaseEnum.ts"
import type {
  CharacterActivatable,
  ResolvedSelectOptionWithResolvedAPValue,
  SelectOptionIdentifier,
} from "./activatable.ts"
import { isGeneralDependency, type ActivatableDependency } from "./activatableDependency.ts"
import { modifierByLevel } from "./activatableModifiers.ts"

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
  options: ResolvedSelectOptionWithResolvedAPValue[]
  count?: number
  parentIndex?: number
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
  options: ResolvedSelectOptionWithResolvedAPValue[]
  textLabel: LocaleMap<PredefinedOrTextInputSelectOptionRuleValueTranslation>
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
  textLabel: LocaleMap<TextInputSelectOptionRuleValueTranslation>
}

/**
 * Returns if a given displayed inactive activatable option is text.
 */
export const isDisplayedInactiveActivatableOptionText = (
  option: DisplayedInactiveActivatableOption,
): option is DisplayedInactiveActivatableOptionText => option.kind === "text"

export const hasGeneralProhibitingDependency = (dependencies: ActivatableDependency[]) =>
  dependencies.some(dep => dep.active === false && isGeneralDependency(dep))

export const hasReachedMaximumEntries = (
  currentCount: number,
  maximum: number | undefined,
  defaultMaximum: number,
) => currentCount >= (maximum ?? defaultMaximum)

export const getIsSelectOptionAvailable = (
  isEntryAvailable: (src: PublicationRefs) => boolean,
  checkSelectOptionPrerequisites: (prerequisites: GeneralPrerequisites) => boolean,
  hasProhibitingDependency: (optionId: ResolvedSelectOptionIdentifier) => boolean,
  isEntrySpecificAvailable: (option: ResolvedSelectOption) => boolean,
): ((option: ResolvedSelectOption) => boolean) =>
  andEvery<ResolvedSelectOption>(
    option => mapNullableDefault(option.content.src, isEntryAvailable, true),
    option =>
      mapNullableDefault(option.content.prerequisites, checkSelectOptionPrerequisites, true),
    option => !hasProhibitingDependency(option.id),
    isEntrySpecificAvailable,
  )

export const getOptions = (
  id: ActivatableIdentifier,
  getSelectOptionsById: (id: ActivatableIdentifier) => ResolvedSelectOption[] | undefined,
  isSelectOptionAvailable: (option: ResolvedSelectOption) => boolean,
  getEntrySpecificOptions: (
    validSelectOptions: ResolvedSelectOption[] | undefined,
  ) => DisplayedInactiveActivatableOption[] | undefined,
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

export const getMaxLevelByPrerequisites = (
  checkPrerequisitesForLevel: (level: number) => boolean,
  levels: number,
) => {
  const firstLevelNotMatching = range([2, levels]).find(level => !checkPrerequisitesForLevel(level))
  return firstLevelNotMatching === undefined ? levels : firstLevelNotMatching - 1
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

export const getEntrySpecificDisplayParameterModifiers = <
  T extends { id: number; levels?: number; prerequisites?: P[]; src: PublicationRefs },
  P = T extends { prerequisites?: (infer P1)[] } ? P1 : never,
>(
  id: ActivatableIdentifier,
  countOptionsForContext: (optionId: ResolvedSelectOptionIdentifier, atIndex?: number) => number,
  caps: {
    activeSermonsCount: number
    activeVisionsCount: number
    activeSpellworksCount: number
    getDynamicAdvantageById: (id: Advantage_ID) => CharacterActivatable<"Advantage"> | undefined
    getDynamicDisadvantageById: (
      id: Disadvantage_ID,
    ) => CharacterActivatable<"Disadvantage"> | undefined
  },
): EntrySpecificDisplayParameterModifiers | undefined => {
  switch (id.kind) {
    case "Advantage":
      switch (id.Advantage) {
        case "AdvantageIdentifier.ExceptionalSkill":
          return { isSelectOptionAvailable: option => countOptionsForContext(option.id) < 2 }
        default:
          return {}
      }
    case "Disadvantage":
      switch (id.Disadvantage) {
        case "DisadvantageIdentifier.PersonalityFlaw": {
          return {
            isSelectOptionAvailable: option =>
              equalsCase(option.id, Case("General", "7")) ||
              equalsCase(option.id, Case("General", "8")) ||
              countOptionsForContext(option.id) < 1,
          }
        }
        default:
          return {}
      }
    case "GeneralSpecialAbility":
      switch (id.GeneralSpecialAbility) {
        case "GeneralSpecialAbilityIdentifier.SkillSpecialization": {
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
        case "GeneralSpecialAbilityIdentifier.LanguageSpecialization": {
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
        default:
          return {}
      }
    case "MagicalTradition":
      switch (id.MagicalTradition) {
        case "MagicalTraditionIdentifier.GuildMages": {
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
      switch (id.MagicalSpecialAbility) {
        case "MagicalSpecialAbilityIdentifier.Adaptation": {
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
      switch (id.MagicStyleSpecialAbility) {
        case "MagicStyleSpecialAbilityIdentifier.ScholarDesMagierkollegsZuHoningen": {
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
        case "MagicStyleSpecialAbilityIdentifier.MadaschwesternStil": {
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

    case "Sermon": {
      const isBlessedActive = Lazy.of(
        () => caps.getDynamicAdvantageById("AdvantageIdentifier.Blessed")?.isActive ?? false,
      )
      const isPreacherActive = Lazy.of(
        () => caps.getDynamicAdvantageById("AdvantageIdentifier.Preacher")?.isActive ?? false,
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
                caps.getDynamicAdvantageById("AdvantageIdentifier.ManySermons"),
                caps.getDynamicAdvantageById("DisadvantageIdentifier.FewerSermons"),
              ) >
              caps.activeSermonsCount),
      }
    }

    case "Vision": {
      const isBlessedActive = Lazy.of(
        () => caps.getDynamicAdvantageById("AdvantageIdentifier.Blessed")?.isActive ?? false,
      )
      const isVisionaryActive = Lazy.of(
        () => caps.getDynamicAdvantageById("AdvantageIdentifier.Visionary")?.isActive ?? false,
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
                caps.getDynamicAdvantageById("AdvantageIdentifier.ManyVisions"),
                caps.getDynamicAdvantageById("DisadvantageIdentifier.FewerVisions"),
              ) >
              caps.activeVisionsCount),
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

    //// IS ACTIVATION DISABLED:

    //       const current_id = SAA.id(wiki_entry)

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

    //       if (elem(SAA.gr(wiki_entry))(List(31, 32))) {
    //         // TODO: add option to activate vampire or lycanthropy and activate this
    //         //       SAs based on that option
    //         return true
    //       }

    default:
      return {}
  }
}

/**
 * Gets a single resolved select option from a list of displayed options.
 */
export const getSelectOptionFromDisplayedOption = (
  displayedOptions: DisplayedInactiveActivatableOption[],
  id: SelectOptionIdentifier,
): ResolvedSelectOptionWithResolvedAPValue | undefined =>
  displayedOptions
    .find(
      orSome(
        isDisplayedInactiveActivatableOptionChoice,
        isDisplayedInactiveActivatableOptionChoiceOrCustomizableText,
      ),
    )
    ?.options.find(opt => deepEqual(opt.id, id))

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
