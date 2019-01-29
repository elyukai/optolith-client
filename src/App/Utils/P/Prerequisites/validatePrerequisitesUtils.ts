import { pipe } from "ramda";
import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { equals } from "../../../../Data/Eq";
import { flip, join, on, thrush } from "../../../../Data/Function";
import { compare } from "../../../../Data/Int";
import { set } from "../../../../Data/Lens";
import { all, any, concat, elem, elemF, foldl, fromElements, ifoldl, isList, List, map, sortBy, subscript } from "../../../../Data/List";
import { and, bindF, catMaybes, ensure, fmap, fromJust, isJust, isNothing, Just, Maybe, maybe, maybeToList, Nothing, or } from "../../../../Data/Maybe";
import { Ordering } from "../../../../Data/Ord";
import { lookupF, OrderedMap, toList } from "../../../../Data/OrderedMap";
import { fst, Pair, snd } from "../../../../Data/Pair";
import { Record } from "../../../../Data/Record";
import { ActivatableDependent, isActivatableDependent, isMaybeActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent, isMaybeActivatableSkillDependent } from "../../../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../../../Models/ActiveEntries/ActiveObject";
import { AttributeDependent } from "../../../Models/ActiveEntries/AttributeDependent";
import { DependencyObject } from "../../../Models/ActiveEntries/DependencyObject";
import { isExtendedSkillDependent, SkillDependent } from "../../../Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../../../Models/Hero/HeroModel";
import * as Data from "../../../Models/Hero/heroTypeHelpers";
import { Pact } from "../../../Models/Hero/Pact";
import { Culture } from "../../../Models/Wiki/Culture";
import { RequireActivatable, RequireActivatableL } from "../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { CultureRequirement, isCultureRequirement } from "../../../Models/Wiki/prerequisites/CultureRequirement";
import { isRequiringIncreasable, RequireIncreasable, RequireIncreasableL } from "../../../Models/Wiki/prerequisites/IncreasableRequirement";
import { isPactRequirement, PactRequirement } from "../../../Models/Wiki/prerequisites/PactRequirement";
import { isPrimaryAttributeRequirement, RequirePrimaryAttribute } from "../../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { isRaceRequirement, RaceRequirement } from "../../../Models/Wiki/prerequisites/RaceRequirement";
import { isSexRequirement, SexRequirement } from "../../../Models/Wiki/prerequisites/SexRequirement";
import { Profession } from "../../../Models/Wiki/Profession";
import { Race } from "../../../Models/Wiki/Race";
import { Skill } from "../../../Models/Wiki/Skill";
import { WikiModel, WikiModelRecord } from "../../../Models/Wiki/WikiModel";
import * as Wiki from "../../../Models/Wiki/wikiTypeHelpers";
import { isActive } from "../../A/Activatable/isActive";
import { isPactFromStateValid } from "../../A/Activatable/pactUtils";
import { getActiveSelectionsMaybe } from "../../A/Activatable/selectionUtils";
import { getHeroStateItem } from "../../heroStateUtils";
import { prefixId } from "../../IDUtils";
import { dec, gte, lt, lte, min } from "../../mathUtils";
import { not } from "../../not";
import { getPrimaryAttributeId } from "../../primaryAttributeUtils";
import { getAllWikiEntriesByGroup } from "../../WikiUtils";

type Validator = (wiki: WikiModelRecord) =>
                 (state: HeroModelRecord) =>
                 (req: Wiki.AllRequirements) =>
                 (sourceId: string) => boolean

const { races, cultures, professions, skills } = WikiModel.A
const { race, culture, profession, specialAbilities, attributes, sex, pact } = HeroModel.A

const getAllRaceEntries =
  (wiki: WikiModelRecord) =>
    pipe (
      race,
      bindF (lookupF (races (wiki))),
      fmap (
        selectedRace => concat (
          fromElements (
            Race.A.stronglyRecommendedAdvantages (selectedRace),
            Race.A.automaticAdvantages (selectedRace),
            Race.A.stronglyRecommendedAdvantages (selectedRace),
            Race.A.stronglyRecommendedDisadvantages (selectedRace),
            Race.A.commonAdvantages (selectedRace),
            Race.A.commonDisadvantages (selectedRace)
          )
        )
      )
    )

