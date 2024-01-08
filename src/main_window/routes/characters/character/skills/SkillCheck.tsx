import {
  SkillCheckPenalty,
  SkillCheck as SkillCheckType,
} from "optolith-database-schema/types/_SkillCheck"
import { FC } from "react"
import { DerivedCharacteristicIdentifier as DCId } from "../../../../../shared/domain/identifier.ts"
import { getDisplayedSkillCheck } from "../../../../../shared/domain/rated/skillCheck.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { classList } from "../../../../../shared/utils/classList.ts"
import { minus } from "../../../../../shared/utils/math.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { SelectGetById } from "../../../../selectors/basicCapabilitySelectors.ts"
import { selectStaticDerivedCharacteristics } from "../../../../slices/databaseSlice.ts"

type Props = {
  check: SkillCheckType
  checkPenalty?: SkillCheckPenalty
}

/**
 * Displays a skill check in an interactive list.
 */
export const SkillCheck: FC<Props> = props => {
  const { check, checkPenalty } = props

  const translateMap = useTranslateMap()
  const getStaticAttributeById = useAppSelector(SelectGetById.Static.Attribute)
  const getDynamicAttributeById = useAppSelector(SelectGetById.Dynamic.Attribute)
  const derivedCharacteristics = useAppSelector(selectStaticDerivedCharacteristics)
  const spirit = derivedCharacteristics[DCId.Spirit]
  const toughness = derivedCharacteristics[DCId.Toughness]
  const spi = translateMap(spirit?.translations)?.abbreviation ?? "?"
  const tou = translateMap(toughness?.translations)?.abbreviation ?? "?"

  return (
    <>
      {getDisplayedSkillCheck(getStaticAttributeById, getDynamicAttributeById, check).map(
        ({ attribute, value }, index) => (
          <div key={`${attribute.id}-${index + 1}`} className={`check attr--${attribute.id}`}>
            <span className="short">
              {translateMap(attribute.translations)?.abbreviation ?? "??"}
            </span>
            <span className="value">{value}</span>
          </div>
        ),
      )}
      {checkPenalty === undefined ? null : (
        <div
          className={classList("check", "mod", {
            "mod--spi-2": checkPenalty === "HalfOfSpirit",
            "mod--spi-tou": checkPenalty === "HigherOfSpiritAndToughness",
          })}
        >
          {minus}
          {((): string => {
            switch (checkPenalty) {
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
              default:
                return assertExhaustive(checkPenalty)
            }
          })()}
        </div>
      )}
    </>
  )
}
