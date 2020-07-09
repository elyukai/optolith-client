module IM = Ley_IntMap;

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
    IM.lookup(Id.advantageToInt(advantageId), hero.advantages),
    IM.lookup(Id.disadvantageToInt(disadvantageId), hero.disadvantages),
  );

let modifyOtherOptions =
    (
      staticData,
      hero,
      specialAbilityPairs,
      adventurePoints,
      staticEntry,
      maybeHeroEntry,
      base,
    ) =>
  switch (staticEntry) {
  | Static.Advantage(_) => Some(base)
  | Disadvantage(staticDisadvantage) =>
    switch (Id.disadvantageFromInt(staticDisadvantage.id)) {
    | WenigePredigten as id
    | WenigeVisionen as id =>
      Some({
        ...base,
        maxLevel:
          Some(
            Activatable_Active_Validation.countActiveFromGroup(
              specialAbilityPairs,
              switch (id) {
              | WenigePredigten => Predigten
              | _ => Visionen
              },
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
  | SpecialAbility(staticSpecialAbility) =>
    switch (Id.specialAbilityFromInt(staticSpecialAbility.id)) {
    | _ => Some(base)
    }
  };
// type OtherOptionsModifier = ident<Record<InactiveActivatable>>
//
// const modifyOtherOptions =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (adventure_points: Record<AdventurePointsCategories>) =>
//   (wiki_entry: Activatable) =>
//   (mhero_entry: Maybe<Record<ActivatableDependent>>): Maybe<OtherOptionsModifier> => {
//     const current_id = AAL.id (wiki_entry)
//
//       case SpecialAbilityId.craftInstruments: {
//         return join (liftM2 (
//                               (woodworking: Record<SkillDependent>) =>
//                               (metalworking: Record<SkillDependent>) =>
//                                 SkDA.value (woodworking) + SkDA.value (metalworking) >= 12
//                                   ? Just (ident)
//                                   : Nothing
//                             )
//                             (pipe (HA.skills, lookup<string> (SkillId.woodworking)) (hero))
//                             (pipe (HA.skills, lookup<string> (SkillId.metalworking)) (hero)))
//       }
//
//       case SpecialAbilityId.hunter: {
//         return pipe_ (
//           CombatTechniqueGroupId.Ranged,
//           getAllEntriesByGroup (SDA.combatTechniques (wiki))
//                                (HA.combatTechniques (hero)),
//           filter (pipe (SkDA.value, gte (10))),
//           flength,
//           ensure (gt (0)),
//           mapReplace (ident)
//         )
//       }
//
//       case prefixSA (SpecialAbilityId.traditionGuildMages):
//       case SpecialAbilityId.traditionWitches:
//       case SpecialAbilityId.traditionElves:
//       case SpecialAbilityId.traditionDruids:
//       case SpecialAbilityId.traditionIllusionist:
//       case SpecialAbilityId.traditionQabalyaMage:
//       case SpecialAbilityId.traditionGeoden:
//       case SpecialAbilityId.traditionZauberalchimisten:
//       case SpecialAbilityId.traditionSchelme:
//       case SpecialAbilityId.traditionBrobimGeoden: {
//         return pipe_ (
//           hero,
//           HA.specialAbilities,
//           getMagicalTraditionsHeroEntries,
//           ensure (List.fnull),
//           mapReplace (ident)
//         )
//       }
//
//       case SpecialAbilityId.propertyKnowledge:
//       case SpecialAbilityId.aspectKnowledge: {
//         return pipe_ (
//           wiki_entry,
//           AAL.cost,
//           bindF<number | List<number>, List<number>> (ensure (isList)),
//           bindF (costs => subscript (costs)
//                                     (maybe (0)
//                                            (pipe (ADA.active, flength))
//                                            (mhero_entry))),
//           fmap (pipe (Just, set (IAL.cost)))
//         )
//       }
//
//       case SpecialAbilityId.traditionChurchOfPraios:
//       case SpecialAbilityId.traditionChurchOfRondra:
//       case SpecialAbilityId.traditionChurchOfBoron:
//       case SpecialAbilityId.traditionChurchOfHesinde:
//       case SpecialAbilityId.traditionChurchOfPhex:
//       case SpecialAbilityId.traditionChurchOfPeraine:
//       case SpecialAbilityId.traditionChurchOfEfferd:
//       case SpecialAbilityId.traditionChurchOfTravia:
//       case SpecialAbilityId.traditionChurchOfFirun:
//       case SpecialAbilityId.traditionChurchOfTsa:
//       case SpecialAbilityId.traditionChurchOfIngerimm:
//       case SpecialAbilityId.traditionChurchOfRahja:
//       case SpecialAbilityId.traditionCultOfTheNamelessOne:
//       case SpecialAbilityId.traditionChurchOfAves:
//       case SpecialAbilityId.traditionChurchOfIfirn:
//       case SpecialAbilityId.traditionChurchOfKor:
//       case SpecialAbilityId.traditionChurchOfNandus:
//       case SpecialAbilityId.traditionChurchOfSwafnir:
//       case SpecialAbilityId.traditionCultOfNuminoru: {
//         return pipe_ (
//           hero,
//           HA.specialAbilities,
//           getBlessedTradition,
//           x => isJust (x) ? Nothing : Just (ident)
//         )
//       }
//
//       case SpecialAbilityId.recherchegespuer: {
//         return pipe_ (
//           hero,
//           HA.specialAbilities,
//           lookup<string> (SpecialAbilityId.wissensdurst),
//           fmap (ADA.active),
//           bindF (listToMaybe),
//           bindF (AOA.sid),
//           misStringM,
//           bindF (lookupF (SDA.skills (wiki))),
//           bindF (skill => pipe (
//                                  bindF<number | List<number>, List<number>> (ensure (isList)),
//                                  fmap (pipe (
//                                         map (add (SA.ic (skill))),
//                                         Just,
//                                         set (IAL.cost)
//                                       ))
//                                )
//                                (AAL.cost (wiki_entry)))
//         )
//       }
//
//       case SpecialAbilityId.predigtDerGemeinschaft:
//       case SpecialAbilityId.predigtDerZuversicht:
//       case SpecialAbilityId.predigtDesGottvertrauens:
//       case SpecialAbilityId.predigtDesWohlgefallens:
//       case SpecialAbilityId.predigtWiderMissgeschicke: {
//         const isAdvActive =
//           pipe (lookupF (HA.advantages (hero)), isMaybeActive)
//
//         const max =
//           getSermonOrVisionCountMax (hero)
//                                     (AdvantageId.zahlreichePredigten)
//                                     (DisadvantageId.wenigePredigten)
//
//         const isLessThanMax =
//           countActiveGroupEntries (wiki)
//                                   (hero)
//                                   (SpecialAbilityGroup.Predigten) < max
//
//         return (isAdvActive (AdvantageId.prediger) && isLessThanMax)
//           || isAdvActive (AdvantageId.blessed)
//           ? Just (ident)
//           : Nothing
//       }
//
//       case SpecialAbilityId.visionDerBestimmung:
//       case SpecialAbilityId.visionDerEntrueckung:
//       case SpecialAbilityId.visionDerGottheit:
//       case SpecialAbilityId.visionDesSchicksals:
//       case SpecialAbilityId.visionDesWahrenGlaubens: {
//         const isAdvActive =
//           pipe (lookupF (HA.advantages (hero)), isMaybeActive)
//
//         const max =
//           getSermonOrVisionCountMax (hero)
//                                     (AdvantageId.zahlreicheVisionen)
//                                     (DisadvantageId.wenigeVisionen)
//
//         const isLessThanMax =
//           countActiveGroupEntries (wiki)
//                                   (hero)
//                                   (SpecialAbilityGroup.Visionen) < max
//
//         return (isAdvActive (AdvantageId.visionaer) && isLessThanMax)
//           || isAdvActive (AdvantageId.blessed)
//           ? Just (ident)
//           : Nothing
//       }
//
//       case SpecialAbilityId.dunklesAbbildDerBuendnisgabe: {
//         return pipe_ (
//           hero,
//           HA.pact,
//           fmap (pipe (PA.level, Just, set (IAL.maxLevel)))
//         )
//       }
//
//       case SpecialAbilityId.traditionArcaneBard:
//       case SpecialAbilityId.traditionArcaneDancer:
//       case SpecialAbilityId.traditionIntuitiveMage:
//       case SpecialAbilityId.traditionSavant:
//       case SpecialAbilityId.traditionAnimisten: {
//         return APCA.spentOnMagicalAdvantages (adventure_points) <= 25
//           && APCA.spentOnMagicalDisadvantages (adventure_points) <= 25
//           && pipe_ (
//               hero,
//               HA.specialAbilities,
//               getMagicalTraditionsHeroEntries,
//               fnull
//             )
//           ? Just (ident)
//           : Nothing
//       }
//
//       default:
//         return Just (ident)
//     }
//   }
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
