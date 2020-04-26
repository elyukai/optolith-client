open IO.Monad;
open IO.Functor;

module Parser = {
  [@bs.module "yaml"] external parse: string => Js.Json.t = "parse";
};

type univYamlData = {
  advantages: Js.Json.t,
  animistForces: Js.Json.t,
  blessedTraditions: Js.Json.t,
  blessings: Js.Json.t,
  cantrips: Js.Json.t,
  combatTechniques: Js.Json.t,
  cultures: Js.Json.t,
  curses: Js.Json.t,
  disadvantages: Js.Json.t,
  dominationRituals: Js.Json.t,
  elvenMagicalSongs: Js.Json.t,
  items: Js.Json.t,
  equipmentPackages: Js.Json.t,
  experienceLevels: Js.Json.t,
  focusRules: Js.Json.t,
  geodeRituals: Js.Json.t,
  liturgicalChantEnhancements: Js.Json.t,
  liturgicalChants: Js.Json.t,
  magicalDances: Js.Json.t,
  magicalMelodies: Js.Json.t,
  magicalTraditions: Js.Json.t,
  patrons: Js.Json.t,
  professions: Js.Json.t,
  professionVariants: Js.Json.t,
  races: Js.Json.t,
  raceVariants: Js.Json.t,
  rogueSpells: Js.Json.t,
  skills: Js.Json.t,
  specialAbilities: Js.Json.t,
  spellEnhancements: Js.Json.t,
  spells: Js.Json.t,
  zibiljaRituals: Js.Json.t,
};

let readUnivYaml = name =>
  IO.readFile(
    Node.Path.join([|".", "app", "Database", "univ", name ++ ".yaml"|]),
  );

let getUnivStaticData = () =>
  Js.Promise.all6((
    readUnivYaml("Advantages"),
    readUnivYaml("AnimistForces"),
    readUnivYaml("BlessedTraditions"),
    readUnivYaml("Blessings"),
    readUnivYaml("Cantrips"),
    readUnivYaml("CombatTechniques"),
  ))
  >>= (
    (
      (
        advantages,
        animistForces,
        blessedTraditions,
        blessings,
        cantrips,
        combatTechniques,
      ),
    ) =>
      Js.Promise.all6((
        readUnivYaml("Cultures"),
        readUnivYaml("Curses"),
        readUnivYaml("Disadvantages"),
        readUnivYaml("DominationRituals"),
        readUnivYaml("ElvenMagicalSongs"),
        readUnivYaml("Equipment"),
      ))
      >>= (
        (
          (
            cultures,
            curses,
            disadvantages,
            dominationRituals,
            elvenMagicalSongs,
            items,
          ),
        ) =>
          Js.Promise.all6((
            readUnivYaml("EquipmentPackages"),
            readUnivYaml("ExperienceLevels"),
            readUnivYaml("FocusRules"),
            readUnivYaml("GeodeRituals"),
            readUnivYaml("LiturgicalChantEnhancements"),
            readUnivYaml("LiturgicalChants"),
          ))
          >>= (
            (
              (
                equipmentPackages,
                experienceLevels,
                focusRules,
                geodeRituals,
                liturgicalChantEnhancements,
                liturgicalChants,
              ),
            ) =>
              Js.Promise.all6((
                readUnivYaml("MagicalDances"),
                readUnivYaml("MagicalMelodies"),
                readUnivYaml("MagicalTraditions"),
                readUnivYaml("Professions"),
                readUnivYaml("ProfessionVariants"),
                readUnivYaml("Races"),
              ))
              >>= (
                (
                  (
                    magicalDances,
                    magicalMelodies,
                    magicalTraditions,
                    professions,
                    professionVariants,
                    races,
                  ),
                ) =>
                  Js.Promise.all6((
                    readUnivYaml("RaceVariants"),
                    readUnivYaml("RogueSpells"),
                    readUnivYaml("Skills"),
                    readUnivYaml("SpecialAbilities"),
                    readUnivYaml("SpellEnhancements"),
                    readUnivYaml("Spells"),
                  ))
                  >>= (
                    (
                      (
                        raceVariants,
                        rogueSpells,
                        skills,
                        specialAbilities,
                        spellEnhancements,
                        spells,
                      ),
                    ) =>
                      Js.Promise.all2((
                        readUnivYaml("ZibiljaRituals"),
                        readUnivYaml("Patrons"),
                      ))
                      <&> (
                        ((zibiljaRituals, patrons)) => {
                          advantages: advantages |> Parser.parse,
                          animistForces: animistForces |> Parser.parse,
                          blessedTraditions: blessedTraditions |> Parser.parse,
                          blessings: blessings |> Parser.parse,
                          cantrips: cantrips |> Parser.parse,
                          combatTechniques: combatTechniques |> Parser.parse,
                          cultures: cultures |> Parser.parse,
                          curses: curses |> Parser.parse,
                          disadvantages: disadvantages |> Parser.parse,
                          dominationRituals: dominationRituals |> Parser.parse,
                          elvenMagicalSongs: elvenMagicalSongs |> Parser.parse,
                          items: items |> Parser.parse,
                          equipmentPackages: equipmentPackages |> Parser.parse,
                          experienceLevels: experienceLevels |> Parser.parse,
                          focusRules: focusRules |> Parser.parse,
                          geodeRituals: geodeRituals |> Parser.parse,
                          liturgicalChantEnhancements:
                            liturgicalChantEnhancements |> Parser.parse,
                          liturgicalChants: liturgicalChants |> Parser.parse,
                          magicalDances: magicalDances |> Parser.parse,
                          magicalMelodies: magicalMelodies |> Parser.parse,
                          magicalTraditions: magicalTraditions |> Parser.parse,
                          patrons: patrons |> Parser.parse,
                          professions: professions |> Parser.parse,
                          professionVariants:
                            professionVariants |> Parser.parse,
                          races: races |> Parser.parse,
                          raceVariants: raceVariants |> Parser.parse,
                          rogueSpells: rogueSpells |> Parser.parse,
                          skills: skills |> Parser.parse,
                          specialAbilities: specialAbilities |> Parser.parse,
                          spellEnhancements: spellEnhancements |> Parser.parse,
                          spells: spells |> Parser.parse,
                          zibiljaRituals: zibiljaRituals |> Parser.parse,
                        }
                      )
                  )
              )
          )
      )
  );

