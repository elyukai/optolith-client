import { ActivatableDependent, Hero, HeroDependent } from '../types/data';
import { CombatTechniqueCombined, CombatTechniqueWithAttackParryBase, CombatTechniqueWithRequirements } from '../types/view';
import { ExperienceLevel, WikiRecord } from '../types/wiki';
import { createDependentSkillWithValue6 } from '../utils/createEntryUtils';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Just, List, Maybe, Nothing, Record } from '../utils/dataUtils';
import { AllSortOptions, filterAndSortObjects } from '../utils/FilterSortUtils';
import { flattenDependencies } from '../utils/flattenDependencies';
import { isActive } from '../utils/isActive';
import { filterByAvailability } from '../utils/RulesUtils';
import { getActiveSelections } from '../utils/selectionUtils';
import { getMaxAttributeValueByID } from './attributeSelectors';
import { getStartEl } from './elSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getCombatTechniquesSortOptions } from './sortOptionsSelectors';
import { getAttributes, getCombatTechniques, getCombatTechniquesFilterText, getCurrentHeroPresent, getLocaleAsProp, getWiki, getWikiCombatTechniques } from './stateSelectors';

const getPrimaryAttributeMod = (
  attributes: HeroDependent['attributes'],
  ids: List<string>
) => Math.max (Math.floor ((getMaxAttributeValueByID (attributes) (ids) - 8) / 3), 0);

const getAttackBase = (
  attributes: HeroDependent['attributes'],
  obj: Record<CombatTechniqueCombined>
): number => {
  const modAttributeList = obj.get ('gr') === 2 ? obj.get ('primary') : List.of ('ATTR_1');
  const mod = getPrimaryAttributeMod (attributes, modAttributeList);

  return obj.get ('value') + mod;
};

const getParryBase = (
  attributes: HeroDependent['attributes'],
  obj: Record<CombatTechniqueCombined>
): Maybe<number> => {
  const mod = getPrimaryAttributeMod (attributes, obj.get ('primary'));

  return obj.get ('gr') === 2 || obj.get ('id') === 'CT_6' || obj.get ('id') === 'CT_8'
    ? Nothing ()
    : Just (Math.round (obj.get ('value') / 2) + mod);
};

type CombatTechniquesForSheet = List<Record<CombatTechniqueWithAttackParryBase>>;

export const getCombatTechniquesForSheet = createMaybeSelector (
  getCombatTechniques,
  getAttributes,
  getWikiCombatTechniques,
  (maybeCombatTechniques, maybeAttributes, wikiCombatTechniques) =>
    maybeAttributes.bind (
      attributes => maybeCombatTechniques.fmap (
        combatTechniques => wikiCombatTechniques.foldlWithKey<CombatTechniquesForSheet> (
          list => id => wikiEntry => {
            const entry =
              combatTechniques .findWithDefault
                (createDependentSkillWithValue6 (id))
                (id);

            const combined = wikiEntry.merge (entry);

            const at = getAttackBase (attributes, combined);
            const pa = getParryBase (attributes, combined);

            return list.append (
              combined.mergeMaybe (Record.of ({ at, pa })) as
                Record<CombatTechniqueWithAttackParryBase>
            );
          }
        ) (List.of ())
      )
    )
);

const getMaximum = (
  exceptionalCombatTechnique: Maybe<Record<ActivatableDependent>>,
  startEl: Maybe<Record<ExperienceLevel>>,
  attributes: HeroDependent['attributes'],
  phase: number,
  obj: Record<CombatTechniqueWithAttackParryBase>
): number => {
  const isBonusValid = Maybe.fromMaybe (false) (
    getActiveSelections (exceptionalCombatTechnique)
      .fmap (active => active.elem (obj.get ('id')))
  );

  const bonus = isBonusValid ? 1 : 0;

  if (phase < 3 && Maybe.isJust (startEl)) {
    return Maybe.fromJust (startEl).get ('maxCombatTechniqueRating') + bonus;
  }

  return getMaxAttributeValueByID (attributes) (obj.get ('primary')) + 2 + bonus;
};

const getMinimum = (
  hunterRequiresMinimum: boolean,
  wiki: WikiRecord,
  state: Hero,
  obj: Record<CombatTechniqueWithAttackParryBase>
): number => {
  const maxList = flattenDependencies (
    wiki,
    state,
    obj.get ('dependencies')
  )
    .cons (6);

  if (hunterRequiresMinimum && obj.get ('gr') === 2) {
    return maxList .cons (10) .maximum ();
  }

  return maxList .maximum ();
};

export const getAllCombatTechniques = createMaybeSelector (
  getCombatTechniquesForSheet,
  getCurrentHeroPresent,
  getStartEl,
  getWiki,
  (
    maybeCombatTechniques,
    maybeHero,
    maybeStartEl,
    wiki
  ) =>
    maybeCombatTechniques.bind (
      combatTechniques => maybeHero.fmap (
        hero => {
          const exceptionalCombatTechnique = hero.get ('advantages').lookup ('ADV_17');

          const hunter = hero.get ('specialAbilities').lookup ('SA_18');
          const hunterRequiresMinimum =
            isActive (hunter)
            && Maybe.isJust (
              combatTechniques.find (e => e.get ('gr') === 2 && e.get ('value') >= 10)
            );

          return combatTechniques.map (
            entry => entry.mergeMaybe (Record.of ({
              min: getMinimum (
                hunterRequiresMinimum,
                wiki,
                hero,
                entry
              ),
              max: getMaximum (
                exceptionalCombatTechnique,
                maybeStartEl,
                hero.get ('attributes'),
                hero.get ('phase'),
                entry
              ),
            })) as Record<CombatTechniqueWithRequirements>
          );
        }
      )
    )
);

export const getAvailableCombatTechniques = createMaybeSelector (
  getAllCombatTechniques,
  getRuleBooksEnabled,
  (maybeList, maybeAvailablility) =>
    maybeList.bind (
      list => maybeAvailablility.fmap (
        availablility => filterByAvailability<CombatTechniqueWithRequirements> (
          list,
          availablility,
          obj => obj.get ('value') > 6
        )
      )
    )
);

export const getFilteredCombatTechniques = createMaybeSelector (
  getAvailableCombatTechniques,
  getCombatTechniquesSortOptions,
  getCombatTechniquesFilterText,
  getLocaleAsProp,
  (maybeCombatTechniques, sortOptions, filterText, locale) =>
    maybeCombatTechniques.fmap (
      combatTechniques => filterAndSortObjects<CombatTechniqueWithRequirements> (
        combatTechniques,
        locale.get ('id'),
        filterText,
        sortOptions as AllSortOptions<CombatTechniqueWithRequirements>
      )
    )
);
