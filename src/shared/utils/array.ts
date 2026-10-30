import { isNotEmpty, type NonEmptyArray } from "@elyukai/utils/array/nonEmpty"

export const randomFromNonEmptyArray = <T>(array: NonEmptyArray<T>): T =>
  array.length === 1 ? array[0] : (array[Math.floor(Math.random() * array.length)] as T)

export const randomFromArray = <T>(array: T[]): T | undefined =>
  isNotEmpty(array) ? randomFromNonEmptyArray(array) : undefined
