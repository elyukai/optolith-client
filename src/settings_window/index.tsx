import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { LocalizationContext } from "../shared/contexts/localization.ts"
import "../shared/styles/index.scss"
import { LocaleEnvironment } from "../shared/utils/locale.ts"
import { ExternalAPI } from "./external.ts"
import { Root } from "./root.tsx"

document.body.classList.add(`platform--${ExternalAPI.platform}`)

const domNode = document.getElementById("root")!
const root = createRoot(domNode)

ExternalAPI.on("initial-setup", data => {
  const { systemLocale, settings, locales } = data
  const localeEnvironment = new LocaleEnvironment(locales, systemLocale, settings)
  localeEnvironment.listenToLocaleChanges(ExternalAPI)
  root.render(
    <StrictMode>
      <LocalizationContext.Provider value={localeEnvironment}>
        <Root locales={locales} initialSettings={settings} />
      </LocalizationContext.Provider>
    </StrictMode>,
  )

  ExternalAPI.initialSetupDone()
})

ExternalAPI.on("blur", () => {
  document.documentElement.classList.add("blurred")
})

ExternalAPI.on("focus", () => {
  document.documentElement.classList.remove("blurred")
})
