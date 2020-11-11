import { clipboard } from "electron"
import { fromLeft_, Left } from "../../Data/Either"
import { fmapF } from "../../Data/Functor"
import { List } from "../../Data/List"
import { Just, Maybe, Nothing } from "../../Data/Maybe"
import { fromDefault, OmitName, PartialMaybeOrNothing, Record, RecordCreator } from "../../Data/Record"
import { ADD_ALERT, REMOVE_ALERT } from "../Constants/ActionTypes"
import { StaticDataRecord } from "../Models/Wiki/WikiModel"
import { getWiki } from "../Selectors/stateSelectors"
import { translate, translateP } from "../Utilities/I18n"
import { ReduxAction } from "./Actions"


// BASIC INTERFACES

export interface PromptOptions<A> {
  "@@name": "PromptOptions"
  title: Maybe<string>
  message: string
  buttons: List<Record<PromptButton<A>>>
  resolve: (response: Maybe<A>) => void
}

interface PromptOptionsCreator extends RecordCreator<PromptOptions<any>> {
  <A> (x: PartialMaybeOrNothing<OmitName<PromptOptions<A>>>): Record<PromptOptions<A>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PromptOptions: PromptOptionsCreator =
  fromDefault ("PromptOptions")
              <PromptOptions<any>> ({
                title: Nothing,
                message: "",
                buttons: List (),
                resolve: () => Nothing,
              })

export interface PromptButton<A> {
  "@@name": "PromptButton"
  label: string
  critical: Maybe<boolean>
  response: A
}

interface PromptButtonCreator extends RecordCreator<PromptButton<any>> {
  <A> (x: PartialMaybeOrNothing<OmitName<PromptButton<A>>>): Record<PromptButton<A>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PromptButton: PromptButtonCreator =
  fromDefault ("PromptButton")
              <PromptButton<any>> ({
                label: "",
                critical: Nothing,
                response: 0,
              })

export interface AddPromptAction {
  type: ADD_ALERT
  payload: Record<PromptOptions<any>>
}


// CUSTOMIZABLE PROMPT

export interface CustomPromptOptions<A> {
  "@@name": "CustomPromptOptions"
  title: Maybe<string>
  message: string
  buttons: List<Record<PromptButton<A>>>
}

interface CustomPromptOptionsCreator extends RecordCreator<CustomPromptOptions<any>> {
  <A> (x: PartialMaybeOrNothing<OmitName<CustomPromptOptions<A>>>): Record<CustomPromptOptions<A>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CustomPromptOptions: CustomPromptOptionsCreator =
  fromDefault ("CustomPromptOptions")
              <CustomPromptOptions<any>> ({
                title: Nothing,
                message: "",
                buttons: List (),
              })

export const addPrompt =
  <A> (opts: Record<CustomPromptOptions<A>>): ReduxAction<Promise<Maybe<A>>> =>
  async dispatch =>
    new Promise<Maybe<A>> (resolve => {
      dispatch<AddPromptAction> ({
        type: ADD_ALERT,
        payload: PromptOptions<A> ({
          title: CustomPromptOptions.A.title (opts),
          message: CustomPromptOptions.A.message (opts),
          buttons: CustomPromptOptions.A.buttons (opts),
          resolve,
        }),
      })
    })


// ALERT

export interface AlertOptions {
  "@@name": "AlertOptions"
  title: Maybe<string>
  message: string
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AlertOptions =
  fromDefault ("AlertOptions")
              <AlertOptions> ({
                title: Nothing,
                message: "",
              })

export const addAlert =
  (opts: Record<AlertOptions>): ReduxAction<Promise<Maybe<void>>> =>
  async (dispatch, getState) =>
    new Promise<Maybe<void>> (resolve => {
      dispatch<AddPromptAction> ({
        type: ADD_ALERT,
        payload: PromptOptions ({
          title: AlertOptions.A.title (opts),
          message: AlertOptions.A.message (opts),
          buttons: List (
            PromptButton<void> ({
              label: translate (getWiki (getState ())) ("general.dialogs.okbtn"),
              response: undefined,
            }),
          ),
          resolve,
        }),
      })
    })


// ERROR ALERT

enum ErrorAlertResponse {
  Copy, Ok
}

export const addErrorAlert =
  (opts: Record<AlertOptions>): ReduxAction<Promise<Maybe<void>>> =>
  async (dispatch, getState) => {
    const response = await new Promise<Maybe<ErrorAlertResponse>> (resolve => {
      dispatch<AddPromptAction> ({
        type: ADD_ALERT,
        payload: PromptOptions ({
          title: AlertOptions.A.title (opts),
          message: AlertOptions.A.message (opts),
          buttons: List (
            PromptButton<ErrorAlertResponse> ({
              label: translate (getWiki (getState ())) ("general.dialogs.copybtn"),
              response: ErrorAlertResponse.Copy,
            }),
            PromptButton<ErrorAlertResponse> ({
              label: translate (getWiki (getState ())) ("general.dialogs.okbtn"),
              response: ErrorAlertResponse.Ok,
            }),
          ),
          resolve,
        }),
      })
    })

    if (Maybe.elem (ErrorAlertResponse.Copy) (response)) {
      clipboard.writeText (AlertOptions.A.message (opts))
    }

    return fmapF (response) ((): void => undefined)
  }

/**
 * Creates a message from the passed message and the passed error object that
 * can be used as the content of an alert.
 */
export const getErrorMsg =
  (staticData: StaticDataRecord) =>
  (message: string) =>
  (error: Left<Error>): string =>
    `${message} (${translate (staticData) ("general.errorcode")}: ${JSON.stringify (fromLeft_ (error))})`

export const addDefaultErrorAlert =
  (staticData: StaticDataRecord) =>
  (message: string) =>
  (error: Left<Error>) =>
    addErrorAlert (AlertOptions ({
                    message: getErrorMsg (staticData) (message) (error),
                    title: Just (translate (staticData) ("general.error")),
                  }))

export const addDefaultErrorAlertWithTitle =
  (staticData: StaticDataRecord) =>
  (title: string) =>
  (message: string) =>
  (error: Left<Error>) =>
    addErrorAlert (AlertOptions ({
                    message: getErrorMsg (staticData) (message) (error),
                    title: Just (title),
                  }))


// CONFIRM

export enum ConfirmResponse {
 Accepted, Rejected
}

export interface ConfirmOptions {
  "@@name": "ConfirmOptions"
  title: Maybe<string>
  message: string
  useYesNo: boolean
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConfirmOptions =
  fromDefault ("ConfirmOptions")
              <ConfirmOptions> ({
                title: Nothing,
                message: "",
                useYesNo: false,
              })

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
