import { FC } from "react"
import { useAppSelector } from "../hooks/redux.ts"
import { useTranslate } from "../hooks/translate.ts"
import { selectAdventurePointsSpent, selectAdventurePointsSpentOnAdvantages, selectAdventurePointsSpentOnAttributes, selectAdventurePointsSpentOnBlessedAdvantages, selectAdventurePointsSpentOnBlessedDisadvantages, selectAdventurePointsSpentOnBlessings, selectAdventurePointsSpentOnCantrips, selectAdventurePointsSpentOnCombatTechniques, selectAdventurePointsSpentOnDisadvantages, selectAdventurePointsSpentOnEnergies, selectAdventurePointsSpentOnLiturgicalChants, selectAdventurePointsSpentOnMagicalAdvantages, selectAdventurePointsSpentOnMagicalDisadvantages, selectAdventurePointsSpentOnProfession, selectAdventurePointsSpentOnRace, selectAdventurePointsSpentOnSkills, selectAdventurePointsSpentOnSpecialAbilities, selectAdventurePointsSpentOnSpells } from "../selectors/adventurePointSelectors.ts"
import { selectTotalAdventurePoints } from "../slices/characterSlice.ts"

export const AdventurePointsTooltip: FC = () => {
  const translate = useTranslate()

  // TODO: Replace with real selectors
  const isSpellcaster = true
  const isBlessedOne = true
  const maximumForMagicalAdvantagesDisadvantages = 50

  const total = useAppSelector(selectTotalAdventurePoints)
  const spent = useAppSelector(selectAdventurePointsSpent)
  const spentOnAttributes = useAppSelector(selectAdventurePointsSpentOnAttributes)
  const spentOnSkills = useAppSelector(selectAdventurePointsSpentOnSkills)
  const spentOnCombatTechniques = useAppSelector(selectAdventurePointsSpentOnCombatTechniques)
  const spentOnSpells = useAppSelector(selectAdventurePointsSpentOnSpells)
  const spentOnLiturgicalChants = useAppSelector(selectAdventurePointsSpentOnLiturgicalChants)
  const spentOnCantrips = useAppSelector(selectAdventurePointsSpentOnCantrips)
  const spentOnBlessings = useAppSelector(selectAdventurePointsSpentOnBlessings)
  const spentOnAdvantages = useAppSelector(selectAdventurePointsSpentOnAdvantages)
  const spentOnMagicalAdvantages = useAppSelector(selectAdventurePointsSpentOnMagicalAdvantages)
  const spentOnBlessedAdvantages = useAppSelector(selectAdventurePointsSpentOnBlessedAdvantages)
  const spentOnDisadvantages = useAppSelector(selectAdventurePointsSpentOnDisadvantages)
  const spentOnMagicalDisadvantages =
    useAppSelector(selectAdventurePointsSpentOnMagicalDisadvantages)
  const spentOnBlessedDisadvantages =
    useAppSelector(selectAdventurePointsSpentOnBlessedDisadvantages)
  const spentOnSpecialAbilities = useAppSelector(selectAdventurePointsSpentOnSpecialAbilities)
  const spentOnEnergies = useAppSelector(selectAdventurePointsSpentOnEnergies)
  const spentOnRace = useAppSelector(selectAdventurePointsSpentOnRace)
  const spentOnProfession = useAppSelector(selectAdventurePointsSpentOnProfession)

  return (
    <div className="ap-details">
      <h4>{translate("Adventure Points")}</h4>
      <p className="general">
        <span>{translate("{0} Total AP", total ?? 0)}</span>
        <span>{translate("{0} AP Spent", spent.general)}</span>
      </p>
      <hr />
      <p>
        <span>
          {translate(
            "{0}/{1} AP spent on advantages",
            spentOnAdvantages.general + spentOnAdvantages.bound,
            80
          )}
        </span>
        <span>
          {spentOnMagicalAdvantages.general + spentOnMagicalAdvantages.bound > 0
            ? translate(
              "Thereof {0}/{1} on magic advantages",
              spentOnMagicalAdvantages.general + spentOnMagicalAdvantages.bound,
              maximumForMagicalAdvantagesDisadvantages,
            )
            : null}
        </span>
        <span>
          {spentOnBlessedAdvantages.general + spentOnBlessedAdvantages.bound > 0
            ? translate(
              "Thereof {0}/{1} on blessed advantages",
              spentOnBlessedAdvantages.general + spentOnBlessedAdvantages.bound,
              50,
            )
            : null}
        </span>
        <span>
          {translate(
            "{0}/{1} AP received from disadvantages",
            spentOnDisadvantages.general + spentOnDisadvantages.bound,
            80,
          )}
        </span>
        <span>
          {spentOnMagicalDisadvantages.general + spentOnMagicalDisadvantages.bound > 0
            ? translate(
              "Thereof {0}/{1} from magic disadvantages",
              spentOnMagicalDisadvantages.general + spentOnMagicalDisadvantages.bound,
              maximumForMagicalAdvantagesDisadvantages,
            )
            : null}
        </span>
        <span>
          {spentOnBlessedDisadvantages.general + spentOnBlessedDisadvantages.bound > 0
            ? translate(
              "Thereof {0}/{1} from blessed disadvantages",
              spentOnBlessedDisadvantages.general + spentOnBlessedDisadvantages.bound,
              50,
            )
            : null}
        </span>
      </p>
      <hr />
      <p>
        <span>
          {translate("{0} AP spent on race", spentOnRace)}
        </span>
        {spentOnProfession === undefined
          ? null
          : (
            <span>
              {translate("{0} AP spent on profession", spentOnProfession)}
            </span>
          )}
        <span>
          {translate(
            "{0} AP spent on attributes",
            spentOnAttributes.general + spentOnAttributes.bound,
          )}
        </span>
        <span>
          {translate(
            "{0} AP spent on skills",
            spentOnSkills.general + spentOnSkills.bound,
          )}
        </span>
        <span>
          {translate(
            "{0} AP spent on combat techniques",
            spentOnCombatTechniques.general + spentOnCombatTechniques.bound,
          )}
        </span>
        {isSpellcaster
          ? (
            <span>
              {translate(
                "{0} AP spent on spells",
                spentOnSpells.general + spentOnSpells.bound,
              )}
            </span>
          )
          : null}
        {isSpellcaster
          ? (
            <span>
              {translate(
                "{0} AP spent on cantrips",
                spentOnCantrips.general + spentOnCantrips.bound,
              )}
            </span>
          )
          : null}
        {isBlessedOne
          ? (
            <span>
              {translate(
                "{0} AP spent on liturgical chants",
                spentOnLiturgicalChants.general + spentOnLiturgicalChants.bound,
              )}
            </span>
          )
          : null}
        {isBlessedOne
          ? (
            <span>
              {translate(
                "{0} AP spent on blessings",
                spentOnBlessings.general + spentOnBlessings.bound,
              )}
            </span>
          )
          : null}
        <span>
          {translate(
            "{0} AP spent on special abilities",
            spentOnSpecialAbilities.general + spentOnSpecialAbilities.bound,
          )}
        </span>
        <span>
          {translate(
            "{0} AP spent on improving/buying back LP/AE/KP",
            spentOnEnergies,
          )}
        </span>
      </p>
    </div>
  )
}
