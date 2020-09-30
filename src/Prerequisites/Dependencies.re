module F = Ley_Function;
module I = Ley_Int;
module L = Ley_List;
module O = Ley_Option;
open O.Monad;
module IM = Ley_IntMap;

module Activatable = {
  let isLevelDependencyMatched =
      (
        dependency: Hero.Activatable.dependency,
        active: Hero.Activatable.single,
      ) =>
    switch (dependency.level, active.level) {
    // If there is no level dependency, skip
    | (None, _) => true
    // If there is a level dependency but no actual level, skip (this case
    // should not happen at all)
    | (Some(_), None) => !dependency.active
    // The active level must be at least the required level, if required. If
    // prohibited, the level must be lower than the level specified in the
    // dependency
    | (Some(dependencyLevel), Some(activeLevel)) =>
      activeLevel >= dependencyLevel === dependency.active
    };

  let areOptionDependenciesMatched =
      (
        dependency: Hero.Activatable.dependency,
        active: Hero.Activatable.single,
      ) =>
    L.Index.iall(
      (i, option) =>
        // Get the active option at the same position as the
        // required option
        L.Safe.atMay(active.options, i)
        >>= Activatable_Convert.activatableOptionToSelectOptionId
        |> O.option(false, activeOption =>
             switch (option) {
             | OneOrMany.One(option) =>
               // If only one option, required and active must
               // be equal
               Id.Activatable.SelectOption.(activeOption == option)
               === dependency.active
             | OneOrMany.Many(options) =>
               // If multiple options are possible, one must be
               // equal to the active option
               L.elem(activeOption, options) === dependency.active
             }
           ),
      dependency.options,
    );

  let isDependencyMatched = (dependency, active) =>
    (
      isLevelDependencyMatched(dependency, active)
      && areOptionDependenciesMatched(dependency, active)
    )
    // Prohibiting instead of requiring a specific entry configuration is a
    // logical inversion, which means that we can compare with the value if it
    // should be required (true) or prohibited (false) to implement this
    // inversion
    === dependency.active;
};

module Flatten = {
  /**
   * `flattenSkillDependencies getValueForTargetId id dependencies` flattens the
   * list of dependencies to usable values. That means, optional dependencies
   * (objects) will be evaluated and will be included in the resulting list,
   * depending on whether it has to follow the optional dependency or not. The
   * result is a plain `List` of all non-optional dependencies.
   */
  let flattenSkillDependencies = (getValueForTargetId, id, dependencies) =>
    O.mapOption(
      (dep: Hero.Skill.dependency) =>
        switch (dep.target) {
        | One(_) => Some(dep.value)
        | Many(targets) =>
          targets
          |> L.delete(id)
          |> L.map(getValueForTargetId)
          // Check if the dependency is met by another entry so that it can be
          // ignored currently
          |> L.Foldable.any(value => value >= dep.value)
          |> (
            isMatchedByOtherEntry =>
              if (isMatchedByOtherEntry) {
                None;
              } else {
                Some(dep.value);
              }
          )
        },
      dependencies,
    );

  /**
   * `flattenActivatableSkillDependencies getValueForTargetId id dependencies`
   * flattens the list of dependencies to usable values. That means, optional
   * dependencies (objects) will be evaluated and will be included in the
   * resulting list, depending on whether it has to follow the optional
   * dependency or not. The result is a plain `List` of all non-optional
   * dependencies.
   */
  let flattenActivatableSkillDependencies =
      (getValueForTargetId, id, dependencies) =>
    Hero.ActivatableSkill.(
      O.mapOption(
        (dep: Hero.Skill.dependency) =>
          switch (dep.target) {
          | One(_) => Some(dep.value)
          | Many(targets) =>
            targets
            |> L.delete(id)
            |> L.map(getValueForTargetId)
            // Check if the dependency is met by another entry so that it can be
            // ignored currently
            |> L.Foldable.any(value =>
                 switch (value) {
                 // If dependency requires an active entry, the other entry must
                 // have at least the required value
                 | Active(value) => value >= dep.value
                 // Otherwise the dependency is not met by the other entry
                 | Inactive => false
                 }
               )
            |> (
              isMatchedByOtherEntry =>
                if (isMatchedByOtherEntry) {
                  None;
                } else {
                  Some(dep.value);
                }
            )
          },
        dependencies,
      )
    );

