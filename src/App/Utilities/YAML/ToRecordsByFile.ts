/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { Either } from "../../../Data/Either"
import { OrderedMap } from "../../../Data/OrderedMap"
import { Record, RecordIBase } from "../../../Data/Record"
import { YamlNameMap } from "./SchemaMap"


/**
 * Takes the map of all loaded data and either returns a generated `OrderedMap`
 * from the data used in the function or returns a list of errors that happened
 * while trying to generate the `OrderedMap`.
 */
export type YamlFileConverter<K, V>
  = (yamlMap : YamlNameMap) => Either<Error[], OrderedMap<K, V>>


/**
 * Convert a pair of matching objects from the YAML files into a key-value pair
 * where the key is the ID of the object and the value is the actual object.
 */
export type YamlPairConverter<U, L, K, R extends RecordIBase<any>>
  = (x : [U, L]) => [K, Record<R>]


/**
 * Convert a pair of matching objects from the YAML files into a `Right` with
 * key-value pair where the key is the ID of the object and the value is the
 * actual object. If at least one error happens in this function, a `Left` with
 * a list of all errors is returned instead.
 */
export type YamlPairConverterE<U, L, K, R extends RecordIBase<any>>
  = (x : [U, L]) => Either<Error[], [K, Record<R>]>
