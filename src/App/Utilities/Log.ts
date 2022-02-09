export const log = <T>(x: T, f: (x: T) => void = console.log): T => (f (x), x)
