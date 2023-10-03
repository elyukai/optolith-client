import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { LocalizationProvider } from "../shared/components/localizationProvider/LocalizationProvider.tsx"
import "../shared/styles/index.scss"
import { ExternalAPI } from "./external.ts"
import { Root } from "./root.tsx"

document.body.classList.add(`platform--${ExternalAPI.platform}`)

const domNode = document.getElementById("root")!
const root = createRoot(domNode)

ExternalAPI.on("initial-setup", ({ translations, locales, systemLocale, settings }) => {
  root.render(
    <StrictMode>
      <LocalizationProvider
        selectedLocale={settings.locale}
        selectedFallbackLocale={settings.fallbackLocale}
        selectedLocaleEvents={ExternalAPI}
        systemLocale={systemLocale}
        platform={ExternalAPI.platform}
        locales={locales}
        ui={translations}
      >
        <Root locales={locales} initialSettings={settings} />
      </LocalizationProvider>
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