const getAllCultureEntries =
  (wiki: WikiModelRecord) =>
    pipe (
      culture,
      bindF (lookupF (cultures (wiki))),
      fmap (
        selectedCulture => concat (
          fromElements (
            Culture.A.commonAdvantages (selectedCulture),
            Culture.A.commonDisadvantages (selectedCulture)
          )
        )
      )
    )

const getAllProfessionEntries =
  (wiki: WikiModelRecord) =>
    pipe (
      profession,
      bindF (lookupF (professions (wiki))),
      fmap (
        selectedProfession => concat (
          fromElements (
            Profession.A.suggestedAdvantages (selectedProfession),
            Profession.A.suggestedDisadvantages (selectedProfession)
          )
        )
      )
    )

const isRCPValid =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
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
  (currentSex: "m" | "f") => (req: Record<SexRequirement>): boolean =>
    equals (currentSex) (SexRequirement.A.value (req))

const isRaceValid =
  (maybeCurrentRace: Maybe<string>) =>
  (req: Record<RaceRequirement>): boolean => {
    const value = RaceRequirement.A.value (req)

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
  (req: Record<CultureRequirement>): boolean => {
    const value = CultureRequirement.A.value (req)

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
  (state: Record<Pact>) =>
    pipe (
      PactRequirement.A.category,
      equals (Pact.A.category (state))
    )

const hasNeededPactType =
  (state: Record<Pact>) => (req: Record<PactRequirement>) => {
    switch (PactRequirement.A.category (req)) {
      case 1:
        return equals (Pact.A.type (state)) (3)
      default:
        return true
    }
  }

const hasNeededPactDomain =
  (state: Record<Pact>) => (req: Record<PactRequirement>) => {
    const maybeReqDomain = PactRequirement.A.domain (req)
    const stateDomain = Pact.A.domain (state)

    if (isNothing (maybeReqDomain)) {
      return true
    }

    if (typeof stateDomain === "string") {
      return false
    }

    const reqDomain = fromJust (maybeReqDomain)

    if (isList (reqDomain)) {
      return elem (stateDomain) (reqDomain)
    }

    return reqDomain === stateDomain
  }

const hasNeededPactLevel = (state: Record<Pact>) => (req: Record<PactRequirement>) =>
  or (fmap (lte (Pact.A.level (state))) (PactRequirement.A.level (req)))

const isPactValid =
  (maybePact: Maybe<Record<Pact>>) => (req: Record<PactRequirement>): boolean =>
    or (fmap<Record<Pact>, boolean> (currentPact => isPactFromStateValid (currentPact)
                                           && hasSamePactCategory (currentPact) (req)
                                           && hasNeededPactType (currentPact) (req)
                                           && hasNeededPactDomain (currentPact) (req)
                                           && hasNeededPactLevel (currentPact) (req))
                                         (maybePact))

const isPrimaryAttributeValid =
  (state: HeroModelRecord) => (req: Record<RequirePrimaryAttribute>): boolean =>
    or (fmap (pipe (
               lookupF (attributes (state)),
               fmap (AttributeDependent.A.value),
               Maybe.elem (RequirePrimaryAttribute.A.value (req))
             ))
             (getPrimaryAttributeId (specialAbilities (state))
                                    (RequirePrimaryAttribute.A.type (req))))

const isIncreasableValid =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (sourceId: string) =>
  (req: Record<RequireIncreasable>) =>
  (objectValidator: Validator): boolean => {
    const id = RequireIncreasable.A.id (req)

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
                      && gte (RequireIncreasable.A.value (req))
                             (SkillDependent.A.value (obj)))
                    (getHeroStateItem (state) (id)))
  }

/**
 * Check if one of the passed selection ids is part of the currently active
 * selections and if that matches the requirement (`active`).
 */
