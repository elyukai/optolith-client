import { BrowserWindow, nativeTheme } from "electron"
import { runInAction } from "mobx"
import type { Theme } from "../shared/settings/GlobalSettings.ts"
import { globalSettings } from "../shared/settings/main.ts"
import { assertExhaustive } from "@elyukai/utils/typeSafety"

/**
 * Sets the native theme for the application.
 */
export const setNativeTheme = (theme: Theme | undefined) => {
  switch (theme) {
    case "dark":
      nativeTheme.themeSource = "dark"
      break
    case "light":
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
    case "dark":
      return DARK
    case "light":
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
    setBackgroundColorForAllWindows(runInAction(() => globalSettings.theme))
  })
}
