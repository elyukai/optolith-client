import { Categories } from '../../constants/Categories';
import { Culture, EntryWithCategory } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

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

export const createCulture =
  (xs: Omit<Culture, 'category'>) => CultureCreator ({
    ...xs,
    category: Categories.CULTURES,
  })

export const isCulture =
  (r: EntryWithCategory) => CultureG.category (r) === Categories.CULTURES
