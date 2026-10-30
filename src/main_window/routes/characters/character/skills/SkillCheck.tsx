import { toCamelCase } from "@elyukai/utils/string"
import { minus } from "@elyukai/utils/string/number"
import type { SkillCheck as SKillCheckType } from "@optolith/database-schema/gen"
import type { FC } from "react"
import type { DisplayedAttribute } from "../../../../../shared/domain/rated/attribute.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"

type Props = {
  check: SKillCheckType
  checkPenalty?: string
  attributes: DisplayedAttribute[]
}

/**
 * Displays a skill check in an interactive list.
 */
export const SkillCheck: FC<Props> = props => {
  const { check, checkPenalty, attributes } = props

  const translateMap = useTranslateMap()

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
}
