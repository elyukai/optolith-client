import * as MobX from "mobx"

export const get: <T extends object, K extends Extract<keyof T, string>>(
  obj: T,
  key: K,
) => T[K] | undefined = MobX.get
