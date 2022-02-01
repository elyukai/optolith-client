type TaggedTypes = { [tag: string]: object | null }

export type Tagged<A extends TaggedTypes> =
  { [K in keyof A]: Readonly<A[K] extends null ? { tag: K } : { tag: K } & A[K]> }[keyof A]

export type TaggedConstructors<A extends TaggedTypes> =
  { [K in keyof A]: A[K] extends null ? () => Tagged<A> : (values: A[K]) => Tagged<A> }

/**
 * @example
 * ```ts
 * type ExampleTypes = { Foo: { x: number }; Bar: null }
 *
 * export type Example = Tagged<ExampleTypes>
 *
 * // eslint-disable-next-line @typescript-eslint/no-redeclare
 * export const Example = MakeTagged<ExampleTypes> ({ Foo: "Foo", Bar: "Bar" })
 * ```
 */
export const MakeTagged = <A extends TaggedTypes> (
  constructorSet: { [K in keyof A]: K }
): TaggedConstructors<A> =>
    Object.fromEntries (
      (Object.entries (constructorSet) as { [K in keyof A]: [K, K] }[keyof A][])
        .map (([ tag ]) => [ tag, (values: A[typeof tag]) => ({ tag, ...values }) ])
    ) as {
      [K in keyof A]: (values?: A[keyof A]) => { tag: keyof A } & A[keyof A];
    } as TaggedConstructors<A>
