import { remote } from "electron"
import * as React from "react"
import { useDispatch } from "react-redux"
import { setTab } from "../../Actions/LocationActions"
import { SettingsContainer } from "../../Containers/SettingsContainer"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { TabId } from "../../Utilities/LocationUtils"
import { BorderButton } from "../Universal/BorderButton"
import { IconButton } from "../Universal/IconButton"
import { Text } from "../Universal/Text"
import { NavigationBarBack } from "./NavigationBarBack"
import { NavigationBarLeft } from "./NavigationBarLeft"
import { NavigationBarRight } from "./NavigationBarRight"
import { NavigationBarWrapper } from "./NavigationBarWrapper"

interface Props {
  l10n: L10nRecord
  groupName: string
  platform: string
  isSettingsOpen: boolean
  closeSettings (): void
  openSettings (): void
  saveGroup (): void
  checkForUpdates (): void
}

const toggleDevtools = remote.getCurrentWindow ().webContents.toggleDevTools

export const NavigationBarForGroup: React.FC<Props> = props => {
  const {
    l10n,
    groupName,
    platform,
    isSettingsOpen,
    closeSettings,
    openSettings,
    saveGroup,
    checkForUpdates,
  } = props

  const dispatch = useDispatch ()

  const handleSetTab = React.useCallback (
    () => dispatch (setTab (TabId.Grouplist)),
    [ dispatch ]
  )

  return (
    <NavigationBarWrapper>
      <NavigationBarLeft>
        <NavigationBarBack handleSetTab={handleSetTab} />
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
        <SettingsContainer
          l10n={l10n}
          isSettingsOpen={isSettingsOpen}
          platform={platform}
          close={closeSettings}
          checkForUpdates={checkForUpdates}
          />
        <IconButton
          icon="&#xE911;"
          onClick={toggleDevtools}
          />
      </NavigationBarRight>
    </NavigationBarWrapper>
  )
}
