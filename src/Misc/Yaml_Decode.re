let%private idName = json =>
  Json.Decode.(json |> field("id", int), json |> field("name", string));

let%private idNames = json =>
  Json.Decode.(json |> list(idName)) |> Ley_IntMap.fromList;

let%private liturgicalChantEnhancements = xs =>
  Ley_List.Monad.(
    xs
    >>= (
      (x: LiturgicalChant.enhancement) => (
        [
          (
            x.level1.id,
            {
              id: `Generic(x.level1.id),
              name: x.level1.name,
              cost: Some(x.level1.cost),
              prerequisites: Prerequisite.empty,
              description: Some(x.level1.effect),
              isSecret: None,
              languages: None,
              continent: None,
              isExtinct: None,
              specializations: None,
              specializationInput: None,
              animalGr: None,
              animalLevel: None,
              enhancementTarget: Some(x.target),
              enhancementLevel: Some(1),
              wikiEntry: None,
              applications: None,
              src: x.src,
              errata: x.errata,
            },
          ),
          (
            x.level2.id,
            {
              id: `Generic(x.level2.id),
              name: x.level2.name,
              cost: Some(x.level2.cost),
              prerequisites: {
                ...Prerequisite.empty,
                activatable:
                  x.level2.requireLevel1
                    ? [
                      {
                        id:
                          `SpecialAbility(
                            Id.specialAbilityToInt(ChantEnhancement),
                          ),
                        active: true,
                        sid: Some(`Generic(x.level1.id)),
                        sid2: None,
                        level: None,
                      },
                    ]
                    : [],
              },
              description: Some(x.level2.effect),
              isSecret: None,
              languages: None,
              continent: None,
              isExtinct: None,
              specializations: None,
              specializationInput: None,
              animalGr: None,
              animalLevel: None,
              enhancementTarget: Some(x.target),
              enhancementLevel: Some(2),
              wikiEntry: None,
              applications: None,
              src: x.src,
              errata: x.errata,
            },
          ),
          (
            x.level3.id,
            {
              id: `Generic(x.level3.id),
              name: x.level3.name,
              cost: Some(x.level3.cost),
              prerequisites: {
                ...Prerequisite.empty,
                activatable:
                  switch (x.level3.requirePrevious) {
                  | Some(First) => [
                      {
                        id:
                          `SpecialAbility(
                            Id.specialAbilityToInt(ChantEnhancement),
                          ),
                        active: true,
                        sid: Some(`Generic(x.level1.id)),
                        sid2: None,
                        level: None,
                      },
                    ]
                  | Some(Second) => [
                      {
                        id:
                          `SpecialAbility(
                            Id.specialAbilityToInt(ChantEnhancement),
                          ),
                        active: true,
                        sid: Some(`Generic(x.level2.id)),
                        sid2: None,
                        level: None,
                      },
                    ]
                  | None => []
                  },
              },
              description: Some(x.level3.effect),
              isSecret: None,
              languages: None,
              continent: None,
              isExtinct: None,
              specializations: None,
              specializationInput: None,
              animalGr: None,
              animalLevel: None,
              enhancementTarget: Some(x.target),
              enhancementLevel: Some(3),
              wikiEntry: None,
              applications: None,
              src: x.src,
              errata: x.errata,
            },
          ),
        ]:
          list((int, SelectOption.t))
      )
    )
    |> Ley_IntMap.fromList
  );

let%private spellEnhancements = xs =>
  Ley_List.Monad.(
    xs
    >>= (
      (x: Spell.enhancement) => (
        [
          (
            x.level1.id,
            {
              id: `Generic(x.level1.id),
              name: x.level1.name,
              cost: Some(x.level1.cost),
              prerequisites: Prerequisite.empty,
              description: Some(x.level1.effect),
              isSecret: None,
              languages: None,
              continent: None,
              isExtinct: None,
              specializations: None,
              specializationInput: None,
              animalGr: None,
              animalLevel: None,
              enhancementTarget: Some(x.target),
              enhancementLevel: Some(1),
              wikiEntry: None,
              applications: None,
              src: x.src,
              errata: x.errata,
            },
          ),
          (
            x.level2.id,
            {
              id: `Generic(x.level2.id),
              name: x.level2.name,
              cost: Some(x.level2.cost),
              prerequisites: {
                ...Prerequisite.empty,
                activatable:
                  x.level2.requireLevel1
                    ? [
                      {
                        id:
                          `SpecialAbility(
                            Id.specialAbilityToInt(SpellEnhancement),
                          ),
                        active: true,
                        sid: Some(`Generic(x.level1.id)),
                        sid2: None,
                        level: None,
                      },
                    ]
                    : [],
              },
              description: Some(x.level2.effect),
              isSecret: None,
              languages: None,
              continent: None,
              isExtinct: None,
              specializations: None,
              specializationInput: None,
              animalGr: None,
              animalLevel: None,
              enhancementTarget: Some(x.target),
              enhancementLevel: Some(2),
              wikiEntry: None,
              applications: None,
              src: x.src,
              errata: x.errata,
            },
          ),
          (
            x.level3.id,
            {
              id: `Generic(x.level3.id),
              name: x.level3.name,
              cost: Some(x.level3.cost),
              prerequisites: {
                ...Prerequisite.empty,
                activatable:
                  switch (x.level3.requirePrevious) {
                  | Some(First) => [
                      {
                        id:
                          `SpecialAbility(
                            Id.specialAbilityToInt(SpellEnhancement),
                          ),
                        active: true,
                        sid: Some(`Generic(x.level1.id)),
                        sid2: None,
                        level: None,
                      },
                    ]
                  | Some(Second) => [
                      {
                        id:
                          `SpecialAbility(
                            Id.specialAbilityToInt(SpellEnhancement),
                          ),
                        active: true,
                        sid: Some(`Generic(x.level2.id)),
                        sid2: None,
                        level: None,
                      },
                    ]
                  | None => []
                  },
              },
              description: Some(x.level3.effect),
              isSecret: None,
              languages: None,
              continent: None,
              isExtinct: None,
              specializations: None,
              specializationInput: None,
              animalGr: None,
              animalLevel: None,
              enhancementTarget: Some(x.target),
              enhancementLevel: Some(3),
              wikiEntry: None,
              applications: None,
              src: x.src,
              errata: x.errata,
            },
          ),
        ]:
          list((int, SelectOption.t))
      )
    )
    |> Ley_IntMap.fromList
  );

