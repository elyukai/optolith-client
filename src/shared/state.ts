import type { Debugger } from "debug"
import { action, observable, reaction, toJS } from "mobx"

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
  handler: (event: Electron.IpcMainEvent, ...args: StateActionsAsParameters<A>) => void,
  debug?: Debugger,
): void => {
  ipcMain.on("state:action", (event, actionName: keyof A, ...args: unknown[]) => {
    debug?.("execute state action %s with parameters %o", actionName, args)
    handler(event, actionName, args as Parameters<A[keyof A]>)
  })
}

/**
 * Attaches state action handlers to the main process, so that they can be called from the renderer process.
 * @param ipcMain The Electron IPC main process.
 * @param stateActions An object containing the state action handlers.
 */
export const attachKeyedStateActionHandlersToMain = <A extends StateActions>(
  ipcMain: Electron.IpcMain,
  handler: (
    event: Electron.IpcMainEvent,
    characterId: string,
    ...args: StateActionsAsParameters<A>
  ) => void,
  debug?: Debugger,
): void => {
  ipcMain.on("keyedstate:action", (event, characterId, actionName: keyof A, ...args: unknown[]) => {
    debug?.("execute keyed state action %s with parameters %o", actionName, args)
    handler(event, characterId, actionName, args as Parameters<A[keyof A]>)
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
  debug?: Debugger,
): void => {
  const disposers = Object.entries(stateSelectors).map(([name, selector]) =>
    reaction(
      selector,
      value => {
        debug?.("sending changed state for slice %s", name)
        window.webContents.send("state:change", name, toJS(value))
      },
      { fireImmediately: true },
    ),
  )

  window.on("closed", () => {
    disposers.forEach(cancel => cancel())
  })
}

/**
 * Attaches state selectors to a BrowserWindow, so that changes to the state can be sent to the renderer process.
 * @param window The Electron BrowserWindow.
 * @param stateSelectors An object containing the state selectors.
 */
export const attachKeyedStateSelectorsToWindow = <T, S extends StateValues>(
  window: Electron.BrowserWindow,
  keyedMap: () => Map<string, T>,
  stateSelectorsFromValue: (value: T) => StateSelectors<S>,
  debug?: Debugger,
): void => {
  const keyedDisposers = new Map<string, (() => void)[]>()

  const registerDisposersForKey = (key: string, mapValue: T) => {
    const stateSelectors = stateSelectorsFromValue(mapValue)
    const disposers = Object.entries(stateSelectors).map(([name, selector]) =>
      reaction(
        selector,
        value => {
          debug?.("sending changed state for slice %s keyed by %s", name, key)
          window.webContents.send("keyedstate:change", key, name, toJS(value))
        },
        { fireImmediately: true },
      ),
    )
    keyedDisposers.set(key, disposers)
  }

  keyedMap().forEach((mapValue, key) => {
    registerDisposersForKey(key, mapValue)
  })

  const mainDisposer = reaction(
    () => Object.fromEntries(keyedMap().entries()),
    (obj, prevObj) => {
      debug?.("reevaluating selectors")
      const keys = Object.keys(obj)
      // Remove disposers for keys that are no longer present
      keyedDisposers.forEach((disposers, key) => {
        if (obj[key] === undefined && obj[key] !== prevObj?.[key]) {
          debug?.("removing disposers for key %s", key)
          disposers.forEach(cancel => cancel())
          keyedDisposers.delete(key)
        }
      })

      // Add disposers for new or changed keys
      keys.forEach(key => {
        if (obj[key] !== undefined && obj[key] !== prevObj?.[key]) {
          if (prevObj?.[key] !== undefined) {
            debug?.("removing disposers for key %s", key)
            keyedDisposers.get(key)?.forEach(cancel => cancel())
          }
          debug?.("adding disposers for key %s", key)
          const mapValue = obj[key]
          if (mapValue) {
            registerDisposersForKey(key, mapValue)
          }
        }
      })
    },
    {
      fireImmediately: true,
      equals: (a, b) =>
        Object.keys(a).length === Object.keys(b).length &&
        Object.keys(a).every(key => Object.hasOwn(b, key) && a[key] === b[key]),
    },
  )

  window.on("closed", () => {
    mainDisposer()
    keyedDisposers.forEach(disposers => disposers.forEach(cancel => cancel()))
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

export type KeyedStateSelectorsAndActionsBridge<S extends StateValues, A extends StateActions> = {
  onKeyedStateChange: <Slice extends keyof S>(
    sliceName: Slice,
    listener: (characterId: string, value: S[Slice]) => void,
  ) => void
  onAnyKeyedStateChange: (
    listener: <Slice extends keyof S>(
      characterId: string,
      sliceName: Slice,
      value: S[Slice],
    ) => void,
  ) => void
  executeKeyed: <Action extends keyof A>(
    characterId: string,
    actionName: Action,
    ...args: Parameters<A[Action]>
  ) => void
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

/**
 * Attaches state selectors and actions to the context bridge in a preload script, so that they can be accessed from the renderer process.
 * @param ipcRenderer The Electron IPC renderer process.
 * @returns An object containing the state selectors and actions.
 */
export const attachKeyedStateSelectorsAndActionsToContextBridge = <
  S extends StateValues,
  A extends StateActions,
>(
  ipcRenderer: Electron.IpcRenderer,
): KeyedStateSelectorsAndActionsBridge<S, A> => {
  const onKeyedStateChange = <Slice extends keyof S>(
    sliceName: Slice,
    listener: (characterId: string, value: S[Slice]) => void,
  ) => {
    ipcRenderer.on("keyedstate:change", (_event, characterId, name, value) => {
      if (name === sliceName) {
        listener(characterId, value)
      }
    })
  }

  const onAnyKeyedStateChange = (
    listener: <Slice extends keyof S>(
      characterId: string,
      sliceName: Slice,
      value: S[Slice],
    ) => void,
  ) => {
    ipcRenderer.on("keyedstate:change", (_event, characterId, name, value) => {
      listener(characterId, name, value)
    })
  }

  const executeKeyed = <Action extends keyof A>(
    characterId: string,
    actionName: Action,
    ...args: Parameters<A[Action]>
  ) => {
    ipcRenderer.send("keyedstate:action", characterId, actionName, ...args)
  }

  return { onKeyedStateChange, onAnyKeyedStateChange, executeKeyed }
}

export type WithoutClassFunctions<T> = T extends { toJSON: () => infer U }
  ? U
  : T extends any[]
    ? {
        [K in keyof T]: WithoutClassFunctions<T[K]>
      }
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
  debug: Debugger,
): WithoutClassFunctions<S> => {
  const observableCollection = observable<S>(defaultValues)

  bridge.onAnyStateChange((sliceName, value) => {
    action(() => {
      debug("state change for slice %s", sliceName)
      observableCollection[sliceName] = value
    })()
  })

  return observableCollection as WithoutClassFunctions<S>
}

/**
 * Transforms state selectors received from the context bridge into an observable object, so that they can be used in a reactive way in the renderer process.
 * @param bridge The state selectors and actions bridge.
 * @returns An observable object containing the state selectors.
 */
export const transformKeyedStateSelectorsFromContextBridgeIntoObservable = <S extends StateValues>(
  bridge: KeyedStateSelectorsAndActionsBridge<S, StateActions>,
  defaultValues: S,
  debug: Debugger,
): Record<string, WithoutClassFunctions<S>> => {
  const observableCollection = observable<Record<string, S>>({})

  bridge.onAnyKeyedStateChange((id, sliceName, value) => {
    action(() => {
      debug("state change for slice %s", sliceName)
      ;(observableCollection[id] ??= observable(defaultValues))[sliceName] = value
    })()
  })

  return observableCollection as Record<string, WithoutClassFunctions<S>>
}
