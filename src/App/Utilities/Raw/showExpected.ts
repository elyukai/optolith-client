export const Expect = Object.freeze ({
  NonEmptyString: "String (non-empty)",
  NaturalNumber: "Natural",
  Integer: "Int",
  Boolean: "Bool",
  Maybe: (x: string) => `Maybe ${x}`,
  List: (x: string) => `[${x}]`,
  NonEmptyList: (x: string) => `[${x}] { length > 0 }`,
  ListLength: (len: number) => (x: string) => `[${x}] { length = ${len} }`,
  Pair: (x: string) => (y: string) => `(${x}, ${y})`,
  Union: (...xs: string[]) => xs .join (" | "),
  /** Group with `(` ...` )` */
  G: (x: string) => `(${x})`,
  Set: (x: string) => `Set ${x}`,
})
