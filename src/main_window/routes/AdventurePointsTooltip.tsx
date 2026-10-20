import { observer } from "mobx-react"
import { FC } from "react"
import {
  maximumAdventurePointsForAdventagesAndDisadvantages,
  maximumAdventurePointsForBlessedAdventagesAndDisadvantages,
} from "../../shared/domain/activatable/advantagesDisadvantages.ts"
import { useTranslate } from "../../shared/hooks/translate.ts"
import { SharedState } from "../external.ts"

/**
 * Returns the contents for the adventure points tooltip that displays which
 * entry groups adventure points were spent on.
 */
export const AdventurePointsTooltip: FC = observer(() => {
  const translate = useTranslate()

  const isSpellcaster = true // useAppSelector(selectIsSpellcaster)
  const isBlessedOne = true // useAppSelector(selectIsBlessedOne)
  const maximumForMagicalAdvantagesDisadvantages = 80 // useAppSelector(
  //   selectMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages,
  // )

  const stats = SharedState.adventurePointsStats

  return (
    <div className="ap-details">
      <h4>{translate("Adventure Points")}</h4>
      <p className="general">
        <span>{translate("{$value} Total AP", { value: stats.total.toFixed() })}</span>
        <span>{translate("{$value} AP Spent", { value: stats.spent.toFixed() })}</span>
      </p>
      <hr />
      <p>
        <span>
          {translate("{$value}/{$max} AP spent on advantages", {
            value: stats.spentOnAdvantages.toFixed(),
            max: maximumAdventurePointsForAdventagesAndDisadvantages.toFixed(),
          })}
        </span>
        <span>
          {stats.spentOnMagicalAdvantages > 0
            ? translate("Thereof {$value}/{$max} on magic advantages", {
                value: stats.spentOnMagicalAdvantages.toFixed(),
                max: maximumForMagicalAdvantagesDisadvantages.toFixed(),
              })
            : null}
        </span>
        <span>
          {stats.spentOnBlessedAdvantages > 0
            ? translate("Thereof {$value}/{$max} on blessed advantages", {
                value: stats.spentOnBlessedAdvantages.toFixed(),
                max: maximumAdventurePointsForBlessedAdventagesAndDisadvantages.toFixed(),
              })
            : null}
        </span>
        <span>
          {translate("{$value}/{$max} AP received from disadvantages", {
            value: stats.spentOnDisadvantages.toFixed(),
            max: maximumAdventurePointsForAdventagesAndDisadvantages.toFixed(),
          })}
        </span>
        <span>
          {stats.spentOnMagicalDisadvantages < 0
            ? translate("Thereof {$value}/{$max} from magic disadvantages", {
                value: Math.abs(stats.spentOnMagicalDisadvantages).toFixed(),
                max: maximumForMagicalAdvantagesDisadvantages.toFixed(),
              })
            : null}
        </span>
        <span>
          {stats.spentOnBlessedDisadvantages < 0
            ? translate("Thereof {$value}/{$max} from blessed disadvantages", {
                value: Math.abs(stats.spentOnBlessedDisadvantages).toFixed(),
                max: maximumAdventurePointsForBlessedAdventagesAndDisadvantages.toFixed(),
              })
            : null}
        </span>
      </p>
      <hr />
      <p>
        <span>
          {translate("{$value} AP spent on race", { value: stats.spentOnRace.toFixed() })}
        </span>
        {stats.spentOnProfession === undefined ? null : (
          <span>
            {translate("{$value} AP spent on profession", {
              value: stats.spentOnProfession.toFixed(),
            })}
          </span>
        )}
        <span>
          {translate("{$value} AP spent on attributes", {
            value: stats.spentOnAttributes.toFixed(),
          })}
        </span>
        <span>
          {translate("{$value} AP spent on skills", { value: stats.spentOnSkills.toFixed() })}
        </span>
        <span>
          {translate("{$value} AP spent on combat techniques", {
            value: stats.spentOnCombatTechniques.toFixed(),
          })}
        </span>
        {isSpellcaster ? (
          <span>
            {translate("{$value} AP spent on spells", { value: stats.spentOnSpells.toFixed() })}
          </span>
        ) : null}
        {isSpellcaster ? (
          <span>
            {translate("{$value} AP spent on cantrips", { value: stats.spentOnCantrips.toFixed() })}
          </span>
        ) : null}
        {isBlessedOne ? (
          <span>
            {translate("{$value} AP spent on liturgical chants", {
              value: stats.spentOnLiturgicalChants.toFixed(),
            })}
          </span>
        ) : null}
        {isBlessedOne ? (
          <span>
            {translate("{$value} AP spent on blessings", {
              value: stats.spentOnBlessings.toFixed(),
            })}
          </span>
        ) : null}
        <span>
          {translate("{$value} AP spent on special abilities", {
            value: stats.spentOnSpecialAbilities.toFixed(),
          })}
        </span>
        <span>
          {translate("{$value} AP spent on improving/buying back LP/AE/KP", {
            value: stats.spentOnEnergies.toFixed(),
          })}
        </span>
      </p>
    </div>
  )
})
