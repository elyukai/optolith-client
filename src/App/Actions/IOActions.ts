// tslint:disable-next-line:no-implicit-dependencies
import { ProgressInfo } from "builder-util-runtime";
import { ipcRenderer, remote } from "electron";
// tslint:disable-next-line:no-implicit-dependencies
import { UpdateInfo } from "electron-updater";
import * as fs from "fs";
import { extname, join } from "path";
import { tryIO } from "../../Control/Exception";
import { and } from "../../Data/Bool";
import { bimap, Either, eitherToMaybe, fromLeft, fromLeft_, fromRight_, isLeft, isRight } from "../../Data/Either";
import { cnst, flip } from "../../Data/Function";
import { fmap, fmapF } from "../../Data/Functor";
import { over } from "../../Data/Lens";
import { List, notNull } from "../../Data/List";
import { alt_, bind, bindF, ensure, fromJust, fromMaybe, isJust, isNothing, Just, listToMaybe, Maybe, maybe, maybeToUndefined, Nothing } from "../../Data/Maybe";
import { any, filter, keysSet, lookup, lookupF, mapMaybe, OrderedMap } from "../../Data/OrderedMap";
import { notMember } from "../../Data/OrderedSet";
import { Record, StringKeyObject, toObject } from "../../Data/Record";
import { fst, Pair } from "../../Data/Tuple";
import { IO, readFile, runIO, writeFile } from "../../System/IO";
import { ActionTypes } from "../Constants/ActionTypes";
import { IdPrefixes } from "../Constants/IdPrefixes";
import { HeroModel, HeroModelL } from "../Models/Hero/HeroModel";
import { User } from "../Models/Hero/heroTypeHelpers";
import { PetL } from "../Models/Hero/Pet";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";
import { WikiModel } from "../Models/Wiki/WikiModel";
import { heroReducer } from "../Reducers/heroReducer";
import { UISettingsState } from "../Reducers/uiSettingsReducer";
import { getAPObjectMap } from "../Selectors/adventurePointsSelectors";
import { user_data_path } from "../Selectors/envSelectors";
import { getCurrentHeroId, getHeroes, getLocaleId, getLocaleMessages, getUsers } from "../Selectors/stateSelectors";
import { getUISettingsState } from "../Selectors/uisettingsSelectors";
import { APCache, deleteCache, forceCacheIsAvailable, insertAppStateCache, insertCacheMap, insertHeroesCache, readCache, toAPCache, writeCache } from "../Utilities/Cache";
import { translate, translateP } from "../Utilities/I18n";
import { getNewIdByDate, prefixId } from "../Utilities/IDUtils";
import { bytify, getSystemLocale, NothingIO, showOpenDialog, showSaveDialog, windowPrintToPDF } from "../Utilities/IOUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { convertHeroesForSave, convertHeroForSave } from "../Utilities/Raw/convertHeroForSave";
import { parseTables, TableParseRes } from "../Utilities/Raw/parseTable";
import { RawConfig, RawHero, RawHerolist } from "../Utilities/Raw/RawData";
import { isBase64Image } from "../Utilities/RegexUtils";
import { UndoState } from "../Utilities/undo";
import { readUpdate, writeUpdate } from "../Utilities/Update";
import { ReduxAction } from "./Actions";
import { addAlert } from "./AlertActions";
import { updateDateModified } from "./HerolistActions";

// const getInstalledResourcesPath = (): string => remote.app.getAppPath ()

const loadConfig = () =>
  pipe_ (
    join (user_data_path, "config.json"),
    readFile,
    tryIO,
    fmap (pipe (eitherToMaybe, fmap (JSON.parse as (x: string) => RawConfig)))
  )

const loadHeroes = () =>
  pipe_ (
    join (user_data_path, "heroes.json"),
    readFile,
    tryIO,
    fmap (pipe (eitherToMaybe, fmap (JSON.parse as (x: string) => RawHerolist)))
  )

interface InitialData {
  tables: Pair<Record<L10n>, Record<WikiModel>>
  heroes: Maybe<RawHerolist>
  defaultLocale: string
  config: Maybe<RawConfig>
  cache: Maybe<OrderedMap<string, APCache>>
}

export interface ReceiveInitialDataAction {
  type: ActionTypes.RECEIVE_INITIAL_DATA
  payload: InitialData
}

