import { TargetCategory } from "optolith-database-schema/types/_ActivatableSkillTargetCategory"
import { mapNullable } from "../../../utils/nullable.ts"
import { Translate, TranslateMap } from "../../../utils/translate.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { GetById } from "../../getTypes.ts"
import { LibraryEntryContent } from "../../libraryEntry.ts"
import { MISSING_VALUE } from "../unknown.ts"
import { appendInParens } from "./parensIf.ts"

/**
 * Get the text for the target category.
 */
export const getTextForTargetCategory = (
  deps: {
    translate: Translate
    translateMap: TranslateMap
    getTargetCategoryById: GetById.Static.TargetCategory
  },
  values: TargetCategory,
): LibraryEntryContent => ({
  label: deps.translate("Target Category"),
  value:
    values.length === 0
      ? deps.translate("all")
      : values
          .map(({ id, translations }) => {
            const mainName = (() => {
              switch (id.tag) {
                case "Self":
                  return deps.translate("Self")
                case "Zone":
                  return deps.translate("Zone")
                case "LiturgicalChantsAndCeremonies":
                  return deps.translate("Liturgical Chants and Ceremonies")
                case "Cantrips":
                  return deps.translate("Cantrips")
                case "Predefined": {
                  const numericId = id.predefined.id.target_category
                  const specificTargetCategory = deps.getTargetCategoryById(numericId)
                  return (
                    mapNullable(
                      deps.translateMap(specificTargetCategory?.translations),
                      translation => translation.name,
                    ) ?? MISSING_VALUE
                  )
                }
                default:
                  return assertExhaustive(id)
              }
            })()

            return appendInParens(mainName, deps.translateMap(translations)?.note)
          })
          .join(", "),
})
