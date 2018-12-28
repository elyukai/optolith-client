import { pipe } from 'ramda';
import { IdPrefixes } from '../../constants/IdPrefixes';
import * as Data from '../../types/data';
import * as Wiki from '../../types/wiki';
import { isActive } from '../activatable/isActive';
import { isPactValid as isPactFromStateValid } from '../activatable/pactUtils';
import { getActiveSelections } from '../activatable/selectionUtils';
import { ActivatableDependent, ActivatableDependentG, ActiveObjectG, isActivatableDependent, isMaybeActivatableDependent } from '../activeEntries/ActivatableDependent';
import { ActivatableSkillDependentG, isMaybeActivatableSkillDependent } from '../activeEntries/ActivatableSkillDependent';
import { AttributeDependentG } from '../activeEntries/AttributeDependent';
import { DependencyObjectG } from '../activeEntries/DependencyObject';
import { isExtendedSkillDependent, SkillDependentG } from '../activeEntries/SkillDependent';
import { HeroModelG } from '../heroData/HeroModel';
import { PactG } from '../heroData/Pact';
import { getHeroStateItem } from '../heroStateUtils';
import { prefixId } from '../IDUtils';
import { dec, gte, lt, lte, min, subtract } from '../mathUtils';
import { not } from '../not';
import { getPrimaryAttributeId } from '../primaryAttributeUtils';
import { equals } from '../structures/Eq';
import { flip, join, on, thrush } from '../structures/Function';
import { set } from '../structures/Lens';
import { all, any, elem, elem_, foldl, fromElements, ifoldl, isList, List, map, sortBy, subscript } from '../structures/List';
import { and, bind_, catMaybes, ensure, fmap, fromJust, isJust, isNothing, Just, Maybe, maybe, Nothing, or } from '../structures/Maybe';
import { lookup_, OrderedMap, toList } from '../structures/OrderedMap';
import { fst, Pair, snd } from '../structures/Pair';
import { Record } from '../structures/Record';
import { CultureG } from '../wikiData/Culture';
import { RequireActivatableG, RequireActivatableL } from '../wikiData/prerequisites/ActivatableRequirement';
import { CultureRequirementG, isCultureRequirement } from '../wikiData/prerequisites/CultureRequirement';
import { isIncreasableRequirement, RequireIncreasableG, RequireIncreasableL } from '../wikiData/prerequisites/IncreasableRequirement';
import { isPactRequirement, PactRequirementG } from '../wikiData/prerequisites/PactRequirement';
import { isPrimaryAttributeRequirement, RequirePrimaryAttributeG } from '../wikiData/prerequisites/PrimaryAttributeRequirement';
import { isRaceRequirement, RaceRequirementG } from '../wikiData/prerequisites/RaceRequirement';
import { isSexRequirement, SexRequirementG } from '../wikiData/prerequisites/SexRequirement';
import { ProfessionG } from '../wikiData/Profession';
import { RaceG } from '../wikiData/Race';
import { SkillG } from '../wikiData/Skill';
import { WikiModelG } from '../wikiData/WikiModel';
import { getAllWikiEntriesByGroup } from '../WikiUtils';

type Validator = (wiki: Record<Wiki.WikiAll>) =>
                 (state: Record<Data.HeroDependent>) =>
                 (req: Wiki.AllRequirements) =>
                 (sourceId: string) => boolean

const { races, cultures, professions, skills } = WikiModelG
const { race, culture, profession, specialAbilities, attributes, sex, pact } = HeroModelG

const getAllRaceEntries =
  (wiki: Record<Wiki.WikiAll>) =>
    pipe (
      race,
      bind_ (lookup_ (races (wiki))),
      fmap (
        selectedRace => fromElements (
          ...RaceG.stronglyRecommendedAdvantages (selectedRace),
          ...RaceG.automaticAdvantages (selectedRace),
          ...RaceG.stronglyRecommendedAdvantages (selectedRace),
          ...RaceG.stronglyRecommendedDisadvantages (selectedRace),
          ...RaceG.commonAdvantages (selectedRace),
          ...RaceG.commonDisadvantages (selectedRace)
        )
      )
    )

const getAllCultureEntries =
  (wiki: Record<Wiki.WikiAll>) =>
    pipe (
      culture,
      bind_ (lookup_ (cultures (wiki))),
      fmap (
        selectedCulture => fromElements (
          ...CultureG.commonAdvantages (selectedCulture),
          ...CultureG.commonDisadvantages (selectedCulture)
        )
      )
    )

