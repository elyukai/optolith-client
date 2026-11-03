import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { GridItem } from "../../../../../shared/components/grid/GridItem.tsx"
import {
  maximumAdventurePointsForAdventagesAndDisadvantages,
  maximumAdventurePointsForBlessedAdventagesAndDisadvantages,
} from "../../../../../shared/domain/activatable/advantagesDisadvantages.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"

/**
 * Returns a sidebar widget for showing spent and available adventure points for
 * advantages or disadvantages.
 */
export const AdventurePointsSpent: FC = observer(() => {
  const translate = useTranslate()

  const {
    maximumAdventurePointsForMagicalAdvantagesAndDisadvantages:
      maximumForMagicalAdvantagesDisadvantages,
    adventurePointsStats: stats,
  } = useCharacterState()

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
