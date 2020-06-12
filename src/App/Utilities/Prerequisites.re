open Static_Prerequisites;

type prerequisite =
  | CommonSuggestedByRCP
  | Sex(sex)
  | Race(race)
  | Culture(culture)
  | Pact(pact)
  | Social(socialStatus)
  | PrimaryAttribute(primaryAttribute)
  | Activatable(activatable)
  | ActivatableMultiEntry(activatableMultiEntry)
  | ActivatableMultiSelect(activatableMultiSelect)
  | Increasable(increasable)
  | IncreasableMultiEntry(increasableMultiEntry);

module Flatten = {
  open Ley.Function;

  let applicablePred = (oldLevel, newLevel) =>
    switch (oldLevel, newLevel) {
    // Used for changing level
    | (Some(oldLevel), Some(newLevel)) =>
      let (min, max) = Ley.Int.minmax(oldLevel, newLevel);
      Ley.Ix.inRange((min + 1, max));
    // Used for deactivating an entry
    | (Some(level), None)
    // Used for activating an entry
    | (None, Some(level)) => (>=)(level)
    | (None, None) => const(true)
    };

  let filterApplicableLevels = (oldLevel, newLevel, mp) => {
    let pred = applicablePred(oldLevel, newLevel);
    Ley.IntMap.filterWithKey((k, _) => pred(k), mp);
  };

  let flattenPrerequisiteLevel = (p: t, xs) =>
    xs
    |> Ley.Option.option(id, x => Sex(x) |> Ley.List.cons, p.sex)
    |> Ley.Option.option(id, x => Race(x) |> Ley.List.cons, p.race)
    |> Ley.Option.option(id, x => Culture(x) |> Ley.List.cons, p.culture)
    |> Ley.Option.option(id, x => Pact(x) |> Ley.List.cons, p.pact)
    |> Ley.Option.option(
         id,
         x => PrimaryAttribute(x) |> Ley.List.cons,
         p.primaryAttribute,
       )
    |> (
      xs =>
        p.activatable
        |> Ley.List.Foldable.foldr(x => Activatable(x) |> Ley.List.cons, xs)
    )
    |> (
      xs =>
        p.activatableMultiEntry
        |> Ley.List.Foldable.foldr(
             x => ActivatableMultiEntry(x) |> Ley.List.cons,
             xs,
           )
    )
    |> (
      xs =>
        p.activatableMultiSelect
        |> Ley.List.Foldable.foldr(
             x => ActivatableMultiSelect(x) |> Ley.List.cons,
             xs,
           )
    )
    |> (
      xs =>
        p.increasable
        |> Ley.List.Foldable.foldr(x => Increasable(x) |> Ley.List.cons, xs)
    )
    |> (
      xs =>
        p.increasableMultiEntry
        |> Ley.List.Foldable.foldr(
             x => IncreasableMultiEntry(x) |> Ley.List.cons,
             xs,
           )
    );

  let getFirstLevelPrerequisites = (prerequisites: tWithLevel) =>
    flattenPrerequisiteLevel(
      {
        sex: prerequisites.sex,
        race: prerequisites.race,
        culture: prerequisites.culture,
        pact: prerequisites.pact,
        social: prerequisites.social,
        primaryAttribute: prerequisites.primaryAttribute,
        activatable: prerequisites.activatable,
        activatableMultiEntry: prerequisites.activatableMultiEntry,
        activatableMultiSelect: prerequisites.activatableMultiSelect,
        increasable: prerequisites.increasable,
        increasableMultiEntry: prerequisites.increasableMultiEntry,
      },
      [],
    );

  let getFirstDisAdvLevelPrerequisites = (p: tWithLevelDisAdv) =>
    flattenPrerequisiteLevel(
      {
        sex: p.sex,
        race: p.race,
        culture: p.culture,
        pact: p.pact,
        social: p.social,
        primaryAttribute: p.primaryAttribute,
        activatable: p.activatable,
        activatableMultiEntry: p.activatableMultiEntry,
        activatableMultiSelect: p.activatableMultiSelect,
        increasable: p.increasable,
        increasableMultiEntry: p.increasableMultiEntry,
      },
      [],
    )
    |> (p.commonSuggestedByRCP ? Ley.List.cons(CommonSuggestedByRCP) : id);

