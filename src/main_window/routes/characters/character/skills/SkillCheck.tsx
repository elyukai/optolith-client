import { toCamelCase } from "@elyukai/utils/string"
import { minus } from "@elyukai/utils/string/number"
import type { SkillCheck as SKillCheckType } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"

type Props = {
  check: SKillCheckType
  checkPenalty?: string
}

/**
 * Displays a skill check in an interactive list.
 */
export const SkillCheck: FC<Props> = observer(props => {
  const { check, checkPenalty } = props

  const translateMap = useTranslateMap()
  const { attributes } = useCharacterState()

  return (
    <>
      {check.map((id, index) => {
        const entry = attributes.find(a => a.id === id)

        if (entry === undefined) {
          return null
        }

        return (
          <div
            key={`${id}-${index + 1}`}
            className={`check attr--${toCamelCase(entry.color.kind)}`}
          >
            <span className="short">{translateMap(entry.translations)?.abbreviation ?? "??"}</span>
            <span className="value">{entry.value}</span>
          </div>
        )
      })}
      {checkPenalty === undefined ? null : (
        <div>
          {minus}
          {checkPenalty}
        </div>
      )}
    </>
  )
})
