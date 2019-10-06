import * as React from "react";
import { List, splitOn } from "../../Data/List";
import { bind, ensure, fromMaybe, guardReplace, Just, listToMaybe, Maybe, maybe } from "../../Data/Maybe";
import { AlertsContainer } from "../Containers/AlertsContainer";
import { DownloaderContainer } from "../Containers/DownloaderContainer";
import { NavigationBarContainer } from "../Containers/NavigationBarContainer";
import { HeroModelRecord } from "../Models/Hero/HeroModel";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";
import { LAST_LOADING_PHASE } from "../Reducers/isReadyReducer";
import { classListMaybe } from "../Utilities/CSS";
import { getSystemLocale } from "../Utilities/IOUtils";
import { TabId } from "../Utilities/LocationUtils";
import { Router } from "./Router/Router";
import { Scroll } from "./Universal/Scroll";
import { TitleBar } from "./Universal/TitleBar";

export interface AppOwnProps {}

export interface AppStateProps {
  currentTab: TabId
  l10n: Maybe<L10nRecord>
  mhero: Maybe<HeroModelRecord>
  platform: string
  theme: string
  areAnimationsEnabled: boolean
  loading_phase: number
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
    error: Error;
    info: any;
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
      l10n: ml10n,
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
      loading_phase,
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

    return maybe
      (
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

          <AlertsContainer l10n={L10n.default} />
          <TitleBar
            close={close}
            closeDuringLoad={closeDuringLoad}
            enterFullscreen={enterFullscreen}
            leaveFullscreen={leaveFullscreen}
            maximize={maximize}
            minimize={minimize}
            platform={platform}
            restore={restore}
            isLoading
            />
        </div>
      )
      ((l10n: L10nRecord) => (
        <div
          id="body"
          className={classListMaybe (List (
            Just (`theme-${theme}`),
            Just (`platform-${platform}`),
            guardReplace (areAnimationsEnabled) ("show-animations")
          ))}
          lang={fromMaybe ("") (listToMaybe (splitOn ("-") (L10n.A.id (l10n))))}
          >
          <div className="background-image">
            <img src="images/background.svg" alt="" />
          </div>

          <AlertsContainer l10n={l10n} />
          <DownloaderContainer l10n={l10n} />
          <TitleBar
            close={close}
            closeDuringLoad={closeDuringLoad}
            enterFullscreen={enterFullscreen}
            leaveFullscreen={leaveFullscreen}
            maximize={maximize}
            minimize={minimize}
            platform={platform}
            restore={restore}
            />

          <section id="content">
            <NavigationBarContainer
              l10n={l10n}
              checkForUpdates={checkForUpdates}
              mhero={mhero}
              platform={platform}
              />
            <Router
              key={currentTab}
              id={currentTab}
              l10n={l10n}
              mhero={mhero}
              />
          </section>
        </div>
      ))
      (bind (ml10n) (ensure (() => loading_phase === LAST_LOADING_PHASE)))
  }
}