export const requestInitialData: ReduxAction<IO<void>> = dispatch =>
  fmapF (dispatch (getInitialData))
        (data => {
          if (isRight (data)) {
            dispatch (receiveInitialData (fromRight_ (data)))
            dispatch ((dispatch2, getState) => {
              insertAppStateCache (getState ())
              insertHeroesCache (getHeroes (getState ()))
              const mcache = fromRight_ (data) .cache

              if (isJust (mcache)) {
                const cache = fromJust (mcache)
                insertCacheMap (cache)

                pipe_ (
                  getHeroes (getState ()),
                  filter (pipe (
                    heroReducer.A.present,
                    HeroModel.A.id,
                    flip (notMember) (keysSet (cache))
                  )),
                  OrderedMap.map (pipe (
                    heroReducer.A.present,
                    hero => {
                      forceCacheIsAvailable (HeroModel.A.id (hero))
                                            (getState ())
                                            ({ l10n: fst (fromRight_ (data) .tables), hero })

                      return hero
                    }
                  ))
                )
              }

              dispatch2 (endLoadingState ())
            })
          }
          else {
            dispatch (addAlert ({
              title: "Error loading database",
              message: fromLeft ("") (data),
            }))
          }
        })

export interface EndLoadingState {
  type: ActionTypes.END_LOADING_STATE
}

export const endLoadingState = () => ({
  type: ActionTypes.END_LOADING_STATE,
})

export const getInitialData: ReduxAction<IO<Either<string, InitialData>>> =
  dispatch => {
    const defaultLocale = getSystemLocale ()

    return pipe_ (
      readUpdate,
      IO.bindF (did_update =>
                  did_update
                    ? IO.then (deleteCache ()) (writeUpdate (false))
                    : writeUpdate (false)),
      IO.thenF (IO.liftM3 ((mconfig: Maybe<RawConfig>) =>
                           (mheroes: Maybe<StringKeyObject<RawHero>>) =>
                           (mcache: Maybe<OrderedMap<string, APCache>>) =>
                             fmapF (parseTables (fromMaybe (defaultLocale)
                                                           (bind (mconfig)
                                                                 (c => Maybe (c.locale)))))
                                   (bimap ((msg: string) => {
                                            console.error (`Table parse error: ${msg}`)

                                            dispatch (addAlert ({
                                              message: msg,
                                              title: "Error",
                                            }))

                                            return msg
                                          })
                                          ((tables: TableParseRes): InitialData =>
                                             ({
                                               tables,
                                               heroes: mheroes,
                                               defaultLocale,
                                               config: mconfig,
                                               cache: mcache,
                                             }))))
                          (loadConfig ())
                          (loadHeroes ())
                          (readCache)),
      IO.join
    )
  }

export const receiveInitialData = (data: InitialData): ReceiveInitialDataAction => ({
  type: ActionTypes.RECEIVE_INITIAL_DATA,
  payload: data,
})

const UISSA = UISettingsState.A

export const requestConfigSave =
  (l10n: L10nRecord): ReduxAction<IO<boolean>> =>
  (dispatch, getState) => {
    const state = getState ()

    const uiSettingsState = getUISettingsState (state)

    const data: RawConfig = {
      ...toObject (uiSettingsState),
      meleeItemTemplatesCombatTechniqueFilter:
        maybeToUndefined (UISSA.meleeItemTemplatesCombatTechniqueFilter (uiSettingsState)),
      rangedItemTemplatesCombatTechniqueFilter:
        maybeToUndefined (UISSA.rangedItemTemplatesCombatTechniqueFilter (uiSettingsState)),
      locale: maybeToUndefined (getLocaleId (state)),
    }

    return pipe_ (
      join (user_data_path, "config.json"),
      flip (writeFile) (JSON.stringify (data)),
      tryIO,
      fmap (res => {
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
      })
    )
  }

export const requestAllHeroesSave =
  (l10n: L10nRecord): ReduxAction<IO<boolean>> =>
  (dispatch, getState) => {
    const heroes_before = getHeroes (getState ())

    OrderedMap.map ((x: Record<UndoState<Record<HeroModel>>>) => {
                     if (notNull (heroReducer.A.past (x))) {
                       dispatch (updateDateModified (HeroModel.A.id (heroReducer.A.present (x))))
                     }

                     return x
                   })
                   (heroes_before)

    const state = getState ()
    const heroes = getHeroes (state)
    const users = getUsers (state)

    const data = convertHeroesForSave (users) (heroes)

    return pipe_ (
      join (user_data_path, "heroes.json"),
      flip (writeFile) (JSON.stringify (data)),
      tryIO,
      fmap (res => {
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
      })
    )
  }

