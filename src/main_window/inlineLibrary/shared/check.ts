import { Attribute } from "optolith-database-schema/types/Attribute"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { Translate } from "../../../shared/utils/translate.ts"
import { TranslateMap } from "../../hooks/translateMap.ts"
import { InlineLibraryProperty } from "../InlineLibraryProperties.tsx"

export const createCheck = (
  translate: Translate,
  translateMap: TranslateMap,
  attributes: Record<number, Attribute>,
  check: SkillCheck,
): InlineLibraryProperty => ({
  label: translate("Check"),
  value:
    check
      .map(({ id: { attribute: id } }) =>
        translateMap(attributes[id]?.translations)?.abbreviation ?? "??")
      .join("/"),
})
