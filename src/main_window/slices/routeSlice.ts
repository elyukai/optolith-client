import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store.ts"

/**
 * Possible routes.
 */
export type RoutePath =
  | ["characters"]
  | ["characters", string, "profile"]
  | ["characters", string, "personal_data"]
  | ["characters", string, "character_sheet"]
  | ["characters", string, "pact"]
  | ["characters", string, "rules"]
  | ["characters", string, "race"]
  | ["characters", string, "culture"]
  | ["characters", string, "profession"]
  | ["characters", string, "attributes"]
  | ["characters", string, "advantages"]
  | ["characters", string, "disadvantages"]
  | ["characters", string, "skills"]
  | ["characters", string, "combat_techniques"]
  | ["characters", string, "special_abilities"]
  | ["characters", string, "spells"]
  | ["characters", string, "liturgical_chants"]
  | ["characters", string, "equipment"]
  | ["characters", string, "hit_zone_armor"]
  | ["characters", string, "pets"]
  | ["groups"]
  | ["library"]
  | ["faq"]
  | ["imprint"]
  | ["third_party_licenses"]
  | ["last_changes"]

/**
 * The sub-state for routes.
 */
export type RouteState = {
  path: RoutePath
}

const initialState: RouteState = {
  path: ["characters", "550e8400-e29b-11d4-a716-446655440000", "special_abilities"],
}

const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {
    /**
     * Action to go to a specific tab.
     */
    goToTab: (state, action: PayloadAction<RoutePath>) => {
      state.path = action.payload
    },
    /**
     * Action to go to a specific tab group.
     */
    goToTabGroup: (state, action: PayloadAction<RoutePath[]>) => {
      const [firstRoute] = action.payload
      if (firstRoute !== undefined) {
        state.path = firstRoute
      }
    },
  },
})

// eslint-disable-next-line jsdoc/require-jsdoc
export const { goToTab, goToTabGroup } = routeSlice.actions

/**
 * Selects the current route from the state.
 */
export const selectRoute = (state: RootState) => state.route.path

/**
 * Selects the selected character identifier from the state.
 */
export const selectSelectedCharacterId = (state: RootState) =>
  state.route.path[0] === "characters" ? state.route.path[1] : undefined

/**
 * The state reducer for routes.
 */
export const routeReducer = routeSlice.reducer
