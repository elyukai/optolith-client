import * as R from 'ramda';
import * as Categories from '../../constants/Categories';
import { IdPrefixes } from '../../constants/IdPrefixes';
import * as Raw from '../../types/rawdata';
import * as Wiki from '../../types/wiki';
import { getCategoryById, prefixRawId } from '../IDUtils';
import { List } from '../structures/List';
import { fmap, fromJust, fromNullable, isJust, Just, Maybe, Nothing } from '../structures/Maybe';
import { Pair } from '../structures/Pair';
import { Record } from '../structures/Record';
import { createRequireActivatable } from '../wikiData/prerequisites/ActivatableRequirementCreator';
import { createCultureRequirement } from '../wikiData/prerequisites/CultureRequirementCreator';
import { createRequireIncreasable } from '../wikiData/prerequisites/IncreasableRequirementCreator';
import { createPactRequirement } from '../wikiData/prerequisites/PactRequirementCreator';
import { createRequirePrimaryAttribute } from '../wikiData/prerequisites/PrimaryAttributeRequirementCreator';
import { createRaceRequirement } from '../wikiData/prerequisites/RaceRequirementCreator';
import { createSexRequirement } from '../wikiData/prerequisites/SexRequirementCreator';
import { createCantripsSelection } from '../wikiData/professionSelections/CantripsSelectionCreator';
import { createCombatTechniquesSelection } from '../wikiData/professionSelections/CombatTechniquesSelectionCreator';
import { createCursesSelection } from '../wikiData/professionSelections/CursesSelectionCreator';
import { createLanguagesScriptsSelection } from '../wikiData/professionSelections/LanguagesScriptsSelectionCreator';
import { createRemoveCombatTechniquesSelection } from '../wikiData/professionSelections/RemoveCombatTechniquesSelectionCreator';
import { createRemoveCombatTechniquesSecondSelection } from '../wikiData/professionSelections/RemoveSecondCombatTechniquesSelectionCreator';
import { createRemoveSpecializationSelection } from '../wikiData/professionSelections/RemoveSpecializationSelectionCreator';
import { createCombatTechniquesSecondSelection } from '../wikiData/professionSelections/SecondCombatTechniquesSelectionCreator';
import { createSkillsSelectionWithGroup } from '../wikiData/professionSelections/SkillsSelectionCreator';
import { createSpecializationSelection } from '../wikiData/professionSelections/SpecializationSelectionCreator';
import { createTerrainKnowledgeSelection } from '../wikiData/professionSelections/TerrainKnowledgeSelectionCreator';
import { createApplication } from '../wikiData/sub/ApplicationCreator';
import { createIncreaseSkill } from '../wikiData/sub/IncreaseSkillCreator';
import { createSelectOption } from '../wikiData/sub/SelectOptionCreator';

const isRawSexRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawSexRequirement =>
    req.id === 'SEX'

const isRawRaceRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawRaceRequirement =>
    req.id === 'RACE'

const isRawCultureRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawCultureRequirement =>
    req.id === 'CULTURE'

const isRawPactRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawPactRequirement =>
    req.id === 'PACT'

const isRawRequiringPrimaryAttribute =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawRequiresPrimaryAttribute =>
    req.id === 'ATTR_PRIMARY'

const isRawRequiringIncreasable =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawRequiresIncreasableObject => {
    const id = req.id

    if (typeof id === 'object') {
      return req.hasOwnProperty ('value') && id.every (R.pipe (
        getCategoryById,
        (category: Maybe<Categories.Categories>) => isJust (category) &&
          Categories.IncreasableCategories.elem (
            fromJust (category) as Categories.IncreasableCategory
          )
      ))
    }
    else {
      const category = getCategoryById (id)

      return req.hasOwnProperty ('value') && isJust (category) &&
        Categories.IncreasableCategories.elem (
          fromJust (category) as Categories.IncreasableCategory
        )
    }
  }

type RawRaceOrCultureRequirement =
  Raw.RawRaceRequirement |
  Raw.RawCultureRequirement

type RaceOrCultureRequirement<T extends RawRaceOrCultureRequirement> =
  T['id'] extends 'RACE' ? Wiki.RaceRequirement : Wiki.CultureRequirement

const convertRawRaceCultureRequirement =
  <T extends RawRaceOrCultureRequirement>(e: T): RaceOrCultureRequirement<T> =>
    ({
      id: e.id,
      value: typeof e.value === 'object' ? List.fromArray (e.value) : e.value,
    }) as any as RaceOrCultureRequirement<T>

