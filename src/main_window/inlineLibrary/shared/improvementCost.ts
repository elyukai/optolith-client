import { ImprovementCost } from "optolith-database-schema/types/_ImprovementCost"
import { fromRaw, toString } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { Translate } from "../../../shared/utils/translate.ts"
import { InlineLibraryProperty } from "../InlineLibraryProperties.tsx"

export const createImprovementCost = (
  translate: Translate,
  improvementCost: ImprovementCost,
): InlineLibraryProperty => ({
  label: translate("Improvement Cost"),
  value: toString(fromRaw(improvementCost)),
})