  /**
   * `flattenActivatableDependencies getValueForTargetId id dependencies`
   * flattens the list of dependencies to usable values. That means, optional
   * dependencies (objects) will be evaluated and will be included in the
   * resulting list, depending on whether it has to follow the optional
   * dependency or not. The result is a plain `List` of all non-optional
   * dependencies.
   */
  let flattenActivatableDependencies =
      (getActiveListForTargetId, id, dependencies) =>
    Hero.Activatable.(
      O.mapOption(
        (dep: Hero.Activatable.dependency) =>
          switch (dep.target) {
          | One(_) => Some(dep)
          | Many(targets) =>
            targets
            |> L.delete(id)
            |> L.Foldable.concatMap(getActiveListForTargetId)
            // Check if the dependency is met by another entry so that it can be
            // ignored currently
            |> L.Foldable.any(Activatable.isDependencyMatched(dep))
            |> (
              isMatchedByOtherEntry =>
                if (isMatchedByOtherEntry) {
                  None;
                } else {
                  Some(dep);
                }
            )
          },
        dependencies,
      )
    );

  /**
   * Get all required first select option ids from the given entry.
   */
  let getRequiredSelectOptions1 = (otherActivatables, x: Hero.Activatable.t) =>
    flattenActivatableDependencies(
      id =>
        IM.lookup(id, otherActivatables)
        |> O.option([], (x: Hero.Activatable.t) => x.active),
      x.id,
      x.dependencies,
    )
    |> O.mapOption((dep: Hero.Activatable.dependency) =>
         dep.options |> O.listToOption
       );
};

module Add = {
  module Single = {
    let addAttributeDependency =
        (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      attributes:
        IM.alter(
          heroEntry =>
            heroEntry
            |> O.fromOption(Hero.Attribute.empty(id))
            |> (
              heroEntry =>
                Some({
                  ...heroEntry,
                  dependencies: [dep, ...heroEntry.dependencies],
                })
            ),
          id,
          hero.attributes,
        ),
    };

    let addSkillDependency = (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      skills:
        IM.alter(
          heroEntry =>
            heroEntry
            |> O.fromOption(Hero.Skill.emptySkill(id))
            |> (
              heroEntry =>
                Some({
                  ...heroEntry,
                  dependencies: [dep, ...heroEntry.dependencies],
                })
            ),
          id,
          hero.skills,
        ),
    };

    let addCombatTechniqueDependency =
        (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      combatTechniques:
        IM.alter(
          heroEntry =>
            heroEntry
            |> O.fromOption(Hero.Skill.emptyCombatTechnique(id))
            |> (
              heroEntry =>
                Some({
                  ...heroEntry,
                  dependencies: [dep, ...heroEntry.dependencies],
                })
            ),
          id,
          hero.combatTechniques,
        ),
    };

    let addSpellDependency = (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      spells:
        IM.alter(
          heroEntry =>
            heroEntry
            |> O.fromOption(Hero.ActivatableSkill.empty(id))
            |> (
              heroEntry =>
                Some({
                  ...heroEntry,
                  dependencies: [dep, ...heroEntry.dependencies],
                })
            ),
          id,
          hero.spells,
        ),
    };

    let addLiturgicalChantDependency =
        (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      liturgicalChants:
        IM.alter(
          heroEntry =>
            heroEntry
            |> O.fromOption(Hero.ActivatableSkill.empty(id))
            |> (
              heroEntry =>
                Some({
                  ...heroEntry,
                  dependencies: [dep, ...heroEntry.dependencies],
                })
            ),
          id,
          hero.liturgicalChants,
        ),
    };

    let addAdvantageDependency =
        (dep: Hero.Activatable.dependency, hero: Hero.t, id) => {
      ...hero,
      advantages:
        IM.alter(
          heroEntry =>
            heroEntry
            |> O.fromOption(Hero.Activatable.empty(id))
            |> (
              heroEntry =>
                Some({
                  ...heroEntry,
                  dependencies: [dep, ...heroEntry.dependencies],
                })
            ),
          id,
          hero.advantages,
        ),
    };

    let addDisadvantageDependency =
        (dep: Hero.Activatable.dependency, hero: Hero.t, id) => {
      ...hero,
      disadvantages:
        IM.alter(
          heroEntry =>
            heroEntry
            |> O.fromOption(Hero.Activatable.empty(id))
            |> (
              heroEntry =>
                Some({
                  ...heroEntry,
                  dependencies: [dep, ...heroEntry.dependencies],
                })
            ),
          id,
          hero.disadvantages,
        ),
    };

