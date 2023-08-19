import * as remote from "@electron/remote"
import * as fs from "fs"
import { extname, join } from "path"
import { handleE } from "../../Control/Exception"
import { Either, fromLeft_, fromRight_, isLeft } from "../../Data/Either"
import { flip } from "../../Data/Function"
import { fmap } from "../../Data/Functor"
import { over } from "../../Data/Lens"
import { List, notNull } from "../../Data/List"
import { bindF, elem, ensure, fromJust, isJust, Just, listToMaybe, Maybe, maybe, Nothing } from "../../Data/Maybe"
import { any, lookup, OrderedMap } from "../../Data/OrderedMap"
import { toObject } from "../../Data/Record"
import * as IO from "../../System/IO"
import * as ActionTypes from "../Constants/ActionTypes"
import { APCache } from "../Models/Cache"
import { Config } from "../Models/Config"
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel"
import { User } from "../Models/Hero/heroTypeHelpers"
import { PetL } from "../Models/Hero/Pet"
import { UndoableHeroModelRecord } from "../Models/Hero/UndoHero"
import { HeroesState } from "../Models/HeroesState"
import { UISettingsState } from "../Models/UISettingsState"
import { StaticDataRecord } from "../Models/Wiki/WikiModel"
import { heroReducer } from "../Reducers/heroReducer"
import { user_data_path } from "../Selectors/envSelectors"
import { getFallbackLocaleId, getHeroes, getLocaleId, getWiki } from "../Selectors/stateSelectors"
import { getUISettingsState } from "../Selectors/uisettingsSelectors"
import { prepareAPCache, prepareAPCacheForHero, writeCache } from "../Utilities/Cache"
import { translate } from "../Utilities/I18n"
import { showOpenDialog, showSaveDialog } from "../Utilities/IOUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { writeConfig } from "../Utilities/Raw/JSON/Config"
import { parseHero } from "../Utilities/Raw/JSON/Hero"
import { convertHeroForSave } from "../Utilities/Raw/JSON/Hero/HeroToJSON"
import { isBase64Image } from "../Utilities/RegexUtils"
import { deleteHeroFromFile, saveAllHeroesToFile, saveHeroToFile } from "../Utilities/SaveHeroes"
import { ReduxAction } from "./Actions"
import { addAlert, addErrorAlert, addPrompt, AlertOptions, CustomPromptOptions, getErrorMsg, PromptButton } from "./AlertActions"


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
      sheetUseParchment:
        Just (UISSA.sheetUseParchment (uiSettingsState)),
      sheetShowRules:
        Just (UISSA.sheetShowRules (uiSettingsState)),
      sheetZoomFactor:
        UISSA.sheetZoomFactor (uiSettingsState),
      theme: Just (UISSA.theme (uiSettingsState)),
      enableEditingHeroAfterCreationPhase:
        Just (UISSA.enableEditingHeroAfterCreationPhase (uiSettingsState)),
      enableAnimations: Just (UISSA.enableAnimations (uiSettingsState)),
      locale: getLocaleId (state),
      fallbackLocale: getFallbackLocaleId (state),
    })

    return pipe_ (
      join (user_data_path, "config.json"),
      flip (IO.writeFile) (writeConfig (data)),
      handleE,
      IO.bindF (async res => {
        console.log (res)

        if (res.isLeft) {
          const title = Just (translate (static_data) ("header.dialogs.saveconfigerror.title"))

          const message = getErrorMsg (static_data)
                                      (translate (static_data)
                                                 ("header.dialogs.saveconfigerror.message"))
                                      (res.value)

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

export interface ReceiveAllHeroesSaveAction {
  type: ActionTypes.RECEIVE_ALL_HEROES_SAVE
  payload: {
    updatedHeroes: HeroesState["heroes"]
  }
}

const receiveAllHeroesSave = (heroes: HeroesState["heroes"]): ReceiveAllHeroesSaveAction => ({
  type: ActionTypes.RECEIVE_ALL_HEROES_SAVE,
  payload: {
    updatedHeroes: heroes,
  },
})

export const requestAllHeroesSave: ReduxAction<Promise<boolean>> =
  async (dispatch, getState) => {
    const static_data = getWiki (getState ())
    const heroes_before = getHeroes (getState ())

    return pipe_ (
      heroes_before,
      saveAllHeroesToFile,
      IO.bindF (async res => {
        if (isLeft (res)) {
          const title = Just (translate (static_data) ("header.dialogs.saveheroeserror.title"))

          const message = getErrorMsg (static_data)
                                      (translate (static_data)
                                                 ("header.dialogs.saveheroeserror.message"))
                                      (fromLeft_ (res))

          await dispatch (addErrorAlert (AlertOptions ({
                                          title,
                                          message,
                                        })))

          return false
        }
        else {
          dispatch (receiveAllHeroesSave (fromRight_ (res)))

          return true
        }
      })
    )
  }

export const requestSaveCache = (all_saved: boolean): ReduxAction<Promise<Either<Error, void>>> =>
  async (_, getState) =>
    pipe_ (
      getState (),
      prepareAPCache (all_saved),
      writeCache
    )
      .then (e => e.toOldEither ())

export interface ReceiveHeroSaveAction {
  type: ActionTypes.RECEIVE_HERO_SAVE
  payload: {
    id: string
    updatedHero: UndoableHeroModelRecord
    cache: APCache
  }
}

const receiveHeroSave = (
  id: string,
  hero: UndoableHeroModelRecord,
  cache: APCache
): ReceiveHeroSaveAction => ({
  type: ActionTypes.RECEIVE_HERO_SAVE,
  payload: {
    id,
    updatedHero: hero,
    cache,
  },
})

export const requestHeroSave =
  (id: string): ReduxAction<Promise<Maybe<string>>> =>
  async (dispatch, getState) => {
    const state = getState ()
    const static_data = getWiki (state)
    const heroes = getHeroes (state)

    const mcache = prepareAPCacheForHero (state, id)

    if (isJust (mcache)) {
      return pipe_ (
        saveHeroToFile (heroes, id),
        IO.bindF (async res => {
          if (isLeft (res)) {
            const title = Just (translate (static_data) ("header.dialogs.saveheroeserror.title"))

            const message = getErrorMsg (static_data)
                                        (translate (static_data)
                                                   ("header.dialogs.saveheroeserror.message"))
                                        (fromLeft_ (res))

            await dispatch (addErrorAlert (AlertOptions ({
                                            title,
                                            message,
                                          })))

            return Nothing
          }

          dispatch (receiveHeroSave (id, fromRight_ (res), fromJust (mcache)))

          const cacheRes =
            await dispatch (async (_, getState2) => writeCache (prepareAPCache (false)
                                                                               (getState2 ())))

          if (cacheRes.isLeft) {
            const title = Just (translate (static_data) ("header.dialogs.saveheroeserror.title"))

            const message = getErrorMsg (static_data)
                                        (translate (static_data)
                                                   ("header.dialogs.saveheroeserror.message"))
                                        (cacheRes.value)

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

          return Just (id)
        })
      )
    }

    return Promise.resolve (Nothing)
  }

export interface ReceiveDeleteHeroAction {
  type: ActionTypes.RECEIVE_DELETE_HERO
  payload: {
    updatedHeroes: HeroesState["heroes"]
  }
}

const receiveDeleteHero = (heroes: HeroesState["heroes"]): ReceiveDeleteHeroAction => ({
  type: ActionTypes.RECEIVE_DELETE_HERO,
  payload: {
    updatedHeroes: heroes,
  },
})

export const requestHeroDeletion =
  (id: string): ReduxAction<Promise<boolean>> =>
  async (dispatch, getState) => {
    const heroes = getHeroes (getState ())

    return pipe_ (
      deleteHeroFromFile (heroes, id),
      IO.bindF (async res => {
        if (isLeft (res)) {
          const staticData = getWiki (getState ())
          const title = Just (translate (staticData) ("header.dialogs.saveheroeserror.title"))

          const message = getErrorMsg (staticData)
                                      (translate (staticData)
                                                 ("header.dialogs.saveheroeserror.message"))
                                      (fromLeft_ (res))

          await dispatch (addErrorAlert (AlertOptions ({
                                          title,
                                          message,
                                        })))

          return false
        }
        else {
          dispatch (receiveDeleteHero (fromRight_ (res)))

          return true
        }
      })
    )
  }

export const imgPathToBase64 =
  (path: string): Maybe<string> => {
    if (path.length > 0 && !isBase64Image (path)) {
      if (fs.existsSync (path)) {
        const ext = extname (path)
          .slice (1)
          .toLowerCase ()

        const prefix = `data:image/${ext};base64,`
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

    const mhero =
      pipe_ (
        heroes,
        lookup (id),
        fmap (pipe (
          heroReducer.A.present,
          over (HeroModelL.avatar) (bindF (imgPathToBase64)),
          over (HeroModelL.pets) (OrderedMap.map (over (PetL.avatar) (bindF (imgPathToBase64)))),
          convertHeroForSave
        ))
      )

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      const pmfilepath = await showSaveDialog ({
        title: translate (staticData) ("heroes.exportheroasjsonbtn"),
        filters: [
          { name: "JSON", extensions: [ "json" ] },
        ],
        defaultPath: `${hero.name.replace (/\//u, "/")}.json`,
      })

      if (isJust (pmfilepath)) {
        const res = await handleE (maybe (Promise.resolve ())
                                         (flip (IO.writeFile) (JSON.stringify (hero)))
                                         (pmfilepath))

        if (res.isRight) {
          await dispatch (addAlert (AlertOptions ({
                                     message: translate (staticData) ("heroes.dialogs.herosaved"),
                                   })))
        }
        else {
          const title = Just (translate (staticData) ("header.dialogs.saveheroeserror.title"))

          const message = getErrorMsg (staticData)
                                      (translate (staticData)
                                                 ("header.dialogs.saveheroeserror.message"))
                                      (res.value)

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

      const hero = await parseHero (staticData)
                                    (fromJust (mfile_path))

      if (hero.isLeft) {
        await dispatch (addErrorAlert (hero.value))
      }
      else {
        dispatch (receiveHeroImport (hero.value))
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
    const configSavedDone = await dispatch (requestConfigSave)

    const heroesSavedDone = save_heroes
                            ? await dispatch (requestAllHeroesSave)
                            : true

    const all_saved = configSavedDone && heroesSavedDone

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
    }
    else {
      console.log ("!(all_saved && save_heroes)")

      await dispatch (requestSaveCache (false))
    }

    remote .getCurrentWindow () .close ()
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
