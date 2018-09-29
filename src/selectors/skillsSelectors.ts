import * as R from 'ramda';
import { EntryRating } from '../types/data';
import { SkillCombined } from '../types/view';
import { createDependentSkill } from '../utils/createEntryUtils';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { List, Maybe, OrderedMap, Record } from '../utils/dataUtils';
import { AllSortOptions, filterAndSortObjects } from '../utils/FilterSortUtils';
import { getCurrentCulture } from './rcpSelectors';
import { getSkillsSortOptions } from './sortOptionsSelectors';
import { getLocaleAsProp, getSkills, getSkillsFilterText, getWikiSkills } from './stateSelectors';

export const getAllSkills = createMaybeSelector (
  getSkills,
  getWikiSkills,
  (maybeSkills, wikiSkills) =>
    Maybe.fromMaybe<List<Record<SkillCombined>>> (List.of ()) (
      maybeSkills.fmap (
        skills => wikiSkills
          .map (
            wikiSkill => wikiSkill .merge (
              Maybe.fromMaybe
                (createDependentSkill (wikiSkill .get ('id')))
                (skills .lookup (wikiSkill .get ('id')))
            )
          )
          .elems ()
      )
    )
);

export const getFilteredSkills = createMaybeSelector (
  getAllSkills,
  getSkillsSortOptions,
  getSkillsFilterText,
  getLocaleAsProp,
  (skills, sortOptions, filterText, locale) =>
    filterAndSortObjects (
      skills,
      locale.get ('id'),
      filterText,
      sortOptions as AllSortOptions<SkillCombined>
    )
);

export const getSkillRating = createMaybeSelector (
  getCurrentCulture,
  maybeCulture =>
    Maybe.fromMaybe<OrderedMap<string, EntryRating>> (OrderedMap.empty ()) (
      maybeCulture.fmap (
        culture => R.pipe (
          culture.get ('commonSkills').foldl<OrderedMap<string, EntryRating>> (
            acc => id => acc.insert (id) (EntryRating.Common)
          ),
          culture.get ('uncommonSkills').foldl (
            acc => id => acc.insert (id) (EntryRating.Uncommon)
          )
        ) (OrderedMap.empty ())
      )
    )
);
