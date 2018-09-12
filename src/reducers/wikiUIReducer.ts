import { SetTabAction } from '../actions/LocationActions';
import { SetWikiCategory1Action, SetWikiCategory2Action, SetWikiCombatTechniquesGroupAction, SetWikiFilterAction, SetWikiFilterAllAction, SetWikiItemTemplatesGroupAction, SetWikiLiturgicalChantsGroupAction, SetWikiProfessionsGroupAction, SetWikiSkillsGroupAction, SetWikiSpecialAbilitiesGroupAction, SetWikiSpellsGroupAction } from '../actions/WikiActions';
import { ActionTypes } from '../constants/ActionTypes';
import { Nothing, Record } from '../utils/dataUtils';

type Action =
  SetTabAction |
  SetWikiCategory1Action |
  SetWikiCategory2Action |
  SetWikiFilterAction |
  SetWikiFilterAllAction |
  SetWikiCombatTechniquesGroupAction |
  SetWikiItemTemplatesGroupAction |
  SetWikiLiturgicalChantsGroupAction |
  SetWikiProfessionsGroupAction |
  SetWikiSkillsGroupAction |
  SetWikiSpecialAbilitiesGroupAction |
  SetWikiSpellsGroupAction;

export interface UIWikiState {
  filter: string;
  filterAll: string;
  category1?: string;
  category2?: string;
  professionsGroup?: number;
  skillsGroup?: number;
  combatTechniquesGroup?: number;
  specialAbilitiesGroup?: number;
  spellsGroup?: number;
  liturgicalChantsGroup?: number;
  itemTemplatesGroup?: number;
}

const initialState: Record<UIWikiState> = Record.of ({
  filter: '',
  filterAll: ''
});

export const wikiUIReducer = (
  state: Record<UIWikiState> = initialState,
  action: Action
): Record<UIWikiState> => {
  switch (action.type) {
    case ActionTypes.SET_WIKI_CATEGORY_1:
      return state
        .insert ('category1') (action.payload.category)
        .update (Nothing) ('category2')
        .insert ('filter') ('');

    case ActionTypes.SET_WIKI_CATEGORY_2:
      return state.insert ('category2') (action.payload.category);

    case ActionTypes.SET_WIKI_FILTER:
      return state.insert ('filter') (action.payload.filterText);

    case ActionTypes.SET_WIKI_FILTER_ALL:
      return state.insert ('filterAll') (action.payload.filterText);

    case ActionTypes.SET_WIKI_COMBAT_TECHNIQUES_GROUP:
      return state.insertMaybe ('combatTechniquesGroup') (action.payload.group);

    case ActionTypes.SET_WIKI_ITEM_TEMPLATES_GROUP:
      return state.insertMaybe ('itemTemplatesGroup') (action.payload.group);

    case ActionTypes.SET_WIKI_LITURGICAL_CHANTS_GROUP:
      return state.insertMaybe ('liturgicalChantsGroup') (action.payload.group);

    case ActionTypes.SET_WIKI_PROFESSIONS_GROUP:
      return state.insertMaybe ('professionsGroup') (action.payload.group);

    case ActionTypes.SET_WIKI_SKILLS_GROUP:
      return state.insertMaybe ('skillsGroup') (action.payload.group);

    case ActionTypes.SET_WIKI_SPECIAL_ABILITIES_GROUP:
      return state.insertMaybe ('specialAbilitiesGroup') (action.payload.group);

    case ActionTypes.SET_WIKI_SPELLS_GROUP:
      return state.insertMaybe ('spellsGroup') (action.payload.group);

    default:
      return state;
  }
}
