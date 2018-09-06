// tslint:disable-next-line:no-implicit-dependencies
import { ProgressInfo } from 'builder-util-runtime';
import { ipcRenderer, remote } from 'electron';
import { UpdateInfo } from 'electron-updater';
import * as fs from 'fs';
import { extname, join } from 'path';
import { ActionTypes } from '../constants/ActionTypes';
import { AppState } from '../reducers/appReducer';
import { getHeroes, getUsers, getWiki } from '../selectors/stateSelectors';
import { getUISettingsState } from '../selectors/uisettingsSelectors';
import { AsyncAction } from '../types/actions';
import { User } from '../types/data';
import { Config, Raw, RawHero, RawHerolist, RawLocale, RawTables } from '../types/rawdata';
import { UIMessagesObject } from '../types/ui';
import { convertHeroesForSave, convertHeroForSave } from '../utils/convertHeroForSave';
import { Maybe, StringKeyObject, UnsafeStringKeyObject } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { getNewIdByDate } from '../utils/IDUtils';
import { bytify, getSystemLocale, readDir, readFile, showOpenDialog, showSaveDialog, windowPrintToPDF, writeFile } from '../utils/IOUtils';
import { isBase64Image } from '../utils/RegexUtils';
import { addAlert } from './AlertActions';

const getSaveDataPath = (): string => remote.app.getPath ('userData');

const getInstalledResourcesPath = (): string => remote.app.getAppPath ();

const loadDataTables = (): AsyncAction<Promise<RawTables | undefined>> =>
  async dispatch => {
    const root = getInstalledResourcesPath ();
    try {
      const result = await readFile (join (root, 'app', 'data.json'));

      return JSON.parse (result as string) as RawTables;
    }
    catch (error) {
      dispatch (addAlert ({
        message: `The rule tables could not be loaded. Please report this issue! (Error Code: ${JSON.stringify (error)})`,
        title: 'Error'
      }));

      return;
    }
  };

const loadConfig = async (): Promise<Config | undefined> => {
  const appPath = getSaveDataPath ();
  try {
    const result = await readFile (join (appPath, 'config.json'));

    return JSON.parse (result as string) as Config;
  }
  catch (error) {
    return;
  }
};

const loadHeroes = async (): Promise<RawHerolist | undefined> => {
  const appPath = getSaveDataPath ();
  try {
    const result = await readFile (join (appPath, 'heroes.json'));

    return JSON.parse (result as string) as RawHerolist;
  }
  catch (error) {
    return;
  }
};

const loadLocales = (): AsyncAction<Promise<StringKeyObject<RawLocale> | undefined>> =>
  async dispatch => {
    const root = getInstalledResourcesPath ();
    try {
      const result = await readDir (join (root, 'app', 'locales'));

      const locales: UnsafeStringKeyObject<RawLocale> = {};

      for (const file of result) {
        const locale = await readFile (join (root, 'app', 'locales', file));
        locales[file.split ('.')[0]] = JSON.parse (locale as string);
      }

      return locales;
    }
    catch (error) {
      dispatch (addAlert ({
        message: `The localizations could not be loaded. Please report this issue! (Error Code: ${JSON.stringify (error)})`,
        title: 'Error'
      }));

      return;
    }
  };

interface ReceiveInitialDataActionPayload extends Raw {
  defaultLocale: string;
}

export interface ReceiveInitialDataAction {
  type: ActionTypes.RECEIVE_INITIAL_DATA;
  payload: ReceiveInitialDataActionPayload;
}

export const requestInitialData = (): AsyncAction<Promise<void>> => async dispatch => {
  const data = await dispatch (getInitialData ());
  if (data) {
    dispatch (receiveInitialData (data));
  }
};

export const getInitialData = (): AsyncAction<Promise<Raw | undefined>> => async dispatch => {
  const tables = await dispatch (loadDataTables ());
  const config = await loadConfig ();
  const heroes = await loadHeroes ();
  const locales = await dispatch (loadLocales ());

  if (tables && locales) {
    return {
      tables,
      heroes,
      locales,
      config
    };
  }

  return;
};

export const receiveInitialData = (data: Raw): ReceiveInitialDataAction => ({
  type: ActionTypes.RECEIVE_INITIAL_DATA,
  payload: {
    ...data,
    defaultLocale: getSystemLocale ()
  }
});

