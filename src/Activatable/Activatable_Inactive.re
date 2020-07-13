module IM = Ley_IntMap;
module L = Ley_List;
module O = Ley_Option;

open Activatable_Cache;

type t = {
  id: int,
  name: string,
  apValue: option(OneOrMany.t(int)),
  minLevel: option(int),
  maxLevel: option(int),
  selectOptions: list(SelectOption.t),
  heroEntry: option(Hero.Activatable.t),
  staticEntry: Static.activatable,
  customCostDisabled: bool,
  isAutomatic: bool,
};

type result =
  | Valid(t)
  | Invalid(Static.activatable);

let getSermonOrVisionCountMax = (hero: Hero.t, advantageId, disadvantageId) =>
  Activatable_Modifier.modifyByLevel(
    3,
    IM.lookup(Id.Advantage.toInt(advantageId), hero.advantages),
    IM.lookup(Id.Disadvantage.toInt(disadvantageId), hero.disadvantages),
  );

let modifyOtherOptions =
    (cache, staticData: Static.t, hero, staticEntry, maybeHeroEntry, base) =>
  switch (staticEntry) {
  | Static.Advantage(_) => Some(base)
  | Disadvantage(staticDisadvantage) =>
    [@warning "-4"]
    Id.Disadvantage.(
      switch (fromInt(staticDisadvantage.id)) {
      | WenigePredigten as id
      | WenigeVisionen as id =>
        Some({
          ...base,
          maxLevel:
            EntryGroups.SpecialAbility.countActiveFromGroup(
              switch (id) {
              | WenigePredigten => Predigten
              | _ => Visionen
              },
              cache.specialAbilityPairs,
            )
            |> Activatable_Active_Validation.getMaxLevelForDecreaseEntry(3)
            |> O.ensure((<)(0)),
        })

      | SmallSpellSelection =>
        Some({
          ...base,
          maxLevel:
            ActivatableSkills.countActiveSkillEntries(Spells, hero)
            |> Activatable_Active_Validation.getMaxLevelForDecreaseEntry(3)
            |> O.ensure((<)(0)),
        })

      | _ => Some(base)
      }
    )
  | SpecialAbility(staticSpecialAbility) =>
    [@warning "-4"]
    Id.SpecialAbility.(
      switch (fromInt(staticSpecialAbility.id)) {
      | CraftInstruments =>
        let getSkillValue = skill =>
          hero.skills
          |> IM.lookup(Id.Skill.toInt(skill))
          |> Skills.getValueDef;

        // Sum of SR of Woodworking and Metalworking must be at least 12
        getSkillValue(Woodworking) + getSkillValue(Metalworking) >= 12
          ? Some(base) : None;

      | Hunter =>
        EntryGroups.CombatTechnique.getFromGroup(
          Ranged,
          cache.combatTechniquePairs,
        )
        |> IM.Foldable.any(
             fun
             // At least one ranged combat technique must be on CtR 10 or higher
             | (_, Some((heroEntry: Hero.Skill.t))) => heroEntry.value >= 10
             | _ => false,
           )
          ? Some(base) : None

      | TraditionGuildMages
      | TraditionWitches
      | TraditionElves
      | TraditionDruids
      | TraditionIllusionist
      | TraditionQabalyaMage
      | TraditionGeoden
      | TraditionZauberalchimisten
      | TraditionSchelme
      | TraditionBrobimGeoden =>
        // Only one tradition allowed
        L.Foldable.null(cache.magicalTraditions) ? Some(base) : None

      | PropertyKnowledge
      | AspectKnowledge =>
        switch (staticSpecialAbility.apValue) {
        | Some(PerLevel(values)) =>
          let index =
            O.option(
              0,
              ({active, _}: Hero.Activatable.t) =>
                active |> L.Foldable.length,
              maybeHeroEntry,
            );

          O.Functor.(
            L.Safe.atMay(values, index)
            <&> (apValue => {...base, apValue: Some(One(apValue))})
          );
        | Some(Flat(_))
        | None => None
        }

      | TraditionChurchOfPraios
      | TraditionChurchOfRondra
      | TraditionChurchOfBoron
      | TraditionChurchOfHesinde
      | TraditionChurchOfPhex
      | TraditionChurchOfPeraine
      | TraditionChurchOfEfferd
      | TraditionChurchOfTravia
      | TraditionChurchOfFirun
      | TraditionChurchOfTsa
      | TraditionChurchOfIngerimm
      | TraditionChurchOfRahja
      | TraditionCultOfTheNamelessOne
      | TraditionChurchOfAves
      | TraditionChurchOfIfirn
      | TraditionChurchOfKor
      | TraditionChurchOfNandus
      | TraditionChurchOfSwafnir
      | TraditionCultOfNuminoru =>
        // Only one tradition allowed
        O.isNone(cache.blessedTradition) ? Some(base) : None

      | Recherchegespuer =>
        O.Monad.(
          hero.specialAbilities
          |> IM.lookup(Id.SpecialAbility.toInt(Wissensdurst))
          <&> (({active, _}) => active)
          >>= O.listToOption
          >>= (({options, _}) => O.listToOption(options))
          >>= (
            fun
            | `Skill(skillId) => IM.lookup(skillId, staticData.skills)
            | _ => None
          )
          >>= (
            ({ic, _}) =>
              switch (staticSpecialAbility.apValue) {
              | Some(PerLevel(values)) =>
                values
                |> L.map((+)(IC.getAPForActivatation(ic)))
                |> (
                  sumValues =>
                    {...base, apValue: Some(Many(sumValues))} |> return
                )
              | Some(Flat(_))
              | None => None
              }
          )
        )

      | PredigtDerGemeinschaft
      | PredigtDerZuversicht
      | PredigtDesGottvertrauens
      | PredigtDesWohlgefallens
      | PredigtWiderMissgeschicke =>
        let isAdvActive = id =>
          IM.lookup(Id.Advantage.toInt(id), hero.advantages)
          |> Activatable_Accessors.isActiveM;

        let max =
          getSermonOrVisionCountMax(
            hero,
            ZahlreichePredigten,
            WenigePredigten,
          );

        let isLessThanMax =
          EntryGroups.SpecialAbility.countActiveFromGroup(
            Predigten,
            cache.specialAbilityPairs,
          )
          < max;

        isAdvActive(Prediger) && isLessThanMax || isAdvActive(Blessed)
          ? Some(base) : None;

      | VisionDerBestimmung
      | VisionDerEntrueckung
      | VisionDerGottheit
      | VisionDesSchicksals
      | VisionDesWahrenGlaubens =>
        let isAdvActive = id =>
          IM.lookup(Id.Advantage.toInt(id), hero.advantages)
          |> Activatable_Accessors.isActiveM;

        let max =
          getSermonOrVisionCountMax(hero, ZahlreicheVisionen, WenigeVisionen);

        let isLessThanMax =
          EntryGroups.SpecialAbility.countActiveFromGroup(
            Visionen,
            cache.specialAbilityPairs,
          )
          < max;

        isAdvActive(Visionaer) && isLessThanMax || isAdvActive(Blessed)
          ? Some(base) : None;

      | DunklesAbbildDerBuendnisgabe =>
        O.Monad.(
          hero.pact
          >>= (
            ({level, _}) =>
              level > 0 ? Some({...base, maxLevel: Some(level)}) : None
          )
        )

      | TraditionArcaneBard
      | TraditionArcaneDancer
      | TraditionIntuitiveMage
      | TraditionSavant
      | TraditionAnimisten =>
        cache.adventurePoints.spentOnMagicalAdvantages <= 25
        && cache.adventurePoints.spentOnMagicalDisadvantages <= 25
        && L.Foldable.null(cache.magicalTraditions)
          ? Some(base) : None

      | _ => Some(base)
      }
    )
  };

let getInactive = (cache, staticData, hero, staticEntry, maybeHeroEntry) => {
  let maxLevel =
    Activatable_Inactive_Validation.getMaxLevel(
      staticData,
      hero,
      staticEntry,
      maybeHeroEntry,
    );

  let isAdditionValid =
    Activatable_Inactive_Validation.isAdditionValid(
      cache,
      staticData,
      hero,
      maxLevel,
      staticEntry,
      maybeHeroEntry,
    );

  if (isAdditionValid) {
    O.Monad.(
      Activatable_Inactive_SelectOptions.getAvailableSelectOptions(
        staticData,
        hero,
        cache.magicalTraditions,
        staticEntry,
        maybeHeroEntry,
      )
      <&> (
        selectOptions => {
          id: Activatable_Accessors.id'(staticEntry),
          name: Activatable_Accessors.name(staticEntry),
          apValue: Activatable_Accessors.apValue'(staticEntry),
          minLevel: None,
          maxLevel,
          selectOptions,
          heroEntry: maybeHeroEntry,
          staticEntry,
          customCostDisabled: true,
          isAutomatic:
            switch (staticEntry) {
            | Advantage({id, _}) => L.elem(id, cache.automaticAdvantages)
            | Disadvantage(_)
            | SpecialAbility(_) => false
            },
        }
      )
      >>= (
        base =>
          modifyOtherOptions(
            cache,
            staticData,
            hero,
            staticEntry,
            maybeHeroEntry,
            base,
          )
      )
      |> O.option(Invalid(staticEntry), base => Valid(base))
    );
  } else {
    Invalid(staticEntry);
  };
};
