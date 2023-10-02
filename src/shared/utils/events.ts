/**
 * A map of event names to their arguments.
 */
export type TypedEvents = {
  [key: string]: unknown[]
}

/**
 * A typed event emitter.
 */
export type TypedEventEmitter<Events extends TypedEvents> = {
  on: <E extends keyof Events>(eventName: E, listener: (...args: Events[E]) => void) => void
  emit: <E extends keyof Events>(eventName: E, ...args: Events[E]) => void
  removeListener: <E extends keyof Events>(
    eventName: E,
    listener: (...args: Events[E]) => void,
  ) => void
}
