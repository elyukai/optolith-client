import { clipboard } from "electron"
import { fromLeft_, Left } from "../../Data/Either"
import { List } from "../../Data/List"
import { fmapF, Just, Maybe } from "../../Data/Maybe"
import { ADD_ALERT, REMOVE_ALERT } from "../Constants/ActionTypes"
import { Static } from "../Models/Static.gen"
import { getWiki } from "../Selectors/stateSelectors"
import { translate, translateP } from "../Utilities/I18n"
import { ReduxAction } from "./Actions"


// BASIC INTERFACES

export interface PromptOptions<A> {
  title?: string
  message: string
  buttons: List<PromptButton<A>>
  resolve: (response?: A) => void
}

export interface PromptButton<A> {
  label: string
  critical?: boolean
  response: A
}

export interface AddPromptAction<A> {
  type: ADD_ALERT
  payload: PromptOptions<A>
}


// CUSTOMIZABLE PROMPT

export interface CustomPromptOptions<A> {
  title?: string
  message: string
  buttons: List<PromptButton<A>>
}

export const addPrompt =
  <A> (opts: CustomPromptOptions<A>): ReduxAction<Promise<Maybe<A>>> =>
  async dispatch =>
    new Promise<Maybe<A>> (resolve => {
      dispatch<AddPromptAction<A>> ({
        type: ADD_ALERT,
        payload: {
          ...opts,
          resolve,
        },
      })
    })


// ALERT

export interface AlertOptions {
  title?: string
  message: string
}

export const addAlert =
  (opts: AlertOptions): ReduxAction<Promise<Maybe<void>>> =>
  async (dispatch, getState) =>
    new Promise<Maybe<void>> (resolve => {
      dispatch<AddPromptAction<void>> ({
        type: ADD_ALERT,
        payload: {
          ...opts,
          buttons: List (
            {
              label: translate (getWiki (getState ())) ("general.dialogs.okbtn"),
              response: undefined,
            },
          ),
          resolve,
        },
      })
    })


// ERROR ALERT

enum ErrorAlertResponse {
  Copy, Ok
}

export const addErrorAlert =
  (opts: AlertOptions): ReduxAction<Promise<Maybe<void>>> =>
  async (dispatch, getState) => {
    const response = await new Promise<Maybe<ErrorAlertResponse>> (resolve => {
      dispatch<AddPromptAction<ErrorAlertResponse>> ({
        type: ADD_ALERT,
        payload: {
          ...opts,
          buttons: List (
            {
              label: translate (getWiki (getState ())) ("general.dialogs.copybtn"),
              response: ErrorAlertResponse.Copy,
            },
            {
              label: translate (getWiki (getState ())) ("general.dialogs.okbtn"),
              response: ErrorAlertResponse.Ok,
            },
          ),
          resolve,
        },
      })
    })

    if (Maybe.elem (ErrorAlertResponse.Copy) (response)) {
      clipboard.writeText (opts.message)
    }

    return fmapF (response) ((): void => undefined)
  }

/**
 * Creates a message from the passed message and the passed error object that
 * can be used as the content of an alert.
 */
export const getErrorMsg =
  (staticData: Static) =>
  (message: string) =>
  (error: Left<Error>): string =>
    `${message} (${translate (staticData) ("general.errorcode")}: ${JSON.stringify (fromLeft_ (error))})`

export const addDefaultErrorAlert =
  (staticData: Static) =>
  (message: string) =>
  (error: Left<Error>) =>
    addErrorAlert ({
                    message: getErrorMsg (staticData) (message) (error),
                    title: Just (translate (staticData) ("general.error")),
                  })

export const addDefaultErrorAlertWithTitle =
  (staticData: Static) =>
  (title: string) =>
  (message: string) =>
  (error: Left<Error>) =>
    addErrorAlert ({
                    message: getErrorMsg (staticData) (message) (error),
                    title: Just (title),
                  })


// CONFIRM

export enum ConfirmResponse {
 Accepted, Rejected
}

export interface ConfirmOptions {
  title?: string
  message: string
  useYesNo: boolean
}

export const addConfirm =
  (staticData: StaticDataRecord) =>
  (opts: Record<ConfirmOptions>): ReduxAction<Promise<Maybe<ConfirmResponse>>> =>
  async dispatch =>
    new Promise<Maybe<ConfirmResponse>> (resolve => {
      dispatch<AddPromptAction> ({
        type: ADD_ALERT,
        payload: PromptOptions ({
          title: ConfirmOptions.A.title (opts),
          message: ConfirmOptions.A.message (opts),
          buttons: ConfirmOptions.A.useYesNo (opts)
            ? List (
                PromptButton<ConfirmResponse> ({
                  label: translate (staticData) ("general.dialogs.yesbtn"),
                  response: ConfirmResponse.Accepted,
                }),
                PromptButton<ConfirmResponse> ({
                  label: translate (staticData) ("general.dialogs.nobtn"),
                  response: ConfirmResponse.Rejected,
                })
              )
            : List (
                PromptButton<ConfirmResponse> ({
                  label: translate (staticData) ("general.dialogs.okbtn"),
                  response: ConfirmResponse.Accepted,
                }),
                PromptButton<ConfirmResponse> ({
                  label: translate (staticData) ("general.dialogs.cancelbtn"),
                  response: ConfirmResponse.Rejected,
                })
              ),
          resolve,
        }),
      })
    })


// REMOVE CURRENT ALERT

export interface RemoveAlertAction {
  type: REMOVE_ALERT
}

export const removeAlert = (): RemoveAlertAction => ({
  type: REMOVE_ALERT,
})

// Not enough AP alert

export const addNotEnoughAPAlert =
  (missing_ap: number): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const staticData = getWiki (getState ())

    await dispatch (addAlert (AlertOptions ({
                               title: Just (translate (staticData)
                                                      ("general.dialogs.notenoughap.title")),
                               message: translateP (staticData)
                                                   ("general.dialogs.notenoughap.message")
                                                   (List (missing_ap)),
                             })))
  }
