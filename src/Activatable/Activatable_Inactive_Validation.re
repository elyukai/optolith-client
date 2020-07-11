module F = Ley_Function;
module IM = Ley_IntMap;
module L = Ley_List;
module O = Ley_Option;
module SM = Ley_StrMap;

type matchingLanguagesScripts = {
  // `true` if an entry that requires to have matching languages and scripts
  // is active
  isEntryActiveRequiringMatch: bool,
  languagesWithMatchingScripts: list(int),
  scriptsWithMatchingLanguages: list(int),
};

let getActivePactGiftsCount = specialAbilityPairs =>
  specialAbilityPairs
  |> EntryGroups.SpecialAbility.getFromGroup(Paktgeschenke)
  |> IM.Foldable.foldr(
       fun
       | (
           {SpecialAbility.prerequisites, apValue, levels, _},
           Some(({active, _}: Hero.Activatable.t) as heroEntry),
         )
           when Activatable_Accessors.isActive(heroEntry) =>
         [@warning "-4"]
         (
           switch (
             IM.Foldable.null(prerequisites.levels),
             apValue,
             levels,
             active,
           ) {
           | (
               // It must have different prerequisites for each level
               false,
               // It must have different cost per level
               Some(PerLevel(_)),
               // It must have levels
               Some(_),
               // The current level must be set
               [{level: Some(level), _}, ..._],
             ) =>
             // Then each level counts as one activated pact present
             (+)(level)
           | _ => (+)(1)
           }
         )
       | _ => F.id,
       0,
     );

let isSpecialAbilitySpecificAdditionEnabled =
    (
      ~rules: Hero.Rules.t,
      ~specialAbilityPairs,
      ~combatStyleCombination,
      ~magicalStyleCombination,
      ~dunklesAbbild,
      ~activePactGiftsCount,
      ~maybePact,
      ~matchingLanguagesScripts,
      specialAbility: SpecialAbility.t,
    ) =>
  [@warning "-4"]
  Id.SpecialAbility.(
    switch (fromInt(specialAbility.id), Group.fromInt(specialAbility.gr)) {
    | (_, CombatStylesArmed | CombatStylesUnarmed) =>
      // Combination-SA is active, which allows 3 styles to be active, but only a
      // maximum of 2 from one type (armed/unarmed).
      if (Activatable_Accessors.isActiveM(combatStyleCombination)) {
        let totalActive =
          EntryGroups.SpecialAbility.countActiveFromGroups(
            [CombatStylesArmed, CombatStylesUnarmed],
            specialAbilityPairs,
          );

        let equalTypeStylesActive =
          EntryGroups.SpecialAbility.countActiveFromGroup(
            Id.SpecialAbility.Group.fromInt(specialAbility.gr),
            specialAbilityPairs,
          );

        totalActive < 3 || equalTypeStylesActive < 2;
      } else {
        !
          EntryGroups.SpecialAbility.hasActiveFromGroup(
            Id.SpecialAbility.Group.fromInt(specialAbility.gr),
            specialAbilityPairs,
          );
          // Otherwise, only one of each type can be active.
      }

    | (_, MagicalStyles) =>
      let totalActive =
        EntryGroups.SpecialAbility.countActiveFromGroup(
          MagicalStyles,
          specialAbilityPairs,
        );

      totalActive
      < (Activatable_Accessors.isActiveM(magicalStyleCombination) ? 2 : 1);

    | (_, BlessedStyles as group | SkillStyles as group) =>
      !
        EntryGroups.SpecialAbility.hasActiveFromGroup(
          group,
          specialAbilityPairs,
        )

    | (CombatStyleCombination, _) =>
      !
        EntryGroups.SpecialAbility.hasActiveFromGroups(
          [CombatStylesArmed, CombatStylesUnarmed],
          specialAbilityPairs,
        )

    | (MagicStyleCombination, _) =>
      !
        EntryGroups.SpecialAbility.hasActiveFromGroup(
          MagicalStyles,
          specialAbilityPairs,
        )

    | (DunklesAbbildDerBuendnisgabe, _) =>
      !
        EntryGroups.SpecialAbility.hasActiveFromGroup(
          Paktgeschenke,
          specialAbilityPairs,
        )

    | (WegDerSchreiberin, _) =>
      L.Foldable.length(matchingLanguagesScripts.languagesWithMatchingScripts)
      >= 1
      && L.Foldable.length(
           matchingLanguagesScripts.scriptsWithMatchingLanguages,
         )
      >= 1

    | (_, Paktgeschenke) =>
      switch (maybePact) {
      | Some((pact: Hero.Pact.t)) =>
        switch (Id.Pact.fromInt(pact.category)) {
        | Faery =>
          !Activatable_Accessors.isActiveM(dunklesAbbild)
          && pact.level > activePactGiftsCount
        | Demon =>
          // Minor Pact
          pact.level <= 0
            // Minor Pact only allows up to 3 pact gifts
            ? activePactGiftsCount < 3
            // "Normal" Pact allows up to CoD + 7 pact gifts
            : pact.level + 7 > activePactGiftsCount
        | Other(_) => false
        }
      | None => false
      }

    | (LanguageSpecializations, _) =>
      IM.member(
        Id.OptionalRule.toInt(LanguageSpecialization),
        rules.activeOptionalRules,
      )

    | (_, Vampirismus | Lykanthropie) =>
      // TODO: add option to activate vampire or lycanthropy and activate this
      //       SAs based on that option
      false

    | _ => true
    }
  );
