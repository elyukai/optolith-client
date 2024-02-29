import { FC } from "react"
import backgroundImg from "../../assets/images/background.svg"
import { TitleBar } from "../../shared/components/titleBar/TitleBar.tsx"
import { classList } from "../../shared/utils/classList.ts"
import { ExternalAPI } from "../external.ts"
import { useAppSelector } from "../hooks/redux.ts"
import { selectAreAnimationsEnabled, selectLocale } from "../slices/settingsSlice.ts"
import { Alerts } from "./Alerts.tsx"
import { NavigationBar } from "./NavigationBar.tsx"
import "./Root.scss"
import { Router } from "./Router.tsx"

// Inserting context bridge function directly into React components breaks.
const onMinimize = () => ExternalAPI.minimize()
const onMaximize = () => ExternalAPI.maximize()
const onRestore = () => ExternalAPI.restore()
const onClose = () => ExternalAPI.close()
const isMaximized = () => ExternalAPI.isMaximized()

/**
 * Returns the React application for the main window.
 */
export const Root: FC = () => {
  const language = useAppSelector(selectLocale)
  const areAnimationsEnabled = useAppSelector(selectAreAnimationsEnabled)

  return (
    <div
      id="body"
      className={classList({ "show-animations": areAnimationsEnabled })}
      lang={language}
    >
      <div className="background-image">
        <img src={backgroundImg} alt="" />
      </div>

      <Alerts />
      <TitleBar
        platform={ExternalAPI.platform}
        maximizeEvents={ExternalAPI}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onRestore={onRestore}
        onClose={onClose}
        isMaximized={isMaximized}
      />

      <div id="content">
        <NavigationBar />
        <Router />
      </div>
    </div>
  )
}
