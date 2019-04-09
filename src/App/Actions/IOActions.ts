// tslint:disable-next-line:no-implicit-dependencies
import { ProgressInfo } from "builder-util-runtime";
import { ipcRenderer, remote } from "electron";
// tslint:disable-next-line:no-implicit-dependencies
import { UpdateInfo } from "electron-updater";
import * as fs from "fs";
import { extname, join } from "path";
import { tryy } from "../../Control/Exception";
import { Either, eitherToMaybe, fromLeft, fromLeft_, fromRight_, isLeft, isRight, Right } from "../../Data/Either";
import { flip } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { List, notNull } from "../../Data/List";
import { altF_, bind, bindF, fromJust, fromMaybe, isJust, Just, Maybe, maybe, maybeToUndefined, Nothing } from "../../Data/Maybe";
import { any, lookup, lookupF } from "../../Data/OrderedMap";
import { Pair } from "../../Data/Pair";
import { Record, toObject } from "../../Data/Record";
import { fromIO, readFile, writeFile } from "../../System/IO";
import { ActionTypes } from "../Constants/ActionTypes";
import { IdPrefixes } from "../Constants/IdPrefixes";
import { User } from "../Models/Hero/heroTypeHelpers";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";
import { WikiModel } from "../Models/Wiki/WikiModel";
import { heroReducer } from "../Reducers/heroReducer";
import { UISettingsState } from "../Reducers/uiSettingsReducer";
import { getCurrentHeroId, getHeroes, getLocaleMessages, getLocaleType, getUsers, getWiki } from "../Selectors/stateSelectors";
import { getUISettingsState } from "../Selectors/uisettingsSelectors";
import { translate, translateP } from "../Utilities/I18n";
import { getNewIdByDate, prefixId } from "../Utilities/IDUtils";
import { bytify, getSystemLocale, showOpenDialog, showSaveDialog, windowPrintToPDF } from "../Utilities/IOUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { convertHeroesForSave, convertHeroForSave } from "../Utilities/Raw/convertHeroForSave";
import { parseTables } from "../Utilities/Raw/parseTable";
import { RawConfig, RawHero, RawHerolist } from "../Utilities/Raw/RawData";
import { isBase64Image } from "../Utilities/RegexUtils";
import { ReduxAction } from "./Actions";
import { addAlert } from "./AlertActions";

const getSaveDataPath = (): string => remote.app.getPath ("userData")

// const getInstalledResourcesPath = (): string => remote.app.getAppPath ()

const loadDatabase =
  (locale: string): ReduxAction<Either<string, Pair<Record<L10n>, Record<WikiModel>>>> =>
    dispatch => {
      const res = parseTables (locale)

      if (isLeft (res)) {
        dispatch (addAlert ({
          message: fromLeft_ (res),
          title: "Error",
        }))
      }

      return res
    }

const loadConfig = () => {
  const appPath = getSaveDataPath ()

  return pipe_ (
    join (appPath, "config.json"),
    readFile,
    tryy,
    fmap (pipe (eitherToMaybe, fmap (JSON.parse as (x: string) => RawConfig)))
  )
}

const loadHeroes = () => {
  const appPath = getSaveDataPath ()

  return pipe_ (
    join (appPath, "heroes.json"),
    readFile,
    tryy,
    fmap (pipe (eitherToMaybe, fmap (JSON.parse as (x: string) => RawHerolist)))
  )
}

interface InitialData {
  tables: Pair<Record<L10n>, Record<WikiModel>>
  heroes: Maybe<RawHerolist>
  defaultLocale: string
  config: Maybe<RawConfig>
}

export interface ReceiveInitialDataAction {
  type: ActionTypes.RECEIVE_INITIAL_DATA
  payload: InitialData
}

export const requestInitialData = (): ReduxAction => dispatch => {
  const data = dispatch (getInitialData)

  if (isRight (data)) {
    dispatch (receiveInitialData (fromRight_ (data)))
  }
  else {
    dispatch (addAlert ({
      title: "Error loading database",
      message: fromLeft ("") (data),
    }))
  }

  return
}

export const getInitialData: ReduxAction<Either<string, InitialData>> =
  dispatch => {
    const config = fromIO (loadConfig ())
    const heroes = fromIO (loadHeroes ())
    const defaultLocale = getSystemLocale ()
    const tables = dispatch (loadDatabase (fromMaybe (defaultLocale)
                            (bind (config) (c => Maybe (c.locale)))))

    if (isRight (tables)) {
      return Right ({
        tables: fromRight_ (tables),
        heroes,
        defaultLocale,
        config,
      })
    }

    return tables
  }

