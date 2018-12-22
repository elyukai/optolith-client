import { Categories } from '../../constants/Categories';
import { Culture, Die, ExperienceLevel, Race, RaceVariant, SourceLink } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromBoth } from '../structures/Pair';
import { fromDefault, makeGetters, makeLenses_, Omit, Record } from '../structures/Record';

const SourceLinkCreator =
  fromDefault<SourceLink> ({
    id: '',
    page: 0,
  })

export const SourceLinkG = makeGetters (SourceLinkCreator)
export const SourceLinkL = makeLenses_ (SourceLinkG) (SourceLinkCreator)

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
export const ExperienceLevelL = makeLenses_ (ExperienceLevelG) (ExperienceLevelCreator)

export const createExperienceLevel: (x: Required<ExperienceLevel>) => Record<ExperienceLevel> =
  ExperienceLevelCreator

const DieCreator =
  fromDefault<Die> ({
    amount: 0,
    sides: 0,
  })

export const DieG = makeGetters (DieCreator)
export const DieL = makeLenses_ (DieG) (DieCreator)

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
export const RaceL = makeLenses_ (RaceG) (RaceCreator)

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
export const RaceVariantL = makeLenses_ (RaceVariantG) (RaceVariantCreator)

export const createRaceVariant: (x: Omit<RaceVariant, 'category'>) => Record<RaceVariant> =
  RaceVariantCreator

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
    /**
     * Markdown supported.
     */
    commonNames: '',
    culturalPackageSkills: List.empty,
    category: Categories.CULTURES,
    src: List.empty,
  })

export const CultureG = makeGetters (CultureCreator)
export const CultureL = makeLenses_ (CultureG) (CultureCreator)

export const createCulture: (x: Omit<Culture, 'category'>) => Record<Culture> = CultureCreator
