import { replicateWithIndex } from "@elyukai/utils/array/build"
import { classList } from "@elyukai/utils/classList"
import { on } from "@elyukai/utils/function"
import { mapNullable } from "@elyukai/utils/nullable"
import { minus } from "@elyukai/utils/string/number"
import { parensIf } from "@optolith/entity-descriptions/entities/partial/rated/activatable/parensIf"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { DisplayedActiveMagicalAction } from "../../../../../../shared/domain/rated/magicalActions.ts"
import type { DisplayedActiveSpellwork } from "../../../../../../shared/domain/rated/spell.ts"
import { useLocaleCompare } from "../../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import { useInlineLibrarySelect } from "../../../../../hooks/inlineLibrary.ts"
import { useAppSelector } from "../../../../../hooks/redux.ts"
import { selectSheetCheckAttributeValueVisibility } from "../../../../../slices/settingsSlice.ts"
import "../SpellsLiturgicalChants.css"

export const SpellsSheetSpells: FC = observer(function SpellsSheetSpells() {
  const translate = useTranslate()
  const localeCompare = useLocaleCompare()
  const { attributes, activeSpells, activeRituals, activeMagicalActions } = useCharacterState()
  const useCheckAttributeValues = useAppSelector(selectSheetCheckAttributeValueVisibility)
  const displayInlineLibraryEntry = useInlineLibrarySelect()

  const visibleSpells: (DisplayedActiveSpellwork | DisplayedActiveMagicalAction)[] = [
    ...activeSpells,
    ...activeRituals,
    ...activeMagicalActions,
  ].sort(on(c => c.name, localeCompare))

  return (
    <>
      <h3>{translate("Spells & Rituals")}</h3>
      <table className="spells">
        <thead>
          <tr>
            <th className="name">{translate("Spell/Ritual")}</th>
            <th className="check">{translate("Check")}</th>
            <th className="value">{translate("SR")}</th>
            <th className="cost">{translate("AE Cost")}</th>
            <th className="cast-time">{translate("Casting Time")}</th>
            <th className="range">{translate("Range")}</th>
            <th className="duration">{translate("Duration")}</th>
            <th className="property">{translate("Property")}</th>
            <th className="ic">{translate("IC")}</th>
            <th className="effect">{translate("Effect")}</th>
          </tr>
        </thead>
        <tbody>
          {visibleSpells.map(spell => (
            <tr key={spell.id}>
              <td className={classList("name", { unfamiliar: spell.isUnfamiliar })}>
                <span
                  className="has-sheet-inline-info"
                  onClick={() => displayInlineLibraryEntry(spell.type, spell.id)}
                >
                  {spell.name}
                  {spell.isUnfamiliar === true ? parensIf(translate("unfamiliar spell")) : null}
                </span>
              </td>
              <td className="check">
                {spell.check
                  .map(
                    checkAttr =>
                      attributes.find(attr => attr.id === checkAttr)?.[
                        useCheckAttributeValues ? "value" : "abbreviation"
                      ],
                  )
                  .join("/") +
                  parensIf(mapNullable(spell.checkPenalty, penalty => `${minus}${penalty}`))}
              </td>
              <td className="value">{spell.value}</td>
              <td className="cost">{spell.parameters.cost}</td>
              <td className="cast-time">{spell.parameters.castingTime ?? "—"}</td>
              <td className="range">{spell.parameters.range ?? "—"}</td>
              <td className="duration">{spell.parameters.duration ?? "—"}</td>
              <td className="property">{spell.associatedText}</td>
              <td className="ic">{spell.improvementCost}</td>
              <td className="effect" />
            </tr>
          ))}
          {replicateWithIndex(
            i => (
              <tr key={`undefined-${i}`}>
                <td className="name" />
                <td className="check" />
                <td className="value" />
                <td className="cost" />
                <td className="cast-time" />
                <td className="range" />
                <td className="duration" />
                <td className="aspect" />
                <td className="ic" />
                <td className="effect" />
              </tr>
            ),
            21 - visibleSpells.length,
          )}
        </tbody>
      </table>
    </>
  )
})
