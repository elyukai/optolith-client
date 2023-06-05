import { FC, useCallback } from "react"
import { Tab } from "../../shared/components/tab/Tab.tsx"
import { classList } from "../../shared/utils/classList.ts"
import { useAppDispatch, useAppSelector } from "../hooks/redux.ts"
import { useTranslate } from "../hooks/translate.ts"
import { DisplayRoute } from "../hooks/visibleTabs.ts"
import { goToTab, goToTabGroup, selectRoute } from "../slices/routeSlice.ts"
import "./NavigationBarTab.scss"

const routeTranslations = {
  characters: "Characters",
  groups: "Groups",
  library: "Library",
  faq: "FAQ",
  imprint: "Imprint",
  third_party_licenses: "Third-Party Licenses",
  last_changes: "Last Changes",
  profile: "Overview",
  personal_data: "Personal Data",
  character_sheet: "Character Sheet",
  pact: "Pact",
  rules: "Rules",
  race: "Race",
  culture: "Culture",
  profession: "Profession",
  attributes: "Attributes",
  advantages: "Advantages",
  disadvantages: "Disadvantages",
  skills: "Skills",
  combat_techniques: "Combat Techniques",
  special_abilities: "Special Abilities",
  spells: "Spells",
  liturgical_chants: "Liturgical Chants",
  equipment: "Equipment",
  hit_zone_armor: "Hit Zone Armor",
  pets: "Pets",
} as const

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
      ? displayRoute.route === route
      : displayRoute.routes.includes(route)

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
          ? routeTranslations[displayRoute.route]
          : groupTranslations[displayRoute.name]
      )}
      />
  )
}
