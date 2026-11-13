import type { Cache } from "@optolith/database-schema/cache"
import type { Locale, Settings } from "@optolith/database-schema/gen"
import type { AvailableCreatorEntity } from "@optolith/entity-descriptions"
import type { EntityDescription } from "@optolith/entity-descriptions/description"
import Debug from "debug"
import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron"
// oxlint-disable-next-line unicorn/prefer-node-protocol
import EventEmitter from "events"
import type { GlobalIPCActions, GlobalIPCState } from "../main/index.ts"
import type { RoutePath } from "../main_window/slices/routeSlice.ts"
import { attackDatabaseHandlersToPreloadAPI, type DatabaseHandlers } from "../shared/database.ts"
import type { CharacterIPCActions, CharacterIPCSelectors } from "../shared/ipc.ts"
import type { GlobalSettings } from "../shared/settings/GlobalSettings.ts"
import {
  attachGlobalSettingsEvents,
  type GlobalSettingsEvents,
} from "../shared/settings/listeningRendererPreload.ts"
import {
  attachKeyedStateSelectorsAndActionsToContextBridge,
  attachStateSelectorsAndActionsToContextBridge,
  type KeyedStateSelectorsAndActionsBridge,
  type StateSelectorsAndActionsBridge,
} from "../shared/state.ts"
import type { TypedEventEmitter } from "../shared/utils/events.ts"

const debugRendererCalls = Debug("mainwindowpreload:renderer")
const debugMainEvents = Debug("mainwindowpreload:main")

type Events = GlobalSettingsEvents & {
  "initial-setup": [InitialSetupEventMessage]
  maximize: []
  unmaximize: []
  blur: []
  focus: []
  "new-character": []
  goto: [RoutePath]
}

/**
 * The API that is exposed to the main window.
 */
export type PreloadAPI = {
  platform: NodeJS.Platform
  systemLocale: string
  initialSetupDone: () => void
  checkForUpdates: () => void
  isMaximized: () => Promise<boolean>
  isFocused: () => Promise<boolean>
  minimize: () => void
  maximize: () => void
  unmaximize: () => void
  close: () => void
  getLicense: () => Promise<string>
  getChangelog: () => Promise<string>
  getVersion: () => Promise<string>
  toggleDevTools: () => void
  showSettings: () => void
  setTitle: (title: string) => void
  log: (...args: unknown[]) => void
  getEntityDescription: <E extends AvailableCreatorEntity>(
    entity: E,
    id: string,
    characterId: string | undefined,
  ) => Promise<
    [EntityDescription<E, string> | undefined, specialTag: string | undefined] | undefined
  >
} & TypedEventEmitter<Events> &
  DatabaseHandlers &
  StateSelectorsAndActionsBridge<GlobalIPCState, GlobalIPCActions> &
  KeyedStateSelectorsAndActionsBridge<CharacterIPCSelectors, CharacterIPCActions>

const events = new EventEmitter() as TypedEventEmitter<Events>

const api: PreloadAPI = {
  on: events.on.bind(events),
  emit: events.emit.bind(events),
  removeListener: events.removeListener.bind(events),
  platform: process.platform,
  systemLocale: "en-US",
  initialSetupDone: () => {
    debugRendererCalls("initial setup done")
    ipcRenderer.send("initial-setup-done")
  },
  checkForUpdates: () => {
    debugRendererCalls("check for updates")
    ipcRenderer.send("check-for-updates")
  },
  isMaximized: () => {
    debugRendererCalls("get is maximized")
    return ipcRenderer.invoke("main-window-receive-is-maximized")
  },
  isFocused: () => {
    debugRendererCalls("get is focused")
    return ipcRenderer.invoke("main-window-receive-is-focused")
  },
  minimize: () => {
    debugRendererCalls("minimize")
    ipcRenderer.send("main-window-minimize")
  },
  maximize: () => {
    debugRendererCalls("maximize")
    ipcRenderer.send("main-window-maximize")
  },
  unmaximize: () => {
    debugRendererCalls("unmaximize")
    ipcRenderer.send("main-window-unmaximize")
  },
  close: () => {
    debugRendererCalls("close")
    ipcRenderer.send("main-window-close")
  },
  getLicense: () => {
    debugRendererCalls("get license")
    return ipcRenderer.invoke("receive-license")
  },
  getChangelog: () => {
    debugRendererCalls("get changelog")
    return ipcRenderer.invoke("receive-changelog")
  },
  getVersion: () => {
    debugRendererCalls("get version")
    return ipcRenderer.invoke("receive-version")
  },
  toggleDevTools: () => {
    debugRendererCalls("toggle dev tools")
    ipcRenderer.send("main-window-toggle-dev-tools")
  },
  showSettings: () => {
    debugRendererCalls("show settings")
    ipcRenderer.send("show-settings")
  },
  setTitle: title => {
    debugRendererCalls('set title to "%s"', title)
    ipcRenderer.send("main-window-set-title", title)
  },
  ...attackDatabaseHandlersToPreloadAPI(debugRendererCalls, ipcRenderer),
  log: (...args: unknown[]) => {
    ipcRenderer.send("main-window-log", ...args)
  },
  ...attachStateSelectorsAndActionsToContextBridge<GlobalIPCState, GlobalIPCActions>(ipcRenderer),
  ...attachKeyedStateSelectorsAndActionsToContextBridge<CharacterIPCSelectors, CharacterIPCActions>(
    ipcRenderer,
  ),
  getEntityDescription: (...args) => {
    debugRendererCalls("get entity description for entity %s with id %s", ...args.slice(0, 2))
    return ipcRenderer.invoke("receive-entity-description", ...args)
  },
}

contextBridge.exposeInMainWorld("optolith", api)

/**
 * The message that is sent from the main process to the main window right after
 * creation.
 */
export type InitialSetupEventMessage = {
  database: [string, { id: string; content: object }[]][]
  cache: Cache
  locales: Record<string, Locale>
  globalSettings: GlobalSettings
  settings: Settings
  systemLocale: string
}

ipcRenderer
  .on("initial-setup", (_event: IpcRendererEvent, message: InitialSetupEventMessage) => {
    api.systemLocale = message.systemLocale
    events.emit("initial-setup", message)
  })
  .on("maximize", () => {
    debugMainEvents("maximize")
    events.emit("maximize")
  })
  .on("unmaximize", () => {
    debugMainEvents("unmaximize")
    events.emit("unmaximize")
  })
  .on("blur", () => {
    debugMainEvents("blur")
    events.emit("blur")
  })
  .on("focus", () => {
    debugMainEvents("focus")
    events.emit("focus")
  })
  .on("new-character", () => {
    debugMainEvents("new-character")
    events.emit("new-character")
  })
  .on("goto", (_event: IpcRendererEvent, message: RoutePath) => {
    debugMainEvents("new-character")
    events.emit("goto", message)
  })

attachGlobalSettingsEvents(ipcRenderer, events)
