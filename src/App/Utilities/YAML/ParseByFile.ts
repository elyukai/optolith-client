/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { MapEitherIO, mapMObjectIO } from "./MapEitherIOObject"
import { YamlParser, YamlValidationError } from "./Parser"
import { YamlNameMap } from "./SchemaMap"

export const parseByFile =
  (univParser : YamlParser) =>
  async (l10nParser : YamlParser) : MapEitherIO<YamlValidationError, YamlNameMap> =>
    mapMObjectIO ({
      AdvantagesL10n:
        l10nParser ("Schema/Advantages/Advantages.l10n.schema.json"),
      AdvantagesUniv:
        univParser ("Schema/Advantages/Advantages.univ.schema.json"),
      AnimistForcesL10n:
        l10nParser ("Schema/AnimistForces/AnimistForces.l10n.schema.json"),
      AnimistForcesUniv:
        univParser ("Schema/AnimistForces/AnimistForces.univ.schema.json"),
      ArcaneBardTraditionsL10n:
        l10nParser ("Schema/ArcaneBardTraditions/ArcaneBardTraditions.l10n.schema.json"),
      ArcaneDancerTraditionsL10n:
        l10nParser ("Schema/ArcaneDancerTraditions/ArcaneDancerTraditions.l10n.schema.json"),
      ArmorTypesL10n:
        l10nParser ("Schema/ArmorTypes/ArmorTypes.l10n.schema.json"),
      AspectsL10n:
        l10nParser ("Schema/Aspects/Aspects.l10n.schema.json"),
      AttributesL10n:
        l10nParser ("Schema/Attributes/Attributes.l10n.schema.json"),
      BlessedTraditionsL10n:
        l10nParser ("Schema/BlessedTraditions/BlessedTraditions.l10n.schema.json"),
      BlessedTraditionsUniv:
        univParser ("Schema/BlessedTraditions/BlessedTraditions.univ.schema.json"),
      BlessingsL10n:
        l10nParser ("Schema/Blessings/Blessings.l10n.schema.json"),
      BlessingsUniv:
        univParser ("Schema/Blessings/Blessings.univ.schema.json"),
      BooksL10n:
        l10nParser ("Schema/Books/Books.l10n.schema.json"),
      BrewsL10n:
        l10nParser ("Schema/Brews/Brews.l10n.schema.json"),
      CantripsL10n:
        l10nParser ("Schema/Cantrips/Cantrips.l10n.schema.json"),
      CantripsUniv:
        univParser ("Schema/Cantrips/Cantrips.univ.schema.json"),
      CombatSpecialAbilityGroupsL10n:
        // eslint-disable-next-line max-len
        l10nParser ("Schema/CombatSpecialAbilityGroups/CombatSpecialAbilityGroups.l10n.schema.json"),
      CombatTechniqueGroupsL10n:
        l10nParser ("Schema/CombatTechniqueGroups/CombatTechniqueGroups.l10n.schema.json"),
      CombatTechniquesL10n:
        l10nParser ("Schema/CombatTechniques/CombatTechniques.l10n.schema.json"),
      CombatTechniquesUniv:
        univParser ("Schema/CombatTechniques/CombatTechniques.univ.schema.json"),
      ConditionsL10n:
        l10nParser ("Schema/Conditions/Conditions.l10n.schema.json"),
      CulturesL10n:
        l10nParser ("Schema/Cultures/Cultures.l10n.schema.json"),
      CulturesUniv:
        univParser ("Schema/Cultures/Cultures.univ.schema.json"),
      CursesL10n:
        l10nParser ("Schema/Curses/Curses.l10n.schema.json"),
      CursesUniv:
        univParser ("Schema/Curses/Curses.univ.schema.json"),
      DerivedCharacteristicsL10n:
        l10nParser ("Schema/DerivedCharacteristics/DerivedCharacteristics.l10n.schema.json"),
      DisadvantagesL10n:
        l10nParser ("Schema/Disadvantages/Disadvantages.l10n.schema.json"),
      DisadvantagesUniv:
        univParser ("Schema/Disadvantages/Disadvantages.univ.schema.json"),
      DominationRitualsL10n:
        l10nParser ("Schema/DominationRituals/DominationRituals.l10n.schema.json"),
      DominationRitualsUniv:
        univParser ("Schema/DominationRituals/DominationRituals.univ.schema.json"),
      ElvenMagicalSongsL10n:
        l10nParser ("Schema/ElvenMagicalSongs/ElvenMagicalSongs.l10n.schema.json"),
      ElvenMagicalSongsUniv:
        univParser ("Schema/ElvenMagicalSongs/ElvenMagicalSongs.univ.schema.json"),
      EquipmentL10n:
        l10nParser ("Schema/Equipment/Equipment.l10n.schema.json"),
      EquipmentUniv:
        univParser ("Schema/Equipment/Equipment.univ.schema.json"),
      EquipmentGroupsL10n:
        l10nParser ("Schema/EquipmentGroups/EquipmentGroups.l10n.schema.json"),
      EquipmentPackagesL10n:
        l10nParser ("Schema/EquipmentPackages/EquipmentPackages.l10n.schema.json"),
      EquipmentPackagesUniv:
        univParser ("Schema/EquipmentPackages/EquipmentPackages.univ.schema.json"),
      ExperienceLevelsL10n:
        l10nParser ("Schema/ExperienceLevels/ExperienceLevels.l10n.schema.json"),
      ExperienceLevelsUniv:
        univParser ("Schema/ExperienceLevels/ExperienceLevels.univ.schema.json"),
      EyeColorsL10n:
        l10nParser ("Schema/EyeColors/EyeColors.l10n.schema.json"),
      FocusRulesL10n:
        l10nParser ("Schema/FocusRules/FocusRules.l10n.schema.json"),
      FocusRulesUniv:
        univParser ("Schema/FocusRules/FocusRules.univ.schema.json"),
      GeodeRitualsL10n:
        l10nParser ("Schema/GeodeRituals/GeodeRituals.l10n.schema.json"),
      GeodeRitualsUniv:
        univParser ("Schema/GeodeRituals/GeodeRituals.univ.schema.json"),
      HairColorsL10n:
        l10nParser ("Schema/HairColors/HairColors.l10n.schema.json"),
      LiturgicalChantEnhancementsL10n:
        // eslint-disable-next-line max-len
        l10nParser ("Schema/LiturgicalChantEnhancements/LiturgicalChantEnhancements.l10n.schema.json"),
        LiturgicalChantEnhancementsUniv:
        // eslint-disable-next-line max-len
        univParser ("Schema/LiturgicalChantEnhancements/LiturgicalChantEnhancements.univ.schema.json"),
      LiturgicalChantGroupsL10n:
        l10nParser ("Schema/LiturgicalChantGroups/LiturgicalChantGroups.l10n.schema.json"),
      LiturgicalChantsL10n:
        l10nParser ("Schema/LiturgicalChants/LiturgicalChants.l10n.schema.json"),
      LiturgicalChantsUniv:
        univParser ("Schema/LiturgicalChants/LiturgicalChants.univ.schema.json"),
      MagicalDancesL10n:
        l10nParser ("Schema/MagicalDances/MagicalDances.l10n.schema.json"),
      MagicalDancesUniv:
        univParser ("Schema/MagicalDances/MagicalDances.univ.schema.json"),
      MagicalMelodiesL10n:
        l10nParser ("Schema/MagicalMelodies/MagicalMelodies.l10n.schema.json"),
      MagicalMelodiesUniv:
        univParser ("Schema/MagicalMelodies/MagicalMelodies.univ.schema.json"),
      MagicalTraditionsL10n:
        l10nParser ("Schema/MagicalTraditions/MagicalTraditions.l10n.schema.json"),
      MagicalTraditionsUniv:
        univParser ("Schema/MagicalTraditions/MagicalTraditions.univ.schema.json"),
      OptionalRulesL10n:
        l10nParser ("Schema/OptionalRules/OptionalRules.l10n.schema.json"),
      PactsL10n:
        l10nParser ("Schema/Pacts/Pacts.l10n.schema.json"),
      ProfessionsL10n:
        l10nParser ("Schema/Professions/Professions.l10n.schema.json"),
      ProfessionsUniv:
        univParser ("Schema/Professions/Professions.univ.schema.json"),
      ProfessionVariantsL10n:
        l10nParser ("Schema/ProfessionVariants/ProfessionVariants.l10n.schema.json"),
      ProfessionVariantsUniv:
        univParser ("Schema/ProfessionVariants/ProfessionVariants.univ.schema.json"),
      PropertiesL10n:
        l10nParser ("Schema/Properties/Properties.l10n.schema.json"),
      RacesL10n:
        l10nParser ("Schema/Races/Races.l10n.schema.json"),
      RacesUniv:
        univParser ("Schema/Races/Races.univ.schema.json"),
      RaceVariantsL10n:
        l10nParser ("Schema/RaceVariants/RaceVariants.l10n.schema.json"),
      RaceVariantsUniv:
        univParser ("Schema/RaceVariants/RaceVariants.univ.schema.json"),
      ReachesL10n:
        l10nParser ("Schema/Reaches/Reaches.l10n.schema.json"),
      RogueSpellsL10n:
        l10nParser ("Schema/RogueSpells/RogueSpells.l10n.schema.json"),
      RogueSpellsUniv:
        univParser ("Schema/RogueSpells/RogueSpells.univ.schema.json"),
      SkillGroupsL10n:
        l10nParser ("Schema/SkillGroups/SkillGroups.l10n.schema.json"),
      SkillsL10n:
        l10nParser ("Schema/Skills/Skills.l10n.schema.json"),
      SkillsUniv:
        univParser ("Schema/Skills/Skills.univ.schema.json"),
      SocialStatusesL10n:
        l10nParser ("Schema/SocialStatuses/SocialStatuses.l10n.schema.json"),
      SpecialAbilitiesL10n:
        l10nParser ("Schema/SpecialAbilities/SpecialAbilities.l10n.schema.json"),
      SpecialAbilitiesUniv:
        univParser ("Schema/SpecialAbilities/SpecialAbilities.univ.schema.json"),
      SpecialAbilityGroupsL10n:
        l10nParser ("Schema/SpecialAbilityGroups/SpecialAbilityGroups.l10n.schema.json"),
      SpellEnhancementsL10n:
        l10nParser ("Schema/SpellEnhancements/SpellEnhancements.l10n.schema.json"),
      SpellEnhancementsUniv:
        univParser ("Schema/SpellEnhancements/SpellEnhancements.univ.schema.json"),
      SpellGroupsL10n:
        l10nParser ("Schema/SpellGroups/SpellGroups.l10n.schema.json"),
      SpellsL10n:
        l10nParser ("Schema/Spells/Spells.l10n.schema.json"),
      SpellsUniv:
        univParser ("Schema/Spells/Spells.univ.schema.json"),
      StatesL10n:
        l10nParser ("Schema/States/States.l10n.schema.json"),
      SubjectsL10n:
        l10nParser ("Schema/Subjects/Subjects.l10n.schema.json"),
      TribesL10n:
        l10nParser ("Schema/Tribes/Tribes.l10n.schema.json"),
      UIL10n:
        l10nParser ("Schema/UI/UI.l10n.schema.json"),
      ZibiljaRitualsL10n:
        l10nParser ("Schema/ZibiljaRituals/ZibiljaRituals.l10n.schema.json"),
      ZibiljaRitualsUniv:
        univParser ("Schema/ZibiljaRituals/ZibiljaRituals.univ.schema.json"),
    })
