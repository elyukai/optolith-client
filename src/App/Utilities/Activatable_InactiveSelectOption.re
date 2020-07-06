open Static.SelectOption;
open Ley.Option.Functor;
open Ley.Option.Monad;
open Activatable_Convert;
open Activatable_Accessors;
open Activatable_SelectOptions;

module F = Ley.Function;
module SO = Static.SelectOption;
module SOM = Static.SelectOption.SelectOptionMap;
module L = Ley.List;
module O = Ley.Option;
module T = Ley.Transducer;
module IM = Ley.IntMap;

open T;

/**
 * Test if the id of the passed select option is activated for the passed
 * `ActivatableDependent`.
 */
let isNotActive = maybeHeroEntry =>
  maybeHeroEntry
  |> O.option([], getActiveSelectOptions1)
  |> (
    (activeSelections, {id}: SO.t) =>
      L.Foldable.notElem(id, activeSelections)
  );

/**
 * Test if a select option is not activated more than once for the passed
 * `ActivatableDependent`.
 */
let areNoSameActive = maybeHeroEntry =>
  maybeHeroEntry
  |> O.option([], getActiveSelectOptions1)
  |> ((activeSelections, {id}: SO.t) => L.countMax(id, 1, activeSelections));

/**
 * `isNotRequired otherActivatables maybeHeroEntry so` returns if the id of the
 * passed select option `so` is required for the passed Activatable
 * `maybeHeroEntry`. `otherActivatables` should be a map of the Activatables
 * from the same group ()
 */
let isNotRequired = (otherActivatables, maybeHeroEntry) =>
  maybeHeroEntry
  |> O.option(
       [],
       Dependencies.Flatten.getRequiredSelectOptions1(otherActivatables),
     )
  |> (
    (applicableOptions, {id}: SO.t) =>
      L.Foldable.all(
        fun
        | OneOrMany.One(option) => option != id
        | Many(options) => L.Foldable.notElem(id, options),
        applicableOptions,
      )
  );

/**
 * `isNotRequiredNotActive :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if the id of the passed select option is neither required nor activated
 * for the passed `ActivatableDependent`.
 */
let isNotRequiredNotActive = (otherActivatables, maybeHeroEntry) => {
  let isNoActiveSelection = isNotActive(maybeHeroEntry);
  let isNoRequiredSelection =
    isNotRequired(otherActivatables, maybeHeroEntry);

  so => isNoActiveSelection(so) && isNoRequiredSelection(so);
};

/**
 * Returns a transducer to check if an item is available and if their
 * prerequisites are met.
 */
let isValid = (staticData: Static.t, hero: Hero.t, entryId, fold) =>
  fold
  >>~ EntryAvailability.isAvailableNull(
        (x: Static.SelectOption.t) => x.src,
        staticData.publications,
        hero.rules,
      )
  >>~ (
    x =>
      x.prerequisites
      |> F.flip(Prerequisites.Flatten.flattenPrerequisites, [])
      |> Prerequisites.Validation.arePrerequisitesMet(
           staticData,
           hero,
           entryId,
         )
  );

/**
 * Returns a transducer to check if an item is available, if their
 * prerequisites are met, and if its neither active nor required.
 */
let isNoGenericRequiredOrActiveSelection =
    (staticData, hero, maybeHeroEntry, otherActivatables, entryId, fold) =>
  fold
  |> isValid(staticData, hero, entryId)
  >>~ isNotRequiredNotActive(otherActivatables, maybeHeroEntry);

/**
 * Returns a transducer to check if an item is available, if their
 * prerequisites are met, and if its not required.
 */
let isNoGenericRequiredSelection =
    (staticData, hero, maybeHeroEntry, otherActivatables, entryId, fold) =>
  fold
  |> isValid(staticData, hero, entryId)
  >>~ isNotRequired(otherActivatables, maybeHeroEntry);

