import { Categories } from '../../constants/Categories';
import { Sex } from '../../types/data';
import { Advantage, Application, Attribute, Blessing, Cantrip, CantripsSelection, CombatTechnique, CombatTechniquesSecondSelection, CombatTechniquesSelection, CommonProfessionObject, Culture, CultureRequirement, CursesSelection, Die, Disadvantage, ExperienceLevel, IncreaseSkill, ItemTemplate, LanguagesScriptsSelection, LiturgicalChant, NameBySex, PactRequirement, Profession, ProfessionSelectionIds, ProfessionVariant, Race, RaceRequirement, RaceVariant, RemoveCombatTechniquesSecondSelection, RemoveCombatTechniquesSelection, RemoveSpecializationSelection, RequiresActivatableObject, RequiresIncreasableObject, RequiresPrimaryAttribute, SelectionObject, SexRequirement, Skill, SkillsSelection, SourceLink, SpecialAbility, SpecializationSelection, Spell, TerrainKnowledgeSelection } from '../../types/wiki';
import { List } from '../structures/List';
import { Maybe, Nothing } from '../structures/Maybe';
import { OrderedMap } from '../structures/OrderedMap';
import { fromBoth } from '../structures/Pair';
import { fromDefault, makeGetters, Omit, Record } from '../structures/Record';

type RequiredExceptCategoryFunction<A extends { category: Categories }> =
  (x: Omit<A, 'category'>) => Record<A>

type RequiredExceptIdFunction<A extends { id: ProfessionSelectionIds }> =
  (x: Omit<A, 'id'>) => Record<A>

type RequiredFunction<A> = (x: Required<A>) => Record<A>

type PartialMaybeRequiredKeys<A> = {
  [K in keyof A]: A[K] extends Maybe<any> ? never : K
} [keyof A]

type PartialMaybePartialKeys<A> = {
  [K in keyof A]: A[K] extends Maybe<any> ? K : never
} [keyof A]

type PartialMaybe<A> = {
  [K in PartialMaybeRequiredKeys<A>]-?: A[K] extends Maybe<any> ? never : A[K]
} & {
  [K in PartialMaybePartialKeys<A>]?: A[K] extends Maybe<any> ? A[K] : never
}

type PartialMaybeFunction<A> = (x: PartialMaybe<A>) => Record<A>

const SourceLinkCreator =
  fromDefault<SourceLink> ({
    id: '',
    page: 0,
  })

export const SourceLinkG = makeGetters (SourceLinkCreator)

export const createSourceLink = (id: string) => (page: number) => SourceLinkCreator ({ id, page })

const ExperienceLevelCreator =
  fromDefault<ExperienceLevel> ({
    id: '',
    name: '',
    ap: 0,
    maxAttributeValue: 0,
    maxSkillRating: 0,
    maxCombatTechniqueRating: 0,
    maxTotalAttributeValues: 0,
    maxSpellsLiturgies: 0,
    maxUnfamiliarSpells: 0,
  })

export const ExperienceLevelG = makeGetters (ExperienceLevelCreator)

export const createExperienceLevel: RequiredFunction<ExperienceLevel> = ExperienceLevelCreator

const DieCreator =
  fromDefault<Die> ({
    amount: 0,
    sides: 0,
  })

export const DieG = makeGetters (DieCreator)

export const createDie = (amount: number) => (sides: number) => DieCreator ({ amount, sides })

const RaceCreator =
  fromDefault<Race> ({
    id: '',
    name: '',
    ap: 0,
    lp: 0,
    spi: 0,
    tou: 0,
    mov: 0,
    attributeAdjustments: List.empty,
    attributeAdjustmentsSelection: fromBoth<number, List<string>> (0) (List.empty),
    attributeAdjustmentsText: '',
    commonCultures: List.empty,
    automaticAdvantages: List.empty,
    automaticAdvantagesText: '',
    stronglyRecommendedAdvantages: List.empty,
    stronglyRecommendedAdvantagesText: '',
    stronglyRecommendedDisadvantages: List.empty,
    stronglyRecommendedDisadvantagesText: '',
    commonAdvantages: List.empty,
    commonAdvantagesText: Nothing,
    commonDisadvantages: List.empty,
    commonDisadvantagesText: Nothing,
    uncommonAdvantages: List.empty,
    uncommonAdvantagesText: Nothing,
    uncommonDisadvantages: List.empty,
    uncommonDisadvantagesText: Nothing,
    hairColors: Nothing,
    eyeColors: Nothing,
    sizeBase: Nothing,
    sizeRandom: Nothing,
    weightBase: 0,
    weightRandom: List.empty,
    variants: List.empty,
    category: Categories.RACES,
    src: List.empty,
  })

