import { BrowserWindow, nativeTheme } from "electron"
import { Theme } from "../shared/settings/GlobalSettings.ts"
import { getGlobalSettings } from "../shared/settings/main.ts"
import { assertExhaustive } from "../shared/utils/typeSafety.ts"

/**
 * Sets the native theme for the application.
 */
export const setNativeTheme = (theme: Theme | undefined) => {
  switch (theme) {
    case Theme.Dark:
      nativeTheme.themeSource = "dark"
      break
    case Theme.Light:
      nativeTheme.themeSource = "light"
      break
    case undefined:
      nativeTheme.themeSource = "system"
      break
    default:
      assertExhaustive(theme)
  }
}

const DARK = "#111111"
const LIGHT = "#f0f0f0"

/**
 * Returns the background color for each window based on the theme.
 */
export const getWindowBackgroundColor = (theme: Theme | undefined) => {
  switch (theme) {
    case Theme.Dark:
      return DARK
    case Theme.Light:
      return LIGHT
    case undefined:
      return nativeTheme.shouldUseDarkColors ? DARK : LIGHT
    default:
      assertExhaustive(theme)
  }
}

/**
 * Sets the background color for all windows based on the theme.
 */
export const setBackgroundColorForAllWindows = (theme: Theme | undefined) => {
  const color = getWindowBackgroundColor(theme)

  BrowserWindow.getAllWindows().forEach(window => {
    window.setBackgroundColor(color)
  })
}

/**
 * Attaches a listener to native theme changes that updates all windows on each
 * change.
 */
export const handleNativeThemeChanges = () => {
  nativeTheme.on("updated", () => {
    setBackgroundColorForAllWindows(getGlobalSettings().theme)
  })
}
