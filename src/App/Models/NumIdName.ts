export interface NumIdName {
  id: number
  name: string
}

/**
 * Note: The id will always be 1 higher than the corresponding index.
 */
export const fromIndexName =
  (index: number) => (name: string): NumIdName => ({ id: index + 1, name })
