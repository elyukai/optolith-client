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
  open Hero.TransferUnfamiliar;

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
  //
  // const removeTradById = (id: string) => filter (pipe (ADA.id, equals (id)))
  //
  // /**
  //  * Remove all unfamiliar deps by the specified entry.
  //  */
  // const removeUnfamiliarDepsById = (id: string) => filter (pipe (TUA.srcId, equals (id)))
  //
  // const getUnfamiliarCount: (wiki: StaticDataRecord) =>
  //                           (transferred_unfamiliar: List<Record<TransferUnfamiliar>>) =>
  //                           (trad_hero_entries: List<Record<ActivatableDependent>>) =>
  //                           (spells: List<Record<ActivatableSkillDependent>>) => number =
  //   wiki =>
  //   transferred_unfamiliar =>
  //   trad_hero_entries =>
  //     countWith ((x: Record<ActivatableSkillDependent>) =>
  //                 pipe_ (
  //                   x,
  //                   ASDA.id,
  //                   lookupF (SDA.spells (wiki)),
  //                   maybe (false)
  //                         (isUnfamiliarSpell (transferred_unfamiliar)
  //                                           (trad_hero_entries))
  //                 ))
  //
  // const getUnfamiliarCountAfter: (wiki: StaticDataRecord) =>
  //                               (transferred_unfamiliar: List<Record<TransferUnfamiliar>>) =>
  //                               (trad_hero_entries: List<Record<ActivatableDependent>>) =>
  //                               (src_id: string) =>
  //                               (spells: List<Record<ActivatableSkillDependent>>) => number =
  //   wiki =>
  //   transferred_unfamiliar =>
  //   trad_hero_entries =>
  //   src_id =>
  //     getUnfamiliarCount (wiki)
  //                       (removeUnfamiliarDepsById (src_id) (transferred_unfamiliar))
  //                       (removeTradById (src_id) (trad_hero_entries))
  //
  // /**
  //  * Check if an entry that allows transferring unfamiliar entries into a familiar
  //  * tradition can be removed, because it might happen, that this is not allowed,
  //  * because otherwise you'd have more unfamiliar spells than allowed by the
  //  * selected experience level during creation phase.
  //  */
  // export const isEntryAllowingTransferUnfamiliarRemovable: (wiki: StaticDataRecord) =>
  //                                                         (hero: HeroModelRecord) =>
  //                                                         (src_id: string) => boolean =
  //   wiki => hero => {
  //     if (HA.phase (hero) >= Phase.inGame) {
  //       return cnst (true)
  //     }
  //
  //     const trad_hero_entries = getMagicalTraditionsHeroEntries (HA.specialAbilities (hero))
  //     const transferred_unfamiliar = HA.transferredUnfamiliarSpells (hero)
  //     const spells = elems (HA.spells (hero))
  //
  //     return maybe (cnst (false) as (src_id: string) => boolean)
  //                 (pipe (
  //                   ELA.maxUnfamiliarSpells,
  //                   max_unfamiliar => src_id =>
  //                     max_unfamiliar >= getUnfamiliarCountAfter (wiki)
  //                                                               (transferred_unfamiliar)
  //                                                               (trad_hero_entries)
  //                                                               (src_id)
  //                                                               (spells)
  //                 ))
  //                 (lookup (HA.experienceLevel (hero))
  //                         (SDA.experienceLevels (wiki)))
  //   }
  //
  // /**
  //  * From a list of spell select options, only return the **unfamiliar** ones.
  //  */
  // export const filterUnfamiliar =
  //   (pred: (x: Record<Spell>) => boolean) =>
  //   (static_data: StaticDataRecord) =>
  //     filter ((x: Record<SelectOption>) =>
  //               pipe_ (
  //                 x,
  //                 SOA.id,
  //                 isStringM,
  //                 bindF (lookupF (SDA.spells (static_data))),
  //                 maybe (false) (pred)
  //               ))
};

