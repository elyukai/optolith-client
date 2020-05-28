export interface IncreasableForView {
  id: number
  name: string
  value: number
  previous?: number
}

export const increasableViewFrom =
  (id: number) =>
  (value: number) =>
  (name: string): IncreasableForView =>
    ({
      id,
      name,
      value,
    })
