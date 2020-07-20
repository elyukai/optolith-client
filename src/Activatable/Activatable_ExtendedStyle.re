open Ley_Option.Monad;
open Ley_Option.Alternative;

/**
 * Returns a getter and a setter for the appropiate dependency list for the
 * passed style special ability or extended special ability.
 */
let getStyleDependenciesAcc = (style: SpecialAbility.t) =>
  [@warning "-4"]
  (
    switch (Id.SpecialAbility.Group.fromInt(style.gr)) {
    | CombatStylesArmed
    | CombatStylesUnarmed
    | CombatExtended =>
      Some((
        ((hero: Hero.t) => hero.combatStyleDependencies),
        (
          (hero: Hero.t, dependencies) => {
            ...hero,
            combatStyleDependencies: dependencies,
          }
        ),
      ))
    | MagicalStyles
    | MagicalExtended =>
      Some((
        ((hero: Hero.t) => hero.magicalStyleDependencies),
        (
          (hero: Hero.t, dependencies) => {
            ...hero,
            magicalStyleDependencies: dependencies,
          }
        ),
      ))
    | BlessedStyles
    | KarmaExtended =>
      Some((
        ((hero: Hero.t) => hero.blessedStyleDependencies),
        (
          (hero: Hero.t, dependencies) => {
            ...hero,
            blessedStyleDependencies: dependencies,
          }
        ),
      ))
    | SkillStyles
    | SkillExtended =>
      Some((
        ((hero: Hero.t) => hero.skillStyleDependencies),
        (
          (hero: Hero.t, dependencies) => {
            ...hero,
            skillStyleDependencies: dependencies,
          }
        ),
      ))
    | _ => None
    }
  );

/**
 * If a style has multiple possible extended special abilities in one slot,
 * it has more options to offer. If such a slot is used and a new style
 * dependency with the used slot, but not multiple possibilities, is added,
 * this function will shift the use to the style dependency with the fixed
 * option instead, so there are more options left in the end.
 */
let moveActiveInListToNew = (newxs, x: Hero.styleDependency) =>
  switch (x.id, x.active) {
  // If the dependency has got a list of possible ids and is used, we check
  // if the used id is included in the new dependencies as a dependency
  // without a list of options to make more special abilities possible
  | (Many(_), Some(active)) =>
    // If a Some, it is the index in the list of new dependencies where we can
    // put the active dependency instead
    let index =
      Ley_List.findIndex(
        (newx: Hero.styleDependency) =>
          switch (newx.id) {
          | One(id) => id === active
          | Many(_) => false
          },
        newxs,
      );

    switch (index) {
    | Some(index) => (
        Ley_List.Index.modifyAt(
          index,
          (newx: Hero.styleDependency) => {...newx, active: Some(active)},
          newxs,
        ),
        {...x, active: None},
      )
    | None => (newxs, x)
    };
  | (Many(_), None)
  | (One(_), _) => (newxs, x)
  };

/**
 * `generateStyleDependencies heroSpecialAbilities styleSpecialAbility`
 * returns generated style dependencies for a style special ability.
 */
let generateStyleDependencies =
    (heroSpecialAbilities, styleSpecialAbility: SpecialAbility.t) =>
  styleSpecialAbility.extended
  <&> (
    extended =>
      extended
      |> Ley_List.map((extendedId) =>
           (
             {id: extendedId, active: None, origin: styleSpecialAbility.id}: Hero.styleDependency
           )
         )
      |> (
        xs =>
          [@warning "-4"]
          (
            switch (Id.SpecialAbility.fromInt(styleSpecialAbility.id)) {
            // For this style, the user must choose between two special
            // abilities to be an extended special ability.
            | ScholarDesMagierkollegsZuHoningen =>
              Ley_IntMap.lookup(styleSpecialAbility.id, heroSpecialAbilities)
              >>= (
                (x: Hero.Activatable.t) => x.active |> Ley_Option.listToOption
              )
              >>= (x => Ley_List.Safe.atMay(x.options, 1))
              |> (
                fun
                | Some(Preset((SpecialAbility, id))) => [
                    {
                      Hero.id: One(id),
                      active: None,
                      origin: styleSpecialAbility.id,
                    },
                    ...xs,
                  ]
                | Some(_)
                | None => xs
              )
            | _ => xs
            }
          )
      )
  );

