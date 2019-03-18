/**
 * This function returns `True` on `False` and vice versa.
 */
export const not = (bool: boolean) => !bool

/**
 * This function inverts the output of the passed predicate function.
 */
export const notP = <A> (f: (x: A) => boolean) => (x: A) => !f (x)
