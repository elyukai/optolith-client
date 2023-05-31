export type TypedEventEmitterForEvent<E extends string | symbol, A extends any[]> = {
  on: (eventName: E, listener: (...args: A) => void) => void
  emit: (eventName: E, ...args: A) => void
  removeListener: (eventName: E, listener: (...args: A) => void) => void
}
