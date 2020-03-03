/**
 * Memoizes (only) the most recent parameter passed to the function.
 */
export const memoizeLast = <A, B> (f: (x: A) => B) => {
  let last: [A, B] | undefined = undefined

  return (x: A): B => {
    if (last !== undefined && last[0] === x) {
      return last[1]
    }

    const new_last = f (x)

    last = [ x, new_last ]

    return new_last
  }
}
