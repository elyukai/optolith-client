import { equals } from "../../../../Data/Eq";
import { ident } from "../../../../Data/Function";
import { fmap } from "../../../../Data/Functor";
import { set } from "../../../../Data/Lens";
import { append, empty, flength, foldr, fromArray, List, map, notNull, splitOn } from "../../../../Data/List";
import { altF_, any, bindF, ensure, fromJust, fromMaybe, isJust, joinMaybeList, Just, mapM, maybe, Maybe, Nothing, Some } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { parseJSON } from "../../../../Data/String/JSON";
import { traceShowBoth } from "../../../../Debug/Trace";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { ProfessionRequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { CultureRequirement } from "../../../Models/Wiki/prerequisites/CultureRequirement";
import { ProfessionRequireIncreasable } from "../../../Models/Wiki/prerequisites/IncreasableRequirement";
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
import { pairToIncreaseSkillOrList } from "../../../Models/Wiki/sub/IncreaseSkillList";
import { NameBySex } from "../../../Models/Wiki/sub/NameBySex";
import { AnyProfessionSelection, ProfessionDependency, ProfessionPrerequisite, ProfessionSelectionIds } from "../../../Models/Wiki/wikiTypeHelpers";
import { prefixCantrip, prefixCT, prefixId, prefixSA } from "../../IDUtils";
import { toNatural } from "../../NumberUtils";
import { pipe, pipe_ } from "../../pipe";
import { mergeRowsById } from "../mergeTableRows";
import { maybePrefix, modifyNegIntNoBreak } from "../rawConversionUtils";
import { Expect } from "../showExpected";
import { mensureMapBoolean, mensureMapListBindAfterOptional, mensureMapListOptional, mensureMapNatural, mensureMapNaturalListOptional, mensureMapNaturalOptional, mensureMapNonEmptyString, mensureMapPairListOptional } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamedPred, mapTotalPred, TableType } from "../validateValueUtils";
import { isRawProfessionRequiringActivatable } from "./Prerequisites/RawActivatableRequirement";
import { isRawCultureRequirement } from "./Prerequisites/RawCultureRequirement";
import { isRawProfessionRequiringIncreasable } from "./Prerequisites/RawIncreasableRequirement";
import { isRawRaceRequirement, toRaceRequirement } from "./Prerequisites/RawRaceRequirement";
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

const isNotNullObject = (x: Some): x is object => typeof x === "object" && x !== null

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
            : isRawRaceRequirement (obj)
            ? Just (toRaceRequirement (obj))
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
            ? Just (ProfessionRequireActivatable ({
                id: obj .id,
                active: fromMaybe (true) (Maybe (obj .active)),
                sid: Maybe (obj .sid),
                sid2: Maybe (obj .sid2),
                tier: Maybe (obj .tier),
              }))
            : isRawProfessionRequiringIncreasable (obj)
            ? Just (ProfessionRequireIncreasable ({
                id: obj .id,
                value: obj .value,
              }))
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
                  sid: fromArray (obj .sid .map (prefixCT)),
                }))
              : isRawSecondCombatTechniquesSelection (obj)
              ? Just (CombatTechniquesSecondSelection ({
                  id: Nothing,
                  amount: obj .amount,
                  value: obj .value,
                  sid: fromArray (obj .sid .map (prefixCT)),
                }))
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
              : (traceShowBoth ("Invalid selection: ") (obj), Nothing)
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
            ? Just (ProfessionRequireActivatable ({
                id: obj .id,
                active: fromMaybe (true) (Maybe (obj .active)),
                sid: Maybe (obj .sid),
                sid2: Maybe (obj .sid2),
                tier: Maybe (obj .tier),
              }))
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

const toNaturalNumberOrNumberListPairOptional =
  mensureMapPairListOptional ("&")
                             ("?")
                             (Expect.Union (
                               Expect.NaturalNumber,
                               Expect.NonEmptyList (Expect.NaturalNumber)
                             ))
                             (Expect.NaturalNumber)
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
                             (toNatural)

export const stringToBlessings =
  mensureMapListBindAfterOptional<number>
    (ensure (pipe (flength, len => len === 6 || len === 9 || len === 12)))
    ("&")
    (`${Expect.List (Expect.NaturalNumber)} { length = 6 | 9 | 12 }`)
    (toNatural)

