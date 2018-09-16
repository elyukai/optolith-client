import * as R from 'ramda';
import * as Data from '../types/data';
import * as View from '../types/view';
import * as Wiki from '../types/wiki';
import { getSkillCheckValues } from './AttributeUtils';
import { Just, List, Maybe, OrderedMap, Record } from './dataUtils';
import { flattenDependencies } from './flattenDependencies';
import { getNumericMagicalTraditionIdByInstanceId } from './IDUtils';
import { getActiveSelections } from './selectionUtils';
import { getExceptionalSkillBonus } from './skillUtils';

export const isOwnTradition = (
  tradition: List<Record<Wiki.SpecialAbility>>,
  obj: Record<Wiki.Spell> | Record<Wiki.Spell>,
): boolean =>
  obj.get ('tradition').any (
    e => e === 1 || Maybe.isJust (tradition.find (
      t => getNumericMagicalTraditionIdByInstanceId (t.get ('id'))
        .fmap (R.inc)
        .equals (Just (e))
    ))
  );

export const isIncreasable = (
  entry: Record<View.SpellCombined>,
  startEL: Record<Wiki.ExperienceLevel>,
  phase: number,
  attributes: OrderedMap<string, Record<Data.AttributeDependent>>,
  exceptionalSkill: Maybe<Record<Data.ActivatableDependent>>,
  propertyKnowledge: Maybe<Record<Data.ActivatableDependent>>
): boolean => {
  const bonus = getExceptionalSkillBonus (entry.lookup ('id')) (exceptionalSkill);

  const hasPropertyKnowledgeRestriction = getActiveSelections (propertyKnowledge)
    .fmap (properties => properties.notElem (entry.get ('property')));

  const maxList = List.of (
    getSkillCheckValues (attributes) (entry.get ('check')).maximum () + 2
  );

  const getAdditionalMax = R.pipe (
    (list: typeof maxList) => phase < 3
      ? list.append (startEL.get ('maxSkillRating'))
      : list,
    (list: typeof maxList) => Maybe.elem (true) (hasPropertyKnowledgeRestriction)
      ? list.append (14)
      : list
  );

  const max = getAdditionalMax (maxList).minimum ();

  return entry.get ('value') < max + bonus;
};

export const getPropertyCounter = (
  wiki: OrderedMap<string, Record<Wiki.Spell>>,
  state: OrderedMap<string, Record<Data.ActivatableSkillDependent>>
) => {
  return state
    .filter (e => e.get ('value') >= 10)
    .foldl<OrderedMap<number, number>> (
      acc => instance => Maybe.maybe<Record<Wiki.Spell>, OrderedMap<number, number>> (acc) (
        wikiEntry => acc.alter (
          existing => Just (Maybe.fromMaybe (0) (existing) + 1)
        ) (wikiEntry.get ('property'))
      ) (wiki.lookup (instance.get ('id')))
    ) (OrderedMap.empty<number, number> (),);
};

export const isDecreasable = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  entry: Record<View.SpellCombined>,
  propertyKnowledge: Maybe<Record<Data.ActivatableDependent>>,
): boolean => {
  const dependencies = flattenDependencies<number | boolean> (
    wiki,
    state,
    entry.get ('dependencies'),
  );

  // Basic validation
  const valid = entry.get ('value') < 1
    ? dependencies.notElem (true)
    : entry.get ('value') > Math.max (0, ...dependencies.filter (isNumber));

  return Maybe.fromMaybe (valid) (
    getActiveSelections (propertyKnowledge)
      // Check if spell is part of dependencies of active Property Knowledge
      .bind (Maybe.ensure (
        activeProperties => activeProperties.any (
          e => isNumber (e) && entry.get ('property') === e
        )
      ))
      .fmap (
        () => {
          const counter = getPropertyCounter (wiki.get ('spells'), state.get ('spells'));

          const countedLowestWithProperty = Maybe.fromMaybe (0) (
            counter.lookup (entry.get ('property'))
          );

          return (entry.get ('value') !== 10 || countedLowestWithProperty > 3) && valid;
        }
      )
  );
};
