import R from 'ramda';
import * as Categories from '../constants/Categories';
import { IdPrefixes } from '../constants/IdPrefixes';
import * as Raw from '../types/rawdata';
import * as Wiki from '../types/wiki';
import { Just, List, Maybe, Nothing, Record, Tuple } from './dataUtils';
import { getCategoryById, getRawStringId } from './IDUtils';

const isRawSexRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawSexRequirement =>
    req.id === 'SEX';

const isRawRaceRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawRaceRequirement =>
    req.id === 'RACE';

const isRawCultureRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawCultureRequirement =>
    req.id === 'CULTURE';

const isRawPactRequirement =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawPactRequirement =>
    req.id === 'PACT';

const isRawRequiringPrimaryAttribute =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawRequiresPrimaryAttribute =>
    req.id === 'ATTR_PRIMARY';

const isRawRequiringIncreasable =
  (req: Raw.AllRawRequirementObjects): req is Raw.RawRequiresIncreasableObject => {
    const id = req.id;

    if (typeof id === 'object') {
      return req.hasOwnProperty ('value') && id.every (R.pipe (
        getCategoryById,
        (category: Maybe<Categories.Categories>) => Maybe.isJust (category) &&
          Categories.IncreasableCategories.elem (
            Maybe.fromJust (category) as Categories.IncreasableCategory
          )
      ));
    }
    else {
      const category = getCategoryById (id);

      return req.hasOwnProperty ('value') && Maybe.isJust (category) &&
        Categories.IncreasableCategories.elem (
          Maybe.fromJust (category) as Categories.IncreasableCategory
        );
    }
  };

type RawRaceOrCultureRequirement =
  Raw.RawRaceRequirement |
  Raw.RawCultureRequirement;

type RaceOrCultureRequirement<T extends RawRaceOrCultureRequirement> =
  T['id'] extends 'RACE' ? Wiki.RaceRequirement : Wiki.CultureRequirement;

const convertRawRaceCultureRequirement =
  <T extends RawRaceOrCultureRequirement>(e: T): RaceOrCultureRequirement<T> =>
    ({
      id: e.id,
      value: typeof e.value === 'object' ? List.fromArray (e.value) : e.value
    }) as any as RaceOrCultureRequirement<T>;

const convertRawPactRequirement =
  (e: Raw.RawPactRequirement): Wiki.PactRequirement => {
    if (typeof e.domain === 'object') {
      return {
        ...e,
        domain: List.fromArray (e.domain)
      };
    }
    else {
      return e as Wiki.PactRequirement;
    }
  };

const convertRawRequiresIncreasableObject =
  (e: Raw.RawRequiresIncreasableObject): Wiki.RequiresIncreasableObject =>
    ({
      ...e,
      id: typeof e.id === 'object' ? List.fromArray (e.id) : e.id
    });

const convertRawRequiresActivatableObject =
  (e: Raw.RawRequiresActivatableObject): Wiki.RequiresActivatableObject => {
    const { id, ...other } = e;

    const res = {
      ...other,
      id: typeof e.id === 'object' ? List.fromArray (e.id) : e.id
    };

    if (typeof res.sid === 'object') {
      return {
        ...res,
        sid: List.fromArray (res.sid)
      };
    }
    else {
      return res as Wiki.RequiresActivatableObject;
    }
  };

export const convertRawProfessionRequiresActivatableObject =
  (e: Raw.RawProfessionRequiresActivatableObject):
    Record<Wiki.ProfessionRequiresActivatableObject> =>
    Record.of (convertRawRequiresActivatableObject (e)) as
      Record<Wiki.ProfessionRequiresActivatableObject>;

const convertRawProfessionDependencyObject =
  (e: Raw.RawProfessionDependency): Wiki.ProfessionDependency => {
    if (isRawSexRequirement (e)) {
      return Record.of (e);
    }
    else if (isRawRaceRequirement (e)) {
      return Record.of (convertRawRaceCultureRequirement (e));
    }
    else {
      return Record.of (convertRawRaceCultureRequirement (e));
    }
  };

const convertRawProfessionPrerequisiteObject =
  (e: Raw.RawProfessionPrerequisite): Wiki.ProfessionPrerequisite => {
    if (isRawRequiringIncreasable (e)) {
      return Record.of (convertRawRequiresIncreasableObject (e)) as
        Record<Wiki.ProfessionRequiresIncreasableObject>;
    }
    else {
      return Record.of (convertRawRequiresActivatableObject (e)) as
        Record<Wiki.ProfessionRequiresActivatableObject>;
    }
  };

const convertRawPrerequisiteObject =
  (e: Raw.AllRawRequirementObjects): Wiki.AllRequirementObjects => {
    if (isRawSexRequirement (e)) {
      return Record.of (e);
    }
    else if (isRawRaceRequirement (e)) {
      return Record.of (convertRawRaceCultureRequirement (e));
    }
    else if (isRawCultureRequirement (e)) {
      return Record.of (convertRawRaceCultureRequirement (e));
    }
    else if (isRawPactRequirement (e)) {
      return Record.of (convertRawPactRequirement (e));
    }
    else if (isRawRequiringPrimaryAttribute (e)) {
      return Record.of (e);
    }
    else if (isRawRequiringIncreasable (e)) {
      return Record.of (convertRawRequiresIncreasableObject (e));
    }
    else {
      return Record.of (convertRawRequiresActivatableObject (e));
    }
  };

