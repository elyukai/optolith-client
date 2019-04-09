import { ident } from "../../../../Data/Function";
import { fmap } from "../../../../Data/Functor";
import { set } from "../../../../Data/Lens";
import { empty, foldr, fromArray, map } from "../../../../Data/List";
import { fromMaybe, Just, maybe, Maybe, Nothing } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { CantripsSelection } from "../../../Models/Wiki/professionSelections/CantripsSelection";
import { CombatTechniquesSelection } from "../../../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { CursesSelection } from "../../../Models/Wiki/professionSelections/CursesSelection";
import { LanguagesScriptsSelection } from "../../../Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { ProfessionVariantSelections, ProfessionVariantSelectionsL } from "../../../Models/Wiki/professionSelections/ProfessionVariantAdjustmentSelections";
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
import { AnyProfessionVariantSelection, ProfessionSelectionIds } from "../../../Models/Wiki/wikiTypeHelpers";
import { prefixId } from "../../IDUtils";
import { toInt, toNatural } from "../../NumberUtils";
import { pipe } from "../../pipe";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapInteger, mensureMapListOptional, mensureMapNonEmptyString, mensureMapPairListOptional } from "../validateMapValueUtils";
import { Expect, lookupKeyValid, mapMNamed } from "../validateValueUtils";
import { isRawCantripsSelection } from "./ProfessionSelections/RawCantripsSelection";
import { isRawCombatTechniquesSelection } from "./ProfessionSelections/RawCombatTechniquesSelection";
import { isRawCursesSelection } from "./ProfessionSelections/RawCursesSelection";
import { isRawLanguagesScriptsSelection } from "./ProfessionSelections/RawLanguagesScriptsSelection";
import { isRawSecondCombatTechniquesSelection } from "./ProfessionSelections/RawSecondCombatTechniquesSelection";
import { isRawSkillsSelection } from "./ProfessionSelections/RawSkillsSelection";
import { isRawSpecializationSelection } from "./ProfessionSelections/RawSpecializationSelection";
import { isRawTerrainKnowledgeSelection } from "./ProfessionSelections/RawTerrainKnowledgeSelection";
import { isRemoveRawCombatTechniquesSelection } from "./ProfessionSelections/RemoveRawCombatTechniquesSelection";
import { isRemoveRawSpecializationSelection } from "./ProfessionSelections/RemoveRawSpecializationSelection";
import { stringToBlessings, stringToDependencies, stringToPrerequisites, stringToSpecialAbilities } from "./toProfession";

const PVSL = ProfessionVariantSelectionsL

const stringToVariantSelections =
  pipe (
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
      }),
    fmap (fmap (foldr (s => {
                        if (SpecializationSelection.is (s)) {
                          return set (PVSL [ProfessionSelectionIds.SPECIALIZATION])
                                     (Just (s))
                        }

                        if (LanguagesScriptsSelection.is (s)) {
                          return set (PVSL [ProfessionSelectionIds.LANGUAGES_SCRIPTS])
                                     (Just (s))
                        }

                        if (CombatTechniquesSelection.is (s)) {
                          return set (PVSL [ProfessionSelectionIds.COMBAT_TECHNIQUES])
                                     (Just (s))
                        }

                        if (CombatTechniquesSecondSelection.is (s)) {
                          return set (PVSL [ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND])
                                     (Just (s))
                        }

                        if (CantripsSelection.is (s)) {
                          return set (PVSL [ProfessionSelectionIds.CANTRIPS])
                                     (Just (s))
                        }

                        if (CursesSelection.is (s)) {
                          return set (PVSL [ProfessionSelectionIds.CURSES])
                                     (Just (s))
                        }

                        if (TerrainKnowledgeSelection.is (s)) {
                          return set (PVSL [ProfessionSelectionIds.TERRAIN_KNOWLEDGE])
                                     (Just (s))
                        }

                        if (SkillsSelection.is (s)) {
                          return set (PVSL [ProfessionSelectionIds.SKILLS])
                                     (Just (s))
                        }

                        return ident as ident<Record<ProfessionVariantSelections>>
                      })
                      (ProfessionVariantSelections.default)))
  )

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
        lookupKeyValid (mensureMapNonEmptyString) (lookup_l10n)

      const checkUnivInteger =
        lookupKeyValid (mensureMapInteger) (lookup_univ)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const nameFemale = lookup_l10n ("nameFemale")

      const ecost =
        checkUnivInteger ("cost")

      const edependencies =
        lookupKeyValid (stringToDependencies)
                       (lookup_univ)
                       ("dependencies")

      const eprerequisites =
        lookupKeyValid (stringToPrerequisites)
                       (lookup_univ)
                       ("prerequisites")

      const eselections =
        lookupKeyValid (stringToVariantSelections)
                       (lookup_univ)
                       ("selections")

      const especialAbilities =
        lookupKeyValid (stringToSpecialAbilities)
                       (lookup_univ)
                       ("specialAbilities")

      const ecombatTechniques =
        lookupKeyValid (toNaturalNumberIntPairOptional)
                       (lookup_univ)
                       ("combatTechniques")

      const eskills =
        lookupKeyValid (toNaturalNumberIntPairOptional)
                       (lookup_univ)
                       ("skills")

      const espells =
        lookupKeyValid (toNaturalNumberIntPairOptional)
                       (lookup_univ)
                       ("spells")

      const eliturgicalChants =
        lookupKeyValid (toNaturalNumberIntPairOptional)
                       (lookup_univ)
                       ("liturgicalChants")

      const eblessings =
        lookupKeyValid (stringToBlessings)
                       (lookup_univ)
                       ("blessings")

      const precedingText =
        lookup_l10n ("precedingText")

      const fullText =
        lookup_l10n ("fullText")

      const concludingText =
        lookup_l10n ("concludingText")

      // Return error or result

      return mapMNamed
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
            fromMaybe<ProfessionVariant["selections"]> (ProfessionVariantSelections.default)
                                                       (rs.eselections),

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
