/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { MapEitherIO, mapMObjectIO } from "./MapEitherIOObject"
import { YamlParser } from "./Parser"
import { YamlNameMap } from "./SchemaMap"

export const parseByFile =
  (univParser : YamlParser) =>
  (defaultParser : YamlParser) =>
  async (l10nParser : (YamlParser | undefined)) : MapEitherIO<Error[], YamlNameMap> =>
    mapMObjectIO ({
      AdvantagesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Advantages/Advantages.l10n.schema.json") : undefined,
      AdvantagesL10nDefault:
        defaultParser ("Schema/Advantages/Advantages.l10n.schema.json"),
      AdvantagesUniv:
        univParser ("Schema/Advantages/Advantages.univ.schema.json"),
      AnimistForcesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/AnimistForces/AnimistForces.l10n.schema.json") : undefined,
      AnimistForcesL10nDefault:
        defaultParser ("Schema/AnimistForces/AnimistForces.l10n.schema.json"),
      AnimistForcesUniv:
        univParser ("Schema/AnimistForces/AnimistForces.univ.schema.json"),
      ArcaneBardTraditionsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/ArcaneBardTraditions/ArcaneBardTraditions.l10n.schema.json") : undefined,
      ArcaneBardTraditionsL10nDefault:
        defaultParser ("Schema/ArcaneBardTraditions/ArcaneBardTraditions.l10n.schema.json"),
      ArcaneDancerTraditionsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/ArcaneDancerTraditions/ArcaneDancerTraditions.l10n.schema.json") : undefined,
      ArcaneDancerTraditionsL10nDefault:
        defaultParser ("Schema/ArcaneDancerTraditions/ArcaneDancerTraditions.l10n.schema.json"),
      ArmorTypesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/ArmorTypes/ArmorTypes.l10n.schema.json") : undefined,
      ArmorTypesL10nDefault:
        defaultParser ("Schema/ArmorTypes/ArmorTypes.l10n.schema.json"),
      AspectsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Aspects/Aspects.l10n.schema.json") : undefined,
      AspectsL10nDefault:
        defaultParser ("Schema/Aspects/Aspects.l10n.schema.json"),
      AttributesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Attributes/Attributes.l10n.schema.json") : undefined,
      AttributesL10nDefault:
        defaultParser ("Schema/Attributes/Attributes.l10n.schema.json"),
      BlessedTraditionsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/BlessedTraditions/BlessedTraditions.l10n.schema.json") : undefined,
      BlessedTraditionsL10nDefault:
        defaultParser ("Schema/BlessedTraditions/BlessedTraditions.l10n.schema.json"),
      BlessedTraditionsUniv:
        univParser ("Schema/BlessedTraditions/BlessedTraditions.univ.schema.json"),
      BlessingsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Blessings/Blessings.l10n.schema.json") : undefined,
      BlessingsL10nDefault:
        defaultParser ("Schema/Blessings/Blessings.l10n.schema.json"),
      BlessingsUniv:
        univParser ("Schema/Blessings/Blessings.univ.schema.json"),
      BooksL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Books/Books.l10n.schema.json") : undefined,
      BooksL10nDefault:
        defaultParser ("Schema/Books/Books.l10n.schema.json"),
      BrewsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Brews/Brews.l10n.schema.json") : undefined,
      BrewsL10nDefault:
        defaultParser ("Schema/Brews/Brews.l10n.schema.json"),
      CantripsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Cantrips/Cantrips.l10n.schema.json") : undefined,
      CantripsL10nDefault:
        defaultParser ("Schema/Cantrips/Cantrips.l10n.schema.json"),
      CantripsUniv:
        univParser ("Schema/Cantrips/Cantrips.univ.schema.json"),
      CombatSpecialAbilityGroupsL10nOverride:
        // eslint-disable-next-line max-len
        (l10nParser != undefined) ? l10nParser ("Schema/CombatSpecialAbilityGroups/CombatSpecialAbilityGroups.l10n.schema.json") : undefined,
      CombatSpecialAbilityGroupsL10nDefault:
        // eslint-disable-next-line max-len
        defaultParser ("Schema/CombatSpecialAbilityGroups/CombatSpecialAbilityGroups.l10n.schema.json"),
      CombatTechniqueGroupsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/CombatTechniqueGroups/CombatTechniqueGroups.l10n.schema.json") : undefined,
      CombatTechniqueGroupsL10nDefault:
        defaultParser ("Schema/CombatTechniqueGroups/CombatTechniqueGroups.l10n.schema.json"),
      CombatTechniquesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/CombatTechniques/CombatTechniques.l10n.schema.json") : undefined,
      CombatTechniquesL10nDefault:
        defaultParser ("Schema/CombatTechniques/CombatTechniques.l10n.schema.json"),
      CombatTechniquesUniv:
        univParser ("Schema/CombatTechniques/CombatTechniques.univ.schema.json"),
      ConditionsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Conditions/Conditions.l10n.schema.json") : undefined,
      ConditionsL10nDefault:
        defaultParser ("Schema/Conditions/Conditions.l10n.schema.json"),
      CulturesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Cultures/Cultures.l10n.schema.json") : undefined,
      CulturesL10nDefault:
        defaultParser ("Schema/Cultures/Cultures.l10n.schema.json"),
      CulturesUniv:
        univParser ("Schema/Cultures/Cultures.univ.schema.json"),
      CursesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Curses/Curses.l10n.schema.json") : undefined,
      CursesL10nDefault:
        defaultParser ("Schema/Curses/Curses.l10n.schema.json"),
      CursesUniv:
        univParser ("Schema/Curses/Curses.univ.schema.json"),
      DerivedCharacteristicsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/DerivedCharacteristics/DerivedCharacteristics.l10n.schema.json") : undefined,
      DerivedCharacteristicsL10nDefault:
        defaultParser ("Schema/DerivedCharacteristics/DerivedCharacteristics.l10n.schema.json"),
      DisadvantagesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Disadvantages/Disadvantages.l10n.schema.json") : undefined,
      DisadvantagesL10nDefault:
        defaultParser ("Schema/Disadvantages/Disadvantages.l10n.schema.json"),
      DisadvantagesUniv:
        univParser ("Schema/Disadvantages/Disadvantages.univ.schema.json"),
      DominationRitualsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/DominationRituals/DominationRituals.l10n.schema.json") : undefined,
      DominationRitualsL10nDefault:
        defaultParser ("Schema/DominationRituals/DominationRituals.l10n.schema.json"),
      DominationRitualsUniv:
        univParser ("Schema/DominationRituals/DominationRituals.univ.schema.json"),
      ElvenMagicalSongsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/ElvenMagicalSongs/ElvenMagicalSongs.l10n.schema.json") : undefined,
      ElvenMagicalSongsL10nDefault:
        defaultParser ("Schema/ElvenMagicalSongs/ElvenMagicalSongs.l10n.schema.json"),
      ElvenMagicalSongsUniv:
        univParser ("Schema/ElvenMagicalSongs/ElvenMagicalSongs.univ.schema.json"),
      EquipmentL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Equipment/Equipment.l10n.schema.json") : undefined,
      EquipmentL10nDefault:
        defaultParser ("Schema/Equipment/Equipment.l10n.schema.json"),
      EquipmentUniv:
        univParser ("Schema/Equipment/Equipment.univ.schema.json"),
      EquipmentGroupsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/EquipmentGroups/EquipmentGroups.l10n.schema.json") : undefined,
      EquipmentGroupsL10nDefault:
        defaultParser ("Schema/EquipmentGroups/EquipmentGroups.l10n.schema.json"),
      EquipmentPackagesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/EquipmentPackages/EquipmentPackages.l10n.schema.json") : undefined,
      EquipmentPackagesL10nDefault:
        defaultParser ("Schema/EquipmentPackages/EquipmentPackages.l10n.schema.json"),
      EquipmentPackagesUniv:
        univParser ("Schema/EquipmentPackages/EquipmentPackages.univ.schema.json"),
      ExperienceLevelsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/ExperienceLevels/ExperienceLevels.l10n.schema.json") : undefined,
      ExperienceLevelsL10nDefault:
        defaultParser ("Schema/ExperienceLevels/ExperienceLevels.l10n.schema.json"),
      ExperienceLevelsUniv:
        univParser ("Schema/ExperienceLevels/ExperienceLevels.univ.schema.json"),
      EyeColorsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/EyeColors/EyeColors.l10n.schema.json") : undefined,
      EyeColorsL10nDefault:
        defaultParser ("Schema/EyeColors/EyeColors.l10n.schema.json"),
      FocusRulesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/FocusRules/FocusRules.l10n.schema.json") : undefined,
      FocusRulesL10nDefault:
        defaultParser ("Schema/FocusRules/FocusRules.l10n.schema.json"),
      FocusRulesUniv:
        univParser ("Schema/FocusRules/FocusRules.univ.schema.json"),
      GeodeRitualsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/GeodeRituals/GeodeRituals.l10n.schema.json") : undefined,
      GeodeRitualsL10nDefault:
        defaultParser ("Schema/GeodeRituals/GeodeRituals.l10n.schema.json"),
      GeodeRitualsUniv:
        univParser ("Schema/GeodeRituals/GeodeRituals.univ.schema.json"),
      HairColorsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/HairColors/HairColors.l10n.schema.json") : undefined,
      HairColorsL10nDefault:
        defaultParser ("Schema/HairColors/HairColors.l10n.schema.json"),
      LiturgicalChantEnhancementsL10nOverride:
        // eslint-disable-next-line max-len
        (l10nParser != undefined) ? l10nParser ("Schema/LiturgicalChantEnhancements/LiturgicalChantEnhancements.l10n.schema.json") : undefined,
      LiturgicalChantEnhancementsL10nDefault:
        // eslint-disable-next-line max-len
        defaultParser ("Schema/LiturgicalChantEnhancements/LiturgicalChantEnhancements.l10n.schema.json"),
      LiturgicalChantEnhancementsUniv:
        // eslint-disable-next-line max-len
        univParser ("Schema/LiturgicalChantEnhancements/LiturgicalChantEnhancements.univ.schema.json"),
      LiturgicalChantGroupsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/LiturgicalChantGroups/LiturgicalChantGroups.l10n.schema.json") : undefined,
      LiturgicalChantGroupsL10nDefault:
        defaultParser ("Schema/LiturgicalChantGroups/LiturgicalChantGroups.l10n.schema.json"),
      LiturgicalChantsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/LiturgicalChants/LiturgicalChants.l10n.schema.json") : undefined,
      LiturgicalChantsL10nDefault:
        defaultParser ("Schema/LiturgicalChants/LiturgicalChants.l10n.schema.json"),
      LiturgicalChantsUniv:
        univParser ("Schema/LiturgicalChants/LiturgicalChants.univ.schema.json"),
      MagicalDancesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/MagicalDances/MagicalDances.l10n.schema.json") : undefined,
      MagicalDancesL10nDefault:
        defaultParser ("Schema/MagicalDances/MagicalDances.l10n.schema.json"),
      MagicalDancesUniv:
        univParser ("Schema/MagicalDances/MagicalDances.univ.schema.json"),
      MagicalMelodiesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/MagicalMelodies/MagicalMelodies.l10n.schema.json") : undefined,
      MagicalMelodiesL10nDefault:
        defaultParser ("Schema/MagicalMelodies/MagicalMelodies.l10n.schema.json"),
      MagicalMelodiesUniv:
        univParser ("Schema/MagicalMelodies/MagicalMelodies.univ.schema.json"),
      MagicalTraditionsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/MagicalTraditions/MagicalTraditions.l10n.schema.json") : undefined,
      MagicalTraditionsL10nDefault:
        defaultParser ("Schema/MagicalTraditions/MagicalTraditions.l10n.schema.json"),
      MagicalTraditionsUniv:
        univParser ("Schema/MagicalTraditions/MagicalTraditions.univ.schema.json"),
      OptionalRulesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/OptionalRules/OptionalRules.l10n.schema.json") : undefined,
      OptionalRulesL10nDefault:
        defaultParser ("Schema/OptionalRules/OptionalRules.l10n.schema.json"),
      PactsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Pacts/Pacts.l10n.schema.json") : undefined,
      PactsL10nDefault:
        defaultParser ("Schema/Pacts/Pacts.l10n.schema.json"),
      ProfessionsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Professions/Professions.l10n.schema.json") : undefined,
      ProfessionsL10nDefault:
        defaultParser ("Schema/Professions/Professions.l10n.schema.json"),
      ProfessionsUniv:
        univParser ("Schema/Professions/Professions.univ.schema.json"),
      ProfessionVariantsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/ProfessionVariants/ProfessionVariants.l10n.schema.json") : undefined,
      ProfessionVariantsL10nDefault:
        defaultParser ("Schema/ProfessionVariants/ProfessionVariants.l10n.schema.json"),
      ProfessionVariantsUniv:
        univParser ("Schema/ProfessionVariants/ProfessionVariants.univ.schema.json"),
      PropertiesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Properties/Properties.l10n.schema.json") : undefined,
      PropertiesL10nDefault:
        defaultParser ("Schema/Properties/Properties.l10n.schema.json"),
      RacesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Races/Races.l10n.schema.json") : undefined,
      RacesL10nDefault:
        defaultParser ("Schema/Races/Races.l10n.schema.json"),
      RacesUniv:
        univParser ("Schema/Races/Races.univ.schema.json"),
      RaceVariantsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/RaceVariants/RaceVariants.l10n.schema.json") : undefined,
      RaceVariantsL10nDefault:
        defaultParser ("Schema/RaceVariants/RaceVariants.l10n.schema.json"),
      RaceVariantsUniv:
        univParser ("Schema/RaceVariants/RaceVariants.univ.schema.json"),
      ReachesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Reaches/Reaches.l10n.schema.json") : undefined,
      ReachesL10nDefault:
        defaultParser ("Schema/Reaches/Reaches.l10n.schema.json"),
      RogueSpellsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/RogueSpells/RogueSpells.l10n.schema.json") : undefined,
      RogueSpellsL10nDefault:
        defaultParser ("Schema/RogueSpells/RogueSpells.l10n.schema.json"),
      RogueSpellsUniv:
        univParser ("Schema/RogueSpells/RogueSpells.univ.schema.json"),
      SkillGroupsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/SkillGroups/SkillGroups.l10n.schema.json") : undefined,
      SkillGroupsL10nDefault:
        defaultParser ("Schema/SkillGroups/SkillGroups.l10n.schema.json"),
      SkillsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Skills/Skills.l10n.schema.json") : undefined,
      SkillsL10nDefault:
        defaultParser ("Schema/Skills/Skills.l10n.schema.json"),
      SkillsUniv:
        univParser ("Schema/Skills/Skills.univ.schema.json"),
      SocialStatusesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/SocialStatuses/SocialStatuses.l10n.schema.json") : undefined,
      SocialStatusesL10nDefault:
        defaultParser ("Schema/SocialStatuses/SocialStatuses.l10n.schema.json"),
      SpecialAbilitiesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/SpecialAbilities/SpecialAbilities.l10n.schema.json") : undefined,
      SpecialAbilitiesL10nDefault:
        defaultParser ("Schema/SpecialAbilities/SpecialAbilities.l10n.schema.json"),
      SpecialAbilitiesUniv:
        univParser ("Schema/SpecialAbilities/SpecialAbilities.univ.schema.json"),
      SpecialAbilityGroupsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/SpecialAbilityGroups/SpecialAbilityGroups.l10n.schema.json") : undefined,
      SpecialAbilityGroupsL10nDefault:
        defaultParser ("Schema/SpecialAbilityGroups/SpecialAbilityGroups.l10n.schema.json"),
      SpellEnhancementsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/SpellEnhancements/SpellEnhancements.l10n.schema.json") : undefined,
      SpellEnhancementsL10nDefault:
        defaultParser ("Schema/SpellEnhancements/SpellEnhancements.l10n.schema.json"),
      SpellEnhancementsUniv:
        univParser ("Schema/SpellEnhancements/SpellEnhancements.univ.schema.json"),
      SpellGroupsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/SpellGroups/SpellGroups.l10n.schema.json") : undefined,
      SpellGroupsL10nDefault:
        defaultParser ("Schema/SpellGroups/SpellGroups.l10n.schema.json"),
      SpellsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Spells/Spells.l10n.schema.json") : undefined,
      SpellsL10nDefault:
        defaultParser ("Schema/Spells/Spells.l10n.schema.json"),
      SpellsUniv:
        univParser ("Schema/Spells/Spells.univ.schema.json"),
      StatesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/States/States.l10n.schema.json") : undefined,
      StatesL10nDefault:
        defaultParser ("Schema/States/States.l10n.schema.json"),
      SubjectsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Subjects/Subjects.l10n.schema.json") : undefined,
      SubjectsL10nDefault:
        defaultParser ("Schema/Subjects/Subjects.l10n.schema.json"),
      TribesL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/Tribes/Tribes.l10n.schema.json") : undefined,
      TribesL10nDefault:
        defaultParser ("Schema/Tribes/Tribes.l10n.schema.json"),
      UIL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/UI/UI.l10n.schema.json") : undefined,
      UIL10nDefault:
        defaultParser ("Schema/UI/UI.l10n.schema.json"),
      ZibiljaRitualsL10nOverride:
        (l10nParser != undefined) ? l10nParser ("Schema/ZibiljaRituals/ZibiljaRituals.l10n.schema.json") : undefined,
      ZibiljaRitualsL10nDefault:
        defaultParser ("Schema/ZibiljaRituals/ZibiljaRituals.l10n.schema.json"),
      ZibiljaRitualsUniv:
        univParser ("Schema/ZibiljaRituals/ZibiljaRituals.univ.schema.json"),
    })
