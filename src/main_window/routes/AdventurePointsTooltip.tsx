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
      <h4>{translate("header.aptooltip.title")}</h4>
      <p className="general">
        <span>{translate("header.aptooltip.total", total ?? 0)}</span>
        <span>{translate("header.aptooltip.spent", spent.general)}</span>
      </p>
      <hr />
      <p>
        <span>
          {translate(
            "header.aptooltip.spentonadvantages",
            spentOnAdvantages.general + spentOnAdvantages.bound,
            80
          )}
        </span>
        <span>
          {spentOnMagicalAdvantages.general + spentOnMagicalAdvantages.bound > 0
            ? translate(
              "header.aptooltip.spentonmagicadvantages",
              spentOnMagicalAdvantages.general + spentOnMagicalAdvantages.bound,
              maximumForMagicalAdvantagesDisadvantages,
            )
            : null}
        </span>
        <span>
          {spentOnBlessedAdvantages.general + spentOnBlessedAdvantages.bound > 0
            ? translate(
              "header.aptooltip.spentonblessedadvantages",
              spentOnBlessedAdvantages.general + spentOnBlessedAdvantages.bound,
              50,
            )
            : null}
        </span>
        <span>
          {translate(
            "header.aptooltip.spentondisadvantages",
            spentOnDisadvantages.general + spentOnDisadvantages.bound,
            80,
          )}
        </span>
        <span>
          {spentOnMagicalDisadvantages.general + spentOnMagicalDisadvantages.bound > 0
            ? translate(
              "header.aptooltip.spentonmagicdisadvantages",
              spentOnMagicalDisadvantages.general + spentOnMagicalDisadvantages.bound,
              maximumForMagicalAdvantagesDisadvantages,
            )
            : null}
        </span>
        <span>
          {spentOnBlessedDisadvantages.general + spentOnBlessedDisadvantages.bound > 0
            ? translate(
              "header.aptooltip.spentonblesseddisadvantages",
              spentOnBlessedDisadvantages.general + spentOnBlessedDisadvantages.bound,
              50,
            )
            : null}
        </span>
      </p>
      <hr />
      <p>
        <span>
          {translate("header.aptooltip.spentonrace", spentOnRace)}
        </span>
        {spentOnProfession === undefined
          ? null
          : (
            <span>
              {translate("header.aptooltip.spentonprofession", spentOnProfession)}
            </span>
          )}
        <span>
          {translate(
            "header.aptooltip.spentonattributes",
            spentOnAttributes.general + spentOnAttributes.bound,
          )}
        </span>
        <span>
          {translate(
            "header.aptooltip.spentonskills",
            spentOnSkills.general + spentOnSkills.bound,
          )}
        </span>
        <span>
          {translate(
            "header.aptooltip.spentoncombattechniques",
            spentOnCombatTechniques.general + spentOnCombatTechniques.bound,
          )}
        </span>
        {isSpellcaster
          ? (
            <span>
              {translate(
                "header.aptooltip.spentonspells",
                spentOnSpells.general + spentOnSpells.bound,
              )}
            </span>
          )
          : null}
        {isSpellcaster
          ? (
            <span>
              {translate(
                "header.aptooltip.spentoncantrips",
                spentOnCantrips.general + spentOnCantrips.bound,
              )}
            </span>
          )
          : null}
        {isBlessedOne
          ? (
            <span>
              {translate(
                "header.aptooltip.spentonliturgicalchants",
                spentOnLiturgicalChants.general + spentOnLiturgicalChants.bound,
              )}
            </span>
          )
          : null}
        {isBlessedOne
          ? (
            <span>
              {translate(
                "header.aptooltip.spentonblessings",
                spentOnBlessings.general + spentOnBlessings.bound,
              )}
            </span>
          )
          : null}
        <span>
          {translate(
            "header.aptooltip.spentonspecialabilities",
            spentOnSpecialAbilities.general + spentOnSpecialAbilities.bound,
          )}
        </span>
        <span>
          {translate(
            "header.aptooltip.spentonenergies",
            spentOnEnergies,
          )}
        </span>
      </p>
    </div>
  )
}