type l10nYamlData = {
  advantages: Js.Json.t,
  animistForces: Js.Json.t,
  arcaneBardTraditions: Js.Json.t,
  arcaneDancerTraditions: Js.Json.t,
  armorTypes: Js.Json.t,
  aspects: Js.Json.t,
  attributes: Js.Json.t,
  blessedTraditions: Js.Json.t,
  blessings: Js.Json.t,
  books: Js.Json.t,
  brews: Js.Json.t,
  cantrips: Js.Json.t,
  combatSpecialAbilityGroups: Js.Json.t,
  combatTechniqueGroups: Js.Json.t,
  combatTechniques: Js.Json.t,
  conditions: Js.Json.t,
  cultures: Js.Json.t,
  curses: Js.Json.t,
  derivedCharacteristics: Js.Json.t,
  disadvantages: Js.Json.t,
  dominationRituals: Js.Json.t,
  elvenMagicalSongs: Js.Json.t,
  equipmentGroups: Js.Json.t,
  equipmentPackages: Js.Json.t,
  experienceLevels: Js.Json.t,
  eyeColors: Js.Json.t,
  focusRules: Js.Json.t,
  geodeRituals: Js.Json.t,
  hairColors: Js.Json.t,
  items: Js.Json.t,
  liturgicalChantEnhancements: Js.Json.t,
  liturgicalChantGroups: Js.Json.t,
  liturgicalChants: Js.Json.t,
  magicalDances: Js.Json.t,
  magicalMelodies: Js.Json.t,
  magicalTraditions: Js.Json.t,
  optionalRules: Js.Json.t,
  pacts: Js.Json.t,
  patrons: Js.Json.t,
  professions: Js.Json.t,
  professionVariants: Js.Json.t,
  properties: Js.Json.t,
  races: Js.Json.t,
  raceVariants: Js.Json.t,
  reaches: Js.Json.t,
  rogueSpells: Js.Json.t,
  skillGroups: Js.Json.t,
  skills: Js.Json.t,
  socialStatuses: Js.Json.t,
  specialAbilities: Js.Json.t,
  specialAbilityGroups: Js.Json.t,
  spellEnhancements: Js.Json.t,
  spellGroups: Js.Json.t,
  spells: Js.Json.t,
  states: Js.Json.t,
  subjects: Js.Json.t,
  tribes: Js.Json.t,
  ui: Js.Json.t,
  zibiljaRituals: Js.Json.t,
};

