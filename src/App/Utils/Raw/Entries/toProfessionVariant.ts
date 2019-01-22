import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { empty, fromArray, map } from "../../../../Data/List";
import { fromMaybe, Just, maybe, Maybe, Nothing } from "../../../../Data/Maybe";
import { CantripsSelection } from "../../../Models/Wiki/professionSelections/CantripsSelection";
import { CombatTechniquesSelection } from "../../../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { CursesSelection } from "../../../Models/Wiki/professionSelections/CursesSelection";
import { LanguagesScriptsSelection } from "../../../Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { RemoveCombatTechniquesSelection } from "../../../Models/Wiki/professionSelections/RemoveCombatTechniquesSelection";
import { isRemoveCombatTechniquesSecondSelection, RemoveCombatTechniquesSecondSelection } from "../../../Models/Wiki/professionSelections/RemoveSecondCombatTechniquesSelection";
import { RemoveSpecializationSelection } from "../../../Models/Wiki/professionSelections/RemoveSpecializationSelection";
import { CombatTechniquesSecondSelection } from "../../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { SkillsSelection } from "../../../Models/Wiki/professionSelections/SkillsSelection";
import { SpecializationSelection } from "../../../Models/Wiki/professionSelections/SpecializationSelection";
import { TerrainKnowledgeSelection } from "../../../Models/Wiki/professionSelections/TerrainKnowledgeSelection";
import { ProfessionVariant } from "../../../Models/Wiki/ProfessionVariant";
import { pairToIncreaseSkill } from "../../../Models/Wiki/sub/IncreaseSkill";
import { NameBySex } from "../../../Models/Wiki/sub/NameBySex";
import { AnyProfessionVariantSelection } from "../../../Models/Wiki/wikiTypeHelpers";
import { prefixId } from "../../IDUtils";
import { toInt, toNatural } from "../../NumberUtils";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapInteger, mensureMapListOptional, mensureMapNonEmptyString, mensureMapPairListOptional } from "../validateMapValueUtils";
import { allRights, Expect, lookupKeyValid } from "../validateValueUtils";
import { isRawCantripsSelection } from "./ProfessionSelections/CantripsSelection";
import { isRawCombatTechniquesSelection } from "./ProfessionSelections/CombatTechniquesSelection";
import { isRawCursesSelection } from "./ProfessionSelections/CursesSelection";
import { isRawLanguagesScriptsSelection } from "./ProfessionSelections/LanguagesScriptsSelection";
import { isRemoveRawCombatTechniquesSelection } from "./ProfessionSelections/RemoveCombatTechniquesSelection";
import { isRemoveRawSpecializationSelection } from "./ProfessionSelections/RemoveSpecializationSelection";
import { isRawSecondCombatTechniquesSelection } from "./ProfessionSelections/SecondCombatTechniquesSelection";
import { isRawSkillsSelection } from "./ProfessionSelections/SkillsSelection";
import { isRawSpecializationSelection } from "./ProfessionSelections/SpecializationSelection";
import { isRawTerrainKnowledgeSelection } from "./ProfessionSelections/TerrainKnowledgeSelection";
import { stringToBlessings, stringToDependencies, stringToPrerequisites, stringToSpecialAbilities } from "./toProfession";

const stringToVariantSelections =
  mensureMapListOptional
    ("&")
    (
      "SpecializationSelection "
      + "| LanguagesScriptsSelection "
      + "| CombatTechniquesSelection "
      + "| CombatTechniquesSecondSelection "
      + "| CantripsSelection "
      + "| CursesSelection "
      + "| TerrainKnowledgeSelection "
      + "| SkillsSelection"
    )
    ((x): Maybe<AnyProfessionVariantSelection> => {
      try {
        const obj = JSON.parse (x)

        if (typeof obj !== "object" || obj === null) return Nothing

        return isRawSpecializationSelection (obj)
          ? Just (SpecializationSelection ({
              id: Nothing,
              sid: Array.isArray (obj .sid) ? fromArray (obj .sid) : obj .sid,
            }))
          : isRemoveRawSpecializationSelection (obj)
          ? Just (RemoveSpecializationSelection)
          : isRawLanguagesScriptsSelection (obj)
          ? Just (LanguagesScriptsSelection ({
              id: Nothing,
              value: obj .value,
            }))
          : isRawCombatTechniquesSelection (obj)
          ? Just (CombatTechniquesSelection ({
              id: Nothing,
              amount: obj .amount,
              value: obj .value,
              sid: fromArray (obj .sid),
            }))
          : isRemoveRawCombatTechniquesSelection (obj)
          ? Just (RemoveCombatTechniquesSelection)
          : isRawSecondCombatTechniquesSelection (obj)
          ? Just (CombatTechniquesSecondSelection ({
              id: Nothing,
              amount: obj .amount,
              value: obj .value,
              sid: fromArray (obj .sid),
            }))
          : isRemoveCombatTechniquesSecondSelection (obj)
          ? Just (RemoveCombatTechniquesSecondSelection)
          : isRawCantripsSelection (obj)
          ? Just (CantripsSelection ({
              id: Nothing,
              amount: obj .amount,
              sid: fromArray (obj .sid),
            }))
          : isRawCursesSelection (obj)
          ? Just (CursesSelection ({
              id: Nothing,
              value: obj .value,
            }))
          : isRawTerrainKnowledgeSelection (obj)
          ? Just (TerrainKnowledgeSelection ({
              id: Nothing,
              sid: fromArray (obj .sid),
            }))
          : isRawSkillsSelection (obj)
          ? Just (SkillsSelection ({
              id: Nothing,
              value: obj .value,
            }))
          : Nothing
      }
      catch (e) {
        return Nothing
      }
    })

