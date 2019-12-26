import { Maybe } from "../../Data/Maybe";
import * as ActionTypes from "../Constants/ActionTypes";

export interface SetPactCategoryAction {
  type: ActionTypes.SET_PACT_CATEGORY
  payload: {
    category: Maybe<number>;
  }
}

export const setPactCategory = (category: Maybe<number>): SetPactCategoryAction => ({
  type: ActionTypes.SET_PACT_CATEGORY,
  payload: {
    category,
  },
})

export interface SetPactLevelAction {
  type: ActionTypes.SET_PACT_LEVEL
  payload: {
    level: number;
  }
}

export const setPactLevel = (level: number): SetPactLevelAction => ({
  type: ActionTypes.SET_PACT_LEVEL,
  payload: {
    level,
  },
})

export interface SetTargetTypeAction {
  type: ActionTypes.SET_TARGET_TYPE
  payload: {
    type: number;
  }
}

export const setPactTargetType = (type: number): SetTargetTypeAction => ({
  type: ActionTypes.SET_TARGET_TYPE,
  payload: {
    type,
  },
})

export interface SetTargetDomainAction {
  type: ActionTypes.SET_TARGET_DOMAIN
  payload: {
    domain: number | string;
  }
}

export const setPactTargetDomain = (domain: number | string): SetTargetDomainAction => ({
  type: ActionTypes.SET_TARGET_DOMAIN,
  payload: {
    domain,
  },
})

export interface SetTargetNameAction {
  type: ActionTypes.SET_TARGET_NAME
  payload: {
    name: string;
  }
}

export const setPactTargetName = (name: string): SetTargetNameAction => ({
  type: ActionTypes.SET_TARGET_NAME,
  payload: {
    name,
  },
})
