module IM = Ley_IntMap;

module Parser = {
  [@bs.module "yaml"] external parse: string => Js.Json.t = "parse";
};

let idName = json =>
  Json.Decode.(json |> field("id", int), json |> field("name", string));

let idNames = json =>
  Json.Decode.(json |> list(idName)) |> Ley_IntMap.fromList;

let decodeFilesOfEntryType = (decoder, fileContents: list(string)) =>
  Ley_List.foldl(
    (mp, fileContent) =>
      decoder(Parser.parse(fileContent))
      |> Ley_Option.option(mp, ((parsedKey, parsedValue)) =>
           Ley_IntMap.insert(parsedKey, parsedValue, mp)
         ),
    Ley_IntMap.empty,
    fileContents,
  );

let categoriesTotal = DatabaseReader.dirs |> Ley_List.length |> Js.Int.toFloat;

let percentPerCategory = 1.0 /. categoriesTotal;

let decodeFiles =
    (~onProgress, langs, messages, parsedData: DatabaseReader.t): Static.t => {
  let animalShapes =
    decodeFilesOfEntryType(
      AnimalShape.Decode.assoc(langs),
      parsedData.animalShapes,
    );

  onProgress(percentPerCategory);

  let animalShapePaths =
    decodeFilesOfEntryType(
      IdName.Decode.assoc(langs),
      parsedData.animalShapePaths,
    );

  onProgress(percentPerCategory *. 2.0);

  let animalShapeSizes =
    decodeFilesOfEntryType(
      AnimalShape.Size.Decode.assoc(langs),
      parsedData.animalShapeSizes,
    );

  onProgress(percentPerCategory *. 3.0);

  let animistForces =
    decodeFilesOfEntryType(
      AnimistForce.Static.Decode.assoc(langs),
      parsedData.animistForces,
    );

  onProgress(percentPerCategory *. 4.0);

  let arcaneBardTraditions =
    decodeFilesOfEntryType(
      ArcaneTradition.Decode.assoc(langs),
      parsedData.arcaneBardTraditions,
    );

  onProgress(percentPerCategory *. 5.0);

  let arcaneDancerTraditions =
    decodeFilesOfEntryType(
      ArcaneTradition.Decode.assoc(langs),
      parsedData.arcaneDancerTraditions,
    );

  onProgress(percentPerCategory *. 6.0);

  let armorTypes =
    decodeFilesOfEntryType(
      IdName.Decode.assoc(langs),
      parsedData.armorTypes,
    );

  onProgress(percentPerCategory *. 7.0);

  let aspects =
    decodeFilesOfEntryType(IdName.Decode.assoc(langs), parsedData.aspects);

  onProgress(percentPerCategory *. 8.0);

  let attributes =
    decodeFilesOfEntryType(
      Attribute.Static.Decode.assoc(langs),
      parsedData.attributes,
    );

  onProgress(percentPerCategory *. 9.0);

  let blessedTraditions =
    decodeFilesOfEntryType(
      BlessedTradition.Decode.assoc(langs),
      parsedData.blessedTraditions,
    );

  onProgress(percentPerCategory *. 10.0);

  let blessings =
    decodeFilesOfEntryType(
      Blessing.Static.Decode.assoc(langs),
      parsedData.blessings,
    );

  onProgress(percentPerCategory *. 11.0);

  let brews =
    decodeFilesOfEntryType(IdName.Decode.assoc(langs), parsedData.brews);

  onProgress(percentPerCategory *. 12.0);

  let cantrips =
    decodeFilesOfEntryType(
      Cantrip.Static.Decode.assoc(langs),
      parsedData.cantrips,
    );

  onProgress(percentPerCategory *. 13.0);

  let combatSpecialAbilityGroups =
    decodeFilesOfEntryType(
      IdName.Decode.assoc(langs),
      parsedData.combatSpecialAbilityGroups,
    );

  onProgress(percentPerCategory *. 14.0);

  let combatTechniqueGroups =
    decodeFilesOfEntryType(
      IdName.Decode.assoc(langs),
      parsedData.combatTechniqueGroups,
    );

  onProgress(percentPerCategory *. 15.0);

  let combatTechniques =
    decodeFilesOfEntryType(
      CombatTechnique.Static.Decode.assoc(langs),
      parsedData.combatTechniques,
    );

  onProgress(percentPerCategory *. 16.0);

  let conditions =
    decodeFilesOfEntryType(
      Condition.Static.Decode.assoc(langs),
      parsedData.conditions,
    );

  onProgress(percentPerCategory *. 17.0);

  let coreRules =
    decodeFilesOfEntryType(
      CoreRule.Decode.assoc(langs),
      parsedData.coreRules,
    );

  onProgress(percentPerCategory *. 18.0);

  let cultures =
    decodeFilesOfEntryType(
      Culture.Static.Decode.assoc(langs),
      parsedData.cultures,
    );

  onProgress(percentPerCategory *. 19.0);

  let curricula =
    decodeFilesOfEntryType(
      Curriculum.Static.Decode.assoc(langs),
      parsedData.curricula,
    );

  onProgress(percentPerCategory *. 20.0);

  let curses =
    decodeFilesOfEntryType(
      Curse.Static.Decode.assoc(langs),
      parsedData.curses,
    );

  onProgress(percentPerCategory *. 21.0);

  let derivedCharacteristics =
    decodeFilesOfEntryType(
      DerivedCharacteristic.Static.Decode.assoc(langs),
      parsedData.derivedCharacteristics,
    );

  onProgress(percentPerCategory *. 22.0);

  let dominationRituals =
    decodeFilesOfEntryType(
      DominationRitual.Static.Decode.assoc(langs),
      parsedData.dominationRituals,
    );

  onProgress(percentPerCategory *. 23.0);

  let elvenMagicalSongs =
    decodeFilesOfEntryType(
      ElvenMagicalSong.Static.Decode.assoc(langs),
      parsedData.elvenMagicalSongs,
    );

  onProgress(percentPerCategory *. 24.0);

  let items =
    decodeFilesOfEntryType(Item.Decode.assoc(langs), parsedData.items);

  onProgress(percentPerCategory *. 25.0);

  let equipmentGroups =
    decodeFilesOfEntryType(
      IdName.Decode.assoc(langs),
      parsedData.equipmentGroups,
    );

  onProgress(percentPerCategory *. 26.0);

  let equipmentPackages =
    decodeFilesOfEntryType(
      EquipmentPackage.Decode.assoc(langs),
      parsedData.equipmentPackages,
    );

  onProgress(percentPerCategory *. 27.0);

  let experienceLevels =
    decodeFilesOfEntryType(
      ExperienceLevel.Decode.assoc(langs),
      parsedData.experienceLevels,
    );

  onProgress(percentPerCategory *. 28.0);

  let eyeColors =
    decodeFilesOfEntryType(IdName.Decode.assoc(langs), parsedData.eyeColors);

  onProgress(percentPerCategory *. 29.0);

  let focusRules =
    decodeFilesOfEntryType(
      FocusRule.Static.Decode.assoc(langs),
      parsedData.focusRules,
    );

  onProgress(percentPerCategory *. 30.0);

  let geodeRituals =
    decodeFilesOfEntryType(
      GeodeRitual.Static.Decode.assoc(langs),
      parsedData.geodeRituals,
    );

  onProgress(percentPerCategory *. 31.0);

  let hairColors =
    decodeFilesOfEntryType(
      IdName.Decode.assoc(langs),
      parsedData.hairColors,
    );

  onProgress(percentPerCategory *. 32.0);

  let languages =
    decodeFilesOfEntryType(
      Language.Decode.assoc(langs),
      parsedData.languages,
    );

  onProgress(percentPerCategory *. 33.0);

  let liturgicalChantGroups =
    decodeFilesOfEntryType(
      IdName.Decode.assoc(langs),
      parsedData.liturgicalChantGroups,
    );

  onProgress(percentPerCategory *. 34.0);

  let liturgicalChants =
    decodeFilesOfEntryType(
      LiturgicalChant.Static.Decode.assoc(langs),
      parsedData.liturgicalChants,
    );

  onProgress(percentPerCategory *. 35.0);

  let liturgicalChantEnhancements =
    EnhancementsSpecialAbility.liturgicalChantsToSpecialAbilityOptions(
      liturgicalChants,
    );

  onProgress(percentPerCategory *. 36.0);

  let magicalDances =
    decodeFilesOfEntryType(
      MagicalDance.Static.Decode.assoc(langs),
      parsedData.magicalDances,
    );

  onProgress(percentPerCategory *. 37.0);

  let magicalMelodies =
    decodeFilesOfEntryType(
      MagicalMelody.Static.Decode.assoc(langs),
      parsedData.magicalMelodies,
    );

  onProgress(percentPerCategory *. 38.0);

  let magicalTraditions =
    decodeFilesOfEntryType(
      MagicalTradition.Decode.assoc(langs),
      parsedData.magicalTraditions,
    );

  onProgress(percentPerCategory *. 39.0);

  let optionalRules =
    decodeFilesOfEntryType(
      OptionalRule.Static.Decode.assoc(langs),
      parsedData.optionalRules,
    );

  onProgress(percentPerCategory *. 40.0);

  let pacts =
    decodeFilesOfEntryType(
      Pact.Static.Decode.assoc(langs),
      parsedData.pacts,
    );

  onProgress(percentPerCategory *. 41.0);

  let professions =
    decodeFilesOfEntryType(
      Profession.Static.Decode.assoc(langs),
      parsedData.professions,
    );

  onProgress(percentPerCategory *. 42.0);

  let properties =
    decodeFilesOfEntryType(
      IdName.Decode.assoc(langs),
      parsedData.properties,
    );

  onProgress(percentPerCategory *. 43.0);

  let publications =
    decodeFilesOfEntryType(
      Publication.Decode.assoc(langs),
      parsedData.publications,
    );

  onProgress(percentPerCategory *. 44.0);

  let races =
    decodeFilesOfEntryType(
      Race.Static.Decode.assoc(langs),
      parsedData.races,
    );

  onProgress(percentPerCategory *. 45.0);

  let reaches =
    decodeFilesOfEntryType(IdName.Decode.assoc(langs), parsedData.reaches);

  onProgress(percentPerCategory *. 46.0);

  let rogueSpells =
    decodeFilesOfEntryType(
      RogueSpell.Static.Decode.assoc(langs),
      parsedData.rogueSpells,
    );

  onProgress(percentPerCategory *. 47.0);

  let scripts =
    decodeFilesOfEntryType(Script.Decode.assoc(langs), parsedData.scripts);

  onProgress(percentPerCategory *. 48.0);

  let skillGroups =
    decodeFilesOfEntryType(
      SkillGroup.Decode.assoc(langs),
      parsedData.skillGroups,
    );

  onProgress(percentPerCategory *. 49.0);

  let skills =
    decodeFilesOfEntryType(
      Skill.Static.Decode.assoc(langs),
      parsedData.skills,
    );

  onProgress(percentPerCategory *. 50.0);

  let socialStatuses =
    decodeFilesOfEntryType(
      IdName.Decode.assoc(langs),
      parsedData.socialStatuses,
    );

  onProgress(percentPerCategory *. 51.0);

  let specialAbilityGroups =
    decodeFilesOfEntryType(
      IdName.Decode.assoc(langs),
      parsedData.specialAbilityGroups,
    );

  onProgress(percentPerCategory *. 52.0);

  let spellGroups =
    decodeFilesOfEntryType(
      IdName.Decode.assoc(langs),
      parsedData.spellGroups,
    );

  onProgress(percentPerCategory *. 53.0);

  let spells =
    decodeFilesOfEntryType(
      Spell.Static.Decode.assoc(langs),
      parsedData.spells,
    );

  onProgress(percentPerCategory *. 54.0);

  let spellEnhancements =
    EnhancementsSpecialAbility.spellsToSpecialAbilityOptions(spells);

  onProgress(percentPerCategory *. 55.0);

  let states =
    decodeFilesOfEntryType(
      State.Static.Decode.assoc(langs),
      parsedData.states,
    );

  onProgress(percentPerCategory *. 56.0);

  let subjects =
    decodeFilesOfEntryType(IdName.Decode.assoc(langs), parsedData.subjects);

  onProgress(percentPerCategory *. 57.0);

  let tradeSecrets =
    decodeFilesOfEntryType(
      TradeSecret.Decode.assoc(langs),
      parsedData.tradeSecrets,
    );

  onProgress(percentPerCategory *. 58.0);

  let tribes =
    decodeFilesOfEntryType(IdName.Decode.assoc(langs), parsedData.tribes);

  onProgress(percentPerCategory *. 59.0);

  let zibiljaRituals =
    decodeFilesOfEntryType(
      ZibiljaRitual.Static.Decode.assoc(langs),
      parsedData.zibiljaRituals,
    );

  onProgress(percentPerCategory *. 60.0);

  let advantages =
    decodeFilesOfEntryType(
      Advantage.Static.Decode.assoc(
        ~blessings,
        ~cantrips,
        ~combatTechniques,
        ~liturgicalChants,
        ~skills,
        ~spells,
        ~tradeSecrets,
        ~languages,
        ~scripts,
        ~animalShapes,
        ~spellEnhancements,
        ~liturgicalChantEnhancements,
        langs,
      ),
      parsedData.advantages,
    );

  onProgress(percentPerCategory *. 61.0);

  let disadvantages =
    decodeFilesOfEntryType(
      Disadvantage.Static.Decode.assoc(
        ~blessings,
        ~cantrips,
        ~combatTechniques,
        ~liturgicalChants,
        ~skills,
        ~spells,
        ~tradeSecrets,
        ~languages,
        ~scripts,
        ~animalShapes,
        ~spellEnhancements,
        ~liturgicalChantEnhancements,
        langs,
      ),
      parsedData.disadvantages,
    );

  onProgress(percentPerCategory *. 62.0);

  let baseSpecialAbilities =
    decodeFilesOfEntryType(
      SpecialAbility.Static.Decode.assoc(
        ~blessings,
        ~cantrips,
        ~combatTechniques,
        ~liturgicalChants,
        ~skills,
        ~spells,
        ~tradeSecrets,
        ~languages,
        ~scripts,
        ~animalShapes,
        ~spellEnhancements,
        ~liturgicalChantEnhancements,
        langs,
      ),
      parsedData.specialAbilities,
    );

  let specialAbilities =
    SpecialAbility.Static.Decode.modifyParsed(baseSpecialAbilities);

  onProgress(percentPerCategory *. 63.0);

  {
    advantages,
    animalShapes,
    animalShapePaths,
    animalShapeSizes,
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
    coreRules,
    cultures,
    curricula,
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
    languages,
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
    scripts,
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
    tradeSecrets,
    tribes,
    zibiljaRituals,
  };
};
