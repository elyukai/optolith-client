import { Categories } from '../constants/Categories';
import { List } from '../utils/structures/List';
import { Just, Maybe } from '../utils/structures/Maybe';
import { OrderedMap } from '../utils/structures/OrderedMap';
import { Record } from '../utils/structures/Record';
import { Advantage } from '../utils/wikiData/Advantage';
import { Attribute } from '../utils/wikiData/Attribute';
import { Blessing } from '../utils/wikiData/Blessing';
import { Cantrip } from '../utils/wikiData/Cantrip';
import { CombatTechnique } from '../utils/wikiData/CombatTechnique';
import { Culture } from '../utils/wikiData/Culture';
import { Disadvantage } from '../utils/wikiData/Disadvantage';
import { ItemTemplate } from '../utils/wikiData/ItemTemplate';
import { LiturgicalChant } from '../utils/wikiData/LiturgicalChant';
import { ProfessionRequireActivatable, RequireActivatable } from '../utils/wikiData/prerequisites/ActivatableRequirement';
import { CultureRequirement } from '../utils/wikiData/prerequisites/CultureRequirement';
import { ProfessionRequireIncreasable, RequireIncreasable } from '../utils/wikiData/prerequisites/IncreasableRequirement';
import { PactRequirement } from '../utils/wikiData/prerequisites/PactRequirement';
import { RequirePrimaryAttribute } from '../utils/wikiData/prerequisites/PrimaryAttributeRequirement';
import { RaceRequirement } from '../utils/wikiData/prerequisites/RaceRequirement';
import { SexRequirement } from '../utils/wikiData/prerequisites/SexRequirement';
import { Profession } from '../utils/wikiData/Profession';
import { CantripsSelection } from '../utils/wikiData/professionSelections/CantripsSelection';
import { CombatTechniquesSelection } from '../utils/wikiData/professionSelections/CombatTechniquesSelection';
import { CursesSelection } from '../utils/wikiData/professionSelections/CursesSelection';
import { LanguagesScriptsSelection } from '../utils/wikiData/professionSelections/LanguagesScriptsSelection';
import { VariantCombatTechniquesSelection } from '../utils/wikiData/professionSelections/RemoveCombatTechniquesSelection';
import { VariantCombatTechniquesSecondSelection } from '../utils/wikiData/professionSelections/RemoveSecondCombatTechniquesSelection';
import { VariantSpecializationSelection } from '../utils/wikiData/professionSelections/RemoveSpecializationSelection';
import { CombatTechniquesSecondSelection } from '../utils/wikiData/professionSelections/SecondCombatTechniquesSelection';
import { SkillsSelection } from '../utils/wikiData/professionSelections/SkillsSelection';
import { SpecializationSelection } from '../utils/wikiData/professionSelections/SpecializationSelection';
import { TerrainKnowledgeSelection } from '../utils/wikiData/professionSelections/TerrainKnowledgeSelection';
import { ProfessionVariant } from '../utils/wikiData/ProfessionVariant';
import { Race } from '../utils/wikiData/Race';
import { RaceVariant } from '../utils/wikiData/RaceVariant';
import { Skill } from '../utils/wikiData/Skill';
import { SpecialAbility } from '../utils/wikiData/SpecialAbilityCreator';
import { Spell } from '../utils/wikiData/SpellCreator';
import { SelectOption } from '../utils/wikiData/sub/SelectOption';
import { SourceLink } from '../utils/wikiData/sub/SourceLink';

export interface WikiEntryByCategory {
  'ADVANTAGES': Advantage
  'ATTRIBUTES': Attribute
  'BLESSINGS': Blessing
  'CANTRIPS': Cantrip
  'COMBAT_TECHNIQUES': CombatTechnique
  'CULTURES': Culture
  'DISADVANTAGES': Disadvantage
  'LITURGIES': LiturgicalChant
  'PROFESSIONS': Profession
  'PROFESSION_VARIANTS': ProfessionVariant
  'RACES': Race
  'RACE_VARIANTS': RaceVariant
  'SPECIAL_ABILITIES': SpecialAbility
  'SPELLS': Spell
  'TALENTS': Skill
}