export const RaceG = makeGetters (RaceCreator)

export const createRace: RequiredExceptCategoryFunction<Race> = RaceCreator

const RaceVariantCreator =
  fromDefault<RaceVariant> ({
    id: '',
    name: '',
    commonCultures: List.empty,
    commonAdvantages: List.empty,
    commonAdvantagesText: Nothing,
    commonDisadvantages: List.empty,
    commonDisadvantagesText: Nothing,
    uncommonAdvantages: List.empty,
    uncommonAdvantagesText: Nothing,
    uncommonDisadvantages: List.empty,
    uncommonDisadvantagesText: Nothing,
    hairColors: Nothing,
    eyeColors: Nothing,
    sizeBase: Nothing,
    sizeRandom: Nothing,
    category: Categories.RACE_VARIANTS,
  })

export const RaceVariantG = makeGetters (RaceVariantCreator)

export const createRaceVariant: RequiredExceptCategoryFunction<RaceVariant> = RaceVariantCreator

const CommonProfessionObjectCreator =
  fromDefault<CommonProfessionObject> ({
    list: List.empty,
    reverse: false,
  })

export const CommonProfessionObjectG = makeGetters (CommonProfessionObjectCreator)

export const createCommonProfessionObject: RequiredFunction<CommonProfessionObject> =
  CommonProfessionObjectCreator

const IncreaseSkillCreator =
  fromDefault<IncreaseSkill> ({
    id: '',
    value: 0,
  })

export const IncreaseSkillG = makeGetters (IncreaseSkillCreator)

export const createIncreaseSkill: RequiredFunction<IncreaseSkill> = IncreaseSkillCreator

const CultureCreator =
  fromDefault<Culture> ({
    id: '',
    name: '',
    culturalPackageAdventurePoints: 0,
    languages: List.empty,
    scripts: List.empty,
    socialStatus: List.empty,
    areaKnowledge: '',
    areaKnowledgeShort: '',
    commonProfessions: List.empty,
    commonMundaneProfessions: Nothing,
    commonMagicProfessions: Nothing,
    commonBlessedProfessions: Nothing,
    commonAdvantages: List.empty,
    commonAdvantagesText: Nothing,
    commonDisadvantages: List.empty,
    commonDisadvantagesText: Nothing,
    uncommonAdvantages: List.empty,
    uncommonAdvantagesText: Nothing,
    uncommonDisadvantages: List.empty,
    uncommonDisadvantagesText: Nothing,
    commonSkills: List.empty,
    uncommonSkills: List.empty,
    commonNames: '',
    culturalPackageSkills: List.empty,
    category: Categories.CULTURES,
    src: List.empty,
  })

export const CultureG = makeGetters (CultureCreator)

export const createCulture: RequiredExceptCategoryFunction<Culture> = CultureCreator

const NameBySexCreator =
  fromDefault<NameBySex> ({
    m: '',
    f: '',
  })

export const NameBySexG = makeGetters (NameBySexCreator)

export const createNameBySex: RequiredFunction<NameBySex> = NameBySexCreator

const ProfessionCreator =
  fromDefault<Profession> ({
    id: '',
    name: '',
    subname: Nothing,
    ap: 0,
    apOfActivatables: 0,
    dependencies: List.empty,
    prerequisites: List.empty,
    prerequisitesStart: Nothing,
    prerequisitesEnd: Nothing,
    selections: List.empty,
    specialAbilities: List.empty,
    combatTechniques: List.empty,
    skills: List.empty,
    spells: List.empty,
    liturgicalChants: List.empty,
    blessings: List.empty,
    suggestedAdvantages: List.empty,
    suggestedAdvantagesText: Nothing,
    suggestedDisadvantages: List.empty,
    suggestedDisadvantagesText: Nothing,
    unsuitableAdvantages: List.empty,
    unsuitableAdvantagesText: Nothing,
    unsuitableDisadvantages: List.empty,
    unsuitableDisadvantagesText: Nothing,
    isVariantRequired: false,
    variants: List.empty,
    category: Categories.PROFESSIONS,
    gr: 0,
    subgr: 0,
    src: List.empty,
  })

