import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { LocalizationProvider } from "../shared/components/localizationProvider/LocalizationProvider.tsx"
import "../shared/styles/index.scss"
import { ExternalAPI } from "./external.ts"
import { Root } from "./root.tsx"

document.body.classList.add(`platform--${ExternalAPI.platform}`)

const domNode = document.getElementById("root")!
const root = createRoot(domNode)

ExternalAPI.on("initial-setup", data => {
  const { translations, systemLocale, globalSettings, locales } = data
  root.render(
    <StrictMode>
      <LocalizationProvider
        selectedLocale={globalSettings.locale}
        selectedFallbackLocale={globalSettings.fallbackLocale}
        selectedLocaleEvents={ExternalAPI}
        systemLocale={systemLocale}
        locales={locales}
        ui={translations}
        >
        <Root
          systemLocale={systemLocale}
          locale={globalSettings.locale}
          />
      </LocalizationProvider>
    </StrictMode>
  )
})

ExternalAPI.on("blur", () => {
  document.documentElement.classList.add("blurred")
})

ExternalAPI.on("focus", () => {
  document.documentElement.classList.remove("blurred")
})
