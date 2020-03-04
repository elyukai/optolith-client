module Parser = {
  type t =
    | Null
    | Bool(bool)
    | Float(float)
    | String(string)
    | Array(list(t))
    | Object(list((string, t)));

  type options = {
    /**
     * Default prefix for anchors. By default `'a'`, resulting in anchors `a1`,
     * `a2`, etc.
     */
    anchorPrefix: option(string),
    /**
     * Allow non-JSON JavaScript objects to remain in the `toJSON` output.
     * Relevant with the YAML 1.1 `!!timestamp` and `!!binary` tags. By default
     * `true`.
     */
    keepBlobsInJSON: option(bool),
    /**
     * Include references in the AST to each node's corresponding CST node. By
     * default `false`.
     */
    keepCstNodes: option(bool),
    /**
     * Store the original node type when parsing documents. By default `true`.
     */
    keepNodeTypes: option(bool),
    /**
     * When outputting JS, use `Map` rather than `Object` to represent mappings.
     * By default `false`.
     */
    mapAsMap: option(bool),
    /**
     * Prevent exponential entity expansion attacks by limiting data aliasing
     * count; set to `-1` to disable checks; `0` disallows all alias nodes. By
     * default `100`.
     */
    maxAliasCount: option(int),
    /**
     * Enable support for `<<` merge keys. By default `false` for YAML 1.2 and
     * `true` for earlier versions.
     */
    merge: option(bool),
    /**
     * Include line position & node type directly in errors; drop their verbose
     * source and context. By default `false`.
     */
    prettyErrors: option(bool),
    /**
     * When stringifying, require keys to be scalars and to use implicit rather
     * than explicit notation. By default `false`.
     */
    simpleKeys: option(bool),
    /**
     * The YAML version used by documents without a %YAML directive. By default
     * `"1.2"`.
     */
    version: option(string),
  };

  let defaultOptions = {
    anchorPrefix: None,
    keepBlobsInJSON: None,
    keepCstNodes: None,
    keepNodeTypes: None,
    mapAsMap: None,
    maxAliasCount: None,
    merge: None,
    prettyErrors: None,
    simpleKeys: None,
    version: None,
  };

  [@bs.module "yaml"]
  external jsParse: (string, options) => Js.Json.t = "parse";

  let parse = data => jsParse(data, defaultOptions);
  let parseWithOpts = jsParse;
};

module Schema = {
  open IO.Functor;

