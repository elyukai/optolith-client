module IM = Ley_IntMap;

let decodeUI = Messages.Decode.t;

let idName = json =>
  Json.Decode.(json |> field("id", int), json |> field("name", string));

let idNames = json =>
  Json.Decode.(json |> list(idName)) |> Ley_IntMap.fromList;

let decodeFilesOfEntryType = (decoder, fileContents: list(Js.Json.t)) =>
  Ley_List.foldl(
    (mp, fileContent) =>
      decoder(fileContent)
      |> Ley_Option.option(mp, ((parsedKey, parsedValue)) =>
           Ley_IntMap.insert(parsedKey, parsedValue, mp)
         ),
    Ley_IntMap.empty,
    fileContents,
  );

let decodeFiles = (langs, messages, parsedData: Yaml_Raw.t): Static.t => {
  let animistForces =
    decodeFilesOfEntryType(
      AnimistForce.Static.decode(langs),
      parsedData.animistForces,
    );

  let arcaneBardTraditions =
    decodeFilesOfEntryType(
      IdName.decode(langs),
      parsedData.arcaneBardTraditions,
    );

  let arcaneDancerTraditions =
    decodeFilesOfEntryType(
      IdName.decode(langs),
      parsedData.arcaneDancerTraditions,
    );

  let armorTypes =
    decodeFilesOfEntryType(IdName.decode(langs), parsedData.armorTypes);

  let aspects =
    decodeFilesOfEntryType(IdName.decode(langs), parsedData.aspects);

  let attributes =
    decodeFilesOfEntryType(
      Attribute.Static.decode(langs),
      parsedData.attributes,
    );

  let blessedTraditions =
    decodeFilesOfEntryType(
      BlessedTradition.decode(langs),
      parsedData.blessedTraditions,
    );

  let blessings =
    decodeFilesOfEntryType(
      Blessing.Static.decode(langs),
      parsedData.blessings,
    );

  let brews = decodeFilesOfEntryType(IdName.decode(langs), parsedData.brews);

  let cantrips =
    decodeFilesOfEntryType(
      Cantrip.Static.decode(langs),
      parsedData.cantrips,
    );

  let combatSpecialAbilityGroups =
    decodeFilesOfEntryType(
      IdName.decode(langs),
      parsedData.combatSpecialAbilityGroups,
    );

  let combatTechniqueGroups =
    decodeFilesOfEntryType(
      IdName.decode(langs),
      parsedData.combatTechniqueGroups,
    );

  let combatTechniques =
    decodeFilesOfEntryType(
      CombatTechnique.Static.decode(langs),
      parsedData.combatTechniques,
    );

  let conditions =
    decodeFilesOfEntryType(
      Condition.Static.decode(langs),
      parsedData.conditions,
    );

  let cultures =
    decodeFilesOfEntryType(
      Culture.Static.decode(langs),
      parsedData.cultures,
    );

  let curses =
    decodeFilesOfEntryType(Curse.Static.decode(langs), parsedData.curses);

  let derivedCharacteristics =
    decodeFilesOfEntryType(
      DerivedCharacteristic.Static.decode(langs),
      parsedData.derivedCharacteristics,
    );

  let dominationRituals =
    decodeFilesOfEntryType(
      DominationRitual.Static.decode(langs),
      parsedData.dominationRituals,
    );

  let elvenMagicalSongs =
    decodeFilesOfEntryType(
      ElvenMagicalSong.Static.decode(langs),
      parsedData.elvenMagicalSongs,
    );

  let items = decodeFilesOfEntryType(Item.decode(langs), parsedData.items);

  let equipmentGroups =
    decodeFilesOfEntryType(IdName.decode(langs), parsedData.equipmentGroups);

  let equipmentPackages =
    decodeFilesOfEntryType(
      EquipmentPackage.decode(langs),
      parsedData.equipmentPackages,
    );

  let experienceLevels =
    decodeFilesOfEntryType(
      ExperienceLevel.decode(langs),
      parsedData.experienceLevels,
    );

  let eyeColors =
    decodeFilesOfEntryType(IdName.decode(langs), parsedData.eyeColors);

  let focusRules =
    decodeFilesOfEntryType(
      FocusRule.Static.decode(langs),
      parsedData.focusRules,
    );

  let geodeRituals =
    decodeFilesOfEntryType(
      GeodeRitual.Static.decode(langs),
      parsedData.geodeRituals,
    );

  let hairColors =
    decodeFilesOfEntryType(IdName.decode(langs), parsedData.hairColors);

  let liturgicalChantGroups =
    decodeFilesOfEntryType(
      IdName.decode(langs),
      parsedData.liturgicalChantGroups,
    );

  let liturgicalChants =
    decodeFilesOfEntryType(
      LiturgicalChant.Static.decode(langs),
      parsedData.liturgicalChants,
    );

  let liturgicalChantEnhancements =
    EnhancementsSpecialAbility.liturgicalChantsToSpecialAbilityOptions(
      liturgicalChants,
    );

  let magicalDances =
    decodeFilesOfEntryType(
      MagicalDance.Static.decode(langs),
      parsedData.magicalDances,
    );

  let magicalMelodies =
    decodeFilesOfEntryType(
      MagicalMelody.Static.decode(langs),
      parsedData.magicalMelodies,
    );

  let magicalTraditions =
    decodeFilesOfEntryType(
      MagicalTradition.decode(langs),
      parsedData.magicalTraditions,
    );

  let optionalRules =
    decodeFilesOfEntryType(
      OptionalRule.Static.decode(langs),
      parsedData.optionalRules,
    );

  let pacts =
    decodeFilesOfEntryType(Pact.Static.decode(langs), parsedData.pacts);

  let professions =
    decodeFilesOfEntryType(
      Profession.Static.decode(langs),
      parsedData.professions,
    );

  let properties =
    decodeFilesOfEntryType(IdName.decode(langs), parsedData.properties);

  let publications =
    decodeFilesOfEntryType(
      Publication.decode(langs),
      parsedData.publications,
    );

  let races =
    decodeFilesOfEntryType(Race.Static.decode(langs), parsedData.races);

  let reaches =
    decodeFilesOfEntryType(IdName.decode(langs), parsedData.reaches);

  let rogueSpells =
    decodeFilesOfEntryType(
      RogueSpell.Static.decode(langs),
      parsedData.rogueSpells,
    );

  let skillGroups =
    decodeFilesOfEntryType(SkillGroup.decode(langs), parsedData.skillGroups);

  let skills =
    decodeFilesOfEntryType(Skill.Static.decode(langs), parsedData.skills);

  let socialStatuses =
    decodeFilesOfEntryType(IdName.decode(langs), parsedData.socialStatuses);

  let specialAbilityGroups =
    decodeFilesOfEntryType(
      IdName.decode(langs),
      parsedData.specialAbilityGroups,
    );

  let spellGroups =
    decodeFilesOfEntryType(IdName.decode(langs), parsedData.spellGroups);

  let spells =
    decodeFilesOfEntryType(Spell.Static.decode(langs), parsedData.spells);

  let spellEnhancements =
    EnhancementsSpecialAbility.spellsToSpecialAbilityOptions(spells);

  let states =
    decodeFilesOfEntryType(State.Static.decode(langs), parsedData.states);

  let subjects =
    decodeFilesOfEntryType(IdName.decode(langs), parsedData.subjects);

  let tribes =
    decodeFilesOfEntryType(IdName.decode(langs), parsedData.tribes);

  let zibiljaRituals =
    decodeFilesOfEntryType(
      ZibiljaRitual.Static.decode(langs),
      parsedData.zibiljaRituals,
    );

  let advantages =
    decodeFilesOfEntryType(
      Advantage.Static.decode(
        blessings,
        cantrips,
        combatTechniques,
        liturgicalChants,
        skills,
        spells,
        langs,
      ),
      parsedData.advantages,
    );

  let disadvantages =
    decodeFilesOfEntryType(
      Disadvantage.Static.decode(
        blessings,
        cantrips,
        combatTechniques,
        liturgicalChants,
        skills,
        spells,
        langs,
      ),
      parsedData.disadvantages,
    );

  let baseSpecialAbilities =
    decodeFilesOfEntryType(
      SpecialAbility.Static.decode(
        blessings,
        cantrips,
        combatTechniques,
        liturgicalChants,
        skills,
        spells,
        langs,
      ),
      parsedData.specialAbilities,
    );

  let specialAbilities =
    SpecialAbility.Static.modifyParsed(baseSpecialAbilities);

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
