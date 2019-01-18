import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { fromJust } from "../../../../Data/Maybe";
import { ExperienceLevel } from "../../../Models/Wiki/ExperienceLevel";
import { prefixId } from "../../IDUtils";
import { unsafeToInt } from "../../NumberUtils";
import { mergeRowsById } from "../mergeTableRows";
import { allRights, lookupKeyValid, validateRequiredNaturalNumberProp, validateRequiredNonEmptyStringProp } from "../validateValueUtils";

export const toExperienceLevel =
  mergeRowsById
    ("toExperienceLevel")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (validateRequiredNaturalNumberProp)

      // Check fields

      const ename =
        validateRequiredNonEmptyStringProp (lookup_l10n ("name"))

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

      // Return error or result

      return allRights
        ({
          ename,
          eap,
          emaxAttributeValue,
          emaxSkillRating,
          emaxCombatTechniqueRating,
          emaxTotalAttributeValues,
          emaxSpellsLiturgicalChants,
          emaxUnfamiliarSpells,
        })
        (rs => ExperienceLevel ({
          id: prefixId (IdPrefixes.EXPERIENCE_LEVELS) (id),
          name:
            fromJust (rs.ename),
          ap:
            unsafeToInt (fromJust (rs.eap)),
          maxAttributeValue:
            unsafeToInt (fromJust (rs.emaxAttributeValue)),
          maxSkillRating:
            unsafeToInt (fromJust (rs.emaxSkillRating)),
          maxCombatTechniqueRating:
            unsafeToInt (fromJust (rs.emaxCombatTechniqueRating)),
          maxTotalAttributeValues:
            unsafeToInt (fromJust (rs.emaxTotalAttributeValues)),
          maxSpellsLiturgicalChants:
            unsafeToInt (fromJust (rs.emaxSpellsLiturgicalChants)),
          maxUnfamiliarSpells:
            unsafeToInt (fromJust (rs.emaxUnfamiliarSpells)),
        }))
    })