const convertRawPactRequirement =
  (e: Raw.RawPactRequirement): Wiki.PactRequirement => {
    if (typeof e.domain === 'object') {
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
      } as Wiki.PactRequirement
    }
  }

const convertRawRequiresIncreasableObject =
  (e: Raw.RawRequiresIncreasableObject): Wiki.RequiresIncreasableObject =>
    ({
      ...e,
      id: typeof e.id === 'object' ? List.fromArray (e.id) : e.id,
    })

const convertRawRequiresActivatableObject =
  (e: Raw.RawRequiresActivatableObject): Wiki.RequiresActivatableObject => {
    const { id, ...other } = e

    const res = {
      ...other,
      id: typeof e.id === 'object' ? List.fromArray (e.id) : e.id,
    }

    if (typeof res .sid === 'object') {
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
      } as Wiki.RequiresActivatableObject
    }
  }

export const convertRawProfessionRequiresActivatableObject =
  (e: Raw.RawProfessionRequiresActivatableObject):
    Record<Wiki.ProfessionRequiresActivatableObject> =>
    createRequireActivatable (convertRawRequiresActivatableObject (e)) as
      Record<Wiki.ProfessionRequiresActivatableObject>

const convertRawProfessionDependencyObject =
  (e: Raw.RawProfessionDependency): Wiki.ProfessionDependency =>
    isRawSexRequirement (e)
      ? createSexRequirement (e .value)
      : isRawRaceRequirement (e)
      ? createRaceRequirement (convertRawRaceCultureRequirement (e) .value)
      : createCultureRequirement (convertRawRaceCultureRequirement (e) .value)

const convertRawProfessionPrerequisiteObject =
  (e: Raw.RawProfessionPrerequisite): Wiki.ProfessionPrerequisite => {
    if (isRawRequiringIncreasable (e)) {
      return createRequireIncreasable (convertRawRequiresIncreasableObject (e)) as
        Record<Wiki.ProfessionRequiresIncreasableObject>
    }
    else {
      return createRequireActivatable (convertRawRequiresActivatableObject (e)) as
        Record<Wiki.ProfessionRequiresActivatableObject>
    }
  }

const convertRawPrerequisiteObject =
  (e: Raw.AllRawRequirementObjects): Wiki.AllRequirementObjects => {
    if (isRawSexRequirement (e)) {
      return createSexRequirement (e .value)
    }
    else if (isRawRaceRequirement (e)) {
      return createRaceRequirement (convertRawRaceCultureRequirement (e) .value)
    }
    else if (isRawCultureRequirement (e)) {
      return createCultureRequirement (convertRawRaceCultureRequirement (e) .value)
    }
    else if (isRawPactRequirement (e)) {
      return createPactRequirement (convertRawPactRequirement (e))
    }
    else if (isRawRequiringPrimaryAttribute (e)) {
      return createRequirePrimaryAttribute (e .type) (e .value)
    }
    else if (isRawRequiringIncreasable (e)) {
      return createRequireIncreasable (convertRawRequiresIncreasableObject (e))
    }
    else {
      return createRequireActivatable (convertRawRequiresActivatableObject (e))
    }
  }

export const convertRawProfessionDependencyObjects =
  (arr: Raw.RawProfessionDependency[]): List<Wiki.ProfessionDependency> =>
    List.fromArray (arr .map (convertRawProfessionDependencyObject))

export const convertRawProfessionPrerequisiteObjects =
  (arr: Raw.RawProfessionPrerequisite[]): List<Wiki.ProfessionPrerequisite> =>
    List.fromArray (arr .map (convertRawProfessionPrerequisiteObject))

export const convertRawPrerequisiteObjects =
  (arr: Raw.AllRawRequirementObjects[]): List<Wiki.AllRequirementObjects> =>
    List.fromArray (arr .map (convertRawPrerequisiteObject))

export const convertRawPrerequisites =
  (arr: Raw.AllRawRequirements[]): List<Wiki.AllRequirements> =>
    List.fromArray (arr.map (
      e => e === 'RCP' ? 'RCP' : convertRawPrerequisiteObject (e)
    ))

interface ApplicationName {
  id: number
  name: string
}

