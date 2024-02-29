/**
 * Maps all own properties of an object to a new object. Returning `undefined`
 * from the mapping function will omit the property from the result.
 */
export const mapObject = <T extends object, U>(
  object: T,
  map: (value: T[keyof T], key: keyof T) => U | undefined,
): { [key in keyof T]: Exclude<U, undefined> } => {
  const result: { [key in keyof T]: Exclude<U, undefined> } = {} as never

  for (const key in object) {
    if (Object.hasOwn(object, key)) {
      const newValue = map(object[key], key)
      if (newValue !== undefined) {
        result[key] = newValue as Exclude<U, undefined>
      }
    }
  }

  return result
}
