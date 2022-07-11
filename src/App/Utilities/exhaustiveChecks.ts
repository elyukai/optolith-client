export const assertUnreachable = (x: never): never => {
  throw new Error (`The value "${x}" is either not part of the checked value or has not been checked for.`)
}
