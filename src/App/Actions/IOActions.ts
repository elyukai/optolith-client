import { ProgressInfo } from "builder-util-runtime"
import { ipcRenderer, remote } from "electron"
import { UpdateInfo } from "electron-updater"
import * as fs from "fs"
import { extname, join } from "path"
import { handleE, toMsg } from "../../Control/Exception"
import { bimap, Either, eitherToMaybe, fromLeft_, fromRight_, isLeft, isRight, Left, Right } from "../../Data/Either"
import { flip } from "../../Data/Function"
import { fmap } from "../../Data/Functor"
import { over } from "../../Data/Lens"
import { appendStr, fromArray, intercalate, List, map, notNull } from "../../Data/List"
import { alt_, bindF, elem, ensure, fromJust, fromMaybe, isJust, isNothing, Just, listToMaybe, Maybe, maybe, Nothing } from "../../Data/Maybe"
import { any, filter, keysSet, lookup, lookupF, OrderedMap } from "../../Data/OrderedMap"
import { notMember } from "../../Data/OrderedSet"
import { Record, toObject } from "../../Data/Record"
import { parseJSON } from "../../Data/String/JSON"
import { fst, Pair, snd } from "../../Data/Tuple"
import * as IO from "../../System/IO"
import * as ActionTypes from "../Constants/ActionTypes"
import { APCache } from "../Models/Cache"
import { Config } from "../Models/Config"
import { HeroModel, HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel"
import { User } from "../Models/Hero/heroTypeHelpers"
import { PetL } from "../Models/Hero/Pet"
import { Locale as LocaleR } from "../Models/Locale"
import { UISettingsState } from "../Models/UISettingsState"
import { L10n } from "../Models/Wiki/L10n"
import { StaticData, StaticDataRecord } from "../Models/Wiki/WikiModel"
import { heroReducer } from "../Reducers/heroReducer"
import { user_data_path } from "../Selectors/envSelectors"
import { getCurrentHeroId, getCurrentHeroName, getHeroes, getLocaleId, getUsers, getWiki } from "../Selectors/stateSelectors"
import { getUISettingsState } from "../Selectors/uisettingsSelectors"
import { deleteCache, forceCacheIsAvailable, insertAppStateCache, insertCacheMap, insertHeroesCache, prepareAPCache, prepareAPCacheForHero, readCache, writeCache } from "../Utilities/Cache"
import { translate, translateP } from "../Utilities/I18n"
import { bytify, getSystemLocale, showOpenDialog, showSaveDialog, windowPrintToPDF } from "../Utilities/IOUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { parseConfig, writeConfig } from "../Utilities/Raw/JSON/Config"
import { parseHero } from "../Utilities/Raw/JSON/Hero"
import { convertHeroesForSave, convertHeroForSave } from "../Utilities/Raw/JSON/Hero/HeroToJSON"
import { RawHerolist } from "../Utilities/Raw/RawData"
import { isBase64Image } from "../Utilities/RegexUtils"
import { UndoState } from "../Utilities/undo"
import { readUpdate, writeUpdate } from "../Utilities/Update"
import { parseStaticData } from "../Utilities/YAML"
import { getSupportedLanguages } from "../Utilities/YAML/SupportedLanguages"
import { ReduxAction } from "./Actions"
import { addAlert, addDefaultErrorAlert, addErrorAlert, addPrompt, AlertOptions, CustomPromptOptions, getErrorMsg, PromptButton } from "./AlertActions"
import { updateDateModified } from "./HerolistActions"

const loadHeroes = async () =>
  pipe_ (
    join (user_data_path, "heroes.json"),
    IO.readFile,
    handleE,
    fmap (pipe (eitherToMaybe, bindF (parseJSON as (x: string) => Maybe<RawHerolist>)))
  )

interface InitialData {
  staticData: StaticDataRecord
  heroes: Maybe<RawHerolist>
  defaultLocale: string
  config: Maybe<Record<Config>>
  cache: Maybe<OrderedMap<string, APCache>>
  availableLangs: OrderedMap<string, Record<LocaleR>>
}

export interface ReceiveInitialDataAction {
  type: ActionTypes.RECEIVE_INITIAL_DATA
  payload: InitialData
}

export const receiveInitialData = (data: InitialData): ReceiveInitialDataAction => ({
  type: ActionTypes.RECEIVE_INITIAL_DATA,
  payload: data,
})

const parseErrorsToPairStr = (es: Error[]) => pipe_ (
                               es,
                               fromArray,
                               map (err => err.message),
                               intercalate ("\n"),
                               Pair ("YAML Error")
                             )

const pairStrErrorToAlertOptions = (p: Pair<string, string>) => AlertOptions ({
                                                                  title: Just (fst (p)),
                                                                  message: snd (p),
                                                                })

export const getInitialData =
  async (): Promise<Either<Record<AlertOptions>, InitialData>> => {
    const defaultLocale = getSystemLocale ()

    const did_update = await readUpdate ()

    if (did_update) {
      const deleted = await deleteCache ()

      if (isLeft (deleted)) {
        return Left (AlertOptions ({
                      title: Just ("Error"),
                      message: toMsg (fromLeft_ (deleted)),
                    }))
      }
    }

    const update_written = await writeUpdate (false)

    if (isLeft (update_written)) {
      return Left (AlertOptions ({
                    title: Just ("Error"),
                    message: toMsg (fromLeft_ (update_written)),
                  }))
    }

    const econfig = await parseConfig ()

    if (isLeft (econfig)) {
      return econfig
    }

    const config = fromRight_ (econfig)
    const mheroes = await loadHeroes ()
    const mcache = await readCache ()

    const eavailable_langs = await getSupportedLanguages ()

    if (isLeft (eavailable_langs)) {
      return Left (pairStrErrorToAlertOptions (parseErrorsToPairStr (fromLeft_ (eavailable_langs))))
    }

    const available_langs = fromRight_ (eavailable_langs)

    const eres = await parseStaticData (fromMaybe (defaultLocale) (Config.A.locale (config)))

    return bimap (pipe (parseErrorsToPairStr, pairStrErrorToAlertOptions))
                 ((staticData: StaticDataRecord): InitialData =>
                   ({
                     staticData,
                     heroes: mheroes,
                     defaultLocale,
                     config: Just (config),
                     cache: mcache,
                     availableLangs: available_langs,
                   }))
                 (eres)
  }

export interface SetLoadingDone {
  type: ActionTypes.SET_LOADING_DONE
}

export const setLoadingDone = (): SetLoadingDone => ({
  type: ActionTypes.SET_LOADING_DONE,
})

export interface SetLoadingDoneWithError {
  type: ActionTypes.SET_LOADING_DONE_WITH_ERROR
}

export const setLoadingDoneWithError = (): SetLoadingDoneWithError => ({
  type: ActionTypes.SET_LOADING_DONE_WITH_ERROR,
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
                                              ({ hero })

                        return hero
                      }
                    ))
                  )
                }

                dispatch2 (setLoadingDone ())
              })
            }
            else {
              await dispatch (addErrorAlert (fromLeft_ (data)))

              dispatch (setLoadingDoneWithError ())
            }
          })

