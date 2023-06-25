import { SkillCheckPenalty, SkillCheck as SkillCheckType } from "optolith-database-schema/types/_SkillCheck"
import { FC } from "react"
import { DerivedCharacteristicIdentifier as DCId } from "../../../../../shared/domain/identifier.ts"
import { getDisplayedSkillCheck } from "../../../../../shared/domain/skillCheck.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { minus } from "../../../../../shared/utils/math.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { selectAttributes as selectDynamicAttributes } from "../../../../slices/characterSlice.ts"
import { selectDerivedCharacteristics, selectAttributes as selectStaticAttributes } from "../../../../slices/databaseSlice.ts"

type Props = {
  check: SkillCheckType
  checkPenalty?: SkillCheckPenalty
}

export const SkillCheck: FC<Props> = props => {
  const {
    check,
    checkPenalty,
  } = props

  const translateMap = useTranslateMap()
  const staticAttributes = useAppSelector(selectStaticAttributes)
  const dynamicAttributes = useAppSelector(selectDynamicAttributes)
  const derivedCharacteristics = useAppSelector(selectDerivedCharacteristics)
  const spirit = derivedCharacteristics[DCId.Spirit]
  const toughness = derivedCharacteristics[DCId.Toughness]
  const spi = translateMap(spirit?.translations)?.abbreviation ?? "?"
  const tou = translateMap(toughness?.translations)?.abbreviation ?? "?"

  return (
    <>
      {getDisplayedSkillCheck(staticAttributes, dynamicAttributes, check).map(
        ({ attribute, value }, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`${attribute.id}${index}`} className={`check attr--${attribute.id}`}>
            <span className="short">
              {translateMap(attribute.translations)?.abbreviation ?? "??"}
            </span>
            <span className="value">
              {value}
            </span>
          </div>
        )
      )}
      {checkPenalty === undefined
        ? null
        : (
          <div className="check mod">
            {minus}
            {((): string => {
              switch (checkPenalty) {
                case "Spirit":                     return spi
                case "HalfOfSpirit":               return `${spi}/2`
                case "Toughness":                  return tou
                case "HigherOfSpiritAndToughness": return `${spi}/${tou}`
                case "SummoningDifficulty":        return "X"
                case "CreationDifficulty":         return "X"
                default: return assertExhaustive(checkPenalty)
              }
            })()}
          </div>
        )}
    </>
  )
}
