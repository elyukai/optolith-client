import { remote } from "electron"
import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { List } from "../../../Data/List"
import { fromMaybe, Maybe, maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { SettingsContainer } from "../../Containers/SettingsContainer"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { SubTab } from "../../Models/Hero/heroTypeHelpers"
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories"
import { NavigationBarTabOptions } from "../../Models/View/NavigationBarTabOptions"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate, translateP } from "../../Utilities/I18n"
import { TabId } from "../../Utilities/LocationUtils"
import { signNeg } from "../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { AvatarWrapper } from "../Universal/AvatarWrapper"
import { BorderButton } from "../Universal/BorderButton"
import { IconButton } from "../Universal/IconButton"
import { Text } from "../Universal/Text"
import { TooltipToggle } from "../Universal/TooltipToggle"
import { ApTooltip } from "./ApTooltip"
import { NavigationBarBack } from "./NavigationBarBack"
import { NavigationBarLeft } from "./NavigationBarLeft"
import { NavigationBarRight } from "./NavigationBarRight"
import { NavigationBarSubTabs } from "./NavigationBarSubTabs"
import { NavigationBarTabs } from "./NavigationBarTabs"
import { NavigationBarWrapper } from "./NavigationBarWrapper"

const toggleDevtools = () => {
  remote.getCurrentWindow ().webContents.toggleDevTools ()
}

export interface NavigationBarOwnProps {
  mhero: Maybe<HeroModelRecord>
  staticData: StaticDataRecord
  checkForUpdates (): void
}

export interface NavigationBarStateProps {
  currentTab: TabId
  avatar: Maybe<string>
  isRedoAvailable: boolean
  isRemovingEnabled: boolean
  isUndoAvailable: boolean
  isSettingsOpen: boolean
  isHeroSection: boolean
  tabs: List<Record<NavigationBarTabOptions>>
  subtabs: Maybe<List<SubTab>>
  adventurePoints: Maybe<Record<AdventurePointsCategories>>
  maximumForMagicalAdvantagesDisadvantages: Maybe<number>
  isSpellcaster: boolean
  isBlessedOne: boolean
}

export interface NavigationBarDispatchProps {
  undo (): void
  redo (): void
  saveHero (): void
  saveGroup (): void
  setTab (id: TabId): void
  openSettings (): void
  closeSettings (): void
}

export type NavigationBarProps =
  NavigationBarStateProps & NavigationBarDispatchProps & NavigationBarOwnProps

export const NavigationBar: React.FC<NavigationBarProps> = props => {
  const {
    currentTab,
    tabs,
    subtabs: msubtabs,
    openSettings,
    closeSettings,
    isHeroSection,
    avatar,
    staticData,
    undo,
    isRedoAvailable,
    isUndoAvailable,
    redo,
    saveHero,
    setTab,
    adventurePoints: m_ap,
    maximumForMagicalAdvantagesDisadvantages,
    isSpellcaster,
    isBlessedOne,
    isSettingsOpen,
    checkForUpdates,
  } = props

  const handleHerolistTab = React.useCallback (() => setTab (TabId.Herolist), [ setTab ])

  return (
    <>
      <NavigationBarWrapper>
        <NavigationBarLeft>
          {isHeroSection
            ? (
              <>
                <NavigationBarBack handleSetTab={handleHerolistTab} />
                <AvatarWrapper src={avatar} />
              </>
            )
            : null}
          <NavigationBarTabs
            currentTab={currentTab}
            tabs={tabs}
            />
        </NavigationBarLeft>
        <NavigationBarRight>
          {isHeroSection
            ? (
              <>
                {maybe (<Text className="collected-ap">
                          {translateP (staticData) ("header.apleft") (List ("X"))}
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
                                {translateP (staticData)
                                            ("header.apleft")
                                            (List (
                                              pipe_ (
                                                m_ap,
                                                fmap (pipe (
                                                  AdventurePointsCategories.A.available,
                                                  signNeg
                                                )),
                                                fromMaybe <string | number > ("")
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
                  label={translate (staticData) ("header.savebtn")}
                  onClick={saveHero}
                  />
              </>
            )
            : null}
          <IconButton
            icon="&#xE906;"
            onClick={openSettings}
            />
          <SettingsContainer
            staticData={staticData}
            isSettingsOpen={isSettingsOpen}
            close={closeSettings}
            checkForUpdates={checkForUpdates}
            />
          <IconButton
            icon="&#xE911;"
            onClick={toggleDevtools}
            />
        </NavigationBarRight>
      </NavigationBarWrapper>
      {maybe (null as React.ReactNode)
             ((subtabs: List<SubTab>) => (
               <NavigationBarSubTabs
                 tabs={subtabs}
                 currentTab={currentTab}
                 setTab={setTab}
                 />
             ))
             (msubtabs)}
    </>
  )
}
