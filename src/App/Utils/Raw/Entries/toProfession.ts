import { pipe } from "ramda";
import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { empty, fromArray, length, map } from "../../../../Data/List";
import { ensure, fmap, fromMaybe, fromNullable, Just, maybe, Maybe, Nothing } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
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
import { CombatTechniquesSecondSelection } from "../../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { SkillsSelection } from "../../../Models/Wiki/professionSelections/SkillsSelection";
import { SpecializationSelection } from "../../../Models/Wiki/professionSelections/SpecializationSelection";
import { TerrainKnowledgeSelection } from "../../../Models/Wiki/professionSelections/TerrainKnowledgeSelection";
import { pairToIncreaseSkill } from "../../../Models/Wiki/sub/IncreaseSkill";
import { NameBySex } from "../../../Models/Wiki/sub/NameBySex";
import { AnyProfessionSelection, ProfessionDependency, ProfessionPrerequisite } from "../../../Models/Wiki/wikiTypeHelpers";
import { prefixId } from "../../IDUtils";
import { toNatural } from "../../NumberUtils";
import { mergeRowsById } from "../mergeTableRows";
import { maybePrefix } from "../rawConversionUtils";
import { mensureMapListBindAfterOptional, mensureMapListOptional, mensureMapNatural, mensureMapNaturalListOptional, mensureMapNonEmptyString, mensureMapPairListOptional } from "../validateMapValueUtils";
import { allRights, Expect, lookupKeyValid } from "../validateValueUtils";
import { isRawProfessionRequiringActivatable } from "./Prerequisites/ActivatableRequirement";
import { isRawCultureRequirement } from "./Prerequisites/CultureRequirement";
import { isRawProfessionRequiringIncreasable } from "./Prerequisites/IncreasableRequirement";
import { isRawRaceRequirement } from "./Prerequisites/RaceRequirement";
import { isRawSexRequirement } from "./Prerequisites/SexRequirement";
import { isRawCantripsSelection } from "./ProfessionSelections/CantripsSelection";
import { isRawCombatTechniquesSelection } from "./ProfessionSelections/CombatTechniquesSelection";
import { isRawCursesSelection } from "./ProfessionSelections/CursesSelection";
import { isRawLanguagesScriptsSelection } from "./ProfessionSelections/LanguagesScriptsSelection";
import { isRawSecondCombatTechniquesSelection } from "./ProfessionSelections/SecondCombatTechniquesSelection";
import { isRawSkillsSelection } from "./ProfessionSelections/SkillsSelection";
import { isRawSpecializationSelection } from "./ProfessionSelections/SpecializationSelection";
import { isRawTerrainKnowledgeSelection } from "./ProfessionSelections/TerrainKnowledgeSelection";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

export const stringToDependencies =
  mensureMapListOptional
    ("&")
    ("SexRequirement | RaceRequirement | CultureRequirement")
    ((x): Maybe<ProfessionDependency> => {
      try {
        const obj = JSON.parse (x)

        if (typeof obj !== "object" || obj === null) return Nothing

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
        const obj = JSON.parse (x)

        if (typeof obj !== "object" || obj === null) return Nothing

        return isRawProfessionRequiringActivatable (obj)
          ? Just (RequireActivatable ({
              id: obj .id,
              active: obj .active,
              sid: fromNullable (obj .sid),
              sid2: fromNullable (obj .sid2),
              tier: fromNullable (obj .tier),
            }) as Record<ProfessionRequireActivatable>)
          : isRawProfessionRequiringIncreasable (obj)
          ? Just (RequireIncreasable ({
              id: obj .id,
              value: obj .value,
            }) as Record<ProfessionRequireIncreasable>)
          : Nothing
      }
      catch (e) {
        return Nothing
      }
    })

const stringToSelections =
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
        const obj = JSON.parse (x)

        if (typeof obj !== "object" || obj === null) return Nothing

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
      catch (e) {
        return Nothing
      }
    })

export const stringToSpecialAbilities =
  mensureMapListOptional
    ("&")
    ("ProfessionRequireActivatable")
    ((x): Maybe<Record<ProfessionRequireActivatable>> => {
      try {
        const obj = JSON.parse (x)

        if (typeof obj !== "object" || obj === null) return Nothing

        return isRawProfessionRequiringActivatable (obj)
          ? Just (RequireActivatable ({
              id: obj .id,
              active: obj .active,
              sid: fromNullable (obj .sid),
              sid2: fromNullable (obj .sid2),
              tier: fromNullable (obj .tier),
            }) as Record<ProfessionRequireActivatable>)
          : Nothing
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
  mensureMapListBindAfterOptional (ensure (pipe (length, len => len === 9 || len === 12)))
                                  ("&")
                                  (`${Expect.List (Expect.NaturalNumber)} { length = 9 | 12 }`)
                                  (toNatural)

export const toProfession =
  mergeRowsById
    ("toProfession")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (mensureMapNonEmptyString)

      const checkOptionalUnivNaturalNumberList =
        lookupKeyValid (lookup_univ) (mensureMapNaturalListOptional ("&"))

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (mensureMapNatural)

      // Check fields

      const ename =
        checkL10nNonEmptyString ("name")

      const nameFemale = lookup_l10n ("nameFemale")

      const subname = lookup_l10n ("subname")

      const subnameFemale = lookup_l10n ("subnameFemale")

      const ecost =
        checkUnivNaturalNumber ("cost")

      const edependencies =
        lookupKeyValid (lookup_univ)
                       (stringToDependencies)
                       ("dependencies")

      const eprerequisites =
        lookupKeyValid (lookup_univ)
                       (stringToPrerequisites)
                       ("prerequisites")

      const eprerequisitesL10n =
        lookupKeyValid (lookup_l10n)
                       (stringToPrerequisites)
                       ("prerequisites")

      const prerequisitesStart = lookup_l10n ("prerequisitesStart")

      const prerequisitesEnd = lookup_l10n ("prerequisitesEnd")

      const eselections =
        lookupKeyValid (lookup_univ)
                       (stringToSelections)
                       ("selections")

      const especialAbilities =
        lookupKeyValid (lookup_univ)
                       (stringToSpecialAbilities)
                       ("specialAbilities")

      const ecombatTechniques =
        lookupKeyValid (lookup_univ)
                       (toNaturalNumberPairOptional)
                       ("combatTechniques")

      const eskills =
        lookupKeyValid (lookup_univ)
                       (toNaturalNumberPairOptional)
                       ("skills")

      const espells =
        lookupKeyValid (lookup_univ)
                       (toNaturalNumberPairOptional)
                       ("spells")

      const eliturgicalChants =
        lookupKeyValid (lookup_univ)
                       (toNaturalNumberPairOptional)
                       ("liturgicalChants")

      const eblessings =
        lookupKeyValid (lookup_univ)
                       (stringToBlessings)
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

      const esrc = lookupValidSourceLinks (lookup_l10n)

      // Return error or result

      return allRights
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
            fromMaybe<Profession["selections"]> (empty) (rs.eselections),

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

          src: toSourceLinks (rs.esrc),

          category: Nothing,
        }))
    })
