import * as R from 'ramda';
import { EntryRating, Hero } from '../types/data';
import { ExperienceLevel } from '../types/wiki';
import { createDependentSkillWithValue0 } from '../utils/createEntryUtils';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { List, Maybe, OrderedMap, Record } from '../utils/dataUtils';
import { AllSortOptions, filterAndSortObjects } from '../utils/FilterSortUtils';
import { isDecreasable, isIncreasable } from '../utils/skillUtils';
import { SkillCombined, SkillWithRequirements } from '../utils/viewData/viewTypeHelpers';
import { getStartEl } from './elSelectors';
import { getCurrentCulture } from './rcpSelectors';
import { getSkillsSortOptions } from './sortOptionsSelectors';
import { getCurrentHeroPresent, getLocaleAsProp, getSkills, getSkillsFilterText, getWiki, getWikiSkills } from './stateSelectors';

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
                (createDependentSkillWithValue0 (wikiSkill .get ('id')))
                (skills .lookup (wikiSkill .get ('id')))
            )
          )
          .elems ()
      )
    )
);

export const getSkillsWithRequirements = createMaybeSelector (
  getAllSkills,
  getWiki,
  getCurrentHeroPresent,
  getStartEl,
  (skills, wiki, maybeHero, maybeStartEl) =>
    Maybe.liftM2<Hero, Record<ExperienceLevel>, List<Record<SkillWithRequirements>>>
      (hero => startEl => skills .map<Record<SkillWithRequirements>> (
        skill => skill .merge (
          Record.of ({
            isIncreasable: isIncreasable (
              skill,
              startEl,
              hero .get ('phase'),
              hero .get ('attributes'),
              hero .get ('advantages') .lookup ('ADV_16')
            ),
            isDecreasable: isDecreasable (wiki, hero, skill),
          })
        )
      ))
      (maybeHero)
      (maybeStartEl)
);

export const getFilteredSkills = createMaybeSelector (
  getSkillsWithRequirements,
  getSkillsSortOptions,
  getSkillsFilterText,
  getLocaleAsProp,
  (maybeSkills, sortOptions, filterText, locale) => maybeSkills .fmap (
    skills => filterAndSortObjects (
      skills,
      locale.get ('id'),
      filterText,
      sortOptions as AllSortOptions<SkillWithRequirements>
    )
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
