import { remote } from "electron";
import * as React from "react";
import { List } from "../../../Data/List";
import { Maybe, maybe, maybeR } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { SettingsContainer } from "../../Containers/SettingsContainer";
import { SubTab } from "../../Models/Hero/heroTypeHelpers";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { TabId } from "../../Utilities/LocationUtils";
import { AvatarWrapper } from "../Universal/AvatarWrapper";
import { BorderButton } from "../Universal/BorderButton";
import { IconButton } from "../Universal/IconButton";
import { Text } from "../Universal/Text";
import { TooltipToggle } from "../Universal/TooltipToggle";
import { ApTooltip } from "./ApTooltip";
import { NavigationBarBack } from "./NavigationBarBack";
import { NavigationBarLeft } from "./NavigationBarLeft";
import { NavigationBarRight } from "./NavigationBarRight";
import { NavigationBarSubTabs } from "./NavigationBarSubTabs";
import { NavigationBarTabProps, NavigationBarTabs } from "./NavigationBarTabs";
import { NavigationBarWrapper } from "./NavigationBarWrapper";

export interface NavigationBarOwnProps {
  l10n: L10nRecord
  platform: string
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
  tabs: List<NavigationBarTabProps>
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

export function NavigationBar (props: NavigationBarProps) {
  const {
    subtabs: msubtabs,
    openSettings,
    closeSettings,
    isHeroSection,
    avatar,
    l10n,
    undo,
    isRedoAvailable,
    isUndoAvailable,
    redo,
    saveHero,
    setTab,
    adventurePoints: m_ap,
  } = props

  return (
    <>
      <NavigationBarWrapper>
        <NavigationBarLeft>
          {isHeroSection
            ? <>
              <NavigationBarBack setTab={() => setTab (TabId.Herolist)} />
              <AvatarWrapper src={avatar} />
            </>
            : null}
          <NavigationBarTabs {...props} />
        </NavigationBarLeft>
        <NavigationBarRight>
          {isHeroSection
            ? <>
              {maybeR (<Text className="collected-ap">
                        {"X "}
                        {translate (l10n) ("adventurepoints.short")}
                      </Text>)
                      ((ap: Record<AdventurePointsCategories>) => (
                        <TooltipToggle
                          position="bottom"
                          margin={12}
                          content={<ApTooltip {...props} adventurePoints={ap} />}
                          >
                          <Text className="collected-ap">
                            {maybe<string | number > ("")
                                                     (AdventurePointsCategories.A.available)
                                                     (m_ap)}
                            {" "}
                            {translate (l10n) ("adventurepoints.short")}
                          </Text>
                        </TooltipToggle>
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
                label={translate (l10n) ("save")}
                onClick={saveHero}
                />
            </>
            : null}
          <IconButton
            icon="&#xE906;"
            onClick={openSettings}
            />
          <SettingsContainer {...props} close={closeSettings} />
          <IconButton
            icon="&#xE911;"
            onClick={toggleDevtools}
            />
        </NavigationBarRight>
      </NavigationBarWrapper>
      {maybeR (null)
              ((subtabs: List<SubTab>) => (
                <NavigationBarSubTabs
                  {...props}
                  tabs={subtabs}
                  />
              ))
              (msubtabs)}
    </>
  )
}

function toggleDevtools () {
  remote.getCurrentWindow ().webContents.toggleDevTools ()
}
