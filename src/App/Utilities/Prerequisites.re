open Static_Prerequisites;

type prerequisite =
  | CommonSuggestedByRCP(bool)
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
    |> Ley.List.cons(CommonSuggestedByRCP(p.commonSuggestedByRCP));

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
               x.canLearnRituals ? Ley.List.cons(`SpecialAbility(x.id)) : id,
             [],
           )
        |> Ley.Option.ensure(Ley.List.Extra.notNull)
        |> Ley.Option.option([], ids =>
             [
               ActivatableMultiEntry({
                 id: ids,
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
// type Validator = (wiki: StaticDataRecord) =>
//                  (state: HeroModelRecord) =>
//                  (req: AllRequirements) =>
//                  (sourceId: string) => boolean
//
// const SDA = StaticData.A
// const HA = HeroModel.A
// const PDA = PersonalData.A
// const SA = Spell.A
//
// const RIA = RequireIncreasable.A
// const RAA = RequireActivatable.A
// const DOA = DependencyObject.A
// const SDAL = SkillDependent.AL
//
// const getAllRaceEntries =
//   (wiki: StaticDataRecord) =>
//     pipe (
//       HA.race,
//       bindF (lookupF (SDA.races (wiki))),
//       fmap (
//         selectedRace => concat (
//           List (
//             Race.A.stronglyRecommendedAdvantages (selectedRace),
//             Race.A.automaticAdvantages (selectedRace),
//             Race.A.stronglyRecommendedAdvantages (selectedRace),
//             Race.A.stronglyRecommendedDisadvantages (selectedRace),
//             Race.A.commonAdvantages (selectedRace),
//             Race.A.commonDisadvantages (selectedRace)
//           )
//         )
//       )
//     )
//
// const getAllCultureEntries =
//   (wiki: StaticDataRecord) =>
//     pipe (
//       HA.culture,
//       bindF (lookupF (SDA.cultures (wiki))),
//       fmap (
//         selectedCulture => concat (
//           List (
//             Culture.A.commonAdvantages (selectedCulture),
//             Culture.A.commonDisadvantages (selectedCulture)
//           )
//         )
//       )
//     )
//
// const getAllProfessionEntries =
//   (wiki: StaticDataRecord) =>
//     pipe (
//       HA.profession,
//       bindF (lookupF (SDA.professions (wiki))),
//       fmap (
//         selectedProfession => concat (
//           List (
//             Profession.A.suggestedAdvantages (selectedProfession),
//             Profession.A.suggestedDisadvantages (selectedProfession)
//           )
//         )
//       )
//     )
//
// const isRCPValid =
//   (wiki: StaticDataRecord) =>
//   (state: HeroModelRecord) =>
//   (sourceId: string): boolean =>
//     any (elem (sourceId))
//         (catMaybes (
//           List (
//             getAllRaceEntries (wiki) (state),
//             getAllCultureEntries (wiki) (state),
//             getAllProfessionEntries (wiki) (state)
//           )
//         ))
//
// const isSexValid =
//   (currentSex: "m" | "f") => (req: Record<SexRequirement>): boolean =>
//     equals (currentSex) (SexRequirement.AL.value (req))
//
// const isRaceValid =
//   (current_race_id: string) =>
//   (req: Record<RaceRequirement>): boolean => {
//     const value = RaceRequirement.A.value (req)
//     const active = RaceRequirement.A.active (req)
//
//     if (isList (value)) {
//       return any (equals (current_race_id))
//                  (value) === active
//     }
//
//     return value === current_race_id === active
//   }
//
// const isCultureValid =
//   (current_culture_id: string) =>
//   (req: Record<CultureRequirement>): boolean => {
//     const value = CultureRequirement.AL.value (req)
//
//     if (isList (value)) {
//       return any (equals (current_culture_id))
//                  (value)
//     }
//
//     return value === current_culture_id
//   }
//
// const hasSamePactCategory =
//   (state: Record<Pact>) =>
//     pipe (
//       PactRequirement.AL.category,
//       equals (Pact.AL.category (state))
//     )
//
// const hasNeededPactType =
//   (state: Record<Pact>) => (req: Record<PactRequirement>) => {
//     switch (PactRequirement.AL.category (req)) {
//       case 1:
//         return equals (Pact.AL.type (state)) (3)
//       default:
//         return true
//     }
//   }
//
// const hasNeededPactDomain =
//   (state: Record<Pact>) => (req: Record<PactRequirement>) => {
//     const maybeReqDomain = PactRequirement.AL.domain (req)
//     const stateDomain = Pact.AL.domain (state)
//
//     if (isNothing (maybeReqDomain)) {
//       return true
//     }
//
//     if (typeof stateDomain === "string") {
//       return false
//     }
//
//     const reqDomain = fromJust (maybeReqDomain)
//
//     if (isList (reqDomain)) {
//       return elem (stateDomain) (reqDomain)
//     }
//
//     return reqDomain === stateDomain
//   }
//
// const hasNeededPactLevel = (state: Record<Pact>) => (req: Record<PactRequirement>) =>
//
//   // Fulfills the level requirement
//   or (fmap (lte (Pact.A.level (state))) (PactRequirement.A.level (req)))
//
//   // Its a lesser Pact and the needed Pact-Level is "1"
//   || (
//     or (fmap (lte (1)) (PactRequirement.A.level (req)))
//     && (Pact.A.level (state) === 0)
//   )
//
// const isPactValid =
//   (maybePact: Maybe<Record<Pact>>) => (req: Record<PactRequirement>): boolean =>
//     or (fmap<Record<Pact>, boolean> (currentPact => isPactFromStateValid (currentPact)
//                                            && hasSamePactCategory (currentPact) (req)
//                                            && hasNeededPactType (currentPact) (req)
//                                            && hasNeededPactDomain (currentPact) (req)
//                                            && hasNeededPactLevel (currentPact) (req))
//                                          (maybePact))
//
// const isPrimaryAttributeValid =
//   (state: HeroModelRecord) => (req: Record<RequirePrimaryAttribute>): boolean =>
//     or (fmap (pipe (
//                lookupF (HA.attributes (state)),
//                fmap (AttributeDependent.AL.value),
//                fromMaybe (8),
//                gte (RequirePrimaryAttribute.AL.value (req))
//              ))
//              (getPrimaryAttributeId (HA.specialAbilities (state))
//                                     (RequirePrimaryAttribute.AL.type (req))))
//
// const isSocialPrerequisiteValid: (hero: Record<Hero>) =>
//                                  (req: Record<SocialPrerequisite>) => boolean =
//   hero =>
//     pipe (
//       SocialPrerequisite.A.value,
//       lte (pipe_ (hero, HA.personalData, PDA.socialStatus, Maybe.sum))
//     )
//
// const isIncreasableValid =
//   (wiki: StaticDataRecord) =>
//   (state: HeroModelRecord) =>
//   (sourceId: string) =>
//   (req: Record<RequireIncreasable>) =>
//   (objectValidator: Validator): boolean => {
//     const id = RequireIncreasable.AL.id (req)
//
//     if (isList (id)) {
//       return any (pipe (
//                    set (RequireIncreasableL.id),
//                    thrush (req),
//                    objectValidator (wiki) (state),
//                    thrush (sourceId)
//                  ))
//                  (id)
//     }
//
//     return or (fmap ((obj: Dependent) =>
//                       !ActivatableDependent.is (obj) && SDAL.value (obj) >= RIA.value (req))
//                     (getHeroStateItem (state) (id)))
//   }
//
// /**
//  * Check if one of the passed selection ids is part of the currently active
//  * selections and if that matches the requirement (`active`).
//  */
// const isOneOfListActiveSelection =
//   (activeSelections: Maybe<List<string | number>>) =>
//   (req: Record<RequireActivatable>) =>
//   (sid: List<number>): boolean =>
//     Maybe.elem (RAA.active (req))
//                (fmap<List<string | number>, boolean> (pipe (List.elemF, any, thrush (sid)))
//                                                      (activeSelections))
//
// /**
//  * Check if the passed selection id is part of the currently active selections
//  * and if that matches the requirement (`active`).
//  */
// const isSingleActiveSelection =
//   (activeSelections: Maybe<List<string | number>>) =>
//   (req: Record<RequireActivatable>) =>
//   (sid: string | number): boolean =>
//     Maybe.elem (RAA.active (req))
//                (fmap (elem (sid)) (activeSelections))
//
// const isActiveSelection =
//   (activeSelections: Maybe<List<string | number>>) =>
//   (req: Record<RequireActivatable>) =>
//   (sid: SID): boolean =>
//     isList (sid)
//       ? isOneOfListActiveSelection (activeSelections) (req) (sid)
//       : isSingleActiveSelection (activeSelections) (req) (sid)
//
// /**
//  * Checks if the passed required level is fulfilled by the passed instance.
//  */
// const isNeededLevelGiven =
//   (level: number) =>
//     pipe (
//       ActivatableDependent.AL.active,
//       any (pipe (ActiveObject.AL.tier, fmap (gte (level)), or))
//     )
//
// const isActivatableValid =
//   (wiki: StaticDataRecord) =>
//   (state: HeroModelRecord) =>
//   (sourceId: string) =>
//   (req: Record<RequireActivatable>) =>
//   (objectValidator: Validator): boolean => {
//     const id = RAA.id (req)
//
//     if (isList (id)) {
//       return any (pipe (
//                    set (RequireActivatableL.id),
//                    thrush (req),
//                    objectValidator (wiki) (state),
//                    thrush (sourceId)
//                  ))
//                  (id)
//     }
//     else {
//       const sid = RAA.sid (req)
//
//       if (Maybe.elem<SID> ("sel") (sid)) {
//         return true
//       }
//
//       if (Maybe.elem<SID> ("GR") (sid)) {
//         return and (pipe (
//                            bindF<Dependent, Record<ActivatableDependent>>
//                              (ensure (isActivatableDependent)),
//                            bindF<Record<ActivatableDependent>, boolean>
//                              (target => {
//                                const arr =
//                                  map (Skill.AL.id)
//                                      (getAllWikiEntriesByGroup
//                                        (SDA.skills (wiki))
//                                        (maybeToList (
//                                          RAA.sid2 (req) as Maybe<number>
//                                        )))
//
//                                return fmap (all (pipe (elemF<string | number> (arr), not)))
//                                            (getActiveSelectionsMaybe (Just (target)))
//                              })
//                          )
//                          (getHeroStateItem (state) (id)))
//       }
//
//       const mhero_entry = bind (getHeroStateItem (state) (id))
//                                (ensure (isExtendedActivatableDependent))
//
//       if (Maybe.any (ActivatableDependent.is) (mhero_entry)) {
//         const hero_entry = fromJust (mhero_entry)
//         const activeSelections = getActiveSelectionsMaybe (mhero_entry)
//
//         const maybeSid = RAA.sid (req)
//         const maybeLevel = RAA.tier (req)
//
//         const sidValid = fmap (isActiveSelection (activeSelections) (req)) (maybeSid)
//         const levelValid = fmap (flip (isNeededLevelGiven) (hero_entry)) (maybeLevel)
//
//         if (isJust (maybeSid) || isJust (maybeLevel)) {
//           return and (sidValid) && and (levelValid)
//         }
//
//         return isActive (hero_entry) === RAA.active (req)
//       }
//
//       if (Maybe.any (ActivatableSkillDependent.is) (mhero_entry)) {
//         return ActivatableSkillDependent.AL.active (fromJust (mhero_entry))
//           === RAA.active (req)
//       }
//
//       return !RAA.active (req)
//     }
//   }
//
// /**
//  * Checks if the requirement is fulfilled.
//  * @param state The current hero data.
//  * @param req A requirement object.
//  * @param sourceId The id of the entry the requirement object belongs to.
//  * @param pact A valid `Pact` object or `undefined`.
//  */
// export const validateObject =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (req: AllRequirements) =>
//   (sourceId: string): boolean =>
//     req === "RCP"
//       ? isRCPValid (wiki) (hero) (sourceId)
//       : SexRequirement.is (req)
//       ? isSexValid (HA.sex (hero)) (req)
//       : RaceRequirement.is (req)
//       ? or (fmapF (HA.race (hero)) (flip (isRaceValid) (req)))
//       : CultureRequirement.is (req)
//       ? or (fmapF (HA.culture (hero)) (flip (isCultureValid) (req)))
//       : PactRequirement.is (req)
//       ? isPactValid (HA.pact (hero)) (req)
//       : RequirePrimaryAttribute.is (req)
//       ? isPrimaryAttributeValid (hero) (req)
//       : SocialPrerequisite.is (req)
//       ? isSocialPrerequisiteValid (hero) (req)
//       : RequireIncreasable.is (req)
//       ? isIncreasableValid (wiki) (hero) (sourceId) (req) (validateObject)
//       : isActivatableValid (wiki) (hero) (sourceId) (req) (validateObject)
//
// /**
//  * Checks if all requirements are fulfilled.
//  * @param state The current hero data.
//  * @param prerequisites An array of requirement objects.
//  * @param sourceId The id of the entry the requirement objects belong to.
//  * @param pact A valid `Pact` object or `undefined`.
//  */
// export const validatePrerequisites =
//   (wiki: StaticDataRecord) =>
//   (state: HeroModelRecord) =>
//   (prerequisites: List<AllRequirements>) =>
//   (sourceId: string): boolean =>
//     all (pipe (validateObject (wiki) (state), thrush (sourceId)))
//         (prerequisites)
//
//
// /**
//  * ```haskell
//  * areSpellPrereqisitesMet :: Wiki -> Hero -> Spell -> Bool
//  * ```
//  *
//  * Checks if all prerequisites of the passed spell are met.
//  */
// export const areSpellPrereqisitesMet =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (entry: Record<Spell>) =>
//     validatePrerequisites (wiki)
//                           (hero)
//                           (SA.prerequisites (entry))
//                           (SA.id (entry))
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
