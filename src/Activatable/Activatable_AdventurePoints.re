open Ley_Option;
open Ley_Option.Functor;
open Ley_Option.Monad;
open Static;
open Ley_Function;
open Activatable_Convert;
open Activatable_Accessors;
open Activatable_SelectOptions;

type combinedApValue = {
  apValue: int,
  isAutomatic: bool,
};

let ensureFlat =
  fun
  | Advantage.Flat(x) => Some(x)
  | Advantage.PerLevel(_) => None;

let ensurePerLevel =
  fun
  | Advantage.Flat(_) => None
  | Advantage.PerLevel(x) => Some(x);

let getDefaultEntryCost = (staticEntry, singleHeroEntry) => {
  open Ley_List;

  let sid1 = singleHeroEntry |> getOption1;
  let level = fromOption(1, singleHeroEntry.level);
  let apValue =
    staticEntry
    |> Activatable_Accessors.apValue
    |> fromOption(Advantage.Flat(0));

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
        xs
        |> take(Ley_Int.max(1, level))
        |> Ley_List.Foldable.sum
        |> (x => Some(x))
      }
    }
  };
};

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
      heroEntry: Hero.Activatable.t,
      singleHeroEntry,
    ) => {
  open Ley_List;

  let sid1 = singleHeroEntry |> getOption1;
  let level = singleHeroEntry.level;
  let apValue = staticEntry |> apValue |> fromOption(Advantage.Flat(0));

  switch (staticEntry) {
  | Advantage(entry) =>
    switch (Id.advantageFromInt(entry.id)) {
    | Aptitude
    | ExceptionalSkill =>
      singleHeroEntry
      |> getOption1
      >>= (
        sid =>
          switch (sid, apValue) {
          | (`Skill(id), PerLevel(apValues)) =>
            Ley_IntMap.lookup(id, staticData.skills)
            >>= (
              static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
            )
          | (`Spell(id), PerLevel(apValues)) =>
            Ley_IntMap.lookup(id, staticData.spells)
            >>= (
              static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
            )
          | (`LiturgicalChant(id), PerLevel(apValues)) =>
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
          | (`CombatTechnique(id), PerLevel(apValues)) =>
            Ley_IntMap.lookup(id, staticData.combatTechniques)
            >>= (
              static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
            )
          | _ => None
          }
      )
    | _ => getDefaultEntryCost(staticEntry, singleHeroEntry)
    }
  | Disadvantage(entry) =>
    switch (Id.disadvantageFromInt(entry.id)) {
    | PersonalityFlaw =>
      switch (sid1) {
      | Some(`Generic(selected_option)) =>
        let matchOption = (target_option, current) =>
          switch (current) {
          | Some(`Generic(x)) => x === target_option
          | _ => false
          };

        let isPersonalityFlawNotPaid = (target_option, paid_entries_max) =>
          target_option === selected_option
          && Ley_List.countBy(
               (e: Hero.Activatable.single) =>
                 e.options
                 |> listToOption
                 |> matchOption(target_option)
                 // Entries with custom cost are ignored for the rule
                 && isNone(e.customCost),
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
        if (isPersonalityFlawNotPaid(7, 1) || isPersonalityFlawNotPaid(8, 2)) {
          Some(0);
        } else {
          getSelectOptionCost(staticEntry, `Generic(selected_option));
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
            heroEntry.active
            |> Ley_List.Foldable.foldr(
                 (active: Hero.Activatable.single, (prevMax, prevSndMax)) =>
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

          // If there is more than one entry on the same level if this entry is
          // active, it won't affect AP spent at all. Thus, if the entry is to
          // be added, there must be at least one (> 0) entry for this rule to
          // take effect.
          //
          // If the entry is not the one with the highest level, adding or
          // removing it won't affect AP spent at all
          if (maxLevel > level
              || countBy(
                   (e: Hero.Activatable.single) =>
                     Ley_Option.Foldable.elem(level, e.level),
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
      |> Ley_Option.Foldable.find(_ =>
           countBy(
             (e: Hero.Activatable.single) => isNone(e.customCost),
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
          | (`Skill(id), PerLevel(apValues)) =>
            Ley_IntMap.lookup(id, staticData.skills)
            >>= (
              static => Ley_List.Safe.atMay(apValues, IC.icToIx(static.ic))
            )
          | _ => None
          }
      )
    | _ => getDefaultEntryCost(staticEntry, singleHeroEntry)
    }
  | SpecialAbility(entry) =>
    switch (Id.specialAbilityFromInt(entry.id)) {
    | SkillSpecialization =>
      sid1
      >>= getSkillFromOption(staticData)
      <&> (
        skill =>
          // Multiply number of final occurences of the
          // same skill...
          (
            countBy(
              (e: Hero.Activatable.single) =>
                e.options
                |> listToOption
                |> Ley_Option.Foldable.elem(`Skill(skill.id))
                // Entries with custom cost are ignored for the rule
                && isNone(e.customCost),
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
              (e: Hero.Activatable.single) => isNone(e.customCost),
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
        hero.disadvantages |> Ley_IntMap.lookup(id) |> isActiveM
          ? cost - 10 : cost;

      apValue
      |> ensureFlat
      <&> (
        flatAp =>
          flatAp
          |> decreaseCost(Id.disadvantageToInt(NoFlyingBalm))
          |> decreaseCost(Id.disadvantageToInt(NoFamiliar))
      );
    | AdaptionZauber
    | FavoriteSpellwork =>
      singleHeroEntry
      |> getOption1
      >>= (
        sid =>
          switch (sid, apValue) {
          | (`Spell(id), PerLevel(apValues)) =>
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
          | (`LiturgicalChant(id), PerLevel(apValues)) =>
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
          | (`Skill(id), PerLevel(apValues)) =>
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
      |> Ley_IntMap.lookup(Id.specialAbilityToInt(Wissensdurst))
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

              liftM2(
                (+),
                // Cost for side subject
                getCostFromHeroEntry(singleHeroEntry),
                // Cost for main subject from Wissensdurst
                wissensdurst.active
                |> listToOption
                >>= (
                  fst =>
                    fst
                    |> singleToSingleWithId(heroEntry)
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
              |> Ley_IntMap.lookup(Id.specialAbilityToInt(Language))
              >>= (
                language =>
                  language.active
                  |> Ley_List.Foldable.find((e: Hero.Activatable.single) =>
                       e.options
                       |> listToOption
                       >>= getGenericId
                       |> Ley_Option.Foldable.elem(languageId)
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
  };
};

/**
 * Returns the AP you get when removing the ActiveObject.
 *
 * @param isEntryToAdd If `entry` has not been added to the list of active
 * entries yet, this must be `true`, otherwise `false`.
 */
let getApValue =
    (
      ~isEntryToAdd,
      ~automaticAdvantages,
      staticData,
      hero: Hero.t,
      staticEntry,
      heroEntry: Hero.Activatable.t,
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
    |> fromOption(0)
    |> modifyAbs
    |> (apValue => {apValue, isAutomatic})
  };
};
