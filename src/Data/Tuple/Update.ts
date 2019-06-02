import { Tuple } from "../Tuple";

/**
 * `upd1 :: b -> (a1, ...) -> (b, ...)`
 *
 * `upd1 x t` sets the first element of the tuple `t` to `x`.
 */
export const upd1 =
  <B> (new_value: B) =>
  // @ts-ignore
  <A extends any[]> (x: Tuple<A>): Tuple<ChangeAtIndex<A, B, "0">> =>
    upd ("upd1") (new_value) (x) (0 as FilterNumber<keyof A>) as any

/**
 * `upd2 :: b -> (a1, a2, ...) -> (a1, b, ...)`
 *
 * `upd2 x t` sets the second element of the tuple `t` to `x`.
 */
export const upd2 =
  <B> (new_value: B) =>
  // @ts-ignore
  <A extends any[]> (x: Tuple<A>): Tuple<ChangeAtIndex<A, B, "1">> =>
    upd ("upd1") (new_value) (x) (1 as FilterNumber<keyof A>) as any

/**
 * `upd3 :: b -> (a1, a2, a3, ...) -> (a1, a2, b, ...)`
 *
 * `upd3 x t` sets the third element of the tuple `t` to `x`.
 */
export const upd3 =
  <B> (new_value: B) =>
  // @ts-ignore
  <A extends any[]> (x: Tuple<A>): Tuple<ChangeAtIndex<A, B, "2">> =>
    upd ("upd1") (new_value) (x) (2 as FilterNumber<keyof A>) as any

/**
 * `upd4 :: b -> (a1, a2, a3, a4, ...) -> (a1, a2, a3, b, ...)`
 *
 * `upd4 x t` sets the 4th element of the tuple `t` to `x`.
 */
export const upd4 =
  <B> (new_value: B) =>
  // @ts-ignore
  <A extends any[]> (x: Tuple<A>): Tuple<ChangeAtIndex<A, B, "3">> =>
    upd ("upd1") (new_value) (x) (3 as FilterNumber<keyof A>) as any

type ChangeAtIndex<A, B, I extends keyof A> = {
  [K in keyof A]: K extends I ? B : A[K]
}

type FilterNumber<A> = Extract<A, number>

const upd =
  (fname: string) =>
  <B>
  (new_value: B) =>
  <A extends any[]>
  (x: Tuple<A>) =>
  <I extends FilterNumber<keyof A>>
  (i: I): Tuple<ChangeAtIndex<A, B, I>> => {
    if (i > x .length - 1 || i < 0) {
      throw new TypeError (
        `${fname}: Tuple is of length ${x .length}, but you tried to access a `
        + `value at position ${i}.`
      )
    }

    const arr: A = Array.from ({ ...x.values, length: x.length }) as A

    arr [i as number] = new_value

    return Tuple (...arr) as Tuple<ChangeAtIndex<A, B, I>>
  }