export const receiveInitialData = (data: InitialData): ReceiveInitialDataAction => ({
  type: ActionTypes.RECEIVE_INITIAL_DATA,
  payload: data,
})

const UISSA = UISettingsState.A

export const requestConfigSave =
  (l10n: L10nRecord): ReduxAction<Promise<boolean>> =>
  async (dispatch, getState) => {
    const state = getState ()

    const uiSettingsState = getUISettingsState (state)

    const data: RawConfig = {
      ...toObject (uiSettingsState),
      meleeItemTemplatesCombatTechniqueFilter:
        maybeToUndefined (UISSA.meleeItemTemplatesCombatTechniqueFilter (uiSettingsState)),
      rangedItemTemplatesCombatTechniqueFilter:
        maybeToUndefined (UISSA.rangedItemTemplatesCombatTechniqueFilter (uiSettingsState)),
      locale: getLocaleType (state) === "default" ? undefined : L10n.A.id (l10n),
    }

    const dataPath = getSaveDataPath ()

    const res = pipe_ (
      join (dataPath, "config.json"),
      flip (writeFile) (JSON.stringify (data)),
      tryy,
      fromIO
    )

    if (isLeft (res)) {
      dispatch (addAlert ({
        message: `${
          translate (l10n) ("saveconfigerror")
        } (${
          translate (l10n) ("errorcode")
        }: ${
          JSON.stringify (fromLeft_ (res))
        })`,
        title: translate (l10n) ("error"),
      }))

      return false
    }

    return true
  }

export const requestAllHeroesSave =
  (l10n: L10nRecord): ReduxAction<Promise<boolean>> =>
  async (dispatch, getState) => {
    const state = getState ()

    const wiki = getWiki (state)
    const heroes = getHeroes (state)
    const users = getUsers (state)

    const data = convertHeroesForSave (wiki) (l10n) (users) (heroes)

    const dataPath = getSaveDataPath ()

    const res = pipe_ (
      join (dataPath, "heroes.json"),
      flip (writeFile) (JSON.stringify (data)),
      tryy,
      fromIO
    )

    if (isLeft (res)) {
      dispatch (addAlert ({
        message: `${
          translate (l10n) ("saveheroeserror")
        } (${
          translate (l10n) ("errorcode")
        }: ${
          JSON.stringify (fromLeft_ (res))
        })`,
        title: translate (l10n) ("error"),
      }))

      return false
    }

    return true
  }

export const requestSaveAll = (l10n: L10nRecord): ReduxAction<Promise<boolean>> =>
  async dispatch => {
    const configSavedDone = await dispatch (requestConfigSave (l10n))
    const heroesSavedDone = await dispatch (requestAllHeroesSave (l10n))

    return configSavedDone && heroesSavedDone
  }

export const requestHeroSave =
  (l10n: L10nRecord) =>
  (mcurrent_id: Maybe<string>): ReduxAction<Maybe<string>> =>
  (dispatch, getState) => {
    const state = getState ()

    const wiki = getWiki (state)
    const heroes = getHeroes (state)
    const users = getUsers (state)

    const mhero =
      pipe_ (
        mcurrent_id,
        altF_ (() => getCurrentHeroId (state)),
        bindF (lookupF (heroes)),
        fmap (pipe (heroReducer.A_.present, convertHeroForSave (wiki) (l10n) (users)))
      )

    const dataPath = getSaveDataPath ()

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      const msaved_heroes = fromIO (loadHeroes ())

      const res = pipe_ (
        join (dataPath, "heroes.json"),
        flip (writeFile) (JSON.stringify (maybe ({ [hero.id]: hero })
                                                ((savedHeroes: RawHerolist) => ({
                                                  ...savedHeroes,
                                                  [hero.id]: hero,
                                                }))
                                                (msaved_heroes))),
        tryy,
        fromIO
      )

      if (isLeft (res)) {
        dispatch (addAlert ({
          message: `${
            translate (l10n) ("saveheroeserror")
          } (${
            translate (l10n) ("errorcode")
          }: ${
            JSON.stringify (fromLeft_ (res))
          })`,
          title: translate (l10n) ("error"),
        }))

        return Nothing
      }

      return Just (hero .id)
    }

    return Nothing
  }

