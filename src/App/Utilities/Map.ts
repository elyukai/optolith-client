import { Just, Maybe, Nothing } from "./Maybe"

declare global {
  interface Map<K, V> {
    lookup(key: K): Maybe<V>
    insert(key: K, value: V): Map<K, V>
    insertWith(key: K, value: V, join: (oldValue: V, newValue: V) => V): Map<K, V>
    deleteAt(key: K): Map<K, V>
    adjust(key: K, transform: (value: V) => V): Map<K, V>
    alter(key: K, transform: (value: Maybe<V>) => Maybe<V>): Map<K, V>
  }

  interface ReadonlyMap<K, V> {
    lookup(key: K): Maybe<V>
    insert(key: K, value: V): ReadonlyMap<K, V>
    insertWith(key: K, value: V, join: (oldValue: V, newValue: V) => V): ReadonlyMap<K, V>
    deleteAt(key: K): ReadonlyMap<K, V>
    adjust(key: K, transform: (value: V) => V): ReadonlyMap<K, V>
    alter(key: K, transform: (value: Maybe<V>) => Maybe<V>): ReadonlyMap<K, V>
  }
}

Map.prototype.lookup = function lookup<K, V> (this: Map<K, V>, key: K): Maybe<V> {
  return this.has (key) ? Just (this.get (key)!) : Nothing
}

Map.prototype.insert = function insert<K, V> (this: Map<K, V>, key: K, value: V): Map<K, V> {
  return new Map (this).set (key, value)
}

Map.prototype.insertWith = function insertWith<K, V> (
  this: Map<K, V>,
  key: K,
  value: V,
  join: (oldValue: V, newValue: V) => V
): Map<K, V> {
  if (this.has (key)) {
    return new Map (this).set (key, join (this.get (key)!, value))
  }
  else {
    return new Map (this).set (key, value)
  }
}

Map.prototype.deleteAt = function deleteAt<K, V> (this: Map<K, V>, key: K): Map<K, V> {
  if (this.has (key)) {
    const mp = new Map (this)
    mp.delete (key)

    return mp
  }
  else {
    return this
  }
}

Map.prototype.adjust = function adjust<K, V> (
  this: Map<K, V>,
  key: K,
  transform: (value: V) => V,
): Map<K, V> {
  if (this.has (key)) {
    return new Map (this).set (key, transform (this.get (key)!))
  }
  else {
    return this
  }
}

Map.prototype.alter = function alter<K, V> (
  this: Map<K, V>,
  key: K,
  transform: (value: Maybe<V>) => Maybe<V>,
): Map<K, V> {
  const oldValue = this.lookup (key)
  const newValue = transform (oldValue)

  if (newValue.isJust) {
    return new Map (this).set (key, newValue.value)
  }
  else if (oldValue.isJust) {
    const mp = new Map (this)
    mp.delete (key)

    return mp
  }
  else {
    return this
  }
}

export { }
