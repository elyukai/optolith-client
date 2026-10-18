import type { Debugger } from "debug"

export const runAsync =
  <T extends unknown[]>(debug: Debugger, fn: (...args: T) => Promise<void>) =>
  (...args: T) => {
    fn(...args).catch(err => debug("unexpected error: %O", err))
  }
