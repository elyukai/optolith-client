import {
  CheckResultArithmetic,
  CheckResultBased,
  CheckResultValue,
} from "optolith-database-schema/types/_ActivatableSkillCheckResultBased"
import { mapNullableDefault } from "../../../utils/nullable.ts"
import { Translate } from "../../../utils/translate.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"

const getCheckResultBaseValue = (baseValue: CheckResultValue, translate: Translate) => {
  switch (baseValue) {
    case "QualityLevels":
      return translate("QL")
    case "SkillPoints":
      return translate("SP")
    default:
      return assertExhaustive(baseValue)
  }
}

const getArithmeticSymbol = (arithmetic: CheckResultArithmetic) => {
  switch (arithmetic) {
    case "Divide":
      return ` / `
    case "Multiply":
      return ` × `
    default:
      return assertExhaustive(arithmetic)
  }
}

/**
 * Returns the value text for a check-result-based parameter of an activatable
 * skill.
 */
export const getTextForCheckResultBased = (value: CheckResultBased, translate: Translate): string =>
  getCheckResultBaseValue(value.base, translate) +
  mapNullableDefault(
    value.modifier,
    modifier => getArithmeticSymbol(modifier.arithmetic) + modifier.value,
    "",
  )
