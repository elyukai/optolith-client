declare global {
  interface Event {
    charCode: number;
  }

  interface EventTarget {
    readonly value: string;
    readonly files: FileList | null;
    readonly result: string;
  }
}

// tslint:disable-next-line:no-implicit-dependencies
import { ProgressInfo } from 'builder-util-runtime';
import { ipcRenderer, remote } from 'electron';
import * as localShortcut from 'electron-localshortcut';
// tslint:disable-next-line:no-implicit-dependencies
import { UpdateInfo } from 'electron-updater';
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Action, applyMiddleware, createStore, Dispatch, Store } from 'redux';
import ReduxThunk from 'redux-thunk';
import { backAccelerator, openSettingsAccelerator, quitAccelerator, redoAccelerator, saveHeroAccelerator, undoAccelerator } from './actions/AcceleratorActions';
import { addErrorAlert } from './actions/AlertActions';
import { requestClose, requestInitialData, setUpdateDownloadProgress, updateAvailable, updateNotAvailable } from './actions/IOActions';
import { showAbout } from './actions/LocationActions';
import { AppContainer } from './containers/AppContainer';
import { appReducer, AppState } from './reducers/appReducer';
import { getLocaleMessages } from './selectors/stateSelectors';
import { Just, Maybe } from './utils/dataUtils';
import { translate } from './utils/I18n';
import { isDialogOpen } from './utils/SubwindowsUtils';

const store: Store<AppState, Action<any>> & { dispatch: Dispatch<Action, AppState> } =
  createStore (appReducer, applyMiddleware (ReduxThunk));

store.dispatch (requestInitialData ())
  .then (() => {
    const currentWindow = remote.getCurrentWindow ();

    const { getState } = store;
    const dispatch = store.dispatch as Dispatch<Action, AppState>;

    if (remote.process.platform === 'darwin') {
      const maybeLocale = getLocaleMessages (getState ());

      if (Maybe.isJust (maybeLocale)) {
        const locale = Maybe.fromJust (maybeLocale);

        const menuTemplate: Electron.MenuItemConstructorOptions[] = [
          {
            label: remote.app.getName (),
            submenu: [
              {
                label: translate (locale, 'mac.aboutapp', remote.app.getName ()),
                click: () => dispatch (showAbout),
              },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              {
                label: translate (locale, 'mac.quit'),
                click: () => dispatch (requestClose (Just (remote.app.quit))),
              },
            ],
          },
          {
            label: translate (locale, 'edit'),
            submenu: [
              { role: 'cut' },
              { role: 'copy' },
              { role: 'paste' },
              { role: 'delete' },
              { role: 'selectall' },
            ],
          },
          {
            label: translate (locale, 'view'),
            submenu: [
              { role: 'togglefullscreen' },
            ],
          },
          {
            role: 'window',
            submenu: [
              { role: 'minimize' },
              { type: 'separator' },
              { role: 'front' },
            ],
          },
        ];

        const menu = remote.Menu.buildFromTemplate (menuTemplate);
        remote.Menu.setApplicationMenu (menu);

        store.subscribe (() => {
          const areSubwindowsOpen = isDialogOpen ();
          type MenuItems = Electron.MenuItemConstructorOptions[];
          const appMenu = menuTemplate[0].submenu as MenuItems;
          appMenu[0].enabled = !areSubwindowsOpen;
          const currentMenu = remote.Menu.buildFromTemplate (menuTemplate);
          remote.Menu.setApplicationMenu (currentMenu);
        });

        localShortcut.register (currentWindow, 'Cmd+Q', () => {
          dispatch (quitAccelerator);
        });

        localShortcut.register (currentWindow, 'CmdOrCtrl+S', () => {
          dispatch (saveHeroAccelerator (locale));
        });
      }
    }

    localShortcut.register (currentWindow, 'CmdOrCtrl+Z', () => {
      dispatch (undoAccelerator ());
    });

    localShortcut.register (currentWindow, 'CmdOrCtrl+Y', () => {
      dispatch (redoAccelerator ());
    });

    localShortcut.register (currentWindow, 'CmdOrCtrl+Shift+Z', () => {
      dispatch (redoAccelerator ());
    });

    localShortcut.register (currentWindow, 'CmdOrCtrl+W', () => {
      dispatch (backAccelerator ());
    });

    localShortcut.register (currentWindow, 'CmdOrCtrl+O', () => {
      dispatch (openSettingsAccelerator ());
    });

    ipcRenderer.send ('loading-done');
  });

render (
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.querySelector ('#bodywrapper')
);

ipcRenderer.addListener ('update-available', (_event: Event, info: UpdateInfo) => {
  const dispatch = store.dispatch as Dispatch<AnyAction, AppState>;
  const maybeLocale = getLocaleMessages (store.getState ());

  if (Maybe.isJust (maybeLocale)) {
    dispatch (updateAvailable (Maybe.fromJust (maybeLocale)) (info));
  }
});

ipcRenderer.addListener ('update-not-available', () => {
  const dispatch = store.dispatch as Dispatch<AnyAction, AppState>;
  const maybeLocale = getLocaleMessages (store.getState ());

  if (Maybe.isJust (maybeLocale)) {
    dispatch (updateNotAvailable (Maybe.fromJust (maybeLocale)));
  }
});

ipcRenderer.addListener ('download-progress', (_event: Event, progressObj: ProgressInfo) => {
  store.dispatch (setUpdateDownloadProgress (progressObj));
});

ipcRenderer.addListener ('auto-updater-error', (_event: Event, err: Error) => {
  const dispatch = store.dispatch as Dispatch<AnyAction, AppState>;
  const maybeLocale = getLocaleMessages (store.getState ());

  if (Maybe.isJust (maybeLocale)) {
    dispatch (setUpdateDownloadProgress ());
    dispatch (addErrorAlert (
      {
        title: 'Auto Update Error',
        message: `An error occured during auto-update. (${JSON.stringify (err)})`,
      },
      Maybe.fromJust (maybeLocale)
    ));
  }
});