    let addSpecialAbilityDependency =
        (dep: Hero.Activatable.dependency, hero: Hero.t, id) => {
      ...hero,
      specialAbilities:
        IM.alter(
          heroEntry =>
            heroEntry
            |> O.fromOption(Hero.Activatable.empty(id))
            |> (
              heroEntry =>
                Some({
                  ...heroEntry,
                  dependencies: [dep, ...heroEntry.dependencies],
                })
            ),
          id,
          hero.specialAbilities,
        ),
    };
  };

  let addAttributeDependency = (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addAttributeDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.addAttributeDependency(dep), hero, ids)
    };

  let addSkillDependency = (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addSkillDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.addSkillDependency(dep), hero, ids)
    };

  let addCombatTechniqueDependency =
      (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addCombatTechniqueDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.addCombatTechniqueDependency(dep), hero, ids)
    };

  let addSpellDependency = (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addSpellDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.addSpellDependency(dep), hero, ids)
    };

  let addLiturgicalChantDependency =
      (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addLiturgicalChantDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.addLiturgicalChantDependency(dep), hero, ids)
    };

  let addAdvantageDependency =
      (dep: Hero.Activatable.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addAdvantageDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.addAdvantageDependency(dep), hero, ids)
    };

  let addDisadvantageDependency =
      (dep: Hero.Activatable.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addDisadvantageDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.addDisadvantageDependency(dep), hero, ids)
    };

  let addSpecialAbilityDependency =
      (dep: Hero.Activatable.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addSpecialAbilityDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.addSpecialAbilityDependency(dep), hero, ids)
    };
};

module Remove = {
  module Single = {
    open O.Functor;

    let removeAttributeDependency =
        (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      attributes:
        IM.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.Attribute.t) => {
                ...heroEntry,
                dependencies: L.delete(dep, heroEntry.dependencies),
              }
            )
            >>= O.ensure(heroEntry =>
                  heroEntry |> Hero.Attribute.isUnused |> (!)
                ),
          id,
          hero.attributes,
        ),
    };

    let removeSkillDependency = (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      skills:
        IM.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Skill.Dynamic.t) => {
                ...heroEntry,
                dependencies: L.delete(dep, heroEntry.dependencies),
              }
            )
            >>= O.ensure(heroEntry =>
                  heroEntry |> Hero.Skill.isUnusedSkill |> (!)
                ),
          id,
          hero.skills,
        ),
    };

    let removeCombatTechniqueDependency =
        (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      combatTechniques:
        IM.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Skill.Dynamic.t) => {
                ...heroEntry,
                dependencies: L.delete(dep, heroEntry.dependencies),
              }
            )
            >>= O.ensure(heroEntry =>
                  heroEntry |> Hero.Skill.isUnusedCombatTechnique |> (!)
                ),
          id,
          hero.combatTechniques,
        ),
    };

    let removeSpellDependency = (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      spells:
        IM.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.ActivatableSkill.t) => {
                ...heroEntry,
                dependencies: L.delete(dep, heroEntry.dependencies),
              }
            )
            >>= O.ensure(heroEntry =>
                  heroEntry |> Hero.ActivatableSkill.isUnused |> (!)
                ),
          id,
          hero.spells,
        ),
    };

    let removeLiturgicalChantDependency =
        (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      liturgicalChants:
        IM.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.ActivatableSkill.t) => {
                ...heroEntry,
                dependencies: L.delete(dep, heroEntry.dependencies),
              }
            )
            >>= O.ensure(heroEntry =>
                  heroEntry |> Hero.ActivatableSkill.isUnused |> (!)
                ),
          id,
          hero.liturgicalChants,
        ),
    };

    let removeAdvantageDependency =
        (dep: Hero.Activatable.dependency, hero: Hero.t, id) => {
      ...hero,
      advantages:
        IM.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.Activatable.t) => {
                ...heroEntry,
                dependencies: L.delete(dep, heroEntry.dependencies),
              }
            )
            >>= O.ensure(heroEntry =>
                  heroEntry |> Hero.Activatable.isUnused |> (!)
                ),
          id,
          hero.advantages,
        ),
    };

    let removeDisadvantageDependency =
        (dep: Hero.Activatable.dependency, hero: Hero.t, id) => {
      ...hero,
      disadvantages:
        IM.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.Activatable.t) => {
                ...heroEntry,
                dependencies: L.delete(dep, heroEntry.dependencies),
              }
            )
            >>= O.ensure(heroEntry =>
                  heroEntry |> Hero.Activatable.isUnused |> (!)
                ),
          id,
          hero.disadvantages,
        ),
    };

    let removeSpecialAbilityDependency =
        (dep: Hero.Activatable.dependency, hero: Hero.t, id) => {
      ...hero,
      specialAbilities:
        IM.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.Activatable.t) => {
                ...heroEntry,
                dependencies: L.delete(dep, heroEntry.dependencies),
              }
            )
            >>= O.ensure(heroEntry =>
                  heroEntry |> Hero.Activatable.isUnused |> (!)
                ),
          id,
          hero.specialAbilities,
        ),
    };
  };

  let removeAttributeDependency = (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeAttributeDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.removeAttributeDependency(dep), hero, ids)
    };

  let removeSkillDependency = (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeSkillDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.removeSkillDependency(dep), hero, ids)
    };

  let removeCombatTechniqueDependency =
      (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeCombatTechniqueDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(
        Single.removeCombatTechniqueDependency(dep),
        hero,
        ids,
      )
    };

  let removeSpellDependency = (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeSpellDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.removeSpellDependency(dep), hero, ids)
    };

  let removeLiturgicalChantDependency =
      (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeLiturgicalChantDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(
        Single.removeLiturgicalChantDependency(dep),
        hero,
        ids,
      )
    };

  let removeAdvantageDependency =
      (dep: Hero.Activatable.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeAdvantageDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.removeAdvantageDependency(dep), hero, ids)
    };

  let removeDisadvantageDependency =
      (dep: Hero.Activatable.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeDisadvantageDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.removeDisadvantageDependency(dep), hero, ids)
    };

  let removeSpecialAbilityDependency =
      (dep: Hero.Activatable.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeSpecialAbilityDependency(dep, hero, id)
    | Many(ids) =>
      L.Foldable.foldl(Single.removeSpecialAbilityDependency(dep), hero, ids)
    };
};