  let heroSchemes = [
    ["Schema", "Advantages", "Advantages.l10n.schema.json"],
    ["Schema", "Advantages", "Advantages.univ.schema.json"],
    ["Schema", "AnimistForces", "AnimistForces.l10n.schema.json"],
    ["Schema", "AnimistForces", "AnimistForces.univ.schema.json"],
    [
      "Schema",
      "ArcaneBardTraditions",
      "ArcaneBardTraditions.l10n.schema.json",
    ],
    [
      "Schema",
      "ArcaneDancerTraditions",
      "ArcaneDancerTraditions.l10n.schema.json",
    ],
    ["Schema", "ArmorTypes", "ArmorTypes.l10n.schema.json"],
    ["Schema", "Aspects", "Aspects.l10n.schema.json"],
    ["Schema", "Attributes", "Attributes.l10n.schema.json"],
    ["Schema", "BlessedTraditions", "BlessedTraditions.l10n.schema.json"],
    ["Schema", "BlessedTraditions", "BlessedTraditions.univ.schema.json"],
    ["Schema", "Blessings", "Blessings.l10n.schema.json"],
    ["Schema", "Blessings", "Blessings.univ.schema.json"],
    ["Schema", "Books", "Books.l10n.schema.json"],
    ["Schema", "Brews", "Brews.l10n.schema.json"],
    ["Schema", "Cantrips", "Cantrips.l10n.schema.json"],
    ["Schema", "Cantrips", "Cantrips.univ.schema.json"],
    [
      "Schema",
      "CombatSpecialAbilityGroups",
      "CombatSpecialAbilityGroups.l10n.schema.json",
    ],
    [
      "Schema",
      "CombatTechniqueGroups",
      "CombatTechniqueGroups.l10n.schema.json",
    ],
    ["Schema", "CombatTechniques", "CombatTechniques.l10n.schema.json"],
    ["Schema", "CombatTechniques", "CombatTechniques.univ.schema.json"],
    ["Schema", "Conditions", "Conditions.l10n.schema.json"],
    ["Schema", "Cultures", "Cultures.l10n.schema.json"],
    ["Schema", "Cultures", "Cultures.univ.schema.json"],
    ["Schema", "Curses", "Curses.l10n.schema.json"],
    ["Schema", "Curses", "Curses.univ.schema.json"],
    [
      "Schema",
      "DerivedCharacteristics",
      "DerivedCharacteristics.l10n.schema.json",
    ],
    ["Schema", "Disadvantages", "Disadvantages.l10n.schema.json"],
    ["Schema", "Disadvantages", "Disadvantages.univ.schema.json"],
    ["Schema", "DominationRituals", "DominationRituals.l10n.schema.json"],
    ["Schema", "DominationRituals", "DominationRituals.univ.schema.json"],
    ["Schema", "ElvenMagicalSongs", "ElvenMagicalSongs.l10n.schema.json"],
    ["Schema", "ElvenMagicalSongs", "ElvenMagicalSongs.univ.schema.json"],
    ["Schema", "Equipment", "Equipment.l10n.schema.json"],
    ["Schema", "Equipment", "Equipment.univ.schema.json"],
    ["Schema", "EquipmentGroups", "EquipmentGroups.l10n.schema.json"],
    ["Schema", "EquipmentPackages", "EquipmentPackages.l10n.schema.json"],
    ["Schema", "EquipmentPackages", "EquipmentPackages.univ.schema.json"],
    ["Schema", "ExperienceLevels", "ExperienceLevels.l10n.schema.json"],
    ["Schema", "ExperienceLevels", "ExperienceLevels.univ.schema.json"],
    ["Schema", "EyeColors", "EyeColors.l10n.schema.json"],
    ["Schema", "FocusRules", "FocusRules.l10n.schema.json"],
    ["Schema", "FocusRules", "FocusRules.univ.schema.json"],
    ["Schema", "GeodeRituals", "GeodeRituals.l10n.schema.json"],
    ["Schema", "GeodeRituals", "GeodeRituals.univ.schema.json"],
    ["Schema", "HairColors", "HairColors.l10n.schema.json"],
    [
      "Schema",
      "LiturgicalChantEnhancements",
      "LiturgicalChantEnhancements.l10n.schema.json",
    ],
    [
      "Schema",
      "LiturgicalChantEnhancements",
      "LiturgicalChantEnhancements.univ.schema.json",
    ],
    [
      "Schema",
      "LiturgicalChantGroups",
      "LiturgicalChantGroups.l10n.schema.json",
    ],
    ["Schema", "LiturgicalChants", "LiturgicalChants.l10n.schema.json"],
    ["Schema", "LiturgicalChants", "LiturgicalChants.univ.schema.json"],
    ["Schema", "MagicalDances", "MagicalDances.l10n.schema.json"],
    ["Schema", "MagicalDances", "MagicalDances.univ.schema.json"],
    ["Schema", "MagicalMelodies", "MagicalMelodies.l10n.schema.json"],
    ["Schema", "MagicalMelodies", "MagicalMelodies.univ.schema.json"],
    ["Schema", "MagicalTraditions", "MagicalTraditions.l10n.schema.json"],
    ["Schema", "MagicalTraditions", "MagicalTraditions.univ.schema.json"],
    ["Schema", "OptionalRules", "OptionalRules.l10n.schema.json"],
    ["Schema", "Pacts", "Pacts.l10n.schema.json"],
    ["Schema", "Professions", "Professions.l10n.schema.json"],
    ["Schema", "Professions", "Professions.univ.schema.json"],
    ["Schema", "ProfessionVariants", "ProfessionVariants.l10n.schema.json"],
    ["Schema", "ProfessionVariants", "ProfessionVariants.univ.schema.json"],
    ["Schema", "Properties", "Properties.l10n.schema.json"],
    ["Schema", "Races", "Races.l10n.schema.json"],
    ["Schema", "Races", "Races.univ.schema.json"],
    ["Schema", "RaceVariants", "RaceVariants.l10n.schema.json"],
    ["Schema", "RaceVariants", "RaceVariants.univ.schema.json"],
    ["Schema", "Reaches", "Reaches.l10n.schema.json"],
    ["Schema", "RogueSpells", "RogueSpells.l10n.schema.json"],
    ["Schema", "RogueSpells", "RogueSpells.univ.schema.json"],
    ["Schema", "SkillGroups", "SkillGroups.l10n.schema.json"],
    ["Schema", "Skills", "Skills.l10n.schema.json"],
    ["Schema", "Skills", "Skills.univ.schema.json"],
    ["Schema", "SocialStatuses", "SocialStatuses.l10n.schema.json"],
    ["Schema", "SpecialAbilities", "SpecialAbilities.l10n.schema.json"],
    ["Schema", "SpecialAbilities", "SpecialAbilities.univ.schema.json"],
    [
      "Schema",
      "SpecialAbilityGroups",
      "SpecialAbilityGroups.l10n.schema.json",
    ],
    ["Schema", "SpellEnhancements", "SpellEnhancements.l10n.schema.json"],
    ["Schema", "SpellEnhancements", "SpellEnhancements.univ.schema.json"],
    ["Schema", "SpellGroups", "SpellGroups.l10n.schema.json"],
    ["Schema", "Spells", "Spells.l10n.schema.json"],
    ["Schema", "Spells", "Spells.univ.schema.json"],
    ["Schema", "States", "States.l10n.schema.json"],
    ["Schema", "Subjects", "Subjects.l10n.schema.json"],
    ["Schema", "Tribes", "Tribes.l10n.schema.json"],
    ["Schema", "UI", "UI.l10n.schema.json"],
    ["Schema", "ZibiljaRituals", "ZibiljaRituals.l10n.schema.json"],
    ["Schema", "ZibiljaRituals", "ZibiljaRituals.univ.schema.json"],
    ["Schema", "SupportedLanguages.schema.json"],
  ];

