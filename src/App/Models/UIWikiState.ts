import { Maybe, Nothing } from "../../Data/Maybe"
import { fromDefault, makeLenses } from "../../Data/Record"

export interface UIWikiState {
  "@@name": "UIWikiState"
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

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UIWikiState =
  fromDefault ("UIWikiState")
              <UIWikiState> ({
                filter: "",
                filterAll: "",
                category1: Nothing,
                category2: Nothing,
                professionsGroup: Nothing,
                skillsGroup: Nothing,
                combatTechniquesGroup: Nothing,
                specialAbilitiesGroup: Nothing,
                spellsGroup: Nothing,
                liturgicalChantsGroup: Nothing,
                itemTemplatesGroup: Nothing,
              })

export const UIWikiStateL = makeLenses (UIWikiState)
