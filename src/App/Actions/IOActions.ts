import { ProgressInfo } from "builder-util-runtime"
import { ipcRenderer, remote } from "electron"
import { UpdateInfo } from "electron-updater"
import * as fs from "fs"
import { extname, join } from "path"
import { handleE, toMsg } from "../../Control/Exception"
import { bimap, Either, either, eitherToMaybe, first, fromLeft_, fromRight_, isLeft, isRight, Left, Right } from "../../Data/Either"
import { flip } from "../../Data/Function"
import { fmap } from "../../Data/Functor"
import { over } from "../../Data/Lens"
import { appendStr, List, notNull } from "../../Data/List"
import { alt_, bindF, elem, ensure, fromJust, fromMaybe, isJust, isNothing, Just, listToMaybe, Maybe, maybe, Nothing } from "../../Data/Maybe"
import { any, filter, keysSet, lookup, lookupF, mapMaybe, OrderedMap } from "../../Data/OrderedMap"
import { notMember } from "../../Data/OrderedSet"
import { Record, toObject } from "../../Data/Record"
import { parseJSON, tryParseJSON } from "../../Data/String/JSON"
import { fst, Pair, snd } from "../../Data/Tuple"
import * as IO from "../../System/IO"
import * as ActionTypes from "../Constants/ActionTypes"
import { IdPrefixes } from "../Constants/IdPrefixes"
import { HeroModel, HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel"
import { User } from "../Models/Hero/heroTypeHelpers"
import { PetL } from "../Models/Hero/Pet"
import { UISettingsState } from "../Models/UISettingsState"
import { L10n } from "../Models/Wiki/L10n"
import { StaticData, StaticDataRecord } from "../Models/Wiki/WikiModel"
import { heroReducer } from "../Reducers/heroReducer"
import { LAST_LOADING_PHASE } from "../Reducers/isReadyReducer"
import { getAPObjectMap } from "../Selectors/adventurePointsSelectors"
import { user_data_path } from "../Selectors/envSelectors"
import { getCurrentHeroId, getCurrentHeroName, getHeroes, getLocaleId, getLocaleMessages, getUsers, getWiki } from "../Selectors/stateSelectors"
import { getUISettingsState } from "../Selectors/uisettingsSelectors"
import { APCache, deleteCache, forceCacheIsAvailable, insertAppStateCache, insertCacheMap, insertHeroesCache, readCache, toAPCache, writeCache } from "../Utilities/Cache"
import { translate, translateP } from "../Utilities/I18n"
import { getNewIdByDate, prefixId } from "../Utilities/IDUtils"
import { bytify, getSystemLocale, showOpenDialog, showSaveDialog, windowPrintToPDF } from "../Utilities/IOUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { Config, Locale, readConfig, writeConfig } from "../Utilities/Raw/JSON/Config"
import { convertHero } from "../Utilities/Raw/JSON/Hero/Compat"
import { convertFromRawHero } from "../Utilities/Raw/JSON/Hero/HeroFromJSON"
import { convertHeroesForSave, convertHeroForSave } from "../Utilities/Raw/JSON/Hero/HeroToJSON"
import { RawHero, RawHerolist } from "../Utilities/Raw/RawData"
import { parseTables, TableParseRes } from "../Utilities/Raw/XLSX"
import { isBase64Image } from "../Utilities/RegexUtils"
import { UndoState } from "../Utilities/undo"
import { readUpdate, writeUpdate } from "../Utilities/Update"
import { ReduxAction } from "./Actions"
import { addAlert, addDefaultErrorAlert, addErrorAlert, addPrompt, AlertOptions, CustomPromptOptions, getErrorMsg, PromptButton } from "./AlertActions"
import { updateDateModified } from "./HerolistActions"


// const getInstalledResourcesPath = (): string => remote.app.getAppPath ()

const loadConfig = async () =>
  pipe_ (
    join (user_data_path, "config.json"),
    IO.readFile,
    handleE,
    fmap (pipe (
      first (err => err .message),
      fmap (readConfig)
    ))
  )

const loadHeroes = async () =>
  pipe_ (
    join (user_data_path, "heroes.json"),
    IO.readFile,
    handleE,
    fmap (pipe (eitherToMaybe, bindF (parseJSON as (x: string) => Maybe<RawHerolist>)))
  )

interface InitialData {
  tables: Pair<Record<L10n>, Record<StaticData>>
  heroes: Maybe<RawHerolist>
  defaultLocale: Locale
  config: Maybe<Record<Config>>
  cache: Maybe<OrderedMap<string, APCache>>
}

export interface ReceiveInitialDataAction {
  type: ActionTypes.RECEIVE_INITIAL_DATA
  payload: InitialData
}

export const receiveInitialData = (data: InitialData): ReceiveInitialDataAction => ({
  type: ActionTypes.RECEIVE_INITIAL_DATA,
  payload: data,
})

export const getInitialData: ReduxAction<Promise<Either<Pair<string, string>, InitialData>>> =
  async dispatch => {
    const defaultLocale = getSystemLocale ()

    const did_update = await readUpdate ()

    if (did_update) {
      const deleted = await deleteCache ()

      if (isLeft (deleted)) {
        return first (pipe (toMsg, Pair ("Error"))) (deleted)
      }
    }

    const update_written = await writeUpdate (false)

    if (isLeft (update_written)) {
      return first (pipe (toMsg, Pair ("Error"))) (update_written)
    }

    // parsing error inside, missing file outside
    const eeconfig = await loadConfig ()

    // parsing error outside, missing file inside
    const eeconfig_flipped = either ((file_err: string): typeof eeconfig => Right (Left (file_err)))
                                    (either ((parse_err: string): typeof eeconfig =>
                                              Left (parse_err))
                                            ((c: Record<Config>) => Right (Right (c))))
                                    (eeconfig)

    if (isLeft (eeconfig_flipped)) {
      const msg = fromLeft_ (eeconfig_flipped)

      console.error (`Config parse error: ${msg}`)

      return Left (Pair ("Config Error", msg))
    }

    const mconfig = eitherToMaybe (fromRight_ (eeconfig_flipped))
    const mheroes = await loadHeroes ()
    const mcache = await readCache ()

    const eres = await dispatch (parseTables (pipe_ (
      mconfig,
      bindF (Config.A.locale),
      fromMaybe (defaultLocale)
    )))

    return bimap ((msg: string) => {
                   console.error (`Table parse error: ${msg}`)

                   return Pair ("Database Error", msg)
                 })
                 ((tables: TableParseRes): InitialData =>
                   ({
                     tables,
                     heroes: mheroes,
                     defaultLocale,
                     config: mconfig,
                     cache: mcache,
                   }))
                 (eres)
  }

export interface SetLoadingPhase {
  type: ActionTypes.SET_LOADING_PHASE
  payload: {
    phase: number
  }
}

export const setLoadingPhase = (phase: number): SetLoadingPhase => ({
  type: ActionTypes.SET_LOADING_PHASE,
  payload: {
    phase,
  },
})

export const requestInitialData: ReduxAction<Promise<void>> = async dispatch =>
  IO.bind (dispatch (getInitialData))
       (async data => {
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

             dispatch2 (setLoadingPhase (LAST_LOADING_PHASE))
           })

           return Promise.resolve ()
         }
         else {
           await dispatch (addErrorAlert (StaticData.default)
                                         (AlertOptions ({
                                           title: Just (fst (fromLeft_ (data))),
                                           message: snd (fromLeft_ (data)),
                                         })))

           return Promise.resolve ()
         }
       })

