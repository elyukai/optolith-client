import { observer } from "mobx-react"
import { FC } from "react"
import { GridItem } from "../../../../../shared/components/grid/GridItem.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { SharedState } from "../../../../external.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { selectMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages } from "../../../../selectors/traditionSelectors.ts"

/**
 * Returns a sidebar widget for showing spent and available adventure points for
 * advantages or disadvantages.
 */
export const AdventurePointsSpent: FC = observer(() => {
  const translate = useTranslate()

  const maximumAdventurePointsForAdventagesAndDisadvantages = 80
  const maximumForMagicalAdvantagesDisadvantages = useAppSelector(
    selectMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages,
  )
  const maximumAdventurePointsForBlessedAdventagesAndDisadvantages = 50

  const stats = SharedState.adventurePointsStats

  return (
    <GridItem>
      <p>
        {translate("{$value}/{$max} AP spent on advantages", {
          value: stats.spentOnAdvantages.toFixed(),
          max: maximumAdventurePointsForAdventagesAndDisadvantages.toFixed(),
        })}
        {stats.spentOnMagicalAdvantages > 0 ? (
          <>
            <br />
            {translate("Thereof {$value}/{$max} on magic advantages", {
              value: stats.spentOnMagicalAdvantages.toFixed(),
              max: maximumForMagicalAdvantagesDisadvantages.toFixed(),
            })}
          </>
        ) : null}
        {stats.spentOnBlessedAdvantages > 0 ? (
          <>
            <br />
            {translate("Thereof {$value}/{$max} on blessed advantages", {
              value: stats.spentOnBlessedAdvantages.toFixed(),
              max: maximumAdventurePointsForBlessedAdventagesAndDisadvantages.toFixed(),
            })}
          </>
        ) : null}
      </p>
      <p>
        {translate("{$value}/{$max} AP received from disadvantages", {
          value: stats.spentOnDisadvantages.toFixed(),
          max: maximumAdventurePointsForAdventagesAndDisadvantages.toFixed(),
        })}
        {stats.spentOnMagicalDisadvantages < 0 ? (
          <>
            <br />
            {translate("Thereof {$value}/{$max} from magic disadvantages", {
              value: Math.abs(stats.spentOnMagicalDisadvantages).toFixed(),
              max: maximumForMagicalAdvantagesDisadvantages.toFixed(),
            })}
          </>
        ) : null}
        {stats.spentOnBlessedDisadvantages < 0 ? (
          <>
            <br />
            {translate("Thereof {$value}/{$max} from blessed disadvantages", {
              value: Math.abs(stats.spentOnBlessedDisadvantages).toFixed(),
              max: maximumAdventurePointsForBlessedAdventagesAndDisadvantages.toFixed(),
            })}
          </>
        ) : null}
      </p>
    </GridItem>
  )
})
