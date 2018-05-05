import { createSelector } from 'reselect';
import { Categories } from '../constants/Categories';
import { ActivatableDependent, CantripInstance, SpellInstance, ToListById } from '../types/data.d';
import { Spell, SpellWithRequirements } from '../types/view.d';
import { isActive } from '../utils/ActivatableUtils';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
import { validate } from '../utils/RequirementUtils';
import { filterByAvailability } from '../utils/RulesUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { isDecreasable, isIncreasable, isMagicalTraditionId, isOwnTradition } from '../utils/SpellUtils';
import { getPresent } from './currentHeroSelectors';
import { getStartEl } from './elSelectors';
import { getValidPact } from './pactSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getSpellsSortOptions } from './sortOptionsSelectors';
import { getAdvantages, getAttributes, getCantrips, getDisadvantages, getInactiveSpellsFilterText, getLocaleMessages, getPhase, getSpecialAbilities, getSpells, getSpellsFilterText, getWiki } from './stateSelectors';
import { getEnableActiveItemHints } from './uisettingsSelectors';

export const getMagicalTraditionsResultFunc = (list: Map<string, ActivatableDependent>) => {
  return [...list.values()].filter(e => isMagicalTraditionId(e.id) && isActive(e));
};

export const getMagicalTraditions = createSelector(
  getSpecialAbilities,
  getMagicalTraditionsResultFunc
);

export const isSpellsTabAvailable = createSelector(
  getMagicalTraditions,
  traditions => traditions.length > 0
);

export const areMaxUnfamiliar = createSelector(
  getPhase,
  getStartEl,
  getSpells,
  getMagicalTraditions,
  (phase, experienceLevel, spells, tradition) => {
    if (phase > 2) {
      return false;
    }
    if (!tradition) {
      return true;
    }
    const max = experienceLevel.maxUnfamiliarSpells;
    const unfamiliarSpells = [...spells.values()].reduce((n, e) => {
      const unknownTradition = !isOwnTradition(tradition, e);
      return unknownTradition && e.gr < 3 && e.active ? n + 1 : n;
    }, 0);
    return unfamiliarSpells >= max;
  }
);

export const getActiveSpellsNumber = createSelector(
  getSpells,
  spells => {
    return [...spells.values()].reduce((n, entry) => {
      if (entry.active === true && [1, 2].includes(entry.gr)) {
        return n + 1;
      }
      return n;
    }, 0);
  }
);

export const isMaximumOfSpellsReached = createSelector(
  getPhase,
  getStartEl,
  getSpells,
  (phase, experienceLevel, spells) => {
    if (phase > 2) {
      return false;
    }
    const max = experienceLevel.maxSpellsLiturgies;
    const familiarSpells = [...spells.values()].reduce((n, e) => {
      return e.gr < 3 && e.active ? n + 1 : n;
    }, 0);
    return familiarSpells >= max;
  }
);

export const getSpellsAndCantrips = createSelector(
  getSpells,
  getCantrips,
  (spells, cantrips) => {
    return [...spells.values(), ...cantrips.values()];
  }
);

export interface InactiveSpells {
  valid: (SpellInstance | CantripInstance)[];
  invalid: (SpellInstance | CantripInstance)[];
}

export const getInactiveSpells = createSelector(
  getSpellsAndCantrips,
  areMaxUnfamiliar,
  isMaximumOfSpellsReached,
  getPresent,
  getMagicalTraditions,
  getValidPact,
  (allEntries, areMaxUnfamiliar, isMaximumOfSpellsReached, currentHero, tradition, pact): InactiveSpells => {
    if (tradition.length === 0) {
      return {
        valid: [],
        invalid: []
      };
    }

    const allInactiveSpells = allEntries.filter(e => e.active === false);
    const lastTraditionId = tradition[0].id;

    if (lastTraditionId === 'SA_679') {
      return allInactiveSpells.reduce<InactiveSpells>((obj, entry) => {
        if (entry.category === Categories.CANTRIPS || entry.gr < 3 && !isMaximumOfSpellsReached && validate(currentHero, entry.reqs, entry.id, pact) && (isOwnTradition(tradition, entry) || !areMaxUnfamiliar)) {
          return {
            ...obj,
            valid: [...obj.valid, entry]
          };
        }
        else {
          return {
            ...obj,
            invalid: [...obj.invalid, entry]
          };
        }
      }, {
        valid: [],
        invalid: []
      });
    }
    else if (lastTraditionId === 'SA_677' || lastTraditionId === 'SA_678') {
      const lastTradition = tradition[0];
      const subtradition = lastTradition.active[0] && lastTradition.active[0].sid;
      if (typeof subtradition === 'number') {
        return allInactiveSpells.reduce<InactiveSpells>((obj, entry) => {
          if (entry.category === Categories.CANTRIPS || entry.subtradition.includes(subtradition)) {
            return {
              ...obj,
              valid: [...obj.valid, entry]
            };
          }
          else {
            return {
              ...obj,
              invalid: [...obj.invalid, entry]
            };
          }
        }, {
          valid: [],
          invalid: []
        });
      }
      return {
        valid: [],
        invalid: []
      };
    }
    return allInactiveSpells.reduce<InactiveSpells>((obj, entry) => {
      if (entry.category === Categories.CANTRIPS || (!isMaximumOfSpellsReached || entry.gr > 2) && validate(currentHero, entry.reqs, entry.id, pact) && (isOwnTradition(tradition, entry) || (entry.gr < 3 && !areMaxUnfamiliar))) {
        return {
          ...obj,
          valid: [...obj.valid, entry]
        };
      }
      else {
        return {
          ...obj,
          invalid: [...obj.invalid, entry]
        };
      }
    }, {
      valid: [],
      invalid: []
    });
  }
);