  let schemeIdToPath = xs =>
    ["app", "Database"] @ xs |> ListH.Foldable.foldl1(Node.Path.join2);

  let getAllSchemes = () =>
    ListH.map(Json.parseOrRaise)
    <$> IO.Monad.mapM(x => x |> schemeIdToPath |> IO.readFile, heroSchemes);
};

let parseStaticData = locale => {
  Js.Console.timeStart(
    "parseStaticData",
    // let eschemes = handleE (getAllSchemes ())
    // if (isLeft (eschemes)) {
    //   console.log (fromLeft_ (eschemes))
    //   return Left ([ fromLeft_ (eschemes) ])
    // }
    // console.log ("Schemes loaded")
    // let schemes = fromRight_ (eschemes)
    // let validator = new Ajv ({ allErrors: true }) .addSchema (schemes)
    // let univ_parser = readYamlUniv (validator)
    // let l10n_parser = readYamlL10n (locale) (validator)
    // let estatic_data_by_file = await parseByFile (univ_parser)
    //                                               (l10n_parser)
    // if (isLeft (estatic_data_by_file)) {
    //   let errs = fromLeft_ (estatic_data_by_file)
    //   console.log (errs)
    //   return Left (
    //     Object.values (errs)
    //       .filter<Error[]> (Array.isArray)
    //       .flat (1)
    //   )
    // }
    // console.log ("Files parsed")
    // let static_data_by_file = fromRight_ (estatic_data_by_file)
    // let wiki = toWiki (locale) (static_data_by_file)
    // console.log ("Parsing static data done!")
    // console.timeEnd ("parseStaticData")
    // return wiki
  );
};
