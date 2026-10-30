import type { AnyNonNullish } from "@elyukai/utils/nullable"

const ENUM_DISCRIMINATOR_KEY = "kind" as const
type ENUM_DISCRIMINATOR_KEY = typeof ENUM_DISCRIMINATOR_KEY

/**
 * Creates an enum case object.
 */
export const Case = (<T extends string, V>(type: T, value: V): Case<T, V> =>
  (value === undefined
    ? { [ENUM_DISCRIMINATOR_KEY]: type }
    : { [ENUM_DISCRIMINATOR_KEY]: type, [type]: value }) as Case<T, V>) as {
  <T extends string>(type: T): Case<T>
  <T extends string, V extends AnyNonNullish | null>(type: T, value: V): Case<T, V>
}

/**
 * Type representing an enum case object.
 */
export type Case<K extends string, T = undefined> = {
  [P in K]: T extends AnyNonNullish | null
    ? {
        [Key in ENUM_DISCRIMINATOR_KEY]: P
      } & {
        [Key in P]: Extract<T, AnyNonNullish | null>
      }
    : {
        [Key in ENUM_DISCRIMINATOR_KEY]: P
      }
}[K]

/**
 * Extracts the value from an enum case where all members of the enum have the same associated type.
 */
export const fromUniformCase = <E extends string, V>(caseObj: Case<E, V>) => {
  const kind = caseObj[ENUM_DISCRIMINATOR_KEY] as E
  return (caseObj as Record<E, V>)[kind] as V
}

/**
 * Checks two enum cases with primintive values for equality.
 */
export const equalsCase = <E extends string, V extends string | number>(
  a: Case<E, V>,
  b: Case<E, V>,
) =>
  a[ENUM_DISCRIMINATOR_KEY] === b[ENUM_DISCRIMINATOR_KEY] &&
  fromUniformCase(a) === fromUniformCase(b)

/**
 * Splits an enum case into its case name and value.
 */
export const splitCase = <E extends string, V>(caseObj: Case<E, V>): [E, V] => [
  caseObj[ENUM_DISCRIMINATOR_KEY],
  fromUniformCase(caseObj),
]
