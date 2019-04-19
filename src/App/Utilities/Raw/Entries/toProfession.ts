import { ident } from "../../../../Data/Function";
import { fmap } from "../../../../Data/Functor";
import { set } from "../../../../Data/Lens";
import { empty, flength, foldr, fromArray, map } from "../../../../Data/List";
import { any, ensure, fromJust, fromMaybe, Just, maybe, Maybe, Nothing, Some } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { parseJSON } from "../../../../Data/String/JSON";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { ProfessionRequireActivatable, RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { CultureRequirement } from "../../../Models/Wiki/prerequisites/CultureRequirement";
import { ProfessionRequireIncreasable, RequireIncreasable } from "../../../Models/Wiki/prerequisites/IncreasableRequirement";
import { RaceRequirement } from "../../../Models/Wiki/prerequisites/RaceRequirement";
import { SexRequirement } from "../../../Models/Wiki/prerequisites/SexRequirement";
import { Profession } from "../../../Models/Wiki/Profession";
import { CantripsSelection } from "../../../Models/Wiki/professionSelections/CantripsSelection";
import { CombatTechniquesSelection } from "../../../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { CursesSelection } from "../../../Models/Wiki/professionSelections/CursesSelection";
import { LanguagesScriptsSelection } from "../../../Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { ProfessionSelections, ProfessionSelectionsL } from "../../../Models/Wiki/professionSelections/ProfessionAdjustmentSelections";
import { CombatTechniquesSecondSelection } from "../../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { SkillsSelection } from "../../../Models/Wiki/professionSelections/SkillsSelection";
import { SpecializationSelection } from "../../../Models/Wiki/professionSelections/SpecializationSelection";
import { TerrainKnowledgeSelection } from "../../../Models/Wiki/professionSelections/TerrainKnowledgeSelection";
import { pairToIncreaseSkill } from "../../../Models/Wiki/sub/IncreaseSkill";
import { NameBySex } from "../../../Models/Wiki/sub/NameBySex";
import { AnyProfessionSelection, ProfessionDependency, ProfessionPrerequisite, ProfessionSelectionIds } from "../../../Models/Wiki/wikiTypeHelpers";
import { prefixId } from "../../IDUtils";
import { toNatural } from "../../NumberUtils";
import { pipe } from "../../pipe";
import { mergeRowsById } from "../mergeTableRows";
import { maybePrefix } from "../rawConversionUtils";
import { Expect } from "../showExpected";
import { mensureMapListBindAfterOptional, mensureMapListOptional, mensureMapNatural, mensureMapNaturalListOptional, mensureMapNonEmptyString, mensureMapPairListOptional } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed, TableType } from "../validateValueUtils";
import { isRawProfessionRequiringActivatable } from "./Prerequisites/RawActivatableRequirement";
import { isRawCultureRequirement } from "./Prerequisites/RawCultureRequirement";
import { isRawProfessionRequiringIncreasable } from "./Prerequisites/RawIncreasableRequirement";
import { isRawRaceRequirement } from "./Prerequisites/RawRaceRequirement";
import { isRawSexRequirement } from "./Prerequisites/RawSexRequirement";
import { isRawCantripsSelection } from "./ProfessionSelections/RawCantripsSelection";
import { isRawCombatTechniquesSelection } from "./ProfessionSelections/RawCombatTechniquesSelection";
import { isRawCursesSelection } from "./ProfessionSelections/RawCursesSelection";
import { isRawLanguagesScriptsSelection } from "./ProfessionSelections/RawLanguagesScriptsSelection";
import { isRawSecondCombatTechniquesSelection } from "./ProfessionSelections/RawSecondCombatTechniquesSelection";
import { isRawSkillsSelection } from "./ProfessionSelections/RawSkillsSelection";
import { isRawSpecializationSelection } from "./ProfessionSelections/RawSpecializationSelection";
import { isRawTerrainKnowledgeSelection } from "./ProfessionSelections/RawTerrainKnowledgeSelection";
import { toSourceLinks } from "./Sub/toSourceLinks";

const isNotNullObject = (x: Some): x is object => typeof x === "object" && x === null