let readL10nYaml = (locale, name) =>
  IO.readFile(
    Node.Path.join([|".", "app", "Database", locale, name ++ ".yaml"|]),
  );

let getLocaleSpecificStaticData = locale =>
  Js.Promise.all6((
    readL10nYaml(locale, "Advantages"),
    readL10nYaml(locale, "AnimistForces"),
    readL10nYaml(locale, "ArcaneBardTraditions"),
    readL10nYaml(locale, "ArcaneDancerTraditions"),
    readL10nYaml(locale, "ArmorTypes"),
    readL10nYaml(locale, "Aspects"),
  ))
  >>= (
    (
      (
        advantages,
        animistForces,
        arcaneBardTraditions,
        arcaneDancerTraditions,
        armorTypes,
        aspects,
      ),
    ) =>
      Js.Promise.all6((
        readL10nYaml(locale, "Attributes"),
        readL10nYaml(locale, "BlessedTraditions"),
        readL10nYaml(locale, "Blessings"),
        readL10nYaml(locale, "Books"),
        readL10nYaml(locale, "Brews"),
        readL10nYaml(locale, "Cantrips"),
      ))
      >>= (
        ((attributes, blessedTraditions, blessings, books, brews, cantrips)) =>
          Js.Promise.all6((
            readL10nYaml(locale, "CombatSpecialAbilityGroups"),
            readL10nYaml(locale, "CombatTechniqueGroups"),
            readL10nYaml(locale, "CombatTechniques"),
            readL10nYaml(locale, "Conditions"),
            readL10nYaml(locale, "Cultures"),
            readL10nYaml(locale, "Curses"),
          ))
          >>= (
            (
              (
                combatSpecialAbilityGroups,
                combatTechniqueGroups,
                combatTechniques,
                conditions,
                cultures,
                curses,
              ),
            ) =>
              Js.Promise.all6((
                readL10nYaml(locale, "DerivedCharacteristics"),
                readL10nYaml(locale, "Disadvantages"),
                readL10nYaml(locale, "DominationRituals"),
                readL10nYaml(locale, "ElvenMagicalSongs"),
                readL10nYaml(locale, "Equipment"),
                readL10nYaml(locale, "EquipmentGroups"),
              ))
              >>= (
                (
                  (
                    derivedCharacteristics,
                    disadvantages,
                    dominationRituals,
                    elvenMagicalSongs,
                    items,
                    equipmentGroups,
                  ),
                ) =>
                  Js.Promise.all6((
                    readL10nYaml(locale, "EquipmentPackages"),
                    readL10nYaml(locale, "ExperienceLevels"),
                    readL10nYaml(locale, "EyeColors"),
                    readL10nYaml(locale, "FocusRules"),
                    readL10nYaml(locale, "GeodeRituals"),
                    readL10nYaml(locale, "HairColors"),
                  ))
                  >>= (
                    (
                      (
                        equipmentPackages,
                        experienceLevels,
                        eyeColors,
                        focusRules,
                        geodeRituals,
                        hairColors,
                      ),
                    ) =>
                      Js.Promise.all6((
                        readL10nYaml(locale, "LiturgicalChantEnhancements"),
                        readL10nYaml(locale, "LiturgicalChantGroups"),
                        readL10nYaml(locale, "LiturgicalChants"),
                        readL10nYaml(locale, "MagicalDances"),
                        readL10nYaml(locale, "MagicalMelodies"),
                        readL10nYaml(locale, "MagicalTraditions"),
                      ))
                      >>= (
                        (
                          (
                            liturgicalChantEnhancements,
                            liturgicalChantGroups,
                            liturgicalChants,
                            magicalDances,
                            magicalMelodies,
                            magicalTraditions,
                          ),
                        ) =>
                          Js.Promise.all6((
                            readL10nYaml(locale, "OptionalRules"),
                            readL10nYaml(locale, "Pacts"),
                            readL10nYaml(locale, "Professions"),
                            readL10nYaml(locale, "ProfessionVariants"),
                            readL10nYaml(locale, "Properties"),
                            readL10nYaml(locale, "Races"),
                          ))
                          >>= (
                            (
                              (
                                optionalRules,
                                pacts,
                                professions,
                                professionVariants,
                                properties,
                                races,
                              ),
                            ) =>
                              Js.Promise.all6((
                                readL10nYaml(locale, "RaceVariants"),
                                readL10nYaml(locale, "Reaches"),
                                readL10nYaml(locale, "RogueSpells"),
                                readL10nYaml(locale, "SkillGroups"),
                                readL10nYaml(locale, "Skills"),
                                readL10nYaml(locale, "SocialStatuses"),
                              ))
                              >>= (
                                (
                                  (
                                    raceVariants,
                                    reaches,
                                    rogueSpells,
                                    skillGroups,
                                    skills,
                                    socialStatuses,
                                  ),
                                ) =>
                                  Js.Promise.all6((
                                    readL10nYaml(locale, "SpecialAbilities"),
                                    readL10nYaml(
                                      locale,
                                      "SpecialAbilityGroups",
                                    ),
                                    readL10nYaml(locale, "SpellEnhancements"),
                                    readL10nYaml(locale, "SpellGroups"),
                                    readL10nYaml(locale, "Spells"),
                                    readL10nYaml(locale, "States"),
                                  ))
                                  >>= (
                                    (
                                      (
                                        specialAbilities,
                                        specialAbilityGroups,
                                        spellEnhancements,
                                        spellGroups,
                                        spells,
                                        states,
                                      ),
                                    ) =>
                                      Js.Promise.all5((
                                        readL10nYaml(locale, "Subjects"),
                                        readL10nYaml(locale, "Tribes"),
                                        readL10nYaml(locale, "UI"),
                                        readL10nYaml(
                                          locale,
                                          "ZibiljaRituals",
                                        ),
                                        readL10nYaml(locale, "Patrons"),
                                      ))
                                      <&> (
                                        (
                                          (
                                            subjects,
                                            tribes,
                                            ui,
                                            zibiljaRituals,
                                            patrons,
                                          ),
                                        ) => {
                                          advantages:
                                            advantages |> Parser.parse,
                                          animistForces:
                                            animistForces |> Parser.parse,
                                          arcaneBardTraditions:
                                            arcaneBardTraditions
                                            |> Parser.parse,
                                          arcaneDancerTraditions:
                                            arcaneDancerTraditions
                                            |> Parser.parse,
                                          armorTypes:
                                            armorTypes |> Parser.parse,
                                          aspects: aspects |> Parser.parse,
                                          attributes:
                                            attributes |> Parser.parse,
                                          blessedTraditions:
                                            blessedTraditions |> Parser.parse,
                                          blessings: blessings |> Parser.parse,
                                          books: books |> Parser.parse,
                                          brews: brews |> Parser.parse,
                                          cantrips: cantrips |> Parser.parse,
                                          combatSpecialAbilityGroups:
                                            combatSpecialAbilityGroups
                                            |> Parser.parse,
                                          combatTechniqueGroups:
                                            combatTechniqueGroups
                                            |> Parser.parse,
                                          combatTechniques:
                                            combatTechniques |> Parser.parse,
                                          conditions:
                                            conditions |> Parser.parse,
                                          cultures: cultures |> Parser.parse,
                                          curses: curses |> Parser.parse,
                                          derivedCharacteristics:
                                            derivedCharacteristics
                                            |> Parser.parse,
                                          disadvantages:
                                            disadvantages |> Parser.parse,
                                          dominationRituals:
                                            dominationRituals |> Parser.parse,
                                          elvenMagicalSongs:
                                            elvenMagicalSongs |> Parser.parse,
                                          equipmentGroups:
                                            equipmentGroups |> Parser.parse,
                                          equipmentPackages:
                                            equipmentPackages |> Parser.parse,
                                          experienceLevels:
                                            experienceLevels |> Parser.parse,
                                          eyeColors: eyeColors |> Parser.parse,
                                          focusRules:
                                            focusRules |> Parser.parse,
                                          geodeRituals:
                                            geodeRituals |> Parser.parse,
                                          hairColors:
                                            hairColors |> Parser.parse,
                                          items: items |> Parser.parse,
                                          liturgicalChantEnhancements:
                                            liturgicalChantEnhancements
                                            |> Parser.parse,
                                          liturgicalChantGroups:
                                            liturgicalChantGroups
                                            |> Parser.parse,
                                          liturgicalChants:
                                            liturgicalChants |> Parser.parse,
                                          magicalDances:
                                            magicalDances |> Parser.parse,
                                          magicalMelodies:
                                            magicalMelodies |> Parser.parse,
                                          magicalTraditions:
                                            magicalTraditions |> Parser.parse,
                                          optionalRules:
                                            optionalRules |> Parser.parse,
                                          pacts: pacts |> Parser.parse,
                                          patrons: patrons |> Parser.parse,
                                          professions:
                                            professions |> Parser.parse,
                                          professionVariants:
                                            professionVariants |> Parser.parse,
                                          properties:
                                            properties |> Parser.parse,
                                          races: races |> Parser.parse,
                                          raceVariants:
                                            raceVariants |> Parser.parse,
                                          reaches: reaches |> Parser.parse,
                                          rogueSpells:
                                            rogueSpells |> Parser.parse,
                                          skillGroups:
                                            skillGroups |> Parser.parse,
                                          skills: skills |> Parser.parse,
                                          socialStatuses:
                                            socialStatuses |> Parser.parse,
                                          specialAbilities:
                                            specialAbilities |> Parser.parse,
                                          specialAbilityGroups:
                                            specialAbilityGroups
                                            |> Parser.parse,
                                          spellEnhancements:
                                            spellEnhancements |> Parser.parse,
                                          spellGroups:
                                            spellGroups |> Parser.parse,
                                          spells: spells |> Parser.parse,
                                          states: states |> Parser.parse,
                                          subjects: subjects |> Parser.parse,
                                          tribes: tribes |> Parser.parse,
                                          ui: ui |> Parser.parse,
                                          zibiljaRituals:
                                            zibiljaRituals |> Parser.parse,
                                        }
                                      )
                                  )
                              )
                          )
                      )
                  )
              )
          )
      )
  );

