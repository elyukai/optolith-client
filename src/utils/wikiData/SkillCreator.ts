import { Categories } from '../../constants/Categories';
import { EntryWithCategory, Skill } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters, Omit } from '../structures/Record';

export const SkillCreator =
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

export const createSkill =
  (xs: Omit<Skill, 'category'>) => SkillCreator ({
    ...xs,
    category: Categories.ADVANTAGES,
  })

export const isSkill =
  (r: EntryWithCategory) => SkillG.category (r) === Categories.TALENTS
