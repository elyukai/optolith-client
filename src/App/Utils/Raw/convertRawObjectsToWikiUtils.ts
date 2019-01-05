
import { pipe } from "ramda";
import { Categories, IncreasableCategories } from "../../../constants/Categories";
import { IdPrefixes } from "../../../constants/IdPrefixes";
import { elem_, List } from "../../../Data/List";
import { fmap, fromNullable, Just, Maybe, Nothing, or } from "../../../Data/Maybe";
import { Pair } from "../../../Data/Pair";
import { Record } from "../../../Data/Record";
import * as Raw from "../../../types/rawdata";
import { ProfessionRequireActivatable, RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { CultureRequirement } from "../../Models/Wiki/prerequisites/CultureRequirement";
import { ProfessionRequireIncreasable, RequireIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { PactRequirement } from "../../Models/Wiki/prerequisites/PactRequirement";
import { RequirePrimaryAttribute } from "../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { RaceRequirement } from "../../Models/Wiki/prerequisites/RaceRequirement";
import { SexRequirement } from "../../Models/Wiki/prerequisites/SexRequirement";
import { CantripsSelection } from "../../Models/Wiki/professionSelections/CantripsSelection";
import { CombatTechniquesSelection } from "../../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { CursesSelection } from "../../Models/Wiki/professionSelections/CursesSelection";
import { LanguagesScriptsSelection } from "../../Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { RemoveCombatTechniquesSelection, VariantCombatTechniquesSelection } from "../../Models/Wiki/professionSelections/RemoveCombatTechniquesSelection";
import { RemoveCombatTechniquesSecondSelection, VariantCombatTechniquesSecondSelection } from "../../Models/Wiki/professionSelections/RemoveSecondCombatTechniquesSelection";
import { RemoveSpecializationSelection, VariantSpecializationSelection } from "../../Models/Wiki/professionSelections/RemoveSpecializationSelection";
import { CombatTechniquesSecondSelection } from "../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { SkillsSelection } from "../../Models/Wiki/professionSelections/SkillsSelection";
import { SpecializationSelection } from "../../Models/Wiki/professionSelections/SpecializationSelection";
import { TerrainKnowledgeSelection } from "../../Models/Wiki/professionSelections/TerrainKnowledgeSelection";
import { Application } from "../../Models/Wiki/sub/Application";
import { IncreaseSkill } from "../../Models/Wiki/sub/IncreaseSkill";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { AllRequirementObjects, AllRequirements, AnyProfessionSelection, AnyProfessionVariantSelection, ProfessionDependency, ProfessionPrerequisite, ProfessionSelectionList, ProfessionVariantSelectionList } from "../../Models/Wiki/wikiTypeHelpers";
import { getCategoryById, prefixRawId } from "../IDUtils";

const isRawSexRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawSexRequirement =>
    req.id === "SEX"

const isRawRaceRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawRaceRequirement =>
    req.id === "RACE"

const isRawCultureRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawCultureRequirement =>
    req.id === "CULTURE"

const isRawPactRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawPactRequirement =>
    req.id === "PACT"

const isRawRequiringPrimaryAttribute =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawRequiresPrimaryAttribute =>
    req.id === "ATTR_PRIMARY"

const isRawRequiringIncreasable =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawRequiresIncreasableObject => {
    const id = req.id

    if (typeof id === "object") {
      return req.hasOwnProperty ("value") && id.every (pipe (
        getCategoryById,
        (category: Maybe<Categories>) =>
          or (fmap (elem_ (IncreasableCategories)) (category))
      ))
    }
    else {
      const category = getCategoryById (id)

      return req.hasOwnProperty ("value")
        && or (fmap (elem_ (IncreasableCategories)) (category))
    }
  }

type RawRaceOrCultureRequirement =
  Raw.RawRaceRequirement |
  Raw.RawCultureRequirement

type RaceOrCultureRequirement<T extends RawRaceOrCultureRequirement> =
  T["id"] extends "RACE" ? RaceRequirement : CultureRequirement

const convertRawRaceCultureRequirement =
  <T extends RawRaceOrCultureRequirement>(e: T): RaceOrCultureRequirement<T> =>
    ({
      id: e.id,
      value: typeof e.value === "object" ? List.fromArray (e.value) : e.value,
    }) as any as RaceOrCultureRequirement<T>

const convertRawPactRequirement =
  (e: Raw.RawPactRequirement): PactRequirement => {
    if (typeof e.domain === "object") {
      return {
        ...e,
        level: fromNullable (e .level),
        domain: Just (List.fromArray (e.domain)),
      }
    }
    else {
      return {
        ...e,
        level: fromNullable (e .level),
        domain: fromNullable (e .domain),
      } as PactRequirement
    }
  }

const convertRawRequireIncreasable =
  (e: Raw.RawRequiresIncreasableObject): RequireIncreasable =>
    ({
      ...e,
      id: typeof e.id === "object" ? List.fromArray (e.id) : e.id,
    })

const convertRawRequireActivatable =
  (e: Raw.RawRequiresActivatableObject): RequireActivatable => {
    const { id, ...other } = e

    const res = {
      ...other,
      id: typeof e.id === "object" ? List.fromArray (e.id) : e.id,
    }

    if (typeof res .sid === "object") {
      return {
        ...res,
        sid: Just (List.fromArray (res .sid)),
        sid2: fromNullable (res .sid2),
        tier: fromNullable (res .tier),
      }
    }
    else {
      return {
        ...res,
        sid: fromNullable (res .sid),
        sid2: fromNullable (res .sid2),
        tier: fromNullable (res .tier),
      } as RequireActivatable
    }
  }

export const convertRawProfessionRequireActivatable =
  (e: Raw.RawProfessionRequiresActivatableObject):
    Record<ProfessionRequireActivatable> =>
    RequireActivatable (convertRawRequireActivatable (e)) as
      Record<ProfessionRequireActivatable>

const convertRawProfessionDependencyObject =
  (e: Raw.RawProfessionDependency): ProfessionDependency =>
    isRawSexRequirement (e)
      ? SexRequirement (e)
      : isRawRaceRequirement (e)
      ? RaceRequirement (convertRawRaceCultureRequirement (e))
      : CultureRequirement (convertRawRaceCultureRequirement (e))

const convertRawProfessionPrerequisiteObject =
  (e: Raw.RawProfessionPrerequisite): ProfessionPrerequisite => {
    if (isRawRequiringIncreasable (e)) {
      return RequireIncreasable (convertRawRequireIncreasable (e)) as
        Record<ProfessionRequireIncreasable>
    }
    else {
      return RequireActivatable (convertRawRequireActivatable (e)) as
        Record<ProfessionRequireActivatable>
    }
  }

const convertRawPrerequisiteObject =
  (e: Raw.AllRawRequirementObjects): AllRequirementObjects => {
    if (isRawSexRequirement (e)) {
      return SexRequirement (e)
    }
    else if (isRawRaceRequirement (e)) {
      return RaceRequirement (convertRawRaceCultureRequirement (e))
    }
    else if (isRawCultureRequirement (e)) {
      return CultureRequirement (convertRawRaceCultureRequirement (e))
    }
    else if (isRawPactRequirement (e)) {
      return PactRequirement (convertRawPactRequirement (e))
    }
    else if (isRawRequiringPrimaryAttribute (e)) {
      return RequirePrimaryAttribute (e)
    }
    else if (isRawRequiringIncreasable (e)) {
      return RequireIncreasable (convertRawRequireIncreasable (e))
    }
    else {
      return RequireActivatable (convertRawRequireActivatable (e))
    }
  }

export const convertRawProfessionDependencyObjects =
  (arr: Raw.RawProfessionDependency[]): List<ProfessionDependency> =>
    List.fromArray (arr .map (convertRawProfessionDependencyObject))

export const convertRawProfessionPrerequisiteObjects =
  (arr: Raw.RawProfessionPrerequisite[]): List<ProfessionPrerequisite> =>
    List.fromArray (arr .map (convertRawProfessionPrerequisiteObject))

export const convertRawPrerequisiteObjects =
  (arr: Raw.AllRawRequirementObjects[]): List<AllRequirementObjects> =>
    List.fromArray (arr .map (convertRawPrerequisiteObject))

export const convertRawPrerequisites =
  (arr: Raw.AllRawRequirements[]): List<AllRequirements> =>
    List.fromArray (arr.map (
      e => e === "RCP" ? "RCP" : convertRawPrerequisiteObject (e)
    ))

interface ApplicationName {
  id: number
  name: string
}

export const convertRawApplications = (
  locale: Raw.RawSkillLocale["spec"],
  data?: Raw.RawSkill["applications"]
) =>
  locale .length === 0
    ? Nothing
    : Just (Maybe.mapMaybe<ApplicationName, Record<Application>>
      (app => {
        if (app.id < 0) {
          const prerequisitesElem = data && data.find (e => app.id === e.id)

          if (typeof prerequisitesElem === "object") {
            const { name: appName } = app
            const { id: appId, prerequisites } = prerequisitesElem

            return Just (Application ({
              id: appId,
              name: appName,
              prerequisites: Just (convertRawPrerequisiteObjects (prerequisites)),
            }))
          }

          return Nothing
        }

        return Just (Application (app))
      })
      (List.fromArray (locale)))

const convertRawSelection = (e: Raw.RawSelectionObject) =>
  SelectOption ({
    ...e,
    cost: fromNullable (e .cost),
    prerequisites: fmap (convertRawPrerequisiteObjects) (fromNullable (e.prerequisites)),
    // TODO: MAKE SURE THE FOLLOWING CAN BE DELETED
    // applications: e.applications && List.fromArray (e.applications.map (
    //   app => app.prerequisites
    //     ? Record.of<Application> ({
    //       ...app,
    //       prerequisites:
    //         convertRawPrerequisiteObjects (app.prerequisites),
    //     })
    //     : Record.of (app) as Record<Application>
    // )),
    // spec: e.spec && List.fromArray (e.spec),
    target: fromNullable (e .target),
    tier: fromNullable (e .tier),
    talent: fmap<[string, number], Pair<string, number>> (Pair.fromArray) (fromNullable (e.talent)),
    gr: fromNullable (e .gr),
  })

export const convertRawSelections =
  (locale?: Raw.RawSelectionObject[]) =>
  (data?: Raw.RawSelectionObject[]): Maybe<List<Record<SelectOption>>> =>
    locale !== undefined
      ? data
        ? Just (List.fromArray (
          locale.map (
              e => convertRawSelection ({
                ...data.find (n => n.id === e.id),
                ...e,
              })
            )
          ))
        : Just (List.fromArray (locale.map (convertRawSelection)))
      : Nothing

export const convertRawIncreaseSkills =
  (prefix: IdPrefixes) => (raw: [string, number][]): List<Record<IncreaseSkill>> =>
    List.fromArray (raw.map (e => IncreaseSkill ({
      id: prefixRawId (prefix) (e [0]),
      value: e [1],
    })))

export const mapRawWithPrefix = (prefix: IdPrefixes) => (list: string[]): List<string> =>
  List.fromArray (list .map (prefixRawId (prefix)))

const convertRawSpecializationSelection =
  (raw: Raw.RawSpecializationSelection): Record<SpecializationSelection> =>
    SpecializationSelection ({
      ...raw,
      sid: typeof raw.sid === "object" ? List.fromArray (raw.sid) : raw.sid,
    })

const convertRawLanguagesScriptsSelection = LanguagesScriptsSelection

const convertRawCombatTechniquesSelection =
  (raw: Raw.RawCombatTechniquesSelection): Record<CombatTechniquesSelection> =>
    CombatTechniquesSelection ({
      ...raw,
      sid: List.fromArray (raw .sid),
    })

const convertRawCombatTechniquesSecondSelection =
  (raw: Raw.RawCombatTechniquesSecondSelection): Record<CombatTechniquesSecondSelection> =>
    CombatTechniquesSecondSelection ({
      ...raw,
      sid: List.fromArray (raw .sid),
    })

const convertRawCantripsSelection =
  (raw: Raw.RawCantripsSelection): Record<CantripsSelection> =>
    CantripsSelection ({
      ...raw,
      sid: List.fromArray (raw .sid),
    })

const convertRawCursesSelection = CursesSelection

const convertRawSkillsSelection =
  (raw: Raw.RawSkillsSelection): Record<SkillsSelection> =>
    SkillsSelection ({
      ...raw,
      gr: fromNullable (raw .gr),
    })

const convertRawTerrainKnowledgeSelection =
  (raw: Raw.RawTerrainKnowledgeSelection): Record<TerrainKnowledgeSelection> =>
    TerrainKnowledgeSelection ({
      ...raw,
      sid: List.fromArray (raw .sid),
    })

const convertRawProfessionSelection =
  (data: Raw.RawProfessionSelection): AnyProfessionSelection => {
    if (data.id === "SPECIALISATION") {
      return convertRawSpecializationSelection (data)
    }
    else if (data.id === "LANGUAGES_SCRIPTS") {
      return convertRawLanguagesScriptsSelection (data)
    }
    else if (data.id === "COMBAT_TECHNIQUES") {
      return convertRawCombatTechniquesSelection (data)
    }
    else if (data.id === "COMBAT_TECHNIQUES_SECOND") {
      return convertRawCombatTechniquesSecondSelection (data)
    }
    else if (data.id === "CANTRIPS") {
      return convertRawCantripsSelection (data)
    }
    else if (data.id === "CURSES") {
      return convertRawCursesSelection (data)
    }
    else if (data.id === "SKILLS") {
      return convertRawSkillsSelection (data)
    }
    else {
      return convertRawTerrainKnowledgeSelection (data as Raw.RawTerrainKnowledgeSelection)
    }
  }

export const convertRawProfessionSelections =
  (data: Raw.RawProfessionSelections): ProfessionSelectionList =>
    List.fromArray (data .map (convertRawProfessionSelection))

const isRawRemoveSpecializationSelection =
  (raw: Raw.RawVariantSpecializationSelection): raw is Raw.RawRemoveSpecializationSelection =>
    raw .hasOwnProperty ("active")

const convertRawVariantSpecializationSelectionRecord =
  (raw: Raw.RawVariantSpecializationSelection): VariantSpecializationSelection =>
    isRawRemoveSpecializationSelection (raw)
      ? RemoveSpecializationSelection
      : convertRawSpecializationSelection (raw)

const isRawRemoveCombatTechniquesSelection =
  (raw: Raw.RawVariantCombatTechniquesSelection): raw is Raw.RawRemoveCombatTechniquesSelection =>
    raw .hasOwnProperty ("active")

const convertRawVariantCombatTechniquesSelectionRecord =
  (raw: Raw.RawVariantCombatTechniquesSelection): VariantCombatTechniquesSelection =>
    isRawRemoveCombatTechniquesSelection (raw)
      ? RemoveCombatTechniquesSelection
      : convertRawCombatTechniquesSelection (raw)

const isRawRemoveCombatTechniquesSecondSelection =
  (raw: Raw.RawVariantCombatTechniquesSecondSelection):
    raw is Raw.RawRemoveCombatTechniquesSecondSelection =>
    raw .hasOwnProperty ("active")

const convertRawVariantCombatTechniquesSecondSelectionRecord =
  (raw: Raw.RawVariantCombatTechniquesSecondSelection):
    VariantCombatTechniquesSecondSelection =>
      isRawRemoveCombatTechniquesSecondSelection (raw)
        ? RemoveCombatTechniquesSecondSelection
        : convertRawCombatTechniquesSecondSelection (raw)

const convertRawProfessionVariantSelection =
  (data: Raw.RawProfessionVariantSelection): AnyProfessionVariantSelection => {
    if (data.id === "SPECIALISATION") {
      return convertRawVariantSpecializationSelectionRecord (data)
    }
    else if (data.id === "LANGUAGES_SCRIPTS") {
      return convertRawLanguagesScriptsSelection (data)
    }
    else if (data.id === "COMBAT_TECHNIQUES") {
      return convertRawVariantCombatTechniquesSelectionRecord (data)
    }
    else if (data.id === "COMBAT_TECHNIQUES_SECOND") {
      return convertRawVariantCombatTechniquesSecondSelectionRecord (data)
    }
    else if (data.id === "CANTRIPS") {
      return convertRawCantripsSelection (data)
    }
    else if (data.id === "CURSES") {
      return convertRawCursesSelection (data)
    }
    else if (data.id === "SKILLS") {
      return convertRawSkillsSelection (data)
    }
    else {
      return convertRawTerrainKnowledgeSelection (data as Raw.RawTerrainKnowledgeSelection)
    }
  }

export const convertRawProfessionVariantSelections =
  (data: Raw.RawProfessionVariantSelections): ProfessionVariantSelectionList =>
    List.fromArray (data .map (convertRawProfessionVariantSelection))