export const ProfessionG = makeGetters (ProfessionCreator)

export const createProfession: RequiredExceptCategoryFunction<Profession> = ProfessionCreator

const ProfessionVariantCreator =
  fromDefault<ProfessionVariant> ({
    id: '',
    name: '',
    ap: 0,
    apOfActivatables: 0,
    dependencies: List.empty,
    prerequisites: List.empty,
    selections: List.empty,
    specialAbilities: List.empty,
    combatTechniques: List.empty,
    skills: List.empty,
    spells: List.empty,
    liturgicalChants: List.empty,
    blessings: List.empty,
    precedingText: Nothing,
    fullText: Nothing,
    concludingText: Nothing,
    category: Categories.PROFESSION_VARIANTS,
  })

export const ProfessionVariantG = makeGetters (ProfessionVariantCreator)

export const createProfessionVariant: RequiredExceptCategoryFunction<ProfessionVariant> =
  ProfessionVariantCreator

const AdvantageCreator =
  fromDefault<Advantage> ({
    id: '',
    name: '',
    cost: 0,
    input: Nothing,
    max: Nothing,
    prerequisites: List.empty,
    prerequisitesText: Nothing,
    prerequisitesTextIndex: OrderedMap.empty,
    prerequisitesTextStart: Nothing,
    prerequisitesTextEnd: Nothing,
    tiers: Nothing,
    select: Nothing,
    gr: 0,
    src: List.empty,
    rules: '',
    range: Nothing,
    actions: Nothing,
    apValue: Nothing,
    apValueAppend: Nothing,
    category: Categories.ADVANTAGES,
  })

export const AdvantageG = makeGetters (AdvantageCreator)

export const createAdvantage: RequiredExceptCategoryFunction<Advantage> = AdvantageCreator

const DisadvantageCreator =
  fromDefault<Disadvantage> ({
    id: '',
    name: '',
    cost: 0,
    input: Nothing,
    max: Nothing,
    prerequisites: List.empty,
    prerequisitesText: Nothing,
    prerequisitesTextIndex: OrderedMap.empty,
    prerequisitesTextStart: Nothing,
    prerequisitesTextEnd: Nothing,
    tiers: Nothing,
    select: Nothing,
    gr: 0,
    src: List.empty,
    rules: '',
    range: Nothing,
    actions: Nothing,
    apValue: Nothing,
    apValueAppend: Nothing,
    category: Categories.DISADVANTAGES,
  })

export const DisadvantageG = makeGetters (DisadvantageCreator)

export const createDisadvantage: RequiredExceptCategoryFunction<Disadvantage> = DisadvantageCreator

const SpecialAbilityCreator =
  fromDefault<SpecialAbility> ({
    id: '',
    name: '',
    cost: 0,
    input: Nothing,
    max: Nothing,
    prerequisites: List.empty,
    prerequisitesText: Nothing,
    prerequisitesTextIndex: OrderedMap.empty,
    prerequisitesTextStart: Nothing,
    prerequisitesTextEnd: Nothing,
    tiers: Nothing,
    select: Nothing,
    gr: 0,
    src: List.empty,
    extended: Nothing,
    nameInWiki: Nothing,
    subgr: Nothing,
    combatTechniques: Nothing,
    rules: Nothing,
    effect: Nothing,
    volume: Nothing,
    penalty: Nothing,
    aeCost: Nothing,
    protectiveCircle: Nothing,
    wardingCircle: Nothing,
    bindingCost: Nothing,
    property: Nothing,
    aspect: Nothing,
    apValue: Nothing,
    apValueAppend: Nothing,
    category: Categories.SPECIAL_ABILITIES,
  })

export const SpecialAbilityG = makeGetters (SpecialAbilityCreator)

