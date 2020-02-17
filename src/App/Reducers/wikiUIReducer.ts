import { ident } from "../../Data/Function"
import { set } from "../../Data/Lens"
import { Just, Nothing } from "../../Data/Maybe"
import { Record } from "../../Data/Record"
import { SetTabAction } from "../Actions/LocationActions"
import * as WikiActions from "../Actions/WikiActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { UIWikiState, UIWikiStateL } from "../Models/UIWikiState"
import { pipe } from "../Utilities/pipe"

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

export const wikiUIReducer =
  (action: Action): ident<Record<UIWikiState>> => {
    switch (action.type) {
      case ActionTypes.SET_WIKI_CATEGORY_1:
        return pipe (
          set (UIWikiStateL.category1) (Just (action.payload.category)),
          set (UIWikiStateL.category2) (Nothing),
          set (UIWikiStateL.filter) ("")
        )

      case ActionTypes.SET_WIKI_CATEGORY_2:
        return set (UIWikiStateL.category2) (Just (action.payload.category))

      case ActionTypes.SET_WIKI_FILTER:
        return set (UIWikiStateL.filter) (action.payload.filterText)

      case ActionTypes.SET_WIKI_FILTER_ALL:
        return set (UIWikiStateL.filterAll) (action.payload.filterText)

      case ActionTypes.SET_WIKI_COMBAT_TECHNIQUES_GROUP:
        return set (UIWikiStateL.combatTechniquesGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_ITEM_TEMPLATES_GROUP:
        return set (UIWikiStateL.itemTemplatesGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_LITURGICAL_CHANTS_GROUP:
        return set (UIWikiStateL.liturgicalChantsGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_PROFESSIONS_GROUP:
        return set (UIWikiStateL.professionsGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_SKILLS_GROUP:
        return set (UIWikiStateL.skillsGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_SPECIAL_ABILITIES_GROUP:
        return set (UIWikiStateL.specialAbilitiesGroup) (action.payload.group)

      case ActionTypes.SET_WIKI_SPELLS_GROUP:
        return set (UIWikiStateL.spellsGroup) (action.payload.group)

      default:
        return ident
    }
  }
