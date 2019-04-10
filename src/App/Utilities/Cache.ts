import { remote } from "electron";
import { join } from "path";
import { readFile } from "../../System/IO";
import { pipe_ } from "./pipe";

const app_data_path = remote.app.getPath ("userData")

const file_path = join (app_data_path, "cache.json")

export const readCache =
  pipe_ (
    file_path,
    readFile,

  )
