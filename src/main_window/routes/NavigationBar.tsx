import { FC } from "react"
import { IconButton } from "../../shared/components/iconButton/IconButton.tsx"
import { ExternalAPI } from "../external.ts"
import { useTranslate } from "../hooks/translate.ts"
import { useVisibleTabs } from "../hooks/visibleTabs.ts"
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

  const { mainTabs, subTabs } = useVisibleTabs()

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
          {/* {isHeroSection
            ? (
              <>
                {maybe(<Text className="collected-ap">
                          {translateP(staticData)("header.apleft")(List("X"))}
                       </Text>)
                        ((ap: Record<AdventurePointsCategories>) => (
                          <TooltipToggle
                            position="bottom"
                            margin={12}
                            content={
                              <ApTooltip
                                adventurePoints={ap}
                                staticData={staticData}
                                maximumForMagicalAdvantagesDisadvantages={
                                  maximumForMagicalAdvantagesDisadvantages
                                }
                                isSpellcaster={isSpellcaster}
                                isBlessedOne={isBlessedOne}
                                />
                            }
                            target={
                              <Text className="collected-ap">
                                {translateP(staticData)
                                            ("header.apleft")
                                            (List(
                                              pipe_(
                                                m_ap,
                                                fmap(pipe(
                                                  AdventurePointsCategories.A.available,
                                                  signNeg
                                                )),
                                                fromMaybe <string | number >("")
                                              )
                                            ))}
                              </Text>
                            }
                            />
                        ))
                        (m_ap)}
                <IconButton
                  icon="&#xE90f;"
                  onClick={undo}
                  disabled={!isUndoAvailable}
                  />
                <IconButton
                  icon="&#xE910;"
                  onClick={redo}
                  disabled={!isRedoAvailable}
                  />
                <BorderButton
                  label={translate(staticData)("header.savebtn")}
                  onClick={saveHero}
                  />
              </>
            )
            : null} */}
          {/* <IconButton
            icon="&#xE906;"
            onClick={openSettings}
            />
          <SettingsContainer
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
