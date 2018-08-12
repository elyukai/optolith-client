import R from 'ramda';
import { CreateHeroAction } from '../actions/HerolistActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import { ActionTypes } from '../constants/ActionTypes';
import { Categories } from '../constants/Categories';
import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { getActiveObjectCore } from '../utils/activatableConvertUtils';
import { getCombinedPrerequisites } from '../utils/activationUtils';
import { isProfessionRequiringIncreasable } from '../utils/checkPrerequisiteUtils';
import { createActivatableDependent, createActivatableDependentSkill } from '../utils/createEntryUtils';
import { Just, List, Maybe, OrderedMap, OrderedSet, Record, Tuple } from '../utils/dataUtils';
import { addDependencies } from '../utils/dependencyUtils';
import { addAllStyleRelatedDependencies } from '../utils/ExtendedStyleUtils';
import { adjustHeroListStateItemOr, adjustHeroListStateItemWithDefault, getHeroStateListItem } from '../utils/heroStateUtils';
import { getWikiEntry } from '../utils/WikiUtils';

type Action = CreateHeroAction | SetSelectionsAction;

const addToSkillRatingList = (
  id: string,
  value: number,
  skillRatingList: OrderedMap<string, number>
) =>
  skillRatingList.alter(
    currentValue => Maybe.ensure(
      x => x > 0,
      Maybe.fromMaybe(0, currentValue) + value
    ),
    id
  );

interface ConcatenatedModifications {
  state: Record<Data.HeroDependent>;
  skillRatingList: OrderedMap<string, number>;
  skillActivateList: OrderedSet<string>;
  activatable: List<Record<Wiki.ProfessionRequiresActivatableObject>>;
  languages: OrderedMap<number, number>;
  scripts: OrderedSet<number>;
  professionPrerequisites: List<Wiki.ProfessionPrerequisite>;
}

const modIdentityFn = (acc: ConcatenatedModifications) => acc;

