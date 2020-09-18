import { join } from "path"
import { handleE, toMsg } from "../../Control/Exception"
import { eitherToMaybe, fromLeft_, fromRight_, isLeft, Left } from "../../Data/Either"
import { flip } from "../../Data/Function"
import { fmap } from "../../Data/Functor"
import { fromArray, intercalate, map } from "../../Data/List"
import { bindF, fromJust, fromMaybe, isJust, Just, Maybe } from "../../Data/Maybe"
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

  const dispatchErrorAlertOptions = async (options: Left<Record<AlertOptions>>) => {
    await dispatch (addErrorAlert (fromLeft_ (options)))

    dispatch (setLoadingDoneWithError ())
  }

  const dispatchError = async (err: Left<Error>) =>
    dispatchErrorAlertOptions (Left (AlertOptions ({
                                      title: Just ("Error"),
                                      message: toMsg (fromLeft_ (err)),
                                    })))

  console.log (did_update)

  if (did_update) {
    const deleted = await deleteCache ()

    if (isLeft (deleted)) {
      return dispatchError (deleted)
    }
  }

  const update_written = await writeUpdate (false)

  console.log (show (update_written))

  if (isLeft (update_written)) {
    return dispatchError (update_written)
  }

  const econfig = await parseConfig ()

  if (isLeft (econfig)) {
    return dispatchErrorAlertOptions (econfig)
  }

  const config = fromRight_ (econfig)

  console.log (show (config))

  const mheroes = await pipe_ (
    join (user_data_path, "heroes.json"),
    IO.readFile,
    handleE,
    fmap (pipe (eitherToMaybe, bindF (parseJSON as (x: string) => Maybe<RawHerolist>)))
  )

  const mcache = await readCache ()

  const eavailable_langs = await getSupportedLanguages ()

  if (isLeft (eavailable_langs)) {
    return pipe_ (
      eavailable_langs,
      fromLeft_,
      parseErrorsToPairStr,
      pairStrErrorToAlertOptions,
      Left,
      dispatchErrorAlertOptions
    )
  }

  const available_langs = fromRight_ (eavailable_langs)

  const estatic_data =
    await parseStaticData (
      fromMaybe (defaultLocale) (Config.A.locale (config)),
      Config.A.fallbackLocale (config)
    )

  if (isLeft (estatic_data)) {
    return pipe_ (
      estatic_data,
      fromLeft_,
      parseErrorsToPairStr,
      pairStrErrorToAlertOptions,
      Left,
      dispatchErrorAlertOptions
    )
  }

  const initial_data = {
    staticData: fromRight_ (estatic_data),
    heroes: mheroes,
    defaultLocale,
    config: Just (config),
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
