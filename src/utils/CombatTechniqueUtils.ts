import R from 'ramda';
import * as Data from '../types/data';
import { CombatTechnique, WikiAll } from '../types/wiki';
import { List, Maybe, Record } from './dataUtils';
import { flattenDependencies } from './flattenDependencies';
import { getActiveSelections } from './selectionUtils';

const getMaxPrimaryAttributeValueById = (
  (state: Record<Data.HeroDependent>) =>
  (primaryAttributeIds: List<string>) =>
    primaryAttributeIds.foldl<number> (
      max => id => {
        const attribute = state.get ('attributes').lookup (id);

        return Maybe.isJust (attribute)
          ? Math.max (max, Maybe.fromJust (attribute).get ('value'))
          : max;
      }
    ) (0)
);

const calculatePrimaryAttributeMod = R.pipe (
  R.add (-8),
  R.flip (R.divide) (3),
  Math.floor,
  R.max<number> (0),
);

export const getPrimaryAttributeMod = (state: Data.Hero) => R.pipe (
  getMaxPrimaryAttributeValueById (state),
  calculatePrimaryAttributeMod,
);

const getCombatTechniqueRating = (maybeStateEntry: Maybe<Record<Data.SkillDependent>>) =>
  Maybe.fromMaybe (6) (maybeStateEntry.fmap (stateEntry => stateEntry.get ('value')));

export const getAttack = (state: Record<Data.HeroDependent>) =>
  (wikiEntry: Record<CombatTechnique>) =>
    (maybeStateEntry: Maybe<Record<Data.SkillDependent>>): number => {
      const array = wikiEntry.get ('gr') === 2
        ? wikiEntry.get ('primary')
        : List.of ('ATTR_1');

      const mod = getPrimaryAttributeMod (state) (array);

      return getCombatTechniqueRating (maybeStateEntry) + mod;
    };

export const getParry = (state: Record<Data.HeroDependent>) =>
  (wikiEntry: Record<CombatTechnique>) =>
    (maybeStateEntry: Maybe<Record<Data.SkillDependent>>): Maybe<number> => {
      if (
        wikiEntry.get ('gr') === 2
        || wikiEntry.get ('id') === 'CT_6'
        || wikiEntry.get ('id') === 'CT_8'
      ) {
        return Maybe.empty ();
      }

      const mod = getPrimaryAttributeMod (state) (wikiEntry.get ('primary'));

      return Maybe.pure (Math.round (getCombatTechniqueRating (maybeStateEntry) / 2) + mod);
    };

export const isIncreaseDisabled = (
  wiki: Record<WikiAll>,
  state: Record<Data.HeroDependent>,
  wikiEntry: Record<CombatTechnique>,
  instance: Record<Data.SkillDependent>,
): boolean => {
  const max = state.get ('phase') < 3
    ? Maybe.fromMaybe (0) (
        wiki.get ('experienceLevels').lookup (state.get ('experienceLevel'))
          .fmap (startEl => startEl.get ('maxCombatTechniqueRating'))
      )
    : getMaxPrimaryAttributeValueById (state) (wikiEntry.get ('primary')) + 2;

  const exceptionalSkill = state.get ('advantages').lookup ('ADV_17');
  const bonus = getActiveSelections (exceptionalSkill)
    .fmap (selections => selections.elem (instance.get ('id')))
    .equals (Maybe.pure (true))
      ? 1
      : 0;

  return instance.get ('value') >= max + bonus;
};

export const isDecreaseDisabled = (
  wiki: Record<WikiAll>,
  state: Record<Data.HeroDependent>,
  wikiEntry: Record<CombatTechnique>,
  instance: Record<Data.SkillDependent>,
  onlyOneCombatTechniqueForHunter: boolean
): boolean => {
  // const hunterActive = isActive(state.get('specialAbilities').lookup('SA_18'));

  // const onlyOneCombatTechniqueForHunter = hunterActive && R.equals(
  //   R.length(
  //     R.filter(
  //       e => e.value >= 10,
  //       getAllEntriesByGroup(
  //         wiki.combatTechniques,
  //         state.combatTechniques,
  //         2,
  //       )
  //     )
  //   ),
  //   1,
  // );

  const disabledByHunter = onlyOneCombatTechniqueForHunter
    && wikiEntry.get ('gr') === 2
    && instance.get ('value') === 10;

  const dependencies = flattenDependencies (
    wiki,
    state,
    instance.get ('dependencies'),
  );

  return disabledByHunter || instance.get ('value') <= Math.max (6, ...dependencies);
};