export const stringToDependencies =
  mensureMapListOptional
    ("&")
    ("SexRequirement | RaceRequirement | CultureRequirement")
    ((x): Maybe<ProfessionDependency> => {
      try {
        const mobj = parseJSON (x)

        if (any (isNotNullObject) (mobj)) {
          const obj = fromJust<any> (mobj)

          return isRawSexRequirement (obj)
            ? Just (SexRequirement ({
                id: Nothing,
                value: obj .value,
              }))
            :  isRawRaceRequirement (obj)
            ? Just (RaceRequirement ({
                id: Nothing,
                value: Array.isArray (obj .value) ? fromArray (obj .value) : obj .value,
              }))
            : isRawCultureRequirement (obj)
            ? Just (CultureRequirement ({
                id: Nothing,
                value: Array.isArray (obj .value) ? fromArray (obj .value) : obj .value,
              }))
            : Nothing
        }

        return Nothing
      }
      catch (e) {
        return Nothing
      }
    })

export const stringToPrerequisites =
  mensureMapListOptional
    ("&")
    ("ProfessionRequireActivatable | ProfessionRequireIncreasable")
    ((x): Maybe<ProfessionPrerequisite> => {
      try {
        const mobj = parseJSON (x)

        if (any (isNotNullObject) (mobj)) {
          const obj = fromJust<any> (mobj)

          return isRawProfessionRequiringActivatable (obj)
            ? Just (RequireActivatable ({
                id: obj .id,
                active: obj .active,
                sid: Maybe (obj .sid),
                sid2: Maybe (obj .sid2),
                tier: Maybe (obj .tier),
              }) as Record<ProfessionRequireActivatable>)
            : isRawProfessionRequiringIncreasable (obj)
            ? Just (RequireIncreasable ({
                id: obj .id,
                value: obj .value,
              }) as Record<ProfessionRequireIncreasable>)
            : Nothing
        }

        return Nothing
      }
      catch (e) {
        return Nothing
      }
    })

const PSL = ProfessionSelectionsL

const stringToSelections =
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
      ((x): Maybe<AnyProfessionSelection> => {
        try {
          const mobj = parseJSON (x)

          if (any (isNotNullObject) (mobj)) {
            const obj = fromJust<any> (mobj)

            return isRawSpecializationSelection (obj)
              ? Just (SpecializationSelection ({
                  id: Nothing,
                  sid: Array.isArray (obj .sid) ? fromArray (obj .sid) : obj .sid,
                }))
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
              : isRawSecondCombatTechniquesSelection (obj)
              ? Just (CombatTechniquesSecondSelection ({
                  id: Nothing,
                  amount: obj .amount,
                  value: obj .value,
                  sid: fromArray (obj .sid),
                }))
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

          return Nothing
        }
        catch (e) {
          return Nothing
        }
      }),
    fmap (fmap (foldr (s => {
                        if (SpecializationSelection.is (s)) {
                          return set (PSL [ProfessionSelectionIds.SPECIALIZATION])
                                     (Just (s))
                        }

                        if (LanguagesScriptsSelection.is (s)) {
                          return set (PSL [ProfessionSelectionIds.LANGUAGES_SCRIPTS])
                                     (Just (s))
                        }

                        if (CombatTechniquesSelection.is (s)) {
                          return set (PSL [ProfessionSelectionIds.COMBAT_TECHNIQUES])
                                     (Just (s))
                        }

                        if (CombatTechniquesSecondSelection.is (s)) {
                          return set (PSL [ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND])
                                     (Just (s))
                        }

                        if (CantripsSelection.is (s)) {
                          return set (PSL [ProfessionSelectionIds.CANTRIPS])
                                     (Just (s))
                        }

                        if (CursesSelection.is (s)) {
                          return set (PSL [ProfessionSelectionIds.CURSES])
                                     (Just (s))
                        }

                        if (TerrainKnowledgeSelection.is (s)) {
                          return set (PSL [ProfessionSelectionIds.TERRAIN_KNOWLEDGE])
                                     (Just (s))
                        }

                        if (SkillsSelection.is (s)) {
                          return set (PSL [ProfessionSelectionIds.SKILLS])
                                     (Just (s))
                        }

                        return ident as ident<Record<ProfessionSelections>>
                      })
                      (ProfessionSelections.default)))
  )

