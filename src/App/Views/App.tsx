import * as classNames from "classnames";
import * as React from "react";
import { splitOn } from "../../Data/List";
import { fromMaybe, listToMaybe, Maybe, maybe } from "../../Data/Maybe";
import { AlertsContainer } from "../Containers/AlertsContainer";
import { DownloaderContainer } from "../Containers/DownloaderContainer";
import { NavigationBarContainer } from "../Containers/NavigationBarContainer";
import { HeroModelRecord } from "../Models/Hero/HeroModel";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";
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
      (<div id="body" className={`theme-${theme}`}></div>)
      ((l10n: L10nRecord) => (
        <div
          id="body"
          className={classNames (
            `theme-${theme}`,
            `platform-${platform}`,
            { "show-animations": areAnimationsEnabled }
          )}
          lang={fromMaybe ("") (listToMaybe (splitOn ("-") (L10n.A.id (l10n))))}
          >
          <div className="background-image">
            <img src="images/background.svg" alt=""/>
          </div>

          <AlertsContainer l10n={l10n} />
          <DownloaderContainer locale={l10n} />
          <TitleBar {...this.props} />

          <section id="content">
            <NavigationBarContainer {...this.props} locale={l10n} />
            <Router id={currentTab} l10n={l10n} mhero={mhero} />
          </section>
        </div>
      ))
      (ml10n)
  }
}
