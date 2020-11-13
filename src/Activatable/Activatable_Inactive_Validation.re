module F = Ley_Function;
module I = Ley_Int;
module IM = Ley_IntMap;
module L = Ley_List;
module O = Ley_Option;

open Activatable_Cache;

let getActivePactGiftsCount = specialAbilityPairs =>
  specialAbilityPairs
  |> EntryGroups.SpecialAbility.getFromGroup(Paktgeschenke)
  |> IM.foldr(
       fun
       | (
           {SpecialAbility.Static.prerequisites, apValue, levels, _},
           Some(({active, _}: Activatable_Dynamic.t) as heroEntry),
         )
           when Activatable_Accessors.isActive(heroEntry) =>
         [@warning "-4"]
         (
           switch (prerequisites, apValue, levels, active) {
           | (
               // It must have different prerequisites for each level
               ByLevel(_),
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
        combatStyleCombination,
        armedCombatStylesCount,
        unarmedCombatStylesCount,
        magicalStyleCombination,
        magicalStylesCount,
        isBlessedStyleActive,
        dunklesAbbild,
        activePactGiftsCount,
        matchingLanguagesScripts,
        _,
      },
      specialAbility: SpecialAbility.Static.t,
    ) =>
  [@warning "-4"]
  Id.SpecialAbility.(
    switch (fromInt(specialAbility.id), Group.fromInt(specialAbility.gr)) {
    | (_, CombatStylesArmed as gr | CombatStylesUnarmed as gr) =>
      let equalTypeStylesActive =
        switch (gr) {
        | CombatStylesArmed => armedCombatStylesCount
        | CombatStylesUnarmed => unarmedCombatStylesCount
        | _ => 0
        };

      // Combination-SA is active, which allows 3 styles to be active, but only a
      // maximum of 2 from one type (armed/unarmed).
      if (Activatable_Accessors.isActiveM(combatStyleCombination)) {
        let totalActive = armedCombatStylesCount + unarmedCombatStylesCount;

        totalActive < 3 || equalTypeStylesActive < 2;
      } else {
        // Otherwise, only one of each type can be active.
        equalTypeStylesActive === 0;
      };

    | (_, MagicalStyles) =>
      magicalStylesCount
      < (Activatable_Accessors.isActiveM(magicalStyleCombination) ? 2 : 1)

    | (_, BlessedStyles) => !isBlessedStyleActive

    | (CombatStyleCombination, _) =>
      armedCombatStylesCount + unarmedCombatStylesCount > 0

    | (MagicStyleCombination, _) => magicalStylesCount > 0

    | (DunklesAbbildDerBuendnisgabe, _) => activePactGiftsCount === 0

    | (WegDerSchreiberin, _) =>
      L.length(matchingLanguagesScripts.languagesWithMatchingScripts) >= 1
      && L.length(matchingLanguagesScripts.scriptsWithMatchingLanguages) >= 1

    | (_, Paktgeschenke) =>
      switch (maybePact) {
      | Some((pact: Pact.Dynamic.t)) =>
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
       Id.Activatable.toAll(Activatable_Accessors.id(staticEntry)),
       Prerequisites.Activatable.getFlatFirstPrerequisites(staticEntry),
     );

let hasNoGenerallyRestrictingDependency =
  fun
  | Some({Activatable_Dynamic.dependencies, _}) =>
    L.all(
      [@warning "-4"]
      (
        fun
        | {
            Activatable_Dynamic.target: One(_),
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

let hasNotReachedMaximumEntries = (maxLevel, maybeHeroEntry) =>
  switch (maxLevel, maybeHeroEntry) {
  // Impossible maximum level, thus no addition possible
  | (Some(0), _) => false
  | (Some(max), Some(({active, _}: Activatable_Dynamic.t))) =>
    max > L.length(active)
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

let isAdditionValid =
    (cache, staticData, hero, maxLevel, staticEntry, maybeHeroEntry) =>
  isEntrySpecificAdditionEnabled(cache, staticData, hero, staticEntry)
  && hasNoGenerallyRestrictingDependency(maybeHeroEntry)
  && hasNotReachedMaximumEntries(maxLevel, maybeHeroEntry)
  && isValidExtendedSpecialAbility(cache, staticEntry)
  && appliesToMagicalActionsIfRequired(cache, staticEntry);

let getMaxLevel = (staticData, hero, staticEntry, maybeHeroEntry) =>
  staticEntry
  |> Prerequisites.Activatable.getLevelPrerequisites
  |> Dependencies.getMaxLevel(
       staticData,
       hero,
       Id.Activatable.toAll(Activatable_Accessors.id(staticEntry)),
       O.option(
         [],
         ({Activatable_Dynamic.dependencies, _}) => dependencies,
         maybeHeroEntry,
       ),
     )
  |> (
    computedMax =>
      switch (computedMax, Activatable_Accessors.max(staticEntry)) {
      | (Some(max1), Some(max2)) => Some(I.min(max1, max2))
      | (Some(max), None)
      | (None, Some(max)) => Some(max)
      | (None, None) => None
      }
  );
