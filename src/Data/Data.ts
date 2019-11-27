export interface Type<A extends TypeName> extends Object {
  readonly "@@type": A
}

export enum TypeName {
  Const = "Const",
  Identity = "Identity",
  Left = "Left",
  Right = "Right",
  List = "List",
  Just = "Just",
  Nothing = "Nothing",
  OrderedMap = "OrderedMap",
  OrderedSet = "OrderedSet",
  Record = "Record",
  Tuple = "Tuple",
  Queue = "Queue",
}

export interface TypeRep<A extends TypeName> {
  readonly "@@type": A
}