  let flattenPrerequisites = (oldLevel, newLevel, prerequisites: tWithLevel) =>
    if (Ley.IntMap.null(prerequisites.levels)) {
      getFirstLevelPrerequisites(prerequisites);
    } else {
      filterApplicableLevels(oldLevel, newLevel, prerequisites.levels)
      |> Ley.IntMap.Foldable.foldr(
           flattenPrerequisiteLevel,
           getFirstLevelPrerequisites(prerequisites),
         );
    };
};

module Dynamic = {
  open Static;
  open Ley.Function;
  open Ley.Option.Functor;
  open Ley.Option.Monad;

  let getEntrySpecificDynamicPrerequisites =
      (
        ~isEntryToAdd,
        staticData,
        staticEntry,
        heroEntry: option(Hero.Activatable.t),
        singleEntry: Activatable.singleWithId,
      ) => {
    let sid = Activatable.getOption1(singleEntry);
    let sid2 = Activatable.getOption2(singleEntry);

    switch (staticEntry) {
    | Advantage(entry) =>
      switch (Id.advantageFromInt(entry.id)) {
      | Aptitude
      | ExceptionalSkill => [
          Activatable({
            id: `Disadvantage(Id.disadvantageToInt(Incompetent)),
            active: false,
            sid: sid >>= Activatable.Convert.activatableOptionToSelectOptionId,
            sid2: None,
            level: None,
          }),
        ]
      | MagicalAttunement => [
          Activatable({
            id: `Disadvantage(Id.disadvantageToInt(MagicalRestriction)),
            active: false,
            sid: sid >>= Activatable.Convert.activatableOptionToSelectOptionId,
            sid2: None,
            level: None,
          }),
        ]
      | _ => []
      }
    | Disadvantage(entry) =>
      switch (Id.disadvantageFromInt(entry.id)) {
      | MagicalRestriction => [
          Activatable({
            id: `Advantage(Id.advantageToInt(MagicalAttunement)),
            active: false,
            sid: sid >>= Activatable.Convert.activatableOptionToSelectOptionId,
            sid2: None,
            level: None,
          }),
        ]
      | Incompetent => [
          Activatable({
            id: `Advantage(Id.advantageToInt(Aptitude)),
            active: false,
            sid: sid >>= Activatable.Convert.activatableOptionToSelectOptionId,
            sid2: None,
            level: None,
          }),
          Activatable({
            id: `Advantage(Id.advantageToInt(ExceptionalSkill)),
            active: false,
            sid: sid >>= Activatable.Convert.activatableOptionToSelectOptionId,
            sid2: None,
            level: None,
          }),
        ]
      | _ => []
      }
    | SpecialAbility(entry) =>
      switch (Id.specialAbilityFromInt(entry.id)) {
      | SkillSpecialization =>
        let sameSkillActiveCount =
          Ley.Option.option(
            0,
            (heroEntry: Hero.Activatable.t) =>
              heroEntry.active
              |> Ley.List.countBy((x: Hero.Activatable.single) =>
                   Ley.Option.listToOption(x.options) == sid
                 ),
            heroEntry,
          );

        let sameSkillDependency =
          switch (sid) {
          | Some(`Skill(_) as id) =>
            Some(
              Increasable({
                id,
                value: (sameSkillActiveCount + (isEntryToAdd ? 1 : 0)) * 6,
              }),
            )
          | _ => None
          };

        sid
        >>= Activatable.SelectOptions.getSelectOption(staticEntry)
        >>= (
          option =>
            (
              switch (option.wikiEntry) {
              | Some(Skill(skill)) => Some(skill.applications)
              | _ => None
              }
            )
            >>= (
              appMp =>
                (
                  switch (sid2) {
                  | Some(`Generic(id)) =>
                    Ley.IntMap.Foldable.find(
                      (app: Static.Skill.application) => app.id === id,
                      appMp,
                    )
                  | _ => None
                  }
                )
                >>= (
                  app =>
                    app.prerequisite
                    <&> (prerequisite => Activatable(prerequisite))
                )
            )
        )
        |> Ley.Option.optionToList
        |> Ley.List.append(Ley.Option.optionToList(sameSkillDependency));
      | PropertyFocus => [
          Activatable({
            id: `SpecialAbility(Id.specialAbilityToInt(PropertyKnowledge)),
            active: true,
            sid: sid >>= Activatable.Convert.activatableOptionToSelectOptionId,
            sid2: None,
            level: None,
          }),
        ]
      | AdaptionZauber =>
        switch (sid) {
        | Some(`Spell(_) as id) => [Increasable({id, value: 10})]
        | _ => []
        }
      | FavoriteSpellwork =>
        switch (sid) {
        | Some(`Spell(_) as id) => [Increasable({id, value: 0})]
        | _ => []
        }
      | SpellEnhancement as id
      | ChantEnhancement as id =>
        sid
        >>= Activatable.SelectOptions.getSelectOption(staticEntry)
        >>= (
          option =>
            liftM2(
              (target, level) =>
                [
                  Increasable({
                    id:
                      id === SpellEnhancement
                        ? `Spell(target) : `LiturgicalChant(target),
                    value: level * 4 + 4,
                  }),
                ],
              option.enhancementTarget,
              option.enhancementLevel,
            )
        )
        |> Ley.Option.fromOption([])
      | LanguageSpecializations => [
          Activatable({
            id: `SpecialAbility(Id.specialAbilityToInt(Language)),
            active: true,
            sid: sid >>= Activatable.Convert.activatableOptionToSelectOptionId,
            sid2: None,
            level: Some(3),
          }),
        ]
      | Kraftliniennutzung =>
        staticData.magicalTraditions
        |> Ley.IntMap.Foldable.foldr(
             (x: Static.MagicalTradition.t) =>
               x.canLearnRituals ? Ley.List.cons(x.id) : id,
             [],
           )
        |> Ley.Option.ensure(Ley.List.Extra.notNull)
        |> Ley.Option.option([], ids =>
             [
               ActivatableMultiEntry({
                 id: SpecialAbilities(ids),
                 active: true,
                 sid: None,
                 sid2: None,
                 level: None,
               }),
             ]
           )
      | _ => []
      }
    };
  };

  let getSelectOptionPrerequisites = (sid, staticEntry) =>
    (
      switch (staticEntry) {
      | Advantage(entry) => entry.selectOptions
      | Disadvantage(entry) => entry.selectOptions
      | SpecialAbility(entry) => entry.selectOptions
      }
    )
    |> Static.SelectOption.SelectOptionMap.lookup(sid)
    |> Ley.Option.option([], (option: Static.SelectOption.t) =>
         Flatten.flattenPrerequisiteLevel(option.prerequisites, [])
       );

  /**
   * Some advantages, disadvantages and special abilities need more prerequisites
   * than given in their respective main array.
   * @param wikiEntry The entry for which you want to add the dependencies.
   * @param instance The state entry *before* adding or removing the active
   * object.
   * @param active The actual active object.
   * @param add States if the prerequisites should be added or removed (some
   * prerequisites must be calculated based on that).
   */
  let getDynamicPrerequisites =
      (
        ~isEntryToAdd,
        staticData,
        staticEntry,
        heroEntry,
        singleEntry: Activatable.singleWithId,
      ) => {
    let sid = Activatable.getOption1(singleEntry);

    let entrySpecifics =
      getEntrySpecificDynamicPrerequisites(
        ~isEntryToAdd,
        staticData,
        staticEntry,
        heroEntry,
        singleEntry,
      );

    let selectOptionSpecifics =
      sid
      >>= Activatable.Convert.activatableOptionToSelectOptionId
      |> Ley.Option.option([], sid =>
           getSelectOptionPrerequisites(sid, staticEntry)
         );

    selectOptionSpecifics @ entrySpecifics;
  };
};

module Validation = {
  open Ley.Function;
  open Ley.Option.Monad;

  // type Validator = (wiki: StaticDataRecord) =>
  //                  (state: HeroModelRecord) =>
  //                  (req: AllRequirements) =>
  //                  (sourceId: string) => boolean

  let getRaceCultureProfession = (staticData: Static.t, hero: Hero.t) => (
    (
      switch (hero.race) {
      | Some(Base(id) | WithVariant(id, _)) => Some(id)
      | None => None
      }
    )
    >>= flip(Ley.IntMap.lookup, staticData.races),
    (
      switch (hero.culture) {
      | Some(id) => Some(id)
      | None => None
      }
    )
    >>= flip(Ley.IntMap.lookup, staticData.cultures),
    (
      switch (hero.profession) {
      | Some(Base(id) | WithVariant(id, _)) => Some(id)
      | None => None
      }
    )
    >>= flip(Ley.IntMap.lookup, staticData.professions),
  );

  let isCommonSuggestedByRCPValid = (staticData, hero, id: Id.t) => {
    let (race, culture, profession) =
      getRaceCultureProfession(staticData, hero);
    switch (id) {
    | `Advantage(id) =>
      Ley.Option.option(
        false,
        (race: Static.Race.t) =>
          Ley.List.elem(id, race.automaticAdvantages)
          || Ley.List.elem(id, race.stronglyRecommendedAdvantages)
          || Ley.List.elem(id, race.commonAdvantages),
        race,
      )
      || Ley.Option.option(
           false,
           (culture: Static.Culture.t) =>
             Ley.List.elem(id, culture.commonAdvantages),
           culture,
         )
      || Ley.Option.option(
           false,
           (profession: Static.Profession.t) =>
             Ley.List.elem(id, profession.suggestedAdvantages),
           profession,
         )
    | `Disadvantage(id) =>
      Ley.Option.option(
        false,
        (race: Static.Race.t) =>
          Ley.List.elem(id, race.stronglyRecommendedDisadvantages)
          || Ley.List.elem(id, race.commonDisadvantages),
        race,
      )
      || Ley.Option.option(
           false,
           (culture: Static.Culture.t) =>
             Ley.List.elem(id, culture.commonDisadvantages),
           culture,
         )
      || Ley.Option.option(
           false,
           (profession: Static.Profession.t) =>
             Ley.List.elem(id, profession.suggestedDisadvantages),
           profession,
         )
    | _ => false
    };
  };

  let isSexValid = (current: Hero.t, prerequisite: sex) =>
    current.sex === prerequisite;

  let isRaceValid = (current: Hero.t, prerequisite: race) =>
    switch (current.race, prerequisite) {
    | (Some(Base(id) | WithVariant(id, _)), {id: One(requiredId), active}) =>
      requiredId === id === active
    | (
        Some(Base(id) | WithVariant(id, _)),
        {id: Many(requiredIds), active},
      ) =>
      Ley.List.elem(id, requiredIds) === active
    | (None, _) => false
    };

  let isCultureValid = (current: Hero.t, prerequisite: culture) =>
    switch (current.culture, prerequisite) {
    | (Some(id), One(requiredId)) => requiredId === id
    | (Some(id), Many(requiredIds)) => Ley.List.elem(id, requiredIds)
    | (None, _) => false
    };

  let hasSamePactCategory = (current: Hero.Pact.t, prerequisite: pact) =>
    prerequisite.category === current.category;

  let hasNeededPactType = (current: Hero.Pact.t, prerequisite: pact) =>
    switch (prerequisite.category) {
    // Fairies must be High Fairies to get into a pact
    | 1 => current.type_ === 3
    | _ => true
    };

  let hasNeededPactDomain = (current: Hero.Pact.t, prerequisite: pact) =>
    switch (prerequisite.domain, current.domain) {
    | (None, _) => true
    | (_, Custom(_)) => false
    | (Some(Many(requiredDomains)), Predefined(domain)) =>
      Ley.List.elem(domain, requiredDomains)
    | (Some(One(requiredDomain)), Predefined(domain)) =>
      domain === requiredDomain
    };

  let hasNeededPactLevel = (current: Hero.Pact.t, prerequisite: pact) =>
    switch (prerequisite.level) {
    | Some(requiredLevel) =>
      // Fulfills the level requirement
      requiredLevel <= current.level
      // Its a lesser Pact and the needed Pact-Level is "1"
      || requiredLevel <= 1
      && current.level === 0
    | None => true
    };

  let isPactValid = (current: Hero.t, prerequisite: pact) =>
    switch (current.pact) {
    | Some(pact) =>
      Pact.isPactFromStateValid(pact)
      && hasSamePactCategory(pact, prerequisite)
      && hasNeededPactType(pact, prerequisite)
      && hasNeededPactDomain(pact, prerequisite)
      && hasNeededPactLevel(pact, prerequisite)
    | None => false
    };

  let getPrimaryAttributeId =
      (staticData, heroSpecialAbilities, scope: primaryAttributeType) =>
    switch (scope) {
    | Magical =>
      Traditions.Magical.getPrimaryAttributeId(
        staticData,
        heroSpecialAbilities,
      )
    | Blessed =>
      Traditions.Blessed.getPrimaryAttributeId(
        staticData,
        heroSpecialAbilities,
      )
    };

  let isPrimaryAttributeValid =
      (staticData, current: Hero.t, prerequisite: primaryAttribute) =>
    getPrimaryAttributeId(
      staticData,
      current.specialAbilities,
      prerequisite.scope,
    )
    >>= flip(Ley.IntMap.lookup, current.attributes)
    |> (
      attr =>
        Ley.Option.option(8, (attr: Hero.Attribute.t) => attr.value, attr)
        >= prerequisite.value
    );

  let isSocialStatusValid = (current: Hero.t, prerequisite: socialStatus) =>
    switch (current.personalData.socialStatus) {
    | Some(socialStatus) => socialStatus >= prerequisite
    | None => false
    };

  let hasIncreasableMinValue =
      (current: Hero.t, {id, value: minValue}: increasable) =>
    switch (id) {
    | `Attribute(id) =>
      current.attributes
      |> Ley.IntMap.lookup(id)
      |> Ley.Option.option(false, (x: Hero.Attribute.t) =>
           x.value >= minValue
         )
    | `Skill(id) =>
      current.skills
      |> Ley.IntMap.lookup(id)
      |> Ley.Option.option(false, (x: Hero.Skill.t) => x.value >= minValue)
    | `CombatTechnique(id) =>
      current.combatTechniques
      |> Ley.IntMap.lookup(id)
      |> Ley.Option.option(false, (x: Hero.Skill.t) => x.value >= minValue)
    | `Spell(id) =>
      current.spells
      |> Ley.IntMap.lookup(id)
      |> Ley.Option.option(false, (x: Hero.ActivatableSkill.t) =>
           switch (x.value) {
           | Active(value) => value >= minValue
           | Inactive => false
           }
         )
    | `LiturgicalChant(id) =>
      current.liturgicalChants
      |> Ley.IntMap.lookup(id)
      |> Ley.Option.option(false, (x: Hero.ActivatableSkill.t) =>
           switch (x.value) {
           | Active(value) => value >= minValue
           | Inactive => false
           }
         )
    };

  let isIncreasableValid = (current: Hero.t, prerequisite: increasable) =>
    hasIncreasableMinValue(current, prerequisite);

  let isIncreasableMultiEntryValid =
      (current: Hero.t, {id: ids, value}: increasableMultiEntry) =>
    Ley.List.Foldable.any(
      id => hasIncreasableMinValue(current, {id, value}),
      switch (ids) {
      | Attributes(ids) => Ley.List.map(id => `Attribute(id), ids)
      | Skills(ids) => Ley.List.map(id => `Skill(id), ids)
      | CombatTechniques(ids) =>
        Ley.List.map(id => `CombatTechnique(id), ids)
      | Spells(ids) => Ley.List.map(id => `Spell(id), ids)
      | LiturgicalChants(ids) =>
        Ley.List.map(id => `LiturgicalChant(id), ids)
      },
    );

  let isSafeSidValid = (single: Hero.Activatable.single, index, sid) =>
    Ley.List.Safe.atMay(single.options, index)
    >>= Activatable.Convert.activatableOptionToSelectOptionId
    |> Ley.Option.option(false, (===)(sid));

  let isSidValid = (single: Hero.Activatable.single, index, sid) =>
    switch (sid) {
    | None => true
    | Some(sid) => isSafeSidValid(single, index, sid)
    };

  let isLevelValid = (single: Hero.Activatable.single, level) =>
    switch (level) {
    | None => true
    | Some(level) => Ley.Option.option(false, (===)(level), single.level)
    };

  let isSingleActivatableValid =
      (current: Hero.t, {id, active, sid, sid2, level}: activatable) =>
    (
      switch (id) {
      | `Advantage(id) => current.advantages |> Ley.IntMap.lookup(id)
      | `Disadvantage(id) => current.disadvantages |> Ley.IntMap.lookup(id)
      | `SpecialAbility(id) =>
        current.specialAbilities |> Ley.IntMap.lookup(id)
      }
    )
    |> (
      fun
      // If there is no entry, it can't be active. So if it's required the entry
      // must be inactive, this is automatically valid
      | None => !active
      | Some(heroEntry) => {
          // Otherwise search for any entry that matches the entry options. If
          // an entry is found must than match if the entry is required to be
          // active or inactive
          Ley.List.Foldable.any(
            single =>
              isSidValid(single, 0, sid)
              && isSidValid(single, 1, sid2)
              && isLevelValid(single, level),
            heroEntry.active,
          )
          === active;
        }
    );

  let isActivatableValid = (current: Hero.t, prerequisite: activatable) =>
    isSingleActivatableValid(current, prerequisite);

  let isActivatableMultiEntryValid =
      (
        current: Hero.t,
        {id: ids, active, sid, sid2, level}: activatableMultiEntry,
      ) =>
    Ley.List.Foldable.any(
      id =>
        isSingleActivatableValid(current, {id, active, sid, sid2, level}),
      switch (ids) {
      | Advantages(ids) => Ley.List.map(id => `Advantage(id), ids)
      | Disadvantages(ids) => Ley.List.map(id => `Disadvantage(id), ids)
      | SpecialAbilities(ids) => Ley.List.map(id => `SpecialAbility(id), ids)
      },
    );

  let isActivatableMultiSelectValid =
      (
        current: Hero.t,
        {id, active, sid: sids, sid2, level}: activatableMultiSelect,
      ) =>
    (
      switch (id) {
      | `Advantage(id) => current.advantages |> Ley.IntMap.lookup(id)
      | `Disadvantage(id) => current.disadvantages |> Ley.IntMap.lookup(id)
      | `SpecialAbility(id) =>
        current.specialAbilities |> Ley.IntMap.lookup(id)
      }
    )
    |> (
      fun
      // If there is no entry, it can't be active. So if it's required the entry
      // must be inactive, this is automatically valid
      | None => !active
      | Some(heroEntry) => {
          // Otherwise search for any entry that matches the entry options. If
          // an entry is found must than match if the entry is required to be
          // active or inactive
          Ley.List.Foldable.any(
            single =>
              Ley.List.Foldable.any(isSafeSidValid(single, 0), sids)
              && isSidValid(single, 1, sid2)
              && isLevelValid(single, level),
            heroEntry.active,
          )
          === active;
        }
    );

  /**
   * Checks if the given prerequisite is met.
   */
  let isPrerequisiteMet = (staticData, hero, sourceId, prerequisite) =>
    switch (prerequisite) {
    | CommonSuggestedByRCP =>
      isCommonSuggestedByRCPValid(staticData, hero, sourceId)
    | Sex(sex) => isSexValid(hero, sex)
    | Race(race) => isRaceValid(hero, race)
    | Culture(culture) => isCultureValid(hero, culture)
    | Pact(pact) => isPactValid(hero, pact)
    | PrimaryAttribute(primary) =>
      isPrimaryAttributeValid(staticData, hero, primary)
    | Social(social) => isSocialStatusValid(hero, social)
    | Activatable(activatable) => isActivatableValid(hero, activatable)
    | ActivatableMultiEntry(activatable) =>
      isActivatableMultiEntryValid(hero, activatable)
    | ActivatableMultiSelect(activatable) =>
      isActivatableMultiSelectValid(hero, activatable)
    | Increasable(increasable) => isIncreasableValid(hero, increasable)
    | IncreasableMultiEntry(increasable) =>
      isIncreasableMultiEntryValid(hero, increasable)
    };

  /**
   * `arePrerequisitesMet` checks if all prerequisites in the passed list are
   * met.
   */
  let arePrerequisitesMet = (staticData, hero, sourceId, prerequisites) =>
    Ley.List.Foldable.all(
      isPrerequisiteMet(staticData, hero, sourceId),
      prerequisites,
    );
};

//
// /**
//  * Set the `id` property of the passed prerequisite. Note, that this will only
//  * affect `RequireActivatable` and `RequireIncreasableL` prerequisites, all
//  * others will be left unchanged.
//  */
// export const setPrerequisiteId =
//   (id: string) =>
//   (req: AllRequirementObjects) =>
//     RequireActivatable.is (req)
//     ? set (ra_id) (id) (req)
//     : RequireIncreasable.is (req)
//     ? set (ri_id) (id) (req)
//     : req
//
//
// /**
//  * Returns if the current index can be skipped because there is already a lower
//  * level which prerequisites are not met.
//  *
//  * This is for performance reasons to not check the prerequisites of higher levels.
//  */
// const skipLevelCheck =
//   (current_req: Pair<number, List<AllRequirements>>) =>
//   (mmax: Maybe<number>) =>
//     isJust (mmax) && pipe_ (current_req, fst, gt (fromJust (mmax)))
//
// /**
//  * Get maximum valid level.
//  * @param state The current hero data.
//  * @param requirements A Map of tier prereqisite arrays.
//  * @param sourceId The id of the entry the requirement objects belong to.
//  */
// export const validateLevel =
//   (wiki: StaticDataRecord) =>
//   (state: HeroModelRecord) =>
//   (requirements: OrderedMap<number, List<AllRequirements>>) =>
//   (dependencies: List<ActivatableDependency>) =>
//   (sourceId: string): Maybe<number> =>
//     pipe_ (
//       requirements,
//       toList,
//       sortBy (on (compare) (fst)),
//
//       // first check the prerequisites:
//       foldl ((max: Maybe<number>) => (entry: Pair<number, List<AllRequirements>>) =>
//
//               // if `max` is lower than the current level (from `entry`), just
//               // skip the prerequisite validation
//               !skipLevelCheck (entry) (max)
//
//               // otherwise, validate them
//               && !validatePrerequisites (wiki) (state) (snd (entry)) (sourceId)
//
//                 // if *not* valid, set the max to be lower than the actual
//                 // current level (because it must not be reached)
//                 ? Just (fst (entry) - 1)
//
//                 // otherwise, just pass the previous max value
//                 : max)
//             (Nothing),
//
//       // then, check the dependencies
//       flip (foldl ((max: Maybe<number>) => (dep: ActivatableDependency) =>
//
//                     // If `dep` prohibits higher level:
//                     // - it can only be contained in a record
//                     Record.isRecord (dep)
//
//                     // - and it must be *prohibited*, so `active` must be `false`
//                     && Maybe.elem (false) (DOA.active (dep))
//                       ? pipe_ (
//                           dep,
//
//                           // get the current prohibited level
//                           DOA.tier,
//
//                                 // - if its a Nothing, do nothing
//                           maybe (max)
//
//                                 // - otherwise decrease the level by one (the
//                                 // actual level must not be reached) and then
//                                 // take the lower one, if both the current and
//                                 // the previous are Justs, otherwise the
//                                 // current.
//                                 (pipe (dec, level => Just (maybe (level) (min (level)) (max))))
//                         )
//
//                       // otherwise, dont do anything
//                       : max))
//            (dependencies)
//     )
//
// /**
//  * Checks if all profession prerequisites are fulfilled.
//  * @param prerequisites An array of prerequisite objects.
//  */
// export const validateProfession =
//   (prerequisites: List<ProfessionDependency>) =>
//   (current_sex: Sex) =>
//   (current_race_id: string) =>
//   (current_culture_id: string): boolean =>
//     all<ProfessionDependency> (req =>
//                                 isSexRequirement (req)
//                                 ? isSexValid (current_sex) (req)
//                                 : RaceRequirement.is (req)
//                                 ? isRaceValid (current_race_id) (req)
//                                 : isCultureRequirement (req)
//                                 ? isCultureValid (current_culture_id) (req)
//                                 : false)
//                               (prerequisites)