type yamlData = {
  advantagesL10n: Js.Json.t,
  advantagesUniv: Js.Json.t,
  animistForcesL10n: Js.Json.t,
  animistForcesUniv: Js.Json.t,
  arcaneBardTraditionsL10n: Js.Json.t,
  arcaneDancerTraditionsL10n: Js.Json.t,
  armorTypesL10n: Js.Json.t,
  aspectsL10n: Js.Json.t,
  attributesL10n: Js.Json.t,
  blessedTraditionsL10n: Js.Json.t,
  blessedTraditionsUniv: Js.Json.t,
  blessingsL10n: Js.Json.t,
  blessingsUniv: Js.Json.t,
  booksL10n: Js.Json.t,
  brewsL10n: Js.Json.t,
  cantripsL10n: Js.Json.t,
  cantripsUniv: Js.Json.t,
  combatSpecialAbilityGroupsL10n: Js.Json.t,
  combatTechniqueGroupsL10n: Js.Json.t,
  combatTechniquesL10n: Js.Json.t,
  combatTechniquesUniv: Js.Json.t,
  conditionsL10n: Js.Json.t,
  culturesL10n: Js.Json.t,
  culturesUniv: Js.Json.t,
  cursesL10n: Js.Json.t,
  cursesUniv: Js.Json.t,
  derivedCharacteristicsL10n: Js.Json.t,
  disadvantagesL10n: Js.Json.t,
  disadvantagesUniv: Js.Json.t,
  dominationRitualsL10n: Js.Json.t,
  dominationRitualsUniv: Js.Json.t,
  elvenMagicalSongsL10n: Js.Json.t,
  elvenMagicalSongsUniv: Js.Json.t,
  equipmentL10n: Js.Json.t,
  equipmentUniv: Js.Json.t,
  equipmentGroupsL10n: Js.Json.t,
  equipmentPackagesL10n: Js.Json.t,
  equipmentPackagesUniv: Js.Json.t,
  experienceLevelsL10n: Js.Json.t,
  experienceLevelsUniv: Js.Json.t,
  eyeColorsL10n: Js.Json.t,
  focusRulesL10n: Js.Json.t,
  focusRulesUniv: Js.Json.t,
  geodeRitualsL10n: Js.Json.t,
  geodeRitualsUniv: Js.Json.t,
  hairColorsL10n: Js.Json.t,
  liturgicalChantEnhancementsL10n: Js.Json.t,
  liturgicalChantEnhancementsUniv: Js.Json.t,
  liturgicalChantGroupsL10n: Js.Json.t,
  liturgicalChantsL10n: Js.Json.t,
  liturgicalChantsUniv: Js.Json.t,
  magicalDancesL10n: Js.Json.t,
  magicalDancesUniv: Js.Json.t,
  magicalMelodiesL10n: Js.Json.t,
  magicalMelodiesUniv: Js.Json.t,
  magicalTraditionsL10n: Js.Json.t,
  magicalTraditionsUniv: Js.Json.t,
  optionalRulesL10n: Js.Json.t,
  pactsL10n: Js.Json.t,
  patronsL10n: Js.Json.t,
  patronsUniv: Js.Json.t,
  professionsL10n: Js.Json.t,
  professionsUniv: Js.Json.t,
  professionVariantsL10n: Js.Json.t,
  professionVariantsUniv: Js.Json.t,
  propertiesL10n: Js.Json.t,
  racesL10n: Js.Json.t,
  racesUniv: Js.Json.t,
  raceVariantsL10n: Js.Json.t,
  raceVariantsUniv: Js.Json.t,
  reachesL10n: Js.Json.t,
  rogueSpellsL10n: Js.Json.t,
  rogueSpellsUniv: Js.Json.t,
  skillGroupsL10n: Js.Json.t,
  skillsL10n: Js.Json.t,
  skillsUniv: Js.Json.t,
  socialStatusesL10n: Js.Json.t,
  specialAbilitiesL10n: Js.Json.t,
  specialAbilitiesUniv: Js.Json.t,
  specialAbilityGroupsL10n: Js.Json.t,
  spellEnhancementsL10n: Js.Json.t,
  spellEnhancementsUniv: Js.Json.t,
  spellGroupsL10n: Js.Json.t,
  spellsL10n: Js.Json.t,
  spellsUniv: Js.Json.t,
  statesL10n: Js.Json.t,
  subjectsL10n: Js.Json.t,
  tribesL10n: Js.Json.t,
  uiL10n: Js.Json.t,
  zibiljaRitualsL10n: Js.Json.t,
  zibiljaRitualsUniv: Js.Json.t,
};