//
// /**
//  * Checks if you can somehow add an ActiveObject to the given entry.
//  * @param state The present state of the current hero.
//  * @param instance The entry.
//  */
// const isAdditionDisabledEntrySpecific =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
//   (wiki_entry: Activatable): boolean =>
//     (
//       SpecialAbility.is (wiki_entry)
//       && isAdditionDisabledSpecialAbilitySpecific (wiki)
//                                                   (hero)
//                                                   (matching_script_and_lang_related)
//                                                   (wiki_entry)
//     )
//     || !validatePrerequisites (wiki)
//                               (hero)
//                               (getFirstLevelPrerequisites (AAL.prerequisites (wiki_entry)))
//                               (AAL.id (wiki_entry))
//
// const hasGeneralRestrictionToAdd =
//   any (pipe (ADA.dependencies, elem<ActivatableDependency> (false)))
//
// const hasReachedMaximumEntries =
//   (wiki_entry: Activatable) =>
//   (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
//     any (lte (fromMaybe (0)
//                         (fmap (pipe (ADA.active, flength))
//                               (mhero_entry))))
//         (AAL.max (wiki_entry))
//
// const hasReachedImpossibleMaximumLevel = Maybe.elem (0)
//
// const isInvalidExtendedSpecialAbility =
//   (wiki_entry: Activatable) =>
//   (validExtendedSpecialAbilities: List<string>) =>
//     CheckStyleUtils.isExtendedSpecialAbility (wiki_entry)
//     && notElem (AAL.id (wiki_entry)) (validExtendedSpecialAbilities)
//
// const doesNotApplyToMagActionsThoughRequired =
//   (required_apply_to_mag_actions: boolean) =>
//   (wiki_entry: Activatable): boolean =>
//     SpecialAbility.is (wiki_entry)
//     ? false
//     : required_apply_to_mag_actions && Advantage.AL.isExclusiveToArcaneSpellworks (wiki_entry)
//
// /**
//  * Checks if the given entry can be added.
//  * @param obj
//  * @param state The current hero's state.
//  */
// export const isAdditionDisabled =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (required_apply_to_mag_actions: boolean) =>
//   (validExtendedSpecialAbilities: List<string>) =>
//   (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
//   (wiki_entry: Activatable) =>
//   (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
//   (max_level: Maybe<number>): boolean =>
//     isAdditionDisabledEntrySpecific (wiki) (hero) (matching_script_and_lang_related) (wiki_entry)
//     || hasGeneralRestrictionToAdd (mhero_entry)
//     || hasReachedMaximumEntries (wiki_entry) (mhero_entry)
//     || hasReachedImpossibleMaximumLevel (max_level)
//     || isInvalidExtendedSpecialAbility (wiki_entry) (validExtendedSpecialAbilities)
//     || doesNotApplyToMagActionsThoughRequired (required_apply_to_mag_actions) (wiki_entry)
//
