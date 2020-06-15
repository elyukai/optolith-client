open Static.SelectOption;
open Ley.Option;
open Ley.Option.Functor;
open Ley.Option.Monad;
open Activatable_Convert;
open Activatable_Accessors;

let getSelectOption = (x, id) =>
  id
  |> activatableOptionToSelectOptionId
  >>= Ley.Function.flip(SelectOptionMap.lookup, selectOptions(x));

/**
 * Get a selection option's name with the given id from given wiki entry.
 * Returns `None` if not found.
 */
let getSelectOptionName = (x, id) =>
  id |> getSelectOption(x) <&> (y => y.name);

/**
 * Get a selection option's cost with the given id from given wiki entry.
 * Returns `None` if not found.
 */
let getSelectOptionCost = (x, id) =>
  id |> getSelectOption(x) >>= (y => y.cost);

/**
 * Get all select option IDs from the given entry at the passed index.
 */
let getActiveOptions = (index, x: Hero.Activatable.t) =>
  x.active
  |> mapOption((y: Hero.Activatable.single) =>
       Ley.List.Safe.atMay(y.options, index)
     );

/**
 * Get all first select option IDs from the given entry.
 */
let getActiveOptions1 = (x: Hero.Activatable.t) =>
  x.active
  |> mapOption((y: Hero.Activatable.single) => y.options |> listToOption);

/**
 * Get all second select option IDs from the given entry.
 */
let getActiveOptions2 = getActiveOptions(1);

let getOption = (index, heroEntry) =>
  Ley.List.Safe.atMay(heroEntry.options, index);

let getOption1 = heroEntry => heroEntry.options |> Ley.Option.listToOption;

let getOption2 = getOption(1);

let getOption3 = getOption(2);

let getCustomInput = (option: Hero.Activatable.optionId) =>
  switch (option) {
  | `CustomInput(x) => Some(x)
  | `Generic(_)
  | `Skill(_)
  | `CombatTechnique(_)
  | `Spell(_)
  | `LiturgicalChant(_)
  | `Cantrip(_)
  | `Blessing(_)
  | `SpecialAbility(_) => None
  };

let getGenericId = (option: Hero.Activatable.optionId) =>
  switch (option) {
  | `Generic(x) => Some(x)
  | `Skill(_)
  | `CombatTechnique(_)
  | `Spell(_)
  | `LiturgicalChant(_)
  | `Cantrip(_)
  | `Blessing(_)
  | `SpecialAbility(_)
  | `CustomInput(_) => None
  };

let lookupMap = (k, mp, f) => f <$> Ley.IntMap.lookup(k, mp);