module TransferredUnfamiliar = {
  open Ley_Function;
  open Hero.TransferUnfamiliar;
  open Tradition.Magical;

  let isUnfamiliarSpell = (transferredUnfamiliar, heroTraditions) => {
    let isIntuitiveMageActive =
      L.Foldable.any(
        ((staticSpecialAbility, _, _): fullTradition) =>
          staticSpecialAbility.id
          === Id.SpecialAbility.toInt(TraditionIntuitiveMage),
        heroTraditions,
      );

    if (isIntuitiveMageActive) {
      const(false);
    } else {
      let activeTraditionNumericIds =
        heroTraditions
        |> L.Foldable.concatMap(((_, _, trad): fullTradition) =>
             trad.id === Id.SpecialAbility.toInt(TraditionGuildMages)
               ? trad.numId
                 |> O.optionToList
                 |> L.cons(Id.MagicalTradition.toInt(Qabalyamagier))
               : trad.numId |> O.optionToList
           )
        |> L.cons(Id.MagicalTradition.toInt(General));

      let isNoTraditionActive =
        Ley_Bool.notP(L.intersecting(activeTraditionNumericIds));

      (staticSpell: Spell.t) =>
        L.Foldable.all(
          tu =>
            switch (tu.id) {
            | Spell(id) => id !== staticSpell.id
            | Spells => true
            | LiturgicalChant(_)
            | LiturgicalChants => false
            },
          transferredUnfamiliar,
        )
        && isNoTraditionActive(staticSpell.traditions);
    };
  };

  let getTransferredUnfamiliarById =
      (single: Activatable_Convert.singleWithId) =>
    [@warning "-4"]
    (
      switch (Id.SpecialAbility.fromInt(single.id)) {
      | TraditionGuildMages
      | MadaschwesternStil
      | ScholarDesMagierkollegsZuHoningen =>
        switch (single.options) {
        | [Preset((Spell, id)), ..._] => [
            {id: Spell(id), srcId: single.id},
          ]
        | [_, ..._]
        | [] => []
        }
      | Zaubervariabilitaet => [{id: Spells, srcId: single.id}]
      | ScholarDerHalleDesLebensZuNorburg
      | ScholarDesKreisesDerEinfuehlung =>
        single.options
        |> L.take(3)
        |> O.mapOption(
             fun
             | Id.Activatable.Option.Preset((Spell, id)) =>
               Some({id: Spell(id), srcId: single.id})
             | _ => None,
           )
      | _ => []
      }
    );

