import { ProfessionName } from "optolith-database-schema/types/Profession"
import { Sex } from "../../main_window/slices/characterSlice.ts"
import { Nullish } from "../utils/nullable.ts"
import { assertExhaustive } from "../utils/typeSafety.ts"

export const professionNameToString = <T extends ProfessionName | undefined>(
  sex: Sex,
  professionName: T
): string | Nullish<T> => {
  if (professionName === undefined || typeof professionName === "string") {
    return professionName as string | Nullish<T>
  }
  else {
    switch (sex.type) {
      case "Male": return professionName.male
      case "Female": return professionName.female
      case "BalThani":
      case "Tsajana":
      case "Custom": return professionName.default
      default: return assertExhaustive(sex)
    }
  }
}