const getAllProfessionEntries =
  (wiki: Record<Wiki.WikiAll>) =>
    pipe (
      profession,
      bind_ (lookup_ (professions (wiki))),
      fmap (
        selectedProfession => fromElements (
          ...ProfessionG.suggestedAdvantages (selectedProfession),
          ...ProfessionG.suggestedDisadvantages (selectedProfession)
        )
      )
    )

const isRCPValid =
  (wiki: Record<Wiki.WikiAll>) =>
  (state: Record<Data.HeroDependent>) =>
  (sourceId: string): boolean =>
    any (elem (sourceId))
        (catMaybes (
          fromElements (
            getAllRaceEntries (wiki) (state),
            getAllCultureEntries (wiki) (state),
            getAllProfessionEntries (wiki) (state)
          )
        ))

const isSexValid =
  (currentSex: 'm' | 'f') => (req: Record<Wiki.SexRequirement>): boolean =>
    equals (currentSex) (SexRequirementG.value (req))

const isRaceValid =
  (maybeCurrentRace: Maybe<string>) =>
  (req: Record<Wiki.RaceRequirement>): boolean => {
    const value = RaceRequirementG.value (req)

    if (isList (value)) {
      return or (fmap<string, boolean> (currentRace => any (pipe (
                                                                   prefixId (IdPrefixes.RACES),
                                                                   equals (currentRace)
                                                                 ))
                                                           (value))
                                       (maybeCurrentRace))
    }

    return Maybe.elem (prefixId (IdPrefixes.RACES) (value)) (maybeCurrentRace)
  }

const isCultureValid =
  (maybeCurrentCulture: Maybe<string>) =>
  (req: Record<Wiki.CultureRequirement>): boolean => {
    const value = CultureRequirementG.value (req)

    if (isList (value)) {
      return or (
        fmap<string, boolean> (currentCulture => any (pipe (
                                                             prefixId (IdPrefixes.CULTURES),
                                                             equals (currentCulture)
                                                           ))
                                                     (value))
                              (maybeCurrentCulture)
      )
    }

    return Maybe.elem (prefixId (IdPrefixes.CULTURES) (value)) (maybeCurrentCulture)
  }

const hasSamePactCategory =
  (state: Record<Data.Pact>) =>
    pipe (
      PactRequirementG.category,
      equals (PactG.category (state))
    )

const hasNeededPactType =
  (state: Record<Data.Pact>) => (req: Record<Wiki.PactRequirement>) => {
    switch (PactRequirementG.category (req)) {
      case 1:
        return equals (PactG.type (state)) (3)
      default:
        return true
    }
  }

const hasNeededPactDomain =
  (state: Record<Data.Pact>) => (req: Record<Wiki.PactRequirement>) => {
    const maybeReqDomain = PactRequirementG.domain (req)
    const stateDomain = PactG.domain (state)

    if (isNothing (maybeReqDomain)) {
      return true
    }

    if (typeof stateDomain === 'string') {
      return false
    }

    const reqDomain = fromJust (maybeReqDomain)

    if (isList (reqDomain)) {
      return elem (stateDomain) (reqDomain)
    }

    return reqDomain === stateDomain
  }

const hasNeededPactLevel = (state: Record<Data.Pact>) => (req: Record<Wiki.PactRequirement>) =>
  or (fmap (lte (PactG.level (state))) (PactRequirementG.level (req)))

const isPactValid =
  (maybePact: Maybe<Record<Data.Pact>>) => (req: Record<Wiki.PactRequirement>): boolean =>
    or (fmap<Record<Data.Pact>, boolean> (currentPact => isPactFromStateValid (currentPact)
                                           && hasSamePactCategory (currentPact) (req)
                                           && hasNeededPactType (currentPact) (req)
                                           && hasNeededPactDomain (currentPact) (req)
                                           && hasNeededPactLevel (currentPact) (req))
                                         (maybePact))

const isPrimaryAttributeValid =
  (state: Record<Data.HeroDependent>) => (req: Record<Wiki.RequiresPrimaryAttribute>): boolean =>
    or (fmap (pipe (
               lookup_ (attributes (state)),
               fmap (AttributeDependentG.value),
               Maybe.elem (RequirePrimaryAttributeG.value (req))
             ))
             (getPrimaryAttributeId (specialAbilities (state))
                                    (RequirePrimaryAttributeG.type (req))))