export interface WikiEntryRecordByCategory {
  'ADVANTAGES': Record<Advantage>
  'ATTRIBUTES': Record<Attribute>
  'BLESSINGS': Record<Blessing>
  'CANTRIPS': Record<Cantrip>
  'COMBAT_TECHNIQUES': Record<CombatTechnique>
  'CULTURES': Record<Culture>
  'DISADVANTAGES': Record<Disadvantage>
  'LITURGIES': Record<LiturgicalChant>
  'PROFESSIONS': Record<Profession>
  'PROFESSION_VARIANTS': Record<ProfessionVariant>
  'RACES': Record<Race>
  'RACE_VARIANTS': Record<RaceVariant>
  'SPECIAL_ABILITIES': Record<SpecialAbility>
  'SPELLS': Record<Spell>
  'TALENTS': Record<Skill>
}

export type EntryWithGroup =
  Record<CombatTechnique> |
  Record<LiturgicalChant> |
  Record<SpecialAbility> |
  Record<Spell> |
  Record<Skill>

export type IncreasableEntry =
  Record<Attribute> |
  Record<Spell> |
  Record<LiturgicalChant> |
  Record<Skill> |
  Record<CombatTechnique>

export type SkillishEntry =
  Record<Spell> |
  Record<LiturgicalChant> |
  Record<Skill> |
  Record<CombatTechnique>

export type Entry =
  Record<Race> |
  Record<RaceVariant> |
  Record<Culture> |
  Record<Profession> |
  Record<ProfessionVariant> |
  Record<Attribute> |
  Record<Advantage> |
  Record<Disadvantage> |
  Record<Skill> |
  Record<CombatTechnique> |
  Record<SpecialAbility> |
  Record<Spell> |
  Record<Cantrip> |
  Record<LiturgicalChant> |
  Record<Blessing> |
  Record<ItemTemplate>

export type EntryWithCategory =
  Record<Race> |
  Record<RaceVariant> |
  Record<Culture> |
  Record<Profession> |
  Record<ProfessionVariant> |
  Record<Attribute> |
  Record<Advantage> |
  Record<Disadvantage> |
  Record<Skill> |
  Record<CombatTechnique> |
  Record<SpecialAbility> |
  Record<Spell> |
  Record<Cantrip> |
  Record<LiturgicalChant> |
  Record<Blessing>

export enum ProfessionSelectionIds {
  SPECIALIZATION = 'SPECIALISATION',
  LANGUAGES_SCRIPTS = 'LANGUAGES_SCRIPTS',
  COMBAT_TECHNIQUES = 'COMBAT_TECHNIQUES',
  COMBAT_TECHNIQUES_SECOND = 'COMBAT_TECHNIQUES_SECOND',
  CANTRIPS = 'CANTRIPS',
  CURSES = 'CURSES',
  SKILLS = 'SKILLS',
  TERRAIN_KNOWLEDGE = 'TERRAIN_KNOWLEDGE',
}

export interface ProfessionAdjustmentSelections {
  [ProfessionSelectionIds.CANTRIPS]?: Record<CantripsSelection>
  [ProfessionSelectionIds.COMBAT_TECHNIQUES]?: VariantCombatTechniquesSelection
  [ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND]?: VariantCombatTechniquesSecondSelection
  [ProfessionSelectionIds.CURSES]?: Record<CursesSelection>
  [ProfessionSelectionIds.LANGUAGES_SCRIPTS]?: Record<LanguagesScriptsSelection>
  [ProfessionSelectionIds.SPECIALIZATION]?: VariantSpecializationSelection
  [ProfessionSelectionIds.SKILLS]?: Record<SkillsSelection>
  [ProfessionSelectionIds.TERRAIN_KNOWLEDGE]?: Record<TerrainKnowledgeSelection>
}

