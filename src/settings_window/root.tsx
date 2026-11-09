import type { Locale } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import { useEffect, useMemo, useState } from "react"
import { Button } from "../shared/components/button/Button.tsx"
import { Checkbox } from "../shared/components/checkbox/Checkbox.tsx"
import { Dropdown } from "../shared/components/dropdown/Dropdown.tsx"
import type { DropdownOption } from "../shared/components/dropdown/DropdownItem.tsx"
import { Grid } from "../shared/components/grid/Grid.tsx"
import { GridItem } from "../shared/components/grid/GridItem.tsx"
import { SegmentedControls } from "../shared/components/segmentedControls/SegmentedControls.tsx"
import { TitleBar } from "../shared/components/titleBar/TitleBar.tsx"
import { useToggleState } from "../shared/hooks/toggleState.ts"
import { useTranslate } from "../shared/hooks/translate.ts"
import { useBroadcastSetting } from "../shared/settings/emittingRenderer.ts"
import type { GlobalSettings, Theme } from "../shared/settings/GlobalSettings.ts"
import { ExternalAPI } from "./external.ts"
import "./root.scss"

type Props = {
  locales: Record<string, Locale>
  initialSettings: GlobalSettings
}

const getLocaleKey = (option: DropdownOption<string | undefined>) => option.id

/**
 * Root component for the settings window.
 */
export const Root: React.FC<Props> = observer(function Root(props) {
  const { locales, initialSettings } = props

  const [locale, setLocale] = useState(initialSettings.locale)
  const [fallbackLocale, setFallbackLocale] = useState(initialSettings.fallbackLocale)
  const [theme, setTheme] = useState(initialSettings.theme)
  const [isEditAfterCreationEnabled, toggleEditAfterCreationEnabled] = useToggleState(
    initialSettings.isEditAfterCreationEnabled,
  )
  const [areAnimationsEnabled, toggleAnimationsEnabled] = useToggleState(
    initialSettings.areAnimationsEnabled,
  )

  const translate = useTranslate()

  useEffect(() => ExternalAPI.setTitle(translate("Settings")), [translate])

  useBroadcastSetting(ExternalAPI, "locale", locale)
  useBroadcastSetting(ExternalAPI, "fallbackLocale", fallbackLocale)
  useBroadcastSetting(ExternalAPI, "theme", theme)
  useBroadcastSetting(ExternalAPI, "isEditAfterCreationEnabled", isEditAfterCreationEnabled)
  useBroadcastSetting(ExternalAPI, "areAnimationsEnabled", areAnimationsEnabled)

  const localeOptions = useMemo(
    (): DropdownOption<string>[] =>
      Object.entries(locales)
        .map(([id, localeObj]) => ({
          id,
          name: `${localeObj.name} (${localeObj.region})`,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [locales],
  )

  return (
    <>
      <TitleBar title={translate("Settings")} secondary externalAPI={ExternalAPI} />
      <main>
        <Grid>
          <GridItem width="1/2">
            <Dropdown<string | undefined>
              options={[
                {
                  id: undefined,
                  name: translate("System Language"),
                },
                ...localeOptions,
              ]}
              value={locale}
              label={translate("Main Language")}
              onChange={setLocale}
              getKey={getLocaleKey}
            />
          </GridItem>
          <GridItem width="1/2">
            <Dropdown<string | undefined>
              options={[
                {
                  id: undefined,
                  name: translate("No fallback language"),
                },
                ...localeOptions,
              ]}
              value={fallbackLocale}
              label={translate("Fallback Language")}
              onChange={setFallbackLocale}
              getKey={getLocaleKey}
            />
          </GridItem>
          <GridItem width="1/1">
            <SegmentedControls<Theme | undefined>
              options={[
                {
                  name: translate("Auto"),
                  value: undefined,
                },
                {
                  name: translate("Dark"),
                  value: "dark",
                },
                {
                  name: translate("Light"),
                  value: "light",
                },
              ]}
              active={theme}
              onClick={setTheme}
              label={translate("Appearance")}
            />
          </GridItem>
          <GridItem width="1/1">
            <Checkbox
              checked={isEditAfterCreationEnabled}
              className="editor-switch"
              label={translate("Edit characters after creation")}
              onClick={toggleEditAfterCreationEnabled}
            />
          </GridItem>
          <GridItem width="1/1">
            <Checkbox
              checked={areAnimationsEnabled}
              className="animations"
              label={translate("Show animations")}
              onClick={toggleAnimationsEnabled}
            />
          </GridItem>
          <GridItem width="1/1">
            <Button onClick={ExternalAPI.checkForUpdate} autoWidth>
              {translate("Check for updates")}
            </Button>
          </GridItem>
        </Grid>
      </main>
    </>
  )
})
