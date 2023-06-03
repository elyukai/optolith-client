import { FC } from "react"
import backgroundImg from "../../../assets/images/background.svg"
import { classList } from "../../../shared/helpers/classList.ts"
import { Theme } from "../../../shared/schema/config.ts"
import { TitleBar } from "../components/titleBar/TitleBar.tsx"
import { preloadApi } from "../preloadApi.ts"
import { NavigationBar } from "./NavigationBar.tsx"
import "./Root.scss"
import { Router } from "./Router.tsx"

export const Root: FC = () => {
  const theme = Theme.Dark
  const areAnimationsEnabled = true
  const language = "de-DE"

  return (
    <div
      id="body"
      className={classList(
        `theme-${theme}`,
        `platform-${preloadApi.platform}`,
        { "show-animations": areAnimationsEnabled },
      )}
      lang={language}
      >
      <div className="background-image">
        <img src={backgroundImg} alt="" />
      </div>

      {/* <AlertsContainer /> */}
      <TitleBar />

      <div id="content">
        <NavigationBar />
        <Router />
      </div>
    </div>
  )
}
