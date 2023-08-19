import { FC } from "react"
import backgroundImg from "../../assets/images/background.svg"
import { TitleBar } from "../../shared/components/titleBar/TitleBar.tsx"
import { classList } from "../../shared/utils/classList.ts"
import { ExternalAPI } from "../external.ts"
import { useAppSelector } from "../hooks/redux.ts"
import { selectAreAnimationsEnabled, selectLocale } from "../slices/settingsSlice.ts"
import { NavigationBar } from "./NavigationBar.tsx"
import "./Root.scss"
import { Router } from "./Router.tsx"

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

      {/* <AlertsContainer /> */}
      <TitleBar
        platform={ExternalAPI.platform}
        maximizeEvents={ExternalAPI}
        onMinimize={ExternalAPI.minimize}
        onMaximize={ExternalAPI.maximize}
        onRestore={ExternalAPI.restore}
        onClose={ExternalAPI.close}
        isMaximized={ExternalAPI.isMaximized}
      />

      <div id="content">
        <NavigationBar />
        <Router />
      </div>
    </div>
  )
}