export const convertRawProfessionDependencyObjects =
  (arr: Raw.RawProfessionDependency[]): List<Wiki.ProfessionDependency> =>
    List.fromArray (arr.map (convertRawProfessionDependencyObject));

export const convertRawProfessionPrerequisiteObjects =
  (arr: Raw.RawProfessionPrerequisite[]): List<Wiki.ProfessionPrerequisite> =>
    List.fromArray (arr.map (convertRawProfessionPrerequisiteObject));

export const convertRawPrerequisiteObjects =
  (arr: Raw.AllRawRequirementObjects[]): List<Wiki.AllRequirementObjects> =>
    List.fromArray (arr.map (convertRawPrerequisiteObject));

export const convertRawPrerequisites =
  (arr: Raw.AllRawRequirements[]): List<Wiki.AllRequirements> =>
    List.fromArray (arr.map (
      e => {
        if (e === 'RCP') {
          return 'RCP';
        }
        else {
          return convertRawPrerequisiteObject (e);
        }
      }
    ));

interface ApplicationName {
  id: number;
  name: string;
}

export const convertRawApplications = (
  locale: Raw.RawSkillLocale['spec'],
  data?: Raw.RawSkill['applications'],
) =>
  Maybe.mapMaybe<ApplicationName, Record<Wiki.Application>> (
    app => {
      if (app.id < 0) {
        const prerequisitesElem = data && data.find (e => app.id === e.id);

        if (typeof prerequisitesElem === 'object') {
          const { name: appName } = app;
          const { id: appId, prerequisites } = prerequisitesElem;

          return Just (Record.of<Wiki.Application> ({
            id: appId,
            name: appName,
            prerequisites: convertRawPrerequisiteObjects (prerequisites)
          }));
        }

        return Nothing ();
      }

      return Just (Record.of (app));
    }
  ) (List.fromArray (locale));

const convertRawSelection = (e: Raw.RawSelectionObject) =>
  Record.of<Wiki.SelectionObject> ({
    ...e,
    req: e.req && convertRawPrerequisiteObjects (e.req),
    prerequisites: e.prerequisites
      && convertRawPrerequisiteObjects (e.prerequisites),
    applications: e.applications && List.fromArray (e.applications.map (
      app => app.prerequisites
        ? Record.of<Wiki.Application> ({
          ...app,
          prerequisites:
            convertRawPrerequisiteObjects (app.prerequisites)
        })
        : Record.of (app) as Record<Wiki.Application>
    )),
    spec: e.spec && List.fromArray (e.spec),
    talent: e.talent && Tuple.of<string, number> (e.talent[0]) (e.talent[1])
  });

export const convertRawSelections = (
  locale?: Raw.RawSelectionObject[],
  data?: Raw.RawSelectionObject[]
): (List<Record<Wiki.SelectionObject>> | undefined) =>
  locale && (
    data
      ? List.fromArray (
        locale.map (
            e => convertRawSelection ({
              ...data.find (n => n.id === e.id),
              ...e,
            })
          )
        )
      : List.fromArray (locale.map (convertRawSelection))
  );

export const convertRawIncreaseSkills =
  (raw: [string, number][], prefix: IdPrefixes): List<Record<Wiki.IncreaseSkill>> =>
    List.fromArray (raw.map (e => Record.of ({
      id: `${prefix}_${e[0]}`,
      value: e[1]
    })));

export const mapRawWithPrefix = (list: string[], prefix: IdPrefixes): List<string> =>
  List.fromArray (list.map (getRawStringId (prefix)))

const convertRawSpecializationSelection =
  (raw: Raw.RawSpecializationSelection): Record<Wiki.SpecializationSelection> =>
    Record.of ({
      ...raw,
      sid: typeof raw.sid === 'object' ? List.fromArray (raw.sid) : raw.sid
    });

const convertRawLanguagesScriptsSelection =
  (raw: Raw.RawLanguagesScriptsSelection): Record<Wiki.LanguagesScriptsSelection> =>
    Record.of (raw);

const convertRawCombatTechniquesSelection =
  (raw: Raw.RawCombatTechniquesSelection): Record<Wiki.CombatTechniquesSelection> =>
    Record.of ({
      ...raw,
      sid: List.fromArray (raw.sid)
    });

const convertRawCombatTechniquesSecondSelection =
  (raw: Raw.RawCombatTechniquesSecondSelection): Record<Wiki.CombatTechniquesSecondSelection> =>
  Record.of ({
    ...raw,
    sid: List.fromArray (raw.sid)
  });

