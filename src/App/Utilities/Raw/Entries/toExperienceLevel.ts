import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { ExperienceLevel } from "../../../Models/Wiki/ExperienceLevel";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { lookupKeyMapValidNatural, lookupKeyMapValidNonEmptyString, mapMNamed, TableType } from "../validateValueUtils";

export const toExperienceLevel =
  mergeRowsById
    ("toExperienceLevel")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyMapValidNonEmptyString (TableType.L10n) (lookup_l10n)

      const checkUnivNaturalNumber =
        lookupKeyMapValidNatural (TableType.Univ) (lookup_univ)

      // Check and convert fields

      const ename =
        checkL10nNonEmptyString ("name")

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

      return mapMNamed
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
          name: rs.ename,
          ap: rs.eap,
          maxAttributeValue: rs.emaxAttributeValue,
          maxSkillRating: rs.emaxSkillRating,
          maxCombatTechniqueRating: rs.emaxCombatTechniqueRating,
          maxTotalAttributeValues: rs.emaxTotalAttributeValues,
          maxSpellsLiturgicalChants: rs.emaxSpellsLiturgicalChants,
          maxUnfamiliarSpells: rs.emaxUnfamiliarSpells,
        }))
    })