export const requestConfigSave = (locale: UIMessagesObject): AsyncAction<Promise<boolean>> =>
  async (dispatch, getState) => {
    const state = getState ();

    const data: Config = {
      ...getUISettingsState (state),
      locale: locale.get ('id')
    };

    const dataPath = getSaveDataPath ();
    const path = join (dataPath, 'config.json');

    try {
      await writeFile (path, JSON.stringify (data));

      return true;
    }
    catch (error) {
      dispatch (addAlert ({
        message: `${
          translate (locale, 'fileapi.error.message.saveconfig')
        } (${
          translate (locale, 'fileapi.error.message.code')
        }: ${
          JSON.stringify (error)
        })`,
        title: translate (locale, 'fileapi.error.title')
      }));

      return false;
    }
  };

export const requestAllHeroesSave = (locale: UIMessagesObject): AsyncAction<Promise<boolean>> =>
  async (dispatch, getState) => {
    const state = getState ();

    const wiki = getWiki (state);
    const heroes = getHeroes (state);
    const users = getUsers (state);

    const data = convertHeroesForSave (wiki) (locale) (users) (heroes);

    const dataPath = getSaveDataPath ();
    const path = join (dataPath, 'heroes.json');

    try {
      await writeFile (path, JSON.stringify (data));

      return true;
    }
    catch (error) {
      dispatch (addAlert ({
        message: `${
          translate (locale, 'fileapi.error.message.saveconfig')
        } (${
          translate (locale, 'fileapi.error.message.code')
        }: ${
          JSON.stringify (error)
        })`,
        title: translate (locale, 'fileapi.error.title')
      }));

      return false;
    }
  };

export const requestSaveAll = (locale: UIMessagesObject): AsyncAction<Promise<boolean>> =>
  async dispatch => {
    const configSavedDone = await dispatch (requestConfigSave (locale));
    const heroesSavedDone = await dispatch (requestAllHeroesSave (locale));

    return configSavedDone && heroesSavedDone;
  };

export const requestHeroSave = (locale: UIMessagesObject) =>
  (id: string): AsyncAction<Promise<boolean>> =>
    async (dispatch, getState) => {
      const state = getState ();

      const wiki = getWiki (state);
      const heroes = getHeroes (state);
      const users = getUsers (state);

      const maybeHero = heroes.lookup (id)
        .fmap (undoState => undoState.present)
        .fmap (convertHeroForSave (wiki) (locale) (users));

      const dataPath = getSaveDataPath ();
      const path = join (dataPath, 'heroes.json');

      const maybeSavedHeroes = Maybe.fromNullable (await loadHeroes ());

      if (Maybe.isJust (maybeHero)) {
        const hero = Maybe.fromJust (maybeHero);

        try {
          await writeFile (path, JSON.stringify (Maybe.maybe ({ [hero.id]: hero })
                                                             (savedHeroes => ({
                                                               ...savedHeroes,
                                                               [hero.id]: hero
                                                             }))
                                                             (maybeSavedHeroes)));

          return true;
        }
        catch (error) {
          dispatch (addAlert ({
            message: `${
              translate (locale, 'fileapi.error.message.saveconfig')
            } (${
              translate (locale, 'fileapi.error.message.code')
            }: ${
              JSON.stringify (error)
            })`,
            title: translate (locale, 'fileapi.error.title')
          }));

          return false;
        }
      }

      return false;
    };

export const requestHeroDeletion = (locale: UIMessagesObject) =>
  (id: string): AsyncAction<Promise<boolean>> =>
    async dispatch => {
      const dataPath = getSaveDataPath ();
      const path = join (dataPath, 'heroes.json');

      const maybeSavedHeroes = Maybe.fromNullable (await loadHeroes ());

      try {
        await writeFile (
          path,
          JSON.stringify (
            Maybe.maybe<RawHerolist, RawHerolist> ({})
                                                  (savedHeroes => {
                                                    const {
                                                      [id]: _,
                                                      ...other
                                                    } = savedHeroes;

                                                    return other;
                                                  })
                                                  (maybeSavedHeroes))
        );

        return true;
      }
      catch (error) {
        dispatch (addAlert ({
          message: `${
            translate (locale, 'fileapi.error.message.saveconfig')
          } (${
            translate (locale, 'fileapi.error.message.code')
          }: ${
            JSON.stringify (error)
          })`,
          title: translate (locale, 'fileapi.error.title')
        }));

        return false;
      }
    };