const UISSA = UISettingsState.A

export const requestConfigSave =
  (staticData: StaticDataRecord): ReduxAction<Promise<boolean>> =>
  async (dispatch, getState) => {
    const state = getState ()

    const uiSettingsState = getUISettingsState (state)

    const data = Config ({
      ...toObject (uiSettingsState),
      sheetCheckAttributeValueVisibility:
        Just (UISSA.sheetCheckAttributeValueVisibility (uiSettingsState)),
      theme: Just (UISSA.theme (uiSettingsState)),
      enableEditingHeroAfterCreationPhase:
        Just (UISSA.enableEditingHeroAfterCreationPhase (uiSettingsState)),
      enableAnimations: Just (UISSA.enableAnimations (uiSettingsState)),
      locale: getLocaleId (state),
    })

    return pipe_ (
      join (user_data_path, "config.json"),
      flip (IO.writeFile) (writeConfig (data)),
      handleE,
      IO.bindF (async res => {
        console.log (res)

        if (isLeft (res)) {
          const title = Just (translate (staticData) ("header.dialogs.saveconfigerror.title"))

          const message = getErrorMsg (staticData)
                                      (translate (staticData)
                                                 ("header.dialogs.saveconfigerror.message"))
                                      (res)

          await dispatch (addErrorAlert (staticData)
                                        (AlertOptions ({
                                          title,
                                          message,
                                        })))

          return false
        }

        return true
      })
    )
  }

