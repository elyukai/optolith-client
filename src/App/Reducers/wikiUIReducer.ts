import { ident } from "../../Data/Function";
import { set } from "../../Data/Lens";
import { Just, Maybe, Nothing } from "../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../Data/Record";
import { SetTabAction } from "../Actions/LocationActions";
import * as WikiActions from "../Actions/WikiActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { pipe } from "../Utilities/pipe";

type Action = SetTabAction
            | WikiActions.SetWikiCategory1Action
            | WikiActions.SetWikiCategory2Action
            | WikiActions.SetWikiFilterAction
            | WikiActions.SetWikiFilterAllAction
            | WikiActions.SetWikiCombatTechniquesGroupAction
            | WikiActions.SetWikiItemTemplatesGroupAction
            | WikiActions.SetWikiLiturgicalChantsGroupAction
            | WikiActions.SetWikiProfessionsGroupAction
            | WikiActions.SetWikiSkillsGroupAction
            | WikiActions.SetWikiSpecialAbilitiesGroupAction
            | WikiActions.SetWikiSpellsGroupAction

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

const L = makeLenses (UIWikiState)

export const wikiUIReducer =
  (action: Action): ident<Record<UIWikiState>> => {
    switch (action.type) {
      case ActionTypes.SET_WIKI_CATEGORY_1:
        return pipe (
          set (L.category1) (Just (action.payload.category)),
          set (L.category2) (Nothing),
          set (L.filter) ("")
        )

      case ActionTypes.SET_WIKI_CATEGORY_2:
        return set (L.category2) (Just (action.payload.category))

      case ActionTypes.SET_WIKI_FILTER:
        return set (L.filter) (action.payload.filterText)

      case ActionTypes.SET_WIKI_FILTER_ALL:
        return set (L.filterAll) (action.payload.filterText)

      case ActionTypes.SET_WIKI_COMBAT_TECHNIQUES_GROUP:
        return set (L.combatTechniquesGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_ITEM_TEMPLATES_GROUP:
        return set (L.itemTemplatesGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_LITURGICAL_CHANTS_GROUP:
        return set (L.liturgicalChantsGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_PROFESSIONS_GROUP:
        return set (L.professionsGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_SKILLS_GROUP:
        return set (L.skillsGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_SPECIAL_ABILITIES_GROUP:
        return set (L.specialAbilitiesGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_SPELLS_GROUP:
        return set (L.spellsGroup) (action.payload.group)

      default:
        return ident
    }
  }
