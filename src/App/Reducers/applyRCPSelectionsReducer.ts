import { notEquals } from "../../Data/Eq"
import { cnst, flip, ident, join, thrush } from "../../Data/Function"
import { fmap, fmapF } from "../../Data/Functor"
import { over, set } from "../../Data/Lens"
import { append, consF, elem, filter, flength, foldr, isList, List, ListI, map } from "../../Data/List"
import { bind, ensure, fromMaybe, isJust, isNothing, Just, listToMaybe, maybe, Maybe, Nothing, or } from "../../Data/Maybe"
import { add, gt, max, min } from "../../Data/Num"
import { alter, foldrWithKey, insertF, keys, lookup, member, OrderedMap } from "../../Data/OrderedMap"
import { insert, OrderedSet, sdelete, toList, union } from "../../Data/OrderedSet"
import { fromDefault, makeLenses, Record } from "../../Data/Record"
import { SetSelectionsAction } from "../Actions/ProfessionActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { SpecialAbilityId } from "../Constants/Ids"
import { ActivatableDependent, ActivatableDependentL, createPlainActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent, ActivatableSkillDependentL } from "../Models/ActiveEntries/ActivatableSkillDependent"
import { ActiveObject } from "../Models/ActiveEntries/ActiveObject"
import { AttributeDependent, AttributeDependentL } from "../Models/ActiveEntries/AttributeDependent"
import { SkillDependent, SkillDependentL } from "../Models/ActiveEntries/SkillDependent"
import { HeroModel, HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel"
import { Advantage } from "../Models/Wiki/Advantage"
import { Culture } from "../Models/Wiki/Culture"
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel"
import { ProfessionRequireActivatable, ProfessionRequireActivatableL, reqToActive } from "../Models/Wiki/prerequisites/ActivatableRequirement"
import { ProfessionRequireIncreasable } from "../Models/Wiki/prerequisites/ProfessionRequireIncreasable"
import { Profession } from "../Models/Wiki/Profession"
import { CombatTechniquesSelection } from "../Models/Wiki/professionSelections/CombatTechniquesSelection"
import { ProfessionSelections } from "../Models/Wiki/professionSelections/ProfessionAdjustmentSelections"
import { CombatTechniquesSecondSelection } from "../Models/Wiki/professionSelections/SecondCombatTechniquesSelection"
import { SpecializationSelection } from "../Models/Wiki/professionSelections/SpecializationSelection"
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant"
import { Race } from "../Models/Wiki/Race"
import { Skill } from "../Models/Wiki/Skill"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { IncreaseSkill } from "../Models/Wiki/sub/IncreaseSkill"
import { StaticData, StaticDataRecord } from "../Models/Wiki/WikiModel"
import { Activatable, ProfessionPrerequisite, ProfessionSelectionIds } from "../Models/Wiki/wikiTypeHelpers"
import { getCombinedPrerequisites } from "../Utilities/Activatable/activatableActivationUtils"
import { addOtherSpecialAbilityDependenciesOnRCPApplication } from "../Utilities/Activatable/SpecialAbilityUtils"
import { composeL } from "../Utilities/compose"
import { addDependencies } from "../Utilities/Dependencies/dependencyUtils"
import { getHeroStateItem, updateEntryDef } from "../Utilities/heroStateUtils"
import { ifElse } from "../Utilities/ifElse"
import { pipe, pipe_ } from "../Utilities/pipe"
import { isString } from "../Utilities/typeCheckUtils"
import { getWikiEntry, isActivatableWikiEntry } from "../Utilities/WikiUtils"

interface ConcatenatedModifications {
  "@@name": "ConcatenatedModifications"
  hero: HeroModelRecord
  skillRatingList: OrderedMap<string, number>
  skillActivateList: OrderedSet<string>
  activatable: List<Record<ProfessionRequireActivatable>>
  languages: OrderedMap<number, number>
  scripts: OrderedSet<number>
  professionPrerequisites: List<ProfessionPrerequisite>
}

const ConcatenatedModifications =
  fromDefault ("ConcatenatedModifications")
              <ConcatenatedModifications> ({
                hero: HeroModel.default,
                skillRatingList: OrderedMap.empty,
                skillActivateList: OrderedSet.empty,
                activatable: List.empty,
                languages: OrderedMap.empty,
                scripts: OrderedSet.empty,
                professionPrerequisites: List.empty,
              })

const CMA = ConcatenatedModifications.A
const CML = makeLenses (ConcatenatedModifications)
const WA = StaticData.A
const HA = HeroModel.A
const HL = HeroModelL
const ELA = ExperienceLevel.A
const RA = Race.A
const CA = Culture.A
const PA = Profession.A
const PVA = ProfessionVariant.A
const PRAA = ProfessionRequireActivatable.A
const PRIA = ProfessionRequireIncreasable.A
const PSA = ProfessionSelections.A
const ISA = IncreaseSkill.A
const SA = Skill.A
const ADA = ActivatableDependent.A
const SDL = SkillDependentL
const CTSA = CombatTechniquesSelection.A
const CTSSA = CombatTechniquesSecondSelection.A

type Action = SetSelectionsAction

const addToSRs = (value: number) => alter (pipe (maybe (value) (add (value)), ensure (gt (0))))

const foldIntoSRsFrom =
  <a> (id: (x: a) => string) =>
  (value: (x: a) => number) =>
  (xs: List<a>) =>
    over (CML.skillRatingList)
         (flip (foldr ((x: a) =>
                        addToSRs (value (x)) (id (x))))
               (xs))

const foldIncSkillsIntoSRs = foldIntoSRsFrom (ISA.id) (ISA.value)

// const modIdentityFn = ident (acc: ConcatenatedModifications) => acc

const updateListToContainNewEntry =
  (static_data: StaticDataRecord) =>
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
  (active: Record<ActiveObject>): ident<HeroModelRecord> =>
    pipe (
      updateEntryDef (pipe (
                             ensure (ActivatableDependent.is),
                             fmap (over (ActivatableDependentL.active)
                                        (consF (active)))
                           ))
                     (Advantage.AL.id (wiki_entry)),
      addDependencies (Advantage.AL.id (wiki_entry))
                      (getCombinedPrerequisites (true)
                                                (static_data)
                                                (wiki_entry)
                                                (mhero_entry)
                                                (active)),
      SpecialAbility.is (wiki_entry)
        ? addOtherSpecialAbilityDependenciesOnRCPApplication (wiki_entry) (active)
        : ident
    )

const shouldSABeRemovedByProfVariant =
  (id: string) =>
  (msid: Maybe<string | number>) =>
  (msid2: Maybe<string | number>) =>
  (x: Record<ProfessionRequireActivatable>) => {
    type MSID = Maybe<string | number>

    const current_id = PRAA.id (x)
    const mcurrent_sid = PRAA.sid (x)
    const mcurrent_sid2 = PRAA.sid2 (x)

    return id !== current_id
      || (
        (
          isNothing (msid)
          || notEquals<MSID> (msid) (mcurrent_sid)
        )
        && (
          isNothing (msid2)
          || notEquals<MSID> (msid2) (mcurrent_sid2)
        )
      )
  }

const concatBaseModifications = (action: SetSelectionsAction) => {
  const {
    race,
    culture,
    profession,
    professionVariant: mprofession_variant,
  } = action.payload

  const prof_skills_cts = append (PA.skills (profession)) (PA.combatTechniques (profession))
  const prof_spells_chants = append (PA.spells (profession)) (PA.liturgicalChants (profession))

  return pipe (

    // Race selections:

    pipe (
      over (CML.activatable)
           (flip (foldr ((current_id: string) =>
                          consF (ProfessionRequireActivatable ({ id: current_id, active: true }))))
                 (RA.automaticAdvantages (race))),

      set (composeL (CML.hero, HL.attributeAdjustmentSelected))
          (action.payload.attributeAdjustment)
    ),

    // Culture selections:

    pipe (
      action.payload.useCulturePackage
        ? foldIncSkillsIntoSRs (CA.culturalPackageSkills (culture))
        : ident,

      maybe (ident as ident<Record<ConcatenatedModifications>>)
            <number> (pipe (insertF (4), over (CML.languages)))
            (ifElse<List<number>> (pipe (flength, gt (1)))
                                  <Maybe<number>>
                                  (cnst (Just (action .payload .motherTongue)))
                                  (listToMaybe)
                                  (CA.languages (culture))),

      action.payload.isBuyingMainScriptEnabled
        ? maybe (ident as ident<Record<ConcatenatedModifications>>)
                <number> (pipe (insert, over (CML.scripts)))
                (ifElse<List<number>> (pipe (flength, gt (1)))
                                      <Maybe<number>>
                                      (cnst (Just (action .payload .mainScript)))
                                      (listToMaybe)
                                      (CA.scripts (culture)))
        : ident
    ),

    // Profession selections:

    pipe (
      foldIncSkillsIntoSRs (prof_skills_cts),

      over (CML.hero)
           (flip (foldr (pipe (insert as insert<string>, over (HL.blessings))))
                 (PA.blessings (profession))),

      over (CML.activatable)
           (flip (foldr (consF)) (PA.specialAbilities (profession))),

      set (CML.professionPrerequisites)
          (PA.prerequisites (profession)),

      foldIncSkillsIntoSRs (thrush (prof_spells_chants) (filter (IncreaseSkill.is))),

      over (CML.skillActivateList)
           (flip (foldr (pipe (
                   ensure<ListI<Profession["spells"]>, Record<IncreaseSkill>> (IncreaseSkill.is),
                   maybe<ident<OrderedSet<string>>> (ident) (pipe (ISA.id, insert))
                 )))
                 (prof_spells_chants))
    ),

    // Profession variant selections:

    maybe (ident as ident<Record<ConcatenatedModifications>>)
          ((profession_variant: Record<ProfessionVariant>) => {
            const prof_var_skills_cts = append (PVA.skills (profession_variant))
                                               (PVA.combatTechniques (profession_variant))

            const prof_var_spells_chants = append (PVA.spells (profession_variant))
                                                  (PVA.liturgicalChants (profession_variant))

            return pipe (
              foldIncSkillsIntoSRs (prof_var_skills_cts),

              over (CML.hero)
                   (flip (foldr (pipe (insert as insert<string>, over (HL.blessings))))
                         (PVA.blessings (profession_variant))),

              over (CML.activatable)
                   (flip (foldr ((sa: Record<ProfessionRequireActivatable>) => {
                                  // Having an `active = False` on a special
                                  // ability entry of a profession variant
                                  // should remove the entry of the SA added by
                                  // the profession
                                  if (!PRAA.active (sa)) {
                                    const id = PRAA.id (sa)
                                    const msid = PRAA.sid (sa)
                                    const msid2 = PRAA.sid2 (sa)

                                    if (isJust (msid) || isJust (msid2)) {
                                      return filter (shouldSABeRemovedByProfVariant (id)
                                                                                    (msid)
                                                                                    (msid2))
                                    }
                                    else {
                                      return filter (pipe (PRAA.id, notEquals (PRAA.id (sa))))
                                    }
                                  }

                                  // otherwise just add the entry
                                  return consF (sa)
                                }))
                         (PVA.specialAbilities (profession_variant))),

              over (CML.professionPrerequisites)
                   (flip (foldr ((r: ProfessionPrerequisite):
                           ident<List<ProfessionPrerequisite>> => {
                           if (ProfessionRequireIncreasable.is (r) || PRAA.active (r)) {
                             return consF (r)
                           }

                           return filter (notEquals<ProfessionPrerequisite> (r))
                         }))
                         (PVA.prerequisites (profession_variant))),

              foldIncSkillsIntoSRs (thrush (prof_var_spells_chants) (filter (IncreaseSkill.is))),

              cm =>
                over (CML.skillActivateList)
                     (flip (foldr (pipe (
                                    ensure<ListI<Profession["spells"]>, Record<IncreaseSkill>>
                                      (IncreaseSkill.is),
                                    maybe (ident as ident<OrderedSet<string>>)
                                          (pipe (ISA.id, x => member (x) (CMA.skillRatingList (cm))
                                                                ? insert (x)
                                                                : sdelete (x)))
                                  )))
                           (prof_var_spells_chants))
                     (cm)
            )
          })
          (mprofession_variant)
  )
}

const concatSpecificModifications = (action: SetSelectionsAction) => {
  const P = action .payload

  return pipe (

    // - Skill Specialization
    pipe_ (
      P.map,
      PSA [ProfessionSelectionIds.SPECIALIZATION],
      maybe (ident as ident<Record<ConcatenatedModifications>>)
            (x => {
              const mselected_app = P.specialization
              const mselected_skill = P.specializationSkillId
              const possible_skills = SpecializationSelection.A.sid (x)

              if (isList (possible_skills) && isJust (mselected_app) && isJust (mselected_skill)) {
                return over (CML.activatable)
                            (consF (ProfessionRequireActivatable ({
                              id: SpecialAbilityId.SkillSpecialization,
                              active: true,
                              sid: mselected_skill,
                              sid2: mselected_app,
                            })))
              }

              if (isString (possible_skills) && isJust (mselected_app)) {
                return over (CML.activatable)
                            (consF (ProfessionRequireActivatable ({
                              id: SpecialAbilityId.SkillSpecialization,
                              active: true,
                              sid: Just (possible_skills),
                              sid2: mselected_app,
                            })))
              }

              return ident
            })
    ),

    // - Terrain Knowledge
    pipe_ (
      P.map,
      PSA [ProfessionSelectionIds.TERRAIN_KNOWLEDGE],
      maybe (ident as ident<Record<ConcatenatedModifications>>)
            (() => {
              const mselected_terrain = P.terrainKnowledge

              if (isJust (mselected_terrain)) {
                return over (CML.activatable)
                            (consF (ProfessionRequireActivatable ({
                              id: SpecialAbilityId.TerrainKnowledge,
                              active: true,
                              sid: mselected_terrain,
                            })))
              }

              return ident
            })
    ),

    // - Language and Scripts
    over (CML.languages)
         (flip (foldrWithKey<number, number, OrderedMap<number, number>> (OrderedMap.insert))
               (P.languages)),

    over (CML.scripts)
         (flip (foldr<number, OrderedSet<number>> (insert))
               (keys (P.scripts))),

    // - Combat Techniques
    pipe_ (
      P.map,
      PSA [ProfessionSelectionIds.COMBAT_TECHNIQUES],
      maybe (ident as ident<Record<ConcatenatedModifications>>)
            (x => pipe (
                    foldIntoSRsFrom (ident as ident<string>)
                                    (cnst (CTSA.value (x)))
                                    (OrderedSet.toList (P.combatTechniques)),

                    // - Second Combat Techniques
                    maybe (ident as ident<Record<ConcatenatedModifications>>)
                          ((second: Record<CombatTechniquesSecondSelection>) =>
                            foldIntoSRsFrom (ident as ident<string>)
                                            (cnst (CTSSA.value (second)))
                                            (OrderedSet.toList (P.combatTechniquesSecond)))
                          (CTSA.second (x))
                  ))
    ),

    // - Cantrips
    over (composeL (CML.hero, HL.cantrips))
         (union (P.cantrips)),

    // - Curses
    over (CML.skillRatingList)
         (flip (foldrWithKey (flip<number, string, ident<OrderedMap<string, number>>> (addToSRs)))
               (P.curses)),

    over (CML.skillActivateList)
         (flip (foldr (insert))
               (keys (P.curses))),

    // - Skills
    over (CML.skillRatingList)
         (flip (foldrWithKey ((id: string) => (value: number) =>
                               maybe (ident as ident<OrderedMap<string, number>>)
                                     ((r: Record<Skill>) => addToSRs (value / SA.ic (r)) (id))
                                     (lookup (id) (WA.skills (P.wiki)))))
                             (P.skills)),

    // - Tradition (Guild Mage) unfamiliar spell
    maybe (ident as ident<Record<ConcatenatedModifications>>)
          ((spell_id: string) => over (CML.professionPrerequisites)
                                      (map (x => ProfessionRequireActivatable.is (x)
                                                 && PRAA.id (x)
                                                   === SpecialAbilityId.TraditionGuildMages
                                                 ? set (ProfessionRequireActivatableL.sid)
                                                       (Just (spell_id))
                                                       (x)
                                                 : x)))
          (P.unfamiliarSpell)
  )
}

const concatModifications =
  (action: SetSelectionsAction) =>
  (state: HeroModelRecord): Record<ConcatenatedModifications> => {
    const base =
      ConcatenatedModifications ({
        hero: state,
        skillRatingList: Nothing,
        skillActivateList: Nothing,
        activatable: Nothing,
        languages: Nothing,
        scripts: Nothing,
        professionPrerequisites: Nothing,
      })

    return pipe_ (
      base,
      concatBaseModifications (action),
      concatSpecificModifications (action)
    )
  }

const applyModifications =
  (action: SetSelectionsAction) =>
    pipe (

      // - Skill activations
      join (pipe (
        CMA.skillActivateList,
        flip (OrderedSet.foldr (updateEntryDef (pipe (
                                                       ensure (ActivatableSkillDependent.is),
                                                       fmap (set (ActivatableSkillDependentL.active)
                                                                 (true))
                                                     )))),
        over (CML.hero)
      )),

      // - Skill rating increases
      join (pipe (
        CMA.skillRatingList,
        flip (OrderedMap.foldrWithKey (
               (k: string) =>
               (v: number) =>
                 updateEntryDef (x => {
                                  if (SkillDependent.is (x)) {
                                    return pipe_ (
                                      x,
                                      over (SkillDependentL.value)
                                           (add (v)),
                                      Just
                                    )
                                  }

                                  if (ActivatableSkillDependent.is (x)) {
                                    return pipe_ (
                                      x,
                                      over (ActivatableSkillDependentL.value)
                                           (add (v)),
                                      Just
                                    )
                                  }

                                  return Nothing
                                })
                                (k)
        )),
        over (CML.hero)
      )),

      // - Activatable additions
      join (pipe (
        CMA.activatable,
        flip (foldr ((r: Record<ProfessionRequireActivatable>) =>
                      maybe (ident as ident<HeroModelRecord>)
                            ((wiki_entry: Activatable) => join ((hero: HeroModelRecord) => {
                              const mhero_entry =
                                bind (getHeroStateItem (hero) (PRAA.id (r)))
                                     (ensure (ActivatableDependent.is))

                              const active = reqToActive (r)

                              return updateListToContainNewEntry (action.payload.wiki)
                                                                 (wiki_entry)
                                                                 (mhero_entry)
                                                                 (active)
                            }))
                            (bind (getWikiEntry (action.payload.wiki) (PRAA.id (r)))
                                  (ensure (isActivatableWikiEntry))))),
        over (CML.hero)
      )),

      // - Scripts additions
      join (acc => over (composeL (CML.hero, HL.specialAbilities))
                        (alter (pipe (
                                 fromMaybe (
                                   createPlainActivatableDependent (SpecialAbilityId.Literacy)
                                 ),
                                 over (ActivatableDependentL.active)
                                      (append (pipe_ (
                                        acc,
                                        CMA.scripts,
                                        toList,
                                        map (s => ActiveObject ({ sid: Just (s) }))
                                      ))),
                                 Just
                               ))
                               (SpecialAbilityId.Literacy as string))),

      // - Languages additions
      join (acc => over (composeL (CML.hero, HL.specialAbilities))
                        (alter (pipe (
                                 fromMaybe (
                                   createPlainActivatableDependent (SpecialAbilityId.Language)
                                 ),
                                 over (ActivatableDependentL.active)
                                      (append (pipe_ (
                                        acc,
                                        CMA.languages,
                                        foldrWithKey ((k: number) =>
                                                      (v: number) =>
                                                        consF (ActiveObject ({
                                                                          sid: Just (k),
                                                                          tier: Just (v),
                                                                        })))
                                                     (List ())
                                      ))),
                                 Just
                               ))
                               (SpecialAbilityId.Language as string))),

      // - Profession prerequisites
      join (pipe (
        CMA.professionPrerequisites,
        flip (foldr ((r: ProfessionPrerequisite) =>
                      ProfessionRequireIncreasable.is (r)
                        ? updateEntryDef (x => {
                                           const v = PRIA.value (r)

                                           if (AttributeDependent.is (x)) {
                                             return pipe_ (
                                               x,
                                               over (AttributeDependentL.value)

                                                    // If the value is already valid for the
                                                    // prerequisite, do not change it
                                                    (max (v)),
                                               Just
                                             )
                                           }

                                           if (SkillDependent.is (x)) {
                                             return pipe_ (
                                               x,
                                               over (SkillDependentL.value)

                                                    // If the value is already valid for the
                                                    // prerequisite, do not change it
                                                    (max (v)),
                                               Just
                                             )
                                           }

                                           if (ActivatableSkillDependent.is (x)) {
                                             return pipe_ (
                                               x,
                                               over (ActivatableSkillDependentL.value)

                                                    // If the value is already valid for the
                                                    // prerequisite, do not change it
                                                    (max (v)),
                                               Just
                                             )
                                           }

                                           return Nothing
                                         })
                                         (PRIA.id (r))
                        : maybe (ident as ident<HeroModelRecord>)
                                ((wiki_entry: Activatable) => join ((hero: HeroModelRecord) => {
                                  const mhero_entry =
                                    bind (getHeroStateItem (hero) (PRAA.id (r)))
                                         (ensure (ActivatableDependent.is))

                                  const active = reqToActive (r)

                                  if (or (fmapF (mhero_entry)
                                                (pipe (ADA.active, elem (active))))) {
                                    return ident
                                  }

                                  return updateListToContainNewEntry (action.payload.wiki)
                                                                     (wiki_entry)
                                                                     (mhero_entry)
                                                                     (active)
                                }))
                                (bind (getWikiEntry (action.payload.wiki) (PRAA.id (r)))
                                      (ensure (isActivatableWikiEntry))))),
        over (CML.hero)
      )),

      // - Cultural Package activation
      set (composeL (CML.hero, HL.isCulturalPackageActive))
          (action .payload .useCulturePackage),

      // - Lower Combat Techniques with too high CTR
      join (acc => over (composeL (CML.hero, HL.combatTechniques))
                        (maybe (ident as ident<HeroModel["combatTechniques"]>)
                               (pipe (min, over (SDL.value), OrderedMap.map))
                               (pipe_ (
                                 action .payload .wiki,
                                 WA.experienceLevels,
                                 lookup (HA.experienceLevel (CMA.hero (acc))),
                                 fmap (ELA.maxCombatTechniqueRating)
                               )))),

      /**
       * Deleted because of consistency, but may be reused when having a new way to
       * automatically handle pAE.
       *
       * if (isActive(acc.state.specialAbilities.get('SA_76'))) {
       *    permanentArcaneEnergyLoss += 2
       * }
       */

      CMA.hero
    )

export const applyRCPSelectionsReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ASSIGN_RCP_OPTIONS: {
        return pipe (concatModifications (action), applyModifications (action))
      }

      default:
        return ident
    }
  }