const concatBaseModifications = (action: SetSelectionsAction) => {
  const {
    race,
    culture,
    profession,
    professionVariant: maybeProfessionVariant
  } = action.payload;

  return R.pipe(
    // Race selections:
    (acc: ConcatenatedModifications) => ({
      ...acc,
      activatable: race.get('automaticAdvantages')
        .foldl(
          accActivatable => advantage => accActivatable.append(
            Record.of<Wiki.ProfessionRequiresActivatableObject>({ id: advantage, active: true })
          ),
          acc.activatable
        ),
      state: race.get('attributeAdjustments')
        .foldl(
          accState => adjustment => accState.modify(
            attributes => attributes.adjust(
              attr => attr.modify(mod => mod + Tuple.fst(adjustment), 'mod'),
              Tuple.snd(adjustment)
            ),
            'attributes'
          ),
          acc.state
        )
        .modify(
          attributes => attributes.adjust(
            attr => attr.modify(
              mod => Maybe.fromMaybe(
                mod,
                race.get('attributeAdjustmentsSelection').head()
                  .map(selectedMod => Tuple.fst(selectedMod) + mod)
              ),
              'mod'
            ),
            action.payload.attrSel
          ),
          'attributes'
        )
    }),

    // Culture selections:
    (acc: ConcatenatedModifications) => ({
      ...acc,
      skillRatingList: action.payload.useCulturePackage
        ? culture.get('culturalPackageSkills')
            .foldl(
              skillRatingList => skill => skillRatingList.insert(
                skill.get('id'),
                skill.get('value')
              ),
              acc.skillRatingList
            )
        : acc.skillRatingList,
      languages: Maybe.fromMaybe(
        acc.languages,
        (
          culture.get('languages').length() > 1
            ? Just(action.payload.lang)
            : culture.get('languages').head()
        )
          .fmap(motherTongueId => acc.languages.insert(motherTongueId, 4))
      ),
      scripts: action.payload.buyLiteracy
        ? Maybe.fromMaybe(
            acc.scripts,
            (
              culture.get('scripts').length() > 1
                ? Just(action.payload.litc)
                : culture.get('scripts').head()
            )
              .fmap(motherTongueScriptId => acc.scripts.insert(motherTongueScriptId))
          )
        : acc.scripts
    }),

    // Profession selections:
    (acc: ConcatenatedModifications) => ({
      ...acc,
      skillRatingList: profession.get('skills')
        .concat(profession.get('combatTechniques'))
        .foldl(
          skillRatingList => skill => addToSkillRatingList(
            skill.get('id'),
            skill.get('value'),
            skillRatingList
          ),
          acc.skillRatingList
        ),
      state: profession.get('blessings')
        .foldl(
          accState => blessing => accState.modify(
            blessings => blessings.insert(blessing),
            'blessings'
          ),
          acc.state
        ),
      activatable: profession.get('specialAbilities')
        .foldl(
          accActivatable => specialAbility => accActivatable.append(specialAbility),
          acc.activatable
        ),
      professionPrerequisites: profession.get('prerequisites')
    }),
    (acc: ConcatenatedModifications) =>
      profession.get('spells')
        .concat(profession.get('liturgicalChants'))
        .foldl(
          accAll => skill => ({
            ...accAll,
            skillActivateList: accAll.skillActivateList.insert(skill.get('id')),
            skillRatingList: addToSkillRatingList(
              skill.get('id'),
              skill.get('value'),
              accAll.skillRatingList
            ),
          }),
          acc
        ),

    // Profession variant selections:
    Maybe.fromMaybe(
      modIdentityFn,
      maybeProfessionVariant
        .fmap(
          professionVariant => R.pipe(
            (acc: ConcatenatedModifications) => ({
              ...acc,
              skillRatingList: professionVariant.get('skills')
                .concat(professionVariant.get('combatTechniques'))
                .foldl(
                  skillRatingList => skill => addToSkillRatingList(
                    skill.get('id'),
                    skill.get('value'),
                    skillRatingList
                  ),
                  acc.skillRatingList
                ),
              state: professionVariant.get('blessings')
                .foldl(
                  accState => blessing => accState.modify(
                    blessings => blessings.insert(blessing),
                    'blessings'
                  ),
                  acc.state
                ),
              activatable: professionVariant.get('specialAbilities')
                .foldl(
                  accActivatable => specialAbility => {
                    if (!specialAbility.get('active')) {
                      return accActivatable.filter(
                        e => e.get('id') !== specialAbility.get('id')
                      );
                    }
                    else {
                      return accActivatable.append(specialAbility);
                    }
                  },
                  acc.activatable
                ),
              professionPrerequisites: professionVariant.get('prerequisites')
                .foldl(
                  professionPrerequisites => req => {
                    if (isProfessionRequiringIncreasable(req) || req.get('active') !== false) {
                      return professionPrerequisites.append(req);
                    }
                    else {
                      return Maybe.fromMaybe(
                        professionPrerequisites,
                        professionPrerequisites.findIndex(
                          R.equals<Wiki.ProfessionPrerequisite>(req)
                        )
                          .fmap(professionPrerequisites.deleteAt)
                      );
                    }
                  },
                  acc.professionPrerequisites
                )
            }),
            (acc: ConcatenatedModifications) =>
              professionVariant.get('spells')
                .concat(professionVariant.get('liturgicalChants'))
                .foldl(
                  accAll => skill => {
                    const intermediateState: ConcatenatedModifications = {
                      ...accAll,
                      skillActivateList: accAll.skillActivateList.insert(skill.get('id')),
                      skillRatingList: addToSkillRatingList(
                        skill.get('id'),
                        skill.get('value'),
                        accAll.skillRatingList
                      ),
                    };

                    if (intermediateState.skillRatingList.notMember(skill.get('id'))) {
                      return {
                        ...intermediateState,
                        skillActivateList: intermediateState.skillActivateList
                          .delete(skill.get('id'))
                      };
                    }

                    return intermediateState;
                  },
                  acc
                ),
          )
        )
    ),
  );
};

