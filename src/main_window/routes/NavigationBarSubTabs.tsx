import { FC } from "react"
import { Route } from "../slices/routeSlice.ts"
import "./NavigationBarSubTabs.scss"
import { NavigationBarTab } from "./NavigationBarTab.tsx"

interface Props {
  tabs: Route[]
}

export const NavigationBarSubTabs: FC<Props> = props => {
  const { tabs } = props

  return (
    <ul className="navigationbar-subtabs">
      {tabs.map(displayRoute => (
        <NavigationBarTab
          key={displayRoute}
          displayRoute={{ type: "single", route: displayRoute }}
          />
      ))}
    </ul>
  )
}
