import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store.ts"

export type Route =
  | "characters"
  | "groups"
  | "library"
  | "faq"
  | "imprint"
  | "third_party_licenses"
  | "last_changes"
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

type RouteState = {
  route: Route
}

const initialRouteState: RouteState = {
  route: "attributes",
}

const routeSlice = createSlice({
  name: "route",
  initialState: initialRouteState,
  reducers: {
    goToTab: (state, action: PayloadAction<Route>) => {
      state.route = action.payload
    },
    goToTabGroup: (state, action: PayloadAction<Route[]>) => {
      const [ firstRoute ] = action.payload
      if (firstRoute !== undefined) {
        state.route = firstRoute
      }
    },
  },
})

export const { goToTab, goToTabGroup } = routeSlice.actions

export const selectRoute = (state: RootState) => state.route.route

export const routeReducer = routeSlice.reducer