const concatSpecificModifications = (action: SetSelectionsAction) => {
  const { wiki } = action.payload;

  return R.pipe(
    // - Skill Specialization
    Maybe.maybe(
      modIdentityFn,
      specialization => (acc: ConcatenatedModifications) => {
        const { spec, specTalentId } = action.payload;
        const talentId = (specialization as Record<Wiki.SpecializationSelection>).get('sid');

        if (talentId instanceof List && specTalentId) {
          return {
            ...acc,
            activatable: acc.activatable.append(
              Record.of<Wiki.ProfessionRequiresActivatableObject>({
                id: 'SA_9',
                active: true,
                sid: specTalentId,
                sid2: spec,
              })
            )
          };
        }
        else if (typeof talentId === 'string') {
          return {
            ...acc,
            activatable: acc.activatable.append(
              Record.of<Wiki.ProfessionRequiresActivatableObject>({
                id: 'SA_9',
                active: true,
                sid: talentId,
                sid2: spec,
              })
            )
          };
        }
        else {
          return acc;
        }
      },
      action.payload.map.lookup(Wiki.ProfessionSelectionIds.SPECIALISATION)
    ),

    // - Terrain Knowledge
    Maybe.maybe(
      modIdentityFn,
      () => (acc: ConcatenatedModifications) => {
        const { terrainKnowledge } = action.payload;

        return {
          ...acc,
          activatable: acc.activatable.append(
            Record.of<Wiki.ProfessionRequiresActivatableObject>({
              id: 'SA_9',
              active: true,
              sid: terrainKnowledge,
            })
          )
        };
      },
      action.payload.map.lookup(Wiki.ProfessionSelectionIds.TERRAIN_KNOWLEDGE)
    ),

    // - Language and Scripts
    (acc: ConcatenatedModifications) =>
      action.payload.langLitc
        .foldlWithKey(
          accAll => key => value => {
            const [ category, id ] = key.split('_');

            if (category === 'LANG') {
              return {
                ...accAll,
                languages: accAll.languages.insert(Number.parseInt(id), value / 2)
              };
            }
            else {
              return {
                ...accAll,
                scripts: accAll.scripts.insert(Number.parseInt(id))
              };
            }
          },
          acc
        ),

    // - Combat Techniques
    (acc: ConcatenatedModifications) =>
      Maybe.fromMaybe(
        acc,
        (action.payload.map
          .lookup(Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES) as
            Maybe<Record<Wiki.CombatTechniquesSelection>>)
          .fmap(
            obj => ({
              ...acc,
              skillRatingList: action.payload.combattech.foldl(
                accSkillRatingList => e => addToSkillRatingList(
                  e,
                  obj.get('value'),
                  accSkillRatingList
                ),
                acc.skillRatingList
              )
            })
          )
      ),

    // - Second Combat Techniques
    (acc: ConcatenatedModifications) =>
      Maybe.fromMaybe(
        acc,
        (action.payload.map
          .lookup(Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND) as
            Maybe<Record<Wiki.CombatTechniquesSecondSelection>>)
          .fmap(
            obj => ({
              ...acc,
              skillRatingList: action.payload.combatTechniquesSecond.foldl(
                accSkillRatingList => e => addToSkillRatingList(
                  e,
                  obj.get('value'),
                  accSkillRatingList
                ),
                acc.skillRatingList
              )
            })
          )
      ),

    // - Cantrips
    (acc: ConcatenatedModifications) =>
      ({
        ...acc,
        state: action.payload.cantrips.foldl(
          accState => e => accState.modify(
            cantrips => cantrips.insert(e),
            'cantrips'
          ),
          acc.state
        )
      }),

    // - Curses
    (acc: ConcatenatedModifications) =>
      action.payload.curses.foldlWithKey(
        accAll => id => value => ({
          ...accAll,
          skillActivateList: accAll.skillActivateList.insert(id),
          skillRatingList: addToSkillRatingList(id, value, accAll.skillRatingList)
        }),
        acc
      ),

    // - Skills
    (acc: ConcatenatedModifications) =>
      ({
        ...acc,
        skillRatingList: action.payload.skills.foldlWithKey(
          skillRatingList => id => value => Maybe.fromMaybe(
            skillRatingList,
            wiki.get('skills').lookup(id)
              .fmap(
                skill => addToSkillRatingList(
                  id,
                  value / skill.get('ic'),
                  skillRatingList
                )
              )
          ),
          acc.skillRatingList
        )
      }),
  );
};

const concatModifications = (
  state: Record<Data.HeroDependent>,
  action: SetSelectionsAction
): ConcatenatedModifications => {
  const concatenatedModifications: ConcatenatedModifications = {
    state,
    skillRatingList: OrderedMap.empty(),
    skillActivateList: OrderedSet.empty(),
    activatable: List.of(),
    languages: OrderedMap.empty(),
    scripts: OrderedSet.empty(),
    professionPrerequisites: List.of()
  };

  const pipeModifications = R.pipe(
    concatBaseModifications(action),
    concatSpecificModifications(action)
  );

  return pipeModifications(concatenatedModifications);
};

