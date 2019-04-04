import { flip, ident } from "../../Data/Function";
import { over, set } from "../../Data/Lens";
import { consF, foldr, List } from "../../Data/List";
import { ensure, maybe } from "../../Data/Maybe";
import { alter, OrderedMap } from "../../Data/OrderedMap";
import { OrderedSet } from "../../Data/OrderedSet";
import { fromDefault, makeLenses, Record } from "../../Data/Record";
import { SetSelectionsAction } from "../Actions/ProfessionActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { Categories } from "../Constants/Categories";
import { HeroModel, HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import * as Data from "../Models/Hero/heroTypeHelpers";
import { Culture } from "../Models/Wiki/Culture";
import { ProfessionRequireActivatable } from "../Models/Wiki/prerequisites/ActivatableRequirement";
import { Race } from "../Models/Wiki/Race";
import { IncreaseSkill } from "../Models/Wiki/sub/IncreaseSkill";
import * as Wiki from "../Models/Wiki/wikiTypeHelpers";
import { getCombinedPrerequisites } from "../Utilities/Activatable/activatableActivationUtils";
import { addAllStyleRelatedDependencies } from "../Utilities/Activatable/ExtendedStyleUtils";
import { composeL } from "../Utilities/compose";
import { updateEntryDef } from "../Utilities/heroStateUtils";
import { ifElse } from "../Utilities/ifElse";
import { add, gt } from "../Utilities/mathUtils";
import { pipe } from "../Utilities/pipe";

type Action = SetSelectionsAction

const addToSkillRatingList = (value: number) =>
                               alter (pipe (maybe (value) (add (value)), ensure (gt (0))))

interface ConcatenatedModifications {
  hero: HeroModelRecord
  skillRatingList: OrderedMap<string, number>
  skillActivateList: OrderedSet<string>
  activatable: List<Record<ProfessionRequireActivatable>>
  languages: OrderedMap<number, number>
  scripts: OrderedSet<number>
  professionPrerequisites: List<Wiki.ProfessionPrerequisite>
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
const ISA = IncreaseSkill.A

// const modIdentityFn = ident (acc: ConcatenatedModifications) => acc

const concatBaseModifications = (action: SetSelectionsAction) => {
  const {
    race,
    culture,
    profession,
    professionVariant: maybeProfessionVariant,
  } = action.payload

  return pipe (

    // Race selections:

    over (CML.activatable)
         (flip (foldr ((current_id: string) =>
                        consF (ProfessionRequireActivatable ({ id: current_id, active: true }))))
               (RA.automaticAdvantages (race))),

    set (composeL (CML.hero, HL.attributeAdjustmentSelected))
        (action.payload.attributeAdjustment),

    // Culture selections:

    action.payload.useCulturePackage
      ? over (CML.skillRatingList)
             (flip (foldr ((skill: Record<IncreaseSkill>) =>
                            addToSkillRatingList (ISA.value (skill))
                                                 (ISA.id (skill))))
                   (CA.culturalPackageSkills (culture)))
      : ident,



    (acc: Record<ConcatenatedModifications>) => ({
      ...acc,
      languages: Maybe.fromMaybe (acc.languages) (
        ifElse<List<number>, Maybe<number>> (R.pipe (List.lengthL, R.lt (1)))
                                            (() => Just (action .payload .motherTongue))
                                            (Maybe.listToMaybe)
                                            (culture.get ("languages"))
          .fmap (motherTongueId => acc.languages.insert (motherTongueId) (4))
      ),
      scripts: action .payload .isBuyingMainScriptEnabled
        ? Maybe.fromMaybe (acc.scripts) (
          ifElse<List<number>, Maybe<number>> (R.pipe (List.lengthL, R.lt (1)))
                                              (() => Just (action .payload .mainScript))
                                              (Maybe.listToMaybe)
                                              (culture.get ("scripts"))
            .fmap (motherTongueScriptId => acc.scripts.insert (motherTongueScriptId))
        )
        : acc.scripts,
    }),

    // // Profession selections:
    // (acc: ConcatenatedModifications) => ({
    //   ...acc,
    //   skillRatingList: profession.get ("skills")
    //     .mappend (profession.get ("combatTechniques"))
    //     .foldl<ConcatenatedModifications["skillRatingList"]> (
    //       skillRatingList => skill => addToSkillRatingList (
    //         skill.get ("id"),
    //         skill.get ("value"),
    //         skillRatingList
    //       )
    //     ) (acc.skillRatingList),
    //   state: profession.get ("blessings")
    //     .foldl<ConcatenatedModifications["hero"]> (
    //       accState => blessing => accState.modify<"blessings"> (
    //         blessings => blessings.insert (blessing)
    //       ) ("blessings")
    //     ) (acc.hero),
    //   activatable: profession.get ("specialAbilities")
    //     .foldl<ConcatenatedModifications["activatable"]> (List.cons) (acc.activatable),
    //   professionPrerequisites: profession.get ("prerequisites"),
    // }),
    // (acc: ConcatenatedModifications) =>
    //   profession.get ("spells")
    //     .mappend (profession.get ("liturgicalChants"))
    //     .foldl<ConcatenatedModifications> (
    //       accAll => skill => ({
    //         ...accAll,
    //         skillActivateList: accAll.skillActivateList.insert (skill.get ("id")),
    //         skillRatingList: addToSkillRatingList (
    //           skill.get ("id"),
    //           skill.get ("value"),
    //           accAll.skillRatingList
    //         ),
    //       })
    //     ) (acc),

    // // Profession variant selections:
    // Maybe.fromMaybe (modIdentityFn) (
    //   maybeProfessionVariant
    //     .fmap (
    //       professionVariant => R.pipe (
    //         (acc: ConcatenatedModifications) => ({
    //           ...acc,
    //           skillRatingList: professionVariant.get ("skills")
    //             .mappend (professionVariant.get ("combatTechniques"))
    //             .foldl<ConcatenatedModifications["skillRatingList"]> (
    //               skillRatingList => skill => addToSkillRatingList (
    //                 skill.get ("id"),
    //                 skill.get ("value"),
    //                 skillRatingList
    //               )
    //             ) (acc.skillRatingList),
    //           state: professionVariant.get ("blessings")
    //             .foldl<ConcatenatedModifications["hero"]> (
    //               accState => blessing => accState.modify<"blessings"> (
    //                 blessings => blessings.insert (blessing)
    //               ) ("blessings")
    //             ) (acc.hero),
    //           activatable: professionVariant.get ("specialAbilities")
    //             .foldl<ConcatenatedModifications["activatable"]> (
    //               accActivatable => specialAbility => {
    //                 if (!specialAbility.get ("active")) {
    //                   return accActivatable.filter (
    //                     e => e.get ("id") !== specialAbility.get ("id")
    //                   )
    //                 }
    //                 else {
    //                   return accActivatable.cons (specialAbility)
    //                 }
    //               }
    //             ) (acc.activatable),
    //           professionPrerequisites: professionVariant.get ("prerequisites")
    //             .foldl<ConcatenatedModifications["professionPrerequisites"]> (
    //               professionPrerequisites => req => {
    //                 if (isProfessionRequiringIncreasable (req) || req.get ("active") !== false) {
    //                   return professionPrerequisites.cons (req)
    //                 }
    //                 else {
    //                   return Maybe.fromMaybe (professionPrerequisites) (
    //                     professionPrerequisites.findIndex (
    //                       R.equals<Wiki.ProfessionPrerequisite> (req)
    //                     )
    //                       .fmap (professionPrerequisites.deleteAt)
    //                   )
    //                 }
    //               }
    //             ) (acc.professionPrerequisites),
    //         }),
    //         (acc: ConcatenatedModifications) =>
    //           professionVariant.get ("spells")
    //             .mappend (professionVariant.get ("liturgicalChants"))
    //             .foldl<ConcatenatedModifications> (
    //               accAll => skill => {
    //                 const intermediateState: ConcatenatedModifications = {
    //                   ...accAll,
    //                   skillActivateList: accAll.skillActivateList.insert (skill.get ("id")),
    //                   skillRatingList: addToSkillRatingList (
    //                     skill.get ("id"),
    //                     skill.get ("value"),
    //                     accAll.skillRatingList
    //                   ),
    //                 }

    //                 if (intermediateState.skillRatingList.notMember (skill.get ("id"))) {
    //                   return {
    //                     ...intermediateState,
    //                     skillActivateList: intermediateState.skillActivateList
    //                       .delete (skill.get ("id")),
    //                   }
    //                 }

    //                 return intermediateState
    //               }
    //             ) (acc)
    //       )
    //     )
    // )
  )
}

const concatSpecificModifications = (action: SetSelectionsAction) => {
  const { wiki } = action.payload

  return R.pipe (
    // - Skill Specialization
    Maybe.maybe (modIdentityFn) (
      specialization => (acc: ConcatenatedModifications) => {
        const { specialization: specializationSelection, specializationSkillId } = action.payload
        const talentId = (specialization as Record<Wiki.SpecializationSelection>) .get ("sid")

        if (
          talentId instanceof List
          && Maybe.isJust (specializationSkillId)
          && Maybe.isJust (specializationSelection)
        ) {
          return {
            ...acc,
            activatable: acc.activatable.cons (
              Record.of<Wiki.ProfessionRequiresActivatableObject> ({
                id: "SA_9",
                active: true,
                sid: Maybe.fromJust (specializationSkillId),
                sid2: Maybe.fromJust (specializationSelection),
              })
            ),
          }
        }

        if (typeof talentId === "string" && Maybe.isJust (specializationSelection)) {
          return {
            ...acc,
            activatable: acc.activatable.cons (
              Record.of<Wiki.ProfessionRequiresActivatableObject> ({
                id: "SA_9",
                active: true,
                sid: talentId,
                sid2: Maybe.fromJust (specializationSelection),
              })
            ),
          }
        }

        return acc
      }
    ) (action.payload.map.lookup (Wiki.ProfessionSelectionIds.SPECIALIZATION)),

    // // - Terrain Knowledge
    // Maybe.maybe (modIdentityFn) (
    //   () => (acc: ConcatenatedModifications) => {
    //     const { terrainKnowledge } = action.payload

    //     if (Maybe.isJust (terrainKnowledge)) {
    //       return {
    //         ...acc,
    //         activatable: acc.activatable.cons (
    //           Record.of<Wiki.ProfessionRequiresActivatableObject> ({
    //             id: "SA_9",
    //             active: true,
    //             sid: Maybe.fromJust (terrainKnowledge),
    //           })
    //         ),
    //       }
    //     }

    //     return acc
    //   }
    // ) (action.payload.map.lookup (Wiki.ProfessionSelectionIds.TERRAIN_KNOWLEDGE)),

    // // - Language and Scripts
    // action.payload.languages
    //   .foldlWithKey<ConcatenatedModifications> (
    //     accAll => id => value => ({
    //       ...accAll,
    //       languages: accAll .languages .insert (id) (value),
    //     })
    //   ),

    // action.payload.scripts
    //   .foldlWithKey<ConcatenatedModifications> (
    //     accAll => id => _ => ({
    //       ...accAll,
    //       scripts: accAll .scripts .insert (id),
    //     })
    //   ),

    // // - Combat Techniques
    // (acc: ConcatenatedModifications) =>
    //   Maybe.fromMaybe (acc) (
    //     (
    //       action.payload.map
    //         .lookup (Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES) as
    //           Maybe<Record<Wiki.CombatTechniquesSelection>>
    //     )
    //       .fmap (
    //         obj => ({
    //           ...acc,
    //           skillRatingList: action .payload .combatTechniques
    //             .foldl<ConcatenatedModifications["skillRatingList"]> (
    //               accSkillRatingList => e => addToSkillRatingList (
    //                 e,
    //                 obj.get ("value"),
    //                 accSkillRatingList
    //               )
    //             ) (acc.skillRatingList),
    //         })
    //       )
    //   ),

    // // - Second Combat Techniques
    // (acc: ConcatenatedModifications) =>
    //   Maybe.fromMaybe (acc) (
    //     (action.payload.map
    //       .lookup (Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND) as
    //         Maybe<Record<Wiki.CombatTechniquesSecondSelection>>)
    //       .fmap (
    //         obj => ({
    //           ...acc,
    //           skillRatingList: action .payload .combatTechniquesSecond
    //             .foldl<ConcatenatedModifications["skillRatingList"]> (
    //               accSkillRatingList => e => addToSkillRatingList (
    //                 e,
    //                 obj.get ("value"),
    //                 accSkillRatingList
    //               )
    //             ) (acc.skillRatingList),
    //         })
    //       )
    //   ),

    // // - Cantrips
    // (acc: ConcatenatedModifications) =>
    //   ({
    //     ...acc,
    //     state: action.payload.cantrips.foldl<ConcatenatedModifications["hero"]> (
    //       accState => e => accState.modify<"cantrips"> (OrderedSet.insert (e)) ("cantrips")
    //     ) (acc.hero),
    //   }),

    // // - Curses
    // action.payload.curses.foldlWithKey<ConcatenatedModifications> (
    //   accAll => id => value => ({
    //     ...accAll,
    //     skillActivateList: accAll.skillActivateList.insert (id),
    //     skillRatingList: addToSkillRatingList (id, value, accAll.skillRatingList),
    //   })
    // ),

    // // - Skills
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
