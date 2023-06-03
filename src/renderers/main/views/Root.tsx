import { FC } from "react"
import backgroundImg from "../../../assets/images/background.svg"
import { classList } from "../../../shared/helpers/classList.ts"
import { preloadApi } from "../preloadApi.ts"
import "./Root.scss"
import { TitleBar } from "./universal/TitleBar.tsx"

type Props = {
  theme: string
  areAnimationsEnabled: boolean
  language: string
}

export const Root: FC<Props> = props => {
  const { theme, areAnimationsEnabled, language } = props

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
        {/* <NavigationBarContainer
          staticData={staticData}
          checkForUpdates={checkForUpdates}
          mhero={mhero}
          /> */}
        {/* <Router
          key={currentTab}
          id={currentTab}
          staticData={staticData}
          mhero={mhero}
          /> */}
      </div>
    </div>
  )
}
