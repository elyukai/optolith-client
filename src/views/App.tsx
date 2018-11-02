import * as classNames from 'classnames';
import * as React from 'react';
import { Scroll } from '../components/Scroll';
import { TitleBar } from '../components/TitleBar';
import { AlertsContainer } from '../containers/AlertsContainer';
import { DownloaderContainer } from '../containers/DownloaderContainer';
import { NavigationBarContainer } from '../containers/NavigationBarContainer';
import { UIMessagesObject } from '../types/ui';
import { Maybe } from '../utils/dataUtils';
import { TabId } from '../utils/LocationUtils';
import { Route } from './Route';

export interface AppOwnProps {}

export interface AppStateProps {
  currentTab: TabId;
  locale: Maybe<UIMessagesObject>;
  platform: string;
  theme: string;
  areAnimationsEnabled: boolean;
}

export interface AppDispatchProps {
  minimize (): void;
  maximize (): void;
  restore (): void;
  close (): void;
  enterFullscreen (): void;
  leaveFullscreen (): void;
  checkForUpdates (): void;
}

export type AppProps = AppStateProps & AppDispatchProps & AppOwnProps;

export interface AppState {
  hasError?: {
    error: Error;
    info: any;
  };
}

export class App extends React.Component<AppProps, AppState> {
  state: AppState = {};

  componentDidCatch (error: any, info: any) {
    this.setState (() => ({ hasError: { error, info }}));
  }

  render () {
    const {
      locale: maybeLocale,
      currentTab,
      platform,
      theme,
      areAnimationsEnabled,
    } = this.props;

    const { hasError } = this.state;

    if (hasError) {
      return <div id="body" className={`theme-${theme}`}>
        <Scroll className="error-message">
          <h4>Error</h4>
          <p>{hasError.error.stack}</p>
          <h4>Component Stack</h4>
          <p>{hasError.info.componentStack}</p>
        </Scroll>
      </div>;
    }

    return Maybe.maybe<UIMessagesObject, JSX.Element>
      (<div id="body" className={`theme-${theme}`}></div>)
      (locale => (
        <div
          id="body"
          className={classNames (
            `theme-${theme}`,
            `platform-${platform}`,
            areAnimationsEnabled && 'show-animations'
          )}
          lang={locale.get ('id') .split ('-')[0]}
          >
          <div className="background-image">
            <img src="images/background.svg" alt=""/>
          </div>

          <AlertsContainer locale={locale} />
          <DownloaderContainer locale={locale} />
          <TitleBar {...this.props} />

          <section id="content">
            <NavigationBarContainer {...this.props} locale={locale} />
            <Route id={currentTab} locale={locale} />
          </section>
        </div>
      ))
      (maybeLocale);
  }
}
