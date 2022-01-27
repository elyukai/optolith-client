import { join } from "path"
import { handleE, toMsg } from "../../Control/Exception"
import { fromLeft_, fromRight_, isLeft } from "../../Data/Either"
import { flip } from "../../Data/Function"
import { fromArray, intercalate, map } from "../../Data/List"
import { fromJust, fromMaybe, isJust, Just, Maybe } from "../../Data/Maybe"
import { filter, keysSet, OrderedMap } from "../../Data/OrderedMap"
import { notMember } from "../../Data/OrderedSet"
import { Record } from "../../Data/Record"
import { show } from "../../Data/Show"
import { parseJSON } from "../../Data/String/JSON"
import { fst, Pair, snd } from "../../Data/Tuple"
import * as IO from "../../System/IO"
import * as ActionTypes from "../Constants/ActionTypes"
import { APCache } from "../Models/Cache"
import { Config } from "../Models/Config"
import { HeroModel } from "../Models/Hero/HeroModel"
import { Locale as LocaleR } from "../Models/Locale"
import { StaticDataRecord } from "../Models/Wiki/WikiModel"
import { heroReducer } from "../Reducers/heroReducer"
import { user_data_path } from "../Selectors/envSelectors"
import { getHeroes } from "../Selectors/stateSelectors"
import { deleteCache, forceCacheIsAvailable, insertAppStateCache, insertCacheMap, insertHeroesCache, readCache } from "../Utilities/Cache"
import { getSystemLocale } from "../Utilities/IOUtils"
import { Maybe as NewMaybe } from "../Utilities/Maybe"
import { pipe, pipe_ } from "../Utilities/pipe"
import { parseConfig } from "../Utilities/Raw/JSON/Config"
import { RawHerolist } from "../Utilities/Raw/RawData"
import { readUpdate, writeUpdate } from "../Utilities/Update"
import { parseStaticData } from "../Utilities/YAML"
import { getSupportedLanguages } from "../Utilities/YAML/SupportedLanguages"
import { ReduxAction } from "./Actions"
import { addErrorAlert, AlertOptions } from "./AlertActions"

interface InitialData {
  staticData: StaticDataRecord
  heroes: Maybe<RawHerolist>
  defaultLocale: string
  config: Maybe<Record<Config>>
  cache: Maybe<OrderedMap<string, APCache>>
  availableLangs: OrderedMap<string, Record<LocaleR>>
}

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

export interface ReceiveInitialDataAction {
  type: ActionTypes.RECEIVE_INITIAL_DATA
  payload: InitialData
}

export const receiveInitialData = (data: InitialData): ReceiveInitialDataAction => ({
  type: ActionTypes.RECEIVE_INITIAL_DATA,
  payload: data,
})

export const requestInitialData: ReduxAction<Promise<void>> = async (dispatch, getState) => {
  const defaultLocale = getSystemLocale ()

  const did_update = await readUpdate ()

  const dispatchErrorAlertOptions = async (options: Record<AlertOptions>) => {
    await dispatch (addErrorAlert (options))

    dispatch (setLoadingDoneWithError ())
  }

  const dispatchError = async (err: Error) =>
    dispatchErrorAlertOptions (AlertOptions ({
                                title: Just ("Error"),
                                message: toMsg (err),
                              }))

  console.log (did_update)

  if (did_update) {
    const deleted = await deleteCache ()

    if (isLeft (deleted)) {
      return dispatchError (fromLeft_ (deleted))
    }
  }

  const update_written = await writeUpdate (false)

  console.log (show (update_written))

  if (update_written.isLeft) {
    return dispatchError (update_written.value)
  }

  const config = await parseConfig ()

  if (config.isLeft) {
    return dispatchErrorAlertOptions (config.value)
  }

  console.log (show (config.value))

  const mheroes = (await pipe_ (
    join (user_data_path, "heroes.json"),
    IO.readFile,
    handleE
  ))
    .toMaybe ()
    .bind (x => parseJSON (x) as NewMaybe<RawHerolist>)
    .toOldMaybe ()

  const mcache = await readCache ()

  const eavailable_langs = await getSupportedLanguages ()

  if (isLeft (eavailable_langs)) {
    return pipe_ (
      eavailable_langs,
      fromLeft_,
      parseErrorsToPairStr,
      pairStrErrorToAlertOptions,
      dispatchErrorAlertOptions
    )
  }

  const available_langs = fromRight_ (eavailable_langs)

  const estatic_data =
    await parseStaticData (
      fromMaybe (defaultLocale) (Config.A.locale (config.value)),
      Config.A.fallbackLocale (config.value)
    )

  if (isLeft (estatic_data)) {
    return pipe_ (
      estatic_data,
      fromLeft_,
      parseErrorsToPairStr,
      pairStrErrorToAlertOptions,
      dispatchErrorAlertOptions
    )
  }

  const initial_data = {
    staticData: fromRight_ (estatic_data),
    heroes: mheroes,
    defaultLocale,
    config: Just (config.value),
    cache: mcache,
    availableLangs: available_langs,
  }

  dispatch (receiveInitialData (initial_data))

  console.log ("Dispatched initial data")

  insertAppStateCache (getState ())
  insertHeroesCache (getHeroes (getState ()))

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

  dispatch (setLoadingDone ())
}
