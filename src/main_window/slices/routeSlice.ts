import { type PayloadAction, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../store.ts"

/**
 * Possible routes.
 */
export type RoutePath =
  | ["characters"]
  | ["characters", string, CharacterRoutePath]
  | ["groups"]
  | ["library"]
  | ["faq"]
  | ["imprint"]
  | ["third_party_licenses"]
  | ["last_changes"]

export type CharacterRoutePath =
  | "profile"
  | "personal_data"
  | "character_sheet"
  | "pact"
  | "rules"
  | "race"
  | "culture"
  | "profession"
  | "attributes"
  | "advantages"
  | "disadvantages"
  | "skills"
  | "combat_techniques"
  | "special_abilities"
  | "spells"
  | "liturgical_chants"
  | "equipment"
  | "hit_zone_armor"
  | "pets"

/**
 * The sub-state for routes.
 */
export type RouteState = {
  path: RoutePath
}

const initialState: RouteState = {
  path: ["characters"],
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
