import { Categories } from '../../constants/Categories';
import { Culture } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredExceptCategoryFunction } from './sub/typeHelpers';

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
