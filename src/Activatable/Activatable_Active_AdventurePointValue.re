module L = Ley_List;

open Ley_Option.Infix;
open Static;
open Ley_Function;
open Activatable_Convert;
open Activatable_SelectOptions;

type combinedApValue = {
  apValue: int,
  isAutomatic: bool,
};

let ensureFlat =
  fun
  | Advantage.Static.Flat(x) => Some(x)
  | Advantage.Static.PerLevel(_) => None;

let ensurePerLevel =
  fun
  | Advantage.Static.Flat(_) => None
  | Advantage.Static.PerLevel(x) => Some(x);

let getDefaultEntryCost = (staticEntry, singleHeroEntry) => {
  open Ley_List;

  let sid1 = singleHeroEntry |> getOption1;
  let level = Ley_Option.fromOption(1, singleHeroEntry.level);
  let apValue =
    staticEntry
    |> Activatable_Accessors.apValue
    |> Ley_Option.fromOption(Advantage.Static.Flat(0));

  let optionApValue = sid1 >>= getSelectOptionCost(staticEntry);

  switch (optionApValue) {
  | Some(x) => Some(x)
  | None =>
    switch (apValue) {
    | Flat(x) => Some(x * level)
    | PerLevel(xs) =>
      switch (staticEntry) {
      | Advantage(_)
      | Disadvantage(_) => Ley_List.Safe.atMay(xs, level - 1)
      | SpecialAbility(_) =>
        xs |> take(Ley_Int.max(1, level)) |> Ley_List.sum |> (x => Some(x))
      }
    }
  };
};

let getPrinciplesObligationsMaxLevels = ({active, _}: Activatable_Dynamic.t) =>
  active
  |> Ley_List.foldr(
       (active: Activatable_Dynamic.single, (prevMax, prevSndMax)) =>
         switch (active.level, active.customCost) {
         // Only get the maximum from the current and the previous level, if
         // the current has no custom cost
         | (Some(activeLevel), None) =>
           if (activeLevel > prevMax) {
             (activeLevel, prevMax);
           } else {
             (prevMax, prevSndMax);
           }
         // Otherwise always return the previous max
         | _ => (prevMax, prevSndMax)
         },
       (0, 0),
     );

/**
 * Returns the value(s) how the spent AP value would change after removing the
 * respective entry.
 *
 * @param isEntryToAdd If `entry` has not been added to the list of active
 * entries yet, this must be `true`, otherwise `false`.
 */
