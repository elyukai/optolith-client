import { FC } from "react"
import { DisplayRoute } from "../hooks/visibleTabs.ts"
import { NavigationBarTab } from "./NavigationBarTab.tsx"
import "./NavigationBarTabs.scss"

type Props = {
  tabs: DisplayRoute[]
}

/**
 * Returns a navigation bar section for displaying navigation tabs.
 */
export const NavigationBarTabs: FC<Props> = props => {
  const { tabs } = props

  return (
    <ul className="navigationbar-tabs">
      {tabs.map(displayRoute => (
        <NavigationBarTab
          key={displayRoute.type === "single" ? displayRoute.route.at(-1) : displayRoute.name}
          displayRoute={displayRoute}
        />
      ))}
    </ul>
  )
}
