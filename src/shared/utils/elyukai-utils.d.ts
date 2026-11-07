import type { NonEmptyArray } from "@elyukai/utils/array/nonEmpty"

declare global {
  interface Array<T> {
    /**
     * Combines two or more arrays.
     * This method returns a new array without modifying any existing arrays.
     * @param items Additional arrays and/or items to add to the end of the array.
     */
    concat(this: NonEmptyArray<T>, ...items: ConcatArray<T>[]): NonEmptyArray<T>

    /**
     * Combines two or more arrays.
     * This method returns a new array without modifying any existing arrays.
     * @param items Additional arrays and/or items to add to the end of the array.
     */
    concat(this: NonEmptyArray<T>, ...items: (T | ConcatArray<T>)[]): NonEmptyArray<T>

    /**
     * Reverses the elements in an array in place.
     * This method mutates the array and returns a reference to the same array.
     */
    reverse(this: NonEmptyArray<T>): NonEmptyArray<T>

    /**
     * Returns a copy of an array with its elements reversed.
     */
    toReversed(this: NonEmptyArray<T>): NonEmptyArray<T>

    /**
     * Returns a copy of an array with its elements sorted.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order.
     * ```ts
     * [11, 2, 22, 1].toSorted((a, b) => a - b) // [1, 2, 11, 22]
     * ```
     */
    toSorted(this: NonEmptyArray<T>, compareFn?: (a: T, b: T) => number): NonEmptyArray<T>

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every<S extends T>(
      this: NonEmptyArray<T>,
      predicate: (value: T, index: number, array: T[]) => value is S,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thisArg?: any,
    ): this is NonEmptyArray<S>

    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map<U>(
      this: NonEmptyArray<T>,
      callbackfn: (value: T, index: number, array: T[]) => U,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thisArg?: any,
    ): NonEmptyArray<U>

    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     */
    reduce<U>(
      this: NonEmptyArray<T>,
      callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
    ): U

    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     */
    reduceRight<U>(
      this: NonEmptyArray<T>,
      callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
    ): U
  }
}
