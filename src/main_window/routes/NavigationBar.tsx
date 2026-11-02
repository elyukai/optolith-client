import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { observer } from "mobx-react-lite"
import { useEffect, type FC, type ReactNode } from "react"
import { IconButton } from "../../shared/components/iconButton/IconButton.tsx"
import { useTranslate } from "../../shared/hooks/translate.ts"
import { ExternalAPI } from "../external.ts"
import { useAppSelector } from "../hooks/redux.ts"
import type { DisplayRoute } from "../hooks/visibleTabs.ts"
import { selectRoute, type RoutePath } from "../slices/routeSlice.ts"
import { NavigationBarBack } from "./NavigationBarBack.tsx"
import { NavigationBarLeft } from "./NavigationBarLeft.tsx"
import { NavigationBarRight } from "./NavigationBarRight.tsx"
import { NavigationBarSubTabs } from "./NavigationBarSubTabs.tsx"
import { NavigationBarTabs } from "./NavigationBarTabs.tsx"
import { NavigationBarWrapper } from "./NavigationBarWrapper.tsx"

// Inserting context bridge function directly into React components breaks.
const showSettings = () => ExternalAPI.showSettings()
const toggleDevTools = () => ExternalAPI.toggleDevTools()

/**
 * Returns a top navigation bar.
 */
export const NavigationBar: FC<{
  backToMainView?: () => void
  leftChildren?: ReactNode
  rightChildren?: ReactNode
  mainTabs: DisplayRoute[]
  subTabs?: RoutePath[]
}> = observer(({ backToMainView, leftChildren, rightChildren, mainTabs, subTabs }) => {
  const translate = useTranslate()
  const currentRoute = useAppSelector(selectRoute)

  useEffect(() => {
    switch (currentRoute[0]) {
      case "characters":
        return (() => {
          switch (currentRoute[2]) {
            case undefined:
              return ExternalAPI.setTitle(translate("Characters"))
            case "profile":
              return ExternalAPI.setTitle(translate("Overview"))
            case "personal_data":
              return ExternalAPI.setTitle(translate("Personal Data"))
            case "character_sheet":
              return ExternalAPI.setTitle(translate("Character Sheet"))
            case "pact":
              return ExternalAPI.setTitle(translate("Pact"))
            case "rules":
              return ExternalAPI.setTitle(translate("Rules"))
            case "race":
              return ExternalAPI.setTitle(translate("Race"))
            case "culture":
              return ExternalAPI.setTitle(translate("Culture"))
            case "profession":
              return ExternalAPI.setTitle(translate("Profession"))
            case "attributes":
              return ExternalAPI.setTitle(translate("Attributes"))
            case "advantages":
              return ExternalAPI.setTitle(translate("Advantages"))
            case "disadvantages":
              return ExternalAPI.setTitle(translate("Disadvantages"))
            case "skills":
              return ExternalAPI.setTitle(translate("Skills"))
            case "combat_techniques":
              return ExternalAPI.setTitle(translate("Combat Techniques"))
            case "special_abilities":
              return ExternalAPI.setTitle(translate("Special Abilities"))
            case "spells":
              return ExternalAPI.setTitle(translate("Spells"))
            case "liturgical_chants":
              return ExternalAPI.setTitle(translate("Liturgical Chants"))
            case "equipment":
              return ExternalAPI.setTitle(translate("Equipment"))
            case "hit_zone_armor":
              return ExternalAPI.setTitle(translate("Hit Zone Armor"))
            case "pets":
              return ExternalAPI.setTitle(translate("Pets"))
            default:
              return assertExhaustive(currentRoute[2])
          }
        })()

      case "groups":
        return ExternalAPI.setTitle(translate("Groups"))
      case "library":
        return ExternalAPI.setTitle(translate("Library"))
      case "faq":
        return ExternalAPI.setTitle(translate("FAQ"))

      case "imprint":
        return ExternalAPI.setTitle(translate("Imprint"))
      case "third_party_licenses":
        return ExternalAPI.setTitle(translate("Third-Party Licenses"))
      case "last_changes":
        return ExternalAPI.setTitle(translate("Last Changes"))

      default:
        return assertExhaustive(currentRoute)
    }
  }, [currentRoute, translate])

  return (
    <nav>
      <NavigationBarWrapper>
        <NavigationBarLeft>
          {backToMainView ? <NavigationBarBack handleSetTab={backToMainView} /> : null}
          {leftChildren}
          <NavigationBarTabs tabs={mainTabs} />
        </NavigationBarLeft>
        <NavigationBarRight>
          {rightChildren}
          {ExternalAPI.platform !== "darwin" ? (
            <IconButton icon="&#xE906;" label={translate("Show Settings")} onClick={showSettings} />
          ) : null}
          <IconButton
            icon="&#xE911;"
            label={translate("Toggle DevTools")}
            onClick={toggleDevTools}
          />
        </NavigationBarRight>
      </NavigationBarWrapper>
      {subTabs !== undefined && subTabs.length > 0 ? <NavigationBarSubTabs tabs={subTabs} /> : null}
    </nav>
  )
})
