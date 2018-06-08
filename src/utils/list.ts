// import R from 'ramda';
// import { Maybe } from './maybe';

// export class List<T> {
//   private readonly value: ReadonlyArray<T>;

//   constructor(initialList?: ReadonlyArray<T>) {
//     this.value = typeof initialList === 'object' ? initialList : [];
//   }

//   head(): Maybe<T> {
//     return Maybe.of(this.value[0]);
//   }

//   last(): Maybe<T> {
//     return Maybe.of(this.value[this.value.length - 1]);
//   }

//   tail(): Maybe<List<T>> {
//     const tail = this.value.slice(1);
//     return this.value.length > 1 ? Maybe.Just(List.of(tail)) : Maybe.Nothing();
//   }

//   init(): Maybe<List<T>> {
//     const init = this.value.slice(0, this.value.length - 2);
//     return this.value.length > 1 ? Maybe.Just(List.of(init)) : Maybe.Nothing();
//   }

//   null(): boolean {
//     return this.value.length === 0;
//   }

//   length(): number {
//     return this.value.length;
//   }

//   concat(add: List<T>): List<T> {
//     return List.of([...this.value, ...add.value]);
//   }

//   map<U>(fn: (x: T) => U): List<U> {
//     return List.of(this.value.map(fn));
//   }

//   any(fn: (x: T) => boolean): boolean {
//     return this.value.some(fn);
//   }

//   all(fn: (x: T) => boolean): boolean {
//     return this.value.every(fn);
//   }

//   sum(this: List<number>): number {
//     return this.value.reduce((acc, e) => acc + e, 0);
//   }

//   product(this: List<number>): number {
//     return this.value.reduce((acc, e) => acc * e, 0);
//   }

//   maximum(this: List<number>): number {
//     return Math.max(...this.value);
//   }

//   minimum(this: List<number>): number {
//     return Math.min(...this.value);
//   }

//   take(length: number): List<T> {
//     return List.of(this.value.slice(0, length - 1));
//   }

//   find<U extends T>(pred: (x: T) => x is U): Maybe<U>;
//   find(pred: (x: T) => boolean): Maybe<T>;
//   find(pred: (x: T) => boolean): Maybe<T> {
//     return Maybe.of(this.value.find(pred));
//   }

//   findIndex(pred: (x: T) => boolean): number {
//     return this.value.findIndex(pred);
//   }

//   add(index: number, e: T): List<T> {
//     return List.of([
//       ...this.value.slice(0, index),
//       e,
//       ...this.value.slice(index)
//     ]);
//   }

//   append(e: T): List<T> {
//     return List.of([...this.value, e]);
//   }

//   prepend(e: T): List<T> {
//     return List.of([e, ...this.value]);
//   }

//   delete(x: T): List<T> {
//     let isDeleted = false;
//     return List.of(this.value.filter(e => {
//       if (!isDeleted && R.equals(e, x)) {
//         isDeleted = true;
//         return false;
//       }
//       return true;
//     }));
//   }

//   update(index: number, e: T): List<T> {
//     return List.of(this.value.map((old, i) => i === index ? e : old));
//   }

//   updateFn(index: number, fn: (x: T) => T): List<T> {
//     return List.of(this.value.map((old, i) => i === index ? fn(old) : old));
//   }

//   reduce<U>(fn: (acc: U, x: T) => U, initial: U): U {
//     return this.value.reduce(fn, initial);
//   }

//   sortBy(fn: (a: T, b: T) => number): List<T> {
//     return List.of([...this.value].sort(fn));
//   }

//   static of<T>(list: ReadonlyArray<T>): List<T> {
//     return new List(list);
//   }

//   static head<T>(list: List<T>): Maybe<T> {
//     return list.head();
//   }

//   static last<T>(list: List<T>): Maybe<T> {
//     return list.last();
//   }

//   static tail<T>(list: List<T>): Maybe<List<T>> {
//     return list.tail();
//   }

//   static init<T>(list: List<T>): Maybe<List<T>> {
//     return list.init();
//   }

//   static null<T>(list: List<T>): boolean {
//     return list.null();
//   }

//   static getLength<T>(list: List<T>): number {
//     return list.length();
//   }

//   static concat<T>(list: List<T>, add: List<T>): List<T> {
//     return list.concat(add);
//   }

//   static map<T, U>(fn: (x: T) => U, list: List<T>): List<U> {
//     return list.map(fn);
//   }

//   static any<T>(fn: (x: T) => boolean, list: List<T>): boolean {
//     return list.any(fn);
//   }

//   static all<T>(fn: (x: T) => boolean, list: List<T>): boolean {
//     return list.all(fn);
//   }

//   static sum(list: List<number>): number {
//     return list.sum();
//   }

//   static product(list: List<number>): number {
//     return list.product();
//   }

//   static maximum(list: List<number>): number {
//     return list.maximum();
//   }

//   static minimum(list: List<number>): number {
//     return list.minimum();
//   }

//   static take<T>(length: number, list: List<T>): List<T> {
//     return list.take(length);
//   }

//   static find<T, U extends T>(pred: (x: T) => x is U, list: List<T>): Maybe<U>;
//   static find<T>(pred: (x: T) => boolean, list: List<T>): Maybe<T>;
//   static find<T>(pred: (x: T) => boolean, list: List<T>): Maybe<T> {
//     return list.find(pred);
//   }

//   static findIndex<T>(pred: (x: T) => boolean, list: List<T>): number {
//     return list.findIndex(pred);
//   }

//   static add<T>(index: number, e: T, list: List<T>): List<T> {
//     return list.add(index, e);
//   }

//   static append<T>(e: T, list: List<T>): List<T> {
//     return list.append(e);
//   }

//   static prepend<T>(e: T, list: List<T>): List<T> {
//     return list.prepend(e);
//   }

//   static delete<T>(x: T, list: List<T>): List<T> {
//     return list.delete(x);
//   }

//   static update<T>(index: number, e: T, list: List<T>): List<T> {
//     return list.update(index, e);
//   }

//   static updateFn<T>(index: number, fn: (x: T) => T, list: List<T>): List<T> {
//     return list.updateFn(index, fn);
//   }

//   static reduce<T, U>(fn: (acc: U, x: T) => U, initial: U, list: List<T>): U {
//     return list.reduce(fn, initial);
//   }

//   static sortBy<T>(fn: (a: T, b: T) => number, list: List<T>): List<T> {
//     return list.sortBy(fn);
//   }
// }