export const getActiveSpells = createSelector(
  getSpellsAndCantrips,
  getStartEl,
  getPhase,
  getAttributes,
  mapGetToSlice(getAdvantages, 'ADV_16'),
  mapGetToSlice(getSpecialAbilities, 'SA_72'),
  getWiki,
  getSpells,
  (allEntries, el, phase, attributes, exceptionalSkill, propertyKnowledge, wiki, spells) => {
    const list: (SpellWithRequirements | CantripInstance)[] = [];
    for (const entry of allEntries) {
      if (entry.active === true) {
        if (entry.category === Categories.CANTRIPS) {
          list.push(entry)
        }
        else {
          list.push({
            ...entry,
            isIncreasable: isIncreasable(entry, el, phase, attributes, exceptionalSkill!, propertyKnowledge!),
            isDecreasable: isDecreasable(wiki, entry, spells, propertyKnowledge!),
          });
        }
      }
    }
    return list;
  }
);

export const getAvailableInactiveSpells = createSelector(
  getInactiveSpells,
  getRuleBooksEnabled,
  (list, availablility) => {
    return filterByAvailability(list.valid, availablility);
  }
);

export const getFilteredActiveSpellsAndCantrips = createSelector(
  getActiveSpells,
  getSpellsSortOptions,
  getSpellsFilterText,
  getLocaleMessages,
  (spells, sortOptions, filterText, locale) => {
    return filterAndSortObjects(spells, locale!.id, filterText, sortOptions);
  }
);

export const getFilteredInactiveSpellsAndCantrips = createSelector(
  getAvailableInactiveSpells,
  getActiveSpells,
  getSpellsSortOptions,
  getInactiveSpellsFilterText,
  getLocaleMessages,
  getEnableActiveItemHints,
  (inactive, active, sortOptions, filterText, locale, areActiveItemHintsEnabled) => {
    if (areActiveItemHintsEnabled) {
      return filterAndSortObjects([...inactive, ...active], locale!.id, filterText, sortOptions);
    }
    return filterAndSortObjects(inactive, locale!.id, filterText, sortOptions);
  }
);

export const getSpellsAndCantripsForSave = createSelector(
  getActiveSpells,
  list => {
    const spells: ToListById<number> = {};
    const cantrips: string[] = [];
    for (const entry of list) {
      if (entry.category === Categories.SPELLS) {
        const { id, value } = entry;
        spells[id] = value;
      }
      else {
        cantrips.push(entry.id);
      }
    }
    return {
      spells,
      cantrips
    };
  }
);

export const isActivationDisabled = createSelector(
  getStartEl,
  getPhase,
  getActiveSpellsNumber,
  getMagicalTraditions,
  mapGetToSlice(getAdvantages, 'ADV_58'),
  mapGetToSlice(getDisadvantages, 'DISADV_59'),
  (startEl, phase, activeSpells, tradition, bonusEntry, penaltyEntry) => {
    if (tradition.length === 0) {
      return true;
    }
    const lastTraditionId = tradition[0].id;
    if (lastTraditionId === 'SA_679') {
      let maxSpells = 3;
      if (bonusEntry && isActive(bonusEntry)) {
        const tier = bonusEntry.active[0].tier;
        if (tier) {
          maxSpells += tier;
        }
      }
      else if (penaltyEntry && isActive(penaltyEntry)) {
        const tier = penaltyEntry.active[0].tier;
        if (tier) {
          maxSpells -= tier;
        }
      }
      if (activeSpells >= maxSpells) {
        return true;
      }
    }
    const maxSpellsLiturgies = startEl.maxSpellsLiturgies;
    return phase < 3 && activeSpells >= maxSpellsLiturgies;
  }
);

export const getCantripsForSheet = createSelector(
  getCantrips,
  cantrips => [...cantrips.values()].filter(e => e.active)
);

export const getSpellsForSheet = createSelector(
  getSpells,
  getMagicalTraditions,
  (spells, traditionSA) => {
    const array: Spell[] = [];
    for (const [id, entry] of spells) {
      const { ic, name, active, value, check, checkmod, property, tradition, effect, castingTime, castingTimeShort, cost, costShort, range, rangeShort, duration, durationShort, target, src, category } = entry;
      if (active) {
        let traditions;
        if (traditionSA.length === 0 || !isOwnTradition(traditionSA, entry)) {
          traditions = tradition;
        }
        array.push({
          id,
          name,
          value,
          ic,
          check,
          checkmod,
          property,
          traditions,
          effect,
          castingTime,
          castingTimeShort,
          cost,
          costShort,
          range,
          rangeShort,
          duration,
          durationShort,
          target,
          src,
          category
        });
      }
    }
    return array;
  }
);
