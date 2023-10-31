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
  ruleBasedInterpretation: RuleBasedInterpretation
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
  ruleBasedInterpretation: RuleBasedInterpretation
}

/**
 * Defines how a non-binary sex should be treated when checking prerequisites.
 */
export type RuleBasedInterpretation = {
  /**
   * Defines if the sex should be treated as male when checking prerequisites.
   */
  asMale: boolean

  /**
   * Defines if the sex should be treated as female when checking prerequisites.
   */
  asFemale: boolean

  /**
   * Defines how a non-binary sex’s sexual characteristics should be treated
   * when checking prerequisites.
   */
  sexualCharacteristics: SexualCharacteristicsInterpretation
}

/**
 * Defines how a non-binary sex’s sexual characteristics should be treated when
 * checking prerequisites.
 */
export type SexualCharacteristicsInterpretation = {
  /**
   * Defines if the sex should be treated as having a penis when checking
   * prerequisites.
   */
  hasPenis: boolean

  /**
   * Defines if the sex should be treated as having a vagina when checking
   * prerequisites.
   */
  hasVagina: boolean
}