/**
 * Adds extended special ability dependencies if the passed entry is a style
 * special ability.
 */
let addStyleExtendedSpecialAbilityDependencies = (styleSpecialAbility, hero) =>
  liftM2(
    ((get, set), newxs) =>
      hero
      |> get
      |> Ley_List.mapAccumL(moveActiveInListToNew, newxs)
      |> (((xs1, xs2)) => xs1 @ xs2)
      |> set(hero),
    getStyleDependenciesAcc(styleSpecialAbility),
    generateStyleDependencies(hero.specialAbilities, styleSpecialAbility),
  )
  |> Ley_Option.fromOption(hero);

/**
 * Get the index in the list of style dependencies where there is a free slot
 * for the passed extended special ability. Prefers fixed ID slots.
 */
let getIndexOfFreeDependency =
    (
      extendedSpecialAbility: SpecialAbility.t,
      xs: list(Hero.styleDependency),
    ) =>
  // Prefer dependency with fixed option
  Ley_List.findIndex(
    (x: Hero.styleDependency) =>
      switch (x.id) {
      | One(id) => id === extendedSpecialAbility.id
      | Many(_) => false
      },
    xs,
  )
  // Otherwise search for dependency with dynamic option
  <|> Ley_List.findIndex(
        (x: Hero.styleDependency) =>
          switch (x.id) {
          | One(_) => false
          | Many(ids) =>
            Ley_List.Foldable.elem(extendedSpecialAbility.id, ids)
          },
        xs,
      )
  |> Ley_Option.fromOption(-1);

/**
 * Adds the passed extended special ability to a free slot of a style
 * dependency.
 */
let addExtendedSpecialAbilityDependency =
    (extendedSpecialAbility, hero: Hero.t) =>
  extendedSpecialAbility
  |> getStyleDependenciesAcc
  |> Ley_Option.option(hero, ((get, set)) =>
       hero
       |> get
       |> (
         xs =>
           Ley_List.Index.modifyAt(
             getIndexOfFreeDependency(extendedSpecialAbility, xs),
             (d: Hero.styleDependency) =>
               {...d, active: Some(extendedSpecialAbility.id)},
             xs,
           )
           |> set(hero)
       )
     );

/**
 * Adds extended special ability dependencies if the passed entry is a style
 * special ability or adds the passed special ability's ID to a free slot of a
 * style dependency if it is an extended special ability.
 */
let addAllStyleRelatedDependencies = (specialAbility, hero) =>
  hero
  |> addStyleExtendedSpecialAbilityDependencies(specialAbility)
  |> addExtendedSpecialAbilityDependency(specialAbility);

/**
 * `getSplittedRemainingAndToRemove` takes a style special ability's ID and
 * the list of style dependencies and returns `(toBeRemoved, remaining)`,
 * where `toBeRemoved` is the list of style dependencies that have to be
 * removed when removing the style special ability and `remaining` is the list
 * of remaining style dependencies after the removal.
 */
let getSplittedRemainingAndToRemove = (id, xs) =>
  Ley_List.partition((x: Hero.styleDependency) => x.origin === id, xs);

/**
 * Returns an index of a free style dependency so that the currently used
 * style dependency can be removed and the use can be moved.
 */
let getAlternativeIndex = (toBeRemoved: Hero.styleDependency, remainings) =>
  switch (toBeRemoved.active) {
  | Some(activeId) =>
    remainings
    |> Ley_List.findIndex((remaining: Hero.styleDependency) =>
         (
           switch (remaining.id) {
           | One(id) => id === activeId
           | Many(ids) => Ley_List.Foldable.elem(activeId, ids)
           }
         )
         && Ley_Option.isNone(remaining.active)
       )
    |> Ley_Option.fromOption(-1)
  | None => (-1)
  };

/**
 * Removes extended special ability dependencies if the passed entry is a
 * style special ability.
 */
