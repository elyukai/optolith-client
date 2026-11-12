import { isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { deepEqual } from "@elyukai/utils/equality"
import { on } from "@elyukai/utils/function"
import { compareNumber } from "@elyukai/utils/ordering"
import type { TSONDBTypes } from "@optolith/database-schema"
import { createCache } from "@optolith/database-schema/cache"
import type { EntityMap, ExperienceLevelTranslation, Locale } from "@optolith/database-schema/gen"
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
import { dialog } from "electron"
import { autoUpdater } from "electron-updater"
import { app, ipcMain } from "electron/main"
import { action, configure, observable, runInAction } from "mobx"
import { randomUUID } from "node:crypto"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ReadonlyTSONDB } from "tsondb/readonly"
import { fromUniformCase } from "tsondb/schema/gen"
import config from "../database/contents/tsondb.config.ts"
import type { FinalStartConfig } from "../main_window/routes/characters/HeroCreation.tsx"
import type { RoutePath } from "../main_window/slices/routeSlice.ts"
import type { PreloadAPI } from "../main_window_preload/index.ts"
import { attachDatabaseEventsMain } from "../shared/database.ts"
import {
  BaseCharacter,
  CharacterInRaceCultureProfessionSelection,
  Characters,
} from "../shared/domain/character.ts"
import { equalsCase } from "../shared/domain/databaseEnum.ts"
import type { Global } from "../shared/global.ts"
import type { CharacterIPCActions } from "../shared/ipc.ts"
import { globalSettings } from "../shared/settings/main.ts"
import {
  attachKeyedStateActionHandlersToMain,
  attachStateActionHandlersToMain,
  type StateActionsAsParameters,
} from "../shared/state.ts"
import { runAsync } from "../shared/utils/async.ts"
import { LocaleEnvironment, type LocaleMap } from "../shared/utils/locale.ts"
import { createMainWindow } from "./mainWindow.ts"
import { setMenu } from "./menu.ts"
import { handleNativeThemeChanges, setNativeTheme } from "./nativeTheme.ts"
import { constructUserDataPath, loadCharacters, saveCharacter } from "./saveData.ts"
import { createSettingsWindow } from "./settingsWindow.ts"
import { checkForUpdatesOnRequest, checkForUpdatesOnStartup } from "./updater.ts"

const debug = Debug("main")
debug.log = console.log.bind(console)

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
})

app.setAppUserModelId("lukasobermann.optolith")
const isMac = process.platform === "darwin"

debug("setting user data path ...")
app.setPath("userData", constructUserDataPath())

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

const preparedExperienceLevels = observable(
  db
    .getAllInstanceContainersOfEntity("ExperienceLevel")
    .toSorted(on(c => c.content.adventure_points, compareNumber))
    .map(c => ({
      id: c.id,
      translations: c.content.translations,
      adventurePoints: c.content.adventure_points,
    })),
)

const global: Global = {
  db,
  settings,
  locale: localeEnvironment,
  cache,
  getResolvedSelectOptionById: (parentId, optionid) =>
    cache.activatableSelectOptions[parentId.kind][fromUniformCase(parentId)]?.find(option =>
      deepEqual(option.id, optionid),
    ),
  getResolvedSkillApplicationById: (skillId, applicationId) =>
    cache.skillApplications[skillId]?.find(application =>
      equalsCase(application.id, applicationId),
    ),
  getAllResolvedSelectOptions: parentId =>
    cache.activatableSelectOptions[parentId.kind][fromUniformCase(parentId)] ?? [],
  sortedExperienceLevels: preparedExperienceLevels,
}

debug("load characters ...")

const loadedCharacters = await loadCharacters(app.getPath("userData"))

debug("loaded %d characters", loadedCharacters.length)
debug("initializing characters in memory ...")

const characters = runInAction(() => {
  const _characters = new Characters(global, app.getVersion())

  if (isNotEmpty(loadedCharacters)) {
    for (const [id, data] of loadedCharacters) {
      _characters.addCharacterFromJSON(id, data)
    }
  } else {
    _characters.addCharacter(
      BaseCharacter.exampleCharacter(
        global,
        "550e8400-e29b-11d4-a716-446655440000",
        app.getVersion(),
      ),
    )
  }

  return _characters
})

const newCharacter = runInAction(() =>
  observable({
    newCharacter: new CharacterInRaceCultureProfessionSelection(
      global,
      randomUUID(),
      app.getVersion(),
      global.settings.defaultExperienceLevel,
    ),
  }),
)

const resetNewCharacter = action(() => {
  newCharacter.newCharacter = new CharacterInRaceCultureProfessionSelection(
    global,
    randomUUID(),
    app.getVersion(),
    global.settings.defaultExperienceLevel,
  )
})

const globalSelectors = {
  characters: () => characters.characterOverviews,
  experienceLevels: (): {
    id: string
    adventurePoints: number
    translations: LocaleMap<ExperienceLevelTranslation>
  }[] => preparedExperienceLevels,
  ...newCharacter.newCharacter.selectors,
}

