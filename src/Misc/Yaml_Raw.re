open IO.Infix;

module Parser = {
  [@bs.module "yaml"] external parse: string => Js.Json.t = "parse";
};

type t = {
  advantages: list(Js.Json.t),
  animistForces: list(Js.Json.t),
  arcaneBardTraditions: list(Js.Json.t),
  arcaneDancerTraditions: list(Js.Json.t),
  armorTypes: list(Js.Json.t),
  aspects: list(Js.Json.t),
  attributes: list(Js.Json.t),
  blessedTraditions: list(Js.Json.t),
  blessings: list(Js.Json.t),
  brews: list(Js.Json.t),
  cantrips: list(Js.Json.t),
  combatSpecialAbilityGroups: list(Js.Json.t),
  combatTechniqueGroups: list(Js.Json.t),
  combatTechniques: list(Js.Json.t),
  conditions: list(Js.Json.t),
  cultures: list(Js.Json.t),
  curses: list(Js.Json.t),
  derivedCharacteristics: list(Js.Json.t),
  disadvantages: list(Js.Json.t),
  dominationRituals: list(Js.Json.t),
  elvenMagicalSongs: list(Js.Json.t),
  items: list(Js.Json.t),
  equipmentGroups: list(Js.Json.t),
  equipmentPackages: list(Js.Json.t),
  experienceLevels: list(Js.Json.t),
  eyeColors: list(Js.Json.t),
  focusRules: list(Js.Json.t),
  geodeRituals: list(Js.Json.t),
  hairColors: list(Js.Json.t),
  liturgicalChantGroups: list(Js.Json.t),
  liturgicalChants: list(Js.Json.t),
  magicalDances: list(Js.Json.t),
  magicalMelodies: list(Js.Json.t),
  magicalTraditions: list(Js.Json.t),
  optionalRules: list(Js.Json.t),
  pacts: list(Js.Json.t),
  professions: list(Js.Json.t),
  properties: list(Js.Json.t),
  publications: list(Js.Json.t),
  races: list(Js.Json.t),
  reaches: list(Js.Json.t),
  rogueSpells: list(Js.Json.t),
  skillGroups: list(Js.Json.t),
  skills: list(Js.Json.t),
  socialStatuses: list(Js.Json.t),
  specialAbilities: list(Js.Json.t),
  specialAbilityGroups: list(Js.Json.t),
  spellGroups: list(Js.Json.t),
  spells: list(Js.Json.t),
  states: list(Js.Json.t),
  subjects: list(Js.Json.t),
  tribes: list(Js.Json.t),
  zibiljaRituals: list(Js.Json.t),
};

let parseFilesOfEntryType = (~dir) =>
  Node.Path.join([|".", "src", "Database", dir|])
  |> Directory.getDirectoryContents
  |> IO.mapM(x => x |> IO.readFile <&> Parser.parse);

let parseFiles1 = (~onProgress, ~progressStartNum, dir) =>
  parseFilesOfEntryType(~dir)
  <&> (
    x => {
      onProgress(progressStartNum + 1);
      x;
    }
  );

let parseFiles2 = (~onProgress, ~progressStartNum, (dir1, dir2)) =>
  parseFiles1(~onProgress, ~progressStartNum, dir1)
  >>= (
    res1 =>
      parseFiles1(~onProgress, ~progressStartNum=progressStartNum + 1, dir2)
      <&> (res2 => (res1, res2))
  );

let parseFiles4 = (~onProgress, ~progressStartNum, (dir1, dir2, dir3, dir4)) =>
  parseFiles2(~onProgress, ~progressStartNum, (dir1, dir2))
  >>= (
    ((res1, res2)) =>
      parseFiles2(
        ~onProgress,
        ~progressStartNum=progressStartNum + 2,
        (dir3, dir4),
      )
      <&> (((res3, res4)) => (res1, res2, res3, res4))
  );

let parseFiles8 =
    (
      ~onProgress,
      ~progressStartNum,
      (dir1, dir2, dir3, dir4, dir5, dir6, dir7, dir8),
    ) =>
  parseFiles4(~onProgress, ~progressStartNum, (dir1, dir2, dir3, dir4))
  >>= (
    ((res1, res2, res3, res4)) =>
      parseFiles4(
        ~onProgress,
        ~progressStartNum=progressStartNum + 4,
        (dir5, dir6, dir7, dir8),
      )
      <&> (
        ((res5, res6, res7, res8)) => (
          res1,
          res2,
          res3,
          res4,
          res5,
          res6,
          res7,
          res8,
        )
      )
  );

