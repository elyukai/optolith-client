/**
 * Logs a value in the console and returns the value.
 *
 * Can be used as a functional wrapper for checking return values in a
 * functional environment.
 */
export const logIdentity = <T>(value: T): T => {
  console.log (value);

  return value;
};

/**
 * Logs a prefixed value in the console and returns the value.
 *
 * Can be used as a functional wrapper for checking return values in a
 * functional environment.
 */
export const logIdentityWithPrefix = (prefix: any) => <T>(value: T): T => {
  console.log (prefix, value);

  return value;
};
