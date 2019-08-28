import { remote } from "electron";

/**
 * The path to the root directory of the packed ASAR, which is the root
 * directory of this project.
 */
export const app_path = remote.app.getAppPath ()

/**
 * The current version of the app.
 */
export const current_version = remote .app .getVersion ()

/**
 * Path to directory where all of the cached and saved files are located.
 *
 * * `%APPDATA%` on Windows,
 * * `$XDG_CONFIG_HOME` or `~/.config` on Linux,
 * * `~/Library/Application Support` on macOS,
 *
 * appended with the name of the app.
 */
export const user_data_path = remote .app .getPath ("userData")
