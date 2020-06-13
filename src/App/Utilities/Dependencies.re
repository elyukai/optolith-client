open Ley.Option;

module Flatten = {
  /**
   * `flattenSkillDependencies getValueForTargetId id dependencies` flattens the
   * list of dependencies to usable values. That means, optional dependencies
   * (objects) will be evaluated and will be included in the resulting list,
   * depending on whether it has to follow the optional dependency or not. The
   * result is a plain `List` of all non-optional dependencies.
   */
  let flattenSkillDependencies = (getValueForTargetId, id, dependencies) =>
    mapOption(
      (dep: Hero.Skill.dependency) =>
        switch (dep.target) {
        | One(_) => Some(dep.value)
        | Many(targets) =>
          targets
          |> Ley.List.delete(id)
          |> Ley.List.map(getValueForTargetId)
          // Check if the dependency is met by another entry so that it can be
          // ignored currently
          |> Ley.List.Foldable.any(value => value >= dep.value)
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
   * `flattenSkillDependencies getValueForTargetId id dependencies` flattens the
   * list of dependencies to usable values. That means, optional dependencies
   * (objects) will be evaluated and will be included in the resulting list,
   * depending on whether it has to follow the optional dependency or not. The
   * result is a plain `List` of all non-optional dependencies.
   */
  let flattenActivatableSkillDependencies =
      (getValueForTargetId, id, dependencies) =>
    Hero.ActivatableSkill.(
      mapOption(
        (dep: Hero.Skill.dependency) =>
          switch (dep.target) {
          | One(_) => Some(dep.value)
          | Many(targets) =>
            targets
            |> Ley.List.delete(id)
            |> Ley.List.map(getValueForTargetId)
            // Check if the dependency is met by another entry so that it can be
            // ignored currently
            |> Ley.List.Foldable.any(value =>
                 switch (value) {
                 // If dependency requires an active entry, the other entry must
                 // have at least the required value
                 | Active(value) => value >= dep.value
                 // Otherwise the dependency is not met by the other entry
                 | _ => false
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
};

module Add = {
  module Single = {
    let addAttributeDependency =
        (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      attributes:
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            |> Ley.Option.fromOption(Hero.Attribute.empty(id))
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            |> Ley.Option.fromOption(Hero.Skill.emptySkill(id))
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            |> Ley.Option.fromOption(Hero.Skill.emptyCombatTechnique(id))
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            |> Ley.Option.fromOption(Hero.ActivatableSkill.empty(id))
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            |> Ley.Option.fromOption(Hero.ActivatableSkill.empty(id))
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            |> Ley.Option.fromOption(Hero.Activatable.empty(id))
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            |> Ley.Option.fromOption(Hero.Activatable.empty(id))
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            |> Ley.Option.fromOption(Hero.Activatable.empty(id))
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
      Ley.List.Foldable.foldl(Single.addAttributeDependency(dep), hero, ids)
    };

  let addSkillDependency = (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addSkillDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(Single.addSkillDependency(dep), hero, ids)
    };

  let addCombatTechniqueDependency =
      (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addCombatTechniqueDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(
        Single.addCombatTechniqueDependency(dep),
        hero,
        ids,
      )
    };

  let addSpellDependency = (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addSpellDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(Single.addSpellDependency(dep), hero, ids)
    };

  let addLiturgicalChantDependency =
      (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addLiturgicalChantDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(
        Single.addLiturgicalChantDependency(dep),
        hero,
        ids,
      )
    };

  let addAdvantageDependency =
      (dep: Hero.Activatable.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addAdvantageDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(Single.addAdvantageDependency(dep), hero, ids)
    };

  let addDisadvantageDependency =
      (dep: Hero.Activatable.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addDisadvantageDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(
        Single.addDisadvantageDependency(dep),
        hero,
        ids,
      )
    };

  let addSpecialAbilityDependency =
      (dep: Hero.Activatable.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.addSpecialAbilityDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(
        Single.addSpecialAbilityDependency(dep),
        hero,
        ids,
      )
    };
};

module Remove = {
  module Single = {
    open Ley.Option.Functor;
    open Ley.Option.Monad;

    let removeAttributeDependency =
        (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      attributes:
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.Attribute.t) => {
                ...heroEntry,
                dependencies: Ley.List.delete(dep, heroEntry.dependencies),
              }
            )
            >>= Ley.Option.ensure(heroEntry =>
                  heroEntry |> Hero.Attribute.isUnused |> (!)
                ),
          id,
          hero.attributes,
        ),
    };

    let removeSkillDependency = (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      skills:
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.Skill.t) => {
                ...heroEntry,
                dependencies: Ley.List.delete(dep, heroEntry.dependencies),
              }
            )
            >>= Ley.Option.ensure(heroEntry =>
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.Skill.t) => {
                ...heroEntry,
                dependencies: Ley.List.delete(dep, heroEntry.dependencies),
              }
            )
            >>= Ley.Option.ensure(heroEntry =>
                  heroEntry |> Hero.Skill.isUnusedCombatTechnique |> (!)
                ),
          id,
          hero.combatTechniques,
        ),
    };

    let removeSpellDependency = (dep: Hero.Skill.dependency, hero: Hero.t, id) => {
      ...hero,
      spells:
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.ActivatableSkill.t) => {
                ...heroEntry,
                dependencies: Ley.List.delete(dep, heroEntry.dependencies),
              }
            )
            >>= Ley.Option.ensure(heroEntry =>
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.ActivatableSkill.t) => {
                ...heroEntry,
                dependencies: Ley.List.delete(dep, heroEntry.dependencies),
              }
            )
            >>= Ley.Option.ensure(heroEntry =>
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.Activatable.t) => {
                ...heroEntry,
                dependencies: Ley.List.delete(dep, heroEntry.dependencies),
              }
            )
            >>= Ley.Option.ensure(heroEntry =>
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.Activatable.t) => {
                ...heroEntry,
                dependencies: Ley.List.delete(dep, heroEntry.dependencies),
              }
            )
            >>= Ley.Option.ensure(heroEntry =>
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
        Ley.IntMap.alter(
          heroEntry =>
            heroEntry
            <&> (
              (heroEntry: Hero.Activatable.t) => {
                ...heroEntry,
                dependencies: Ley.List.delete(dep, heroEntry.dependencies),
              }
            )
            >>= Ley.Option.ensure(heroEntry =>
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
      Ley.List.Foldable.foldl(
        Single.removeAttributeDependency(dep),
        hero,
        ids,
      )
    };

  let removeSkillDependency = (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeSkillDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(Single.removeSkillDependency(dep), hero, ids)
    };

  let removeCombatTechniqueDependency =
      (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeCombatTechniqueDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(
        Single.removeCombatTechniqueDependency(dep),
        hero,
        ids,
      )
    };

  let removeSpellDependency = (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeSpellDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(Single.removeSpellDependency(dep), hero, ids)
    };

  let removeLiturgicalChantDependency =
      (dep: Hero.Skill.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeLiturgicalChantDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(
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
      Ley.List.Foldable.foldl(
        Single.removeAdvantageDependency(dep),
        hero,
        ids,
      )
    };

  let removeDisadvantageDependency =
      (dep: Hero.Activatable.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeDisadvantageDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(
        Single.removeDisadvantageDependency(dep),
        hero,
        ids,
      )
    };

  let removeSpecialAbilityDependency =
      (dep: Hero.Activatable.dependency, hero: Hero.t) =>
    switch (dep.target) {
    | One(id) => Single.removeSpecialAbilityDependency(dep, hero, id)
    | Many(ids) =>
      Ley.List.Foldable.foldl(
        Single.removeSpecialAbilityDependency(dep),
        hero,
        ids,
      )
    };
};

module TransferredUnfamiliar = {
  open Ley.Function;
  open Hero.TransferUnfamiliar;
  open Traditions.Magical;

  let isUnfamiliarSpell = (transferredUnfamiliar, heroTraditions) => {
    let isIntuitiveMageActive =
      Ley.List.Foldable.any(
        ((staticSpecialAbility, _, _): fullTradition) =>
          staticSpecialAbility.id
          === Id.specialAbilityToInt(TraditionIntuitiveMage),
        heroTraditions,
      );

    if (isIntuitiveMageActive) {
      const(false);
    } else {
      let activeTraditionNumericIds =
        heroTraditions
        |> Ley.List.Foldable.concatMap(((_, _, trad): fullTradition) =>
             trad.id === Id.specialAbilityToInt(TraditionGuildMages)
               ? trad.numId
                 |> Ley.Option.optionToList
                 |> Ley.List.cons(Id.magicalTraditionToInt(Qabalyamagier))
               : trad.numId |> Ley.Option.optionToList
           )
        |> Ley.List.cons(Id.magicalTraditionToInt(General));

      let isNoTraditionActive =
        Ley.Bool.notP(Ley.List.intersecting(activeTraditionNumericIds));

      (staticSpell: Static.Spell.t) =>
        Ley.List.Foldable.all(
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

  let getTransferredUnfamiliarById = (single: Activatable.singleWithId) =>
    switch (Id.specialAbilityFromInt(single.id)) {
    | TraditionGuildMages
    | MadaschwesternStil
    | ScholarDesMagierkollegsZuHoningen =>
      switch (single.options) {
      | [`Spell(id), ..._] => [{id: Spell(id), srcId: single.id}]
      | [_, ..._]
      | [] => []
      }
    | Zaubervariabilitaet => [{id: Spells, srcId: single.id}]
    | ScholarDerHalleDesLebensZuNorburg
    | ScholarDesKreisesDerEinfuehlung =>
      single.options
      |> Ley.List.take(3)
      |> Ley.Option.mapOption(
           fun
           | `Spell(id) => Some({id: Spell(id), srcId: single.id})
           | _ => None,
         )
    | _ => []
    };

  /**
   * Adds new transferred unfamiliar spells if the entry to activate allows
   * transferring unfamiliar spells.
   */
  let addTransferUnfamiliarDependencies =
      (single: Activatable.singleWithId, hero: Hero.t) =>
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
    Ley.List.filter(((x, _, _): fullTradition) => x.id === id, xs);

  /**
   * Remove all unfamiliar deps by the specified entry.
   */
  let removeUnfamiliarDepsById = (id, xs) =>
    Ley.List.filter((x: Hero.TransferUnfamiliar.t) => x.srcId === id, xs);

  let getUnfamiliarCount =
      (
        staticData: Static.t,
        transferredUnfamiliar,
        heroTraditions,
        heroSpells,
      ) =>
    Ley.List.countBy(
      (heroSpell: Hero.ActivatableSkill.t) =>
        Ley.IntMap.lookup(heroSpell.id, staticData.spells)
        |> Ley.Option.option(
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
      open Static.ExperienceLevel;

      let heroTraditions =
        Traditions.Magical.getEntries(staticData, hero.specialAbilities);
      let transferredUnfamiliar = hero.transferredUnfamiliarSpells;
      let spells = Ley.IntMap.elems(hero.spells);

      Ley.Option.option(
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
        Ley.IntMap.lookup(hero.experienceLevel, staticData.experienceLevels),
      );
    };

  /**
   * From a list of spell select options, only return the **unfamiliar** ones.
   */
  let filterUnfamiliar = (pred, staticData: Static.t, selectOptions) =>
    Ley.List.filter(
      (x: Static.SelectOption.t) =>
        (
          switch (x.id) {
          | `Spell(id) => Ley.IntMap.lookup(id, staticData.spells)
          | _ => None
          }
        )
        |> Ley.Option.option(false, pred),
      selectOptions,
    );
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
    (mode, sourceId, prerequisite: Static.Prerequisites.activatable, hero) =>
  putActivatableDependency(
    mode,
    switch (prerequisite.id) {
    | `Advantage(_) => Advantages
    | `Disadvantage(_) => Disadvantages
    | `SpecialAbility(_) => SpecialAbilities
    },
    {
      source: sourceId,
      target:
        switch (prerequisite.id) {
        | `Advantage(id)
        | `Disadvantage(id)
        | `SpecialAbility(id) => One(id)
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
    (
      mode,
      sourceId,
      prerequisite: Static.Prerequisites.activatableMultiEntry,
      hero,
    ) =>
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
    (
      mode,
      sourceId,
      prerequisite: Static.Prerequisites.activatableMultiSelect,
      hero,
    ) =>
  putActivatableDependency(
    mode,
    switch (prerequisite.id) {
    | `Advantage(_) => Advantages
    | `Disadvantage(_) => Disadvantages
    | `SpecialAbility(_) => SpecialAbilities
    },
    {
      source: sourceId,
      target:
        switch (prerequisite.id) {
        | `Advantage(id)
        | `Disadvantage(id)
        | `SpecialAbility(id) => One(id)
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
    (mode, sourceId, prerequisite: Static.Prerequisites.increasable, hero) =>
  putIncreasableDependency(
    mode,
    switch (prerequisite.id) {
    | `Attribute(_) => Attributes
    | `Skill(_) => Skills
    | `CombatTechnique(_) => CombatTechniques
    | `Spell(_) => Spells
    | `LiturgicalChant(_) => LiturgicalChants
    },
    {
      source: sourceId,
      target:
        switch (prerequisite.id) {
        | `Attribute(id)
        | `Skill(id)
        | `CombatTechnique(id)
        | `Spell(id)
        | `LiturgicalChant(id) => One(id)
        },
      value: prerequisite.value,
    },
    hero,
  );

let applyIncreasableMultiEntryPrerequisite =
    (
      mode,
      sourceId,
      prerequisite: Static.Prerequisites.increasableMultiEntry,
      hero,
    ) =>
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
      prerequisite: Static.Prerequisites.primaryAttribute,
      hero: Hero.t,
    ) =>
  (
    switch (prerequisite.scope) {
    | Magical =>
      Traditions.Magical.getPrimaryAttributeId(
        staticData,
        hero.specialAbilities,
      )
    | Blessed =>
      Traditions.Blessed.getPrimaryAttributeId(
        staticData,
        hero.specialAbilities,
      )
    }
  )
  |> Ley.Option.option(
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
    (mode, prerequisite: Static.Prerequisites.socialStatus, hero: Hero.t) => {
  ...hero,
  socialStatusDependencies:
    switch (mode) {
    | Add => Ley.List.cons(prerequisite, hero.socialStatusDependencies)
    | Remove => Ley.List.delete(prerequisite, hero.socialStatusDependencies)
    },
};

let modifyDependencies =
    (mode, staticData, prerequisites, sourceId: Id.prerequisiteSource, hero) =>
  Ley.List.Foldable.foldr(
    (prerequisite: Prerequisites.prerequisite) =>
      switch (prerequisite, sourceId) {
      | (
          PrimaryAttribute(options),
          `Advantage(_) as id | `Disadvantage(_) as id |
          `SpecialAbility(_) as id |
          `Spell(_) as id |
          `LiturgicalChant(_) as id,
        ) =>
        applyPrimaryAttributePrerequisite(mode, id, staticData, options)
      | (
          Activatable(options),
          `Advantage(_) as id | `Disadvantage(_) as id |
          `SpecialAbility(_) as id,
        ) =>
        applyActivatablePrerequisite(mode, id, options)
      | (
          ActivatableMultiEntry(options),
          `Advantage(_) as id | `Disadvantage(_) as id |
          `SpecialAbility(_) as id,
        ) =>
        applyActivatableMultiEntryPrerequisite(mode, id, options)
      | (
          ActivatableMultiSelect(options),
          `Advantage(_) as id | `Disadvantage(_) as id |
          `SpecialAbility(_) as id,
        ) =>
        applyActivatableMultiSelectPrerequisite(mode, id, options)
      | (
          Increasable(options),
          `Advantage(_) as id | `Disadvantage(_) as id |
          `SpecialAbility(_) as id |
          `Spell(_) as id |
          `LiturgicalChant(_) as id,
        ) =>
        applyIncreasablePrerequisite(mode, id, options)
      | (
          IncreasableMultiEntry(options),
          `Advantage(_) as id | `Disadvantage(_) as id |
          `SpecialAbility(_) as id |
          `Spell(_) as id |
          `LiturgicalChant(_) as id,
        ) =>
        applyIncreasableMultiEntryPrerequisite(mode, id, options)
      | _ => Ley.Function.id
      },
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
