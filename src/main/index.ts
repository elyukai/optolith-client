import type { TSONDBTypes } from "@optolith/database-schema"
import { createCache } from "@optolith/database-schema/cache"
import type { Locale } from "@optolith/database-schema/gen"
import Debug from "debug"
import { autoUpdater } from "electron-updater"
import { app, ipcMain } from "electron/main"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ReadonlyTSONDB } from "tsondb/readonly"
import config from "../database/contents/tsondb.config.ts"
import { attachDatabaseEventsMain } from "../shared/database.ts"
import { Characters } from "../shared/domain/character.ts"
import type { CharacterIPCActions } from "../shared/ipc.ts"
import { getGlobalSettings } from "../shared/settings/main.ts"
import { attachStateActionHandlersToMain } from "../shared/state.ts"
import { runAsync } from "../shared/utils/async.ts"
import { createMainWindow } from "./mainWindow.ts"
import { setMenu } from "./menu.ts"
import { handleNativeThemeChanges, setNativeTheme } from "./nativeTheme.ts"
import { ensureUserDataPathExists } from "./saveData.ts"
import { createSettingsWindow } from "./settingsWindow.ts"
import { checkForUpdatesOnRequest, checkForUpdatesOnStartup } from "./updater.ts"

const debug = Debug("main")

app.setAppUserModelId("lukasobermann.optolith")
const isMac = process.platform === "darwin"

debug("loading database ...")
if (config.dataRootPath === undefined) {
  throw new Error("dataRootPath is not defined in tsondb.config.ts")
}

const db = await ReadonlyTSONDB.create<TSONDBTypes>({
  ...config,
  dataRootPath: config.dataRootPath,
})

debug("database loaded")

const cache = createCache(db)

debug("cache created")

attachDatabaseEventsMain(ipcMain, db, cache, (name, _event, error) => {
  debug("error in database event %s: %O", name, error)
})

debug("database event listeners attached")

const characters = new Characters(db)

attachStateActionHandlersToMain<CharacterIPCActions>(ipcMain, (...args) => {
  characters.handleIPCAction(...args)
})

const locales: Record<string, Locale> = Object.fromEntries(
  db
    .getAllInstanceContainersOfEntity("Locale")
    .map((localeContainer): [string, Locale] => [localeContainer.id, localeContainer.content]),
)

const setUserDataPath = async () => {
  debug("setting user data path ...")
  app.setPath("userData", await ensureUserDataPathExists())
}

const readFileInAppPath = (...path: string[]) => readFile(join(app.getAppPath(), ...path), "utf-8")

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.whenReady().then(async () => {
  debug("ready")
  autoUpdater.autoDownload = false

  app.on("window-all-closed", () => {
    debug("all windows closed")
    if (!isMac) {
      app.quit()
    }
  })

  setMenu(isMac, db, cache, locales, characters)
  setNativeTheme(getGlobalSettings().theme)
  const installUpdateInsteadOfStartup = await checkForUpdatesOnStartup(locales)

  debug("skip startup because of update?", installUpdateInsteadOfStartup ? "yes" : "no")
  if (!installUpdateInsteadOfStartup) {
    await setUserDataPath()

    ipcMain.handle("receive-license", () => readFileInAppPath("LICENSE"))
    ipcMain.handle("receive-changelog", () => readFileInAppPath("CHANGELOG.md"))
    ipcMain.handle("receive-version", () => app.getVersion())
    ipcMain.handle("receive-system-locale", () => app.getSystemLocale())
    ipcMain.on(
      "show-settings",
      runAsync(debug, async () => {
        debug("show settings")
        await createSettingsWindow(locales, () => setMenu(isMac, db, cache, locales, characters))
      }),
    )
    ipcMain.on(
      "check-for-update",
      runAsync(debug, async () => {
        debug("check for update")
        await checkForUpdatesOnRequest(locales)
      }),
    )

    await createMainWindow(locales, db, cache, characters)
  }

  app.on(
    "activate",
    runAsync(debug, async (_event, hasVisibleWindows) => {
      debug("activated: hasVisibleWindows = %s", hasVisibleWindows)
      if (!hasVisibleWindows) {
        await createMainWindow(locales, db, cache, characters)
      }
    }),
  )
})

handleNativeThemeChanges()