export const createSpecialAbility: RequiredExceptCategoryFunction<SpecialAbility> =
  SpecialAbilityCreator

const SexRequirementCreator =
  fromDefault<SexRequirement> ({
    id: 'SEX',
    value: 'm',
  })

export const SexRequirementG = makeGetters (SexRequirementCreator)

export const createSexRequirement = (x: Sex) => SexRequirementCreator ({ value: x })

const RaceRequirementCreator =
  fromDefault<RaceRequirement> ({
    id: 'RACE',
    value: 0,
  })

export const RaceRequirementG = makeGetters (RaceRequirementCreator)

export const createRaceRequirement =
  (x: number | List<number>) => RaceRequirementCreator ({ value: x })

const CultureRequirementCreator =
  fromDefault<CultureRequirement> ({
    id: 'CULTURE',
    value: 0,
  })

export const CultureRequirementG = makeGetters (CultureRequirementCreator)

export const createCultureRequirement =
  (x: number | List<number>) => CultureRequirementCreator ({ value: x })

const RequireActivatableCreator =
  fromDefault<RequiresActivatableObject> ({
    id: '',
    active: true,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,
  })

export const RequireActivatableG = makeGetters (RequireActivatableCreator)

export const createRequireActivatable: PartialMaybeFunction<RequiresActivatableObject> =
  RequireActivatableCreator

const RequireIncreasableCreator =
  fromDefault<RequiresIncreasableObject> ({
    id: '',
    value: 0,
  })

export const RequireIncreasableG = makeGetters (RequireIncreasableCreator)

export const createRequireIncreasable: RequiredFunction<RequiresIncreasableObject> =
  RequireIncreasableCreator

const PactRequirementCreator =
  fromDefault<PactRequirement> ({
    id: 'PACT',
    category: 0,
    domain: Nothing,
    level: Nothing,
  })

export const PactRequirementG = makeGetters (PactRequirementCreator)

export const createPactRequirement: PartialMaybeFunction<PactRequirement> =
  PactRequirementCreator

const RequirePrimaryAttributeCreator =
  fromDefault<RequiresPrimaryAttribute> ({
    id: 'ATTR_PRIMARY',
    type: 1,
    value: 0,
  })

export const RequirePrimaryAttributeG = makeGetters (RequirePrimaryAttributeCreator)

export const createRequirePrimaryAttribute =
  (type: 1 | 2) => (value: number) => RequirePrimaryAttributeCreator ({ type, value })

const ApplicationCreator =
  fromDefault<Application> ({
    id: 0,
    name: '',
    prerequisites: Nothing,
  })

export const ApplicationG = makeGetters (ApplicationCreator)

export const createApplication: PartialMaybeFunction<Application> = ApplicationCreator

const SelectOptionCreator =
  fromDefault<SelectionObject> ({
    id: 0,
    name: '',
    cost: Nothing,
    req: Nothing,
    prerequisites: Nothing,
    target: Nothing,
    tier: Nothing,
    spec: Nothing,
    specInput: Nothing,
    applications: Nothing,
    applicationsInput: Nothing,
    talent: Nothing,
    gr: Nothing,
  })

export const SelectOptionG = makeGetters (SelectOptionCreator)

export const createSelectOption: PartialMaybeFunction<SelectionObject> = SelectOptionCreator

const SpecializationSelectionCreator =
  fromDefault<SpecializationSelection> ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    sid: '',
  })

export const SpecializationSelectionG = makeGetters (SpecializationSelectionCreator)

export const createSpecializationSelection =
  (id: string | List<string>) => SpecializationSelectionCreator ({ sid: id })

const RemoveSpecializationSelectionCreator =
  fromDefault<RemoveSpecializationSelection> ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    active: false,
  })

export const RemoveSpecializationSelectionG = makeGetters (RemoveSpecializationSelectionCreator)

export const createRemoveSpecializationSelection = () => RemoveSpecializationSelectionCreator ({ })

const LanguagesScriptsSelectionCreator =
  fromDefault<LanguagesScriptsSelection> ({
    id: ProfessionSelectionIds.LANGUAGES_SCRIPTS,
    value: 0,
  })

export const LanguagesScriptsSelectionG = makeGetters (LanguagesScriptsSelectionCreator)

