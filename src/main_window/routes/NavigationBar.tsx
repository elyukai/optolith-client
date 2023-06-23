import { FC, useCallback, useEffect, useRef } from "react"
import { AvatarWrapper } from "../../shared/components/avatarWrapper/AvatarWrapper.tsx"
import { Button } from "../../shared/components/button/Button.tsx"
import { IconButton } from "../../shared/components/iconButton/IconButton.tsx"
import { TooltipToggle } from "../../shared/components/tooltipToggle/TooltipToggle.tsx"
import { useTranslate } from "../../shared/hooks/translate.ts"
import { assertExhaustive } from "../../shared/utils/typeSafety.ts"
import { ExternalAPI } from "../external.ts"
import { useAppDispatch, useAppSelector } from "../hooks/redux.ts"
import { useVisibleTabs } from "../hooks/visibleTabs.ts"
import { selectAdventurePointsAvailable } from "../selectors/adventurePointSelectors.ts"
import { selectAvatar } from "../slices/characterSlice.ts"
import { goToTab, selectRoute } from "../slices/routeSlice.ts"
import { AdventurePointsTooltip } from "./AdventurePointsTooltip.tsx"
import { NavigationBarBack } from "./NavigationBarBack.tsx"
import { NavigationBarLeft } from "./NavigationBarLeft.tsx"
import { NavigationBarRight } from "./NavigationBarRight.tsx"
import { NavigationBarSubTabs } from "./NavigationBarSubTabs.tsx"
import { NavigationBarTabs } from "./NavigationBarTabs.tsx"
import { NavigationBarWrapper } from "./NavigationBarWrapper.tsx"

const handleToggleDevTools = ExternalAPI.toggleDevTools

export const NavigationBar: FC = () => {
  const translate = useTranslate()
  const dispatch = useAppDispatch()
  const handleCharactersTab = useCallback(() => dispatch(goToTab([ "characters" ])), [ dispatch ])
  const { section, mainTabs, subTabs } = useVisibleTabs()
  const available = useAppSelector(selectAdventurePointsAvailable)
  const currentRoute = useAppSelector(selectRoute)
  const avatar = useAppSelector(selectAvatar)

  useEffect(() => {
    switch (currentRoute[0]) {
      case "characters": return (() => {
        switch (currentRoute[2]) {
          case undefined: return ExternalAPI.setTitle(translate("Characters"))
          case "profile": return ExternalAPI.setTitle(translate("Overview"))
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
          default: assertExhaustive(currentRoute)
        }
      })()

      case "groups": return ExternalAPI.setTitle(translate("Groups"))
      case "library": return ExternalAPI.setTitle(translate("Library"))
      case "faq": return ExternalAPI.setTitle(translate("FAQ"))

      case "imprint": return ExternalAPI.setTitle(translate("Imprint"))
      case "third_party_licenses": return ExternalAPI.setTitle(translate("Third-Party Licenses"))
      case "last_changes": return ExternalAPI.setTitle(translate("Last Changes"))

      default: assertExhaustive(currentRoute)
    }
  }, [ currentRoute, translate ])

  const ref = useRef<HTMLDivElement>(null)

  return (
    <nav>
      <NavigationBarWrapper>
        <NavigationBarLeft>
          {section === "character"
            ? (
              <>
                <NavigationBarBack handleSetTab={handleCharactersTab} />
                <AvatarWrapper src={avatar ?? ""} />
              </>
            )
            : null}
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
                  targetRef={ref}
                  />
                <div className="collected-ap" ref={ref}>
                  {translate("{0} AP Remaining", available)}
                </div>
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
