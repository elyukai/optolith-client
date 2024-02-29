import { useMemo } from "react"
import { arrayEqual, filterNonNullable } from "../../shared/utils/array.ts"
import { selectCanRemove } from "../selectors/characterSelectors.ts"
import { selectCurrentCulture } from "../selectors/cultureSelectors.ts"
import { selectCurrentRace } from "../selectors/raceSelectors.ts"
import { selectIsBlessedOne, selectIsSpellcaster } from "../selectors/traditionSelectors.ts"
import { selectIsCharacterCreationFinished } from "../slices/characterSlice.ts"
import { RoutePath, selectRoute } from "../slices/routeSlice.ts"
import { useAppSelector } from "./redux.ts"

type RouteGroupName =
  | "about"
  | "profile"
  | "race_culture_profession"
  | "advantages_disadvantages"
  | "abilities"
  | "belongings"

/**
 * A route can either be a single route or a collection of routes.
 */
export type DisplayRoute = SingleDisplayRoute | DisplayRouteGroup

/**
 * A single route.
 */
export type SingleDisplayRoute = {
  type: "single"
  route: RoutePath
}

/**
 * A group of routes with a group name.
 */
export type DisplayRouteGroup = {
  type: "group"
  name: RouteGroupName
  routes: RoutePath[]
}

const mainHierarchy: DisplayRoute[] = [
  {
    type: "single",
    route: ["characters"],
  },
  {
    type: "single",
    route: ["groups"],
  },
  {
    type: "single",
    route: ["library"],
  },
  {
    type: "single",
    route: ["faq"],
  },
  {
    type: "group",
    name: "about",
    routes: [["imprint"], ["third_party_licenses"], ["last_changes"]],
  },
]

type Section = "main" | "character"

/**
 * A hook that returns the currently visible tabs.
 */
export const useVisibleTabs = () => {
  const currentRoute = useAppSelector(selectRoute)

  // TODO: Replace these with real values
  const phase = 3 as number
  const isHitZoneArmorEnabled = true as boolean
  const arePactsAvailable = true as boolean
  const isCharacterCreationFinished = useAppSelector(selectIsCharacterCreationFinished)
  const isRemovingEnabled = useAppSelector(selectCanRemove)
  const isRaceSelected = useAppSelector(selectCurrentRace) !== undefined
  const isCultureSelected = useAppSelector(selectCurrentCulture) !== undefined
  const isSpellcaster = useAppSelector(selectIsSpellcaster)
  const isBlessedOne = useAppSelector(selectIsBlessedOne)

  const characterId = currentRoute[0] === "characters" ? currentRoute[1] : undefined

  const characterHierarchy = useMemo(
    (): DisplayRoute[] =>
      characterId === undefined
        ? []
        : filterNonNullable([
            {
              type: "group",
              name: "profile",
              routes: filterNonNullable([
                "profile" as const,
                // "personal_data",
                isCharacterCreationFinished ? ("character_sheet" as const) : undefined,
                arePactsAvailable ? ("pact" as const) : undefined, // "US25102", "US25008"
                "rules" as const,
              ]).map(route => ["characters", characterId, route]),
            },
            phase === 1
              ? {
                  type: "group",
                  name: "race_culture_profession",
                  routes: filterNonNullable([
                    "race" as const,
                    isRaceSelected ? ("culture" as const) : undefined,
                    isRaceSelected && isCultureSelected ? ("profession" as const) : undefined,
                  ]).map(route => ["characters", characterId, route]),
                }
              : undefined,
            phase > 1
              ? {
                  type: "single",
                  route: ["characters", characterId, "attributes"],
                }
              : undefined,
            phase > 1 || isRemovingEnabled
              ? {
                  type: "group",
                  name: "advantages_disadvantages",
                  routes: ["advantages" as const, "disadvantages" as const].map(route => [
                    "characters",
                    characterId,
                    route,
                  ]),
                }
              : undefined,
            phase > 1
              ? {
                  type: "group",
                  name: "abilities",
                  routes: filterNonNullable([
                    "skills" as const,
                    "combat_techniques" as const,
                    "special_abilities" as const,
                    isSpellcaster ? ("spells" as const) : undefined,
                    isBlessedOne ? ("liturgical_chants" as const) : undefined,
                  ]).map(route => ["characters", characterId, route]),
                }
              : undefined,
            phase > 1
              ? {
                  type: "group",
                  name: "belongings",
                  routes: filterNonNullable([
                    "equipment" as const,
                    isHitZoneArmorEnabled ? ("hit_zone_armor" as const) : undefined,
                    "pets" as const,
                  ]).map(route => ["characters", characterId, route]),
                }
              : undefined,
          ]),
    [
      characterId,
      isCharacterCreationFinished,
      arePactsAvailable,
      isRaceSelected,
      isCultureSelected,
      isRemovingEnabled,
      isSpellcaster,
      isBlessedOne,
      isHitZoneArmorEnabled,
    ],
  )

  const hierarchies: [Section, DisplayRoute[]][] = [
    ["main", mainHierarchy],
    ["character", characterHierarchy],
  ]

  const isInDisplayRoute = (route: RoutePath, tab: DisplayRoute) =>
    tab.type === "single"
      ? arrayEqual(tab.route, route)
      : tab.routes.some(subroute => arrayEqual(subroute, route))

  const isInHierarchy = (route: RoutePath, hierarchy: DisplayRoute[]) =>
    hierarchy.some(tab => isInDisplayRoute(route, tab))

  const getHierarchyByRoute = (route: RoutePath) =>
    hierarchies.find(hierarchy => isInHierarchy(route, hierarchy[1]))

  const currentHierarchy = getHierarchyByRoute(currentRoute) ?? ["main", mainHierarchy]

  const currentDisplayRoute = currentHierarchy[1]?.find(tab => isInDisplayRoute(currentRoute, tab))

  return {
    section: currentHierarchy[0],
    mainTabs: currentHierarchy[1],
    subTabs: currentDisplayRoute?.type === "group" ? currentDisplayRoute.routes : undefined,
  }
}