export const createLanguagesScriptsSelection =
  (points: number) => LanguagesScriptsSelectionCreator ({ value: points })

const CombatTechniquesSelectionCreator =
  fromDefault<CombatTechniquesSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES,
    amount: 0,
    value: 0,
    sid: List.empty,
  })

export const CombatTechniquesSelectionG = makeGetters (CombatTechniquesSelectionCreator)

export const createCombatTechniquesSelection: RequiredExceptIdFunction<CombatTechniquesSelection> =
  CombatTechniquesSelectionCreator

const RemoveCombatTechniquesSelectionCreator =
  fromDefault<RemoveCombatTechniquesSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES,
    active: false,
  })

export const RemoveCombatTechniquesSelectionG = makeGetters (RemoveCombatTechniquesSelectionCreator)

export const createRemoveCombatTechniquesSelection =
  () => RemoveCombatTechniquesSelectionCreator ({ })

const CombatTechniquesSecondSelectionCreator =
  fromDefault<CombatTechniquesSecondSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    amount: 0,
    value: 0,
    sid: List.empty,
  })

export const CombatTechniquesSecondSelectionG = makeGetters (CombatTechniquesSecondSelectionCreator)

export const createCombatTechniquesSecondSelection:
  RequiredExceptIdFunction<CombatTechniquesSecondSelection> =
    CombatTechniquesSecondSelectionCreator

const RemoveCombatTechniquesSecondSelectionCreator =
  fromDefault<RemoveCombatTechniquesSecondSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    active: false,
  })

export const RemoveCombatTechniquesSecondSelectionG =
  makeGetters (RemoveCombatTechniquesSecondSelectionCreator)

export const createRemoveCombatTechniquesSecondSelection =
  () => RemoveCombatTechniquesSecondSelectionCreator ({ })

const CantripsSelectionCreator =
  fromDefault<CantripsSelection> ({
    id: ProfessionSelectionIds.CANTRIPS,
    amount: 0,
    sid: List.empty,
  })

export const CantripsSelectionG = makeGetters (CantripsSelectionCreator)

export const createCantripsSelection:
  RequiredExceptIdFunction<CantripsSelection> =
    CantripsSelectionCreator

const CursesSelectionCreator =
  fromDefault<CursesSelection> ({
    id: ProfessionSelectionIds.CURSES,
    value: 0,
  })

export const CursesSelectionG = makeGetters (CursesSelectionCreator)

export const createCursesSelection =
  (points: number) => CursesSelectionCreator ({ value: points })

const SkillsSelectionCreator =
  fromDefault<SkillsSelection> ({
    id: ProfessionSelectionIds.SKILLS,
    value: 0,
    gr: Nothing,
  })

export const SkillsSelectionG = makeGetters (SkillsSelectionCreator)

export const createSkillsSelectionWithGroup =
  (gr: Maybe<number>) => (points: number) => SkillsSelectionCreator ({ value: points, gr })

const TerrainKnowledgeSelectionCreator =
  fromDefault<TerrainKnowledgeSelection> ({
    id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE,
    sid: List.empty,
  })

export const TerrainKnowledgeSelectionG = makeGetters (TerrainKnowledgeSelectionCreator)

export const createTerrainKnowledgeSelection =
  (options: List<number>) => TerrainKnowledgeSelectionCreator ({ sid: options })

const AttributeCreator =
  fromDefault<Attribute> ({
    id: '',
    name: '',
    short: '',
    category: Categories.ATTRIBUTES,
  })

export const AttributeG = makeGetters (AttributeCreator)

export const createAttribute: RequiredExceptCategoryFunction<Attribute> =
  AttributeCreator

const CombatTechniqueCreator =
  fromDefault<CombatTechnique> ({
    id: '',
    name: '',
    category: Categories.COMBAT_TECHNIQUES,
    gr: 0,
    ic: 0,
    bf: 0,
    primary: List.empty,
    special: Nothing,
    src: List.empty,
  })

export const CombatTechniqueG = makeGetters (CombatTechniqueCreator)

export const createCombatTechnique: RequiredExceptCategoryFunction<CombatTechnique> =
  CombatTechniqueCreator

