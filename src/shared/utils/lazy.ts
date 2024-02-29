import { assertExhaustive } from "./typeSafety.ts"

/**
 * A lazy value that is only evaluated when it is needed.
 */
export class Lazy<T> {
  private state: { kind: "unevaluated"; f: () => T } | { kind: "evaluated"; value: T }

  private constructor(f: () => T) {
    this.state = { kind: "unevaluated", f }
  }

  /**
   * Creates a new lazy value.
   */
  public static of<T>(f: () => T): Lazy<T> {
    return new Lazy(f)
  }

  /**
   * The value of the lazy value. If the value has not been evaluated
   * yet, it will be evaluated and cached.
   */
  get value(): T {
    switch (this.state.kind) {
      case "unevaluated": {
        this.state = { kind: "evaluated", value: this.state.f() }
        return this.state.value
      }
      case "evaluated":
        return this.state.value
      default:
        return assertExhaustive(this.state)
    }
  }
}
