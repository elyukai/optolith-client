import { notEquals } from "../../Data/Eq";
import { cnst, flip, ident } from "../../Data/Function";
import { over, set } from "../../Data/Lens";
import { append, consF, filter, flength, foldr, isList, List } from "../../Data/List";
import { ensure, isJust, Just, listToMaybe, maybe, Maybe } from "../../Data/Maybe";
import { alter, foldrWithKey, insertF, keys, member, OrderedMap } from "../../Data/OrderedMap";
import { insert, OrderedSet, union } from "../../Data/OrderedSet";
import { fromDefault, makeLenses, Record } from "../../Data/Record";
import { SetSelectionsAction } from "../Actions/ProfessionActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { Categories } from "../Constants/Categories";
import { HeroModel, HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import { Culture } from "../Models/Wiki/Culture";
import { ProfessionRequireActivatable } from "../Models/Wiki/prerequisites/ActivatableRequirement";
import { ProfessionRequireIncreasable } from "../Models/Wiki/prerequisites/IncreasableRequirement";
import { Profession } from "../Models/Wiki/Profession";
import { CombatTechniquesSelection } from "../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { ProfessionSelections } from "../Models/Wiki/professionSelections/ProfessionAdjustmentSelections";
import { CombatTechniquesSecondSelection } from "../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { SpecializationSelection } from "../Models/Wiki/professionSelections/SpecializationSelection";
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant";
import { Race } from "../Models/Wiki/Race";
import { IncreaseSkill } from "../Models/Wiki/sub/IncreaseSkill";
import { ProfessionPrerequisite, ProfessionSelectionIds } from "../Models/Wiki/wikiTypeHelpers";
import { getCombinedPrerequisites } from "../Utilities/Activatable/activatableActivationUtils";
import { addAllStyleRelatedDependencies } from "../Utilities/Activatable/ExtendedStyleUtils";
import { composeL } from "../Utilities/compose";
import { updateEntryDef } from "../Utilities/heroStateUtils";
import { prefixSA } from "../Utilities/IDUtils";
import { ifElse } from "../Utilities/ifElse";
import { add, gt } from "../Utilities/mathUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { isString } from "../Utilities/typeCheckUtils";

interface ConcatenatedModifications {
  hero: HeroModelRecord
  skillRatingList: OrderedMap<string, number>
  skillActivateList: OrderedSet<string>
  activatable: List<Record<ProfessionRequireActivatable>>
  languages: OrderedMap<number, number>
  scripts: OrderedSet<number>
  professionPrerequisites: List<ProfessionPrerequisite>
}

const ConcatenatedModifications =
  fromDefault<ConcatenatedModifications> ({
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
const HA = HeroModel.A
const HL = HeroModelL
const RA = Race.A
const CA = Culture.A
const PA = Profession.A
const PVA = ProfessionVariant.A
const PRAA = ProfessionRequireActivatable.A
const PRIA = ProfessionRequireIncreasable.A
const PSA = ProfessionSelections.A
const ISA = IncreaseSkill.A

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
            (ifElse<List<number>, Maybe<number>> (pipe (flength, gt (1)))
                                                 (cnst (Just (action .payload .motherTongue)))
                                                 (listToMaybe)
                                                 (CA.languages (culture))),

      maybe (ident as ident<Record<ConcatenatedModifications>>)
            <number> (pipe (insert, over (CML.scripts)))
            (ifElse<List<number>, Maybe<number>> (pipe (flength, gt (1)))
                                                 (cnst (Just (action .payload .mainScript)))
                                                 (listToMaybe)
                                                 (CA.scripts (culture)))
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

      foldIncSkillsIntoSRs (prof_spells_chants),

      over (CML.skillActivateList)
           (flip (foldr (pipe (ISA.id, insert)))
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
                                  // Having an `active = True` on a special
                                  // ability entry of a profession variant
                                  // should remove the entry of the SA added by
                                  // the profession
                                  if (!PRAA.active (sa)) {
                                    return filter (pipe (PRAA.id, notEquals (PRAA.id (sa))))
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

              foldIncSkillsIntoSRs (prof_var_spells_chants),

              cm =>
                over (CML.skillActivateList)
                     (flip (foldr (pipe (ISA.id, x => member (x) (CMA.skillRatingList (cm))
                                                        ? insert (x)
                                                        : ident as ident<OrderedSet<string>>)))
                           (prof_var_spells_chants))
                     (cm)
            )})
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
                              id: prefixSA (9),
                              active: true,
                              sid: mselected_skill,
                              sid2: mselected_app,
                            })))
              }

              if (isString (possible_skills) && isJust (mselected_app)) {
                return over (CML.activatable)
                            (consF (ProfessionRequireActivatable ({
                              id: prefixSA (9),
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
                              id: prefixSA (12),
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
            (x => foldIntoSRsFrom (ident as ident<string>)
                                  (cnst (CombatTechniquesSelection.A.value (x)))
                                  (OrderedSet.toList (P.combatTechniques)))
    ),

    // - Second Combat Techniques
    pipe_ (
      P.map,
      PSA [ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND],
      maybe (ident as ident<Record<ConcatenatedModifications>>)
            (x => foldIntoSRsFrom (ident as ident<string>)
                                  (cnst (CombatTechniquesSecondSelection.A.value (x)))
                                  (OrderedSet.toList (P.combatTechniquesSecond)))
    ),

    // - Cantrips
    over (composeL (CML.hero, HL.cantrips))
         (union (P.cantrips)),

    // - Curses

    // action.payload.curses.foldlWithKey<ConcatenatedModifications> (
    //   accAll => id => value => ({
    //     ...accAll,
    //     skillActivateList: accAll.skillActivateList.insert (id),
    //     skillRatingList: addToSkillRatingList (id, value, accAll.skillRatingList),
    //   })
    // ),

    // - Skills
    // (acc: ConcatenatedModifications) =>
    //   ({
    //     ...acc,
    //     skillRatingList: action.payload.skills
    //       .foldlWithKey<ConcatenatedModifications["skillRatingList"]> (
    //         skillRatingList => id => value => Maybe.fromMaybe (skillRatingList) (
    //           wiki.get ("skills").lookup (id)
    //             .fmap (
    //               skill => addToSkillRatingList (
    //                 id,
    //                 value / skill.get ("ic"),
    //                 skillRatingList
    //               )
    //             )
    //         )
    //       ) (acc.skillRatingList),
    //   })
  )
}

const concatModifications = (
  state: Record<Data.HeroDependent>,
  action: SetSelectionsAction
): ConcatenatedModifications => {
  const concatenatedModifications: ConcatenatedModifications = {
    hero: state,
    skillRatingList: OrderedMap.empty (),
    skillActivateList: OrderedSet.empty (),
    activatable: List.of (),
    languages: OrderedMap.empty (),
    scripts: OrderedSet.empty (),
    professionPrerequisites: List.of (),
  }

  const pipeModifications = R.pipe (
    concatBaseModifications (action),
    concatSpecificModifications (action)
  )

  return pipeModifications (concatenatedModifications)
}

const applyModifications = (action: SetSelectionsAction) => pipe (
  // - Skill activations
  (acc: ConcatenatedModifications) => ({
    ...acc,
    state: acc.skillActivateList.foldl<ConcatenatedModifications["hero"]> (
      state => id => updateHeroListStateItemOr (
        createActivatableDependentSkill,
        e => Just (e.insert ("active") (true)),
        id
      ) (state)
    ) (acc.hero),
  }),

  // - Skill rating increases
  (acc: ConcatenatedModifications) => ({
    ...acc,
    state: acc.skillRatingList.foldlWithKey<ConcatenatedModifications["hero"]> (
      state => id => value => updateEntryDef (
        e => Just (
          (e as any as Record<{ value: number [key: string]: any }>)
            .modify<"value"> (R.add (value)) ("value")
        ) as any as Just<Data.Dependent>,
        id
      ) (state)
    ) (acc.state),
  }),

  // // - Activatable additions
  // (acc: ConcatenatedModifications) => ({
  //   ...acc,
  //   state: acc.activatable.foldl<ConcatenatedModifications["hero"]> (
  //     state => req => Maybe.maybe<Wiki.Activatable, Data.Hero> (state) (
  //       wikiEntry => {
  //         const entry = getHeroStateItem (req.get ("id")) (state) as
  //           Maybe<Record<Data.ActivatableDependent>>

  //         const activeObject = getActiveObjectCore (req as any)

  //         return updateListToContainNewEntry (
  //           state,
  //           wikiEntry,
  //           entry,
  //           activeObject
  //         )
  //       }
  //     ) (getWikiEntry (action.payload.wiki) (req.get ("id")) as Maybe<Wiki.Activatable>)
  //   ) (acc.hero),
  // }),

  // // - Scripts additions
  // (acc: ConcatenatedModifications) => ({
  //   ...acc,
  //   state: updateHeroListStateItemOr (
  //     createActivatableDependent,
  //     scripts => Just (
  //       scripts.modify<"active"> (
  //         active => active.mappend (
  //           acc.scripts.elems ().map (
  //             script => Record.of<Data.ActiveObject> ({ sid: script })
  //           )
  //         )
  //       ) ("active")
  //     ),
  //     "SA_27"
  //   ) (acc.hero),
  // }),

  // // - Languages additions
  // (acc: ConcatenatedModifications) => ({
  //   ...acc,
  //   state: updateHeroListStateItemOr (
  //     createActivatableDependent,
  //     languages => Just (
  //       languages.modify<"active"> (
  //         active => active.mappend (
  //           acc.languages.assocs ().map (
  //             language => Record.of<Data.ActiveObject> ({
  //               sid: Tuple.fst (language),
  //               tier: Tuple.snd (language),
  //             })
  //           )
  //         )
  //       ) ("active")
  //     ),
  //     "SA_29"
  //   ) (acc.hero),
  // }),

  // // - Profession prerequisites
  // (acc: ConcatenatedModifications) => ({
  //   ...acc,
  //   state: acc.professionPrerequisites.foldl<ConcatenatedModifications["hero"]> (
  //     state => req => {
  //       if (isProfessionRequiringIncreasable (req)) {
  //         return updateEntryDef (
  //           e => Just (
  //             (e as any as Record<{ value: number [key: string]: any }>)
  //               .insert ("value") (req.get ("value"))
  //           ) as any as Just<Data.Dependent>,
  //           req.get ("id")
  //         ) (state)
  //       }
  //       else {
  //         return Maybe.maybe<Wiki.Activatable, Data.Hero> (state) (
  //           wikiEntry => {
  //             const entry = getHeroStateItem (req.get ("id")) (state) as
  //               Maybe<Record<Data.ActivatableDependent>>

  //             const activeObject = getActiveObjectCore (req as any)

  //             const checkIfActive = R.equals (activeObject)

  //             if (
  //               Maybe.fromMaybe (false) (
  //                 entry.fmap (justEntry => justEntry.get ("active").any (checkIfActive))
  //               )
  //             ) {
  //               return state
  //             }

  //             return updateListToContainNewEntry (
  //               state,
  //               wikiEntry,
  //               entry,
  //               activeObject
  //             )
  //           }
  //         ) (getWikiEntry (action.payload.wiki) (req.get ("id")) as Maybe<Wiki.Activatable>)
  //       }
  //     }
  //   ) (acc.state),
  // }),

  // // - Lower Combat Techniques with too high CTR
  // acc => ({
  //   ...acc,
  //   state: acc.state.modify<"combatTechniques"> (
  //     combatTechniques => {
  //       const maybeMaxCombatTechniqueRating = action.payload.wiki.get ("experienceLevels")
  //         .lookup (acc.state.get ("experienceLevel"))
  //         .fmap (el => el.get ("maxCombatTechniqueRating"))

  //       return Maybe.fromMaybe (combatTechniques) (
  //         maybeMaxCombatTechniqueRating.fmap (
  //           maxCombatTechniqueRating => combatTechniques.map (
  //             combatTechnique => combatTechnique.modify<"value"> (R.min (maxCombatTechniqueRating))
  //                                                                ("value")
  //           )
  //         )
  //       )
  //     }
  //   ) ("combatTechniques"),
  // }),

  /**
   * Deleted because of consistency, but may be reused when having a new way to
   * automatically handle pAE.
   *
   * if (isActive(acc.state.specialAbilities.get('SA_76'))) {
   *    permanentArcaneEnergyLoss += 2
   * }
   */

  acc => acc.state
)

export const applyRCPSelectionsReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ASSIGN_RCP_OPTIONS: {
        const concatenatedModifications = concatModifications (state, action)

        return applyModifications (action) (concatenatedModifications)
      }

      default:
        return state
    }
  }

function updateListToContainNewEntry (
  state: Record<Data.HeroDependent>,
  wikiEntry: Wiki.Activatable,
  entry: Maybe<Record<Data.ActivatableDependent>>,
  activeObject: Record<Data.ActiveObject>
): Record<Data.HeroDependent> {
  type Actives = Data.ActivatableDependent["active"]
  type Active = Record<Data.ActiveObject>

  const intermediateState = addDependencies (
    updateHeroListStateItemOr (
      createActivatableDependent,
      currentEntry => Just (
        currentEntry.modify<"active"> (flip<Actives, Active, Actives> (List.cons) (activeObject))
                                      ("active")
      ),
      wikiEntry.get ("id")
    ) (state),
    getCombinedPrerequisites (
      wikiEntry,
      entry,
      activeObject,
      true
    ),
    wikiEntry.get ("id")
  )

  if (wikiEntry.toObject ().category === Categories.SPECIAL_ABILITIES) {
    return addAllStyleRelatedDependencies (
      intermediateState,
      wikiEntry as Record<Wiki.SpecialAbility>
    )
  }

  return intermediateState
}