export const requestAllHeroesSave =
  (staticData: StaticDataRecord): ReduxAction<Promise<boolean>> =>
  async (dispatch, getState) => {
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
      flip (IO.writeFile) (JSON.stringify (data)),
      handleE,
      IO.bindF (async res => {
        if (isLeft (res)) {
          const title = Just (translate (staticData) ("header.dialogs.saveheroeserror.title"))

          const message = getErrorMsg (staticData)
                                      (translate (staticData)
                                                 ("header.dialogs.saveheroeserror.message"))
                                      (res)

          await dispatch (addErrorAlert (staticData)
                                        (AlertOptions ({
                                          title,
                                          message,
                                        })))

          return false
        }

        return true
      })
    )
  }

const requestSaveAll =
  (save_heroes: boolean) =>
  (staticData: StaticDataRecord): ReduxAction<Promise<boolean>> =>
  async dispatch => {
    const configSavedDone = await dispatch (requestConfigSave (staticData))
    const heroesSavedDone = save_heroes
                            ? await dispatch (requestAllHeroesSave (staticData))
                            : true

    return configSavedDone && heroesSavedDone
  }

export const requestSaveCache =
  (staticData: StaticDataRecord): ReduxAction<Promise<Either<Error, void>>> =>
  async (_, getState) =>
    pipe_ (
      getState (),
      getHeroes,
      mapMaybe (pipe (
        heroReducer.A.present,
        hero => getAPObjectMap (HeroModel.A.id (hero)) (getState (), { staticData, hero }),
        Maybe.join,
        fmap (toAPCache)
      )),
      writeCache
    )

export const requestHeroSave =
  (staticData: StaticDataRecord) =>
  (mcurrent_id: Maybe<string>): ReduxAction<Promise<Maybe<string>>> =>
  async (dispatch, getState) => {
    const mcurrent_id_alt = alt_ (mcurrent_id) (() => getCurrentHeroId (getState ()))

    if (isNothing (mcurrent_id_alt)) {
      return Promise.resolve (Nothing)
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
        fmap (pipe (heroReducer.A.present, convertHeroForSave (users)))
      )

    if (isJust (mhero)) {
      const hero = fromJust (mhero)
      const msaved_heroes = await loadHeroes ()

      return pipe_ (
        join (user_data_path, "heroes.json"),
        flip (IO.writeFile) (JSON.stringify (maybe ({ [hero.id]: hero })
                                                   ((savedHeroes: RawHerolist) => ({
                                                     ...savedHeroes,
                                                     [hero.id]: hero,
                                                   }))
                                                   (msaved_heroes))),
        handleE,
        IO.bindF (async res => {
          if (isLeft (res)) {
            const title = Just (translate (staticData) ("header.dialogs.saveheroeserror.title"))

            const message = getErrorMsg (staticData)
                                        (translate (staticData)
                                                   ("header.dialogs.saveheroeserror.message"))
                                        (res)

            await dispatch (addErrorAlert (staticData)
                                          (AlertOptions ({
                                            title,
                                            message,
                                          })))

            return Nothing
          }
          else {
            await dispatch (addAlert (staticData)
                                     (AlertOptions ({
                                       message: translate (staticData) ("heroes.dialogs.herosaved"),
                                     })))

            return Just (hero .id)
          }
        })
      )
    }

    return Promise.resolve (Nothing)
  }