export const requestHeroExport = (locale: UIMessagesObject) => (id: string): AsyncAction =>
  async (dispatch, getState) => {
    const state = getState ();

    const wiki = getWiki (state);
    const heroes = getHeroes (state);
    const users = getUsers (state);

    const maybeHero = heroes.lookup (id)
      .fmap (undoState => undoState.present)
      .fmap (convertHeroForSave (wiki) (locale) (users))
      .fmap (
        hero => {
          if (
            typeof hero.avatar === 'string'
            && hero.avatar.length > 0
            && !isBase64Image (hero.avatar)
          ) {
            const preparedUrl = hero.avatar.replace (/file:[\\\/]+/, '');

            if (fs.existsSync (preparedUrl)) {
              const prefix = `data:image/${extname (hero.avatar).slice (1)};base64,`;
              const file = fs.readFileSync (preparedUrl);
              const fileString = file.toString ('base64');

              return {
                ...hero,
                avatar: prefix + fileString
              };
            }
          }

          return hero;
        }
      );

    if (Maybe.isJust (maybeHero)) {
      const hero = Maybe.fromJust (maybeHero);

      const maybeFilename = Maybe.fromNullable (
        await showSaveDialog ({
          title: translate (locale, 'fileapi.exporthero.title'),
          filters: [
            { name: 'JSON', extensions: ['json'] },
          ],
          defaultPath: hero.name.replace (/\//, '\/')
        })
      );

      if (Maybe.isJust (maybeFilename)) {
        const filename = Maybe.fromJust (maybeFilename);

        try {
          await writeFile (filename, JSON.stringify (hero));

          dispatch (addAlert ({
            message: translate (locale, 'fileapi.exporthero.success')
          }));
        }
        catch (error) {
          dispatch (addAlert ({
            message: `${
              translate (locale, 'fileapi.error.message.exporthero')
            } (${
              translate (locale, 'fileapi.error.message.code')
            }: ${
              JSON.stringify (error)
            })`,
            title: translate (locale, 'fileapi.error.title')
          }));
        }
      }
    }
  };

export interface ReceiveImportedHeroAction {
  type: ActionTypes.RECEIVE_IMPORTED_HERO;
  payload: {
    data: RawHero;
    player?: User;
  };
}

export const loadImportedHero =
  (locale: UIMessagesObject): AsyncAction<Promise<RawHero | undefined>> =>
    async dispatch => {
      try {
        const fileNames = await showOpenDialog ({
          filters: [{ name: 'JSON', extensions: ['json'] }]
        });

        if (fileNames) {
          const fileName = fileNames[0];

          if (extname (fileName) === '.json') {
            const fileContent = await readFile (fileName);

            if (typeof fileContent === 'string') {
              return JSON.parse (fileContent) as RawHero;
            }
          }
        }
      }
      catch (error) {
        dispatch (addAlert ({
          message: `${
            translate (locale, 'fileapi.error.message.importhero')
          } (${
            translate (locale, 'fileapi.error.message.code')
          }: ${
            JSON.stringify (error)
          })`,
          title: translate (locale, 'fileapi.error.title')
        }));
      }

      return;
    };

export const requestHeroImport = (locale: UIMessagesObject): AsyncAction => async dispatch => {
  const data = await dispatch (loadImportedHero (locale));

  if (data) {
    dispatch (receiveHeroImport (data));
  }
};

export const receiveHeroImport = (raw: RawHero): ReceiveImportedHeroAction => {
  const newId = `H_${getNewIdByDate ()}`;
  const { player, avatar, ...other } = raw;

  const data: RawHero = {
    ...other,
    id: newId,
    avatar: avatar
      && (isBase64Image (avatar) || fs.existsSync (avatar.replace (/file:[\\\/]+/, '')))
      ? avatar
      : undefined
  };

  return {
    type: ActionTypes.RECEIVE_IMPORTED_HERO,
    payload: {
      data,
      player
    }
  };
};

const isAnyHeroUnsaved = (state: AppState) => state.herolist.get ('heroes')
  .elems ()
  .any (
    hero => !hero.past.null ()
  );

const close = (locale: UIMessagesObject) => (unsaved: boolean) =>
  (f: Maybe<() => void>): AsyncAction =>
    async dispatch => {
      const allSaved = await dispatch (requestSaveAll (locale));

      if (allSaved) {
        dispatch (addAlert ({
          message: translate (locale, unsaved ? 'fileapi.everythingelsesaved' : 'fileapi.allsaved'),
          onClose () {
            if (Maybe.isJust (f)) {
              Maybe.fromJust (f) ();
            }

            remote.getCurrentWindow ().close ();
          }
        }));
      }
    };

export const requestClose = (locale: UIMessagesObject) =>
  (optionalCall: Maybe<() => void>): AsyncAction =>
    (dispatch, getState) => {
      const state = getState ();
      const safeToExit = isAnyHeroUnsaved (state);

      const closeWindow = remote.getCurrentWindow () .close;

      if (safeToExit) {
        closeWindow ();
      }
      else {
        // @ts-ignore
        dispatch (addAlert ({
          title: translate (locale, 'heroes.warnings.unsavedactions.title'),
          message: translate (locale, 'heroes.warnings.unsavedactions.text'),
          confirm: {
            resolve: close (locale) (true) (optionalCall),
            reject: closeWindow as AsyncAction,
          },
          confirmYesNo: true,
        }));
      }
    };

export const requestPrintHeroToPDF = (locale: UIMessagesObject): AsyncAction => async dispatch => {
  try {
    const data = await windowPrintToPDF ({
      marginsType: 1,
      pageSize: 'A4',
      printBackground: true,
    });

    const filename = await showSaveDialog ({
      title: translate (locale, 'fileapi.printcharactersheettopdf.title'),
      filters: [
        {name: 'PDF', extensions: ['pdf']},
      ],
    });

    if (filename) {
      try {
        await writeFile (filename, data);
        dispatch (addAlert ({
          message: translate (locale, 'fileapi.printcharactersheettopdf.success')
        }));
      }
      catch (error) {
        dispatch (addAlert ({
          message: `${translate (locale, 'fileapi.error.message.printcharactersheettopdf')} (${translate (locale, 'fileapi.error.message.code')}: ${JSON.stringify (error)})`,
          title: translate (locale, 'fileapi.error.title')
        }));
      }
    }
  }
  catch (error) {
    dispatch (addAlert ({
      message: `${translate (locale, 'fileapi.error.message.printcharactersheettopdfpreparation')} (${translate (locale, 'fileapi.error.message.code')}: ${JSON.stringify (error)})`,
      title: translate (locale, 'fileapi.error.title')
    }));
  }
};

export interface SetUpdateDownloadProgressAction {
  type: ActionTypes.SET_UPDATE_DOWNLOAD_PROGRESS;
  payload?: ProgressInfo;
}

export const setUpdateDownloadProgress =
  (info?: ProgressInfo): SetUpdateDownloadProgressAction => ({
    type: ActionTypes.SET_UPDATE_DOWNLOAD_PROGRESS,
    payload: info
  });

export const updateAvailable = (locale: UIMessagesObject) => (info: UpdateInfo): AsyncAction =>
  async dispatch => {
    const startDownloadingUpdate: AsyncAction = futureDispatch => {
      futureDispatch (setUpdateDownloadProgress ({
        total: 0,
        delta: 0,
        transferred: 0,
        percent: 0,
        bytesPerSecond: 0
      }));
      ipcRenderer.send ('download-update');
    };

    // @ts-ignore
    dispatch (addAlert ({
      message: info.files[0] && info.files[0].size
        ? translate (
          locale,
          'newversionavailable.messagewithsize',
          info.version,
          bytify (info.files[0].size!, locale.get ('id'))
        )
        : translate (locale, 'newversionavailable.message', info.version),
      title: translate (locale, 'newversionavailable.title'),
      buttons: [
        {
          label: translate (locale, 'newversionavailable.update'),
          dispatchOnClick: startDownloadingUpdate
        },
        {
          label: translate (locale, 'cancel')
        }
      ]
    }));
  };

export const updateNotAvailable = (locale: UIMessagesObject): AsyncAction => async dispatch => {
  dispatch (addAlert ({
    message: translate (locale, 'nonewversionavailable.message'),
    title: translate (locale, 'nonewversionavailable.title')
  }));
};
