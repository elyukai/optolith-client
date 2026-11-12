import { on } from "@elyukai/utils/function"
import { MISSING_VALUE } from "@optolith/entity-descriptions/entities/partial/unknown"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { DisplayedCombatTechnique } from "../../../../../../shared/domain/rated/combatTechnique.ts"
import { useLocaleCompare } from "../../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../../shared/hooks/translateMap.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import { useInlineLibrarySelect } from "../../../../../hooks/inlineLibrary.ts"
import "./CombatSheetTechniques.css"

export const CombatSheetTechniques: FC = observer(function CombatSheetTechniques() {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()
  const { closeCombatTechniques, rangedCombatTechniques } = useCharacterState()
  const displayInlineLibraryEntry = useInlineLibrarySelect()

  const visibleCombatTechniques: DisplayedCombatTechnique[] = [
    ...closeCombatTechniques,
    ...rangedCombatTechniques,
  ].sort(on(c => c.name, localeCompare))

  return (
    <>
      <h3>{translate("Combat Techniques")}</h3>
      <table className="combat-techniques">
        <thead>
          <tr>
            <th className="name">{translate("Combat Technique")}</th>
            <th className="primary">{translate("Prim. Attr.")}</th>
            <th className="ic">{translate("IC")}</th>
            <th className="value">{translate("CTR")}</th>
            <th className="at">{translate("AT/RC")}</th>
            <th className="pa">{translate("PA")}</th>
          </tr>
        </thead>
        <tbody>
          {visibleCombatTechniques.map(ct => (
            <tr key={ct.id}>
              <td className="name">
                <span
                  className="has-sheet-inline-info"
                  onClick={() => displayInlineLibraryEntry(ct.type, ct.id)}
                >
                  {ct.name}
                </span>
              </td>
              <td className="primary">
                {ct.primaryAttributeValues
                  .map(pa => translateMap(pa.dbEntry.translations)?.abbreviation ?? MISSING_VALUE)
                  .join("/")}
              </td>
              <td className="ic">{ct.improvementCost}</td>
              <td className="value">{ct.value}</td>
              <td className="at">{ct.attackBase}</td>
              <td className="pa">{ct.parryBase ?? "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
})