  /**
   * Adds new transferred unfamiliar spells if the entry to activate allows
   * transferring unfamiliar spells.
   */
  let addTransferUnfamiliarDependencies =
      (single: Activatable_Convert.singleWithId, hero: Hero.t) =>
    single
    |> getTransferredUnfamiliarById
    |> (
      fun
      | [] => hero
      | xs => {
          ...hero,
          transferredUnfamiliarSpells: xs @ hero.transferredUnfamiliarSpells,
        }
    );
  //
  // export const activationOptionsToActiveObjectWithId =
  //   (active: Record<ActivatableActivationOptions>) =>
  //     toActiveObjectWithId (-1) (AAOA.id (active)) (convertUIStateToActiveObject (active))
  //
  // /**
  //  * Adds new transferred unfamiliar spells if the entry to activate allows
  //  * transferring unfamiliar spells.
  //  */
  // export const addTransferUnfamiliarDependenciesByActivationOptions =
  //   pipe (
  //     activationOptionsToActiveObjectWithId,
  //     addTransferUnfamiliarDependencies
  //   )
  //
  // /**
  //  * Removes transferred unfamiliar spells if the entry to deactivate allows
  //  * transferring unfamiliar spells.
  //  */
  // export const removeTransferUnfamiliarDependencies:
  //   (active: Record<ActivatableDeactivationOptions>) => ident<Record<Hero>> =
  //   active => hero => {
  //     const src_id = ADOA.id (active)
  //     const src_index = ADOA.index (active)
  //
  //     const mnew_spells = pipe_ (
  //       lookup (src_id) (HA.specialAbilities (hero)),
  //       bindF (pipe (ADA.active, subscriptF (src_index))),
  //       bindF (pipe (toActiveObjectWithId (src_index) (src_id), getTransferredUnfamiliarById))
  //     )
  //
  //     return maybe (hero)
  //                 ((new_spells: List<Record<TransferUnfamiliar>>) =>
  //                   over (HL.transferredUnfamiliarSpells)
  //                         (current => foldr (sdelete) (current) (new_spells))
  //                         (hero))
  //                 (mnew_spells)
  //   }

  let removeTradById = (id, xs) =>
    L.filter(((x, _, _): fullTradition) => x.id === id, xs);

  /**
   * Remove all unfamiliar deps by the specified entry.
   */
  let removeUnfamiliarDepsById = (id, xs) =>
    L.filter((x: Hero.TransferUnfamiliar.t) => x.srcId === id, xs);

  let getUnfamiliarCount =
      (
        staticData: Static.t,
        transferredUnfamiliar,
        heroTraditions,
        heroSpells,
      ) =>
    L.countBy(
      (heroSpell: Hero.ActivatableSkill.t) =>
        IM.lookup(heroSpell.id, staticData.spells)
        |> O.option(
             false,
             isUnfamiliarSpell(transferredUnfamiliar, heroTraditions),
           ),
      heroSpells,
    );

  let getUnfamiliarCountAfter =
      (
        staticData: Static.t,
        transferredUnfamiliar,
        heroTraditions,
        srcId,
        heroSpells,
      ) =>
    getUnfamiliarCount(
      staticData,
      removeUnfamiliarDepsById(srcId, transferredUnfamiliar),
      removeTradById(srcId, heroTraditions),
      heroSpells,
    );

  /**
   * Check if an entry that allows transferring unfamiliar entries into a familiar
   * tradition can be removed, because it might happen, that this is not allowed,
   * because otherwise you'd have more unfamiliar spells than allowed by the
   * selected experience level during creation phase.
   */
  let isEntryAllowingTransferUnfamiliarRemovable =
      (staticData: Static.t, hero: Hero.t) =>
    switch (hero.phase) {
    | Advancement => const(true)
    | Outline
    | Definition =>
      open ExperienceLevel;

      let heroTraditions =
        Tradition.Magical.getEntries(staticData, hero.specialAbilities);
      let transferredUnfamiliar = hero.transferredUnfamiliarSpells;
      let spells = IM.elems(hero.spells);

      O.option(
        const(false),
        (el, srcId) =>
          el.maxUnfamiliarSpells
          >= getUnfamiliarCountAfter(
               staticData,
               transferredUnfamiliar,
               heroTraditions,
               srcId,
               spells,
             ),
        IM.lookup(hero.experienceLevel, staticData.experienceLevels),
      );
    };
};

