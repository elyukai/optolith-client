/**
 * From `T`, pick only the keys which values extend type `U`.
 */
export type PickOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T]
