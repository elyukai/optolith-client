import { useSelector } from "react-redux"
import { Route, selectRoute } from "../slices/routeSlice.ts"
// import { isBookEnabled, sourceBooksPairToTuple } from "../Utilities/RulesUtils"
// import { getIsLiturgicalChantsTabAvailable } from "./liturgicalChantsSelectors"
// import { getIsRemovingEnabled } from "./phaseSelectors"
// import { getRuleBooksEnabledM } from "./rulesSelectors"
// import { getIsSpellsTabAvailable } from "./spellsSelectors"
// import { getCurrentCultureId, getCurrentPhase, getCurrentTab, getRaceIdM, getWiki } from "./stateSelectors"
import { useMemo } from "react"
import { filterNonNullable } from "../../shared/utils/array.ts"

type RouteGroupName =
  | "about"
  | "profile"
  | "race_culture_profession"
  | "advantages_disadvantages"
  | "abilities"
  | "belongings"

export type DisplayRoute =
  | SingleDisplayRoute
  | DisplayRouteGroup

export type SingleDisplayRoute = {
  type: "single"
  route: Route
}

export type DisplayRouteGroup = {
  type: "group"
  name: RouteGroupName
  routes: Route[]
}

const mainHierarchy: DisplayRoute[] = [
  {
    type: "single",
    route: "characters",
  },
  {
    type: "single",
    route: "groups",
  },
  {
    type: "single",
    route: "library",
  },
  {
    type: "single",
    route: "faq",
  },
  {
    type: "group",
    name: "about",
    routes: [
      "imprint",
      "third_party_licenses",
      "last_changes",
    ],
  },
]

type Section = "main" | "character"

export const useVisibleTabs = () => {
  const currentRoute = useSelector(selectRoute)

  // TODO: Replace these with real values
  const phase = 3 as number
  const isHitZoneArmorEnabled = true as boolean
  const arePactsAvailable = true as boolean
  const isRemovingEnabled = true as boolean
  const isRaceSelected = true as boolean
  const isCultureSelected = true as boolean
  const isSpellcaster = true as boolean
  const isBlessedOne = true as boolean

  const characterHierarchy = useMemo(
    (): DisplayRoute[] => filterNonNullable([
      {
        type: "group",
        name: "profile",
        routes: filterNonNullable([
          "profile",
          // "personal_data",
          phase === 3 ? "character_sheet" : undefined,
          phase > 1 && arePactsAvailable ? "pact" : undefined, // "US25102", "US25008")
          "rules",
        ]),
      },
      phase === 1
        ? {
          type: "group",
          name: "race_culture_profession",
          routes: filterNonNullable([
            "race",
            isRaceSelected ? "culture" : undefined,
            isRaceSelected && isCultureSelected ? "profession" : undefined,
          ]),
        }
        : undefined,
      phase > 1
        ? {
          type: "single",
          route: "attributes",
        }
        : undefined,
      phase > 1 || isRemovingEnabled
        ? {
          type: "group",
          name: "advantages_disadvantages",
          routes: [
            "advantages",
            "disadvantages",
          ],
        }
        : undefined,
      phase > 1
        ? {
          type: "group",
          name: "abilities",
          routes: filterNonNullable([
            "skills",
            "combat_techniques",
            "special_abilities",
            isSpellcaster ? "spells" : undefined,
            isBlessedOne ? "liturgical_chants" : undefined,
          ]),
        }
        : undefined,
      phase > 1
        ? {
          type: "group",
          name: "belongings",
          routes: filterNonNullable([
            "equipment",
            isHitZoneArmorEnabled ? "hit_zone_armor" : undefined,
            "pets",
          ]),
        }
        : undefined,
    ]),
    [
      isHitZoneArmorEnabled,
      isRemovingEnabled,
      phase,
      arePactsAvailable,
      isRaceSelected,
      isCultureSelected,
      isSpellcaster,
      isBlessedOne,
    ]
  )

  const hierarchies: [Section, DisplayRoute[]][] = [
    [ "main", mainHierarchy ],
    [ "character", characterHierarchy ],
  ]

  const isInDisplayRoute = (route: Route, tab: DisplayRoute) =>
    tab.type === "single" ? tab.route === route : tab.routes.includes(route)

  const isInHierarchy = (route: Route, hierarchy: DisplayRoute[]) =>
    hierarchy.some(tab => isInDisplayRoute(route, tab))

  const getHierarchyByRoute = (route: Route) =>
    hierarchies.find(hierarchy => isInHierarchy(route, hierarchy[1]))

  const currentHierarchy = getHierarchyByRoute(currentRoute) ?? [ "main", mainHierarchy ]

  const currentDisplayRoute = currentHierarchy[1]?.find(tab => isInDisplayRoute(currentRoute, tab))

  return {
    section: currentHierarchy[0],
    mainTabs: currentHierarchy[1],
    subTabs: currentDisplayRoute?.type === "group" ? currentDisplayRoute.routes : undefined,
  }
}
