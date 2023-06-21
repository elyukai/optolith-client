import { ActionReducerMapBuilder, createAction } from "@reduxjs/toolkit"
import { CharacterState } from "./characterSlice.ts"

export const switchIncludeAllPublications = createAction("rules/switchIncludeAllPublications")
export const switchIncludePublication = createAction<number>("rules/switchIncludePublication")
export const switchFocusRule = createAction<number>("rules/switchFocusRule")
export const switchOptionalRule = createAction<number>("rules/switchOptionalRule")

export const rulesReducer = (builder: ActionReducerMapBuilder<CharacterState>) =>
  builder
    .addCase(switchIncludeAllPublications, (state, _action) => {
      state.rules.includeAllPublications = !state.rules.includeAllPublications
    })
    .addCase(switchIncludePublication, (state, action) => {
      const index = state.rules.includePublications.indexOf(action.payload)
      if (index === -1) {
        state.rules.includePublications.push(action.payload)
      }
      else {
        state.rules.includePublications.splice(index, 1)
      }
    })
    .addCase(switchFocusRule, (state, action) => {
      if (Object.hasOwn(state.rules.activeFocusRules, action.payload)) {
        delete state.rules.activeFocusRules[action.payload]
      }
      else {
        state.rules.activeFocusRules[action.payload] = {
          id: action.payload,
        }
      }
    })
    .addCase(switchOptionalRule, (state, action) => {
      if (Object.hasOwn(state.rules.activeOptionalRules, action.payload)) {
        delete state.rules.activeOptionalRules[action.payload]
      }
      else {
        state.rules.activeOptionalRules[action.payload] = {
          id: action.payload,
        }
      }
    })