const isIncreasableValid =
  (wiki: Record<Wiki.WikiAll>) =>
  (state: Record<Data.HeroDependent>) =>
  (sourceId: string) =>
  (req: Record<Wiki.RequiresIncreasableObject>) =>
  (objectValidator: Validator): boolean => {
    const id = RequireIncreasableG.id (req)

    if (isList (id)) {
      return any (pipe (
                   set (RequireIncreasableL.id),
                   thrush (req),
                   objectValidator (wiki) (state),
                   thrush (sourceId)
                 ))
                 (id)
    }

    return or (fmap ((obj: Data.Dependent) =>
                      isExtendedSkillDependent (obj)
                      && gte (RequireIncreasableG.value (req))
                             (SkillDependentG.value (obj)))
                    (getHeroStateItem (id) (state)))
  }

/**
 * Check if one of the passed selection ids is part of the currently active
 * selections and if that matches the requirement (`active`).
 */
const isOneOfListActiveSelection =
  (activeSelections: Maybe<List<string | number>>) =>
  (req: Record<Wiki.RequiresActivatableObject>) =>
  (sid: List<number>): boolean =>
    Maybe.elem (RequireActivatableG.active (req))
               (fmap<List<string | number>, boolean> (pipe (List.elem_, any, thrush (sid)))
                                                     (activeSelections))

/**
 * Check if the passed selection id is part of the currently active selections
 * and if that matches the requirement (`active`).
 */
const isSingleActiveSelection =
  (activeSelections: Maybe<List<string | number>>) =>
  (req: Record<Wiki.RequiresActivatableObject>) =>
  (sid: string | number): boolean =>
    Maybe.elem (RequireActivatableG.active (req))
               (fmap (elem (sid)) (activeSelections))

const isActiveSelection =
  (activeSelections: Maybe<List<string | number>>) =>
  (req: Record<Wiki.RequiresActivatableObject>) =>
  (sid: Wiki.SID): boolean =>
    isList (sid)
      ? isOneOfListActiveSelection (activeSelections) (req) (sid)
      : isSingleActiveSelection (activeSelections) (req) (sid)

/**
 * Checks if the passed required level is fulfilled by the passed instance.
 */
const isNeededLevelGiven =
  (level: number) =>
    pipe (
      ActivatableDependentG.active,
      any (pipe (ActiveObjectG.tier, fmap (gte (level)), or))
    )

const isActivatableValid =
  (wiki: Record<Wiki.WikiAll>) =>
  (state: Record<Data.HeroDependent>) =>
  (sourceId: string) =>
  (req: Record<Wiki.RequiresActivatableObject>) =>
  (objectValidator: Validator): boolean => {
    const id = RequireActivatableG.id (req)

    if (isList (id)) {
      return any (pipe (
                   set (RequireActivatableL.id),
                   thrush (req),
                   objectValidator (wiki) (state),
                   thrush (sourceId)
                 ))
                 (id)
    }
    else {
      const sid = RequireActivatableG.sid (req)

      if (Maybe.elem<Wiki.SID> ('sel') (sid)) {
        return true
      }

      if (Maybe.elem<Wiki.SID> ('GR') (sid)) {
        return and (pipe (
                           bind_<Data.Dependent, Record<ActivatableDependent>>
                             (ensure (isActivatableDependent)),
                           bind_<Record<ActivatableDependent>, boolean>
                             (target => {
                               const arr =
                                 map (SkillG.id)
                                     (getAllWikiEntriesByGroup
                                       (skills (wiki))
                                       (Maybe.maybeToList (
                                         RequireActivatableG.sid2 (req) as Maybe<number>
                                       )))

                               return fmap (all (pipe (elem_<string | number> (arr), not)))
                                           (getActiveSelections (Just (target)))
                             })
                         )
                         (getHeroStateItem (id) (state)))
      }

      const maybeInstance =
        getHeroStateItem (id) (state) as Maybe<Data.ExtendedActivatableDependent>

      if (isMaybeActivatableDependent (maybeInstance)) {
        const instance = Maybe.fromJust (maybeInstance)
        const activeSelections = getActiveSelections (maybeInstance)

        const maybeSid = RequireActivatableG.sid (req)
        const maybeLevel = RequireActivatableG.tier (req)

        const sidValid = fmap (isActiveSelection (activeSelections) (req)) (maybeSid)
        const levelValid = fmap (flip (isNeededLevelGiven) (instance)) (maybeLevel)

        if (isJust (maybeSid) || isJust (maybeLevel)) {
          return and (sidValid) && and (levelValid)
        }

        return isActive (instance) === RequireActivatableG.active (req)
      }

      if (isMaybeActivatableSkillDependent (maybeInstance)) {
        return ActivatableSkillDependentG.active (fromJust (maybeInstance))
          === RequireActivatableG.active (req)
      }

      return false
    }
  }

