export type V<T extends string, A> = { tag: T; value: A }

export const V = <T extends string, A>(tag: T, value: A): V<T, A> => ({ tag, value })

export const assertNever = (x: never): never => {
  throw new TypeError (`Expected a variant, but received ${x}`)
}