let getEntrySpecificCost =
    (
      ~isEntryToAdd,
      staticData,
      hero: Hero.t,
      staticEntry,
      heroEntry: Activatable_Dynamic.t,
      singleHeroEntry,
    ) => {
  open Ley_List;

  let sid1 = singleHeroEntry |> getOption1;
  let level = singleHeroEntry.level;
  let apValue =
    staticEntry
    |> Activatable_Accessors.apValue
    |> Ley_Option.fromOption(Advantage.Static.Flat(0));

  switch (staticEntry) {
  | Advantage(entry) =>
    [@warning "-4"]
    (
      switch (Id.Advantage.fromInt(entry.id)) {
      | Aptitude
      | ExceptionalSkill =>
        singleHeroEntry
        |> getOption1
        >>= (
          sid =>
            switch (sid, apValue) {
            | (Preset((Skill, id)), PerLevel(apValues)) =>
              Ley_IntMap.lookup(id, staticData.skills)
              >>= (
                static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
              )
            | (Preset((Spell, id)), PerLevel(apValues)) =>
              Ley_IntMap.lookup(id, staticData.spells)
              >>= (
                static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
              )
            | (Preset((LiturgicalChant, id)), PerLevel(apValues)) =>
              Ley_IntMap.lookup(id, staticData.liturgicalChants)
              >>= (
                static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
              )
            | _ => None
            }
        )
      | ExceptionalCombatTechnique
      | WeaponAptitude =>
        singleHeroEntry
        |> getOption1
        >>= (
          sid =>
            switch (sid, apValue) {
            | (Preset((CombatTechnique, id)), PerLevel(apValues)) =>
              Ley_IntMap.lookup(id, staticData.combatTechniques)
              >>= (
                static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
              )
            | _ => None
            }
        )
      | _ => getDefaultEntryCost(staticEntry, singleHeroEntry)
      }
    )
  | Disadvantage(entry) =>
    [@warning "-4"]
    (
      switch (Id.Disadvantage.fromInt(entry.id)) {
      | PersonalityFlaw =>
        switch (sid1) {
        | Some(Preset((Generic, selected_option))) =>
          let matchOption = (target_option, current) =>
            switch ((current: option(Id.Activatable.Option.t))) {
            | Some(Preset((Generic, x))) => x === target_option
            | _ => false
            };

          let isPersonalityFlawNotPaid = (target_option, paid_entries_max) =>
            target_option === selected_option
            && Ley_List.countBy(
                 (e: Activatable_Dynamic.single) =>
                   e.options
                   |> Ley_Option.listToOption
                   |> matchOption(target_option)
                   // Entries with custom cost are ignored for the rule
                   && Ley_Option.isNone(e.customCost),
                 heroEntry.active,
               )
            > (isEntryToAdd ? paid_entries_max - 1 : paid_entries_max);

          // 7 = "Prejudice" => more than one entry possible
          // more than one entry of Prejudice does not contribute to AP spent
          //
          // 8 = "Unworldly" => more than one entry possible
          // more than two entries of Unworldly do not contribute to AP spent
          //
          // In both cases, removing the entry would not change AP so it has to
          // return 0.
          if (isPersonalityFlawNotPaid(7, 1)
              || isPersonalityFlawNotPaid(8, 2)) {
            Some(0);
          } else {
            getSelectOptionCost(
              staticEntry,
              Preset((Generic, selected_option)),
            );
          };
        | _ => None
        }
      | Principles
      | Obligations =>
        level
        >>= (
          level => {
            // This is the highest and the second-highest level of this entry at the
            // moment.
            let (maxLevel, sndMaxLevel) =
              getPrinciplesObligationsMaxLevels(heroEntry);

            // If there is more than one entry on the same level if this entry is
            // active, it won't affect AP spent at all. Thus, if the entry is to
            // be added, there must be at least one (> 0) entry for this rule to
            // take effect.
            //
            // If the entry is not the one with the highest level, adding or
            // removing it won't affect AP spent at all
            if (maxLevel > level
                || countBy(
                     (e: Activatable_Dynamic.single) =>
                       Ley_Option.elem(level, e.level),
                     heroEntry.active,
                   )
                > (isEntryToAdd ? 0 : 1)) {
              None;
            } else {
              // Otherwise, the level difference results in the cost.
              apValue |> ensureFlat <&> ( * )(level - sndMaxLevel);
            };
          }
        )
      | BadHabit =>
        apValue
        |> ensureFlat
        |> Ley_Option.find(_ =>
             countBy(
               (e: Activatable_Dynamic.single) =>
                 Ley_Option.isNone(e.customCost),
               heroEntry.active,
             )
             > (isEntryToAdd ? 2 : 3)
           )
      | Incompetent =>
        singleHeroEntry
        |> getOption1
        >>= (
          sid =>
            switch (sid, apValue) {
            | (Preset((Skill, id)), PerLevel(apValues)) =>
              Ley_IntMap.lookup(id, staticData.skills)
              >>= (
                static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
              )
            | _ => None
            }
        )
      | _ => getDefaultEntryCost(staticEntry, singleHeroEntry)
      }
    )
  | SpecialAbility(entry) =>
    [@warning "-4"]
    (
      switch (Id.SpecialAbility.fromInt(entry.id)) {
      | SkillSpecialization =>
        sid1
        >>= getSkillFromOption(staticData)
        <&> (
          skill =>
            // Multiply number of final occurences of the
            // same skill...
            (
              countBy(
                (e: Activatable_Dynamic.single) =>
                  e.options
                  |> Ley_Option.listToOption
                  |> Ley_Option.elem(
                       Id.Activatable.Option.Preset((Skill, skill.id)),
                     )
                  // Entries with custom cost are ignored for the rule
                  && Ley_Option.isNone(e.customCost),
                heroEntry.active,
              )
              + (isEntryToAdd ? 1 : 0)
            )
            // ...with the skill's IC
            * IC.getAPForActivatation(skill.ic)
        )
      | Language =>
        level
        >>= (
          fun
          // Native Tongue (level 4) does not cost anything
          | 4 => Some(0)
          | level => apValue |> ensureFlat <&> ( * )(level)
        )
      | PropertyKnowledge
      | AspectKnowledge =>
        apValue
        |> ensurePerLevel
        >>= (
          apPerLevel => {
            // Ignore custom cost activations in terms of calculated cost
            let amountActive =
              countBy(
                (e: Activatable_Dynamic.single) =>
                  Ley_Option.isNone(e.customCost),
                heroEntry.active,
              );

            let index = amountActive + (isEntryToAdd ? 0 : (-1));

            Ley_List.Safe.atMay(apPerLevel, index);
          }
        )
      | TraditionWitches =>
        // There are two disadvantages that, when active, decrease the cost of
        // this tradition by 10 AP each
        let decreaseCost = (id, cost) =>
          hero.disadvantages
          |> Ley_IntMap.lookup(id)
          |> Activatable_Accessors.isActiveM
            ? cost - 10 : cost;

        apValue
        |> ensureFlat
        <&> (
          flatAp =>
            flatAp
            |> decreaseCost(Id.Disadvantage.toInt(NoFlyingBalm))
            |> decreaseCost(Id.Disadvantage.toInt(NoFamiliar))
        );
      | AdaptionZauber
      | FavoriteSpellwork =>
        singleHeroEntry
        |> getOption1
        >>= (
          sid =>
            switch (sid, apValue) {
            | (Preset((Spell, id)), PerLevel(apValues)) =>
              Ley_IntMap.lookup(id, staticData.spells)
              >>= (
                static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
              )
            | _ => None
            }
        )
      | Lieblingsliturgie =>
        singleHeroEntry
        |> getOption1
        >>= (
          sid =>
            switch (sid, apValue) {
            | (Preset((LiturgicalChant, id)), PerLevel(apValues)) =>
              Ley_IntMap.lookup(id, staticData.liturgicalChants)
              >>= (
                static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
              )
            | _ => None
            }
        )
      | Forschungsgebiet
      | Expertenwissen
      | Wissensdurst
      | WegDerGelehrten
      | WegDerKuenstlerin
      | Fachwissen
      | Handwerkskunst
      | KindDerNatur
      | KoerperlichesGeschick
      | SozialeKompetenz
      | Universalgenie =>
        singleHeroEntry
        |> getOption1
        >>= (
          sid =>
            switch (sid, apValue) {
            | (Preset((Skill, id)), PerLevel(apValues)) =>
              Ley_IntMap.lookup(id, staticData.skills)
              >>= (
                static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
              )
            | _ => None
            }
        )
      | Recherchegespuer =>
        // The AP cost for this SA consist of two parts: AP based on the IC of
        // the main subject (from "SA_531"/Wissensdurst) in addition to AP based
        // on the IC of the side subject selected in this SA.

        hero.specialAbilities
        |> Ley_IntMap.lookup(Id.SpecialAbility.toInt(Wissensdurst))
        >>= (
          wissensdurst =>
            apValue
            |> ensurePerLevel
            >>= (
              apPerLevel => {
                let getCostFromHeroEntry = entry =>
                  entry
                  |> getOption1
                  >>= getSkillFromOption(staticData)
                  >>= (
                    skill =>
                      Ley_List.Safe.atMay(apPerLevel, IC.icToIx(skill.ic))
                  );

                Ley_Option.liftM2(
                  (+),
                  // Cost for side subject
                  getCostFromHeroEntry(singleHeroEntry),
                  // Cost for main subject from Wissensdurst
                  wissensdurst.active
                  |> Ley_Option.listToOption
                  >>= (
                    fst =>
                      fst
                      |> singleToSingleWithId(heroEntry, 0)
                      |> getCostFromHeroEntry
                  ),
                );
              }
            )
        )
      | LanguageSpecializations =>
        apValue
        |> ensureFlat
        >>= (
          flatAp =>
            sid1
            >>= getGenericId
            >>= (
              languageId =>
                hero.specialAbilities
                |> Ley_IntMap.lookup(Id.SpecialAbility.toInt(Language))
                >>= (
                  language =>
                    language.active
                    |> Ley_List.find((e: Activatable_Dynamic.single) =>
                         e.options
                         |> Ley_Option.listToOption
                         >>= getGenericId
                         |> Ley_Option.elem(languageId)
                       )
                    >>= (
                      selectedLanguage =>
                        selectedLanguage.level
                        <&> (
                          fun
                          | 4 => 0
                          | _ => flatAp
                        )
                    )
                )
            )
        )
      | _ => getDefaultEntryCost(staticEntry, singleHeroEntry)
      }
    )
  };
};

