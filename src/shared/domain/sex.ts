import { BinarySex as RawBinarySex } from "optolith-database-schema/types/_Sex"
import { SexualCharacteristic } from "optolith-database-schema/types/prerequisites/single/SexualCharacteristicPrerequisite"
import { assertExhaustive } from "../utils/typeSafety.ts"

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

/**
 * Matches a binary sex from the database against the actual sex of the
 * character. It returns `true` if the actual sex either counts as the binary
 * sex by default or the user has chosen to, `false` otherwise.
 */
export const matchBinarySexToSex = (sex: Sex, binarySex: RawBinarySex): boolean => {
  switch (binarySex) {
    case "Male": {
      switch (sex.type) {
        case "Male":
          return true
        case "Female":
          return false
        case "BalThani":
        case "Tsajana":
        case "Custom":
          return sex.ruleBasedInterpretation.asMale
        default:
          return assertExhaustive(sex)
      }
    }
    case "Female": {
      switch (sex.type) {
        case "Male":
          return false
        case "Female":
          return true
        case "BalThani":
        case "Tsajana":
        case "Custom":
          return sex.ruleBasedInterpretation.asFemale
        default:
          return assertExhaustive(sex)
      }
    }
    default:
      return assertExhaustive(binarySex)
  }
}

/**
 * Matches a sexual characteristic from the database against the sex of the
 * character. It returns `true` if the actual sex either counts as having the
 * sexual characteristic by default or the user has chosen to, `false`
 * otherwise.
 */
export const matchSexualCharacteristicToSex = (
  sex: Sex,
  sexualCharacteristic: SexualCharacteristic,
): boolean => {
  switch (sexualCharacteristic) {
    case "Penis": {
      switch (sex.type) {
        case "Male":
          return true
        case "Female":
          return false
        case "BalThani":
        case "Tsajana":
        case "Custom":
          return sex.ruleBasedInterpretation.sexualCharacteristics.hasPenis
        default:
          return assertExhaustive(sex)
      }
    }
    case "Vagina": {
      switch (sex.type) {
        case "Male":
          return false
        case "Female":
          return true
        case "BalThani":
        case "Tsajana":
        case "Custom":
          return sex.ruleBasedInterpretation.sexualCharacteristics.hasVagina
        default:
          return assertExhaustive(sex)
      }
    }
    default:
      return assertExhaustive(sexualCharacteristic)
  }
}