export type GlobalIPCSelectors = typeof globalSelectors

export type GlobalIPCState = {
  [K in keyof GlobalIPCSelectors]: ReturnType<GlobalIPCSelectors[K]>
}

export type GlobalIPCActions = {
  saveCharacter: (characterId: string) => void
  createCharacter: (startConfig: FinalStartConfig) => void
} & CharacterIPCActions

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

  setMenu(global, isMac, locales, globalSelectors, characters)
  setNativeTheme(runInAction(() => globalSettings.theme))
  const installUpdateInsteadOfStartup = await checkForUpdatesOnStartup(locales)

  debug("skip startup because of update?", installUpdateInsteadOfStartup ? "yes" : "no")
  if (!installUpdateInsteadOfStartup) {
    const handleGlobalIPCAction = action(
      (
        event: Electron.IpcMainEvent,
        ...args: StateActionsAsParameters<GlobalIPCActions>
      ): Promise<void | RoutePath> | void | RoutePath => {
        debug("execute global ipc action %s with parameters %o", args[0], args[1])
        switch (args[0]) {
          case "saveCharacter": {
            const [_, [characterId]] = args
            const character: BaseCharacter | undefined = characters.characters.get(characterId)
            if (character === undefined) {
              debug("character %s not found", characterId)
              return
            }
            return saveCharacter(app.getPath("userData"), characterId, character.toJSON())
          }
          case "createCharacter": {
            newCharacter.newCharacter.name = args[1][0].name
            newCharacter.newCharacter.personalData.sex = args[1][0].sex
            newCharacter.newCharacter.experienceLevel.startId = args[1][0].experienceLevel
            const char = characters.addCharacter(newCharacter.newCharacter)
            resetNewCharacter()
            return ["characters", char.id, "race"]
          }
          default:
            newCharacter.newCharacter.handleIPCAction(event, ...args)
        }
      },
    )

    debug("initialized characters in memory")

    const readFileInAppPath = (...path: string[]) =>
      readFile(join(app.getAppPath(), ...path), "utf-8")

    const getSpecialEntityDescriptionTag = <E extends AvailableCreatorEntity>(
      entityName: E,
      entry: EntityMap[E],
    ): string | undefined => {
      if (entityName === "Skill") {
        return db.getInstanceOfEntityById("SkillGroup", (entry as EntityMap["Skill"]).group)?.color
          .kind
      } else if (
        Object.hasOwn(TraditionArtifactEnchantmentIdentifier.type.value.values, entityName)
      ) {
        return "TraditionArtifactEnchantment"
      } else if (Object.hasOwn(MagicalActionIdentifier.type.value.values, entityName)) {
        return "MagicalAction"
      } else {
        return undefined
      }
    }

    attachDatabaseEventsMain(ipcMain, db, cache, (name, _event, error) => {
      debug("error in database event %s: %O", name, error)
    })
    debug("database event listeners attached")

    attachStateActionHandlersToMain<GlobalIPCActions>(
      ipcMain,
      (event, ...args) => {
        const result = handleGlobalIPCAction(event, ...args)
        if (result instanceof Promise) {
          result.then(resolved => {
            if (resolved !== undefined) {
              event.sender.send("goto", resolved)
            }
          })
        } else if (result !== undefined) {
          event.sender.send("goto", result)
        }
      },
      debug,
    )
    debug("global action listeners attached")

    attachKeyedStateActionHandlersToMain<CharacterIPCActions>(
      ipcMain,
      (event, id, ...args) => {
        const result = characters.handleIPCAction(event, id, ...args)
        if (result instanceof Promise) {
          result.then(resolved => {
            if (resolved !== undefined) {
              event.sender.send("goto", resolved)
            }
          })
        } else if (result !== undefined) {
          event.sender.send("goto", result)
        }
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
          setMenu(global, isMac, locales, globalSelectors, characters),
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
              cache,
              entity,
              { id, content: entry },
              (characterId === undefined
                ? undefined
                : runInAction(
                    () => characters.characters.get(characterId)?.rules.publicationOptions,
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
                : runInAction(() => characters.characters.get(characterId)?.rules.renderingOptions),
            ),
            getSpecialEntityDescriptionTag(entity, entry),
          ]
        }),
    )

    await createMainWindow(global, locales, globalSelectors, characters)
  }

  app.on(
    "activate",
    runAsync(debug, async (_event, hasVisibleWindows) => {
      debug("activated: hasVisibleWindows = %s", hasVisibleWindows)
      if (!hasVisibleWindows) {
        await createMainWindow(global, locales, globalSelectors, characters)
      }
    }),
  )
})

handleNativeThemeChanges()

process.on("uncaughtException", error => {
  console.error(error)
  dialog.showErrorBox("Unexpected error", `${error.name}: ${error.message}\n\n${error.stack}`)
})