/**
 * Returns the AP you get when addiing or removing the entry.
 *
 * @param isEntryToAdd If `entry` has not been added to the list of active
 * entries yet, this must be `true`, otherwise `false`.
 */
let getApValueDifferenceOnChange =
    (
      ~isEntryToAdd,
      ~automaticAdvantages,
      staticData,
      hero: Hero.t,
      staticEntry,
      heroEntry: Activatable_Dynamic.t,
      singleHeroEntry,
    ) => {
  let isAutomatic = Ley_List.elem(singleHeroEntry.id, automaticAdvantages);

  let modifyAbs =
    switch (staticEntry) {
    | Disadvantage(_) => Ley_Int.negate
    | Advantage(_)
    | SpecialAbility(_) => id
    };

  switch (singleHeroEntry.customCost) {
  | Some(customCost) => {apValue: modifyAbs(customCost), isAutomatic}
  | None =>
    getEntrySpecificCost(
      ~isEntryToAdd,
      staticData,
      hero,
      staticEntry,
      heroEntry,
      singleHeroEntry,
    )
    |> Ley_Option.fromOption(0)
    |> modifyAbs
    |> (apValue => {apValue, isAutomatic})
  };
};

/**
 * Returns the difference to the value from `getApValueDifferenceOnChange` to be
 * able to calculate the correct AP spent.
 *
 * A positive return value means that the entry uses *more* AP than what
 * `getApValueDifferenceOnChange` returned for all activations, so that both
 * return values can be added to form the final AP spent.
 *
 * Note, that disadvantages still return positive values if they actually cost
 * AP.
 */
