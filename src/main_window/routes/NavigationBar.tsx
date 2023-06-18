import { FC, useEffect } from "react"
import { Button } from "../../shared/components/button/Button.tsx"
import { IconButton } from "../../shared/components/iconButton/IconButton.tsx"
import { TooltipToggle } from "../../shared/components/tooltipToggle/TooltipToggle.tsx"
import { assertExhaustive } from "../../shared/utils/typeSafety.ts"
import { ExternalAPI } from "../external.ts"
import { useAppSelector } from "../hooks/redux.ts"
import { useTranslate } from "../hooks/translate.ts"
import { useVisibleTabs } from "../hooks/visibleTabs.ts"
import { selectAdventurePointsAvailable } from "../selectors/adventurePointSelectors.ts"
import { selectRoute } from "../slices/routeSlice.ts"
import { AdventurePointsTooltip } from "./AdventurePointsTooltip.tsx"
import { NavigationBarLeft } from "./NavigationBarLeft.tsx"
import { NavigationBarRight } from "./NavigationBarRight.tsx"
import { NavigationBarSubTabs } from "./NavigationBarSubTabs.tsx"
import { NavigationBarTabs } from "./NavigationBarTabs.tsx"
import { NavigationBarWrapper } from "./NavigationBarWrapper.tsx"

const handleToggleDevTools = ExternalAPI.toggleDevTools

export const NavigationBar: FC = () => {
  const translate = useTranslate()
  // const dispatch = useAppDispatch()
  // const handleHerolistTab = useCallback(() => dispatch(goToTab("characters")), [ dispatch ])
  const { section, mainTabs, subTabs } = useVisibleTabs()
  const available = useAppSelector(selectAdventurePointsAvailable)
  const currentRoute = useAppSelector(selectRoute)

  useEffect(() => {
    switch (currentRoute) {
      case "characters": return ExternalAPI.setTitle(translate("Characters"))
      case "groups": return ExternalAPI.setTitle(translate("Groups"))
      case "library": return ExternalAPI.setTitle(translate("Library"))
      case "faq": return ExternalAPI.setTitle(translate("FAQ"))
      case "imprint": return ExternalAPI.setTitle(translate("Imprint"))
      case "third_party_licenses": return ExternalAPI.setTitle(translate("Third-Party Licenses"))
      case "last_changes": return ExternalAPI.setTitle(translate("Last Changes"))
      case "profile": return ExternalAPI.setTitle(translate("Profile"))
      case "personal_data": return ExternalAPI.setTitle(translate("Personal Data"))
      case "character_sheet": return ExternalAPI.setTitle(translate("Character Sheet"))
      case "pact": return ExternalAPI.setTitle(translate("Pact"))
      case "rules": return ExternalAPI.setTitle(translate("Rules"))
      case "race": return ExternalAPI.setTitle(translate("Race"))
      case "culture": return ExternalAPI.setTitle(translate("Culture"))
      case "profession": return ExternalAPI.setTitle(translate("Profession"))
      case "attributes": return ExternalAPI.setTitle(translate("Attributes"))
      case "advantages": return ExternalAPI.setTitle(translate("Advantages"))
      case "disadvantages": return ExternalAPI.setTitle(translate("Disadvantages"))
      case "skills": return ExternalAPI.setTitle(translate("Skills"))
      case "combat_techniques": return ExternalAPI.setTitle(translate("Combat Techniques"))
      case "special_abilities": return ExternalAPI.setTitle(translate("Special Abilities"))
      case "spells": return ExternalAPI.setTitle(translate("Spells"))
      case "liturgical_chants": return ExternalAPI.setTitle(translate("Liturgical Chants"))
      case "equipment": return ExternalAPI.setTitle(translate("Equipment"))
      case "hit_zone_armor": return ExternalAPI.setTitle(translate("Hit Zone Armor"))
      case "pets": return ExternalAPI.setTitle(translate("Pets"))
      default: return assertExhaustive(currentRoute)
    }
  }, [ currentRoute, translate ])

  return (
    <nav>
      <NavigationBarWrapper>
        <NavigationBarLeft>
          {/* {section === "character"
            ? (
              <>
                <NavigationBarBack handleSetTab={handleHerolistTab} />
                <AvatarWrapper src={avatar} />
              </>
            )
            : null} */}
          <NavigationBarTabs tabs={mainTabs} />
        </NavigationBarLeft>
        <NavigationBarRight>
          {section === "character"
            ? (
              <>
                <TooltipToggle
                  position="bottom"
                  margin={12}
                  content={
                    <AdventurePointsTooltip />
                  }
                  target={
                    <div className="collected-ap">
                      {translate("{0} AP Remaining", available)}
                    </div>
                  }
                  />
                <IconButton
                  icon="&#xE90f;"
                  label={translate("Undo")}
                  // onClick={undo}
                  disabled/* ={!isUndoAvailable} */
                  />
                <IconButton
                  icon="&#xE910;"
                  label={translate("Redo")}
                  // onClick={redo}
                  disabled/* ={!isRedoAvailable} */
                  />
                <Button /* onClick={saveHero} */>
                  {translate("Save")}
                </Button>
              </>
            )
            : null}
          <IconButton
            icon="&#xE906;"
            label={translate("Show Settings")}
            onClick={ExternalAPI.showSettings}
            />
          <IconButton
            icon="&#xE911;"
            label={translate("Toggle DevTools")}
            onClick={handleToggleDevTools}
            />
        </NavigationBarRight>
      </NavigationBarWrapper>
      {
        subTabs !== undefined && subTabs.length > 0
          ? <NavigationBarSubTabs tabs={subTabs} />
          : null
      }
    </nav>
  )
}