export const convertRawApplications = (
  locale: Raw.RawSkillLocale['spec'],
  data?: Raw.RawSkill['applications']
) =>
  locale .length === 0
    ? Nothing
    : Just (Maybe.mapMaybe<ApplicationName, Record<Wiki.Application>>
      (app => {
        if (app.id < 0) {
          const prerequisitesElem = data && data.find (e => app.id === e.id)

          if (typeof prerequisitesElem === 'object') {
            const { name: appName } = app
            const { id: appId, prerequisites } = prerequisitesElem

            return Just (createApplication ({
              id: appId,
              name: appName,
              prerequisites: Just (convertRawPrerequisiteObjects (prerequisites)),
            }))
          }

          return Nothing
        }

        return Just (createApplication (app))
      })
      (List.fromArray (locale)))

const convertRawSelection = (e: Raw.RawSelectionObject) =>
  createSelectOption ({
    ...e,
    cost: fromNullable (e .cost),
    req: fmap (convertRawPrerequisiteObjects) (fromNullable (e .req)),
    prerequisites: fmap (convertRawPrerequisiteObjects) (fromNullable (e.prerequisites)),
    // TODO: MAKE SURE THE FOLLOWING CAN BE DELETED
    // applications: e.applications && List.fromArray (e.applications.map (
    //   app => app.prerequisites
    //     ? Record.of<Wiki.Application> ({
    //       ...app,
    //       prerequisites:
    //         convertRawPrerequisiteObjects (app.prerequisites),
    //     })
    //     : Record.of (app) as Record<Wiki.Application>
    // )),
    // spec: e.spec && List.fromArray (e.spec),
    target: fromNullable (e .target),
    tier: fromNullable (e .tier),
    talent: fmap<[string, number], Pair<string, number>> (Pair.fromArray) (fromNullable (e.talent)),
    gr: fromNullable (e .gr),
  })

export const convertRawSelections =
  (locale?: Raw.RawSelectionObject[]) =>
  (data?: Raw.RawSelectionObject[]): Maybe<List<Record<Wiki.SelectionObject>>> =>
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
  (prefix: IdPrefixes) => (raw: [string, number][]): List<Record<Wiki.IncreaseSkill>> =>
    List.fromArray (raw.map (e => createIncreaseSkill ({
      id: prefixRawId (prefix) (e [0]),
      value: e [1],
    })))

export const mapRawWithPrefix = (prefix: IdPrefixes) => (list: string[]): List<string> =>
  List.fromArray (list .map (prefixRawId (prefix)))

const convertRawSpecializationSelection =
  (raw: Raw.RawSpecializationSelection): Record<Wiki.SpecializationSelection> =>
    createSpecializationSelection (typeof raw.sid === 'object' ? List.fromArray (raw.sid) : raw.sid)

const convertRawLanguagesScriptsSelection =
  (raw: Raw.RawLanguagesScriptsSelection): Record<Wiki.LanguagesScriptsSelection> =>
    createLanguagesScriptsSelection (raw .value)

const convertRawCombatTechniquesSelection =
  (raw: Raw.RawCombatTechniquesSelection): Record<Wiki.CombatTechniquesSelection> =>
    createCombatTechniquesSelection ({
      amount: raw .amount,
      value: raw .value,
      sid: List.fromArray (raw .sid),
    })

const convertRawCombatTechniquesSecondSelection =
  (raw: Raw.RawCombatTechniquesSecondSelection): Record<Wiki.CombatTechniquesSecondSelection> =>
    createCombatTechniquesSecondSelection ({
      amount: raw .amount,
      value: raw .value,
      sid: List.fromArray (raw .sid),
    })

const convertRawCantripsSelection =
  (raw: Raw.RawCantripsSelection): Record<Wiki.CantripsSelection> =>
    createCantripsSelection ({
      amount: raw .amount,
      sid: List.fromArray (raw .sid),
    })

const convertRawCursesSelection =
  (raw: Raw.RawCursesSelection): Record<Wiki.CursesSelection> =>
    createCursesSelection (raw .value)

const convertRawSkillsSelection =
  (raw: Raw.RawSkillsSelection): Record<Wiki.SkillsSelection> =>
    createSkillsSelectionWithGroup (fromNullable (raw .gr)) (raw .value)

const convertRawTerrainKnowledgeSelection =
  (raw: Raw.RawTerrainKnowledgeSelection): Record<Wiki.TerrainKnowledgeSelection> =>
    createTerrainKnowledgeSelection (List.fromArray (raw.sid))

