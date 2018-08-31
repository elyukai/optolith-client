import R from 'ramda';
import { SkillDependent } from '../types/data';
import { SkillCombined } from '../types/view';
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
        skills => Maybe.mapMaybe<Record<SkillDependent>, Record<SkillCombined>> (
          skill => wikiSkills.lookup (skill.get ('id'))
            .fmap (wikiSkill => wikiSkill.merge (skill))
        ) (skills.elems ())
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

export const getSkillsRating = createMaybeSelector (
  getCurrentCulture,
  maybeCulture =>
    Maybe.fromMaybe<OrderedMap<string, string>> (OrderedMap.empty ()) (
      maybeCulture.fmap (
        culture => R.pipe (
          culture.get ('commonSkills').foldl<OrderedMap<string, string>> (
            acc => id => acc.insert (id) ('TYP')
          ),
          culture.get ('uncommonSkills').foldl (
            acc => id => acc.insert (id) ('UNTYP')
          )
        ) (OrderedMap.empty ())
      )
    )
);
