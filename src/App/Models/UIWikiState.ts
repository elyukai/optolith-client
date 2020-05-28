import { Maybe } from "../../Data/Maybe"

export interface UIWikiState {
  filter: string
  filterAll: string
  category1: Maybe<string>
  category2: Maybe<string>
  professionsGroup: Maybe<number>
  skillsGroup: Maybe<number>
  combatTechniquesGroup: Maybe<number>
  specialAbilitiesGroup: Maybe<number>
  spellsGroup: Maybe<number>
  liturgicalChantsGroup: Maybe<number>
  itemTemplatesGroup: Maybe<number>
}
