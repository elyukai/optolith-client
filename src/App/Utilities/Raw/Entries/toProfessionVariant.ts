import { equals } from "../../../../Data/Eq";
import { ident } from "../../../../Data/Function";
import { fmap } from "../../../../Data/Functor";
import { set } from "../../../../Data/Lens";
import { empty, foldr, fromArray, List, map, notNull, splitOn } from "../../../../Data/List";
import { altF_, any, bindF, ensure, fromJust, fromMaybe, Just, mapM, maybe, Maybe, Nothing, Some } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { parseJSON } from "../../../../Data/String/JSON";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { SpecialAbilityId } from "../../../Constants/Ids";
import { ProfessionRequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { CantripsSelection } from "../../../Models/Wiki/professionSelections/CantripsSelection";
import { CombatTechniquesSelection } from "../../../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { CursesSelection } from "../../../Models/Wiki/professionSelections/CursesSelection";
import { LanguagesScriptsSelection } from "../../../Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { ProfessionVariantSelections, ProfessionVariantSelectionsL } from "../../../Models/Wiki/professionSelections/ProfessionVariantAdjustmentSelections";
import { RemoveCombatTechniquesSelection } from "../../../Models/Wiki/professionSelections/RemoveCombatTechniquesSelection";
import { RemoveCombatTechniquesSecondSelection } from "../../../Models/Wiki/professionSelections/RemoveSecondCombatTechniquesSelection";
import { RemoveSpecializationSelection } from "../../../Models/Wiki/professionSelections/RemoveSpecializationSelection";
import { CombatTechniquesSecondSelection } from "../../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { SkillsSelection } from "../../../Models/Wiki/professionSelections/SkillsSelection";
import { SpecializationSelection } from "../../../Models/Wiki/professionSelections/SpecializationSelection";
import { TerrainKnowledgeSelection } from "../../../Models/Wiki/professionSelections/TerrainKnowledgeSelection";
import { ProfessionVariant } from "../../../Models/Wiki/ProfessionVariant";
import { pairToIncreaseSkill } from "../../../Models/Wiki/sub/IncreaseSkill";
import { pairToIncreaseSkillOrList } from "../../../Models/Wiki/sub/IncreaseSkillList";
import { NameBySex } from "../../../Models/Wiki/sub/NameBySex";
import { AnyProfessionVariantSelection, ProfessionPrerequisite, ProfessionSelectionIds } from "../../../Models/Wiki/wikiTypeHelpers";
import { prefixCantrip, prefixCT, prefixId } from "../../IDUtils";
import { toInt, toNatural } from "../../NumberUtils";
import { pipe, pipe_ } from "../../pipe";
import { mergeRowsById } from "../mergeTableRows";
import { modifyNegIntNoBreak } from "../rawConversionUtils";
import { Expect } from "../showExpected";
import { mensureMapInteger, mensureMapListOptional, mensureMapNonEmptyString, mensureMapPairListOptional } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed, TableType } from "../validateValueUtils";
import { isRawCantripsSelection } from "./ProfessionSelections/RawCantripsSelection";
import { isRawCombatTechniquesSelection } from "./ProfessionSelections/RawCombatTechniquesSelection";
import { isRawCursesSelection } from "./ProfessionSelections/RawCursesSelection";
import { isRawLanguagesScriptsSelection } from "./ProfessionSelections/RawLanguagesScriptsSelection";
import { isRawSecondCombatTechniquesSelection } from "./ProfessionSelections/RawSecondCombatTechniquesSelection";
import { isRawSkillsSelection } from "./ProfessionSelections/RawSkillsSelection";
import { isRawSpecializationSelection } from "./ProfessionSelections/RawSpecializationSelection";
import { isRawTerrainKnowledgeSelection } from "./ProfessionSelections/RawTerrainKnowledgeSelection";
import { isRemoveRawCombatTechniquesSelection } from "./ProfessionSelections/RemoveRawCombatTechniquesSelection";
import { isRemoveRawCombatTechniquesSecondSelection } from "./ProfessionSelections/RemoveRawSecondCombatTechniquesSelection";
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
// tslint:disable-next-line: cyclomatic-complexity
      ((x): Maybe<AnyProfessionVariantSelection> => {
        try {
          const mobj = parseJSON (x)

          if (any ((y: Some): y is object => typeof y === "object" && y !== null) (mobj)) {
            const obj = fromJust<any> (mobj)

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
                  sid: fromArray (obj .sid .map (prefixCT)),
                }))
              : isRemoveRawCombatTechniquesSelection (obj)
              ? Just (RemoveCombatTechniquesSelection)
              : isRawSecondCombatTechniquesSelection (obj)
              ? Just (CombatTechniquesSecondSelection ({
                  id: Nothing,
                  amount: obj .amount,
                  value: obj .value,
                  sid: fromArray (obj .sid .map (prefixCT)),
                }))
              : isRemoveRawCombatTechniquesSecondSelection (obj)
              ? Just (RemoveCombatTechniquesSecondSelection)
              : isRawCantripsSelection (obj)
              ? Just (CantripsSelection ({
                  id: Nothing,
                  amount: obj .amount,
                  sid: fromArray (obj .sid .map (prefixCantrip)),
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

          return Nothing
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
                             (Expect.Integer)
                             (toNatural)
                             (toInt)

const toNaturalNumberOrNumberListPairOptional =
  mensureMapPairListOptional ("&")
                             ("?")
                             (Expect.Union (
                               Expect.NaturalNumber,
                               Expect.NonEmptyList (Expect.NaturalNumber)
                             ))
                             (Expect.Integer)
                             (x => pipe_ (
                               x,
                               toNatural,
                               altF_<number | List<number>> (() => pipe_ (
                                                                           x,
                                                                           splitOn ("|"),
                                                                           ensure (notNull),
                                                                           bindF (mapM (toNatural))
                                                                         ))
                             ))
                             (toInt)

export const toProfessionVariant =
  mergeRowsById
    ("toProfessionVariant")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkUnivInteger =
        lookupKeyValid (mensureMapInteger) (TableType.Univ) (lookup_univ)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const nameFemale = lookup_l10n ("nameFemale")

      const ecost =
        checkUnivInteger ("cost")

      const edependencies =
        lookupKeyValid (stringToDependencies)
                       (TableType.Univ)
                       (lookup_univ)
                       ("dependencies")

      const eprerequisites =
        lookupKeyValid (stringToPrerequisites)
                       (TableType.Univ)
                       (lookup_univ)
                       ("prerequisites")

      const eselections =
        lookupKeyValid (stringToVariantSelections)
                       (TableType.Univ)
                       (lookup_univ)
                       ("selections")

      const especialAbilities =
        lookupKeyValid (stringToSpecialAbilities)
                       (TableType.Univ)
                       (lookup_univ)
                       ("specialAbilities")

      const ecombatTechniques =
        lookupKeyValid (toNaturalNumberIntPairOptional)
                       (TableType.Univ)
                       (lookup_univ)
                       ("combatTechniques")

      const eskills =
        lookupKeyValid (toNaturalNumberIntPairOptional)
                       (TableType.Univ)
                       (lookup_univ)
                       ("skills")

      const espells =
        lookupKeyValid (toNaturalNumberOrNumberListPairOptional)
                       (TableType.Univ)
                       (lookup_univ)
                       ("spells")

      const eliturgicalChants =
        lookupKeyValid (toNaturalNumberOrNumberListPairOptional)
                       (TableType.Univ)
                       (lookup_univ)
                       ("liturgicalChants")

      const eblessings =
        lookupKeyValid (stringToBlessings)
                       (TableType.Univ)
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
        (rs => {
          const is_guild_mage_tradition_add =
            any (List.any ((x: ProfessionPrerequisite) =>
                            ProfessionRequireActivatable.is (x)
                            && ProfessionRequireActivatable.A.id (x)
                              === SpecialAbilityId.TraditionGuildMages))
                (rs.eprerequisites)
            && any (List.any (pipe (
                               ProfessionRequireActivatable.A.id,
                               equals<string> (SpecialAbilityId.TraditionGuildMages)
                             )))
                   (rs.especialAbilities)

          const selections = fromMaybe (ProfessionVariantSelections.default) (rs.eselections)

          return ProfessionVariant ({
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
              is_guild_mage_tradition_add
                ? set (PVSL[ProfessionSelectionIds.GUILD_MAGE_UNFAMILIAR_SPELL]) (true) (selections)
                : selections,

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
                (map (pairToIncreaseSkillOrList (IdPrefixes.SPELLS)))
                (rs.espells),

            liturgicalChants:
              maybe<ProfessionVariant["liturgicalChants"]>
                (empty)
                (map (pairToIncreaseSkillOrList (IdPrefixes.LITURGICAL_CHANTS)))
                (rs.eliturgicalChants),

            blessings:
              maybe<ProfessionVariant["blessings"]>
                (empty)
                (map (prefixId (IdPrefixes.BLESSINGS)))
                (rs.eblessings),

            precedingText: fmap (modifyNegIntNoBreak) (precedingText),
            fullText: fmap (modifyNegIntNoBreak) (fullText),
            concludingText: fmap (modifyNegIntNoBreak) (concludingText),

            category: Nothing,
          })
        })
    })
