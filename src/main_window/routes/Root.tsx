import { FC } from "react"
import backgroundImg from "../../assets/images/background.svg"
import { TitleBar } from "../../shared/components/titleBar/TitleBar.tsx"
import { Theme } from "../../shared/schema/config.ts"
import { classList } from "../../shared/utils/classList.ts"
import { ExternalAPI } from "../external.ts"
import { NavigationBar } from "./NavigationBar.tsx"
import "./Root.scss"
import { Router } from "./Router.tsx"

const handleMinimize = ExternalAPI.minimize
const handleMaximize = ExternalAPI.maximize
const handleRestore = ExternalAPI.restore
const handleClose = ExternalAPI.close

export const Root: FC = () => {
  const theme = Theme.Dark
  const areAnimationsEnabled = true
  const language = "de-DE"

  return (
    <div
      id="body"
      className={classList(
        `theme-${theme}`,
        `platform-${ExternalAPI.platform}`,
        { "show-animations": areAnimationsEnabled },
      )}
      lang={language}
      >
      <div className="background-image">
        <img src={backgroundImg} alt="" />
      </div>

      {/* <AlertsContainer /> */}
      <TitleBar
        platform={ExternalAPI.platform}
        windowEvents={ExternalAPI}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onRestore={handleRestore}
        onClose={handleClose}
        isMaximized={ExternalAPI.isMaximized}
        isFocused={ExternalAPI.isFocused}
        />

      <div id="content">
        <NavigationBar />
        <Router />
      </div>
    </div>
  )
}
