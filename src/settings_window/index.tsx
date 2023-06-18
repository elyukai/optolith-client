import { createRoot } from "react-dom/client"
import "../shared/styles/index.scss"
import { ExternalAPI } from "./external.ts"
import { Root } from "./root.tsx"

document.body.classList.add(`platform--${ExternalAPI.platform}`)

const domNode = document.getElementById("root")!
const root = createRoot(domNode)

ExternalAPI.on("initial-setup", ({ translations, locales, systemLocale, settings }) => {
  root.render(
    <Root
      translations={translations}
      locales={locales}
      systemLocale={systemLocale}
      initialSettings={settings}
      />
  )
})