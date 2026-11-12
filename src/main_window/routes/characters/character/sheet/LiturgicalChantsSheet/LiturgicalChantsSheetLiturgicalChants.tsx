import { replicateWithIndex } from "@elyukai/utils/array/build"
import { on } from "@elyukai/utils/function"
import { mapNullable } from "@elyukai/utils/nullable"
import { minus } from "@elyukai/utils/string/number"
import { parensIf } from "@optolith/entity-descriptions/entities/partial/rated/activatable/parensIf"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { DisplayedActiveLiturgicalChant } from "../../../../../../shared/domain/rated/liturgicalChant.ts"
import { useLocaleCompare } from "../../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import { useInlineLibrarySelect } from "../../../../../hooks/inlineLibrary.ts"
import { useAppSelector } from "../../../../../hooks/redux.ts"
import { selectSheetCheckAttributeValueVisibility } from "../../../../../slices/settingsSlice.ts"
import "../SpellsLiturgicalChants.css"

export const LiturgicalChantsSheetLiturgicalChants: FC = observer(
  function LiturgicalChantsSheetLiturgicalChants() {
    const translate = useTranslate()
    const localeCompare = useLocaleCompare()
    const useCheckAttributeValues = useAppSelector(selectSheetCheckAttributeValueVisibility)
    const { attributes, activeLiturgicalChants, activeCeremonies } = useCharacterState()
    const displayInlineLibraryEntry = useInlineLibrarySelect()

    const visibleLiturgicalChants: DisplayedActiveLiturgicalChant[] = [
      ...activeLiturgicalChants,
      ...activeCeremonies,
    ].sort(on(c => c.name, localeCompare))

    return (
      <>
        <h3>{translate("Liturgical Chants & Ceremonies")}</h3>
        <table className="liturgical-chants">
          <thead>
            <tr>
              <th className="name">{translate("Liturgical Chant")}</th>
              <th className="check">{translate("Check")}</th>
              <th className="value">{translate("SR")}</th>
              <th className="cost">{translate("KP Cost")}</th>
              <th className="cast-time">{translate("Liturgical Time")}</th>
              <th className="range">{translate("Range")}</th>
              <th className="duration">{translate("Duration")}</th>
              <th className="aspect">{translate("Aspect")}</th>
              <th className="ic">{translate("IC")}</th>
              <th className="effect">{translate("Effect")}</th>
            </tr>
          </thead>
          <tbody>
            {visibleLiturgicalChants.map(lc => (
              <tr key={lc.id}>
                <td className="name">
                  <span
                    className="has-sheet-inline-info"
                    onClick={() => displayInlineLibraryEntry(lc.type, lc.id)}
                  >
                    {lc.name}
                  </span>
                </td>
                <td className="check">
                  {lc.check
                    .map(
                      checkAttr =>
                        attributes.find(attr => attr.id === checkAttr)?.[
                          useCheckAttributeValues ? "value" : "abbreviation"
                        ],
                    )
                    .join("/") +
                    parensIf(mapNullable(lc.checkPenalty, penalty => `${minus}${penalty}`))}
                </td>
                <td className="value">{lc.value}</td>
                <td className="cost">{lc.parameters.cost}</td>
                <td className="cast-time">{lc.parameters.castingTime}</td>
                <td className="range">{lc.parameters.range}</td>
                <td className="duration">{lc.parameters.duration}</td>
                <td className="aspect">{lc.associatedText}</td>
                <td className="ic">{lc.improvementCost}</td>
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
              21 - visibleLiturgicalChants.length,
            )}
          </tbody>
        </table>
      </>
    )
  },
)