let getApSpentDifference = (staticEntry, heroEntry: Activatable_Dynamic.t) =>
  switch (staticEntry) {
  | Static.Advantage(_) => 0
  | Disadvantage(staticDisadvantage) =>
    [@warning "-4"]
    Id.Disadvantage.(
      switch (fromInt(staticDisadvantage.id)) {
      | Principles
      | Obligations =>
        let (maxLevel, sndMaxLevel) =
          getPrinciplesObligationsMaxLevels(heroEntry);

        let singlesAtMaxLevel =
          L.countBy(
            fun
            | ({level: Some(level), _}: Activatable_Dynamic.single) =>
              level === maxLevel
            | _ => false,
            heroEntry.active,
          );

        let baseApValue =
          switch (staticDisadvantage.apValue) {
          | Some(Flat(value)) => value
          | Some(PerLevel(_))
          | None => 0
          };

        singlesAtMaxLevel > 1
          // In this case, all max level entries would be 0, so this needs to be
          // the full value for the max level
          ? baseApValue * maxLevel
          // otherwise, the max level entry costs the difference between max and
          // second max, so we need to fill to actual value so that
          // currentDifference + baseApValue * sndMaxLevel = total AP value
          : baseApValue * sndMaxLevel;
      | PersonalityFlaw => 0
      | BadHabit => 0
      | _ => 0
      }
    )
  | SpecialAbility(staticSpecialAbility) =>
    [@warning "-4"]
    Id.SpecialAbility.(
      switch (fromInt(staticSpecialAbility.id)) {
      | SkillSpecialization => 0
      | PropertyKnowledge => 0
      | AspectKnowledge => 0
      | _ => 0
      }
    )
  };