const UISSA = UISettingsState.A

export const requestConfigSave: ReduxAction<Promise<boolean>> =
  async (dispatch, getState) => {
    const state = getState ()
    const static_data = getWiki (state)

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
          const title = Just (translate (static_data) ("header.dialogs.saveconfigerror.title"))

          const message = getErrorMsg (static_data)
                                      (translate (static_data)
                                                 ("header.dialogs.saveconfigerror.message"))
                                      (res)

          await dispatch (addErrorAlert (AlertOptions ({
                                          title,
                                          message,
                                        })))

          return false
        }

        return true
      })
    )
  }

export const requestAllHeroesSave: ReduxAction<Promise<boolean>> =
  async (dispatch, getState) => {
    const static_data = getWiki (getState ())
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
          const title = Just (translate (static_data) ("header.dialogs.saveheroeserror.title"))

          const message = getErrorMsg (static_data)
                                      (translate (static_data)
                                                 ("header.dialogs.saveheroeserror.message"))
                                      (res)

          await dispatch (addErrorAlert (AlertOptions ({
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
  (save_heroes: boolean): ReduxAction<Promise<boolean>> =>
  async dispatch => {
    const configSavedDone = await dispatch (requestConfigSave)
    const heroesSavedDone = save_heroes
                            ? await dispatch (requestAllHeroesSave)
                            : true

    return configSavedDone && heroesSavedDone
  }

export const requestSaveCache = (all_saved: boolean): ReduxAction<Promise<Either<Error, void>>> =>
  async (_, getState) =>
    pipe_ (
      getState (),
      prepareAPCache (all_saved),
      writeCache
    )

export interface ReceiveHeroSaveAction {
  type: ActionTypes.RECEIVE_HERO_SAVE
  payload: {
    id: string
    cache: APCache
  }
}

const receiveHeroSave = (id: string, cache: APCache): ReceiveHeroSaveAction => ({
  type: ActionTypes.RECEIVE_HERO_SAVE,
  payload: {
    id,
    cache,
  },
})

export const requestHeroSave =
  (mcurrent_id: Maybe<string>): ReduxAction<Promise<Maybe<string>>> =>
  async (dispatch, getState) => {
    const mcurrent_id_alt = alt_ (mcurrent_id) (() => getCurrentHeroId (getState ()))

    if (isNothing (mcurrent_id_alt)) {
      return Promise.resolve (Nothing)
    }

    const current_id = fromJust (mcurrent_id_alt)

    dispatch (updateDateModified (current_id))

    const state = getState ()
    const static_data = getWiki (state)

    const heroes = getHeroes (state)
    const users = getUsers (state)

    const mhero =
      pipe_ (
        current_id,
        lookupF (heroes),
        fmap (pipe (heroReducer.A.present, convertHeroForSave (users)))
      )

    const mcache = prepareAPCacheForHero (state, current_id)

    if (isJust (mhero) && isJust (mcache)) {
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
            const title = Just (translate (static_data) ("header.dialogs.saveheroeserror.title"))

            const message = getErrorMsg (static_data)
                                        (translate (static_data)
                                                   ("header.dialogs.saveheroeserror.message"))
                                        (res)

            await dispatch (addErrorAlert (AlertOptions ({
                                            title,
                                            message,
                                          })))

            return Nothing
          }

          dispatch (receiveHeroSave (current_id, fromJust (mcache)))

          const cacheRes =
            await dispatch (async (_, getState2) => writeCache (prepareAPCache (false)
                                                                               (getState2 ())))

          if (isLeft (cacheRes)) {
            const title = Just (translate (static_data) ("header.dialogs.saveheroeserror.title"))

            const message = getErrorMsg (static_data)
                                        (translate (static_data)
                                                   ("header.dialogs.saveheroeserror.message"))
                                        (cacheRes)

            await dispatch (addErrorAlert (AlertOptions ({
                                            title,
                                            message,
                                          })))

            return Nothing
          }

          await dispatch (addAlert (AlertOptions ({
                                      message: translate (static_data)
                                                        ("heroes.dialogs.herosaved"),
                                    })))

          return Just (hero .id)
        })
      )
    }

    return Promise.resolve (Nothing)
  }

export const requestHeroDeletion =
  (id: string): ReduxAction<Promise<boolean>> =>
  async (dispatch, getState) => {
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
          const staticData = getWiki (getState ())
          const title = Just (translate (staticData) ("header.dialogs.saveheroeserror.title"))

          const message = getErrorMsg (staticData)
                                      (translate (staticData)
                                                 ("header.dialogs.saveheroeserror.message"))
                                      (res)

          await dispatch (addErrorAlert (AlertOptions ({
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
  (path: string): Maybe<string> => {
    if (path.length > 0 && !isBase64Image (path)) {
      if (fs.existsSync (path)) {
        const prefix = `data:image/${extname (path).slice (1)};base64,`
        const file = fs.readFileSync (path)
        const fileString = file.toString ("base64")

        return Just (prefix + fileString)
      }

      return Nothing
    }

    return Just (path)
  }

export const requestHeroExport =
  (id: string): ReduxAction =>
  async (dispatch, getState) => {
    const state = getState ()
    const staticData = getWiki (state)
    const heroes = getHeroes (state)
    const users = getUsers (state)

    const mhero =
      pipe_ (
        heroes,
        lookup (id),
        fmap (pipe (
          heroReducer.A.present,
          over (HeroModelL.avatar) (bindF (imgPathToBase64)),
          over (HeroModelL.pets) (OrderedMap.map (over (PetL.avatar) (bindF (imgPathToBase64)))),
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
          await dispatch (addAlert (AlertOptions ({
                                     message: translate (staticData) ("heroes.dialogs.herosaved"),
                                   })))
        }
        else {
          const title = Just (translate (staticData) ("header.dialogs.saveheroeserror.title"))

          const message = getErrorMsg (staticData)
                                      (translate (staticData)
                                                 ("header.dialogs.saveheroeserror.message"))
                                      (res)

          await dispatch (addErrorAlert (AlertOptions ({
                                          title,
                                          message,
                                        })))
        }
      }
    }
  }

export const getHeroFilePath: () => Promise<Maybe<string>> =
  async () =>
    pipe_ (
      await showOpenDialog ({ filters: [ { name: "JSON", extensions: [ "json" ] } ] }),
      listToMaybe,
      bindF (ensure (x => extname (x) === ".json")),
    )

export interface ReceiveImportedHeroAction {
  type: ActionTypes.RECEIVE_IMPORTED_HERO
  payload: {
    hero: HeroModelRecord
    player?: User
  }
}

export const receiveHeroImport =
  (hero: HeroModelRecord): ReceiveImportedHeroAction => ({
    type: ActionTypes.RECEIVE_IMPORTED_HERO,
    payload: {
      hero,
    },
  })

export const requestHeroImport: ReduxAction<Promise<void>> =
  async (dispatch, getState) => {
    const mfile_path = await getHeroFilePath ()

    if (isJust (mfile_path)) {
      const staticData = getWiki (getState ())

      const ehero = await parseHero (staticData)
                                    (fromJust (mfile_path))

      if (isLeft (ehero)) {
        await dispatch (addErrorAlert (fromLeft_ (ehero)))
      }
      else {
        dispatch (receiveHeroImport (fromRight_ (ehero)))
      }
    }
  }

const isAnyHeroUnsaved = pipe (getHeroes, any (pipe (heroReducer.A.past, notNull)))

const close = (
  staticData: StaticDataRecord,
  save_heroes: boolean,
  f: Maybe<() => void>
): ReduxAction<Promise<void>> =>
  async dispatch => {
    const all_saved = await dispatch (requestSaveAll (save_heroes))

    console.log (`all_saved: ${all_saved}`)

    if (all_saved && save_heroes) {
      console.log ("all_saved && save_heroes")

      await dispatch (requestSaveCache (true))

      await dispatch (addAlert (AlertOptions ({
                                 message: translate (staticData) ("header.dialogs.allsaved"),
                               })))

      if (isJust (f)) {
        fromJust (f) ()
      }

      remote .getCurrentWindow () .close ()
    }
    else {
      console.log ("!(all_saved && save_heroes)")

      await dispatch (requestSaveCache (false))

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
    const staticData = getWiki (state)
    const safeToExit = !isAnyHeroUnsaved (state)

    if (safeToExit) {
      console.log ("SaveToExit")
      await dispatch (close (staticData, false, optionalCall))
    }
    else {
      const opts = CustomPromptOptions ({
                     title: Just (translate (staticData) ("heroes.dialogs.unsavedactions.title")),
                     message: translate (staticData) ("heroes.dialogs.unsavedactions.message"),
                     buttons: List (
                       PromptButton<UnsavedActionsResponse> ({
                         label: translate (staticData) ("heroes.dialogs.unsavedactions.quit"),
                         response: UnsavedActionsResponse.Quit,
                       }),
                       PromptButton<UnsavedActionsResponse> ({
                         label: translate (staticData) ("general.dialogs.cancelbtn"),
                         response: UnsavedActionsResponse.Cancel,
                       }),
                       PromptButton<UnsavedActionsResponse> ({
                         label: translate (staticData)
                                          ("heroes.dialogs.unsavedactions.saveandquit"),
                         response: UnsavedActionsResponse.SaveAndQuit,
                       })
                     ),
                   })

      const res = await dispatch (addPrompt (opts))

      if (elem (UnsavedActionsResponse.Quit) (res)) {
        console.log ("Quit")
        await dispatch (close (staticData, false, optionalCall))
      }
      else if (elem (UnsavedActionsResponse.SaveAndQuit) (res)) {
        console.log ("SaveQuit")
        await dispatch (close (staticData, true, optionalCall))
      }
      else {
        console.log ("Cancel")
      }
    }
  }

const getDefaultPDFName = pipe (
  getCurrentHeroName,
  maybe ("")
        (flip (appendStr) (".pdf"))
)

export const requestPrintHeroToPDF: ReduxAction<Promise<void>> =
  async (dispatch, getState) => {
    const staticData = getWiki (getState ())

    const data = await windowPrintToPDF ({
                         marginsType: 1,
                         pageSize: "A4",
                         printBackground: true,
                       })

    const path = await showSaveDialog ({
                   title: translate (staticData) ("sheets.dialogs.pdfexportsavelocation.title"),
                   defaultPath: getDefaultPDFName (getState ()),
                   filters: [
                     { name: "PDF", extensions: [ "pdf" ] },
                   ],
                 })

    const res = await maybe (Promise.resolve<Either<Error, void>> (Right (undefined)))
                            (pipe (flip (IO.writeFile) (data), handleE))
                            (path)

    if (isRight (res) && isJust (path)) {
      await dispatch (addAlert (AlertOptions ({
                                 message: translate (staticData) ("sheets.dialogs.pdfsaved"),
                               })))
    }
    else if (isLeft (res)) {
      await dispatch (addDefaultErrorAlert (staticData)
                                           (translate (staticData)
                                                      ("sheets.dialogs.pdfsaveerror.title"))
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
  (info: UpdateInfo): ReduxAction =>
  async (dispatch, getState) => {
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

    const staticData = getWiki (getState ())

    const size = info.files.reduce ((sum, { size: fileSize = 0 }) => sum + fileSize, 0)

    const opts = CustomPromptOptions<UpdateAvailableResponse> ({
                   title: Just (translate (staticData) ("settings.newversionavailable.title")),
                   message: size > 0
                     ? translateP (staticData)
                                  ("settings.newversionavailable.messagewithsize")
                                  (List (
                                    info.version,
                                    bytify (L10n.A.id (StaticData.A.ui (staticData))) (size)
                                  ))
                     : translateP (staticData)
                                  ("settings.newversionavailable.message")
                                  (List (info.version)),
                   buttons: List (
                     PromptButton ({
                       label: translate (staticData) ("settings.newversionavailable.updatebtn"),
                       response: UpdateAvailableResponse.UpdateAndRestart,
                     }),
                     PromptButton ({
                       label: translate (staticData) ("general.dialogs.cancelbtn"),
                       response: UpdateAvailableResponse.Cancel,
                     })
                   ),
                 })

    const res = await dispatch (addPrompt (opts))

    if (elem (UpdateAvailableResponse.UpdateAndRestart) (res)) {
      dispatch (startDownloadingUpdate)
    }
  }

export const updateNotAvailable: ReduxAction = async (dispatch, getState) =>
  dispatch (addAlert (AlertOptions ({
                       title: Just (translate (getWiki (getState ()))
                                              ("settings.nonewversionavailable.title")),
                       message: translate (getWiki (getState ()))
                                          ("settings.nonewversionavailable.message"),
                     })))
