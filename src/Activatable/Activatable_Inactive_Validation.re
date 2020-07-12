module F = Ley_Function;
module IM = Ley_IntMap;
module L = Ley_List;

type matchingLanguagesScripts = {
  // `true` if an entry that requires to have matching languages and scripts
  // is active
  isEntryActiveRequiringMatch: bool,
  languagesWithMatchingScripts: list(int),
  scriptsWithMatchingLanguages: list(int),
};

type inactiveValidationCache = {
  specialAbilityPairs:
    Ley_IntMap.t((SpecialAbility.t, option(Hero.Activatable.t))),
  combatStyleCombination: option(Hero.Activatable.t),
  magicalStyleCombination: option(Hero.Activatable.t),
  dunklesAbbild: option(Hero.Activatable.t),
  activePactGiftsCount: int,
  matchingLanguagesScripts,
  validExtendedSpecialAbilities: list(int),
  requiredApplyToMagicalActions: bool,
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
      ~maybePact,
      {
        specialAbilityPairs,
        combatStyleCombination,
        magicalStyleCombination,
        dunklesAbbild,
        activePactGiftsCount,
        matchingLanguagesScripts,
        _,
      },
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

let getFlatFirstPrerequisites =
  fun
  | Static.Advantage(staticAdvantage) =>
    Prerequisites.Flatten.getFirstDisAdvLevelPrerequisites(
      staticAdvantage.prerequisites,
    )
  | Disadvantage(staticDisadvantage) =>
    Prerequisites.Flatten.getFirstDisAdvLevelPrerequisites(
      staticDisadvantage.prerequisites,
    )
  | SpecialAbility(staticSpecialAbility) =>
    Prerequisites.Flatten.getFirstLevelPrerequisites(
      staticSpecialAbility.prerequisites,
    );

let isEntrySpecificAdditionEnabled =
    (cache, staticData, hero: Hero.t, staticEntry) =>
  (
    switch (staticEntry) {
    | Static.Advantage(_)
    | Disadvantage(_) => true
    | SpecialAbility(staticSpecialAbility) =>
      isSpecialAbilitySpecificAdditionEnabled(
        ~rules=hero.rules,
        ~maybePact=hero.pact,
        cache,
        staticSpecialAbility,
      )
    }
  )
  && Prerequisites.Validation.arePrerequisitesMet(
       staticData,
       hero,
       Id.Activatable.generalize(Activatable_Accessors.id(staticEntry)),
       getFlatFirstPrerequisites(staticEntry),
     );

let hasNoGenerallyRestrictingDependency =
  fun
  | Some({Hero.Activatable.dependencies, _}) =>
    L.Foldable.all(
      [@warning "-4"]
      (
        fun
        | {
            Hero.Activatable.target: One(_),
            options: [],
            level: None,
            active: false,
            _,
          } =>
          false
        | _ => true
      ),
      dependencies,
    )
  | _ => true;

let hasNotReachedMaximumEntries = (staticEntry, maybeHeroEntry) =>
  switch (Activatable_Accessors.max(staticEntry), maybeHeroEntry) {
  // Impossible maximum level, thus no addition possible
  | (Some(0), _) => false
  | (Some(max), Some(({active, _}: Hero.Activatable.t))) =>
    max > L.Foldable.length(active)
  | (Some(_), None)
  | (None, _) => true
  };

let isValidExtendedSpecialAbility =
    ({validExtendedSpecialAbilities, _}, staticEntry) =>
  switch (staticEntry) {
  | Static.Advantage(_)
  | Disadvantage(_) => true
  | SpecialAbility(staticSpecialAbility) =>
    [@warning "-4"]
    Id.SpecialAbility.Group.(
      switch (fromInt(staticSpecialAbility.gr)) {
      | CombatExtended
      | MagicalExtended
      | KarmaExtended
      | SkillExtended =>
        L.elem(staticSpecialAbility.id, validExtendedSpecialAbilities)
      | _ => true
      }
    )
  };

let appliesToMagicalActionsIfRequired =
    ({requiredApplyToMagicalActions, _}, staticEntry) =>
  switch (staticEntry) {
  | Static.Advantage(staticAdvantage) =>
    !requiredApplyToMagicalActions
    || !staticAdvantage.isExclusiveToArcaneSpellworks
  | Disadvantage(staticDisadvantage) =>
    !requiredApplyToMagicalActions
    || !staticDisadvantage.isExclusiveToArcaneSpellworks
  | SpecialAbility(_) => true
  };

let isAdditionValid = (cache, staticData, hero, staticEntry, maybeHeroEntry) =>
  isEntrySpecificAdditionEnabled(cache, staticData, hero, staticEntry)
  && hasNoGenerallyRestrictingDependency(maybeHeroEntry)
  && hasNotReachedMaximumEntries(staticEntry, maybeHeroEntry)
  && isValidExtendedSpecialAbility(cache, staticEntry)
  && appliesToMagicalActionsIfRequired(cache, staticEntry);
