export type GenericEnumType<A> = A[keyof A] extends string
                               ? string
                               : A[keyof A] extends number
                               ? number
                               : never

export type EnsureEnumType<A extends object> = A[keyof A] extends string
                                             ? A[keyof A]
                                             : A[keyof A] extends number
                                             ? A[keyof A]
                                             : never

export const isInEnum =
  <A extends object> (enum_values: A) => {
    const all_values = Object.values (enum_values)

    return (x: GenericEnumType<A>): x is EnsureEnumType<A> => all_values .includes (x)
  }

export type EnsureStrEnumType<A extends object> = A[keyof A] extends string ? A[keyof A] : never

export const isInStrEnum =
  <A extends object> (enum_values: A) => {
    const all_values = Object.values (enum_values)

    return (x: string): x is EnsureStrEnumType<A> => all_values .includes (x)
  }

export type EnsureNumEnumType<A extends object> = A[keyof A] extends number ? A[keyof A] : never

export const isInNumEnum =
  <A extends object> (enum_values: A) => {
    const all_values = Object.values (enum_values)

    return (x: number): x is EnsureNumEnumType<A> => all_values .includes (x)
  }