type mode =
  | Add
  | Remove;

type activatableCategory =
  | Advantages
  | Disadvantages
  | SpecialAbilities;

let putActivatableDependency = (mode, category, dependency, hero) =>
  switch (mode, category) {
  | (Add, Advantages) => Add.addAdvantageDependency(dependency, hero)
  | (Add, Disadvantages) => Add.addDisadvantageDependency(dependency, hero)
  | (Add, SpecialAbilities) =>
    Add.addSpecialAbilityDependency(dependency, hero)
  | (Remove, Advantages) =>
    Remove.removeAdvantageDependency(dependency, hero)
  | (Remove, Disadvantages) =>
    Remove.removeDisadvantageDependency(dependency, hero)
  | (Remove, SpecialAbilities) =>
    Remove.removeSpecialAbilityDependency(dependency, hero)
  };

let applyActivatablePrerequisite =
    (mode, sourceId, prerequisite: Prerequisite.activatable, hero) =>
  putActivatableDependency(
    mode,
    switch (prerequisite.id) {
    | (Advantage, _) => Advantages
    | (Disadvantage, _) => Disadvantages
    | (SpecialAbility, _) => SpecialAbilities
    },
    {
      source: sourceId,
      target:
        switch (prerequisite.id) {
        | (_, id) => One(id)
        },
      active: prerequisite.active,
      options:
        switch (prerequisite.sid) {
        | Some(sid) =>
          switch (prerequisite.sid2) {
          | Some(sid2) => [One(sid), One(sid2)]
          | None => [One(sid)]
          }
        | None => []
        },
      level: prerequisite.level,
    },
    hero,
  );

let applyActivatableMultiEntryPrerequisite =
    (mode, sourceId, prerequisite: Prerequisite.activatableMultiEntry, hero) =>
  putActivatableDependency(
    mode,
    switch (prerequisite.id) {
    | Advantages(_) => Advantages
    | Disadvantages(_) => Disadvantages
    | SpecialAbilities(_) => SpecialAbilities
    },
    {
      source: sourceId,
      target:
        switch (prerequisite.id) {
        | Advantages(ids)
        | Disadvantages(ids)
        | SpecialAbilities(ids) => Many(ids)
        },
      active: prerequisite.active,
      options:
        switch (prerequisite.sid) {
        | Some(sid) =>
          switch (prerequisite.sid2) {
          | Some(sid2) => [One(sid), One(sid2)]
          | None => [One(sid)]
          }
        | None => []
        },
      level: prerequisite.level,
    },
    hero,
  );

let applyActivatableMultiSelectPrerequisite =
    (mode, sourceId, prerequisite: Prerequisite.activatableMultiSelect, hero) =>
  putActivatableDependency(
    mode,
    switch (prerequisite.id) {
    | (Advantage, _) => Advantages
    | (Disadvantage, _) => Disadvantages
    | (SpecialAbility, _) => SpecialAbilities
    },
    {
      source: sourceId,
      target:
        switch (prerequisite.id) {
        | (_, id) => One(id)
        },
      active: prerequisite.active,
      options:
        switch (prerequisite.sid2) {
        | Some(sid2) => [Many(prerequisite.sid), One(sid2)]
        | None => [Many(prerequisite.sid)]
        },
      level: prerequisite.level,
    },
    hero,
  );

type increasableCategory =
  | Attributes
  | Skills
  | CombatTechniques
  | Spells
  | LiturgicalChants;

let putIncreasableDependency = (mode, category, dependency, hero) =>
  switch (mode, category) {
  | (Add, Attributes) => Add.addAttributeDependency(dependency, hero)
  | (Add, Skills) => Add.addSkillDependency(dependency, hero)
  | (Add, CombatTechniques) =>
    Add.addCombatTechniqueDependency(dependency, hero)
  | (Add, Spells) => Add.addSpellDependency(dependency, hero)
  | (Add, LiturgicalChants) =>
    Add.addLiturgicalChantDependency(dependency, hero)
  | (Remove, Attributes) =>
    Remove.removeAttributeDependency(dependency, hero)
  | (Remove, Skills) => Remove.removeSkillDependency(dependency, hero)
  | (Remove, CombatTechniques) =>
    Remove.removeCombatTechniqueDependency(dependency, hero)
  | (Remove, Spells) => Remove.removeSpellDependency(dependency, hero)
  | (Remove, LiturgicalChants) =>
    Remove.removeLiturgicalChantDependency(dependency, hero)
  };