const requestSaveAll = (save_heroes: boolean) => (l10n: L10nRecord): ReduxAction<IO<boolean>> =>
  dispatch => {
    const configSavedDone = dispatch (requestConfigSave (l10n))
    const heroesSavedDone = save_heroes ? dispatch (requestAllHeroesSave (l10n)) : IO.pure (true)

    return IO.liftM2 (and) (configSavedDone) (heroesSavedDone)
  }

export const requestSaveCache =
  (l10n: L10nRecord): ReduxAction<IO<Either<Error, void>>> =>
  (_, getState) =>
    pipe_ (
      getState (),
      getHeroes,
      mapMaybe (pipe (
        heroReducer.A.present,
        hero => getAPObjectMap (HeroModel.A.id (hero)) (getState (), { l10n, hero }),
        Maybe.join,
        fmap (toAPCache)
      )),
      writeCache
    )

export const requestHeroSave =
  (l10n: L10nRecord) =>
  (mcurrent_id: Maybe<string>): ReduxAction<IO<Maybe<string>>> =>
  (dispatch, getState) => {
    const mcurrent_id_alt = alt_ (mcurrent_id) (() => getCurrentHeroId (getState ()))

    if (isNothing (mcurrent_id_alt)) {
      return IO (cnst (Promise.resolve (Nothing)))
    }

    const current_id = fromJust (mcurrent_id_alt)

    dispatch (updateDateModified (current_id))

    const state = getState ()

    const heroes = getHeroes (state)
    const users = getUsers (state)

    const mhero =
      pipe_ (
        current_id,
        lookupF (heroes),
        fmap (pipe (heroReducer.A_.present, convertHeroForSave (users)))
      )

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      return IO.bind (loadHeroes ())
                     (msaved_heroes =>
                       pipe_ (
                         join (user_data_path, "heroes.json"),
                         flip (writeFile) (JSON.stringify (maybe ({ [hero.id]: hero })
                                                                 ((savedHeroes: RawHerolist) => ({
                                                                   ...savedHeroes,
                                                                   [hero.id]: hero,
                                                                 }))
                                                                 (msaved_heroes))),
                         tryIO,
                         fmap (res => {
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
                           else {
                             dispatch (addAlert ({
                               title: translate (l10n) ("herosaved"),
                               message: "",
                             }))

                             return Just (hero .id)
                           }
                         })
                       ))
    }

    return IO (cnst (Promise.resolve (Nothing)))
  }

export const requestHeroDeletion =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction<IO<boolean>> =>
    dispatch =>
      IO.bind (loadHeroes ())
              (msaved_heroes =>
                pipe_ (
                  join (user_data_path, "heroes.json"),
                  flip (writeFile) (JSON.stringify (
                                      maybe<RawHerolist> ({})
                                                         ((savedHeroes: RawHerolist) => {
                                                           const {
                                                             [id]: _,
                                                             ...other
                                                           } = savedHeroes

                                                           return other
                                                         })
                                                         (msaved_heroes)
                                   )),
                  tryIO,
                  fmap (res => {
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
                  })
                ))

const convertImageToBase64 =
  (url: Maybe<string>): Maybe<string> => {
    if (isJust (url)) {
      const just_url = fromJust (url)

      if (just_url.length > 0 && !isBase64Image (just_url)) {
        const preparedUrl = just_url .replace (/file:[\\/]+/u, "")

        if (fs.existsSync (preparedUrl)) {
          const prefix = `data:image/${extname (just_url).slice (1)}base64,`
          const file = fs.readFileSync (preparedUrl)
          const fileString = file.toString ("base64")

          return Just (prefix + fileString)
        }
      }
    }

    return url
  }

