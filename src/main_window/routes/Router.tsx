import { isEmpty } from "@elyukai/utils/array/nonEmpty"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { FC } from "react"
import { useAppSelector } from "../hooks/redux.ts"
import { mainHierarchy } from "../hooks/visibleTabs.ts"
import { selectRoute } from "../slices/routeSlice.ts"
import { Imprint } from "./about/Imprint.tsx"
import { LastChanges } from "./about/LastChanges.tsx"
import { ThirdPartyLicenses } from "./about/ThirdPartyLicenses.tsx"
import { CharacterRouter } from "./CharacterRouter.tsx"
import { Characters } from "./characters/Characters.tsx"
import { NavigationBar } from "./nav/NavigationBar.tsx"

/**
 * Returns a page based on the currently selected route.
 */
export const Router: FC = () => {
  const route = useAppSelector(selectRoute)

  switch (route[0]) {
    case "characters": {
      const [_, ...args] = route
      if (isEmpty(args)) {
        return (
          <>
            <NavigationBar mainTabs={mainHierarchy} />
            <Characters />
          </>
        )
      } else {
        return <CharacterRouter id={args[0]} characterRoute={args[1]} />
      }
    }

    case "groups":
      return (
        <>
          <NavigationBar mainTabs={mainHierarchy} />
          {/* <Grouplist /> */}
        </>
      )
    case "library":
      return (
        <>
          <NavigationBar mainTabs={mainHierarchy} />
          {/* <WikiContainer staticData={staticData} /> */}
        </>
      )
    case "faq":
      return (
        <>
          <NavigationBar mainTabs={mainHierarchy} />
          {/* <HelpContainer staticData={staticData} /> */}
        </>
      )

    case "imprint":
      return (
        <>
          <NavigationBar mainTabs={mainHierarchy} />
          <Imprint />
        </>
      )
    case "third_party_licenses":
      return (
        <>
          <NavigationBar mainTabs={mainHierarchy} />
          <ThirdPartyLicenses />
        </>
      )
    case "last_changes":
      return (
        <>
          <NavigationBar mainTabs={mainHierarchy} />
          <LastChanges />
        </>
      )

    default:
      return assertExhaustive(route)
  }
}