let getStaticData = locale =>
  Js.Promise.all2((getUnivStaticData(), getLocaleSpecificStaticData(locale)))
  <&> (
    ((univ, l10n)) => {
      advantagesL10n: l10n.advantages,
      advantagesUniv: univ.advantages,
      animistForcesL10n: l10n.animistForces,
      animistForcesUniv: univ.animistForces,
      arcaneBardTraditionsL10n: l10n.arcaneBardTraditions,
      arcaneDancerTraditionsL10n: l10n.arcaneDancerTraditions,
      armorTypesL10n: l10n.armorTypes,
      aspectsL10n: l10n.aspects,
      attributesL10n: l10n.attributes,
      blessedTraditionsL10n: l10n.blessedTraditions,
      blessedTraditionsUniv: univ.blessedTraditions,
      blessingsL10n: l10n.blessings,
      blessingsUniv: univ.blessings,
      booksL10n: l10n.books,
      brewsL10n: l10n.brews,
      cantripsL10n: l10n.cantrips,
      cantripsUniv: univ.cantrips,
      combatSpecialAbilityGroupsL10n: l10n.combatSpecialAbilityGroups,
      combatTechniqueGroupsL10n: l10n.combatTechniqueGroups,
      combatTechniquesL10n: l10n.combatTechniques,
      combatTechniquesUniv: univ.combatTechniques,
      conditionsL10n: l10n.conditions,
      culturesL10n: l10n.cultures,
      culturesUniv: univ.cultures,
      cursesL10n: l10n.curses,
      cursesUniv: univ.curses,
      derivedCharacteristicsL10n: l10n.derivedCharacteristics,
      disadvantagesL10n: l10n.disadvantages,
      disadvantagesUniv: univ.disadvantages,
      dominationRitualsL10n: l10n.dominationRituals,
      dominationRitualsUniv: univ.dominationRituals,
      elvenMagicalSongsL10n: l10n.elvenMagicalSongs,
      elvenMagicalSongsUniv: univ.elvenMagicalSongs,
      equipmentL10n: l10n.items,
      equipmentUniv: univ.items,
      equipmentGroupsL10n: l10n.equipmentGroups,
      equipmentPackagesL10n: l10n.equipmentPackages,
      equipmentPackagesUniv: univ.equipmentPackages,
      experienceLevelsL10n: l10n.experienceLevels,
      experienceLevelsUniv: univ.experienceLevels,
      eyeColorsL10n: l10n.eyeColors,
      focusRulesL10n: l10n.focusRules,
      focusRulesUniv: univ.focusRules,
      geodeRitualsL10n: l10n.geodeRituals,
      geodeRitualsUniv: univ.geodeRituals,
      hairColorsL10n: l10n.hairColors,
      liturgicalChantEnhancementsL10n: l10n.liturgicalChantEnhancements,
      liturgicalChantEnhancementsUniv: univ.liturgicalChantEnhancements,
      liturgicalChantGroupsL10n: l10n.liturgicalChantGroups,
      liturgicalChantsL10n: l10n.liturgicalChants,
      liturgicalChantsUniv: univ.liturgicalChants,
      magicalDancesL10n: l10n.magicalDances,
      magicalDancesUniv: univ.magicalDances,
      magicalMelodiesL10n: l10n.magicalMelodies,
      magicalMelodiesUniv: univ.magicalMelodies,
      magicalTraditionsL10n: l10n.magicalTraditions,
      magicalTraditionsUniv: univ.magicalTraditions,
      optionalRulesL10n: l10n.optionalRules,
      pactsL10n: l10n.pacts,
      patronsL10n: l10n.patrons,
      patronsUniv: univ.patrons,
      professionsL10n: l10n.professions,
      professionsUniv: univ.professions,
      professionVariantsL10n: l10n.professionVariants,
      professionVariantsUniv: univ.professionVariants,
      propertiesL10n: l10n.properties,
      racesL10n: l10n.races,
      racesUniv: univ.races,
      raceVariantsL10n: l10n.raceVariants,
      raceVariantsUniv: univ.raceVariants,
      reachesL10n: l10n.reaches,
      rogueSpellsL10n: l10n.rogueSpells,
      rogueSpellsUniv: univ.rogueSpells,
      skillGroupsL10n: l10n.skillGroups,
      skillsL10n: l10n.skills,
      skillsUniv: univ.skills,
      socialStatusesL10n: l10n.socialStatuses,
      specialAbilitiesL10n: l10n.specialAbilities,
      specialAbilitiesUniv: univ.specialAbilities,
      specialAbilityGroupsL10n: l10n.specialAbilityGroups,
      spellEnhancementsL10n: l10n.spellEnhancements,
      spellEnhancementsUniv: univ.spellEnhancements,
      spellGroupsL10n: l10n.spellGroups,
      spellsL10n: l10n.spells,
      spellsUniv: univ.spells,
      statesL10n: l10n.states,
      subjectsL10n: l10n.subjects,
      tribesL10n: l10n.tribes,
      uiL10n: l10n.ui,
      zibiljaRitualsL10n: l10n.zibiljaRituals,
      zibiljaRitualsUniv: univ.zibiljaRituals,
    }
  );
