import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { fromJust } from "../../../../Data/Maybe";
import { ExperienceLevel } from "../../../Models/Wiki/ExperienceLevel";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapNatural } from "../validateMapValueUtils";
import { allRights, lookupKeyValid, validateRequiredNonEmptyStringProp } from "../validateValueUtils";

export const toExperienceLevel =
  mergeRowsById
    ("toExperienceLevel")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (mensureMapNatural)

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
          name: fromJust (rs.ename),
          ap: rs.eap,
          maxAttributeValue: rs.emaxAttributeValue,
          maxSkillRating: rs.emaxSkillRating,
          maxCombatTechniqueRating: rs.emaxCombatTechniqueRating,
          maxTotalAttributeValues: rs.emaxTotalAttributeValues,
          maxSpellsLiturgicalChants: rs.emaxSpellsLiturgicalChants,
          maxUnfamiliarSpells: rs.emaxUnfamiliarSpells,
        }))
    })
