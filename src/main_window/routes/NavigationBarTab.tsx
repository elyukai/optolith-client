import { FC, useCallback } from "react"
import { Tab } from "../../shared/components/tab/Tab.tsx"
import { arrayEqual } from "../../shared/utils/array.ts"
import { classList } from "../../shared/utils/classList.ts"
import { assertExhaustive } from "../../shared/utils/typeSafety.ts"
import { useAppDispatch, useAppSelector } from "../hooks/redux.ts"
import { useTranslate } from "../hooks/translate.ts"
import { DisplayRoute } from "../hooks/visibleTabs.ts"
import { RoutePath, goToTab, goToTabGroup, selectRoute } from "../slices/routeSlice.ts"
import "./NavigationBarTab.scss"

const getRouteTranslation = (route: RoutePath) => {
  switch (route[0]) {
    case "characters": return (() => {
      switch (route[2]) {
        case undefined: return "Characters" as const
        case "profile": return "Overview" as const
        case "personal_data": return "Personal Data" as const
        case "character_sheet": return "Character Sheet" as const
        case "pact": return "Pact" as const
        case "rules": return "Rules" as const

        case "race": return "Race" as const
        case "culture": return "Culture" as const
        case "profession": return "Profession" as const

        case "attributes": return "Attributes" as const

        case "advantages": return "Advantages" as const
        case "disadvantages": return "Disadvantages" as const

        case "skills": return "Skills" as const
        case "combat_techniques": return "Combat Techniques" as const
        case "special_abilities": return "Special Abilities" as const
        case "spells": return "Spells" as const
        case "liturgical_chants": return "Liturgical Chants" as const

        case "equipment": return "Equipment" as const
        case "hit_zone_armor": return "Hit Zone Armor" as const
        case "pets": return "Pets" as const
        default: assertExhaustive(route)
      }
    })()

    case "groups": return "Groups" as const
    case "library": return "Library" as const
    case "faq": return "FAQ" as const

    case "imprint": return "Imprint" as const
    case "third_party_licenses": return "Third-Party Licenses" as const
    case "last_changes": return "Last Changes" as const

    default: assertExhaustive(route)
  }
}

const groupTranslations = {
  about: "About",
  profile: "Profile",
  race_culture_profession: "Race, Culture & Profession",
  advantages_disadvantages: "Advantages & Disadvantages",
  abilities: "Abilities",
  belongings: "Belongings",
} as const

type Props = {
  className?: string
  displayRoute: DisplayRoute
}

export const NavigationBarTab: FC<Props> = props => {
  const {
    className,
    displayRoute,
  } = props

  const translate = useTranslate()
  const route = useAppSelector(selectRoute)
  const dispatch = useAppDispatch()

  const isActive =
    displayRoute.type === "single"
      ? arrayEqual(displayRoute.route, route)
      : displayRoute.routes.some(subroute => arrayEqual(subroute, route))

  const handleClick = useCallback(
    () => {
      if (displayRoute.type === "single") {
        dispatch(goToTab(displayRoute.route))
      }
      else if (displayRoute.type === "group") {
        dispatch(goToTabGroup(displayRoute.routes))
      }
    },
    [ dispatch, displayRoute ]
  )

  return (
    <Tab
      active={isActive}
      onClick={handleClick}
      className={classList("nav-tab", className)}
      label={translate(
        displayRoute.type === "single"
          ? getRouteTranslation(displayRoute.route)
          : groupTranslations[displayRoute.name]
      )}
      />
  )
}