export const requestHeroDeletion =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction<Promise<boolean>> =>
    async dispatch => {
      const dataPath = getSaveDataPath ()

      const msaved_heroes = fromIO (loadHeroes ())

      const res = pipe_ (
        join (dataPath, "heroes.json"),
        flip (writeFile) (JSON.stringify (
                            maybe<RawHerolist> ({})
                                               ((savedHeroes: RawHerolist) => {
                                                 const {
                                                   [id]: _,
                                                   ...other
                                                 } = savedHeroes

                                                 return other
                                               })
                                               (msaved_heroes))),
        tryy,
        fromIO
      )

      if (isLeft (res)) {
        dispatch (addAlert ({
          message: `${
            translate (l10n) ("saveheroeserror")
          } (${
            translate (l10n) ("errorcode")
          }: ${
            JSON.stringify (fromLeft_ (res))
          })`,
          title: translate (l10n) ("error"),
        }))

        return false
      }

      return true
    }

export const requestHeroExport =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction =>
  async (dispatch, getState) => {
    const state = getState ()

    const wiki = getWiki (state)
    const heroes = getHeroes (state)
    const users = getUsers (state)

    const mhero =
      pipe_ (
        heroes,
        lookup (id),
        fmap (pipe (
          heroReducer.A_.present,
          convertHeroForSave (wiki) (l10n) (users),
          hero => {
            // Embed the avatar image file
            if (
              typeof hero.avatar === "string"
              && hero.avatar.length > 0
              && !isBase64Image (hero.avatar)
            ) {
              const preparedUrl = hero.avatar.replace (/file:[\\\/]+/, "")

              if (fs.existsSync (preparedUrl)) {
                const prefix = `data:image/${extname (hero.avatar).slice (1)}base64,`
                const file = fs.readFileSync (preparedUrl)
                const fileString = file.toString ("base64")

                return {
                  ...hero,
                  avatar: prefix + fileString,
                }
              }
            }

            return hero
          }
        ))
      )

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      const mfilename = await showSaveDialog ({
                              title: translate (l10n) ("exportheroasjson"),
                              filters: [
                                { name: "JSON", extensions: ["json"] },
                              ],
                              defaultPath: hero.name.replace (/\//, "\/"),
                            })

      if (isJust (mfilename)) {
        const res = pipe_ (
          fromJust (mfilename),
          flip (writeFile) (JSON.stringify (hero)),
          tryy,
          fromIO
        )

        if (isRight (res)) {
          dispatch (addAlert ({
            message: translate (l10n) ("herosaved"),
          }))
        }
        else {
          dispatch (addAlert ({
            message: `${
              translate (l10n) ("exportheroerror")
            } (${
              translate (l10n) ("errorcode")
            }: ${
              JSON.stringify (fromLeft_ (res))
            })`,
            title: translate (l10n) ("error"),
          }))
        }
      }
    }
  }

export interface ReceiveImportedHeroAction {
  type: ActionTypes.RECEIVE_IMPORTED_HERO
  payload: {
    data: RawHero;
    player?: User;
  }
}

export const loadImportedHero =
  (l10n: L10nRecord): ReduxAction<Promise<Maybe<RawHero>>> =>
  async dispatch => {
    try {
      const mfile_names = await showOpenDialog ({
        filters: [{ name: "JSON", extensions: ["json"] }],
      })

      if (isJust (mfile_names)) {
        const file_name = fromJust (mfile_names) [0]

        if (extname (file_name) === ".json") {
          const res = pipe_ (
            file_name,
            readFile,
            tryy,
            fromIO
          )

          if (isRight (res)) {
            return Just ((JSON.parse as (x: string) => RawHero) (fromRight_ (res)))
          }

          dispatch (addAlert ({
            message: `${
              translate (l10n) ("importheroerror")
            } (${
              translate (l10n) ("errorcode")
            }: ${
              JSON.stringify (fromLeft_ (res))
            })`,
            title: translate (l10n) ("error"),
          }))
        }
      }
    }
    catch (error) {
      dispatch (addAlert ({
        message: `${
          translate (l10n) ("importheroerror")
        } (${
          translate (l10n) ("errorcode")
        }: ${
          JSON.stringify (error)
        })`,
        title: translate (l10n) ("error"),
      }))
    }

    return Nothing
  }

export const requestHeroImport =
  (l10n: L10nRecord): ReduxAction =>
  async dispatch => {
    const data = await dispatch (loadImportedHero (l10n))

    if (isJust (data)) {
      dispatch (receiveHeroImport (fromJust (data)))
    }
  }

export const receiveHeroImport = (raw: RawHero): ReceiveImportedHeroAction => {
  const newId = prefixId (IdPrefixes.HERO) (getNewIdByDate ())
  const { player, avatar, ...other } = raw

  const data: RawHero = {
    ...other,
    id: newId,
    avatar: avatar !== undefined
      && avatar.length > 0
      && (isBase64Image (avatar) || fs.existsSync (avatar.replace (/file:[\\\/]+/, "")))
      ? avatar
      : undefined,
  }

  return {
    type: ActionTypes.RECEIVE_IMPORTED_HERO,
    payload: {
      data,
      player,
    },
  }
}

