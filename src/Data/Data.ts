export interface DataStructure<a extends DataStructureType> extends Object {
  readonly "@@type": a
}

export enum DataStructureType {
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
}
