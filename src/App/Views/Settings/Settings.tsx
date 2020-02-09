import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe, Nothing } from "../../../Data/Maybe"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { RadioOption } from "../../Models/View/RadioOption"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { isStable } from "../../Selectors/envSelectors"
import { translate } from "../../Utilities/I18n"
import { Locale, Theme } from "../../Utilities/Raw/JSON/Config"
import { BorderButton } from "../Universal/BorderButton"
import { Checkbox } from "../Universal/Checkbox"
import { Dialog } from "../Universal/Dialog"
import { Dropdown } from "../Universal/Dropdown"
import { SegmentedControls } from "../Universal/SegmentedControls"

export interface SettingsOwnProps {
  l10n: L10nRecord
  isSettingsOpen: boolean
  platform: string
  close (): void
  checkForUpdates (): void
}

export interface SettingsStateProps {
  localeString: Maybe<string>
  localeType: "default" | "set"
  theme: Theme
  isEditingHeroAfterCreationPhaseEnabled: boolean
  areAnimationsEnabled: boolean
}

export interface SettingsDispatchProps {
  saveConfig (): void
  setLocale (id: Maybe<string>): void
  setTheme (id: Maybe<string>): void
  switchEnableEditingHeroAfterCreationPhase (): void
  switchEnableAnimations (): void
}

type Props = SettingsStateProps & SettingsDispatchProps & SettingsOwnProps

export const Settings: React.FC<Props> = props => {
  const {
    close,
    isEditingHeroAfterCreationPhaseEnabled,
    l10n,
    localeString,
    localeType,
    setLocale,
    setTheme,
    saveConfig,
    isSettingsOpen,
    theme,
    switchEnableEditingHeroAfterCreationPhase,
    switchEnableAnimations,
    areAnimationsEnabled,
    platform,
    checkForUpdates,
  } = props

  return (
    <Dialog
      id="settings"
      title={translate (l10n) ("settings.title")}
      buttons={[
        {
          label: translate (l10n) ("general.dialogs.donebtn"),
          onClick: saveConfig,
        },
      ]}
      close={close}
      isOpen={isSettingsOpen}
      >
      <Dropdown
        options={List (
          DropdownOption ({
            name: translate (l10n) ("settings.systemlanguage"),
          }),
          DropdownOption ({
            id: Just (Locale.German),
            name: "Deutsch (Deutschland)",
          }),
          DropdownOption ({
            id: Just (Locale.English),
            name: "English (United States)",
          }),
          DropdownOption ({
            id: Just (Locale.Dutch),
            name: "Nederlands (België)",
          }),
          DropdownOption ({
            id: Just (Locale.French),
            name: "Français (France)",
            disabled: Just (isStable),
          }),
          DropdownOption ({
            id: Just (Locale.Italian),
            name: "Italiano (Italia)",
            disabled: Just (isStable),
          })
        )}
        value={localeType === "default" ? Nothing : localeString}
        label={translate (l10n) ("settings.language")}
        onChange={setLocale}
        />
      <p>{translate (l10n) ("settings.languagehint")}</p>
      <SegmentedControls
        options={List (
          RadioOption ({
            name: translate (l10n) ("settings.theme.dark"),
            value: Just (Theme.Dark),
          }),
          RadioOption ({
            name: translate (l10n) ("settings.theme.light"),
            value: Just (Theme.Light),
          })
        )}
        active={Just (theme)}
        onClick={setTheme}
        label={translate (l10n) ("settings.theme")}
        />
      <Checkbox
        checked={isEditingHeroAfterCreationPhaseEnabled}
        className="editor-switch"
        label={translate (l10n) ("settings.enableeditingheroaftercreationphase")}
        onClick={switchEnableEditingHeroAfterCreationPhase}
        />
      <Checkbox
        checked={areAnimationsEnabled}
        className="animations"
        label={translate (l10n) ("settings.showanimations")}
        onClick={switchEnableAnimations}
        />
      {(platform === "win32" || platform === "darwin")
        ? (
          <BorderButton
            label={translate (l10n) ("settings.checkforupdatesbtn")}
            onClick={checkForUpdates}
            autoWidth
            />
        )
        : null}
    </Dialog>
  )
}
