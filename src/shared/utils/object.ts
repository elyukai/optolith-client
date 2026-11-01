export const ensureNonEmptyObject = <T extends Record<string, unknown>>(obj: T): T | undefined =>
  Object.values(obj).every(value => value === undefined) ? undefined : obj
