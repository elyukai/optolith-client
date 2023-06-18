import { createRoot } from "react-dom/client"
import "../shared/styles/index.scss"
import { ExternalAPI } from "./external.ts"
import { Root } from "./root.tsx"

document.body.classList.add(`platform--${ExternalAPI.platform}`)

const domNode = document.getElementById("root")!
const root = createRoot(domNode)

ExternalAPI.on("initial-setup", ({ translations, systemLocale, locale, locales }) => {
  root.render(
    <Root
      translations={translations}
      systemLocale={systemLocale}
      locale={locale}
      locales={locales}
      />
  )
})

ExternalAPI.on("blur", () => {
  document.documentElement.classList.add("blurred")
})

ExternalAPI.on("focus", () => {
  document.documentElement.classList.remove("blurred")
})
