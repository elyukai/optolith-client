module IM = Ley_IntMap;
module L = Ley_List;
module O = Ley_Option;

type t = {
  id: string,
  name: string,
  cost: option(OneOrMany.t(int)),
  minLevel: option(int),
  maxLevel: option(int),
  selectOptions: option(list(SelectOption.t)),
  heroEntry: option(Hero.Activatable.t),
  staticEntry: Static.activatable,
  customCostDisabled: bool,
  isAutomatic: bool,
};

let getSermonOrVisionCountMax = (hero: Hero.t, advantageId, disadvantageId) =>
  Activatable_Modifier.modifyByLevel(
    3,
    IM.lookup(Id.Advantage.toInt(advantageId), hero.advantages),
    IM.lookup(Id.Disadvantage.toInt(disadvantageId), hero.disadvantages),
  );

let modifyOtherOptions =
    (
      ~staticData: Static.t,
      ~hero,
      ~specialAbilityPairs,
      ~combatTechniquePairs,
      ~adventurePoints: AdventurePoints.categories,
      ~magicalTraditions,
      ~blessedTradition,
      ~staticEntry,
      ~maybeHeroEntry,
      ~base,
    ) =>
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
            Some(
              EntryGroups.SpecialAbility.countActiveFromGroup(
                switch (id) {
                | WenigePredigten => Predigten
                | _ => Visionen
                },
                specialAbilityPairs,
              )
              |> Activatable_Active_Validation.getMaxLevelForDecreaseEntry(3),
            ),
        })

      | SmallSpellSelection =>
        Some({
          ...base,
          maxLevel:
            Some(
              ActivatableSkills.countActiveSkillEntries(Spells, hero)
              |> Activatable_Active_Validation.getMaxLevelForDecreaseEntry(3),
            ),
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
        EntryGroups.CombatTechnique.getFromGroup(Ranged, combatTechniquePairs)
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
        L.Foldable.null(magicalTraditions) ? Some(base) : None

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
            <&> (apValue => {...base, cost: Some(One(apValue))})
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
        O.isNone(blessedTradition) ? Some(base) : None

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
                    {...base, cost: Some(Many(sumValues))} |> return
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
            specialAbilityPairs,
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
            specialAbilityPairs,
          )
          < max;

        isAdvActive(Visionaer) && isLessThanMax || isAdvActive(Blessed)
          ? Some(base) : None;

      | DunklesAbbildDerBuendnisgabe =>
        O.Functor.(
          hero.pact <&> (({level, _}) => {...base, maxLevel: Some(level)})
        )

      | TraditionArcaneBard
      | TraditionArcaneDancer
      | TraditionIntuitiveMage
      | TraditionSavant
      | TraditionAnimisten =>
        adventurePoints.spentOnMagicalAdvantages <= 25
        && adventurePoints.spentOnMagicalDisadvantages <= 25
        && L.Foldable.null(magicalTraditions)
          ? Some(base) : None

      | _ => Some(base)
      }
    )
  };
//
// /**
//  * Calculates whether an Activatable is valid to add or not and, if valid,
//  * calculates and filters necessary properties and selection lists. Returns a
//  * Maybe of the result or `undefined` if invalid.
//  */
// export const getInactiveView =
//   (staticData: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (automatic_advantages: List<string>) =>
//   (required_apply_to_mag_actions: boolean) =>
//   (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
//   (adventure_points: Record<AdventurePointsCategories>) =>
//   (validExtendedSpecialAbilities: List<string>) =>
//   (hero_magical_traditions: List<Record<ActivatableDependent>>) =>
//   (wiki_entry: Activatable) =>
//   (mhero_entry: Maybe<Record<ActivatableDependent>>): Maybe<Record<InactiveActivatable>> => {
//     const current_id = AAL.id (wiki_entry)
//     const current_prerequisites = AAL.prerequisites (wiki_entry)
//
//     const max_level = isOrderedMap (current_prerequisites)
//       ? validateLevel (staticData)
//                       (hero)
//                       (current_prerequisites)
//                       (maybe<ActivatableDependent["dependencies"]> (List ())
//                                                                    (ADA.dependencies)
//                                                                    (mhero_entry))
//                       (current_id)
//       : Nothing
//
//     const isNotValid = isAdditionDisabled (staticData)
//                                           (hero)
//                                           (required_apply_to_mag_actions)
//                                           (validExtendedSpecialAbilities)
//                                           (matching_script_and_lang_related)
//                                           (wiki_entry)
//                                           (mhero_entry)
//                                           (max_level)
//
//     if (!isNotValid) {
//       return pipe_ (
//         wiki_entry,
//         AAL.select,
//         modifySelectOptions (staticData)
//                             (hero)
//                             (hero_magical_traditions)
//                             (wiki_entry)
//                             (mhero_entry),
//         ensure (maybe (true) (notNull)),
//         fmap (select_options => InactiveActivatable ({
//                                   id: current_id,
//                                   name: SpAL.name (wiki_entry),
//                                   cost: AAL.cost (wiki_entry),
//                                   maxLevel: max_level,
//                                   heroEntry: mhero_entry,
//                                   wikiEntry: wiki_entry as Record<RecordI<Activatable>>,
//                                   selectOptions: fmapF (select_options)
//                                                        (sortRecordsByName (staticData)),
//                                   isAutomatic: List.elem (AAL.id (wiki_entry))
//                                                          (automatic_advantages),
//                                 })),
//         ap (modifyOtherOptions (staticData)
//                                (hero)
//                                (adventure_points)
//                                (wiki_entry)
//                                (mhero_entry)),
//         bindF (ensure (pipe (IAA.maxLevel, maybe (true) (notEquals (0)))))
//       )
//     }
//
//     return Nothing
/*   */
