import * as React from "react"
import { List, splitOn } from "../../Data/List"
import { fromMaybe, guardReplace, Just, listToMaybe, Maybe } from "../../Data/Maybe"
import { AlertsContainer } from "../Containers/AlertsContainer"
import { DownloaderContainer } from "../Containers/DownloaderContainer"
import { NavigationBarContainer } from "../Containers/NavigationBarContainer"
import { Theme } from "../Models/Config"
import { HeroModelRecord } from "../Models/Hero/HeroModel"
import { L10n } from "../Models/Wiki/L10n"
import { StaticData, StaticDataRecord } from "../Models/Wiki/WikiModel"
import { classListMaybe } from "../Utilities/CSS"
import { getSystemLocale } from "../Utilities/IOUtils"
import { TabId } from "../Utilities/LocationUtils"
import { pipe_ } from "../Utilities/pipe"
import { Router } from "./Router/Router"
import { Scroll } from "./Universal/Scroll"
import { TitleBar } from "./Universal/TitleBar"

export interface AppOwnProps {}

export interface AppStateProps {
  currentTab: TabId
  staticData: StaticDataRecord
  mhero: Maybe<HeroModelRecord>
  platform: string
  theme: Theme
  areAnimationsEnabled: boolean
  isLoading: boolean
  hasInitWithError: boolean
}

export interface AppDispatchProps {
  minimize (): void
  maximize (): void
  restore (): void
  close (): void
  closeDuringLoad (): void
  enterFullscreen (): void
  leaveFullscreen (): void
  checkForUpdates (): void
}

export type AppProps = AppStateProps & AppDispatchProps & AppOwnProps

export interface AppState {
  hasError?: {
    error: Error
    info: any
  }
}

export class App extends React.Component<AppProps, AppState> {
  state: AppState = {}

  componentDidCatch (error: any, info: any) {
    this.setState (() => ({ hasError: { error, info } }))
  }

  render () {
    const {
      currentTab,
      staticData,
      mhero,
      platform,
      theme,
      areAnimationsEnabled,
      minimize,
      maximize,
      restore,
      close,
      closeDuringLoad,
      enterFullscreen,
      leaveFullscreen,
      checkForUpdates,
      isLoading,
      hasInitWithError,
    } = this.props

    const { hasError } = this.state

    if (typeof hasError === "object") {
      return (
        <div id="body" className={`theme-${theme}`}>
          <Scroll className="error-message">
            <h4>{"Error"}</h4>
            <p>{hasError.error.stack}</p>
            <h4>{"Component Stack"}</h4>
            <p>{hasError.info.componentStack}</p>
          </Scroll>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div
          id="body"
          className={classListMaybe (List (
            Just (`theme-${theme}`),
            Just (`platform-${platform}`)
          ))}
          lang={fromMaybe ("") (listToMaybe (splitOn ("-") (getSystemLocale ())))}
          >
          <div className="background-image">
            <img src="images/background.svg" alt="" />
          </div>

          <div className="loading-wrapper">
            <div className="loading" />
            <div className="loading-text">
              {getSystemLocale () === "de-DE"
              ? "Lade und überprüfe Tabellen und Nutzerdaten..."
              : "Loading and validating tables and user data..."}
            </div>
          </div>

          <AlertsContainer />
          <TitleBar
            close={closeDuringLoad}
            enterFullscreen={enterFullscreen}
            leaveFullscreen={leaveFullscreen}
            maximize={maximize}
            minimize={minimize}
            platform={platform}
            restore={restore}
            />
        </div>
      )
    }

    if (hasInitWithError) {
      return (
        <div
          id="body"
          className={classListMaybe (List (
            Just (`theme-${theme}`),
            Just (`platform-${platform}`)
          ))}
          lang={fromMaybe ("") (listToMaybe (splitOn ("-") (getSystemLocale ())))}
          >
          <div className="background-image">
            <img src="images/background.svg" alt="" />
          </div>
          <AlertsContainer />
          <TitleBar
            close={closeDuringLoad}
            enterFullscreen={enterFullscreen}
            leaveFullscreen={leaveFullscreen}
            maximize={maximize}
            minimize={minimize}
            platform={platform}
            restore={restore}
            />
        </div>
      )
    }

    return (
      <div
        id="body"
        className={classListMaybe (List (
          Just (`theme-${theme}`),
          Just (`platform-${platform}`),
          guardReplace (areAnimationsEnabled) ("show-animations")
        ))}
        lang={pipe_ (
          staticData,
          StaticData.A.ui,
          L10n.A.id,
          splitOn ("-"),
          listToMaybe,
          fromMaybe ("")
        )}
        >
        <div className="background-image">
          <img src="images/background.svg" alt="" />
        </div>

        <AlertsContainer />
        <DownloaderContainer staticData={staticData} />
        <TitleBar
          close={close}
          enterFullscreen={enterFullscreen}
          leaveFullscreen={leaveFullscreen}
          maximize={maximize}
          minimize={minimize}
          platform={platform}
          restore={restore}
          />

        <section id="content">
          <NavigationBarContainer
            staticData={staticData}
            checkForUpdates={checkForUpdates}
            mhero={mhero}
            />
          <Router
            key={currentTab}
            id={currentTab}
            staticData={staticData}
            mhero={mhero}
            />
        </section>
      </div>
    )
  }
}