let parseFiles16 =
    (
      ~onProgress,
      ~progressStartNum,
      (
        dir1,
        dir2,
        dir3,
        dir4,
        dir5,
        dir6,
        dir7,
        dir8,
        dir9,
        dir10,
        dir11,
        dir12,
        dir13,
        dir14,
        dir15,
        dir16,
      ),
    ) =>
  parseFiles8(
    ~onProgress,
    ~progressStartNum,
    (dir1, dir2, dir3, dir4, dir5, dir6, dir7, dir8),
  )
  >>= (
    ((res1, res2, res3, res4, res5, res6, res7, res8)) =>
      parseFiles8(
        ~onProgress,
        ~progressStartNum=progressStartNum + 8,
        (dir9, dir10, dir11, dir12, dir13, dir14, dir15, dir16),
      )
      <&> (
        ((res9, res10, res11, res12, res13, res14, res15, res16)) => (
          res1,
          res2,
          res3,
          res4,
          res5,
          res6,
          res7,
          res8,
          res9,
          res10,
          res11,
          res12,
          res13,
          res14,
          res15,
          res16,
        )
      )
  );

let parsedEntryTypesTotal = 53;

let parseFiles = (~onProgress) =>
  parseFiles16(
    ~onProgress,
    ~progressStartNum=0,
    (
      "Advantages",
      "AnimistForces",
      "ArcaneBardTraditions",
      "ArcaneDancerTraditions",
      "ArmorTypes",
      "Aspects",
      "Attributes",
      "BlessedTraditions",
      "Blessings",
      "Brews",
      "Cantrips",
      "CombatSpecialAbilityGroups",
      "CombatTechniqueGroups",
      "CombatTechniques",
      "Conditions",
      "Cultures",
    ),
  )
  >>= (
    (
      (
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
      ),
    ) =>
      parseFiles16(
        ~onProgress,
        ~progressStartNum=16,
        (
          "Curses",
          "DerivedCharacteristics",
          "Disadvantages",
          "DominationRituals",
          "ElvenMagicalSongs",
          "Items",
          "EquipmentGroups",
          "EquipmentPackages",
          "ExperienceLevels",
          "EyeColors",
          "FocusRules",
          "GeodeRituals",
          "HairColors",
          "LiturgicalChantGroups",
          "LiturgicalChants",
          "MagicalDances",
        ),
      )
      >>= (
        (
          (
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
            liturgicalChantGroups,
            liturgicalChants,
            magicalDances,
          ),
        ) =>
          parseFiles16(
            ~onProgress,
            ~progressStartNum=32,
            (
              "MagicalMelodies",
              "MagicalTraditions",
              "OptionalRules",
              "Pacts",
              "Professions",
              "Properties",
              "Publications",
              "Races",
              "Reaches",
              "RogueSpells",
              "SkillGroups",
              "Skills",
              "SocialStatuses",
              "SpecialAbilities",
              "SpecialAbilityGroups",
              "SpellGroups",
            ),
          )
          >>= (
            (
              (
                magicalMelodies,
                magicalTraditions,
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
                spellGroups,
              ),
            ) =>
              parseFiles4(
                ~onProgress,
                ~progressStartNum=48,
                ("Spells", "States", "Subjects", "Tribes"),
              )
              >>= (
                ((spells, states, subjects, tribes)) =>
                  parseFiles1(
                    ~onProgress,
                    ~progressStartNum=52,
                    "ZibiljaRituals",
                  )
                  <&> (
                    zibiljaRituals => {
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
                      liturgicalChantGroups,
                      liturgicalChants,
                      magicalDances,
                      magicalMelodies,
                      magicalTraditions,
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
                      spellGroups,
                      spells,
                      states,
                      subjects,
                      tribes,
                      zibiljaRituals,
                    }
                  )
              )
          )
      )
  );

let parseUI = locale =>
  Node.Path.join([|".", "src", "Database", "UI", locale ++ ".yml"|])
  |> IO.readFile
  <&> Parser.parse;
