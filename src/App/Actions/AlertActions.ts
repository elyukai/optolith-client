import { clipboard } from "electron";
import { fromLeft_, Left } from "../../Data/Either";
import { fmapF } from "../../Data/Functor";
import { List } from "../../Data/List";
import { Just, Maybe, Nothing } from "../../Data/Maybe";
import { fromDefault, OmitName, PartialMaybeOrNothing, Record, RecordCreator } from "../../Data/Record";
import { ADD_ALERT, REMOVE_ALERT } from "../Constants/ActionTypes";
import { L10nRecord } from "../Models/Wiki/L10n";
import { translate } from "../Utilities/I18n";
import { ReduxAction } from "./Actions";


// BASIC INTERFACES

export interface PromptOptions<A> {
  "@@name": "PromptOptions",
  title: Maybe<string>,
  message: string,
  buttons: List<Record<PromptButton<A>>>
  resolve: (response: Maybe<A>) => void
}

interface PromptOptionsCreator extends RecordCreator<PromptOptions<any>> {
  <A> (x: PartialMaybeOrNothing<OmitName<PromptOptions<A>>>): Record<PromptOptions<A>>
}

export const PromptOptions: PromptOptionsCreator =
  fromDefault ("PromptOptions")
              <PromptOptions<any>> ({
                title: Nothing,
                message: "",
                buttons: List (),
                resolve: () => Nothing,
              })

export interface PromptButton<A> {
  "@@name": "PromptButton",
  label: string
  critical: Maybe<boolean>
  response: A
}

interface PromptButtonCreator extends RecordCreator<PromptButton<any>> {
  <A> (x: PartialMaybeOrNothing<OmitName<PromptButton<A>>>): Record<PromptButton<A>>
}

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
  "@@name": "CustomPromptOptions",
  title: Maybe<string>,
  message: string,
  buttons: List<Record<PromptButton<A>>>
}

interface CustomPromptOptionsCreator extends RecordCreator<CustomPromptOptions<any>> {
  <A> (x: PartialMaybeOrNothing<OmitName<CustomPromptOptions<A>>>): Record<CustomPromptOptions<A>>
}

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
  "@@name": "AlertOptions",
  title: Maybe<string>,
  message: string,
}

export const AlertOptions =
  fromDefault ("AlertOptions")
              <AlertOptions> ({
                title: Nothing,
                message: "",
              })

export const addAlert =
  (l10n: L10nRecord) =>
  (opts: Record<AlertOptions>): ReduxAction<Promise<Maybe<void>>> =>
  async dispatch =>
    new Promise<Maybe<void>> (resolve => {
      dispatch<AddPromptAction> ({
        type: ADD_ALERT,
        payload: PromptOptions ({
          title: AlertOptions.A.title (opts),
          message: AlertOptions.A.message (opts),
          buttons: List (
            PromptButton<void> ({
              label: translate (l10n) ("ok"),
              response: undefined,
            }),
          ),
          resolve,
        }),
      })
    })


// ERROR ALERT

enum ErrorAlertResponse { Copy, Ok }

export const addErrorAlert =
  (l10n: L10nRecord) =>
  (opts: Record<AlertOptions>): ReduxAction<Promise<Maybe<void>>> =>
  async dispatch => {
    const response = await new Promise<Maybe<ErrorAlertResponse>> (resolve => {
      dispatch<AddPromptAction> ({
        type: ADD_ALERT,
        payload: PromptOptions ({
          title: AlertOptions.A.title (opts),
          message: AlertOptions.A.message (opts),
          buttons: List (
            PromptButton<ErrorAlertResponse> ({
              label: translate (l10n) ("copy"),
              response: ErrorAlertResponse.Copy,
            }),
            PromptButton<ErrorAlertResponse> ({
              label: translate (l10n) ("ok"),
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

export const addDefaultErrorAlert =
  (l10n: L10nRecord) =>
  (message: string) =>
  (error: Left<Error>) =>
    addErrorAlert (l10n)
                  (AlertOptions ({
                    message: getDefaultErrorMsg (l10n) (message) (error),
                    title: Just (translate (l10n) ("error")),
                  }))

const getDefaultErrorMsg =
  (l10n: L10nRecord) =>
  (message: string) =>
  (error: Left<Error>) =>
    `${message} (${translate (l10n) ("errorcode")}: ${JSON.stringify (fromLeft_ (error))})`


// CONFIRM

export enum ConfirmResponse { Accepted, Rejected }

export interface ConfirmOptions {
  "@@name": "ConfirmOptions",
  title: Maybe<string>,
  message: string,
  useYesNo: boolean,
}

export const ConfirmOptions =
  fromDefault ("ConfirmOptions")
              <ConfirmOptions> ({
                title: Nothing,
                message: "",
                useYesNo: false,
              })

export const addConfirm =
  (l10n: L10nRecord) =>
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
                  label: translate (l10n) ("yes"),
                  response: ConfirmResponse.Accepted,
                }),
                PromptButton<ConfirmResponse> ({
                  label: translate (l10n) ("no"),
                  response: ConfirmResponse.Rejected,
                })
              )
            : List (
                PromptButton<ConfirmResponse> ({
                  label: translate (l10n) ("ok"),
                  response: ConfirmResponse.Accepted,
                }),
                PromptButton<ConfirmResponse> ({
                  label: translate (l10n) ("cancel"),
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