const isAnyHeroUnsaved = pipe (
                                getHeroes,
                                any (pipe (heroReducer.A_.past, notNull))
                              )

const close =
  (l10n: L10nRecord) =>
  (unsaved: boolean) =>
  (f: Maybe<() => void>): ReduxAction =>
  async dispatch => {
    const allSaved = await dispatch (requestSaveAll (l10n))

    if (allSaved) {
      dispatch (addAlert ({
        message: translate (l10n) (unsaved ? "everythingelsesaved" : "allsaved"),
        onClose () {
          if (isJust (f)) {
            fromJust (f) ()
          }

          remote.getCurrentWindow ().close ()
        },
      }))
    }
  }

export const requestClose =
  (optionalCall: Maybe<() => void>): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const safeToExit = isAnyHeroUnsaved (state)

    const currentWindow = remote.getCurrentWindow ()

    const ml10n = getLocaleMessages (state)

    if (isJust (ml10n)) {
      const l10n = fromJust (ml10n)

      if (safeToExit) {
        currentWindow .close ()
      }
      else {
        dispatch (addAlert ({
          title: translate (l10n) ("unsavedactions"),
          message: translate (l10n) ("unsavedactions.text"),
          confirm: {
            resolve: close (l10n) (true) (optionalCall),
            reject: currentWindow .close,
          },
          confirmYesNo: true,
        }))
      }
    }
  }

export const requestPrintHeroToPDF =
  (l10n: L10nRecord): ReduxAction =>
  async dispatch => {
    try {
      const data = await windowPrintToPDF ({
        marginsType: 1,
        pageSize: "A4",
        printBackground: true,
      })

      const mfilename = await showSaveDialog ({
        title: translate (l10n) ("printcharactersheettopdf"),
        filters: [
          { name: "PDF", extensions: ["pdf"] },
        ],
      })

      if (isJust (mfilename)) {
        const res = pipe_ (
          fromJust (mfilename),
          flip (writeFile) (data),
          tryy,
          fromIO
        )

        if (isRight (res)) {
          dispatch (addAlert ({
            message: translate (l10n) ("pdfsaved"),
          }))
        }
        else {
          dispatch (addAlert ({
            message:
              `${translate (l10n) ("printcharactersheettopdf")}`
              + ` (${translate (l10n) ("errorcode")}: `
              + `${JSON.stringify (fromLeft_ (res))})`,
            title: translate (l10n) ("error"),
          }))
        }
      }
    }
    catch (error) {
      dispatch (addAlert ({
        message:
          `${translate (l10n) ("pdfcreationerror")}`
          + ` (${translate (l10n) ("errorcode")}: `
          + `${JSON.stringify (error)})`,
        title: translate (l10n) ("error"),
      }))
    }
  }

export interface SetUpdateDownloadProgressAction {
  type: ActionTypes.SET_UPDATE_DOWNLOAD_PROGRESS
  payload?: ProgressInfo
}

export const setUpdateDownloadProgress =
  (info?: ProgressInfo): SetUpdateDownloadProgressAction => ({
    type: ActionTypes.SET_UPDATE_DOWNLOAD_PROGRESS,
    payload: info,
  })

export const updateAvailable =
  (l10n: L10nRecord) =>
  (info: UpdateInfo): ReduxAction =>
  async dispatch => {
    const startDownloadingUpdate: ReduxAction = futureDispatch => {
      futureDispatch (setUpdateDownloadProgress ({
        total: 0,
        delta: 0,
        transferred: 0,
        percent: 0,
        bytesPerSecond: 0,
      }))
      ipcRenderer.send ("download-update")
    }

    const size = info.files.reduce ((sum, { size: fileSize = 0 }) => sum + fileSize, 0)

    // @ts-ignore
    dispatch (addAlert ({
      message: size > 0
        ? translateP (l10n)
                     ("newversionavailable.textwithsize")
                     (List (info.version, bytify (L10n.A.id (l10n)) (size)))
        : translateP (l10n) ("newversionavailable.text") (List (info.version)),
      title: translate (l10n) ("newversionavailable"),
      buttons: [
        {
          label: translate (l10n) ("update"),
          dispatchOnClick: startDownloadingUpdate,
        },
        {
          label: translate (l10n) ("cancel"),
        },
      ],
    }))
  }

export const updateNotAvailable = (l10n: L10nRecord): ReduxAction => async dispatch => {
  dispatch (addAlert ({
    message: translate (l10n) ("nonewversionavailable.text"),
    title: translate (l10n) ("nonewversionavailable"),
  }))
}
