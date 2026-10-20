import type { TSONDBTypes } from "@optolith/database-schema"
import type { Cache } from "@optolith/database-schema/cache"
import type { Locale } from "@optolith/database-schema/gen"
import Debug from "debug"
import { app, Menu, MenuItemConstructorOptions } from "electron/main"
import type { ReadonlyTSONDB } from "tsondb/readonly"
import type { Characters } from "../shared/domain/character.ts"
import { getGlobalSettings } from "../shared/settings/main.ts"
import { runAsync } from "../shared/utils/async.ts"
import { createTranslate } from "../shared/utils/translate.ts"
import { createMainWindow } from "./mainWindow.ts"
import { createSettingsWindow } from "./settingsWindow.ts"

const debug = Debug("main:menu")

export const setMenu = (
  isMac: boolean,
  db: ReadonlyTSONDB<TSONDBTypes>,
  cache: Cache,
  locales: Record<string, Locale>,
  characters: Characters,
) => {
  const translate = createTranslate(locales, getGlobalSettings().locale, app.getLocale())

  const template: MenuItemConstructorOptions[] = [
    // { role: "appMenu" }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              {
                role: "about",
                label: translate("About {$app}", { app: app.name }),
              },
              { type: "separator" },
              {
                label: translate("Preferences …"),
                accelerator: "Command+,",
                click: runAsync(debug, async () => {
                  await createSettingsWindow(locales, () =>
                    setMenu(isMac, db, cache, locales, characters),
                  )
                }),
              },
              { type: "separator" },
              {
                role: "services",
                label: translate("Services"),
              },
              { type: "separator" },
              {
                role: "hide",
                label: translate("Hide {$app}", { app: app.name }),
              },
              {
                role: "hideOthers",
                label: translate("Hide Others"),
              },
              {
                role: "unhide",
                label: translate("Show All"),
              },
              { type: "separator" },
              {
                role: "quit",
                label: translate("Quit {$app}", { app: app.name }),
              },
            ],
          } as MenuItemConstructorOptions,
        ]
      : []),
    // { role: "fileMenu" }
    {
      label: translate(".input {$os :string} {{File}}", {
        os: process.platform === "darwin" ? "mac" : process.platform,
      }),
      submenu: [
        {
          label: translate("New Character"),
          accelerator: "CommandOrControl+N",
          click: runAsync(debug, async () => {
            const mainWindow = await createMainWindow(locales, db, cache, characters)
            mainWindow.webContents.send("new-character")
          }),
        },
        { type: "separator" },
        isMac
          ? {
              role: "close",
              label: translate("Close"),
            }
          : {
              role: "quit",
              label: translate("Quit"),
            },
      ],
    } as MenuItemConstructorOptions,
    // { role: "editMenu" }
    {
      label: translate("Edit"),
      submenu: [
        {
          role: "undo",
          label: translate("Undo"),
        },
        {
          role: "redo",
          label: translate("Redo"),
        },
        { type: "separator" },
        {
          role: "cut",
          label: translate("Cut"),
        },
        {
          role: "copy",
          label: translate("Copy"),
        },
        {
          role: "paste",
          label: translate("Paste"),
        },
        ...(isMac
          ? [
              {
                role: "delete",
                label: translate("Delete"),
              },
              {
                role: "selectAll",
                label: translate("Select All"),
              },
            ]
          : [
              {
                role: "delete",
                label: translate("Delete"),
              },
              { type: "separator" },
              {
                role: "selectAll",
                label: translate("Select All"),
              },
            ]),
      ],
    } as MenuItemConstructorOptions,
    // { role: "viewMenu" }
    ...(isMac
      ? [
          {
            label: translate("View"),
            submenu: [
              { role: "toggleDevTools" },
              {
                role: "togglefullscreen",
                label: translate("Toggle Full Screen"),
              },
            ],
          } as MenuItemConstructorOptions,
        ]
      : []),
    // { role: "windowMenu" }
    {
      label: translate("Window"),
      submenu: [
        {
          role: "minimize",
          label: translate("Minimize"),
        },
        ...(isMac
          ? [
              {
                role: "zoom",
                label: translate("Zoom"),
              },
              { type: "separator" },
              {
                label: translate("Main Window"),
                accelerator: "Command+0",
                click: runAsync(debug, async () => {
                  await createMainWindow(locales, db, cache, characters)
                }),
              },
              { type: "separator" },
              {
                role: "front",
                label: translate("Bring All to Front"),
              },
              // { type: "separator" },
              // {
              //   role: "window" ,
              //   label: translate("Toggle Full Screen"),
              // },
            ]
          : [
              {
                role: "close",
                label: translate("Close"),
              },
            ]),
      ],
    } as MenuItemConstructorOptions,
    // {
    //   role: "help",
    //   label: translate("Close"),
    //   submenu: [
    //     {
    //       label: "Learn More",
    //       click: async () => {
    //         const { shell } = require("electron")
    //         await shell.openExternal("https://electronjs.org")
    //       },
    //     },
    //   ],
    // } as MenuItemConstructorOptions,
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  debug("menu set")
}
