import {
  SkillCheckPenalty,
  SkillCheck as SkillCheckType,
} from "optolith-database-schema/types/_SkillCheck"
import { FC } from "react"
import { DerivedCharacteristicIdentifier as DCId } from "../../../../../shared/domain/identifier.ts"
import { getDisplayedSkillCheck } from "../../../../../shared/domain/skillCheck.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { minus } from "../../../../../shared/utils/math.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { selectAttributes as selectDynamicAttributes } from "../../../../slices/characterSlice.ts"
import {
  selectDerivedCharacteristics,
  selectGetAttribute,
} from "../../../../slices/databaseSlice.ts"

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
  const getStaticAttribute = useAppSelector(selectGetAttribute)
  const dynamicAttributes = useAppSelector(selectDynamicAttributes)
  const derivedCharacteristics = useAppSelector(selectDerivedCharacteristics)
  const spirit = derivedCharacteristics[DCId.Spirit]
  const toughness = derivedCharacteristics[DCId.Toughness]
  const spi = translateMap(spirit?.translations)?.abbreviation ?? "?"
  const tou = translateMap(toughness?.translations)?.abbreviation ?? "?"

  return (
    <>
      {getDisplayedSkillCheck(getStaticAttribute, id => dynamicAttributes[id], check).map(
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
        <div className="check mod">
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
