import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe, Nothing } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { Theme } from "../../Models/Config"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { RadioOption } from "../../Models/View/RadioOption"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { BorderButton } from "../Universal/BorderButton"
import { Checkbox } from "../Universal/Checkbox"
import { Dialog } from "../Universal/Dialog"
import { Dropdown } from "../Universal/Dropdown"
import { SegmentedControls } from "../Universal/SegmentedControls"

export interface SettingsOwnProps {
  staticData: StaticDataRecord
  isSettingsOpen: boolean
  close (): void
  checkForUpdates (): void
}

export interface SettingsStateProps {
  localeString: Maybe<string>
  localeType: "default" | "set"
  fallbackLocaleString: Maybe<string>
  fallbackLocaleType: "default" | "set"
  theme: Theme
  isEditingHeroAfterCreationPhaseEnabled: boolean
  areAnimationsEnabled: boolean
  languages: List<Record<DropdownOption<string>>>
  isCheckForUpdatesDisabled: boolean
}

export interface SettingsDispatchProps {
  saveConfig (): void
  setLocale (id: Maybe<string>): void
  setFallbackLocale (id: Maybe<string>): void
  setTheme (id: Maybe<string>): void
  switchEnableEditingHeroAfterCreationPhase (): void
  switchEnableAnimations (): void
}

type Props = SettingsStateProps & SettingsDispatchProps & SettingsOwnProps

export const Settings: React.FC<Props> = props => {
  const {
    close,
    isEditingHeroAfterCreationPhaseEnabled,
    staticData,
    localeString,
    localeType,
    setLocale,
    fallbackLocaleString,
    fallbackLocaleType,
    setFallbackLocale,
    setTheme,
    saveConfig,
    isSettingsOpen,
    theme,
    switchEnableEditingHeroAfterCreationPhase,
    switchEnableAnimations,
    areAnimationsEnabled,
    checkForUpdates,
    languages,
    isCheckForUpdatesDisabled,
  } = props

  return (
    <Dialog
      id="settings"
      title={translate (staticData) ("settings.title")}
      buttons={[
        {
          label: translate (staticData) ("general.dialogs.donebtn"),
          onClick: saveConfig,
        },
      ]}
      close={close}
      isOpen={isSettingsOpen}
      >
      <Dropdown
        options={List (
          DropdownOption ({
            name: translate (staticData) ("settings.systemlanguage"),
          }),
          ...languages
        )}
        value={localeType === "default" ? Nothing : localeString}
        label={translate (staticData) ("settings.language")}
        onChange={setLocale}
        />
      <Dropdown
        options={List (
          DropdownOption ({
            name: translate (staticData) ("general.none"),
          }),
          ...languages
        )}
        value={fallbackLocaleType === "default" ? Nothing : fallbackLocaleString}
        label={translate (staticData) ("settings.fallbacklanguage")}
        onChange={setFallbackLocale}
        />
      <p>{translate (staticData) ("settings.languagehint")}</p>
      <SegmentedControls
        options={List (
          RadioOption ({
            name: translate (staticData) ("settings.theme.dark"),
            value: Just (Theme.Dark),
          }),
          RadioOption ({
            name: translate (staticData) ("settings.theme.light"),
            value: Just (Theme.Light),
          })
        )}
        active={Just (theme)}
        onClick={setTheme}
        label={translate (staticData) ("settings.theme")}
        />
      <Checkbox
        checked={isEditingHeroAfterCreationPhaseEnabled}
        className="editor-switch"
        label={translate (staticData) ("settings.enableeditingheroaftercreationphase")}
        onClick={switchEnableEditingHeroAfterCreationPhase}
        />
      <Checkbox
        checked={areAnimationsEnabled}
        className="animations"
        label={translate (staticData) ("settings.showanimations")}
        onClick={switchEnableAnimations}
        />
      <BorderButton
        label={translate (staticData) ("settings.checkforupdatesbtn")}
        onClick={checkForUpdates}
        autoWidth
        disabled={isCheckForUpdatesDisabled}
        />
    </Dialog>
  )
}
