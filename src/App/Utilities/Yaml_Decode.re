let%private idName = json =>
  Json.Decode.(json |> field("id", int), json |> field("name", string));

let%private idNames = json =>
  Json.Decode.(json |> list(idName)) |> IntMap.fromList;

let%private liturgicalChantEnhancements = xs =>
  ListH.Monad.(
    xs
    >>= (
      (x: Static.LiturgicalChant.enhancement) => (
        [
          (
            x.level1.id,
            {
              id: `Generic(x.level1.id),
              name: x.level1.name,
              cost: Maybe.Just(x.level1.cost),
              prerequisites: Static_Prerequisites.empty,
              description: Maybe.Just(x.level1.effect),
              isSecret: Maybe.Nothing,
              languages: Maybe.Nothing,
              continent: Maybe.Nothing,
              isExtinct: Maybe.Nothing,
              specializations: Maybe.Nothing,
              specializationInput: Maybe.Nothing,
              animalGr: Maybe.Nothing,
              animalLevel: Maybe.Nothing,
              target: Maybe.Just(x.target),
              wikiEntry: Maybe.Nothing,
              src: x.src,
              errata: x.errata,
            },
          ),
          (
            x.level2.id,
            {
              id: `Generic(x.level2.id),
              name: x.level2.name,
              cost: Maybe.Just(x.level2.cost),
              prerequisites: {
                ...Static_Prerequisites.empty,
                activatable:
                  x.level2.requireLevel1
                    ? [
                      {
                        id:
                          `SpecialAbility(
                            Ids.SpecialAbilityId.chantEnhancement,
                          ),
                        active: true,
                        sid: Maybe.Just(`Generic(x.level1.id)),
                        sid2: Maybe.Nothing,
                        level: Maybe.Nothing,
                      },
                    ]
                    : [],
              },
              description: Maybe.Just(x.level2.effect),
              isSecret: Maybe.Nothing,
              languages: Maybe.Nothing,
              continent: Maybe.Nothing,
              isExtinct: Maybe.Nothing,
              specializations: Maybe.Nothing,
              specializationInput: Maybe.Nothing,
              animalGr: Maybe.Nothing,
              animalLevel: Maybe.Nothing,
              target: Maybe.Just(x.target),
              wikiEntry: Maybe.Nothing,
              src: x.src,
              errata: x.errata,
            },
          ),
          (
            x.level3.id,
            {
              id: `Generic(x.level3.id),
              name: x.level3.name,
              cost: Maybe.Just(x.level3.cost),
              prerequisites: {
                ...Static_Prerequisites.empty,
                activatable:
                  switch (x.level3.requirePrevious) {
                  | Maybe.Just(First) => [
                      {
                        id:
                          `SpecialAbility(
                            Ids.SpecialAbilityId.chantEnhancement,
                          ),
                        active: true,
                        sid: Maybe.Just(`Generic(x.level1.id)),
                        sid2: Maybe.Nothing,
                        level: Maybe.Nothing,
                      },
                    ]
                  | Maybe.Just(Second) => [
                      {
                        id:
                          `SpecialAbility(
                            Ids.SpecialAbilityId.chantEnhancement,
                          ),
                        active: true,
                        sid: Maybe.Just(`Generic(x.level2.id)),
                        sid2: Maybe.Nothing,
                        level: Maybe.Nothing,
                      },
                    ]
                  | Maybe.Nothing => []
                  },
              },
              description: Maybe.Just(x.level3.effect),
              isSecret: Maybe.Nothing,
              languages: Maybe.Nothing,
              continent: Maybe.Nothing,
              isExtinct: Maybe.Nothing,
              specializations: Maybe.Nothing,
              specializationInput: Maybe.Nothing,
              animalGr: Maybe.Nothing,
              animalLevel: Maybe.Nothing,
              target: Maybe.Just(x.target),
              wikiEntry: Maybe.Nothing,
              src: x.src,
              errata: x.errata,
            },
          ),
        ]:
          list((int, Static_SelectOption.t))
      )
    )
    |> IntMap.fromList
  );

let%private spellEnhancements = xs =>
  ListH.Monad.(
    xs
    >>= (
      (x: Static.Spell.enhancement) => (
        [
          (
            x.level1.id,
            {
              id: `Generic(x.level1.id),
              name: x.level1.name,
              cost: Maybe.Just(x.level1.cost),
              prerequisites: Static_Prerequisites.empty,
              description: Maybe.Just(x.level1.effect),
              isSecret: Maybe.Nothing,
              languages: Maybe.Nothing,
              continent: Maybe.Nothing,
              isExtinct: Maybe.Nothing,
              specializations: Maybe.Nothing,
              specializationInput: Maybe.Nothing,
              animalGr: Maybe.Nothing,
              animalLevel: Maybe.Nothing,
              target: Maybe.Just(x.target),
              wikiEntry: Maybe.Nothing,
              src: x.src,
              errata: x.errata,
            },
          ),
          (
            x.level2.id,
            {
              id: `Generic(x.level2.id),
              name: x.level2.name,
              cost: Maybe.Just(x.level2.cost),
              prerequisites: {
                ...Static_Prerequisites.empty,
                activatable:
                  x.level2.requireLevel1
                    ? [
                      {
                        id:
                          `SpecialAbility(
                            Ids.SpecialAbilityId.spellEnhancement,
                          ),
                        active: true,
                        sid: Maybe.Just(`Generic(x.level1.id)),
                        sid2: Maybe.Nothing,
                        level: Maybe.Nothing,
                      },
                    ]
                    : [],
              },
              description: Maybe.Just(x.level2.effect),
              isSecret: Maybe.Nothing,
              languages: Maybe.Nothing,
              continent: Maybe.Nothing,
              isExtinct: Maybe.Nothing,
              specializations: Maybe.Nothing,
              specializationInput: Maybe.Nothing,
              animalGr: Maybe.Nothing,
              animalLevel: Maybe.Nothing,
              target: Maybe.Just(x.target),
              wikiEntry: Maybe.Nothing,
              src: x.src,
              errata: x.errata,
            },
          ),
          (
            x.level3.id,
            {
              id: `Generic(x.level3.id),
              name: x.level3.name,
              cost: Maybe.Just(x.level3.cost),
              prerequisites: {
                ...Static_Prerequisites.empty,
                activatable:
                  switch (x.level3.requirePrevious) {
                  | Maybe.Just(First) => [
                      {
                        id:
                          `SpecialAbility(
                            Ids.SpecialAbilityId.spellEnhancement,
                          ),
                        active: true,
                        sid: Maybe.Just(`Generic(x.level1.id)),
                        sid2: Maybe.Nothing,
                        level: Maybe.Nothing,
                      },
                    ]
                  | Maybe.Just(Second) => [
                      {
                        id:
                          `SpecialAbility(
                            Ids.SpecialAbilityId.spellEnhancement,
                          ),
                        active: true,
                        sid: Maybe.Just(`Generic(x.level2.id)),
                        sid2: Maybe.Nothing,
                        level: Maybe.Nothing,
                      },
                    ]
                  | Maybe.Nothing => []
                  },
              },
              description: Maybe.Just(x.level3.effect),
              isSecret: Maybe.Nothing,
              languages: Maybe.Nothing,
              continent: Maybe.Nothing,
              isExtinct: Maybe.Nothing,
              specializations: Maybe.Nothing,
              specializationInput: Maybe.Nothing,
              animalGr: Maybe.Nothing,
              animalLevel: Maybe.Nothing,
              target: Maybe.Just(x.target),
              wikiEntry: Maybe.Nothing,
              src: x.src,
              errata: x.errata,
            },
          ),
        ]:
          list((int, Static_SelectOption.t))
      )
    )
    |> IntMap.fromList
  );

