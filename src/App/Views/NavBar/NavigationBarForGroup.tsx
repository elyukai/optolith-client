import { remote } from "electron";
import * as React from "react";
import { SettingsContainer } from "../../Containers/SettingsContainer";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { TabId } from "../../Utilities/LocationUtils";
import { BorderButton } from "../Universal/BorderButton";
import { IconButton } from "../Universal/IconButton";
import { Text } from "../Universal/Text";
import { NavigationBarBack } from "./NavigationBarBack";
import { NavigationBarLeft } from "./NavigationBarLeft";
import { NavigationBarRight } from "./NavigationBarRight";
import { NavigationBarWrapper } from "./NavigationBarWrapper";

export interface NavigationBarForGroupProps {
  l10n: L10nRecord
  groupName: string
  platform: string
  isSettingsOpen: boolean
  closeSettings (): void
  openSettings (): void
  saveGroup (): void
  setTab (id: TabId): void
  checkForUpdates (): void
}

const toggleDevtools = remote.getCurrentWindow ().webContents.toggleDevTools

export function NavigationBarForGroup (props: NavigationBarForGroupProps) {
  const { closeSettings, groupName, l10n, openSettings, saveGroup, setTab } = props

  return (
    <NavigationBarWrapper>
      <NavigationBarLeft>
        <NavigationBarBack setTab={() => setTab (TabId.Grouplist)} />
        <Text>{groupName}</Text>
      </NavigationBarLeft>
      <NavigationBarRight>
        <BorderButton
          label={translate (l10n) ("save")}
          onClick={saveGroup}
          />
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
  )
}
