open Prerequisite;

module IM = Ley_IntMap;
module O = Ley_Option;

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
  open Ley_Function;

  let applicablePred = (oldLevel, newLevel) =>
    switch (oldLevel, newLevel) {
    // Used for changing level
    | (Some(oldLevel), Some(newLevel)) =>
      let (min, max) = Ley_Int.minmax(oldLevel, newLevel);
      Ley_Ix.inRange((min + 1, max));
    // Used for deactivating an entry
    | (Some(level), None)
    // Used for activating an entry
    | (None, Some(level)) => (>=)(level)
    | (None, None) => const(true)
    };

  let filterApplicableLevels = (oldLevel, newLevel, mp) => {
    let pred = applicablePred(oldLevel, newLevel);
    Ley_IntMap.filterWithKey((k, _) => pred(k), mp);
  };

  let flattenPrerequisites = (p: t, xs) =>
    xs
    |> Ley_Option.option(id, x => Sex(x) |> Ley_List.cons, p.sex)
    |> Ley_Option.option(id, x => Race(x) |> Ley_List.cons, p.race)
    |> Ley_Option.option(id, x => Culture(x) |> Ley_List.cons, p.culture)
    |> Ley_Option.option(id, x => Pact(x) |> Ley_List.cons, p.pact)
    |> Ley_Option.option(
         id,
         x => PrimaryAttribute(x) |> Ley_List.cons,
         p.primaryAttribute,
       )
    |> (
      xs =>
        p.activatable
        |> Ley_List.Foldable.foldr(x => Activatable(x) |> Ley_List.cons, xs)
    )
    |> (
      xs =>
        p.activatableMultiEntry
        |> Ley_List.Foldable.foldr(
             x => ActivatableMultiEntry(x) |> Ley_List.cons,
             xs,
           )
    )
    |> (
      xs =>
        p.activatableMultiSelect
        |> Ley_List.Foldable.foldr(
             x => ActivatableMultiSelect(x) |> Ley_List.cons,
             xs,
           )
    )
    |> (
      xs =>
        p.increasable
        |> Ley_List.Foldable.foldr(x => Increasable(x) |> Ley_List.cons, xs)
    )
    |> (
      xs =>
        p.increasableMultiEntry
        |> Ley_List.Foldable.foldr(
             x => IncreasableMultiEntry(x) |> Ley_List.cons,
             xs,
           )
    );

  let getFirstLevelPrerequisites = (prerequisites: tWithLevel) =>
    flattenPrerequisites(
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
    flattenPrerequisites(
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
    |> (p.commonSuggestedByRCP ? Ley_List.cons(CommonSuggestedByRCP) : id);

  let flattenPrerequisitesRange =
      (oldLevel, newLevel, prerequisites: tWithLevel) =>
    if (Ley_IntMap.null(prerequisites.levels)) {
      getFirstLevelPrerequisites(prerequisites);
    } else {
      filterApplicableLevels(oldLevel, newLevel, prerequisites.levels)
      |> Ley_IntMap.Foldable.foldr(
           flattenPrerequisites,
           getFirstLevelPrerequisites(prerequisites),
         );
    };
};

module Dynamic = {
  open Static;
  open Ley_Function;
  open Ley_Option.Monad;

  let getEntrySpecificDynamicPrerequisites =
      (
        ~isEntryToAdd,
        staticData,
        staticEntry,
        heroEntry: option(Hero.Activatable.t),
        singleEntry: Activatable_Convert.singleWithId,
      ) => {
    let sid = Activatable_SelectOptions.getOption1(singleEntry);
    let sid2 = Activatable_SelectOptions.getOption2(singleEntry);

    switch (staticEntry) {
    | Advantage(entry) =>
      [@warning "-4"]
      (
        switch (Id.Advantage.fromInt(entry.id)) {
        | Aptitude
        | ExceptionalSkill => [
            Activatable({
              id: `Disadvantage(Id.Disadvantage.toInt(Incompetent)),
              active: false,
              sid:
                sid >>= Activatable_Convert.activatableOptionToSelectOptionId,
              sid2: None,
              level: None,
            }),
          ]
        | MagicalAttunement => [
            Activatable({
              id: `Disadvantage(Id.Disadvantage.toInt(MagicalRestriction)),
              active: false,
              sid:
                sid >>= Activatable_Convert.activatableOptionToSelectOptionId,
              sid2: None,
              level: None,
            }),
          ]
        | _ => []
        }
      )
    | Disadvantage(entry) =>
      [@warning "-4"]
      (
        switch (Id.Disadvantage.fromInt(entry.id)) {
        | MagicalRestriction => [
            Activatable({
              id: `Advantage(Id.Advantage.toInt(MagicalAttunement)),
              active: false,
              sid:
                sid >>= Activatable_Convert.activatableOptionToSelectOptionId,
              sid2: None,
              level: None,
            }),
          ]
        | Incompetent => [
            Activatable({
              id: `Advantage(Id.Advantage.toInt(Aptitude)),
              active: false,
              sid:
                sid >>= Activatable_Convert.activatableOptionToSelectOptionId,
              sid2: None,
              level: None,
            }),
            Activatable({
              id: `Advantage(Id.Advantage.toInt(ExceptionalSkill)),
              active: false,
              sid:
                sid >>= Activatable_Convert.activatableOptionToSelectOptionId,
              sid2: None,
              level: None,
            }),
          ]
        | _ => []
        }
      )
    | SpecialAbility(entry) =>
      [@warning "-4"]
      (
        switch (Id.SpecialAbility.fromInt(entry.id)) {
        | SkillSpecialization =>
          let sameSkillActiveCount =
            Ley_Option.option(
              0,
              (heroEntry: Hero.Activatable.t) =>
                heroEntry.active
                |> Ley_List.countBy((x: Hero.Activatable.single) =>
                     switch (sid, O.listToOption(x.options)) {
                     | (None, _)
                     | (_, None) => false
                     | (Some(sid), Some(option)) =>
                       Id.Activatable.Option.(sid == option)
                     }
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
          >>= Activatable_SelectOptions.getSelectOption(staticEntry)
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
                      Ley_IntMap.Foldable.find(
                        (app: Skill.application) => app.id === id,
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
          |> Ley_Option.optionToList
          |> Ley_List.append(Ley_Option.optionToList(sameSkillDependency));
        | PropertyFocus => [
            Activatable({
              id:
                `SpecialAbility(Id.SpecialAbility.toInt(PropertyKnowledge)),
              active: true,
              sid:
                sid >>= Activatable_Convert.activatableOptionToSelectOptionId,
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
          >>= Activatable_SelectOptions.getSelectOption(staticEntry)
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
          |> Ley_Option.fromOption([])
        | LanguageSpecializations => [
            Activatable({
              id: `SpecialAbility(Id.SpecialAbility.toInt(Language)),
              active: true,
              sid:
                sid >>= Activatable_Convert.activatableOptionToSelectOptionId,
              sid2: None,
              level: Some(3),
            }),
          ]
        | Kraftliniennutzung =>
          staticData.magicalTraditions
          |> Ley_IntMap.Foldable.foldr(
               (x: MagicalTradition.t) =>
                 x.canLearnRituals ? Ley_List.cons(x.id) : id,
               [],
             )
          |> Ley_Option.ensure(Ley_List.Extra.notNull)
          |> Ley_Option.option([], ids =>
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
      )
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
    |> SelectOption.SelectOptionMap.lookup(sid)
    |> Ley_Option.option([], (option: SelectOption.t) =>
         Flatten.flattenPrerequisites(option.prerequisites, [])
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
        singleEntry: Activatable_Convert.singleWithId,
      ) => {
    let sid = Activatable_SelectOptions.getOption1(singleEntry);

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
      >>= Activatable_Convert.activatableOptionToSelectOptionId
      |> Ley_Option.option([], sid =>
           getSelectOptionPrerequisites(sid, staticEntry)
         );

    selectOptionSpecifics @ entrySpecifics;
  };
};

module Validation = {
  open Ley_Function;
  open Ley_Option.Monad;

  let getRaceCultureProfession = (staticData: Static.t, hero: Hero.t) => (
    (
      switch (hero.race) {
      | Some(Base(id) | WithVariant(id, _)) => Some(id)
      | None => None
      }
    )
    >>= flip(Ley_IntMap.lookup, staticData.races),
    (
      switch (hero.culture) {
      | Some(id) => Some(id)
      | None => None
      }
    )
    >>= flip(Ley_IntMap.lookup, staticData.cultures),
    (
      switch (hero.profession) {
      | Some(Base(id) | WithVariant(id, _)) => Some(id)
      | None => None
      }
    )
    >>= flip(Ley_IntMap.lookup, staticData.professions),
  );

  let isCommonSuggestedByRCPValid = (staticData, hero, id: Id.t) => {
    let (race, culture, profession) =
      getRaceCultureProfession(staticData, hero);
    switch (id) {
    | `Advantage(id) =>
      Ley_Option.option(
        false,
        (race: Race.t) =>
          Ley_List.elem(id, race.automaticAdvantages)
          || Ley_List.elem(id, race.stronglyRecommendedAdvantages)
          || Ley_List.elem(id, race.commonAdvantages),
        race,
      )
      || Ley_Option.option(
           false,
           (culture: Culture.t) =>
             Ley_List.elem(id, culture.commonAdvantages),
           culture,
         )
      || Ley_Option.option(
           false,
           (profession: Profession.t) =>
             Ley_List.elem(id, profession.suggestedAdvantages),
           profession,
         )
    | `Disadvantage(id) =>
      Ley_Option.option(
        false,
        (race: Race.t) =>
          Ley_List.elem(id, race.stronglyRecommendedDisadvantages)
          || Ley_List.elem(id, race.commonDisadvantages),
        race,
      )
      || Ley_Option.option(
           false,
           (culture: Culture.t) =>
             Ley_List.elem(id, culture.commonDisadvantages),
           culture,
         )
      || Ley_Option.option(
           false,
           (profession: Profession.t) =>
             Ley_List.elem(id, profession.suggestedDisadvantages),
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
      Ley_List.elem(id, requiredIds) === active
    | (None, _) => false
    };

  let isCultureValid = (current: Hero.t, prerequisite: culture) =>
    switch (current.culture, prerequisite) {
    | (Some(id), One(requiredId)) => requiredId === id
    | (Some(id), Many(requiredIds)) => Ley_List.elem(id, requiredIds)
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
      Ley_List.elem(domain, requiredDomains)
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
      Pacts.isPactFromStateValid(pact)
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
      Tradition.Magical.getPrimaryAttributeId(
        staticData,
        heroSpecialAbilities,
      )
    | Blessed =>
      Tradition.Blessed.getPrimaryAttributeId(
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
    >>= flip(Ley_IntMap.lookup, current.attributes)
    |> (
      attr =>
        Ley_Option.option(8, (attr: Hero.Attribute.t) => attr.value, attr)
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
      |> Ley_IntMap.lookup(id)
      |> Ley_Option.option(false, (x: Hero.Attribute.t) =>
           x.value >= minValue
         )
    | `Skill(id) =>
      current.skills
      |> Ley_IntMap.lookup(id)
      |> Ley_Option.option(false, (x: Hero.Skill.t) => x.value >= minValue)
    | `CombatTechnique(id) =>
      current.combatTechniques
      |> Ley_IntMap.lookup(id)
      |> Ley_Option.option(false, (x: Hero.Skill.t) => x.value >= minValue)
    | `Spell(id) =>
      current.spells
      |> Ley_IntMap.lookup(id)
      |> Ley_Option.option(false, (x: Hero.ActivatableSkill.t) =>
           switch (x.value) {
           | Active(value) => value >= minValue
           | Inactive => false
           }
         )
    | `LiturgicalChant(id) =>
      current.liturgicalChants
      |> Ley_IntMap.lookup(id)
      |> Ley_Option.option(false, (x: Hero.ActivatableSkill.t) =>
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
    Ley_List.Foldable.any(
      id => hasIncreasableMinValue(current, {id, value}),
      switch (ids) {
      | Attributes(ids) => Ley_List.map(id => `Attribute(id), ids)
      | Skills(ids) => Ley_List.map(id => `Skill(id), ids)
      | CombatTechniques(ids) =>
        Ley_List.map(id => `CombatTechnique(id), ids)
      | Spells(ids) => Ley_List.map(id => `Spell(id), ids)
      | LiturgicalChants(ids) =>
        Ley_List.map(id => `LiturgicalChant(id), ids)
      },
    );

  let isSafeSidValid = (single: Hero.Activatable.single, index, sid) =>
    Ley_List.Safe.atMay(single.options, index)
    >>= Activatable_Convert.activatableOptionToSelectOptionId
    |> Ley_Option.option(false, (===)(sid));

  let isSidValid = (single: Hero.Activatable.single, index, sid) =>
    switch (sid) {
    | None => true
    | Some(sid) => isSafeSidValid(single, index, sid)
    };

  let isLevelValid = (single: Hero.Activatable.single, level) =>
    switch (level) {
    | None => true
    | Some(level) => Ley_Option.option(false, (===)(level), single.level)
    };

  let isSingleActivatableValid =
      (current: Hero.t, {id, active, sid, sid2, level}: activatable) =>
    (
      switch (id) {
      | `Advantage(id) => current.advantages |> Ley_IntMap.lookup(id)
      | `Disadvantage(id) => current.disadvantages |> Ley_IntMap.lookup(id)
      | `SpecialAbility(id) =>
        current.specialAbilities |> Ley_IntMap.lookup(id)
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
          Ley_List.Foldable.any(
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
    Ley_List.Foldable.any(
      id =>
        isSingleActivatableValid(current, {id, active, sid, sid2, level}),
      switch (ids) {
      | Advantages(ids) => Ley_List.map(id => `Advantage(id), ids)
      | Disadvantages(ids) => Ley_List.map(id => `Disadvantage(id), ids)
      | SpecialAbilities(ids) => Ley_List.map(id => `SpecialAbility(id), ids)
      },
    );

  let isActivatableMultiSelectValid =
      (
        current: Hero.t,
        {id, active, sid: sids, sid2, level}: activatableMultiSelect,
      ) =>
    (
      switch (id) {
      | `Advantage(id) => current.advantages |> Ley_IntMap.lookup(id)
      | `Disadvantage(id) => current.disadvantages |> Ley_IntMap.lookup(id)
      | `SpecialAbility(id) =>
        current.specialAbilities |> Ley_IntMap.lookup(id)
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
          Ley_List.Foldable.any(
            single =>
              Ley_List.Foldable.any(isSafeSidValid(single, 0), sids)
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
    Ley_List.Foldable.all(
      isPrerequisiteMet(staticData, hero, sourceId),
      prerequisites,
    );

  let getMaxLevel = (staticData, hero, sourceId, prerequisites) =>
    IM.foldlWithKey(
      (max, level, prerequisites) =>
        switch (max) {
        | Some(max) when max <= level => Some(max)
        | max =>
          Flatten.flattenPrerequisites(prerequisites, [])
          |> arePrerequisitesMet(staticData, hero, sourceId)
            ? max : Some(level)
        },
      None,
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
//     RequireActivatable_is (req)
//     ? set (ra_id) (id) (req)
//     : RequireIncreasable.is (req)
//     ? set (ri_id) (id) (req)
//     : req
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

module Activatable = {
  let getFlatFirstPrerequisites =
    fun
    | Static.Advantage(staticAdvantage) =>
      Flatten.getFirstDisAdvLevelPrerequisites(staticAdvantage.prerequisites)
    | Disadvantage(staticDisadvantage) =>
      Flatten.getFirstDisAdvLevelPrerequisites(
        staticDisadvantage.prerequisites,
      )
    | SpecialAbility(staticSpecialAbility) =>
      Flatten.getFirstLevelPrerequisites(staticSpecialAbility.prerequisites);

  let getLevelPrerequisites =
    fun
    | Static.Advantage(staticAdvantage) =>
      staticAdvantage.prerequisites.levels
    | Disadvantage(staticDisadvantage) =>
      staticDisadvantage.prerequisites.levels
    | SpecialAbility(staticSpecialAbility) =>
      staticSpecialAbility.prerequisites.levels;
};
