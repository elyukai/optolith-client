import { observable, reaction, toJS } from "mobx"

export type StateValues = {
  [name: string]: unknown
}

export type StateSelectors<S extends StateValues> = {
  [K in keyof S]: () => S[K]
}

export type StateActions = {
  [name: string]: (...args: any[]) => void
}

export type StateActionsAsParameters<A extends StateActions> = {
  [K in keyof A]: [name: K, args: Parameters<A[K]>]
}[keyof A]

/**
 * Attaches state action handlers to the main process, so that they can be called from the renderer process.
 * @param ipcMain The Electron IPC main process.
 * @param stateActions An object containing the state action handlers.
 */
export const attachStateActionHandlersToMain = <A extends StateActions>(
  ipcMain: Electron.IpcMain,
  handler: (...args: StateActionsAsParameters<A>) => void,
): void => {
  ipcMain.on("state:action", (_event, actionName: keyof A, ...args: unknown[]) => {
    handler(actionName, args as Parameters<A[keyof A]>)
  })
}

/**
 * Attaches state selectors to a BrowserWindow, so that changes to the state can be sent to the renderer process.
 * @param window The Electron BrowserWindow.
 * @param stateSelectors An object containing the state selectors.
 */
export const attachStateSelectorsToWindow = <S extends StateValues>(
  window: Electron.BrowserWindow,
  stateSelectors: StateSelectors<S>,
): void => {
  const disposers = Object.entries(stateSelectors).map(([name, selector]) =>
    reaction(
      selector,
      value => {
        window.webContents.send("state:change", name, toJS(value))
      },
      { fireImmediately: true },
    ),
  )

  window.on("closed", () => {
    disposers.forEach(cancel => cancel())
  })
}

export type StateSelectorsAndActionsBridge<S extends StateValues, A extends StateActions> = {
  onStateChange: <Slice extends keyof S>(
    sliceName: Slice,
    listener: (value: S[Slice]) => void,
  ) => void
  onAnyStateChange: (
    listener: <Slice extends keyof S>(sliceName: Slice, value: S[Slice]) => void,
  ) => void
  execute: <Action extends keyof A>(actionName: Action, ...args: Parameters<A[Action]>) => void
}

/**
 * Attaches state selectors and actions to the context bridge in a preload script, so that they can be accessed from the renderer process.
 * @param ipcRenderer The Electron IPC renderer process.
 * @returns An object containing the state selectors and actions.
 */
export const attachStateSelectorsAndActionsToContextBridge = <
  S extends StateValues,
  A extends StateActions,
>(
  ipcRenderer: Electron.IpcRenderer,
): StateSelectorsAndActionsBridge<S, A> => {
  const onStateChange = <Slice extends keyof S>(
    sliceName: Slice,
    listener: (value: S[Slice]) => void,
  ) => {
    ipcRenderer.on("state:change", (_event, name, value) => {
      if (name === sliceName) {
        listener(value)
      }
    })
  }

  const onAnyStateChange = (
    listener: <Slice extends keyof S>(sliceName: Slice, value: S[Slice]) => void,
  ) => {
    ipcRenderer.on("state:change", (_event, name, value) => {
      listener(name, value)
    })
  }

  const execute = <Action extends keyof A>(actionName: Action, ...args: Parameters<A[Action]>) => {
    ipcRenderer.send("state:action", actionName, ...args)
  }

  return { onStateChange, onAnyStateChange, execute }
}

export type WithoutClassFunctions<T> = T extends { toJSON: () => infer U }
  ? U
  : T extends (infer U)[]
    ? WithoutClassFunctions<U>[]
    : T extends object
      ? {
          [K in keyof T]: T[K] extends Function ? never : WithoutClassFunctions<T[K]>
        }
      : T

export const prepareForSerialization = <T>(obj: T): WithoutClassFunctions<T> => {
  if (obj === null || obj === undefined) {
    return obj as WithoutClassFunctions<T>
  } else if (Array.isArray(obj)) {
    return obj.map(prepareForSerialization) as WithoutClassFunctions<T>
  } else if (typeof obj === "object") {
    if ("toJSON" in obj && typeof obj.toJSON === "function") {
      return prepareForSerialization(obj.toJSON()) as WithoutClassFunctions<T>
    }
    return obj as WithoutClassFunctions<T>
  } else {
    return obj as WithoutClassFunctions<T>
  }
}

/**
 * Transforms state selectors received from the context bridge into an observable object, so that they can be used in a reactive way in the renderer process.
 * @param bridge The state selectors and actions bridge.
 * @returns An observable object containing the state selectors.
 */
export const transformStateSelectorsFromContextBridgeIntoObservable = <S extends StateValues>(
  bridge: StateSelectorsAndActionsBridge<S, StateActions>,
  defaultValues: S,
): WithoutClassFunctions<S> => {
  const observableCollection = observable(defaultValues)

  bridge.onAnyStateChange((sliceName, value) => {
    observableCollection[sliceName] = value
  })

  return observableCollection as WithoutClassFunctions<S>
}