const convertRawProfessionSelection =
  (data: Raw.RawProfessionSelection): Wiki.ProfessionSelection => {
    if (data.id === 'SPECIALISATION') {
      return convertRawSpecializationSelection (data)
    }
    else if (data.id === 'LANGUAGES_SCRIPTS') {
      return convertRawLanguagesScriptsSelection (data)
    }
    else if (data.id === 'COMBAT_TECHNIQUES') {
      return convertRawCombatTechniquesSelection (data)
    }
    else if (data.id === 'COMBAT_TECHNIQUES_SECOND') {
      return convertRawCombatTechniquesSecondSelection (data)
    }
    else if (data.id === 'CANTRIPS') {
      return convertRawCantripsSelection (data)
    }
    else if (data.id === 'CURSES') {
      return convertRawCursesSelection (data)
    }
    else if (data.id === 'SKILLS') {
      return convertRawSkillsSelection (data)
    }
    else {
      return convertRawTerrainKnowledgeSelection (data as Raw.RawTerrainKnowledgeSelection)
    }
  }

export const convertRawProfessionSelections =
  (data: Raw.RawProfessionSelections): Wiki.ProfessionSelections =>
    List.fromArray (data .map (convertRawProfessionSelection))

const isRawRemoveSpecializationSelection =
  (raw: Raw.RawVariantSpecializationSelection): raw is Raw.RawRemoveSpecializationSelection =>
    raw .hasOwnProperty ('active')

const convertRawVariantSpecializationSelectionRecord =
  (raw: Raw.RawVariantSpecializationSelection): Wiki.VariantSpecializationSelection =>
    isRawRemoveSpecializationSelection (raw)
      ? createRemoveSpecializationSelection ()
      : convertRawSpecializationSelection (raw)

const isRawRemoveCombatTechniquesSelection =
  (raw: Raw.RawVariantCombatTechniquesSelection): raw is Raw.RawRemoveCombatTechniquesSelection =>
    raw .hasOwnProperty ('active')

const convertRawVariantCombatTechniquesSelectionRecord =
  (raw: Raw.RawVariantCombatTechniquesSelection): Wiki.VariantCombatTechniquesSelection =>
    isRawRemoveCombatTechniquesSelection (raw)
      ? createRemoveCombatTechniquesSelection ()
      : convertRawCombatTechniquesSelection (raw)

const isRawRemoveCombatTechniquesSecondSelection =
  (raw: Raw.RawVariantCombatTechniquesSecondSelection):
    raw is Raw.RawRemoveCombatTechniquesSecondSelection =>
    raw .hasOwnProperty ('active')

const convertRawVariantCombatTechniquesSecondSelectionRecord =
  (raw: Raw.RawVariantCombatTechniquesSecondSelection):
    Wiki.VariantCombatTechniquesSecondSelection =>
      isRawRemoveCombatTechniquesSecondSelection (raw)
        ? createRemoveCombatTechniquesSecondSelection ()
        : convertRawCombatTechniquesSecondSelection (raw)

const convertRawProfessionVariantSelection =
  (data: Raw.RawProfessionVariantSelection): Wiki.ProfessionVariantSelection => {
    if (data.id === 'SPECIALISATION') {
      return convertRawVariantSpecializationSelectionRecord (data)
    }
    else if (data.id === 'LANGUAGES_SCRIPTS') {
      return convertRawLanguagesScriptsSelection (data)
    }
    else if (data.id === 'COMBAT_TECHNIQUES') {
      return convertRawVariantCombatTechniquesSelectionRecord (data)
    }
    else if (data.id === 'COMBAT_TECHNIQUES_SECOND') {
      return convertRawVariantCombatTechniquesSecondSelectionRecord (data)
    }
    else if (data.id === 'CANTRIPS') {
      return convertRawCantripsSelection (data)
    }
    else if (data.id === 'CURSES') {
      return convertRawCursesSelection (data)
    }
    else if (data.id === 'SKILLS') {
      return convertRawSkillsSelection (data)
    }
    else {
      return convertRawTerrainKnowledgeSelection (data as Raw.RawTerrainKnowledgeSelection)
    }
  }

export const convertRawProfessionVariantSelections =
  (data: Raw.RawProfessionVariantSelections): Wiki.ProfessionVariantSelections =>
    List.fromArray (data .map (convertRawProfessionVariantSelection))