const isOneOfListActiveSelection =
  (activeSelections: Maybe<List<string | number>>) =>
  (req: Record<RequireActivatable>) =>
  (sid: List<number>): boolean =>
    Maybe.elem (RequireActivatable.A.active (req))
               (fmap<List<string | number>, boolean> (pipe (List.elemF, any, thrush (sid)))
                                                     (activeSelections))

/**
 * Check if the passed selection id is part of the currently active selections
 * and if that matches the requirement (`active`).
 */
const isSingleActiveSelection =
  (activeSelections: Maybe<List<string | number>>) =>
  (req: Record<RequireActivatable>) =>
  (sid: string | number): boolean =>
    Maybe.elem (RequireActivatable.A.active (req))
               (fmap (elem (sid)) (activeSelections))

const isActiveSelection =
  (activeSelections: Maybe<List<string | number>>) =>
  (req: Record<RequireActivatable>) =>
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
      ActivatableDependent.A.active,
      any (pipe (ActiveObject.A.tier, fmap (gte (level)), or))
    )

const isActivatableValid =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (sourceId: string) =>
  (req: Record<RequireActivatable>) =>
  (objectValidator: Validator): boolean => {
    const id = RequireActivatable.A.id (req)

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
      const sid = RequireActivatable.A.sid (req)

      if (Maybe.elem<Wiki.SID> ("sel") (sid)) {
        return true
      }

      if (Maybe.elem<Wiki.SID> ("GR") (sid)) {
        return and (pipe (
                           bindF<Data.Dependent, Record<ActivatableDependent>>
                             (ensure (isActivatableDependent)),
                           bindF<Record<ActivatableDependent>, boolean>
                             (target => {
                               const arr =
                                 map (Skill.A.id)
                                     (getAllWikiEntriesByGroup
                                       (skills (wiki))
                                       (maybeToList (
                                         RequireActivatable.A.sid2 (req) as Maybe<number>
                                       )))

                               return fmap (all (pipe (elemF<string | number> (arr), not)))
                                           (getActiveSelectionsMaybe (Just (target)))
                             })
                         )
                         (getHeroStateItem (state) (id)))
      }

      const maybeInstance =
        getHeroStateItem (state) (id) as Maybe<Data.ExtendedActivatableDependent>

      if (isMaybeActivatableDependent (maybeInstance)) {
        const instance = Maybe.fromJust (maybeInstance)
        const activeSelections = getActiveSelectionsMaybe (maybeInstance)

        const maybeSid = RequireActivatable.A.sid (req)
        const maybeLevel = RequireActivatable.A.tier (req)

        const sidValid = fmap (isActiveSelection (activeSelections) (req)) (maybeSid)
        const levelValid = fmap (flip (isNeededLevelGiven) (instance)) (maybeLevel)

        if (isJust (maybeSid) || isJust (maybeLevel)) {
          return and (sidValid) && and (levelValid)
        }

        return isActive (instance) === RequireActivatable.A.active (req)
      }

      if (isMaybeActivatableSkillDependent (maybeInstance)) {
        return ActivatableSkillDependent.A.active (fromJust (maybeInstance))
          === RequireActivatable.A.active (req)
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
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (req: Wiki.AllRequirements) =>
  (sourceId: string): boolean =>
    req === "RCP"
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
      : isRequiringIncreasable (req)
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
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
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
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (requirements: OrderedMap<number, List<Wiki.AllRequirements>>) =>
  (dependencies: List<Data.ActivatableDependency>) =>
  (sourceId: string): Maybe<number> =>
    foldl<Data.ActivatableDependency, Maybe<number>>
      (max => dep =>
          // If `dep` prohibits higher level
          typeof dep === "object"
          && Maybe.elem (false) (DependencyObject.A.active (dep))
          ? maybe<Maybe<number>>
            (max)
            (pipe (dec, level => Just (maybe<number> (level) (min (level)) (max))))
            (DependencyObject.A.tier (dep))
          : max)
      (pipe (
              toList as (m: OrderedMap<number, List<Wiki.AllRequirements>>) =>
                List<Pair<number, List<Wiki.AllRequirements>>>,
              sortBy (
                on<Pair<number, List<Wiki.AllRequirements>>, number, Ordering> (compare) (fst)
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
