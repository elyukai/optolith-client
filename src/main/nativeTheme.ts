import { nativeTheme } from "electron"
import { Theme } from "../shared/schema/config.ts"
import { assertExhaustive } from "../shared/utils/typeSafety.ts"

export const setNativeTheme = (theme: Theme | undefined) => {
  switch (theme) {
    case Theme.Dark:  nativeTheme.themeSource = "dark"; break
    case Theme.Light: nativeTheme.themeSource = "light"; break
    case undefined:   nativeTheme.themeSource = "system"; break
    default: assertExhaustive(theme)
  }
}
