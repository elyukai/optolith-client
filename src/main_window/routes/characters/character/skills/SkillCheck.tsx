import { toCamelCase } from "@elyukai/utils/string"
import { SkillCheckPenalty } from "@optolith/database-schema/gen"
import { FC } from "react"
import { DerivedCharacteristicIdentifier as DCId } from "../../../../../shared/domain/identifier.ts"
import type { DisplayedSkill } from "../../../../../shared/domain/rated/skill.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { classList } from "../../../../../shared/utils/classList.ts"
import { minus } from "../../../../../shared/utils/math.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { selectStaticDerivedCharacteristics } from "../../../../slices/databaseSlice.ts"

type Props = {
  check: DisplayedSkill["skillCheckValues"]
  checkPenalty?: SkillCheckPenalty
}

/**
 * Displays a skill check in an interactive list.
 */
export const SkillCheck: FC<Props> = props => {
  const { check, checkPenalty } = props

  const translateMap = useTranslateMap()
  const derivedCharacteristics = useAppSelector(selectStaticDerivedCharacteristics)
  const spirit = derivedCharacteristics[DCId.Spirit]
  const toughness = derivedCharacteristics[DCId.Toughness]
  const spi = translateMap(spirit?.translations)?.abbreviation ?? "?"
  const tou = translateMap(toughness?.translations)?.abbreviation ?? "?"

  return (
    <>
      {check.map(({ id, value, dbEntry }, index) => (
        <div
          key={`${id}-${index + 1}`}
          className={`check attr--${toCamelCase(dbEntry.color.kind)}`}
        >
          <span className="short">{translateMap(dbEntry.translations)?.abbreviation ?? "??"}</span>
          <span className="value">{value}</span>
        </div>
      ))}
      {checkPenalty === undefined ? null : (
        <div
          className={classList("check", "mod", {
            "mod--spi-2": checkPenalty === "HalfOfSpirit",
            "mod--spi-tou": checkPenalty === "HigherOfSpiritAndToughness",
          })}
        >
          {minus}
          {((): string => {
            switch (checkPenalty.kind) {
              case "DerivedCharacteristic":
                return spi
              case "Spirit":
                return spi
              case "HalfOfSpirit":
                return `${spi}/2`
              case "Toughness":
                return tou
              case "HigherOfSpiritAndToughness":
                return `${spi}/${tou}`
              case "SummoningDifficulty":
                return "X"
              case "CreationDifficulty":
                return "X"
              case "Object":
                return "X"
              default:
                return assertExhaustive(checkPenalty)
            }
          })()}
        </div>
      )}
    </>
  )
}