export const requestHeroDeletion =
  (staticData: StaticDataRecord) =>
  (id: string): ReduxAction<Promise<boolean>> =>
  async dispatch => {
    const msaved_heroes = await loadHeroes ()

    return pipe_ (
      join (user_data_path, "heroes.json"),
      flip (IO.writeFile) (JSON.stringify (
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
      handleE,
      IO.bindF (async res => {
        if (isLeft (res)) {
          const title = Just (translate (staticData) ("header.dialogs.saveheroeserror.title"))

          const message = getErrorMsg (staticData)
                                      (translate (staticData)
                                                 ("header.dialogs.saveheroeserror.message"))
                                      (res)

          await dispatch (addErrorAlert (staticData)
                                        (AlertOptions ({
                                          title,
                                          message,
                                        })))

          return false
        }

        return true
      })
    )
  }

export const imgPathToBase64 =
  (url: Maybe<string>): Maybe<string> => {
    if (isJust (url)) {
      const just_url = fromJust (url)

      if (just_url.length > 0 && !isBase64Image (just_url)) {
        const preparedUrl = just_url .replace (/file:[\\/]+/u, "")

        if (fs.existsSync (preparedUrl)) {
          const prefix = `data:image/${extname (just_url).slice (1)};base64,`
          const file = fs.readFileSync (preparedUrl)
          const fileString = file.toString ("base64")

          return Just (prefix + fileString)
        }

        return Nothing
      }

      return url
    }

    return url
  }

export const requestHeroExport =
  (staticData: StaticDataRecord) =>
  (id: string): ReduxAction =>
  async (dispatch, getState) => {
    const state = getState ()

    const heroes = getHeroes (state)
    const users = getUsers (state)

    const mhero =
      pipe_ (
        heroes,
        lookup (id),
        fmap (pipe (
          heroReducer.A.present,
          over (HeroModelL.avatar) (imgPathToBase64),
          over (HeroModelL.pets) (OrderedMap.map (over (PetL.avatar) (imgPathToBase64))),
          convertHeroForSave (users)
        ))
      )

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      const pmfilepath = await showSaveDialog ({
        title: translate (staticData) ("heroes.exportheroasjsonbtn"),
        filters: [
          { name: "JSON", extensions: [ "json" ] },
        ],
        defaultPath: hero.name.replace (/\//u, "/"),
      })

      if (isJust (pmfilepath)) {
        const res = await handleE (maybe (Promise.resolve ())
                                         (flip (IO.writeFile) (JSON.stringify (hero)))
                                         (pmfilepath))

        if (isRight (res)) {
          await dispatch (addAlert (staticData)
                                   (AlertOptions ({
                                     message: translate (staticData) ("heroes.dialogs.herosaved"),
                                   })))
        }
        else {
          const title = Just (translate (staticData) ("header.dialogs.saveheroeserror.title"))

          const message = getErrorMsg (staticData)
                                      (translate (staticData)
                                                 ("header.dialogs.saveheroeserror.message"))
                                      (res)

          await dispatch (addErrorAlert (staticData)
                                        (AlertOptions ({
                                          title,
                                          message,
                                        })))
        }
      }
    }
  }

export const loadImportedHero =
  (staticData: StaticDataRecord): ReduxAction<Promise<Maybe<RawHero>>> =>
  async dispatch =>
    pipe_ (
      await showOpenDialog ({ filters: [ { name: "JSON", extensions: [ "json" ] } ] }),
      listToMaybe,
      bindF (ensure (x => extname (x) === ".json")),
      maybe<Promise<Maybe<Either<Error, string>>>> (Promise.resolve (Nothing))
                                                   (pipe (IO.readFile, handleE, fmap (Just))),
      IO.bindF (pipe (
        fmap (Either.bindF (tryParseJSON)),
        async mres => {
          if (isNothing (mres)) {
            return Nothing
          }

          const res = fromJust (mres)

          if (isRight (res)) {
            return Just (fromRight_ (res) as RawHero)
          }

          const title = Just (translate (staticData) ("header.dialogs.importheroerror.title"))

          const message = getErrorMsg (staticData)
                                      (translate (staticData)
                                                 ("header.dialogs.importheroerror.message"))
                                      (res)

          await dispatch (addErrorAlert (staticData)
                                        (AlertOptions ({
                                          title,
                                          message,
                                        })))

          return Nothing
        }
      ))
    )

export interface ReceiveImportedHeroAction {
  type: ActionTypes.RECEIVE_IMPORTED_HERO
  payload: {
    hero: HeroModelRecord
    player?: User
  }
}

export const receiveHeroImport =
  (staticData: StaticDataRecord) =>
  (raw: RawHero): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const newId = prefixId (IdPrefixes.HERO) (getNewIdByDate ())
    const { player, avatar, ...other } = raw

    const data: RawHero = {
      ...other,
      id: newId,
      avatar: avatar !== undefined
        && avatar.length > 0
        && (isBase64Image (avatar) || await IO.existsFile (avatar.replace (/file:[\\/]+/u, "")))
        ? avatar
        : undefined,
    }

    const wiki = getWiki (getState ())

    const mhero = pipe_ (
      data,
      convertHero (staticData),
      fmap (convertFromRawHero (staticData)),
    )

    if (isJust (mhero)) {
      dispatch<ReceiveImportedHeroAction> ({
        type: ActionTypes.RECEIVE_IMPORTED_HERO,
        payload: {
          hero: fromJust (mhero),
          player,
        },
      })
    }
  }

export const requestHeroImport =
  (staticData: StaticDataRecord): ReduxAction<Promise<void>> =>
  async dispatch => {
    const mhero = await dispatch (loadImportedHero (staticData))

    if (isJust (mhero)) {
      await dispatch (receiveHeroImport (staticData) (fromJust (mhero)))
    }
  }

const isAnyHeroUnsaved = pipe (getHeroes, any (pipe (heroReducer.A.past, notNull)))

const close =
  (staticData: StaticDataRecord) =>
  (save_heroes: boolean) =>
  (f: Maybe<() => void>): ReduxAction<Promise<void>> =>
  async dispatch => {
    await dispatch (requestSaveCache (staticData))

    const all_saved = await dispatch (requestSaveAll (save_heroes) (staticData))

    if (all_saved && save_heroes) {
      await dispatch (addAlert (staticData) (AlertOptions ({ message: translate (staticData) ("allsaved") })))

      if (isJust (f)) {
        fromJust (f) ()
      }

      remote .getCurrentWindow () .close ()
    }
    else {
      remote .getCurrentWindow () .close ()
    }
  }


enum UnsavedActionsResponse {
 Quit, Cancel, SaveAndQuit
}

export const requestClose =
  (optionalCall: Maybe<() => void>): ReduxAction =>
  async (dispatch, getState) => {
    const state = getState ()
    const safeToExit = !isAnyHeroUnsaved (state)

    const ml10n = getLocaleMessages (state)

    if (isJust (ml10n)) {
      const l10n = fromJust (ml10n)

      if (safeToExit) {
        await dispatch (close (staticData) (false) (optionalCall))
      }
      else {
        const res = await dispatch (addPrompt (CustomPromptOptions ({
                                                title: Just (translate (staticData) ("unsavedactions")),
                                                message: translate (staticData) ("unsavedactions.text"),
                                                buttons: List (
                                                  PromptButton<UnsavedActionsResponse> ({
                                                    label: translate (staticData) ("quit"),
                                                    response: UnsavedActionsResponse.Quit,
                                                  }),
                                                  PromptButton<UnsavedActionsResponse> ({
                                                    label: translate (staticData) ("cancel"),
                                                    response: UnsavedActionsResponse.Cancel,
                                                  }),
                                                  PromptButton<UnsavedActionsResponse> ({
                                                    label: translate (staticData) ("saveandquit"),
                                                    response: UnsavedActionsResponse.SaveAndQuit,
                                                  })
                                                ),
                                              })))

        if (elem (UnsavedActionsResponse.Quit) (res)) {
          await dispatch (close (staticData) (false) (optionalCall))
        }
        else if (elem (UnsavedActionsResponse.SaveAndQuit) (res)) {
          await dispatch (close (staticData) (true) (optionalCall))
        }
      }
    }
  }

const getDefaultPDFName = pipe (
  getCurrentHeroName,
  maybe ("")
        (flip (appendStr) (".pdf"))
)

export const requestPrintHeroToPDF =
  (staticData: StaticDataRecord): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const data = await windowPrintToPDF ({
                         marginsType: 1,
                         pageSize: "A4",
                         printBackground: true,
                       })

    const path = await showSaveDialog ({
                   title: translate (staticData) ("printcharactersheettopdf"),
                   defaultPath: getDefaultPDFName (getState ()),
                   filters: [
                     { name: "PDF", extensions: [ "pdf" ] },
                   ],
                 })

    const res = await maybe (Promise.resolve<Either<Error, void>> (Right (undefined)))
                            (pipe (flip (IO.writeFile) (data), handleE))
                            (path)

    if (isRight (res) && isJust (path)) {
      await dispatch (addAlert (staticData)
                               (AlertOptions ({ message: translate (staticData) ("pdfsaved") })))
    }
    else if (isLeft (res)) {
      await dispatch (addDefaultErrorAlert (staticData)
                                           (translate (staticData) ("printcharactersheettopdf"))
                                           (res))
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

enum UpdateAvailableResponse {
 UpdateAndRestart, Cancel
}

export const updateAvailable =
  (staticData: StaticDataRecord) =>
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

    const opts = CustomPromptOptions<UpdateAvailableResponse> ({
                   title: Just (translate (staticData) ("newversionavailable")),
                   message: size > 0
                     ? translateP (staticData)
                                  ("newversionavailable.textwithsize")
                                  (List (info.version, bytify (L10n.A.id (staticData)) (size)))
                     : translateP (staticData)
                                  ("newversionavailable.text")
                                  (List (info.version)),
                   buttons: List (
                     PromptButton ({
                       label: translate (staticData) ("update"),
                       response: UpdateAvailableResponse.UpdateAndRestart,
                     }),
                     PromptButton ({
                       label: translate (staticData) ("cancel"),
                       response: UpdateAvailableResponse.Cancel,
                     })
                   ),
                 })

    const res = await dispatch (addPrompt (opts))

    if (elem (UpdateAvailableResponse.UpdateAndRestart) (res)) {
      dispatch (startDownloadingUpdate)
    }
  }

export const updateNotAvailable = (staticData: StaticDataRecord): ReduxAction => async dispatch =>
  dispatch (addAlert (staticData)
                     (AlertOptions ({
                       title: Just (translate (staticData) ("nonewversionavailable")),
                       message: translate (staticData) ("nonewversionavailable.text"),
                     })))