/**
 * Checks if the requirement is fulfilled.
 * @param state The current hero data.
 * @param req A requirement object.
 * @param sourceId The id of the entry the requirement object belongs to.
 * @param pact A valid `Pact` object or `undefined`.
 */
export const validateObject =
  (wiki: Record<Wiki.WikiAll>) =>
  (state: Record<Data.HeroDependent>) =>
  (req: Wiki.AllRequirements) =>
  (sourceId: string): boolean =>
    req === 'RCP'
      ? isRCPValid (wiki) (state) (sourceId)
      : isSexRequirement (req)
      ? isSexValid (sex (state)) (req)
      : isRaceRequirement (req)
      ? isRaceValid (race (state)) (req)
      : isCultureRequirement (req)
      ? isCultureValid (culture (state)) (req)
      : isPactRequirement (req)
      ? isPactValid (pact (state)) (req)
      : isPrimaryAttributeRequirement (req)
      ? isPrimaryAttributeValid (state) (req)
      : isIncreasableRequirement (req)
      ? isIncreasableValid (wiki) (state) (sourceId) (req) (validateObject)
      : isActivatableValid (wiki) (state) (sourceId) (req) (validateObject)

/**
 * Checks if all requirements are fulfilled.
 * @param state The current hero data.
 * @param prerequisites An array of requirement objects.
 * @param sourceId The id of the entry the requirement objects belong to.
 * @param pact A valid `Pact` object or `undefined`.
 */
export const validatePrerequisites =
  (wiki: Record<Wiki.WikiAll>) =>
  (state: Record<Data.HeroDependent>) =>
  (prerequisites: List<Wiki.AllRequirements>) =>
  (sourceId: string): boolean =>
    all (pipe (validateObject (wiki) (state), thrush (sourceId))) (prerequisites)

type ReqEntries = List<Pair<number, List<Wiki.AllRequirements>>>

const isSkipping =
  (arr: ReqEntries) => (index: number) => (max: Maybe<number>) =>
    isJust (max)
    && index > 1
    && or (
      fmap<Pair<number, List<Wiki.AllRequirements>>, boolean>
        (pipe (fst, lt (fromJust (max))))
        (subscript (arr) (index - 2))
    )

/**
 * Get maximum valid level.
 * @param state The current hero data.
 * @param requirements A Map of tier prereqisite arrays.
 * @param sourceId The id of the entry the requirement objects belong to.
 */
export const validateLevel =
  (wiki: Record<Wiki.WikiAll>) =>
  (state: Record<Data.HeroDependent>) =>
  (requirements: OrderedMap<number, List<Wiki.AllRequirements>>) =>
  (dependencies: List<Data.ActivatableDependency>) =>
  (sourceId: string): Maybe<number> =>
    foldl<Data.ActivatableDependency, Maybe<number>>
      (max => dep =>
          // If `dep` prohibits higher level
          typeof dep === 'object'
          && Maybe.elem (false) (DependencyObjectG.active (dep))
          ? maybe<number, Maybe<number>>
            (max)
            (pipe (dec, level => Just (maybe<number, number> (level) (min (level)) (max))))
            (DependencyObjectG.tier (dep))
          : max)
      (pipe (
              toList as (m: OrderedMap<number, List<Wiki.AllRequirements>>) =>
                List<Pair<number, List<Wiki.AllRequirements>>>,
              sortBy (
                on<Pair<number, List<Wiki.AllRequirements>>, number, number> (subtract) (fst)
              ),
              join (
                list => ifoldl<Pair<number, List<Wiki.AllRequirements>>, Maybe<number>>
                  (max => index => entry =>
                    !isSkipping (list) (index) (max)
                    || validatePrerequisites (wiki) (state) (snd (entry)) (sourceId)
                    ? Just (fst (entry))
                    : max)
                  (Nothing)
              )
            )
            (requirements))
      (dependencies)

/**
 * Checks if all profession prerequisites are fulfilled.
 * @param prerequisites An array of prerequisite objects.
 */
export const validateProfession =
  (prerequisites: List<Wiki.ProfessionDependency>) =>
  (currentSex: Data.Sex) =>
  (currentRace: Maybe<string>) =>
  (currentCulture: Maybe<string>): boolean =>
    all<Wiki.ProfessionDependency> (req =>
                                     isSexRequirement (req)
                                     ? isSexValid (currentSex) (req)
                                     : isRaceRequirement (req)
                                     ? isRaceValid (currentRace) (req)
                                     : isCultureRequirement (req)
                                     ? isCultureValid (currentCulture) (req)
                                     : false
                                   )
                                   (prerequisites)