let getSkillFromOption =
    (staticData: Static.t, option: Hero.Activatable.optionId) =>
  switch (option) {
  | `Skill(id) => Ley.IntMap.lookup(id, staticData.skills)
  | `Generic(_)
  | `CombatTechnique(_)
  | `Spell(_)
  | `LiturgicalChant(_)
  | `Cantrip(_)
  | `Blessing(_)
  | `SpecialAbility(_)
  | `CustomInput(_) => None
  };

// type SecondarySelections = OrderedMap<number | string, List<string | number>>
//
// /**
//  * Get all `ActiveObject.sid2` values from the given instance, sorted by
//  * `ActiveObject.sid` in Map.
//  * @param entry
//  */
// export const getActiveSecondarySelections =
//   fmap (pipe (
//               ADA.active,
//               foldl ((map: SecondarySelections) => (selection: Record<ActiveObject>) =>
//                       fromOption (map)
//                                 (liftM2<string | number, string | number, SecondarySelections>
//                                   (id => id2 => alter<List<string | number>>
//                                     (pipe (
//                                       fmap (consF (id2)),
//                                       altF (Some (List (id2)))
//                                     ))
//                                     (id)
//                                     (map))
//                                   (AOA.sid (selection))
//                                   (AOA.sid2 (selection))))
//                     (OrderedMap.empty)
//             ))
//
// /**
//  * Get all `DependencyObject.sid` values from the given instance.
//  * @param obj The entry.
//  */
// export const getRequiredSelections:
//   (m: Option<Record<ActivatableDependent>>) => Option<List<string | number | List<number>>> =
//     fmap (pipe (
//       ADA.dependencies,
//       mapOption<ActivatableDependency, string | number | List<number>> (pipe (
//         ensure (isRecord),
//         bindF (DependencyObject.A.sid)
//       ))
//     ))
// /**
//  * Modifies the select options of specific entries to match current conditions.
//  */
// const modifySelectOptions =
//   (staticData: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (hero_magical_traditions: List<Record<ActivatableDependent>>) =>
//   (wiki_entry: Activatable) =>
//   (mhero_entry: Maybe<Record<ActivatableDependent>>): ident<Maybe<List<Record<SelectOption>>>> => {
//     const current_id = AAL.id (wiki_entry)
//     const isAvailable =
//       composeT (
//         filterT (isEntryAvailable (SDA.books (staticData))
//                                   (RA.enabledRuleBooks (HA.rules (hero)))
//                                   (RA.enableAllRuleBooks (HA.rules (hero)))
//                                   (SOA.src)),
//         filterT (pipe (
//           SOA.prerequisites,
//           Maybe.all (reqs => validatePrerequisites (staticData)
//                                                    (hero)
//                                                    (reqs)
//                                                    (current_id))
//         ))
//       )
//     const isNoRequiredOrActiveSelection =
//       composeT (isAvailable, filterT (isNotRequiredNotActive (mhero_entry)))
//     const isNoRequiredSelection =
//       composeT (isAvailable, filterT (isNotRequired (mhero_entry)))
//     switch (current_id) {
//       case AdvantageId.exceptionalSkill: {
//         const hasLessThanTwoSameIdActiveSelections = filterT (areNoSameActive (mhero_entry))
//         return fmap (filterMapListT (composeT (
//                                       isNoRequiredSelection,
//                                       hasLessThanTwoSameIdActiveSelections
//                                     )))
//       }
//       case DisadvantageId.personalityFlaw: {
//         const unique_selections = maybe (List<number> ())
//                                         (pipe (
//                                           getActiveSelections,
//                                           filter (isNumber),
//                                           nub
//                                         ))
//                                         (mhero_entry)
//         const isInfiniteActive: (id: number) => (x: Record<SelectOption>) => boolean =
//           id => x => SOA.id (x) === id && elem (id) (unique_selections)
//         const isPrejudiceAndActive = isInfiniteActive (7)
//         const isUnworldlyAndActive = isInfiniteActive (8)
//         const isNotActiveAndMaxNotReached: (x: Record<SelectOption>) => boolean =
//           x => isNotActive (mhero_entry) (x)
//                && isNotRequired (mhero_entry) (x)
//                && flength (unique_selections) < 2
//         const filterOptions =
//           composeT (
//             isAvailable,
//             filterT (a => isPrejudiceAndActive (a)
//                           || isUnworldlyAndActive (a)
//                           || isNotActiveAndMaxNotReached (a))
//           )
//         return fmap (filterMapListT (filterOptions))
//       }
//       case DisadvantageId.negativeTrait:
//       case DisadvantageId.maimed:
//         return fmap (filterMapListT (isNoRequiredOrActiveSelection))
//       case DisadvantageId.incompetent: {
//         const isAdvActive =
//           pipe (lookupF (HA.advantages (hero)), isMaybeActive)
//         const isNotSocialSkill = notP (isSocialSkill (staticData))
//         return fmap (filterMapListT (composeT (
//                                       isNoRequiredOrActiveSelection,
//                                       filterT (e =>
//                                         // Socially Adaptable and Inspire Confidence
//                                         // require no Incompetence in social skills
//                                         (isAdvActive (AdvantageId.sociallyAdaptable)
//                                         || isAdvActive (AdvantageId.inspireConfidence)
//                                           ? isNotSocialSkill (e)
//                                           : true))
//                                     )))
//       }
//       case SpecialAbilityId.skillSpecialization: {
//         const mcounter = getActiveSecondarySelections (mhero_entry)
//         return fmap (filterMapListT (composeT (
//           isNoRequiredSelection,
//           filterT (e => {
//             const curr_select_id = SOA.id (e)
//             // if mcounter is available, mhero_entry must be a Just and thus
//             // there can be active selections
//             if (isJust (mcounter)) {
//               const counter = fromJust (mcounter)
//               if (member (curr_select_id) (counter)) {
//                 return isAddExistSkillSpecAllowed (hero)
//                                                   (counter)
//                                                   (curr_select_id)
//               }
//             }
//             // otherwise we only need to check if the skill rating is at
//             // least 6, as there can't be an activated selection.
//             return isAddNotExistSkillSpecAllowed (hero) (curr_select_id)
//           }),
//           mapT (e => {
//             const curr_select_id = SOA.id (e)
//             const mcounts = bind (mcounter) (lookup (curr_select_id))
//             const adjustSelectOption =
//               pipe (
//                 over (SOL.cost)
//                      (isJust (mcounts)
//                        // Increase cost if there are active specializations
//                        // for the same skill
//                        ? fmap (multiply (flength (fromJust (mcounts)) + 1))
//                        // otherwise return current cost
//                        : ident),
//                 over (SOL.applications)
//                      (fmap (filter (app => {
//                                      const isInactive =
//                                        all (notElem<number | string>
//                                              (AppA.id (app)))
//                                            (mcounts)
//                                      const arePrerequisitesMet =
//                                        validatePrerequisites (staticData)
//                                                              (hero)
//                                                              (maybeToList (AppA.prerequisite (app)))
//                                                              (current_id)
//                                      return isInactive
//                                        && arePrerequisitesMet
//                                    })))
//               )
//             return adjustSelectOption (e)
//           })
//         )))
//       }
//       case prefixSA (SpecialAbilityId.traditionGuildMages): {
//         return fmap (filterUnfamiliar (pipe (
//                                         SpA.tradition,
//                                         trads => notElem (MagicalTradition.General) (trads)
//                                                  && notElem (MagicalTradition.GuildMages) (trads)
//                                       ))
//                                       (staticData))
//       }
//       case SpecialAbilityId.propertyKnowledge: {
//         const isValidProperty =
//           filterT (pipe (SOA.id, elemF<string | number> (getPropsWith3Gte10 (staticData) (hero))))
//         return fmap (filterMapListT (composeT (
//                                       isNoRequiredOrActiveSelection,
//                                       isValidProperty
//                                     )))
//       }
//       case SpecialAbilityId.propertyFocus: {
//         const isActivePropertyKnowledge =
//           filterT (notP (pipe_ (
//                           hero,
//                           HA.specialAbilities,
//                           lookup<string> (SpecialAbilityId.propertyKnowledge),
//                           isNotActive
//                         )))
//         return fmap (filterMapListT (composeT (
//                                       isNoRequiredOrActiveSelection,
//                                       isActivePropertyKnowledge
//                                     )))
//       }
//       case SpecialAbilityId.aspectKnowledge: {
//         const valid_aspects = getAspectsWith3Gte10 (staticData) (hero)
//         const isAspectValid = pipe (SOA.id, elemF<string | number> (valid_aspects))
//         return maybe (ident as ident<Maybe<List<Record<SelectOption>>>>)
//                      ((blessed_trad: Record<ActivatableDependent>) =>
//                        fmap (filterMapListT (composeT (
//                                               filterT (pipe (
//                                                 SOA.id,
//                                                 ensure (isNumber),
//                                                 bindF (pipe (
//                                                   getTraditionOfAspect,
//                                                   mapBlessedNumIdToTradId
//                                                 )),
//                                                 Maybe.elem (AAL.id (blessed_trad))
//                                               )),
//                                               isNoRequiredOrActiveSelection,
//                                               filterT (isAspectValid)
//                                             ))))
//                      (getBlessedTradition (HA.specialAbilities (hero)))
//       }
//       case SpecialAbilityId.adaptionZauber: {
//         const isWikiEntryFromUnfamiliarTrad =
//           isUnfamiliarSpell (HA.transferredUnfamiliarSpells (hero))
//                             (hero_magical_traditions)
//         const isSpellAbove10 =
//           pipe (
//             SOA.id,
//             ensure (isString),
//             bindF (lookupF (HA.spells (hero))),
//             maybe (false) (pipe (ASDA.value, gte (10)))
//           )
//         const isFromUnfamiliarTrad =
//           pipe (
//             SOA.id,
//             ensure (isString),
//             bindF (lookupF (SDA.spells (staticData))),
//             maybe (false) (isWikiEntryFromUnfamiliarTrad)
//           )
//         return fmap (filterMapListT (composeT (
//                                       isNoRequiredOrActiveSelection,
//                                       filterT (isSpellAbove10),
//                                       filterT (isFromUnfamiliarTrad)
//                                     )))
//       }
//       case prefixSA (SpecialAbilityId.spellEnhancement):
//       case prefixSA (SpecialAbilityId.chantEnhancement): {
//         const getTargetHeroEntry = current_id === prefixSA (SpecialAbilityId.spellEnhancement)
//           ? bindF (lookupF (HA.spells (hero)))
//           : bindF (lookupF (HA.liturgicalChants (hero)))
//         const getTargetWikiEntry:
//           ((x: Maybe<string>) => Maybe<Record<Spell> | Record<LiturgicalChant>>) =
//           current_id === prefixSA (SpecialAbilityId.spellEnhancement)
//             ? bindF (lookupF (SDA.spells (staticData)))
//             : bindF (lookupF (SDA.liturgicalChants (staticData)))
//         const isNotUnfamiliar =
//           (x: Record<Spell> | Record<LiturgicalChant>) =>
//             LiturgicalChant.is (x)
//             || !isUnfamiliarSpell (HA.transferredUnfamiliarSpells (hero))
//                                   (hero_magical_traditions)
//                                   (x)
//         return fmap (foldr (isNoRequiredOrActiveSelection (e => {
//                              const mtarget_hero_entry = getTargetHeroEntry (SOA.target (e))
//                              const mtarget_wiki_entry = getTargetWikiEntry (SOA.target (e))
//                              if (
//                                isJust (mtarget_wiki_entry)
//                                && isJust (mtarget_hero_entry)
//                                && isNotUnfamiliar (fromJust (mtarget_wiki_entry))
//                                && ASDA.value (fromJust (mtarget_hero_entry))
//                                   >= maybe (0)
//                                            (pipe (multiply (4), add (4)))
//                                            (SOA.level (e))
//                              ) {
//                                const target_wiki_entry = fromJust (mtarget_wiki_entry)
//                                return consF (
//                                  set (SOL.name)
//                                      (`${SpAL.name (target_wiki_entry)}: ${SOA.name (e)}`)
//                                      (e)
//                                )
//                              }
//                              return ident as ident<List<Record<SelectOption>>>
//                            }))
//                            (List ()))
//       }
//       case SpecialAbilityId.languageSpecializations: {
//         return pipe_ (
//           staticData,
//           SDA.specialAbilities,
//           lookup<string> (SpecialAbilityId.language),
//           bindF (AAL.select),
//           maybe (cnst (Nothing) as ident<Maybe<List<Record<SelectOption>>>>)
//                 (current_select => {
//                   const available_langs =
//                           // Pair: fst = sid, snd = current_level
//                     maybe (List<Pair<number, number>> ())
//                           (pipe (
//                             ADA.active,
//                             foldr ((obj: Record<ActiveObject>) =>
//                                     pipe_ (
//                                       obj,
//                                       AOA.tier,
//                                       bindF (current_level =>
//                                               pipe_ (
//                                                 guard (is3or4 (current_level)),
//                                                 thenF (AOA.sid (obj)),
//                                                 misNumberM,
//                                                 fmap (current_sid =>
//                                                        consF (Pair (
//                                                                current_sid,
//                                                                current_level
//                                                              )))
//                                               )),
//                                       fromMaybe (
//                                         ident as ident<List<Pair<number, number>>>
//                                       )
//                                     ))
//                                   (List ())
//                           ))
//                           (pipe_ (
//                             hero,
//                             HA.specialAbilities,
//                             lookup<string> (SpecialAbilityId.language)
//                           ))
//                   const filterLanguages =
//                     foldr (isNoRequiredOrActiveSelection
//                           (e => {
//                             const lang =
//                               find ((l: Pair<number, number>) =>
//                                      fst (l) === SOA.id (e))
//                                    (available_langs)
//                             if (isJust (lang)) {
//                               const isMotherTongue =
//                                 snd (fromJust (lang)) === 4
//                               if (isMotherTongue) {
//                                 return consF (set (SOL.cost) (Just (0)) (e))
//                               }
//                               return consF (e)
//                             }
//                             return ident as ident<List<Record<SelectOption>>>
//                           }))
//                           (List ())
//                   return cnst (Just (filterLanguages (current_select)))
//                 })
//         )
//       }
//       case SpecialAbilityId.madaschwesternStil: {
//         return fmap (filterUnfamiliar (pipe (
//                                         SpA.tradition,
//                                         trads => notElem (MagicalTradition.General) (trads)
//                                                  && notElem (MagicalTradition.Witches) (trads)
//                                       ))
//                                       (staticData))
//       }
//       case SpecialAbilityId.scholarDesMagierkollegsZuHoningen: {
//         const allowed_traditions = List (
//                                      MagicalTradition.Druids,
//                                      MagicalTradition.Elves,
//                                      MagicalTradition.Witches
//                                    )
//         const mtransferred_spell_trads = pipe_ (
//                                            HA.specialAbilities (hero),
//                                            lookup (prefixSA (SpecialAbilityId.traditionGuildMages)),
//                                            bindF (pipe (ADA.active, listToMaybe)),
//                                            bindF (pipe (AOA.sid, isStringM)),
//                                            bindF (lookupF (SDA.spells (staticData))),
//                                            fmap (SpA.tradition)
//                                          )
//         if (isNothing (mtransferred_spell_trads)) {
//           return ident
//         }
//         const transferred_spell_trads = fromJust (mtransferred_spell_trads)
//         // Contains all allowed trads the first spell does not have
//         const trad_diff = filter (notElemF (transferred_spell_trads))
//                                  (allowed_traditions)
//         const has_transferred_all_traditions_allowed = fnull (trad_diff)
//         return fmap (filterUnfamiliar (pipe (
//                                         SpA.tradition,
//                                         has_transferred_all_traditions_allowed
//                                           ? trads =>
//                                               notElem (MagicalTradition.General) (trads)
//                                               && List.any (elemF (allowed_traditions)) (trads)
//                                           : trads =>
//                                               notElem (MagicalTradition.General) (trads)
//                                               && List.any (elemF (trad_diff)) (trads)
//                                       ))
//                                       (staticData))
//       }
//       default:
//         return fmap (filterMapListT (isNoRequiredOrActiveSelection))
//     }
