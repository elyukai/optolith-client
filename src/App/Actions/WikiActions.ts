import { Maybe } from "../../Data/Maybe";
import { ActionTypes } from "../Constants/ActionTypes";

export interface SetWikiFilterAction {
  type: ActionTypes.SET_WIKI_FILTER
  payload: {
    filterText: string;
  }
}

export const setWikiFilter = (filterText: string): SetWikiFilterAction => ({
  type: ActionTypes.SET_WIKI_FILTER,
  payload: {
    filterText,
  },
})

export interface SetWikiFilterAllAction {
  type: ActionTypes.SET_WIKI_FILTER_ALL
  payload: {
    filterText: string;
  }
}

export const setWikiFilterAll = (filterText: string): SetWikiFilterAllAction => ({
  type: ActionTypes.SET_WIKI_FILTER_ALL,
  payload: {
    filterText,
  },
})

export interface SetWikiCategory1Action {
  type: ActionTypes.SET_WIKI_CATEGORY_1
  payload: {
    category: string;
  }
}

export const setWikiCategory1 = (category: string): SetWikiCategory1Action => ({
  type: ActionTypes.SET_WIKI_CATEGORY_1,
  payload: {
    category,
  },
})

export interface SetWikiCategory2Action {
  type: ActionTypes.SET_WIKI_CATEGORY_2
  payload: {
    category: string;
  }
}

export const setWikiCategory2 = (category: string): SetWikiCategory2Action => ({
  type: ActionTypes.SET_WIKI_CATEGORY_2,
  payload: {
    category,
  },
})

export interface SetWikiProfessionsGroupAction {
  type: ActionTypes.SET_WIKI_PROFESSIONS_GROUP
  payload: {
    group: Maybe<number>;
  }
}

export const setWikiProfessionsGroup =
  (group: Maybe<number>): SetWikiProfessionsGroupAction => ({
    type: ActionTypes.SET_WIKI_PROFESSIONS_GROUP,
    payload: {
      group,
    },
  })

export interface SetWikiSkillsGroupAction {
  type: ActionTypes.SET_WIKI_SKILLS_GROUP
  payload: {
    group: Maybe<number>;
  }
}

export const setWikiSkillsGroup = (group: Maybe<number>): SetWikiSkillsGroupAction => ({
  type: ActionTypes.SET_WIKI_SKILLS_GROUP,
  payload: {
    group,
  },
})

export interface SetWikiCombatTechniquesGroupAction {
  type: ActionTypes.SET_WIKI_COMBAT_TECHNIQUES_GROUP
  payload: {
    group: Maybe<number>;
  }
}

export const setWikiCombatTechniquesGroup =
  (group: Maybe<number>): SetWikiCombatTechniquesGroupAction => ({
    type: ActionTypes.SET_WIKI_COMBAT_TECHNIQUES_GROUP,
    payload: {
      group,
    },
  })

export interface SetWikiSpecialAbilitiesGroupAction {
  type: ActionTypes.SET_WIKI_SPECIAL_ABILITIES_GROUP
  payload: {
    group: Maybe<number>;
  }
}

export const setWikiSpecialAbilitiesGroup =
  (group: Maybe<number>): SetWikiSpecialAbilitiesGroupAction => ({
    type: ActionTypes.SET_WIKI_SPECIAL_ABILITIES_GROUP,
    payload: {
      group,
    },
  })

export interface SetWikiSpellsGroupAction {
  type: ActionTypes.SET_WIKI_SPELLS_GROUP
  payload: {
    group: Maybe<number>;
  }
}

export const setWikiSpellsGroup = (group: Maybe<number>): SetWikiSpellsGroupAction => ({
  type: ActionTypes.SET_WIKI_SPELLS_GROUP,
  payload: {
    group,
  },
})

export interface SetWikiLiturgicalChantsGroupAction {
  type: ActionTypes.SET_WIKI_LITURGICAL_CHANTS_GROUP
  payload: {
    group: Maybe<number>;
  }
}

export const setWikiLiturgicalChantsGroup =
  (group: Maybe<number>): SetWikiLiturgicalChantsGroupAction => ({
    type: ActionTypes.SET_WIKI_LITURGICAL_CHANTS_GROUP,
    payload: {
      group,
    },
  })

export interface SetWikiItemTemplatesGroupAction {
  type: ActionTypes.SET_WIKI_ITEM_TEMPLATES_GROUP
  payload: {
    group: Maybe<number>;
  }
}

export const setWikiItemTemplatesGroup =
  (group: Maybe<number>): SetWikiItemTemplatesGroupAction => ({
    type: ActionTypes.SET_WIKI_ITEM_TEMPLATES_GROUP,
    payload: {
      group,
    },
  })