export const requestHeroExport =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()

    const heroes = getHeroes (state)
    const users = getUsers (state)

    const mhero =
      pipe_ (
        heroes,
        lookup (id),
        fmap (pipe (
          heroReducer.A_.present,
          over (HeroModelL.avatar) (convertImageToBase64),
          over (HeroModelL.pets) (OrderedMap.map (over (PetL.avatar) (convertImageToBase64))),
          convertHeroForSave (users)
        ))
      )

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      pipe_ (
        showSaveDialog ({
          title: translate (l10n) ("exportheroasjson"),
          filters: [
            { name: "JSON", extensions: ["json"] },
          ],
          defaultPath: hero.name.replace (/\//u, "/"),
        }),
        IO.bindF (maybe (IO.pure<void> (undefined))
                        (flip (writeFile) (JSON.stringify (hero)))),
        tryIO,
        fmap (res => {
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
        }),
        runIO
      )
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
  (l10n: L10nRecord): ReduxAction<IO<Maybe<RawHero>>> =>
  dispatch =>
    pipe_ (
      showOpenDialog ({ filters: [{ name: "JSON", extensions: ["json"] }] }),
      IO.bindF (pipe (
        listToMaybe,
        bindF (ensure (x => extname (x) === ".json")),
        maybe<IO<Maybe<Either<Error, string>>>> (NothingIO)
                                                (pipe (readFile, tryIO, fmap (Just)))
      )),
      fmap (bindF (res => {
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

        return Nothing
      }))
    )

export const requestHeroImport =
  (l10n: L10nRecord): ReduxAction =>
  dispatch => runIO (fmapF (dispatch (loadImportedHero (l10n)))
                           (fmap (x => dispatch (receiveHeroImport (x)))))

export const receiveHeroImport = (raw: RawHero): ReceiveImportedHeroAction => {
  const newId = prefixId (IdPrefixes.HERO) (getNewIdByDate ())
  const { player, avatar, ...other } = raw

  const data: RawHero = {
    ...other,
    id: newId,
    avatar: avatar !== undefined
      && avatar.length > 0
      && (isBase64Image (avatar) || fs.existsSync (avatar.replace (/file:[\\/]+/u, "")))
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

const isAnyHeroUnsaved = pipe (getHeroes, any (pipe (heroReducer.A.past, notNull)))

const close =
  (l10n: L10nRecord) =>
  (save_heroes: boolean) =>
  (f: Maybe<() => void>): ReduxAction =>
  dispatch => pipe_ (
    dispatch (requestSaveCache (l10n)),
    IO.thenF (dispatch (requestSaveAll (save_heroes) (l10n))),
    fmap (all_saved => {
           if (all_saved && save_heroes) {
             dispatch (addAlert ({
               message: translate (l10n) ("allsaved"),
               onClose () {
                 if (isJust (f)) {
                   fromJust (f) ()
                 }

                 remote .getCurrentWindow () .close ()
               },
             }))
           }
           else {
             remote .getCurrentWindow () .close ()
           }
         }),
    runIO
  )


export const requestClose =
  (optionalCall: Maybe<() => void>): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const safeToExit = !isAnyHeroUnsaved (state)

    const ml10n = getLocaleMessages (state)

    if (isJust (ml10n)) {
      const l10n = fromJust (ml10n)

      if (safeToExit) {
        dispatch (close (l10n) (false) (optionalCall))
      }
      else {
        dispatch (addAlert ({
          title: translate (l10n) ("unsavedactions"),
          message: translate (l10n) ("unsavedactions.text"),
          buttons: [
            {
              label: translate (l10n) ("quit"),
              dispatchOnClick: close (l10n) (false) (optionalCall),
            },
            {
              label: translate (l10n) ("cancel"),
            },
            {
              label: translate (l10n) ("saveandquit"),
              dispatchOnClick: close (l10n) (true) (optionalCall),
            },
          ],
        }))
      }
    }
  }

export const requestPrintHeroToPDF =
  (l10n: L10nRecord): ReduxAction =>
  dispatch =>
    pipe_ (
      windowPrintToPDF ({
        marginsType: 1,
        pageSize: "A4",
        printBackground: true,
      }),
      fmap (flip (writeFile)),
      IO.bindF (f => IO.bind (showSaveDialog ({
                               title: translate (l10n) ("printcharactersheettopdf"),
                               filters: [
                                 { name: "PDF", extensions: ["pdf"] },
                               ],
                             }))
                             (maybe (IO.pure<void> (undefined))
                                    (f))),
      tryIO,
      fmap (res => {
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
      }),
      runIO
    )

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
