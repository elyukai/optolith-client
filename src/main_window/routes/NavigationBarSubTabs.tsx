import { FC } from "react"
import { RoutePath } from "../slices/routeSlice.ts"
import "./NavigationBarSubTabs.scss"
import { NavigationBarTab } from "./NavigationBarTab.tsx"

interface Props {
  tabs: RoutePath[]
}

export const NavigationBarSubTabs: FC<Props> = props => {
  const { tabs } = props

  return (
    <ul className="navigationbar-subtabs">
      {tabs.map(displayRoute => (
        <NavigationBarTab
          key={displayRoute.at(-1)}
          displayRoute={{ type: "single", route: displayRoute }}
          />
      ))}
    </ul>
  )
}