const applyModifications = (action: SetSelectionsAction) => R.pipe(
  // - Skill activations
  (acc: ConcatenatedModifications) => ({
    ...acc,
    state: acc.skillActivateList.foldl(
      state => id => adjustHeroListStateItemOr(
        createActivatableDependentSkill,
        e => Just(e.insert('active', true)),
        id
      )(state),
      acc.state
    )
  }),

  // - Skill rating increases
  (acc: ConcatenatedModifications) => ({
    ...acc,
    state: acc.skillRatingList.foldlWithKey(
      state => id => value => adjustHeroListStateItemWithDefault(
        e => Just(
          (e as any as Record<{ value: number; [key: string]: any }>)
            .modify(currentValue => currentValue + value, 'value')
        ) as any as Just<Data.Dependent>,
        id
      )(state),
      acc.state
    )
  }),

  // - Activatable additions
  (acc: ConcatenatedModifications) => ({
    ...acc,
    state: acc.activatable.foldl(
      state => req => Maybe.maybe(
        state,
        wikiEntry => {
          const entry = getHeroStateListItem(req.get('id'), state) as
            Maybe<Record<Data.ActivatableDependent>>;

          const activeObject = getActiveObjectCore(req as any);

          return updateListToContainNewEntry(
            state,
            wikiEntry,
            entry,
            activeObject
          );
        },
        getWikiEntry(action.payload.wiki, req.get('id')) as
          Maybe<Wiki.Activatable>
      ),
      acc.state
    )
  }),

  // - Scripts additions
  (acc: ConcatenatedModifications) => ({
    ...acc,
    state: adjustHeroListStateItemOr(
      createActivatableDependent,
      scripts => Just(
        scripts.modify(
          active => active.concat(
            acc.scripts.elems().map(
              script => Record.of<Data.ActiveObject>({ sid: script })
            )
          ),
          'active'
        )
      ),
      'SA_27'
    )(acc.state)
  }),

  // - Languages additions
  (acc: ConcatenatedModifications) => ({
    ...acc,
    state: adjustHeroListStateItemOr(
      createActivatableDependent,
      languages => Just(
        languages.modify(
          active => active.concat(
            acc.languages.assocs().map(
              language => Record.of<Data.ActiveObject>({
                sid: Tuple.fst(language),
                tier: Tuple.snd(language)
              })
            )
          ),
          'active'
        )
      ),
      'SA_29'
    )(acc.state)
  }),

  // - Profession prerequisites
  (acc: ConcatenatedModifications) => ({
    ...acc,
    state: acc.professionPrerequisites.foldl(
      state => req => {
        if (isProfessionRequiringIncreasable(req)) {
          return adjustHeroListStateItemWithDefault(
            e => Just(
              (e as any as Record<{ value: number; [key: string]: any }>)
                .insert('value', req.get('value'))
            ) as any as Just<Data.Dependent>,
            req.get('id')
          )(state);
        }
        else {
          return Maybe.maybe(
            state,
            wikiEntry => {
              const entry = getHeroStateListItem(req.get('id'), state) as
                Maybe<Record<Data.ActivatableDependent>>;

              const activeObject = getActiveObjectCore(req as any);

              const checkIfActive = R.equals(activeObject);

              if (Maybe.fromMaybe(
                false,
                entry.fmap(justEntry => justEntry.get('active').any(checkIfActive))
              )) {
                return state;
              }

              return updateListToContainNewEntry(
                state,
                wikiEntry,
                entry,
                activeObject
              );
            },
            getWikiEntry(action.payload.wiki, req.get('id')) as
              Maybe<Wiki.Activatable>
          );
        }
      },
      acc.state
    )
  }),

  // - Lower Combat Techniques with too high CTR
  acc => ({
    ...acc,
    state: acc.state.modify(
      combatTechniques => {
        const maybeMaxCombatTechniqueRating = action.payload.wiki.get('experienceLevels')
          .lookup(acc.state.get('experienceLevel'))
          .fmap(el => el.get('maxCombatTechniqueRating'));

        return Maybe.fromMaybe(
          combatTechniques,
          maybeMaxCombatTechniqueRating.fmap(
            maxCombatTechniqueRating => combatTechniques.map(
              combatTechnique => combatTechnique.modify(
                value => Math.min(value, maxCombatTechniqueRating),
                'value'
              )
            )
          )
        );
      },
      'combatTechniques'
    )
  }),

  /**
   * Deleted because of consistency, but may be reused when having a new way to
   * automatically handle pAE.
   *
   * if (isActive(acc.state.specialAbilities.get('SA_76'))) {
   *    permanentArcaneEnergyLoss += 2;
   * }
   */

  acc => acc.state
);

export function applyRCPSelectionsReducer(
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ASSIGN_RCP_OPTIONS: {
      const concatenatedModifications = concatModifications(state, action);

      return applyModifications(action)(concatenatedModifications);
    }

    default:
      return state;
  }
}

function updateListToContainNewEntry(
  state: Record<Data.HeroDependent>,
  wikiEntry: Wiki.Activatable,
  entry: Maybe<Record<Data.ActivatableDependent>>,
  activeObject: Record<Data.ActiveObject>,
): Record<Data.HeroDependent> {
  const intermediateState = addDependencies(
    adjustHeroListStateItemOr(
      createActivatableDependent,
      currentEntry => Just(currentEntry.modify(
        active => active.append(activeObject),
        'active'
      )),
      wikiEntry.get('id')
    )(state),
    getCombinedPrerequisites(
      wikiEntry,
      entry,
      activeObject,
      true
    ),
    wikiEntry.get('id')
  );

  if (wikiEntry.toObject().category === Categories.SPECIAL_ABILITIES) {
    return addAllStyleRelatedDependencies(
      intermediateState,
      wikiEntry as Record<Wiki.SpecialAbility>
    );
  }

  return intermediateState;
}
