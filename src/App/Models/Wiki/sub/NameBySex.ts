import { assertNever } from "../../../Utilities/Variant"
import { Sex } from "../../Hero.gen"
import { NameBySex, ProfessionName } from "../../Profession.gen"

export { NameBySex }

export const nameBySex =
  (sex: Sex) => (name: NameBySex): string => {
    switch (sex) {
      case "Female":
        return name.f
      case "Male":
        return name.m
      default:
        return assertNever (sex)
    }
  }

export const nameBySexDef =
  (sex: Sex) => (name: ProfessionName): string => {
    switch (name.tag) {
      case "Const":
        return name.value
      case "BySex":
        return nameBySex (sex) (name.value)
      default:
        return assertNever (name)
    }
  }
