/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */

const ICMap = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
} as const

export const icToInt : <A extends keyof typeof ICMap>(x : A) => (typeof ICMap)[A]
                     = x => ICMap [x]