// /**
//  * `getSinglePersFlawDiff :: Int -> Int -> ActiveActivatable -> SID -> Int -> Int`
//  *
//  * `getSinglePersFlawDiff sid paid_entries entry current_sid current_entries`
//  *
//  * @param sid SID the diff is for.
//  * @param paid_entries Amount of active entries of the same SID that you get AP
//  * for.
//  * @param entry An entry of Personality Flaw.
//  * @param current_sid The current SID to check.
//  * @param current_entries The current amount of active entries of the current
//  * SID.
//  */
// const getSinglePersFlawDiff =
//   (sid: number) =>
//   (paid_entries: number) =>
//   (entry: Record<ActiveActivatable>) =>
//   (current_sid: number | string) =>
//   (current_entries: number): number =>
//     current_sid === sid && current_entries > paid_entries
//     ? maybe (0)
//             (pipe (multiply (paid_entries), negate))
//             (getSelectOptionCost (AAA.wikiEntry (entry) as Activatable)
//                                 (Just (sid)))
//     : 0
// const getPersonalityFlawsDiff =
//   (entries: List<Record<ActiveActivatable>>): number =>
//     pipe_ (
//       entries,
//       // Find any Personality Flaw entry, as all of them have the same list of
//       // active objects
//       find (pipe (ActiveActivatableA_.id, equals<string> (DisadvantageId.PersonalityFlaw))),
//       fmap (entry => pipe_ (
//         entry,
//         ActiveActivatableA_.active,
//         countWithByKeyMaybe (e => then (guard (isNothing (AOA.cost (e))))
//                                       (AOA.sid (e))),
//         OrderedMap.foldrWithKey ((sid: string | number) => (val: number) =>
//                                   pipe_ (
//                                     List (
//                                       getSinglePersFlawDiff (7) (1) (entry) (sid) (val),
//                                       getSinglePersFlawDiff (8) (2) (entry) (sid) (val)
//                                     ),
//                                     List.sum,
//                                     add
//                                   ))
//                                 (0)
//       )),
//       // If no Personality Flaw was found, there's no diff.
//       Maybe.sum
//     )
// const getBadHabitsDiff =
//   (staticData: StaticDataRecord) =>
//   (hero_slice: StrMap<Record<ActivatableDependent>>) =>
//   (entries: List<Record<ActiveActivatable>>): number =>
//     any (pipe (ActiveActivatableAL_.id, equals<string> (DisadvantageId.BadHabit))) (entries)
//       ? sum (pipe_ (
//         hero_slice,
//         lookup<string> (DisadvantageId.PersonalityFlaw),
//         fmap (pipe (
//           // get current active
//           ActivatableDependent.A.active,
//           getActiveWithNoCustomCost,
//           flength,
//           gt (3),
//           bool_ (() => 0)
//                 (() => pipe_ (
//                   staticData,
//                   SDA.disadvantages,
//                   lookup<string> (DisadvantageId.BadHabit),
//                   bindF (Disadvantage.A.cost),
//                   misNumberM,
//                   fmap (multiply (-3)),
//                   sum
//                 ))
//         ))
//       ))
//       : 0
// const getSkillSpecializationsDiff =
//   (staticData: StaticDataRecord) =>
//   (hero_slice: StrMap<Record<ActivatableDependent>>) =>
//   (entries: List<Record<ActiveActivatable>>): number => {
//     if (any (pipe (ActiveActivatableAL_.id, equals<string> (SpecialAbilityId.SkillSpecialization)))
//             (entries)) {
//       return sum (pipe_ (
//         hero_slice,
//         lookup<string> (SpecialAbilityId.SkillSpecialization),
//         fmap (entry => {
//           const current_active = ActivatableDependent.A.active (entry)
//           // Count how many specializations are for the same skill
//           const sameSkill =
//             countWithByKeyMaybe (pipe (ActiveObject.A.sid, misStringM))
//                                 (current_active)
//           // Return the accumulated value, otherwise 0.
//           const getFlatSkillDone = findWithDefault (0)
//           // Calculates the diff for a single skill specialization
//           const getSingleDiff =
//             (accMap: StrMap<number>) =>
//             (sid: string) =>
//             (counter: number) =>
//             (skill: Record<Skill>) =>
//               Skill.A.ic (skill) * (getFlatSkillDone (sid) (accMap) + 1 - counter)
//           type TrackingPair = Pair<number, StrMap<number>>
//           // Iterates through the counter and sums up all cost differences for
//           // each specialization.
//           //
//           // It keeps track of how many specializations have been already
//           // taken into account.
//           const skillDone =
//             foldr (pipe (
//                     ActiveObject.A.sid,
//                     misStringM,
//                     bindF (current_sid =>
//                             fmapF (lookup (current_sid) (sameSkill))
//                                   (count => (p: TrackingPair) => {
//                                     const m = snd (p)
//                                     // Check if the value in the map is either
//                                     // Nothing or a Just of a lower number than
//                                     // the complete counter
//                                     // => which means there are still actions to
//                                     // be done
//                                     if (all (lt (count)) (lookup (current_sid) (m))) {
//                                       const mskill =
//                                         pipe_ (staticData, SDA.skills, lookup (current_sid))
//                                       return Pair (
//                                         fst (p) + sum (fmap (getSingleDiff (m)
//                                                                           (current_sid)
//                                                                           (count))
//                                                             (mskill)),
//                                         alter (pipe (altF (Just (0)), fmap (inc)))
//                                               (current_sid)
//                                               (m)
//                                       )
//                                     }
//                                     return p
//                                   })),
//                     fromMaybe<ident<TrackingPair>> (ident)
//                   ))
//                   (Pair (0, empty))
//                   (current_active)
//           return fst (skillDone)
//         })
//       ))
//     }
//     return 0
//   }
// const getPropertyKnowledgeDiff =
//   getPropertyOrAspectKnowledgeDiff (SpecialAbilityId.PropertyKnowledge)
// const getAspectKnowledgeDiff =
//   getPropertyOrAspectKnowledgeDiff (SpecialAbilityId.AspectKnowledge)
// /**
//  * The returned number modifies the current AP spent.
//  */
// export const getAdventurePointsSpentDifference =
//   (staticData: StaticDataRecord) =>
//   (hero_slice: StrMap<Record<ActivatableDependent>>) =>
//   (entries: List<Record<ActiveActivatable>>): number => {
//     const adventurePointsSpentDifferences = List (
//       getPrinciplesObligationsDiff (DisadvantageId.Principles) (staticData) (hero_slice) (entries),
//       getPrinciplesObligationsDiff (DisadvantageId.Obligations) (staticData) (hero_slice) (entries),
//       getPersonalityFlawsDiff (entries),
//       getBadHabitsDiff (staticData) (hero_slice) (entries),
//       getSkillSpecializationsDiff (staticData) (hero_slice) (entries),
//       getPropertyKnowledgeDiff (entries),
//       getAspectKnowledgeDiff (entries)
//     )
//     return List.sum (adventurePointsSpentDifferences)
//   }
