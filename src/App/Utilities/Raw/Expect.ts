export const Expect = Object.freeze ({
  String: "String",
  NonEmptyString: "String (non-empty)",
  NaturalNumber: "Natural",
  Integer: "Int",
  Float: "Float",
  Rational: "Rational",
  Boolean: "Bool",
  Date: "Date",
  Maybe: (x: string) => `Maybe ${x}`,
  List: (x: string) => `[${x}]`,
  Array: (x: string) => `[${x}]`,
  NonEmptyList: (x: string) => `[${x}] { length > 0 }`,
  ListLength: (len: number) => (x: string) => `[${x}] { length = ${len} }`,
  ListLengthRange: (l: number) => (u: number) => (x: string) => `[${x}] { ${l} <= length <= ${u} }`,
  Pair: (x: string) => (y: string) => `(${x}, ${y})`,
  Union: (...xs: string[]) => xs .join (" | "),

  /** Group with `(` ...` )` */
  G: (x: string) => `(${x})`,
  Set: (x: string) => `Set ${x}`,
  Map: (k: string) => (x: string) => `Map ${k} ${x}`,
})
