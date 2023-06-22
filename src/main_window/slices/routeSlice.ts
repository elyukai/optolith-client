import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store.ts"

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

export type RouteState = {
  path: RoutePath
}

const initialState: RouteState = {
  path: [ "characters" ],
}

const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {
    goToTab: (state, action: PayloadAction<RoutePath>) => {
      state.path = action.payload
    },
    goToTabGroup: (state, action: PayloadAction<RoutePath[]>) => {
      const [ firstRoute ] = action.payload
      if (firstRoute !== undefined) {
        state.path = firstRoute
      }
    },
  },
})

export const { goToTab, goToTabGroup } = routeSlice.actions

export const selectRoute = (state: RootState) => state.route.path
export const selectSelectedCharacterId = (state: RootState) =>
  state.route.path[0] === "characters"
  ? state.route.path[1]
  : undefined

export const routeReducer = routeSlice.reducer
