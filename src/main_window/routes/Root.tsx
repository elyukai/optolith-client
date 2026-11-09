import { classList } from "@elyukai/utils/classList"
import { observer } from "mobx-react-lite"
import { type FC, useContext, useEffect } from "react"
import backgroundImg from "../../assets/images/background.svg"
import { TitleBar } from "../../shared/components/titleBar/TitleBar.tsx"
import { LocalizationContext } from "../../shared/contexts/localization.ts"
import { ExternalAPI } from "../external.ts"
import { useAppSelector } from "../hooks/redux.ts"
import { selectAreAnimationsEnabled } from "../slices/settingsSlice.ts"
import { Alerts } from "./Alerts.tsx"
import "./Root.scss"
import { Router } from "./Router.tsx"

/**
 * Returns the React application for the main window.
 */
export const Root: FC = observer(function Root() {
  const [language] = useContext(LocalizationContext).safeLocales
  const areAnimationsEnabled = useAppSelector(selectAreAnimationsEnabled)

  useEffect(() => {
    if (language !== undefined) {
      document.body.lang = language
    }
  }, [language])

  return (
    <div id="body" className={classList({ "show-animations": areAnimationsEnabled })}>
      <div className="background-image">
        <img src={backgroundImg} alt="" />
      </div>

      <Alerts />
      <TitleBar externalAPI={ExternalAPI} />
      <div id="content">
        <Router />
      </div>
    </div>
  )
})