let applyIncreasablePrerequisite =
    (mode, sourceId, prerequisite: Prerequisite.increasable, hero) =>
  putIncreasableDependency(
    mode,
    switch (prerequisite.id) {
    | (Attribute, _) => Attributes
    | (Skill, _) => Skills
    | (CombatTechnique, _) => CombatTechniques
    | (Spell, _) => Spells
    | (LiturgicalChant, _) => LiturgicalChants
    },
    {
      source: sourceId,
      target:
        switch (prerequisite.id) {
        | (_, id) => One(id)
        },
      value: prerequisite.value,
    },
    hero,
  );

let applyIncreasableMultiEntryPrerequisite =
    (mode, sourceId, prerequisite: Prerequisite.increasableMultiEntry, hero) =>
  putIncreasableDependency(
    mode,
    switch (prerequisite.id) {
    | Attributes(_) => Attributes
    | Skills(_) => Skills
    | CombatTechniques(_) => CombatTechniques
    | Spells(_) => Spells
    | LiturgicalChants(_) => LiturgicalChants
    },
    {
      source: sourceId,
      target:
        switch (prerequisite.id) {
        | Attributes(ids)
        | Skills(ids)
        | CombatTechniques(ids)
        | Spells(ids)
        | LiturgicalChants(ids) => Many(ids)
        },
      value: prerequisite.value,
    },
    hero,
  );

let applyPrimaryAttributePrerequisite =
    (
      mode,
      sourceId,
      staticData,
      prerequisite: Prerequisite.primaryAttribute,
      hero: Hero.t,
    ) =>
  (
    switch (prerequisite.scope) {
    | Magical =>
      Tradition.Magical.getPrimaryAttributeId(
        staticData,
        hero.specialAbilities,
      )
    | Blessed =>
      Tradition.Blessed.getPrimaryAttributeId(
        staticData,
        hero.specialAbilities,
      )
    }
  )
  |> O.option(
       hero,
       attrId => {
         let dependency: Hero.Skill.dependency = {
           source: sourceId,
           target: One(attrId),
           value: prerequisite.value,
         };

         switch (mode) {
         | Add => Add.addAttributeDependency(dependency, hero)
         | Remove => Remove.removeAttributeDependency(dependency, hero)
         };
       },
     );

let applySocialPrerequisite =
    (mode, prerequisite: Prerequisite.socialStatus, hero: Hero.t) => {
  ...hero,
  socialStatusDependencies:
    switch (mode) {
    | Add => L.cons(prerequisite, hero.socialStatusDependencies)
    | Remove => L.delete(prerequisite, hero.socialStatusDependencies)
    },
};

