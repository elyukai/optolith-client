module IM = Ley_IntMap;
module O = Ley_Option;

module Dynamic = {
  open Static;
  open Ley_Function;
  open Ley_Option.Infix;

  let getEntrySpecificDynamicPrerequisites =
      (
        ~isEntryToAdd,
        staticData,
        staticEntry,
        heroEntry: option(Activatable_Dynamic.t),
        singleEntry: Activatable_Convert.singleWithId,
      )
      : list(Prerequisite.Unified.t) => {
    let sid = Activatable_SelectOptions.getOption1(singleEntry);
    let sid2 = Activatable_SelectOptions.getOption2(singleEntry);

    (
      switch (staticEntry) {
      | Activatable.Advantage(entry) =>
        [@warning "-4"]
        (
          switch (Id.Advantage.fromInt(entry.id)) {
          | Aptitude
          | ExceptionalSkill => [
              Prerequisite.Unified.Activatable({
                id: Disadvantage(Id.Disadvantage.toInt(Incompetent)),
                active: false,
                options:
                  O.catOptions([
                    sid
                    >>= Activatable_Convert.activatableOptionToSelectOptionId,
                  ]),
                level: None,
              }),
            ]
          | MagicalAttunement => [
              Activatable({
                id: Disadvantage(Id.Disadvantage.toInt(MagicalRestriction)),
                active: false,
                options:
                  O.catOptions([
                    sid
                    >>= Activatable_Convert.activatableOptionToSelectOptionId,
                  ]),
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
                id: Advantage(Id.Advantage.toInt(MagicalAttunement)),
                active: false,
                options:
                  O.catOptions([
                    sid
                    >>= Activatable_Convert.activatableOptionToSelectOptionId,
                  ]),
                level: None,
              }),
            ]
          | Incompetent => [
              Activatable({
                id: Advantage(Id.Advantage.toInt(Aptitude)),
                active: false,
                options:
                  O.catOptions([
                    sid
                    >>= Activatable_Convert.activatableOptionToSelectOptionId,
                  ]),
                level: None,
              }),
              Activatable({
                id: Advantage(Id.Advantage.toInt(ExceptionalSkill)),
                active: false,
                options:
                  O.catOptions([
                    sid
                    >>= Activatable_Convert.activatableOptionToSelectOptionId,
                  ]),
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
                (heroEntry: Activatable_Dynamic.t) =>
                  heroEntry.active
                  |> Ley_List.countBy((x: Activatable_Dynamic.single) =>
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
              | Some(Preset(Skill(id))) =>
                Some(
                  Prerequisite.Unified.Increasable({
                    id: Skill(id),
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
                  switch (option.staticEntry) {
                  | Some(Skill(skill)) => Some(skill.applications)
                  | _ => None
                  }
                )
                >>= (
                  appMp =>
                    (
                      switch (sid2) {
                      | Some(Preset(Generic(id))) =>
                        Ley_IntMap.find(
                          (app: Skill.Static.Application.t) => app.id === id,
                          appMp,
                        )
                      | _ => None
                      }
                    )
                    >>= (
                      app =>
                        app.prerequisite
                        <&> (
                          prerequisite =>
                            Prerequisite.Unified.Activatable(prerequisite)
                        )
                    )
                )
            )
            |> Ley_Option.optionToList
            |> Ley_List.append(Ley_Option.optionToList(sameSkillDependency));
          | PropertyFocus => [
              Activatable({
                id:
                  SpecialAbility(Id.SpecialAbility.toInt(PropertyKnowledge)),
                active: true,
                options:
                  O.catOptions([
                    sid
                    >>= Activatable_Convert.activatableOptionToSelectOptionId,
                  ]),
                level: None,
              }),
            ]
          | AdaptionZauber =>
            switch (sid) {
            | Some(Preset(Spell(id))) => [
                Increasable({id: Spell(id), value: 10}),
              ]
            | _ => []
            }
          | FavoriteSpellwork =>
            switch (sid) {
            | Some(Preset(Spell(id))) => [
                Increasable({id: Spell(id), value: 0}),
              ]
            | _ => []
            }
          | SpellEnhancement as id
          | ChantEnhancement as id =>
            sid
            >>= Activatable_SelectOptions.getSelectOption(staticEntry)
            >>= (
              option =>
                O.liftM2(
                  (target, level) =>
                    [
                      Prerequisite.Unified.Increasable({
                        id:
                          id === SpellEnhancement
                            ? Spell(target) : LiturgicalChant(target),
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
                id: SpecialAbility(Id.SpecialAbility.toInt(Language)),
                active: true,
                options:
                  O.catOptions([
                    sid
                    >>= Activatable_Convert.activatableOptionToSelectOptionId,
                  ]),
                level: Some(3),
              }),
            ]
          | Kraftliniennutzung =>
            staticData.magicalTraditions
            |> Ley_IntMap.foldr(
                 (x: MagicalTradition.t) =>
                   x.canLearnRituals ? Ley_List.cons(x.id) : id,
                 [],
               )
            |> Ley_Option.ensure(Ley_List.Extra.notNull)
            |> Ley_Option.option([], ids =>
                 [
                   Prerequisite.Unified.ActivatableMultiEntry({
                     id: SpecialAbilities(ids),
                     active: true,
                     options: [],
                     level: None,
                   }),
                 ]
               )
          | _ => []
          }
        )
      }
    )
    |> Ley_List.map(value =>
         Prerequisite.Config.{value, displayOption: Generate}
       );
  };

  let getSelectOptionPrerequisites = (sid, staticEntry) =>
    (
      switch (staticEntry) {
      | Activatable.Advantage(entry) => entry.selectOptions
      | Disadvantage(entry) => entry.selectOptions
      | SpecialAbility(entry) => entry.selectOptions
      }
    )
    |> SelectOption.Map.lookup(sid)
    |> Ley_Option.option(
         []: list(Prerequisite.Unified.t), (option: SelectOption.t) =>
         option.prerequisites
         |> Prerequisite.Collection.ByLevel.getFirstLevel
         |> Ley_List.map(Prerequisite.General.unify)
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

  let getRaceCultureProfession = (staticData: Static.t, hero: Hero.t) =>
    Ley_Option.Infix.(
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

  let isCommonSuggestedByRCPValid = (staticData, hero, id: Id.All.t) => {
    let (race, culture, profession) =
      getRaceCultureProfession(staticData, hero);
    [@warning "-4"]
    (
      switch (id) {
      | Advantage(id) =>
        Ley_Option.option(
          false,
          (race: Race.Static.t) =>
            Ley_List.elem(id, race.automaticAdvantages)
            || Ley_List.elem(id, race.stronglyRecommendedAdvantages)
            || Ley_List.elem(id, race.commonAdvantages),
          race,
        )
        || Ley_Option.option(
             false,
             (culture: Culture.Static.t) =>
               Ley_List.elem(id, culture.commonAdvantages),
             culture,
           )
        || Ley_Option.option(
             false,
             (profession: Profession.Static.t) =>
               Ley_List.elem(id, profession.suggestedAdvantages),
             profession,
           )
      | Disadvantage(id) =>
        Ley_Option.option(
          false,
          (race: Race.Static.t) =>
            Ley_List.elem(id, race.stronglyRecommendedDisadvantages)
            || Ley_List.elem(id, race.commonDisadvantages),
          race,
        )
        || Ley_Option.option(
             false,
             (culture: Culture.Static.t) =>
               Ley_List.elem(id, culture.commonDisadvantages),
             culture,
           )
        || Ley_Option.option(
             false,
             (profession: Profession.Static.t) =>
               Ley_List.elem(id, profession.suggestedDisadvantages),
             profession,
           )
      | _ => false
      }
    );
  };

  let isSexValid = (current: Hero.t, prerequisite: Prerequisite.Sex.t) =>
    current.sex === prerequisite;

  let isRaceValid = (current: Hero.t, prerequisite: Prerequisite.Race.t) =>
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

  let isCultureValid = (current: Hero.t, prerequisite: Prerequisite.Culture.t) =>
    switch (current.culture, prerequisite) {
    | (Some(id), One(requiredId)) => requiredId === id
    | (Some(id), Many(requiredIds)) => Ley_List.elem(id, requiredIds)
    | (None, _) => false
    };

  let hasSamePactCategory =
      (current: Pact.Dynamic.t, prerequisite: Prerequisite.Pact.t) =>
    prerequisite.category === current.category;

  let hasNeededPactType =
      (current: Pact.Dynamic.t, prerequisite: Prerequisite.Pact.t) =>
    switch (prerequisite.category) {
    // Fairies must be High Fairies to get into a pact
    | 1 => current.type_ === 3
    | _ => true
    };

  let hasNeededPactDomain =
      (current: Pact.Dynamic.t, prerequisite: Prerequisite.Pact.t) =>
    switch (prerequisite.domain, current.domain) {
    | (None, _) => true
    | (_, Custom(_)) => false
    | (Some(Many(requiredDomains)), Predefined(domain)) =>
      Ley_List.elem(domain, requiredDomains)
    | (Some(One(requiredDomain)), Predefined(domain)) =>
      domain === requiredDomain
    };

  let hasNeededPactLevel =
      (current: Pact.Dynamic.t, prerequisite: Prerequisite.Pact.t) =>
    switch (prerequisite.level) {
    | Some(requiredLevel) =>
      // Fulfills the level requirement
      requiredLevel <= current.level
      // Its a lesser Pact and the needed Pact-Level is "1"
      || requiredLevel <= 1
      && current.level === 0
    | None => true
    };

  let isPactValid = (current: Hero.t, prerequisite: Prerequisite.Pact.t) =>
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
      (
        staticData,
        heroSpecialAbilities,
        scope: Prerequisite.PrimaryAttribute.primaryAttributeType,
      ) =>
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
      (
        staticData,
        current: Hero.t,
        prerequisite: Prerequisite.PrimaryAttribute.t,
      ) =>
    Ley_Option.Infix.(
      getPrimaryAttributeId(
        staticData,
        current.specialAbilities,
        prerequisite.scope,
      )
      >>= flip(Ley_IntMap.lookup, current.attributes)
      |> (
        attr =>
          Ley_Option.option(
            8,
            (attr: Attribute.Dynamic.t) => attr.value,
            attr,
          )
          >= prerequisite.value
      )
    );

  let isSocialStatusValid =
      (current: Hero.t, prerequisite: Prerequisite.SocialStatus.t) =>
    switch (current.personalData.socialStatus) {
    | Some(socialStatus) => socialStatus >= prerequisite
    | None => false
    };

  let hasIncreasableMinValue =
      (current: Hero.t, {id, value: minValue}: Prerequisite.Increasable.t) =>
    switch (id) {
    | Attribute(id) =>
      current.attributes
      |> Ley_IntMap.lookup(id)
      |> Ley_Option.option(false, (x: Attribute.Dynamic.t) =>
           x.value >= minValue
         )
    | Skill(id) =>
      current.skills
      |> Ley_IntMap.lookup(id)
      |> Ley_Option.option(false, (x: Skill.Dynamic.t) => x.value >= minValue)
    | CombatTechnique(id) =>
      current.combatTechniques
      |> Ley_IntMap.lookup(id)
      |> Ley_Option.option(false, (x: CombatTechnique.Dynamic.t) =>
           x.value >= minValue
         )
    | Spell(id) =>
      current.spells
      |> Ley_IntMap.lookup(id)
      |> Ley_Option.option(false, (x: ActivatableSkill.Dynamic.t) =>
           switch (x.value) {
           | Active(value) => value >= minValue
           | Inactive => false
           }
         )
    | LiturgicalChant(id) =>
      current.liturgicalChants
      |> Ley_IntMap.lookup(id)
      |> Ley_Option.option(false, (x: ActivatableSkill.Dynamic.t) =>
           switch (x.value) {
           | Active(value) => value >= minValue
           | Inactive => false
           }
         )
    };

  let isIncreasableValid =
      (current: Hero.t, prerequisite: Prerequisite.Increasable.t) =>
    hasIncreasableMinValue(current, prerequisite);

  let isIncreasableMultiEntryValid =
      (
        current: Hero.t,
        {id: ids, value}: Prerequisite.IncreasableMultiEntry.t,
      ) =>
    Id.Increasable.(
      Ley_List.any(
        id => hasIncreasableMinValue(current, {id, value}),
        switch (ids) {
        | Attributes(ids) => Ley_List.map(id => Attribute(id), ids)
        | Skills(ids) => Ley_List.map(id => Skill(id), ids)
        | CombatTechniques(ids) =>
          Ley_List.map(id => CombatTechnique(id), ids)
        | Spells(ids) => Ley_List.map(id => Spell(id), ids)
        | LiturgicalChants(ids) =>
          Ley_List.map(id => LiturgicalChant(id), ids)
        },
      )
    );

  let isSidValid = (single: Id.Activatable.Option.t, sid) =>
    single
    |> Activatable_Convert.activatableOptionToSelectOptionId
    |> Ley_Option.option(false, (===)(sid));

  let isLevelValid = (single: Activatable_Dynamic.single, level) =>
    switch (level) {
    | None => true
    | Some(level) => Ley_Option.option(false, (===)(level), single.level)
    };

  let isSingleActivatableValid =
      (
        current: Hero.t,
        {id, active, options, level}: Prerequisite.Activatable.t,
      ) =>
    (
      switch (id) {
      | Advantage(id) => current.advantages |> Ley_IntMap.lookup(id)
      | Disadvantage(id) => current.disadvantages |> Ley_IntMap.lookup(id)
      | SpecialAbility(id) =>
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
          Ley_List.any(
            (single: Activatable_Dynamic.single) =>
              Ley_List.zip(single.options, options)
              |> Ley_List.all(((option, sid)) => isSidValid(option, sid))
              && isLevelValid(single, level),
            heroEntry.active,
          )
          === active;
        }
    );

  let isActivatableValid =
      (current: Hero.t, prerequisite: Prerequisite.Activatable.t) =>
    isSingleActivatableValid(current, prerequisite);

  let isActivatableMultiEntryValid =
      (
        current: Hero.t,
        {id: ids, active, options, level}: Prerequisite.ActivatableMultiEntry.t,
      ) =>
    Ley_List.any(
      id => isSingleActivatableValid(current, {id, active, options, level}),
      Id.Activatable.(
        switch (ids) {
        | Advantages(ids) => Ley_List.map(id => Advantage(id), ids)
        | Disadvantages(ids) => Ley_List.map(id => Disadvantage(id), ids)
        | SpecialAbilities(ids) =>
          Ley_List.map(id => SpecialAbility(id), ids)
        }
      ),
    );

  let isActivatableMultiSelectValid =
      (
        current: Hero.t,
        {id, active, firstOption, otherOptions, level}: Prerequisite.ActivatableMultiSelect.t,
      ) =>
    (
      switch (id) {
      | Advantage(id) => current.advantages |> Ley_IntMap.lookup(id)
      | Disadvantage(id) => current.disadvantages |> Ley_IntMap.lookup(id)
      | SpecialAbility(id) =>
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
          Ley_List.any(
            (single: Activatable_Dynamic.single) =>
              (
                switch (Ley_List.uncons(single.options)) {
                | None => false
                | Some((x, xs)) =>
                  Ley_List.any(option => isSidValid(x, option), firstOption)
                  && Ley_List.zip(xs, otherOptions)
                  |> Ley_List.all(((option, sid)) =>
                       isSidValid(option, sid)
                     )
                }
              )
              && isLevelValid(single, level),
            heroEntry.active,
          )
          === active;
        }
    );

  /**
   * Checks if the given prerequisite is met.
   */
  let isPrerequisiteMet =
      (staticData, hero, sourceId, prerequisite: Prerequisite.Unified.t) =>
    switch (prerequisite.value) {
    | CommonSuggestedByRCP =>
      isCommonSuggestedByRCPValid(staticData, hero, sourceId)
    | Sex(sex) => isSexValid(hero, sex)
    | Race(race) => isRaceValid(hero, race)
    | Culture(culture) => isCultureValid(hero, culture)
    | Pact(pact) => isPactValid(hero, pact)
    | PrimaryAttribute(primary) =>
      isPrimaryAttributeValid(staticData, hero, primary)
    | SocialStatus(social) => isSocialStatusValid(hero, social)
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
    Ley_List.all(
      isPrerequisiteMet(staticData, hero, sourceId),
      prerequisites,
    );

  let getMaxLevel = (staticData, hero, sourceId, prerequisites) =>
    IM.foldlWithKey(
      (max, level, prerequisites) =>
        switch (max) {
        | Some(max) when max <= level => Some(max)
        | max =>
          prerequisites |> arePrerequisitesMet(staticData, hero, sourceId)
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
    | Activatable.Advantage(staticAdvantage) =>
      Prerequisite.Collection.ByLevel.getFirstLevel(
        staticAdvantage.prerequisites,
      )
      |> Ley_List.map(Prerequisite.AdvantageDisadvantage.unify)
    | Disadvantage(staticDisadvantage) =>
      Prerequisite.Collection.ByLevel.getFirstLevel(
        staticDisadvantage.prerequisites,
      )
      |> Ley_List.map(Prerequisite.AdvantageDisadvantage.unify)
    | SpecialAbility(staticSpecialAbility) =>
      Prerequisite.Collection.ByLevel.getFirstLevel(
        staticSpecialAbility.prerequisites,
      )
      |> Ley_List.map(Prerequisite.General.unify);

  let getLevelPrerequisites =
    fun
    | Activatable.Advantage(staticAdvantage) =>
      switch (staticAdvantage.prerequisites) {
      | Plain(_) => Ley_IntMap.empty
      | ByLevel(mp) =>
        mp
        |> Ley_IntMap.filterWithKey((k, _) => k > 1)
        |> Ley_IntMap.map(
             Ley_List.map(Prerequisite.AdvantageDisadvantage.unify),
           )
      }
    | Disadvantage(staticDisadvantage) =>
      switch (staticDisadvantage.prerequisites) {
      | Plain(_) => Ley_IntMap.empty
      | ByLevel(mp) =>
        mp
        |> Ley_IntMap.filterWithKey((k, _) => k > 1)
        |> Ley_IntMap.map(
             Ley_List.map(Prerequisite.AdvantageDisadvantage.unify),
           )
      }
    | SpecialAbility(staticSpecialAbility) =>
      switch (staticSpecialAbility.prerequisites) {
      | Plain(_) => Ley_IntMap.empty
      | ByLevel(mp) =>
        mp
        |> Ley_IntMap.filterWithKey((k, _) => k > 1)
        |> Ley_IntMap.map(Ley_List.map(Prerequisite.General.unify))
      };
};