const LiturgicalChantCreator =
  fromDefault<LiturgicalChant> ({
    id: '',
    name: '',
    aspects: List.empty,
    category: Categories.LITURGIES,
    check: List.empty,
    checkmod: Nothing,
    gr: 0,
    ic: 0,
    tradition: List.empty,
    effect: '',
    castingTime: '',
    castingTimeShort: '',
    cost: '',
    costShort: '',
    range: '',
    rangeShort: '',
    duration: '',
    durationShort: '',
    target: '',
    src: List.empty,
  })

export const LiturgicalChantG = makeGetters (LiturgicalChantCreator)

export const createLiturgicalChant: RequiredExceptCategoryFunction<LiturgicalChant> =
  LiturgicalChantCreator

const BlessingCreator =
  fromDefault<Blessing> ({
    id: '',
    name: '',
    aspects: List.empty,
    tradition: List.empty,
    category: Categories.BLESSINGS,
    effect: '',
    range: '',
    duration: '',
    target: '',
    src: List.empty,
  })

export const BlessingG = makeGetters (BlessingCreator)

export const createBlessing: RequiredExceptCategoryFunction<Blessing> =
  BlessingCreator

const SpellCreator =
  fromDefault<Spell> ({
    id: '',
    name: '',
    category: Categories.SPELLS,
    check: List.empty,
    checkmod: Nothing,
    gr: 0,
    ic: 0,
    property: 0,
    tradition: List.empty,
    subtradition: List.empty,
    prerequisites: List.empty,
    effect: '',
    castingTime: '',
    castingTimeShort: '',
    cost: '',
    costShort: '',
    range: '',
    rangeShort: '',
    duration: '',
    durationShort: '',
    target: '',
    src: List.empty,
  })

export const SpellG = makeGetters (SpellCreator)

export const createSpell: RequiredExceptCategoryFunction<Spell> =
  SpellCreator

const CantripCreator =
  fromDefault<Cantrip> ({
    id: '',
    name: '',
    property: 0,
    tradition: List.empty,
    category: Categories.CANTRIPS,
    effect: '',
    range: '',
    duration: '',
    target: '',
    note: Nothing,
    src: List.empty,
  })

export const CantripG = makeGetters (CantripCreator)

export const createCantrip: RequiredExceptCategoryFunction<Cantrip> =
  CantripCreator

const SkillCreator =
  fromDefault<Skill> ({
    id: '',
    name: '',
    category: Categories.TALENTS,
    check: List.empty,
    encumbrance: '',
    gr: 0,
    ic: 0,
    applications: Nothing,
    applicationsInput: Nothing,
    tools: Nothing,
    quality: '',
    failed: '',
    critical: '',
    botch: '',
    src: '',
  })

export const SkillG = makeGetters (SkillCreator)

export const createSkill: RequiredExceptCategoryFunction<Skill> =
  SkillCreator

const ItemTemplateCreator =
  fromDefault<ItemTemplate> ({
    id: '',
    name: '',
    addPenalties: Nothing,
    ammunition: Nothing,
    amount: 1,
    armorType: Nothing,
    at: Nothing,
    combatTechnique: Nothing,
    damageBonus: Nothing,
    damageDiceNumber: Nothing,
    damageDiceSides: Nothing,
    damageFlat: Nothing,
    enc: Nothing,
    forArmorZoneOnly: Nothing,
    gr: 0,
    improvisedWeaponGroup: Nothing,
    iniMod: Nothing,
    isParryingWeapon: Nothing,
    isTemplateLocked: true,
    isTwoHandedWeapon: Nothing,
    length: Nothing,
    loss: Nothing,
    movMod: Nothing,
    pa: Nothing,
    price: Nothing,
    pro: Nothing,
    range: Nothing,
    reach: Nothing,
    reloadTime: Nothing,
    stabilityMod: Nothing,
    stp: Nothing,
    template: '',
    weight: Nothing,
    note: Nothing,
    rules: Nothing,
    advantage: Nothing,
    disadvantage: Nothing,
    src: List.empty,
  })

export const ItemTemplateG = makeGetters (ItemTemplateCreator)

export const createItemTemplate: RequiredFunction<ItemTemplate> =
  ItemTemplateCreator