let removeStyleExtendedSpecialAbilityDependencies =
    (styleSpecialAbility, hero) =>
  styleSpecialAbility
  |> getStyleDependenciesAcc
  |> Ley_Option.option(hero, ((get, set)) =>
       hero
       |> get
       |> getSplittedRemainingAndToRemove(styleSpecialAbility.id)
       |> (
         ((dependenciesToRemove, remainingDependencies)) =>
           dependenciesToRemove
           |> Ley_List.filter((x: Hero.styleDependency) =>
                Ley_Option.isSome(x.active)
              )
           |> Ley_List.Foldable.foldr(
                (toRemove: Hero.styleDependency, remainings) =>
                  Ley_List.Index.modifyAt(
                    getAlternativeIndex(toRemove, remainings),
                    (remaining: Hero.styleDependency) =>
                      {...remaining, active: toRemove.active},
                    remainings,
                  ),
                remainingDependencies,
              )
           |> set(hero)
       )
     );

/**
 * Get the index in the list of style dependencies where there is a used slot
 * for the passed extended special ability.
 */
let getIndexOfUsedDependency =
    (
      extendedSpecialAbility: SpecialAbility.t,
      xs: list(Hero.styleDependency),
    ) =>
  Ley_List.findIndex(
    (x: Hero.styleDependency) =>
      switch (x.active) {
      | Some(id) => id === extendedSpecialAbility.id
      | None => false
      },
    xs,
  )
  |> Ley_Option.fromOption(-1);

/**
 * Removes the passed extended special ability from a used slot of a style
 * dependency.
 */
let removeExtendedSpecialAbilityDependency =
    (extendedSpecialAbility, hero: Hero.t) =>
  extendedSpecialAbility
  |> getStyleDependenciesAcc
  |> Ley_Option.option(hero, ((get, set)) =>
       hero
       |> get
       |> (
         xs =>
           Ley_List.Index.modifyAt(
             getIndexOfUsedDependency(extendedSpecialAbility, xs),
             (d: Hero.styleDependency) => {...d, active: None},
             xs,
           )
           |> set(hero)
       )
     );

/**
 * Removes extended special ability dependencies if the passed entry is a
 * style special ability or removes the passed special ability's ID from a
 * used slot of a style dependency if it is an extended special ability.
 */
let removeAllStyleRelatedDependencies = (specialAbility, hero) =>
  hero
  |> removeStyleExtendedSpecialAbilityDependencies(specialAbility)
  |> removeExtendedSpecialAbilityDependency(specialAbility);

/**
 * Return flat array of available extended special abilities' IDs.
 */
let getAvailableExtendedSpecialAbilities = styleDependencies =>
  styleDependencies
  |> Ley_List.Foldable.concatMap((x: Hero.styleDependency) =>
       switch (x.active, x.id) {
       | (None, One(id)) => [id]
       | (None, Many(ids)) => ids
       | (Some(_), _) => []
       }
     );

/**
 * Calculates a list of available Extended Special Abilties. The availability is
 * only based on bought Style Special Abilities, so (other) prerequisites have
 * to be checked separately.
 */
let getAllAvailableExtendedSpecialAbilities =
  Ley_List.Foldable.concatMap(getAvailableExtendedSpecialAbilities);

/**
 * Checks if the passed special ability is a style and if it is valid to
 * remove based on registered active extended special abilities.
 */
let isStyleValidToRemove = (hero, styleSpecialAbility) =>
  styleSpecialAbility
  |> getStyleDependenciesAcc
  |> Ley_Option.option(true, ((get, _)) =>
       hero
       |> get
       |> getSplittedRemainingAndToRemove(styleSpecialAbility.id)
       |> (
         ((dependenciesToRemove, remainingDependencies)) =>
           dependenciesToRemove
           // Check for every used dependency slot...
           |> Ley_List.filter((x: Hero.styleDependency) =>
                Ley_Option.isSome(x.active)
              )
           // ...if it can be moved to a different dependency
           |> Ley_List.Foldable.all(x =>
                getAlternativeIndex(x, remainingDependencies) > (-1)
              )
       )
     );