const convertRawCantripsSelection =
  (raw: Raw.RawCantripsSelection): Record<Wiki.CantripsSelection> =>
    Record.of ({
      ...raw,
      sid: List.fromArray (raw.sid)
    });

const convertRawCursesSelection =
  (raw: Raw.RawCursesSelection): Record<Wiki.CursesSelection> =>
    Record.of (raw);

const convertRawSkillsSelection =
  (raw: Raw.RawSkillsSelection): Record<Wiki.SkillsSelection> =>
    Record.of (raw);

const convertRawTerrainKnowledgeSelection =
  (raw: Raw.RawTerrainKnowledgeSelection): Record<Wiki.TerrainKnowledgeSelection> =>
    Record.of ({
      ...raw,
      sid: List.fromArray (raw.sid)
    });


const convertRawProfessionSelection =
  (data: Raw.RawProfessionSelection): Wiki.ProfessionSelection => {
    if (data.id === 'SPECIALISATION') {
      return convertRawSpecializationSelection (data);
    }
    else if (data.id === 'LANGUAGES_SCRIPTS') {
      return convertRawLanguagesScriptsSelection (data);
    }
    else if (data.id === 'COMBAT_TECHNIQUES') {
      return convertRawCombatTechniquesSelection (data);
    }
    else if (data.id === 'COMBAT_TECHNIQUES_SECOND') {
      return convertRawCombatTechniquesSecondSelection (data);
    }
    else if (data.id === 'CANTRIPS') {
      return convertRawCantripsSelection (data);
    }
    else if (data.id === 'CURSES') {
      return convertRawCursesSelection (data);
    }
    else if (data.id === 'SKILLS') {
      return convertRawSkillsSelection (data);
    }
    else {
      return convertRawTerrainKnowledgeSelection (data as Raw.RawTerrainKnowledgeSelection);
    }
  };

export const convertRawProfessionSelections =
  (data: Raw.RawProfessionSelections): Wiki.ProfessionSelections =>
    List.fromArray (data.map (convertRawProfessionSelection));

const isRawRemoveSpecializationSelection =
  (raw: Raw.RawVariantSpecializationSelection): raw is Raw.RawRemoveSpecializationSelection =>
    raw.hasOwnProperty ('active');

const convertRawVariantSpecializationSelectionRecord =
  (raw: Raw.RawVariantSpecializationSelection): Wiki.VariantSpecializationSelection =>
    isRawRemoveSpecializationSelection (raw)
      ? Record.of (raw)
      : convertRawSpecializationSelection (raw);

const isRawRemoveCombatTechniquesSelection =
  (raw: Raw.RawVariantCombatTechniquesSelection): raw is Raw.RawRemoveCombatTechniquesSelection =>
    raw.hasOwnProperty ('active');

const convertRawVariantCombatTechniquesSelectionRecord =
  (raw: Raw.RawVariantCombatTechniquesSelection): Wiki.VariantCombatTechniquesSelection =>
    isRawRemoveCombatTechniquesSelection (raw)
      ? Record.of (raw)
      : convertRawCombatTechniquesSelection (raw);

const isRawRemoveCombatTechniquesSecondSelection =
  (raw: Raw.RawVariantCombatTechniquesSecondSelection):
    raw is Raw.RawRemoveCombatTechniquesSecondSelection =>
    raw.hasOwnProperty ('active');

const convertRawVariantCombatTechniquesSecondSelectionRecord =
  (raw: Raw.RawVariantCombatTechniquesSecondSelection):
    Wiki.VariantCombatTechniquesSecondSelection =>
      isRawRemoveCombatTechniquesSecondSelection (raw)
        ? Record.of (raw)
        : convertRawCombatTechniquesSecondSelection (raw);

const convertRawProfessionVariantSelection =
  (data: Raw.RawProfessionVariantSelection): Wiki.ProfessionVariantSelection => {
    if (data.id === 'SPECIALISATION') {
      return convertRawVariantSpecializationSelectionRecord (data);
    }
    else if (data.id === 'LANGUAGES_SCRIPTS') {
      return convertRawLanguagesScriptsSelection (data);
    }
    else if (data.id === 'COMBAT_TECHNIQUES') {
      return convertRawVariantCombatTechniquesSelectionRecord (data);
    }
    else if (data.id === 'COMBAT_TECHNIQUES_SECOND') {
      return convertRawVariantCombatTechniquesSecondSelectionRecord (data);
    }
    else if (data.id === 'CANTRIPS') {
      return convertRawCantripsSelection (data);
    }
    else if (data.id === 'CURSES') {
      return convertRawCursesSelection (data);
    }
    else if (data.id === 'SKILLS') {
      return convertRawSkillsSelection (data);
    }
    else {
      return convertRawTerrainKnowledgeSelection (data as Raw.RawTerrainKnowledgeSelection);
    }
  };

export const convertRawProfessionVariantSelections =
  (data: Raw.RawProfessionVariantSelections): Wiki.ProfessionVariantSelections =>
    List.fromArray (data.map (convertRawProfessionVariantSelection));