let modifyDependencies =
    (mode, staticData, prerequisites, sourceId: Id.PrerequisiteSource.t, hero) =>
  L.Foldable.foldr(
    (prerequisite: Prerequisites.prerequisite) =>
      [@warning "-4"]
      (
        switch (prerequisite, sourceId) {
        | (PrimaryAttribute(options), (Advantage, id)) =>
          applyPrimaryAttributePrerequisite(
            mode,
            (Advantage, id),
            staticData,
            options,
          )
        | (PrimaryAttribute(options), (Disadvantage, id)) =>
          applyPrimaryAttributePrerequisite(
            mode,
            (Disadvantage, id),
            staticData,
            options,
          )
        | (PrimaryAttribute(options), (SpecialAbility, id)) =>
          applyPrimaryAttributePrerequisite(
            mode,
            (SpecialAbility, id),
            staticData,
            options,
          )
        | (PrimaryAttribute(options), (Spell, id)) =>
          applyPrimaryAttributePrerequisite(
            mode,
            (Spell, id),
            staticData,
            options,
          )
        | (PrimaryAttribute(options), (LiturgicalChant, id)) =>
          applyPrimaryAttributePrerequisite(
            mode,
            (LiturgicalChant, id),
            staticData,
            options,
          )
        | (Activatable(options), (Advantage, id)) =>
          applyActivatablePrerequisite(mode, (Advantage, id), options)
        | (Activatable(options), (Disadvantage, id)) =>
          applyActivatablePrerequisite(mode, (Disadvantage, id), options)
        | (Activatable(options), (SpecialAbility, id)) =>
          applyActivatablePrerequisite(mode, (SpecialAbility, id), options)
        | (ActivatableMultiEntry(options), (Advantage, id)) =>
          applyActivatableMultiEntryPrerequisite(
            mode,
            (Advantage, id),
            options,
          )
        | (ActivatableMultiEntry(options), (Disadvantage, id)) =>
          applyActivatableMultiEntryPrerequisite(
            mode,
            (Disadvantage, id),
            options,
          )
        | (ActivatableMultiEntry(options), (SpecialAbility, id)) =>
          applyActivatableMultiEntryPrerequisite(
            mode,
            (SpecialAbility, id),
            options,
          )
        | (ActivatableMultiSelect(options), (Advantage, id)) =>
          applyActivatableMultiSelectPrerequisite(
            mode,
            (Advantage, id),
            options,
          )
        | (ActivatableMultiSelect(options), (Disadvantage, id)) =>
          applyActivatableMultiSelectPrerequisite(
            mode,
            (Disadvantage, id),
            options,
          )
        | (ActivatableMultiSelect(options), (SpecialAbility, id)) =>
          applyActivatableMultiSelectPrerequisite(
            mode,
            (SpecialAbility, id),
            options,
          )
        | (Increasable(options), (Advantage, id)) =>
          applyIncreasablePrerequisite(mode, (Advantage, id), options)
        | (Increasable(options), (Disadvantage, id)) =>
          applyIncreasablePrerequisite(mode, (Disadvantage, id), options)
        | (Increasable(options), (SpecialAbility, id)) =>
          applyIncreasablePrerequisite(mode, (SpecialAbility, id), options)
        | (Increasable(options), (Spell, id)) =>
          applyIncreasablePrerequisite(mode, (Spell, id), options)
        | (Increasable(options), (LiturgicalChant, id)) =>
          applyIncreasablePrerequisite(mode, (LiturgicalChant, id), options)
        | (IncreasableMultiEntry(options), (Advantage, id)) =>
          applyIncreasableMultiEntryPrerequisite(
            mode,
            (Advantage, id),
            options,
          )
        | (IncreasableMultiEntry(options), (Disadvantage, id)) =>
          applyIncreasableMultiEntryPrerequisite(
            mode,
            (Disadvantage, id),
            options,
          )
        | (IncreasableMultiEntry(options), (SpecialAbility, id)) =>
          applyIncreasableMultiEntryPrerequisite(
            mode,
            (SpecialAbility, id),
            options,
          )
        | (IncreasableMultiEntry(options), (Spell, id)) =>
          applyIncreasableMultiEntryPrerequisite(mode, (Spell, id), options)
        | (IncreasableMultiEntry(options), (LiturgicalChant, id)) =>
          applyIncreasableMultiEntryPrerequisite(
            mode,
            (LiturgicalChant, id),
            options,
          )
        | _ => Ley_Function.id
        }
      ),
    hero,
    prerequisites,
  );

/**
 * Adds dependencies to all required entries to ensure rule validity.
 */
let addDependencies = modifyDependencies(Add);

/**
 * Removes dependencies from all required entries to ensure rule validity.
 */
let removeDependencies = modifyDependencies(Remove);

/**
 * Return the max level based on prerequisites and dependencies.
 */
let getMaxLevel = (staticData, hero, sourceId, dependencies, prerequisites) =>
  Prerequisites.Validation.getMaxLevel(
    staticData,
    hero,
    sourceId,
    prerequisites,
  )
  |> F.flip(
       L.Foldable.foldl((prevMax, {Hero.Activatable.active, level, _}) =>
         switch (active, prevMax, level) {
         // active must be always false because it needs to *prohibit* a certain
         // level
         //
         // also, if there is both a previous max and an prohibited level in the
         // dependency, take the minimum value
         //
         // the prohibited level is reduced by 1 since this level should not be
         // reached, thus the maximum level must be lower
         | (false, Some(prev), Some(notAllowed)) =>
           Some(I.min(prev, notAllowed - 1))
         | (false, Some(prev), None) => Some(prev)
         | (false, None, Some(notAllowed)) => Some(notAllowed - 1)
         | (false, None, None) => None
         | (true, _, _) => prevMax
         }
       ),
       dependencies,
     );
