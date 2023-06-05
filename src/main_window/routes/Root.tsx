import { FC } from "react"
import backgroundImg from "../../assets/images/background.svg"
import { TitleBar } from "../../shared/components/titleBar/TitleBar.tsx"
import { Theme } from "../../shared/schema/config.ts"
import { classList } from "../../shared/utils/classList.ts"
import { preloadApi } from "../preload.ts"
import { NavigationBar } from "./NavigationBar.tsx"
import "./Root.scss"
import { Router } from "./Router.tsx"

const handleMinimize = preloadApi.minimize
const handleMaximize = preloadApi.maximize
const handleRestore = preloadApi.restore
const handleClose = preloadApi.close

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
      <TitleBar
        platform={preloadApi.platform}
        windowEvents={preloadApi}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onRestore={handleRestore}
        onClose={handleClose}
        isMaximized={preloadApi.isMaximized}
        isFocused={preloadApi.isFocused}
        />

      <div id="content">
        <NavigationBar />
        <Router />
      </div>
    </div>
  )
}