export const stringToSpecialAbilities =
  mensureMapListOptional
    ("&")
    ("ProfessionRequireActivatable")
    ((x): Maybe<Record<ProfessionRequireActivatable>> => {
      try {
        const mobj = parseJSON (x)

        if (any (isNotNullObject) (mobj)) {
          const obj = fromJust<any> (mobj)

          return isRawProfessionRequiringActivatable (obj)
            ? Just (RequireActivatable ({
                id: obj .id,
                active: obj .active,
                sid: Maybe (obj .sid),
                sid2: Maybe (obj .sid2),
                tier: Maybe (obj .tier),
              }) as Record<ProfessionRequireActivatable>)
            : Nothing
        }

        return Nothing
      }
      catch (e) {
        return Nothing
      }
    })

const toNaturalNumberPairOptional =
  mensureMapPairListOptional ("&")
                             ("?")
                             (Expect.NaturalNumber)
                             (Expect.NaturalNumber)
                             (toNatural)
                             (toNatural)

export const stringToBlessings =
  mensureMapListBindAfterOptional<number>
    (ensure (pipe (flength, len => len === 9 || len === 12)))
    ("&")
    (`${Expect.List (Expect.NaturalNumber)} { length = 9 | 12 }`)
    (toNatural)

export const toProfession =
  mergeRowsById
    ("toProfession")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkOptionalUnivNaturalNumberList =
        lookupKeyValid (mensureMapNaturalListOptional ("&")) (TableType.Univ) (lookup_univ)

      const checkUnivNaturalNumber =
        lookupKeyValid (mensureMapNatural) (TableType.Univ) (lookup_univ)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const nameFemale = lookup_l10n ("nameFemale")

      const subname = lookup_l10n ("subname")

      const subnameFemale = lookup_l10n ("subnameFemale")

      const ecost =
        checkUnivNaturalNumber ("cost")

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

      const eprerequisitesL10n =
        lookupKeyValid (stringToPrerequisites)
                       (TableType.L10n)
                       (lookup_l10n)
                       ("prerequisites")

      const prerequisitesStart = lookup_l10n ("prerequisitesStart")

      const prerequisitesEnd = lookup_l10n ("prerequisitesEnd")

      const eselections =
        lookupKeyValid (stringToSelections)
                       (TableType.Univ)
                       (lookup_univ)
                       ("selections")

      const especialAbilities =
        lookupKeyValid (stringToSpecialAbilities)
                       (TableType.Univ)
                       (lookup_univ)
                       ("specialAbilities")

      const ecombatTechniques =
        lookupKeyValid (toNaturalNumberPairOptional)
                       (TableType.Univ)
                       (lookup_univ)
                       ("combatTechniques")

      const eskills =
        lookupKeyValid (toNaturalNumberPairOptional)
                       (TableType.Univ)
                       (lookup_univ)
                       ("skills")

      const espells =
        lookupKeyValid (toNaturalNumberPairOptional)
                       (TableType.Univ)
                       (lookup_univ)
                       ("spells")

      const eliturgicalChants =
        lookupKeyValid (toNaturalNumberPairOptional)
                       (TableType.Univ)
                       (lookup_univ)
                       ("liturgicalChants")

      const eblessings =
        lookupKeyValid (stringToBlessings)
                       (TableType.Univ)
                       (lookup_univ)
                       ("blessings")

      const esuggestedAdvantages =
        checkOptionalUnivNaturalNumberList ("suggestedAdvantages")

      const suggestedAdvantagesText =
        lookup_l10n ("suggestedAdvantages")

      const esuggestedDisadvantages =
        checkOptionalUnivNaturalNumberList ("suggestedDisadvantages")

      const suggestedDisadvantagesText =
        lookup_l10n ("suggestedDisadvantages")

      const eunsuitableAdvantages =
        checkOptionalUnivNaturalNumberList ("unsuitableAdvantages")

      const unsuitableAdvantagesText =
        lookup_l10n ("unsuitableAdvantages")

      const eunsuitableDisadvantages =
        checkOptionalUnivNaturalNumberList ("unsuitableDisadvantages")

      const unsuitableDisadvantagesText =
        lookup_l10n ("unsuitableDisadvantages")

      const evariants =
        checkOptionalUnivNaturalNumberList ("variants")

      const egr =
        checkUnivNaturalNumber ("gr")

      const esgr =
        checkUnivNaturalNumber ("sgr")

      const esrc = toSourceLinks (lookup_l10n)

      // Return error or result

      return mapMNamed
        ({
          ename,
          ecost,
          edependencies,
          eprerequisites,
          eprerequisitesL10n,
          eselections,
          especialAbilities,
          ecombatTechniques,
          eskills,
          espells,
          eliturgicalChants,
          eblessings,
          esuggestedAdvantages,
          esuggestedDisadvantages,
          eunsuitableAdvantages,
          eunsuitableDisadvantages,
          evariants,
          egr,
          esgr,
          esrc,
        })
        (rs => Profession ({
          id: prefixId (IdPrefixes.PROFESSIONS) (id),

          name:
            maybe<Profession["name"]> (rs.ename)
                                      ((f: string) => NameBySex ({ m: rs.ename, f }))
                                      (nameFemale),

          subname:
            fmap<string, Profession["name"]> (m => maybe<Profession["name"]>
                                               (m)
                                               ((f: string) => NameBySex ({ m, f }))
                                               (subnameFemale))
                                             (subname),

          ap: rs.ecost,

          dependencies:
            fromMaybe<Profession["dependencies"]> (empty) (rs.edependencies),

          prerequisites:
            fromMaybe<Profession["prerequisites"]> (empty) (rs.eprerequisites),

          prerequisitesStart,
          prerequisitesEnd,

          selections:
            fromMaybe<Profession["selections"]> (ProfessionSelections.default) (rs.eselections),

          specialAbilities:
            fromMaybe<Profession["specialAbilities"]> (empty) (rs.especialAbilities),

          combatTechniques:
            maybe<Profession["combatTechniques"]>
              (empty)
              (map (pairToIncreaseSkill (IdPrefixes.COMBAT_TECHNIQUES)))
              (rs.ecombatTechniques),

          skills:
            maybe<Profession["skills"]>
              (empty)
              (map (pairToIncreaseSkill (IdPrefixes.SKILLS)))
              (rs.eskills),

          spells:
            maybe<Profession["spells"]>
              (empty)
              (map (pairToIncreaseSkill (IdPrefixes.SPELLS)))
              (rs.espells),

          liturgicalChants:
            maybe<Profession["liturgicalChants"]>
              (empty)
              (map (pairToIncreaseSkill (IdPrefixes.LITURGICAL_CHANTS)))
              (rs.eliturgicalChants),

          blessings:
            maybe<Profession["blessings"]>
              (empty)
              (map (prefixId (IdPrefixes.BLESSINGS)))
              (rs.eblessings),

          suggestedAdvantages:
            maybePrefix (IdPrefixes.ADVANTAGES) (rs.esuggestedAdvantages),

          suggestedAdvantagesText,

          suggestedDisadvantages:
            maybePrefix (IdPrefixes.DISADVANTAGES) (rs.esuggestedDisadvantages),

          suggestedDisadvantagesText,

          unsuitableAdvantages:
            maybePrefix (IdPrefixes.ADVANTAGES) (rs.eunsuitableAdvantages),

          unsuitableAdvantagesText,

          unsuitableDisadvantages:
            maybePrefix (IdPrefixes.DISADVANTAGES) (rs.eunsuitableDisadvantages),

          unsuitableDisadvantagesText,

          isVariantRequired: Nothing,

          variants:
            maybePrefix (IdPrefixes.PROFESSION_VARIANTS) (rs.evariants),

          gr: rs.egr,
          subgr: rs.esgr,

          src: rs.esrc,

          category: Nothing,
        }))
    })
