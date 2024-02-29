import { FC } from "react"
import { GridItem } from "../../../../../shared/components/grid/GridItem.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import {
  selectAdventurePointsSpentOnAdvantages,
  selectAdventurePointsSpentOnBlessedAdvantages,
  selectAdventurePointsSpentOnBlessedDisadvantages,
  selectAdventurePointsSpentOnDisadvantages,
  selectAdventurePointsSpentOnMagicalAdvantages,
  selectAdventurePointsSpentOnMagicalDisadvantages,
} from "../../../../selectors/adventurePointSelectors.ts"
import { selectMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages } from "../../../../selectors/traditionSelectors.ts"

/**
 * Returns a sidebar widget for showing spent and available adventure points for
 * advantages or disadvantages.
 */
export const AdventurePointsSpent: FC = () => {
  const translate = useTranslate()

  const maximumForMagicalAdvantagesDisadvantages = useAppSelector(
    selectMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages,
  )

  const spentOnAdvantages = useAppSelector(selectAdventurePointsSpentOnAdvantages)
  const spentOnBlessedAdvantages = useAppSelector(selectAdventurePointsSpentOnBlessedAdvantages)
  const spentOnMagicalAdvantages = useAppSelector(selectAdventurePointsSpentOnMagicalAdvantages)
  const spentOnDisadvantages = useAppSelector(selectAdventurePointsSpentOnDisadvantages)
  const spentOnBlessedDisadvantages = useAppSelector(
    selectAdventurePointsSpentOnBlessedDisadvantages,
  )
  const spentOnMagicalDisadvantages = useAppSelector(
    selectAdventurePointsSpentOnMagicalDisadvantages,
  )

  return (
    <GridItem>
      <p>
        {translate(
          "{0}/{1} AP spent on advantages",
          spentOnAdvantages.general + spentOnAdvantages.bound,
          80,
        )}
        {spentOnMagicalAdvantages.general + spentOnMagicalAdvantages.bound > 0 ? (
          <>
            <br />
            {translate(
              "Thereof {0}/{1} on magic advantages",
              spentOnMagicalAdvantages.general + spentOnMagicalAdvantages.bound,
              maximumForMagicalAdvantagesDisadvantages,
            )}
          </>
        ) : null}
        {spentOnBlessedAdvantages.general + spentOnBlessedAdvantages.bound > 0 ? (
          <>
            <br />
            {translate(
              "Thereof {0}/{1} on blessed advantages",
              spentOnBlessedAdvantages.general + spentOnBlessedAdvantages.bound,
              50,
            )}
          </>
        ) : null}
      </p>
      <p>
        {translate(
          "{0}/{1} AP received from disadvantages",
          Math.abs(spentOnDisadvantages.general + spentOnDisadvantages.bound),
          80,
        )}
        {spentOnMagicalDisadvantages.general + spentOnMagicalDisadvantages.bound < 0 ? (
          <>
            <br />
            {translate(
              "Thereof {0}/{1} from magic disadvantages",
              Math.abs(spentOnMagicalDisadvantages.general + spentOnMagicalDisadvantages.bound),
              maximumForMagicalAdvantagesDisadvantages,
            )}
          </>
        ) : null}
        {spentOnBlessedDisadvantages.general + spentOnBlessedDisadvantages.bound < 0 ? (
          <>
            <br />
            {translate(
              "Thereof {0}/{1} from blessed disadvantages",
              Math.abs(spentOnBlessedDisadvantages.general + spentOnBlessedDisadvantages.bound),
              50,
            )}
          </>
        ) : null}
      </p>
    </GridItem>
  )
}