// type ModifyAttributeDependency =
//   (d: SkillDependency) => (id: string) => (state: HeroModelRecord) => HeroModelRecord
//
// type ModifySkillDependency =
//   (d: SkillDependency) => (id: string) => (state: HeroModelRecord) => HeroModelRecord
//
// type ModifyActivatableSkillDependency =
//   (d: ExtendedSkillDependency) => (id: string) => (state: HeroModelRecord) => HeroModelRecord
//
// type ModifyActivatableDependency =
//   (d: ActivatableDependency) => (id: string) => (state: HeroModelRecord) => HeroModelRecord
//
// const putActivatableDependency =
//   (f: ModifyActivatableDependency) =>
//   (sourceId: string) =>
//   (req: Record<RequireActivatable>): ident<HeroModelRecord> => {
//     const id = RAA.id (req)
//     const sid = RAA.sid (req)
//     const sid2 = RAA.sid2 (req)
//     const level = RAA.tier (req)
//
//     if (isList (id)) {
//       if (isNothing (sid) && isNothing (sid2) && isNothing (level)) {
//         return flip (foldr (f (DependencyObject ({
//                                                   origin: Just (sourceId),
//                                                   active: Just (RAA.active (req)),
//                                                 }))))
//                     (id)
//       }
//
//       return flip (foldr (f (DependencyObject ({
//                                                 origin: Just (sourceId),
//                                                 active:
//                                                   isList (sid)
//                                                   ? Just (RAA.active (req))
//                                                   : Nothing,
//                                                 sid,
//                                                 sid2,
//                                                 tier: level,
//                                               }))))
//                   (id)
//     }
//
//     // current_id is no list:
//
//     if (isNothing (sid) && isNothing (sid2) && isNothing (level)) {
//       return f (RAA.active (req)) (id)
//     }
//
//     return f (DependencyObject ({
//                                  active:
//                                    isList (sid)
//                                    ? Just (RAA.active (req))
//                                    : Nothing,
//                                  sid,
//                                  sid2,
//                                  tier: level,
//                                }))
//              (id)
//   }
//
// const putPrimaryAttributeDependency =
//   (f: ModifyAttributeDependency) =>
//   (req: Record<RequirePrimaryAttribute>) =>
//   (state: HeroModelRecord): HeroModelRecord =>
//     fromMaybe (state)
//               (fmap ((x: string) => f (RPAA.value (req)) (x) (state))
//                     (getPrimaryAttributeId (HA.specialAbilities (state))
//                                            (RPAA.type (req))))
//
// const getMatchingIncreasableModifier =
//   (f: ModifyAttributeDependency) =>
//   (g: ModifySkillDependency) =>
//   (h: ModifyActivatableSkillDependency) =>
//   (id: string): ModifySkillDependency => {
//     const isOfCategory = elemF (getCategoryById (id))
//
//     if (isOfCategory (Category.ATTRIBUTES)) {
//       return f
//     }
//
//     if (isOfCategory (Category.LITURGICAL_CHANTS) || isOfCategory (Category.SPELLS)) {
//       return h
//     }
//
//     return g
//   }
//
// const putIncreasableDependency =
//   (f: ModifyAttributeDependency) =>
//   (g: ModifySkillDependency) =>
//   (h: ModifyActivatableSkillDependency) =>
//   (sourceId: string) =>
//   (req: Record<RequireIncreasable>) =>
//   (state: HeroModelRecord): HeroModelRecord => {
//     const { id, value } = RequireIncreasable.AL
//
//     const current_id = id (req)
//
//     if (isList (current_id)) {
//       return foldr (join (pipe (
//                                  getMatchingIncreasableModifier (f)
//                                                                 (g)
//                                                                 (h),
//                                  thrush (SkillOptionalDependency ({
//                                           origin: sourceId,
//                                           value: value (req),
//                                         }))
//                    )))
//                    (state)
//                    (current_id)
//     }
//
//     return getMatchingIncreasableModifier (f)
//                                           (g)
//                                           (h)
//                                           (current_id)
//                                           (value (req))
//                                           (current_id)
//                                           (state)
//   }
//
// const modifySocialDependency: (isToAdd: boolean) =>
//                               (prerequisite: Record<SocialPrerequisite>) =>
//                               (hero: Record<Hero>) => Record<Hero> =
//   isToAdd => x => over (HL.socialStatusDependencies)
//                        ((isToAdd ? consF : sdelete) (SocialPrerequisite.A.value (x)))
//
// const modifyDependencies =
//   (isToAdd: boolean) =>
//   (modifyAttributeDependency: ModifyAttributeDependency) =>
//   (modifySkillDependency: ModifySkillDependency) =>
//   (modifyActivatableSkillDependency: ModifyActivatableSkillDependency) =>
//   (modifyActivatableDependency: ModifyActivatableDependency) =>
//   (sourceId: string) =>
//     flip (foldr ((x: AllRequirements): ident<Record<Hero>> => {
//                   if (RequirePrimaryAttribute.is (x)) {
//                     return putPrimaryAttributeDependency (modifyAttributeDependency)
//                                                           (x)
//                   }
//                   else if (RequireIncreasable.is (x)) {
//                     return putIncreasableDependency (modifyAttributeDependency)
//                                                     (modifySkillDependency)
//                                                     (modifyActivatableSkillDependency)
//                                                     (sourceId)
//                                                     (x)
//                   }
//                   else if (
//                     RequireActivatable.is (x)
//                     && notEquals (RAA.sid (x)) (Just ("GR"))
//                   ) {
//                     return putActivatableDependency (modifyActivatableDependency)
//                                                     (sourceId)
//                                                     (x)
//                   }
//                   else if (SocialPrerequisite.is (x)) {
//                     return modifySocialDependency (isToAdd) (x)
//                   }
//                   else {
//                     return ident
//                   }
//                 }))
//
// /**
//  * Adds dependencies to all required entries to ensure rule validity.
//  */
// export const addDependencies = modifyDependencies (true)
//                                                   (addAttributeDependency)
//                                                   (addSkillDependency)
//                                                   (addActivatableSkillDependency)
//                                                   (addActivatableDependency)
//
// /**
//  * Removes dependencies from all required entries to ensure rule validity.
//  */
// export const removeDependencies = modifyDependencies (false)
//                                                      (removeAttributeDependency)
//                                                      (removeSkillDependency)
//                                                      (removeActivatableSkillDependency)
//                                                      (removeActivatableDependency)