export type ProfessionSelection =
  Record<SpecializationSelection> |
  Record<LanguagesScriptsSelection> |
  Record<CombatTechniquesSelection> |
  Record<CombatTechniquesSecondSelection> |
  Record<CantripsSelection> |
  Record<CursesSelection> |
  Record<SkillsSelection> |
  Record<TerrainKnowledgeSelection>

export type ProfessionVariantSelection =
  VariantSpecializationSelection |
  Record<LanguagesScriptsSelection> |
  VariantCombatTechniquesSelection |
  VariantCombatTechniquesSecondSelection |
  Record<CantripsSelection> |
  Record<CursesSelection> |
  Record<SkillsSelection> |
  Record<TerrainKnowledgeSelection>

export type ProfessionSelections =
  List<ProfessionSelection>

export type ProfessionVariantSelections =
  List<ProfessionVariantSelection>

export type AllRequirements = 'RCP' | AllRequirementObjects
export type ActivatablePrerequisites = List<AllRequirements>

export type LevelAwarePrerequisites =
  ActivatablePrerequisites |
  OrderedMap<number, ActivatablePrerequisites>

export interface ActivatableBase {
  id: string
  name: string
  cost: string | number | List<number>
  input: Maybe<string>
  max: Maybe<number>
  prerequisites: LevelAwarePrerequisites
  prerequisitesText: Maybe<string>
  /**
   * 0-based index as key!
   */
  prerequisitesTextIndex: OrderedMap<number, string | false>
  prerequisitesTextStart: Maybe<string>
  prerequisitesTextEnd: Maybe<string>
  tiers: Maybe<number>
  select: Maybe<List<Record<SelectOption>>>
  gr: number
  category: Categories
  src: List<Record<SourceLink>>
}

export interface AdvantageDisadvantageBase extends ActivatableBase {
  rules: string
  range: Maybe<string>
  actions: Maybe<string>
  apValue: Maybe<string>
  apValueAppend: Maybe<string>
}

export type CheckModifier = 'SPI' | 'TOU'

export interface SkillExtension extends SelectOption {
  target: Just<string>
  tier: Just<1 | 2 | 3>
  effect: string
}

export type Activatable =
  Record<Advantage> |
  Record<Disadvantage> |
  Record<SpecialAbility>

export type Skillish =
  Record<Spell> |
  Record<LiturgicalChant> |
  Record<Skill> |
  Record<CombatTechnique>

export type SID = string | number | List<number>

export interface ValueOptionalDependency {
  /**
   * The skill/spell/chant rating or rather attribute value.
   */
  value: number
  /**
   * The entry that created this dependency.
   */
  origin: string
}

export interface ActiveDependency {
  active: Maybe<boolean>
  sid: Maybe<SID>
  sid2: Maybe<string | number>
  tier: Maybe<number>
}

export interface ActiveOptionalDependency extends ActiveDependency {
  origin: string
}

export type ProfessionDependency =
  Record<SexRequirement> |
  Record<RaceRequirement> |
  Record<CultureRequirement>

export type ProfessionPrerequisite =
  Record<ProfessionRequireActivatable> |
  Record<ProfessionRequireIncreasable>

export type AbilityRequirement =
  Record<RequireActivatable> |
  Record<RequireIncreasable>

export type DependentPrerequisite =
  Record<RequireActivatable> |
  Record<RequireIncreasable> |
  Record<RequirePrimaryAttribute>

export type AllRequirementObjects =
  Record<RequireActivatable> |
  Record<RequireIncreasable> |
  Record<RequirePrimaryAttribute> |
  Record<SexRequirement> |
  Record<RaceRequirement> |
  Record<CultureRequirement> |
  Record<PactRequirement>