let getAvailableSelectOptions =
    (staticData: Static.t, hero: Hero.t, staticEntry, maybeHeroEntry) => {
  let allSelectOptions =
    Activatable_Accessors.selectOptions(staticEntry)
    |> SO.SelectOptionMap.elems;

  // Prefill some parameters
  let isValidShort = isValid(staticData, hero);

  // Prefill some parameters
  let isNoGenericRequiredOrActiveSelectionShort =
    isNoGenericRequiredOrActiveSelection(staticData, hero, maybeHeroEntry);

  // Prefill some parameters
  let isNoGenericRequiredSelectionShort =
    isNoGenericRequiredSelection(staticData, hero, maybeHeroEntry);

  switch ((staticEntry: Static.activatable)) {
  | Advantage(staticAdvantage) =>
    let id = `Advantage(staticAdvantage.id);

    let isNoRequiredOrActiveSelection =
      isNoGenericRequiredOrActiveSelectionShort(hero.advantages, id);

    let isNoRequiredSelection =
      isNoGenericRequiredSelectionShort(hero.advantages, id);

    switch (Id.advantageFromInt(staticAdvantage.id)) {
    | ExceptionalSkill =>
      transduceList(
        fold =>
          // There shouldnt be more than two activations for the same skill
          fold |> isNoRequiredSelection >>~ areNoSameActive(maybeHeroEntry),
        allSelectOptions,
      )
    | _ => []
    };
  | Disadvantage(staticDisadvantage) =>
    let id = `Disadvantage(staticDisadvantage.id);

    let isNoRequiredOrActiveSelection =
      isNoGenericRequiredOrActiveSelectionShort(hero.disadvantages, id);

    let isNoRequiredSelection =
      isNoGenericRequiredSelectionShort(hero.disadvantages, id);

    switch (Id.disadvantageFromInt(staticDisadvantage.id)) {
    | PersonalityFlaw =>
      // List of unique active select options
      let uniqueSelections =
        O.option(
          [],
          heroEntry =>
            heroEntry
            |> getActiveOptions1
            |> O.mapOption(
                 fun
                 | `Generic(id) => Some(id)
                 | _ => None,
               ),
          maybeHeroEntry,
        );

      // Checks if the passed id either matches the passed select option's id
      // and is already active.
      let isInfiniteActive = (id, selectOption: SO.t) =>
        selectOption.id === id
        && (
          switch (id) {
          | `Generic(id) => L.elem(id, uniqueSelections)
          | _ => false
          }
        );

      // Checks if the passed select option is Prejudice and if Prejudice is
      // already active.
      let isPrejudiceAndActive = isInfiniteActive(`Generic(7));

      // Checks if the passed select option is Unworldly and if Unworldly is
      // already active.
      let isUnworldlyAndActive = isInfiniteActive(`Generic(8));

      // Checks if the passed select option is not active, not required and if
      // there is a maximum of one other unique select option of this entry
      // active.
      let isNotActiveAndMaxNotReached = selectOption =>
        isNotRequiredNotActive(
          hero.disadvantages,
          maybeHeroEntry,
          selectOption,
        )
        && L.lengthMax(1, uniqueSelections);

      transduceList(
        fold =>
          fold
          |> isValidShort(`Disadvantage(staticDisadvantage.id))
          >>~ (
            x =>
              // If Prejudice is active, it can be activated multiple times
              isPrejudiceAndActive(x)
              // If Unworldly is active, it can be activated multiple times
              || isUnworldlyAndActive(x)
              // If the select option has not been activated yet, there must be
              // a maximum of one other unique activations, since only a maximum
              // of two unique is allowed
              || isNotActiveAndMaxNotReached(x)
          ),
        allSelectOptions,
      );
    | NegativeTrait
    | Maimed => transduceList(isNoRequiredOrActiveSelection, allSelectOptions)
    | Incompetent =>
      // Checks if the advantage with the passed id is active
      let isAdvActive = id =>
        IM.lookup(Id.advantageToInt(id), hero.advantages) |> isActiveM;

      // Checks if the passed select option does not represent a social skill
      let isNotSocialSkill = (so: SO.t) =>
        switch (so.id) {
        | `Skill(id) =>
          IM.lookup(id, staticData.skills)
          |> O.Foldable.any((skill: Static_Skill.t) =>
               skill.gr === Id.skillGroupToInt(Social)
             )
          |> (!)
        | _ => true
        };

      transduceList(
        fold =>
          fold
          |> isNoRequiredOrActiveSelection
          >>~ (
            x =>
              // Socially Adaptable and Inspire Confidence
              // require no Incompetence in social skills
              isAdvActive(SociallyAdaptable)
              || isAdvActive(InspireConfidence)
                ? isNotSocialSkill(x) : true
          ),
        allSelectOptions,
      );
    | _ => []
    };
  | SpecialAbility(staticSpecialAbility) =>
    let id = `SpecialAbility(staticSpecialAbility.id);

    let isNoRequiredOrActiveSelection =
      isNoGenericRequiredOrActiveSelectionShort(hero.specialAbilities, id);

    let isNoRequiredSelection =
      isNoGenericRequiredSelectionShort(hero.specialAbilities, id);

    switch (Id.specialAbilityFromInt(staticSpecialAbility.id)) {
    | SkillSpecialization =>
      let isFirstSpecializationValid = id =>
        IM.lookup(id, hero.skills)
        |> O.option(false, (skill: Hero.Skill.t)
             // Skill Rating must be at least 6 for 1st specialization
             => skill.value >= 6);

      let isAdditionalSpecializationValid = (counter, selectOption: SO.t, id) =>
        liftM2(
          (skill: Hero.Skill.t, activeApps) =>
            // Maximum of three is allowed
            L.lengthMax(2, activeApps)
            // Skill Rating must be at least 6/12/18 for 1st/2nd/3rd specialization
            && skill.value >= (L.Foldable.length(activeApps) + 1)
            * 6,
          IM.lookup(id, hero.skills),
          SOM.lookup(selectOption.id, counter),
        )
        |> O.Foldable.dis;

      let isAdditionalSpecializationValidLookup =
        switch (maybeHeroEntry <&> getActiveOptions2Map) {
        // if counter is available, maybeHeroEntry must be a Some and thus there
        // can be active selections
        | Some(counter) =>
          transduceList(
            fold =>
              fold
              |> isNoRequiredSelection
              >>~ (
                selectOption =>
                  switch (selectOption.id) {
                  | `Skill(id) =>
                    SOM.member(selectOption.id, counter)
                      ? isAdditionalSpecializationValid(
                          counter,
                          selectOption,
                          id,
                        )
                      : isFirstSpecializationValid(id)
                  | _ => true
                  }
              ),
            allSelectOptions,
          )
        // otherwise we only need to check if the skill rating is at least 6, as
        // there can't be an activated selection.
        | None =>
          transduceList(
            fold =>
              fold
              |> isNoRequiredSelection
              >>~ (
                selectOption =>
                  switch (selectOption.id) {
                  | `Skill(id) => isFirstSpecializationValid(id)
                  | _ => true
                  }
              ),
            allSelectOptions,
          )
        };
      ();
    | _ => []
    };
  };
};
//
// /**
//  * Modifies the select options of specific entries to match current conditions.
//  */
// const modifySelectOptions =
//   (staticData: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (hero_magical_traditions: List<Record<ActivatableDependent>>) =>
//   (wiki_entry: Activatable) =>
//   (mhero_entry: Maybe<Record<ActivatableDependent>>): ident<Maybe<List<Record<SelectOption>>>> => {
//     switch (current_id) {
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