let decode = (locale, yamlData: Yaml_Raw.yamlData): Static.t => {
  let animistForces = Static.AnimistForce.Decode.all(yamlData);
  let arcaneBardTraditions = idNames(yamlData.arcaneBardTraditionsL10n);
  let arcaneDancerTraditions = idNames(yamlData.arcaneDancerTraditionsL10n);
  let armorTypes = idNames(yamlData.armorTypesL10n);
  let aspects = idNames(yamlData.aspectsL10n);
  let attributes = Static.Attribute.Decode.all(yamlData);
  let blessedTraditions = Static.BlessedTradition.Decode.all(yamlData);
  let blessings = Static.Blessing.Decode.all(yamlData);
  let brews = idNames(yamlData.brewsL10n);
  let cantrips = Static.Cantrip.Decode.all(yamlData);
  let combatSpecialAbilityGroups =
    idNames(yamlData.combatSpecialAbilityGroupsL10n);
  let combatTechniqueGroups = idNames(yamlData.combatTechniqueGroupsL10n);
  let combatTechniques = Static.CombatTechnique.Decode.all(yamlData);
  let conditions = Static.Condition.Decode.all(yamlData);
  let cultures = Static.Culture.Decode.all(yamlData);
  let curses = Static.Curse.Decode.all(yamlData);
  let derivedCharacteristics =
    Static.DerivedCharacteristic.Decode.all(yamlData);
  let dominationRituals = Static.DominationRitual.Decode.all(yamlData);
  let elvenMagicalSongs = Static.ElvenMagicalSong.Decode.all(yamlData);
  let items = Static.Item.Decode.all(yamlData);
  let equipmentGroups = idNames(yamlData.equipmentGroupsL10n);
  let equipmentPackages = Static.EquipmentPackage.Decode.all(yamlData);
  let experienceLevels = Static.ExperienceLevel.Decode.all(yamlData);
  let eyeColors = idNames(yamlData.eyeColorsL10n);
  let focusRules = Static.FocusRule.Decode.all(yamlData);
  let geodeRituals = Static.GeodeRitual.Decode.all(yamlData);
  let hairColors = idNames(yamlData.hairColorsL10n);
  let liturgicalChantEnhancements =
    yamlData
    |> Static.LiturgicalChant.Decode.enhancements
    |> liturgicalChantEnhancements;
  let liturgicalChantGroups = idNames(yamlData.liturgicalChantGroupsL10n);
  let liturgicalChants = Static.LiturgicalChant.Decode.all(yamlData);
  let magicalDances = Static.MagicalDance.Decode.all(yamlData);
  let magicalMelodies = Static.MagicalMelody.Decode.all(yamlData);
  let magicalTraditions = Static.MagicalTradition.Decode.all(yamlData);
  let messages = Static.Messages.Decode.t(locale, yamlData.uiL10n);
  let optionalRules = Static.OptionalRule.Decode.all(yamlData);
  let pacts = Static.PactCategory.Decode.all(yamlData);
  let professions = Static.Profession.Decode.all(yamlData);
  let properties = idNames(yamlData.propertiesL10n);
  let publications = Static.Publication.Decode.all(yamlData);
  let races = Static.Race.Decode.all(yamlData);
  let reaches = idNames(yamlData.reachesL10n);
  let rogueSpells = Static.RogueSpell.Decode.all(yamlData);
  let skillGroups = Static.Skill.Decode.groups(yamlData);
  let skills = Static.Skill.Decode.all(yamlData);
  let socialStatuses = idNames(yamlData.socialStatusesL10n);
  let specialAbilityGroups = idNames(yamlData.specialAbilityGroupsL10n);
  let spellEnhancements =
    yamlData |> Static.Spell.Decode.enhancements |> spellEnhancements;
  let spellGroups = idNames(yamlData.spellGroupsL10n);
  let spells = Static.Spell.Decode.all(yamlData);
  let states = Static.State.Decode.all(yamlData);
  let subjects = idNames(yamlData.subjectsL10n);
  let tribes = idNames(yamlData.tribesL10n);
  let zibiljaRituals = Static.ZibiljaRitual.Decode.all(yamlData);

  let advantages =
    Static.Advantage.Decode.all(
      blessings,
      cantrips,
      combatTechniques,
      liturgicalChants,
      skills,
      spells,
      yamlData,
    );

  let disadvantages =
    Static.Disadvantage.Decode.all(
      blessings,
      cantrips,
      combatTechniques,
      liturgicalChants,
      skills,
      spells,
      yamlData,
    );

  let specialAbilities =
    Static.SpecialAbility.Decode.all(
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
