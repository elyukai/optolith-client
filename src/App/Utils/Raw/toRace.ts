import { pipe } from "ramda";
import { IdPrefixes } from "../../../constants/IdPrefixes";
import { fromRight_, isLeft, Right } from "../../../Data/Either";
import { fromJust } from "../../../Data/Maybe";
import { lookupF } from "../../../Data/OrderedMap";
import { Race } from "../../Models/Wiki/Race";
import { prefixId } from "../IDUtils";
import { unsafeToInt } from "../NumberUtils";
import { mergeRowsById } from "./mergeTableRows";
import { validateNaturalNumberProp, validateNonEmptyStringProp } from "./validateValueUtils";

export const toRace =
  mergeRowsById
    ("toRace")
    (id => l10n_row => univ_row => {
      // Shortcuts

      const checkUnivNaturalNumber =
        pipe (lookupF (univ_row), validateNaturalNumberProp)

      // Check fields

      const ename =
        validateNonEmptyStringProp (lookupF (l10n_row) ("name"))

      const eap =
        checkUnivNaturalNumber ("ap")

      const emaxAttributeValue =
        checkUnivNaturalNumber ("maxAttributeValue")

      const emaxSkillRating =
        checkUnivNaturalNumber ("maxSkillRating")

      const emaxCombatTechniqueRating =
        checkUnivNaturalNumber ("maxCombatTechniqueRating")

      const emaxTotalAttributeValues =
        checkUnivNaturalNumber ("maxTotalAttributeValues")

      const emaxSpellsLiturgicalChants =
        checkUnivNaturalNumber ("maxSpellsLiturgicalChants")

      const emaxUnfamiliarSpells =
        checkUnivNaturalNumber ("maxUnfamiliarSpells")

      // Return early on error

      if (isLeft (ename)) {
        return ename
      }

      if (isLeft (eap)) {
        return eap
      }

      if (isLeft (emaxAttributeValue)) {
        return emaxAttributeValue
      }

      if (isLeft (emaxSkillRating)) {
        return emaxSkillRating
      }

      if (isLeft (emaxCombatTechniqueRating)) {
        return emaxCombatTechniqueRating
      }

      if (isLeft (emaxTotalAttributeValues)) {
        return emaxTotalAttributeValues
      }

      if (isLeft (emaxSpellsLiturgicalChants)) {
        return emaxSpellsLiturgicalChants
      }

      if (isLeft (emaxUnfamiliarSpells)) {
        return emaxUnfamiliarSpells
      }

      // Return valid record

      return Right (Race ({
        id: prefixId (IdPrefixes.EXPERIENCE_LEVELS) (id),
        name:
          fromJust (fromRight_ (ename)),
        ap:
          unsafeToInt (fromJust (fromRight_ (eap))),
        maxAttributeValue:
          unsafeToInt (fromJust (fromRight_ (emaxAttributeValue))),
        maxSkillRating:
          unsafeToInt (fromJust (fromRight_ (emaxSkillRating))),
        maxCombatTechniqueRating:
          unsafeToInt (fromJust (fromRight_ (emaxCombatTechniqueRating))),
        maxTotalAttributeValues:
          unsafeToInt (fromJust (fromRight_ (emaxTotalAttributeValues))),
        maxSpellsLiturgicalChants:
          unsafeToInt (fromJust (fromRight_ (emaxSpellsLiturgicalChants))),
        maxUnfamiliarSpells:
          unsafeToInt (fromJust (fromRight_ (emaxUnfamiliarSpells))),
      }))
    })
