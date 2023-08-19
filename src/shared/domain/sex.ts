/**
 * The character's sex. It does not have to be binary, although it always must be specified how to handle it in the context of binary sex prerequisites. You can also provide a custom sex with a custom name.
 */
export type Sex = BinarySex | NonBinarySex | CustomSex

/**
 * A binary sex option.
 */
export type BinarySex = {
  type: "Male" | "Female"
}

/**
 * A non-binary sex option.
 */
export type NonBinarySex = {
  type: "BalThani" | "Tsajana"

  /**
   * Defines how a non-binary sex should be treated when checking prerequisites.
   */
  binaryHandling: BinaryHandling
}

/**
 * A custom non-binary sex option.
 */
export type CustomSex = {
  type: "Custom"

  /**
   * The custom sex name.
   */
  name: string

  /**
   * Defines how a non-binary sex should be treated when checking prerequisites.
   */
  binaryHandling: BinaryHandling
}

/**
 * Defines how a non-binary sex should be treated when checking prerequisites.
 */
export type BinaryHandling = {
  /**
   * Defines if the sex should be treated as male when checking prerequisites.
   */
  asMale: boolean

  /**
   * Defines if the sex should be treated as female when checking prerequisites.
   */
  asFemale: boolean
}