const PA = Profession.A

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

      const checkOptionalUnivNaturalNumber =
        lookupKeyValid (mensureMapNaturalOptional) (TableType.Univ) (lookup_univ)

      const checkUnivBoolean =
        lookupKeyValid (mensureMapBoolean) (TableType.Univ) (lookup_univ)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const nameFemale = lookup_l10n ("nameFemale")

      const subname = lookup_l10n ("subname")

      const subnameFemale = lookup_l10n ("subnameFemale")

      const ecost = checkOptionalUnivNaturalNumber ("cost")

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

      const eisVariantRequired =
        checkUnivBoolean ("isVariantRequired")

      const evariants =
        checkOptionalUnivNaturalNumberList ("variants")

      const egr =
        checkUnivNaturalNumber ("gr")

      const esgr =
        checkUnivNaturalNumber ("sgr")

      const esrc = toSourceLinks (lookup_l10n)

      // Return error or result

      return mapMNamedPred
        <Record<Profession>>
        (mapTotalPred ("Either ap must be set or isVariantRequired must be true.")
                      (x => isJust (PA.ap (x))
                            || PA.isVariantRequired (x) && notNull (PA.variants (x))))
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
          eisVariantRequired,
          evariants,
          egr,
          esgr,
          esrc,
        })
        (rs => {
          const prerequisites = append (joinMaybeList (rs.eprerequisites))
                                       (joinMaybeList (rs.eprerequisitesL10n))

          const is_guild_mage_tradition_add =
            List.any ((x: ProfessionPrerequisite) =>
                            ProfessionRequireActivatable.is (x)
                            && ProfessionRequireActivatable.A.id (x) === prefixSA (70))
                     (prerequisites)
            && any (List.any (pipe (ProfessionRequireActivatable.A.id, equals (prefixSA (70)))))
                   (rs.especialAbilities)

          const selections = fromMaybe (ProfessionSelections.default) (rs.eselections)

          return Profession ({
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

            prerequisites,

            prerequisitesStart: fmap (modifyNegIntNoBreak) (prerequisitesStart),
            prerequisitesEnd: fmap (modifyNegIntNoBreak) (prerequisitesEnd),

            selections:
              is_guild_mage_tradition_add
                ? set (PSL[ProfessionSelectionIds.GUILD_MAGE_UNFAMILIAR_SPELL]) (true) (selections)
                : selections,

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
                (map (pairToIncreaseSkillOrList (IdPrefixes.SPELLS)))
                (rs.espells),

            liturgicalChants:
              maybe<Profession["liturgicalChants"]>
                (empty)
                (map (pairToIncreaseSkillOrList (IdPrefixes.LITURGICAL_CHANTS)))
                (rs.eliturgicalChants),

            blessings:
              maybe<Profession["blessings"]>
                (empty)
                (map (prefixId (IdPrefixes.BLESSINGS)))
                (rs.eblessings),

            suggestedAdvantages:
              maybePrefix (IdPrefixes.ADVANTAGES) (rs.esuggestedAdvantages),

            suggestedAdvantagesText: fmap (modifyNegIntNoBreak) (suggestedAdvantagesText),

            suggestedDisadvantages:
              maybePrefix (IdPrefixes.DISADVANTAGES) (rs.esuggestedDisadvantages),

            suggestedDisadvantagesText: fmap (modifyNegIntNoBreak) (suggestedDisadvantagesText),

            unsuitableAdvantages:
              maybePrefix (IdPrefixes.ADVANTAGES) (rs.eunsuitableAdvantages),

            unsuitableAdvantagesText: fmap (modifyNegIntNoBreak) (unsuitableAdvantagesText),

            unsuitableDisadvantages:
              maybePrefix (IdPrefixes.DISADVANTAGES) (rs.eunsuitableDisadvantages),

            unsuitableDisadvantagesText: fmap (modifyNegIntNoBreak) (unsuitableDisadvantagesText),

            isVariantRequired: rs.eisVariantRequired,

            variants:
              maybePrefix (IdPrefixes.PROFESSION_VARIANTS) (rs.evariants),

            gr: rs.egr,
            subgr: rs.esgr,

            src: rs.esrc,

            category: Nothing,
          })
        })
    })
