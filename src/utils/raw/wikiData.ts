import { Categories } from '../../constants/Categories';
import { CommonProfessionObject, Culture, Die, ExperienceLevel, IncreaseSkill, NameBySex, Profession, Race, RaceVariant, SourceLink } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromBoth } from '../structures/Pair';
import { fromDefault, makeGetters, Omit, Record } from '../structures/Record';

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

export const createExperienceLevel: (x: Required<ExperienceLevel>) => Record<ExperienceLevel> =
  ExperienceLevelCreator

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

export const createRace: (x: Omit<Race, 'category'>) => Record<Race> = RaceCreator

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

export const createRaceVariant: (x: Omit<RaceVariant, 'category'>) => Record<RaceVariant> =
  RaceVariantCreator

const CommonProfessionObjectCreator =
  fromDefault<CommonProfessionObject> ({
    list: List.empty,
    reverse: false,
  })

export const CommonProfessionObjectG = makeGetters (CommonProfessionObjectCreator)

export const createCommonProfessionObject:
  (x: Required<CommonProfessionObject>) => Record<CommonProfessionObject> =
    CommonProfessionObjectCreator

const IncreaseSkillCreator =
  fromDefault<IncreaseSkill> ({
    id: '',
    value: 0,
  })

export const IncreaseSkillG = makeGetters (IncreaseSkillCreator)

export const createIncreaseSkill: (x: Required<IncreaseSkill>) => Record<IncreaseSkill> =
  IncreaseSkillCreator

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

export const createCulture: (x: Omit<Culture, 'category'>) => Record<Culture> = CultureCreator

const NameBySexCreator =
  fromDefault<NameBySex> ({
    m: '',
    f: '',
  })

export const NameBySexG = makeGetters (NameBySexCreator)

export const createNameBySex: (x: Required<NameBySex>) => Record<NameBySex> = NameBySexCreator

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

export const createProfession: (x: Omit<Profession, 'category'>) => Record<Profession> =
  ProfessionCreator
