import { deepEqual } from "@elyukai/utils/equality"
import type { TSONDBTypes } from "@optolith/database-schema"
import { createCache } from "@optolith/database-schema/cache"
import type { EntityMap, Locale } from "@optolith/database-schema/gen"
import {
  MagicalActionIdentifier,
  TraditionArtifactEnchantmentIdentifier,
} from "@optolith/database-schema/types/_IdentifierGroup"
import {
  getEntityDescription,
  isSupportedEntity,
  type AvailableCreatorEntity,
} from "@optolith/entity-descriptions"
import Debug from "debug"
import { autoUpdater } from "electron-updater"
import { app, ipcMain } from "electron/main"
import { configure, runInAction } from "mobx"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ReadonlyTSONDB } from "tsondb/readonly"
import { fromUniformCase } from "tsondb/schema/gen"
import config from "../database/contents/tsondb.config.ts"
import type { PreloadAPI } from "../main_window_preload/index.ts"
import { attachDatabaseEventsMain } from "../shared/database.ts"
import { Characters } from "../shared/domain/character.ts"
import type { Global } from "../shared/global.ts"
import type { CharacterIPCActions } from "../shared/ipc.ts"
import { globalSettings } from "../shared/settings/main.ts"
import { attachStateActionHandlersToMain } from "../shared/state.ts"
import { runAsync } from "../shared/utils/async.ts"
import { LocaleEnvironment } from "../shared/utils/locale.ts"
import { createMainWindow } from "./mainWindow.ts"
import { setMenu } from "./menu.ts"
import { handleNativeThemeChanges, setNativeTheme } from "./nativeTheme.ts"
import { ensureUserDataPathExists } from "./saveData.ts"
import { createSettingsWindow } from "./settingsWindow.ts"
import { checkForUpdatesOnRequest, checkForUpdatesOnStartup } from "./updater.ts"

const debug = Debug("main")
debug.log = console.log.bind(console)

configure({
  // enforceActions: "always",
  computedRequiresReaction: true,
  // reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true,
})

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

const settings = db.getSingletonInstanceOfEntity("Settings")

if (settings === undefined) {
  throw new Error("Settings instance not found in database")
}

const locales: Record<string, Locale> = Object.fromEntries(
  db
    .getAllInstanceContainersOfEntity("Locale")
    .map((localeContainer): [string, Locale] => [localeContainer.id, localeContainer.content]),
)

const localeEnvironment = new LocaleEnvironment(locales, app.getSystemLocale(), globalSettings)

const global: Global = {
  db,
  settings,
  locale: localeEnvironment,
  cache,
  getResolvedSelectOptionById: (parentId, optionid) =>
    cache.activatableSelectOptions[parentId.kind][fromUniformCase(parentId)]?.find(option =>
      deepEqual(option.id, optionid),
    ),
  getAllResolvedSelectOptions: parentId =>
    cache.activatableSelectOptions[parentId.kind][fromUniformCase(parentId)] ?? [],
}

const characters = runInAction(() => new Characters(global))

const setUserDataPath = async () => {
  debug("setting user data path ...")
  app.setPath("userData", await ensureUserDataPathExists())
}

const readFileInAppPath = (...path: string[]) => readFile(join(app.getAppPath(), ...path), "utf-8")

const getSpecialEntityDescriptionTag = <E extends AvailableCreatorEntity>(
  entityName: E,
  entry: EntityMap[E],
): string | undefined => {
  if (entityName === "Skill") {
    return db.getInstanceOfEntityById("SkillGroup", (entry as EntityMap["Skill"]).group)?.color.kind
  } else if (Object.hasOwn(TraditionArtifactEnchantmentIdentifier.type.value.values, entityName)) {
    return "TraditionArtifactEnchantment"
  } else if (Object.hasOwn(MagicalActionIdentifier.type.value.values, entityName)) {
    return "MagicalAction"
  } else {
    return undefined
  }
}

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

  setMenu(isMac, db, cache, locales, localeEnvironment, characters)
  setNativeTheme(runInAction(() => globalSettings.theme))
  const installUpdateInsteadOfStartup = await checkForUpdatesOnStartup(locales)

  debug("skip startup because of update?", installUpdateInsteadOfStartup ? "yes" : "no")
  if (!installUpdateInsteadOfStartup) {
    await setUserDataPath()

    attachDatabaseEventsMain(ipcMain, db, cache, (name, _event, error) => {
      debug("error in database event %s: %O", name, error)
    })
    debug("database event listeners attached")

    attachStateActionHandlersToMain<CharacterIPCActions>(
      ipcMain,
      (...args) => {
        characters.handleIPCAction(...args)
      },
      debug,
    )
    debug("character action listeners attached")

    ipcMain.handle("receive-license", () => readFileInAppPath("LICENSE"))
    ipcMain.handle("receive-changelog", () => readFileInAppPath("CHANGELOG.md"))
    ipcMain.handle("receive-version", () => app.getVersion())
    ipcMain.handle("receive-system-locale", () => app.getSystemLocale())
    ipcMain.on(
      "show-settings",
      runAsync(debug, async () => {
        debug("show settings")
        await createSettingsWindow(locales, () =>
          setMenu(isMac, db, cache, locales, localeEnvironment, characters),
        )
      }),
    )
    ipcMain.on(
      "check-for-update",
      runAsync(debug, async () => {
        debug("check for update")
        await checkForUpdatesOnRequest(locales)
      }),
    )
    ipcMain.handle(
      "receive-entity-description",
      (_event, ...args: Parameters<PreloadAPI["getEntityDescription"]>) =>
        runInAction(() => {
          const [entity, id, characterId] = args
          debug("generate entity description for entity %s with id %s", entity, id)
          if (!isSupportedEntity(entity)) {
            return undefined
          }
          const entry = db.getInstanceOfEntityById(entity, id)
          if (entry === undefined) {
            return undefined
          }

          return [
            getEntityDescription(
              db,
              localeEnvironment.toObject(),
              settings,
              global.getResolvedSelectOptionById,
              global.getAllResolvedSelectOptions,
              skillId => cache.newApplicationsAndUses.newApplications[skillId] ?? [],
              skillId => cache.newApplicationsAndUses.uses[skillId] ?? [],
              entity,
              { id, content: entry },
              (characterId === undefined
                ? undefined
                : runInAction(
                    () => characters.characters[characterId]?.rules.publicationOptions,
                  )) ?? {
                publications: [],
                onlyCompletePublications: false,
                onlyShowReferencesToIncludedPublications: false,
                changeHandling: "latestOnly",
                showPublicationGroups: "all",
              },
              "Full",
              characterId === undefined
                ? undefined
                : runInAction(() => characters.characters[characterId]?.rules.renderingOptions),
            ),
            getSpecialEntityDescriptionTag(entity, entry),
          ]
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
