interface IfElse {
  <A, A1 extends A>
  (pred: (x: A) => x is A1):
  <B>
  (isTrue: (x: A1) => B) =>
  (isFalse: (x: Exclude<A, A1>) => B) =>
  (x: A) => B

  <A>
  (pred: (x: A) => boolean):
  <B>
  (isTrue: (x: A) => B) =>
  (isFalse: (x: A) => B) =>
  (x: A) => B
}

export const ifElse = (
  <A, B>
  (pred: (x: A) => boolean) =>
  (isTrue: (x: A) => B) =>
  (isFalse: (x: A) => B) =>
  (x: A): B =>
    pred (x) ? isTrue (x) : isFalse (x)
) as IfElse
