// PROTOTYPE

interface TaggedPrototype {
  readonly isTagged: true
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const TaggedPrototype =
  Object.freeze<TaggedPrototype> ({
    isTagged: true,
  })


// CONSTRUCTOR

export interface Tagged<S, B> extends TaggedPrototype {
  readonly x: B

  /**
   * No actual field!
   */
  readonly phantom: S
}

/**
 * `Tagged :: b -> Tagged s b`
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Tagged =
  <S, B> (x: B): Tagged<S, B> =>
    Object.create (
      TaggedPrototype,
      {
        x: {
          value: x,
        },
      }
    )

export const unTagged = <B> (x: Tagged<any, B>): B => x .x


// CUSTOM FUNCTIONS

/**
 * `isTagged :: a -> Bool`
 *
 * The `isTagged` function returns `True` if its argument is a `Tagged`.
 */
export const isTagged =
  (x: any): x is Tagged<any, any> =>
    typeof x === "object" && x !== null && Object.getPrototypeOf (x) === TaggedPrototype
