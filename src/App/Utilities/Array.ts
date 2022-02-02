declare global {
  interface Array<T> {
    drop(elements: number): T[]
    take(elements: number): T[]
    deleteAt(index: number): T[]
    maximum(this: number[]): number
    minimum(this: number[]): number
    append(element: T): T[]
  }

  interface ReadonlyArray<T> {
    drop(elements: number): readonly T[]
    take(elements: number): readonly T[]
    deleteAt(index: number): readonly T[]
    maximum(this: readonly number[]): number
    minimum(this: readonly number[]): number
    append(element: T): readonly T[]
  }
}

Array.prototype.drop = function drop<T> (this: T[], elements: number): T[] {
  if (elements <= 0) {
    return this
  }
  else if (elements >= this.length) {
    return []
  }
  else {
    return this.slice (elements)
  }
}

Array.prototype.take = function take<T> (this: T[], elements: number): T[] {
  if (elements <= 0) {
    return []
  }
  else if (elements >= this.length) {
    return this
  }
  else {
    return this.slice (0, elements)
  }
}

Array.prototype.deleteAt = function deleteAt<T> (this: T[], index: number): T[] {
  if (index < 0 || index >= this.length) {
    return this
  }
  else {
    return this.filter ((_, i) => i !== index)
  }
}

Array.prototype.maximum = function maximum (this: number[]): number {
  return this.reduce ((acc, x) => x > acc ? x : acc, -Infinity)
}

Array.prototype.minimum = function minimum (this: number[]): number {
  return this.reduce ((acc, x) => x < acc ? x : acc, Infinity)
}

Array.prototype.append = function append<T> (element: T): T[] {
  return this.concat (element)
}

export { }
