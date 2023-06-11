import { FC } from "react"
import { Button } from "../../shared/components/button/Button.tsx"
import { IconButton } from "../../shared/components/iconButton/IconButton.tsx"
import { TooltipToggle } from "../../shared/components/tooltipToggle/TooltipToggle.tsx"
import { ExternalAPI } from "../external.ts"
import { useAppSelector } from "../hooks/redux.ts"
import { useTranslate } from "../hooks/translate.ts"
import { useVisibleTabs } from "../hooks/visibleTabs.ts"
import { selectAdventurePointsAvailable } from "../selectors/adventurePointSelectors.ts"
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

  return (
    <nav>
      <NavigationBarWrapper>
        <NavigationBarLeft>
          {/* {isHeroSection
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
                      {translate("header.apleft", available)}
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
            // onClick={openSettings}
            disabled
            />
          {/* <SettingsContainer
            staticData={staticData}
            isSettingsOpen={isSettingsOpen}
            close={closeSettings}
            checkForUpdates={preloadApi.checkForUpdates}
            /> */}
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
