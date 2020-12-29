module L = Ley_List;

open Ley_Option.Infix;
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
  | PerLevel(_) => None;

let ensurePerLevel =
  fun
  | Advantage.Static.Flat(_) => None
  | PerLevel(x) => Some(x);

let getDefaultApValue = (staticEntry, singleHeroEntry) => {
  open Ley_List;

  let sid1 = singleHeroEntry |> getOption1;
  let level = Ley_Option.fromOption(1, singleHeroEntry.level);
  let apValue =
    staticEntry
    |> Activatable_Accessors.apValue
    |> Ley_Option.fromOption(Advantage.Static.Flat(0));

  let optionApValue =
    sid1
    >>= Activatable_Convert.activatableOptionToSelectOptionId
    >>= getSelectOptionCost(staticEntry);

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

module IcAsIndex = {
  // Helper function to lookup entry, it's IC, converting it to an index and get
  // the correct value from the list of AP values
  let%private getApValueByIcAsIndexAux = (mp, getIc, id, apValues) =>
    Ley_IntMap.lookup(id, mp)
    >>= (
      static =>
        static |> getIc |> IC.icToIndex |> Ley_List.Safe.atMay(apValues)
    );

  // Shortcut function for skills
  let%private getApValueFromSkillsMapByIc = (staticData: Static.t) =>
    getApValueByIcAsIndexAux(staticData.skills, skill => skill.ic);

  // Shortcut function for combat techniques
  let%private getApValueFromCombatTechniquesMapByIc = (staticData: Static.t) =>
    getApValueByIcAsIndexAux(staticData.combatTechniques, skill => skill.ic);

  // Shortcut function for spells
  let%private getApValueFromSpellsMapByIc = (staticData: Static.t) =>
    getApValueByIcAsIndexAux(staticData.spells, skill => skill.ic);

  // Shortcut function for liturgical chants
  let%private getApValueFromLiturgicalChantsMapByIc = (staticData: Static.t) =>
    getApValueByIcAsIndexAux(staticData.liturgicalChants, skill => skill.ic);

  /**
   * `getApValueByIcAsIndex staticData apValue sid` takes the static data, the
   * AP value of the current entry and it's first option. It uses the IC of the
   * entry defined by the option as an index to retrieve the AP value from the
   * list of AP values defined for the entry. If the selected entry is not
   * present or if the entry does not define a list of AP values, `None` is
   * returned.
   */
  let getApValueByIcAsIndex =
      (
        staticData: Static.t,
        apValue: Advantage.Static.apValue,
        sid: Id.Activatable.Option.t,
      ) =>
    [@warning "-4"]
    (
      switch (sid, apValue) {
      | (Preset(Skill(id)), PerLevel(apValues)) =>
        getApValueFromSkillsMapByIc(staticData, id, apValues)
      | (Preset(CombatTechnique(id)), PerLevel(apValues)) =>
        getApValueFromCombatTechniquesMapByIc(staticData, id, apValues)
      | (Preset(Spell(id)), PerLevel(apValues)) =>
        getApValueFromSpellsMapByIc(staticData, id, apValues)
      | (Preset(LiturgicalChant(id)), PerLevel(apValues)) =>
        getApValueFromLiturgicalChantsMapByIc(staticData, id, apValues)
      | _ => None
      }
    );
};

/**
 * Returns the value(s) how the spent AP value would change after removing the
 * respective entry.
 *
 * @param isEntryToAdd If `entry` has not been added to the list of active
 * entries yet, this must be `true`, otherwise `false`.
 */
let getApValueDifferenceOnChangeByEntry =
    (
      ~isEntryToAdd,
      staticData: Static.t,
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

  [@warning "-4"]
  (
    switch (Activatable_Accessors.idDeepVariant(staticEntry)) {
    | Advantage(Aptitude)
    | Advantage(ExceptionalSkill)
    | Advantage(ExceptionalCombatTechnique)
    | Advantage(WeaponAptitude)
    | Disadvantage(Incompetent)
    | SpecialAbility(AdaptionZauber)
    | SpecialAbility(FavoriteSpellwork)
    | SpecialAbility(Lieblingsliturgie)
    | SpecialAbility(Forschungsgebiet)
    | SpecialAbility(Expertenwissen)
    | SpecialAbility(Wissensdurst)
    | SpecialAbility(WegDerGelehrten)
    | SpecialAbility(WegDerKuenstlerin)
    | SpecialAbility(Fachwissen) =>
      singleHeroEntry
      |> getOption1
      >>= IcAsIndex.getApValueByIcAsIndex(staticData, apValue)
    | Disadvantage(PersonalityFlaw) =>
      switch (sid1) {
      | Some(Preset(Generic(selected_option))) =>
        let matchOption = (target_option, current) =>
          switch ((current: option(Id.Activatable.Option.t))) {
          | Some(Preset(Generic(x))) => x === target_option
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
        if (isPersonalityFlawNotPaid(7, 1) || isPersonalityFlawNotPaid(8, 2)) {
          Some(0);
        } else {
          getSelectOptionCost(staticEntry, Generic(selected_option));
        };
      | _ => None
      }
    | Disadvantage(Principles)
    | Disadvantage(Obligations) =>
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
    | Disadvantage(BadHabit) =>
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
    | SpecialAbility(SkillSpecialization) =>
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
                     Id.Activatable.Option.Preset(Skill(skill.id)),
                   )
                // Entries with custom cost are ignored for the rule
                && Ley_Option.isNone(e.customCost),
              heroEntry.active,
            )
            + (isEntryToAdd ? 1 : 0)
          )
          // ...with the skill's IC
          * IC.getApForActivatation(skill.ic)
      )
    | SpecialAbility(Language) =>
      level
      >>= (
        fun
        // Native Tongue (level 4) does not cost anything
        | 4 => Some(0)
        | level => apValue |> ensureFlat <&> ( * )(level)
      )
    | SpecialAbility(PropertyKnowledge)
    | SpecialAbility(AspectKnowledge) =>
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
    | SpecialAbility(TraditionWitches) =>
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
    | SpecialAbility(Recherchegespuer) =>
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
                >>= IcAsIndex.getApValueByIcAsIndex(
                      staticData,
                      PerLevel(apPerLevel),
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
    | SpecialAbility(LanguageSpecializations) =>
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
    | SpecialAbility(Handwerkskunst)
    | SpecialAbility(KindDerNatur)
    | SpecialAbility(KoerperlichesGeschick)
    | SpecialAbility(SozialeKompetenz)
    | SpecialAbility(Universalgenie) =>
      singleHeroEntry.options
      |> Ley_List.take(3)
      |> Ley_Option.mapOption(
           IcAsIndex.getApValueByIcAsIndex(staticData, apValue),
         )
      |> Ley_List.sum
      |> Ley_Option.ensure((<)(0))
    | _ => getDefaultApValue(staticEntry, singleHeroEntry)
    }
  );
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
    | Activatable.Disadvantage(_) => Ley_Int.negate
    | Advantage(_)
    | SpecialAbility(_) => id
    };

  switch (singleHeroEntry.customCost) {
  | Some(customCost) => {apValue: modifyAbs(customCost), isAutomatic}
  | None =>
    getApValueDifferenceOnChangeByEntry(
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
let getApSpentDifference = (staticEntry, heroEntry: Activatable_Dynamic.t) => {
  let apValue = staticEntry |> Activatable_Accessors.apValue;

  [@warning "-4"]
  (
    switch (Activatable_Accessors.idDeepVariant(staticEntry)) {
    | Disadvantage(Principles)
    | Disadvantage(Obligations) =>
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
        switch (apValue) {
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
    | Disadvantage(PersonalityFlaw) =>
      let counterBySelectOption =
        heroEntry.active
        |> SelectOption.Map.countByM(
             fun
             | (
                 {options: [Preset(id)], customCost: None, _}: Activatable_Dynamic.single
               ) =>
               Some(id)
             | _ => None,
           );

      let getDiffBySelectOption = (selectOptionId, paidEntries, counter) => {
        counter
        |> SelectOption.Map.lookup(Generic(selectOptionId))
        |> Ley_Option.fromOption(0) > paidEntries
          ? Activatable_SelectOptions.getSelectOptionCost(
              staticEntry,
              Generic(selectOptionId),
            )
            |> Ley_Option.option(0, apValue =>
                 apValue * paidEntries |> Ley_Int.negate
               )
          : 0;
      };

      getDiffBySelectOption(7, 1, counterBySelectOption)
      + getDiffBySelectOption(8, 2, counterBySelectOption);
    | Disadvantage(BadHabit) =>
      heroEntry.active
      // Ignore entries with custom cost
      |> Ley_List.countBy(
           fun
           | ({customCost: None, _}: Activatable_Dynamic.single) => true
           | _ => false,
         )
      > 3
        // if more than three entries are active, a 0 is displayed, so we need to
        // keep the AP value for three entries.
        ? switch (apValue) {
          | Some(Flat(flatApValue)) => flatApValue * (-3)
          | _ => 0
          }
        : 0
    | SpecialAbility(SkillSpecialization) =>
      let counterBySelectOption =
        heroEntry.active
        |> SelectOption.Map.countByM(
             fun
             | (
                 {options: [Preset(id)], customCost: None, _}: Activatable_Dynamic.single
               ) =>
               Some(id)
             | _ => None,
           );

      counterBySelectOption
      |> SelectOption.Map.foldrWithKey(
           (id, count, accDiff) => {
             switch (
               Activatable_SelectOptions.getSelectOption(staticEntry, id)
             ) {
             | Some({staticEntry: Some(Skill(skill)), _}) =>
               // The sum of displayed AP values without taking IC into account.
               let currentIcFactorForSkill = count * count;
               // The sum of actual AP values without taking IC into account.
               let actualIcFactorForSkill = Math.gsum(1, count);

               // Apply IC multiplier to get final AP value
               IC.getApForActivatation(skill.ic)
               * (actualIcFactorForSkill - currentIcFactorForSkill)
               + accDiff;
             | _ => accDiff
             }
           },
           0,
         );
    | SpecialAbility(PropertyKnowledge)
    | SpecialAbility(AspectKnowledge) =>
      let entryCount = heroEntry.active |> Ley_List.length;

      switch (apValue) {
      | Some(PerLevel(apValues)) =>
        let currentSum =
          Ley_List.Safe.atMay(apValues, entryCount)
          |> Ley_Option.option(0, ( * )(entryCount));
        let actualSum = apValues |> Ley_List.take(entryCount) |> Ley_List.sum;

        actualSum - currentSum;
      | _ => 0
      };
    | _ => 0
    }
  );
};