const toNaturalNumberIntPairOptional =
  mensureMapPairListOptional ("&")
                             ("?")
                             (Expect.NaturalNumber)
                             (Expect.NaturalNumber)
                             (toNatural)
                             (toInt)

export const toProfessionVariant =
  mergeRowsById
    ("toProfessionVariant")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (mensureMapNonEmptyString)

      const checkUnivInteger =
        lookupKeyValid (lookup_univ) (mensureMapInteger)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const nameFemale = lookup_l10n ("nameFemale")

      const ecost =
        checkUnivInteger ("cost")

      const edependencies =
        lookupKeyValid (lookup_univ)
                       (stringToDependencies)
                       ("dependencies")

      const eprerequisites =
        lookupKeyValid (lookup_univ)
                       (stringToPrerequisites)
                       ("prerequisites")

      const eselections =
        lookupKeyValid (lookup_univ)
                       (stringToVariantSelections)
                       ("selections")

      const especialAbilities =
        lookupKeyValid (lookup_univ)
                       (stringToSpecialAbilities)
                       ("specialAbilities")

      const ecombatTechniques =
        lookupKeyValid (lookup_univ)
                       (toNaturalNumberIntPairOptional)
                       ("combatTechniques")

      const eskills =
        lookupKeyValid (lookup_univ)
                       (toNaturalNumberIntPairOptional)
                       ("skills")

      const espells =
        lookupKeyValid (lookup_univ)
                       (toNaturalNumberIntPairOptional)
                       ("spells")

      const eliturgicalChants =
        lookupKeyValid (lookup_univ)
                       (toNaturalNumberIntPairOptional)
                       ("liturgicalChants")

      const eblessings =
        lookupKeyValid (lookup_univ)
                       (stringToBlessings)
                       ("blessings")

      const precedingText =
        lookup_l10n ("precedingText")

      const fullText =
        lookup_l10n ("fullText")

      const concludingText =
        lookup_l10n ("concludingText")

      // Return error or result

      return allRights
        ({
          ename,
          ecost,
          edependencies,
          eprerequisites,
          eselections,
          especialAbilities,
          ecombatTechniques,
          eskills,
          espells,
          eliturgicalChants,
          eblessings,
        })
        (rs => ProfessionVariant ({
          id: prefixId (IdPrefixes.PROFESSION_VARIANTS) (id),

          name:
            maybe<ProfessionVariant["name"]> (rs.ename)
                                             ((f: string) => NameBySex ({ m: rs.ename, f }))
                                             (nameFemale),

          ap: rs.ecost,

          dependencies:
            fromMaybe<ProfessionVariant["dependencies"]> (empty) (rs.edependencies),

          prerequisites:
            fromMaybe<ProfessionVariant["prerequisites"]> (empty) (rs.eprerequisites),

          selections:
            fromMaybe<ProfessionVariant["selections"]> (empty) (rs.eselections),

          specialAbilities:
            fromMaybe<ProfessionVariant["specialAbilities"]> (empty) (rs.especialAbilities),

          combatTechniques:
            maybe<ProfessionVariant["combatTechniques"]>
              (empty)
              (map (pairToIncreaseSkill (IdPrefixes.COMBAT_TECHNIQUES)))
              (rs.ecombatTechniques),

          skills:
            maybe<ProfessionVariant["skills"]>
              (empty)
              (map (pairToIncreaseSkill (IdPrefixes.SKILLS)))
              (rs.eskills),

          spells:
            maybe<ProfessionVariant["spells"]>
              (empty)
              (map (pairToIncreaseSkill (IdPrefixes.SPELLS)))
              (rs.espells),

          liturgicalChants:
            maybe<ProfessionVariant["liturgicalChants"]>
              (empty)
              (map (pairToIncreaseSkill (IdPrefixes.LITURGICAL_CHANTS)))
              (rs.eliturgicalChants),

          blessings:
            maybe<ProfessionVariant["blessings"]>
              (empty)
              (map (prefixId (IdPrefixes.BLESSINGS)))
              (rs.eblessings),

          precedingText,
          fullText,
          concludingText,

          category: Nothing,
        }))
    })
