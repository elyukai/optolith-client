import * as React from "react";
import { List, splitOn } from "../../Data/List";
import { fromMaybe, guardReplace, Just, listToMaybe, Maybe, maybe } from "../../Data/Maybe";
import { AlertsContainer } from "../Containers/AlertsContainer";
import { DownloaderContainer } from "../Containers/DownloaderContainer";
import { NavigationBarContainer } from "../Containers/NavigationBarContainer";
import { HeroModelRecord } from "../Models/Hero/HeroModel";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";
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
    this.setState (() => ({ hasError: { error, info }}))
  }

  render () {
    const {
      l10n: ml10n,
      currentTab,
      platform,
      theme,
      areAnimationsEnabled,
      mhero,
    } = this.props

    const { hasError } = this.state

    if (hasError) {
      return <div id="body" className={`theme-${theme}`}>
        <Scroll className="error-message">
          <h4>Error</h4>
          <p>{hasError.error.stack}</p>
          <h4>Component Stack</h4>
          <p>{hasError.info.componentStack}</p>
        </Scroll>
      </div>
    }

    return maybe
      (<div id="body" className={`theme-${theme}`}>
        <div className="background-image">
          <img src="images/background.svg" alt=""/>
        </div>

        <div className="loading-wrapper">
          <div className="loading"></div>
          <div className="loading-text">
            {getSystemLocale () === "de-DE"
            ? "Lade und überprüfe Tabellen und Nutzerdaten..."
            : "Loading and validating tables and user data..."}
          </div>
        </div>

        <AlertsContainer l10n={L10n.default} />
        <TitleBar {...this.props} isLoading />
      </div>)
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
            <img src="images/background.svg" alt=""/>
          </div>

          <AlertsContainer l10n={l10n} />
          <DownloaderContainer l10n={l10n} />
          <TitleBar {...this.props} />

          <section id="content">
            <NavigationBarContainer {...this.props} l10n={l10n} />
            <Router id={currentTab} l10n={l10n} mhero={mhero} />
          </section>
        </div>
      ))
      (ml10n)
  }
}
