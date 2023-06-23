import { BrowserWindow, nativeTheme } from "electron"
import { Theme } from "../shared/schema/config.ts"
import { getGlobalSettings } from "../shared/settings/main.ts"
import { assertExhaustive } from "../shared/utils/typeSafety.ts"

export const setNativeTheme = (theme: Theme | undefined) => {
  switch (theme) {
    case Theme.Dark:  nativeTheme.themeSource = "dark"; break
    case Theme.Light: nativeTheme.themeSource = "light"; break
    case undefined:   nativeTheme.themeSource = "system"; break
    default: assertExhaustive(theme)
  }
}

const DARK = "#111111"
const LIGHT = "#f0f0f0"

export const getWindowBackgroundColor = (theme: Theme | undefined) => {
  switch (theme) {
    case Theme.Dark:  return DARK
    case Theme.Light: return "#f0f0f0"
    case undefined:   return nativeTheme.shouldUseDarkColors ? DARK : LIGHT
    default: assertExhaustive(theme)
  }
}

export const setBackgroundColorForAllWindows = (theme: Theme | undefined) => {
  const color = getWindowBackgroundColor(theme)

  BrowserWindow.getAllWindows().forEach(window => {
    window.setBackgroundColor(color)
  })
}

export const handleNativeThemeChanges = () => {
  nativeTheme.on("updated", () => {
    setBackgroundColorForAllWindows(getGlobalSettings().theme)
  })
}