let decode = (locale, yamlData: Yaml_Raw.yamlData): Static.t => {
  let animistForces = AnimistForce.Decode.all(yamlData);
  let arcaneBardTraditions = idNames(yamlData.arcaneBardTraditionsL10n);
  let arcaneDancerTraditions = idNames(yamlData.arcaneDancerTraditionsL10n);
  let armorTypes = idNames(yamlData.armorTypesL10n);
  let aspects = idNames(yamlData.aspectsL10n);
  let attributes = Attribute.Decode.all(yamlData);
  let blessedTraditions = BlessedTradition.Decode.all(yamlData);
  let blessings = Blessing.Decode.all(yamlData);
  let brews = idNames(yamlData.brewsL10n);
  let cantrips = Cantrip.Decode.all(yamlData);
  let combatSpecialAbilityGroups =
    idNames(yamlData.combatSpecialAbilityGroupsL10n);
  let combatTechniqueGroups = idNames(yamlData.combatTechniqueGroupsL10n);
  let combatTechniques = CombatTechnique.Decode.all(yamlData);
  let conditions = Condition.Decode.all(yamlData);
  let cultures = Culture.Decode.all(yamlData);
  let curses = Curse.Decode.all(yamlData);
  let derivedCharacteristics = DerivedCharacteristic.Decode.all(yamlData);
  let dominationRituals = DominationRitual.Decode.all(yamlData);
  let elvenMagicalSongs = ElvenMagicalSong.Decode.all(yamlData);
  let items = Item.Decode.all(yamlData);
  let equipmentGroups = idNames(yamlData.equipmentGroupsL10n);
  let equipmentPackages = EquipmentPackage.Decode.all(yamlData);
  let experienceLevels = ExperienceLevel.Decode.all(yamlData);
  let eyeColors = idNames(yamlData.eyeColorsL10n);
  let focusRules = FocusRule.Decode.all(yamlData);
  let geodeRituals = GeodeRitual.Decode.all(yamlData);
  let hairColors = idNames(yamlData.hairColorsL10n);
  let liturgicalChantEnhancements =
    yamlData
    |> LiturgicalChant.Decode.enhancements
    |> liturgicalChantEnhancements;
  let liturgicalChantGroups = idNames(yamlData.liturgicalChantGroupsL10n);
  let liturgicalChants = LiturgicalChant.Decode.all(yamlData);
  let magicalDances = MagicalDance.Decode.all(yamlData);
  let magicalMelodies = MagicalMelody.Decode.all(yamlData);
  let magicalTraditions = MagicalTradition.Decode.all(yamlData);
  let messages = Messages.Decode.t(locale, yamlData.uiL10n);
  let optionalRules = OptionalRule.Decode.all(yamlData);
  let pacts = Pact.Decode.all(yamlData);
  let professions = Profession.Decode.all(yamlData);
  let properties = idNames(yamlData.propertiesL10n);
  let publications = Publication.Decode.all(yamlData);
  let races = Race.Decode.all(yamlData);
  let reaches = idNames(yamlData.reachesL10n);
  let rogueSpells = RogueSpell.Decode.all(yamlData);
  let skillGroups = Skill.Decode.groups(yamlData);
  let skills = Skill.Decode.all(yamlData);
  let socialStatuses = idNames(yamlData.socialStatusesL10n);
  let specialAbilityGroups = idNames(yamlData.specialAbilityGroupsL10n);
  let spellEnhancements =
    yamlData |> Spell.Decode.enhancements |> spellEnhancements;
  let spellGroups = idNames(yamlData.spellGroupsL10n);
  let spells = Spell.Decode.all(yamlData);
  let states = State.Decode.all(yamlData);
  let subjects = idNames(yamlData.subjectsL10n);
  let tribes = idNames(yamlData.tribesL10n);
  let zibiljaRituals = ZibiljaRitual.Decode.all(yamlData);

  let advantages =
    Advantage.Decode.all(
      blessings,
      cantrips,
      combatTechniques,
      liturgicalChants,
      skills,
      spells,
      yamlData,
    );

  let disadvantages =
    Disadvantage.Decode.all(
      blessings,
      cantrips,
      combatTechniques,
      liturgicalChants,
      skills,
      spells,
      yamlData,
    );

  let specialAbilities =
    SpecialAbility.Decode.all(
      blessings,
      cantrips,
      combatTechniques,
      liturgicalChants,
      skills,
      spells,
      yamlData,
    );

  {
    advantages,
    animistForces,
    arcaneBardTraditions,
    arcaneDancerTraditions,
    armorTypes,
    aspects,
    attributes,
    blessedTraditions,
    blessings,
    brews,
    cantrips,
    combatSpecialAbilityGroups,
    combatTechniqueGroups,
    combatTechniques,
    conditions,
    cultures,
    curses,
    derivedCharacteristics,
    disadvantages,
    dominationRituals,
    elvenMagicalSongs,
    items,
    equipmentGroups,
    equipmentPackages,
    experienceLevels,
    eyeColors,
    focusRules,
    geodeRituals,
    hairColors,
    liturgicalChantEnhancements,
    liturgicalChantGroups,
    liturgicalChants,
    magicalDances,
    magicalMelodies,
    magicalTraditions,
    messages,
    optionalRules,
    pacts,
    professions,
    properties,
    publications,
    races,
    reaches,
    rogueSpells,
    skillGroups,
    skills,
    socialStatuses,
    specialAbilities,
    specialAbilityGroups,
    spellEnhancements,
    spellGroups,
    spells,
    states,
    subjects,
    tribes,
    zibiljaRituals,
  };
};
