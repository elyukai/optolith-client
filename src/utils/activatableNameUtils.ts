import R from 'ramda';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { Maybe } from './dataUtils';
import { sortStrings } from './FilterSortUtils';
import { translate } from './I18n';
import { match } from './match';
import { getRoman } from './NumberUtils';
import { findSelectOption, getSelectOptionName } from './selectionUtils';
import { getWikiEntry } from './WikiUtils';

/**
 * Returns the name of the given object. If the object is a string, it returns
 * the string.
 * @param obj
 */
export const getFullName = (obj: string | Data.ActiveViewObject): string => {
  if (typeof obj === 'string') {
    return obj;
  }
  const { tierName } = obj;
  let { name } = obj;

  if (tierName) {
    name += tierName;
  }

  return name;
}

/**
 * Accepts the full special ability namen and returns only the text between
 * parentheses. If no parentheses were found, returns an empty string.
 * @param name
 */
export const getTraditionNameFromFullName = (name: string): string => {
  const result = /\((.+)\)/.exec(name);

	if (result === null) {
		return '';
  }

	return result[1];
};

const getEntrySpecificNameAddition = (
  wikiEntry: Wiki.Activatable,
  instance: Data.ActiveObjectWithId,
  wiki: WikiState,
): Maybe<string> => {
  const { id, sid, sid2 } = instance;
  const { select, input } = wikiEntry;

  return match<string, Maybe<string>>(id)
    .on([
      'ADV_4',
      'ADV_47',
      'ADV_16',
      'ADV_17',
      'DISADV_48',
      'SA_231',
      'SA_250',
      'SA_472',
      'SA_473',
      'SA_531',
      'SA_533',
      'SA_569',
    ].includes, () =>
      getWikiEntry<Wiki.Skillish>(wiki, sid as string)
        .map(entry => entry.name)
    )
    .on('ADV_68', () =>
      findSelectOption(wikiEntry, sid)
        .map(item => item && `${sid2} (${item.name})`)
    )
    .on('DISADV_33', () =>
      getSelectOptionName(wikiEntry, sid)
        .map(name => {
          if (isNumber(sid) && [7, 8].includes(sid)) {
            return `${name}: ${sid2}`;
          }
          else {
            return name;
          }
        })
    )
    .on('SA_9', () =>
      Maybe.of(wiki.skills.get(sid as string))
        .map(skill => {
          return R.pipe(
            (sid2: string | number | undefined) => {
              return R.unless<string | number | undefined, string>(
                isString,
                R.always(
                  Maybe.of(skill.applications)
                    .map(R.find(e => e.id === sid2))
                    .map(app => app.name)
                    .valueOr('')
                )
              );
            },
            name => `${skill.name}: ${name}`
          )(sid2);
        })
    )
    .on([
      'SA_414',
      'SA_663',
    ].includes, () =>
      findSelectOption(wikiEntry, sid)
        .bind(item =>
          Maybe.of(item.target)
            .map(target => {
              if (id === 'SA_414') {
                return wiki.spells.get(target);
              }
              else {
                return wiki.liturgicalChants.get(target);
              }
            })
            .map(target => `${target.name}: ${item.name}`)
        )
    )
    .on('SA_680', () =>
      Maybe.of(wiki.skills.get(sid as string))
        .map(entry => `: ${entry.name}`)
    )
    .on('SA_699', () =>
      Maybe.of(wiki.specialAbilities.get('SA_29'))
        .bind(languages =>
          findSelectOption(languages, sid)
            .map(item => {
              return `${item.name}: ${
                R.unless<string | number | undefined, string>(
                  isString,
                  sid2 => Maybe.of(item.spec)
                    .bind(spec =>
                      Maybe.of(sid2 as number | undefined)
                        .map(sid2 => spec[sid2 - 1])
                    )
                    .valueOr(''),
                )(sid2)
              }`;
            })
        )
    )
    .otherwise(() => {
      if (typeof input === 'string' && typeof sid === 'string') {
        return Maybe.of(sid);
      }
      else if (Array.isArray(select)) {
        return getSelectOptionName(wikiEntry, sid);
      }
      return Maybe.Nothing();
    });
};

const getEntrySpecificNameReplacements = (
  wikiEntry: Wiki.Activatable,
  instance: Data.ActiveObjectWithId,
  nameAddition: Maybe<string>,
  locale?: Data.UIMessages,
): string => {
  const { id, sid2, tier } = instance;
  const { name } = wikiEntry;

  return R.defaultTo(name, match<string, string | undefined>(id)
    .on(['ADV_28', 'ADV_29'].includes, () => {
      return `${
        translate(locale, 'activatable.view.immunityto')
      } ${nameAddition}`;
    })
    .on('ADV_68', () => {
      return `${
        translate(locale, 'activatable.view.hatredof')
      } ${nameAddition}`;
    })
    .on('DISADV_1', () => {
      return `${
        translate(locale, 'activatable.view.afraidof')
      } ${nameAddition}`;
    })
    .on(['DISADV_34', 'DISADV_50'].includes, () => {
      return `${name} ${getRoman(tier as number)} (${nameAddition})`;
    })
    .on('SA_639', () => {
      return `${name} ${nameAddition}`;
    })
    .on(['SA_677', 'SA_678'].includes, () =>
      Maybe.of(locale)
        .map(locale => {
          const part = getTraditionNameFromFullName(name);
          const musicTraditionLabels = translate(locale, 'musictraditions');

          if (typeof sid2 === 'number') {
            const musicTradition = musicTraditionLabels[sid2 - 1];
            return name.replace(part, `${part}: ${musicTradition}`);
          }

          return;
        })
        .valueOr('')
    )
    .otherwise(() => R.when(
      R.complement(R.isNil),
      () => `${name} (${nameAddition})`,
      nameAddition
    ))
  );
}

export interface CombinedName {
  combinedName: string;
  baseName: string;
  addName?: string;
}

/**
 * Returns name, splitted and combined, of advantage/disadvantage/special
 * ability as a Maybe (in case the wiki entry does not exist).
 * @param instance The ActiveObject with origin id.
 * @param wiki The current hero's state.
 * @param locale The locale-dependent messages.
 */
export const getName = (
  instance: Data.ActiveObjectWithId,
  wiki: WikiState,
  locale?: Data.UIMessages,
): Maybe<CombinedName> => {
  return getWikiEntry<Wiki.Activatable>(wiki, instance.id)
    .map(wikiEntry => {
      const addName = getEntrySpecificNameAddition(
        wikiEntry,
        instance,
        wiki,
      );

      const combinedName = getEntrySpecificNameReplacements(
        wikiEntry,
        instance,
        addName,
        locale,
      );

      return Maybe.maybe({
        combinedName,
        baseName: wikiEntry.name
      }, addName => ({
        combinedName,
        baseName: wikiEntry.name,
        addName
      }), addName);
    });
};

interface EnhancedReduce {
	final: string[];
	previousLowerTier: boolean;
}

export const compressList = (
  list: (Data.ActiveViewObject | string)[],
  locale: Data.UIMessages,
): string => {
	const listToString = sortStrings(list.reduce<string[]>((acc, obj) => {
    if (isString(obj)) {
      return R.append(obj, acc);
    }
    else if (!['SA_27', 'SA_29'].includes(obj.id)) {
      return R.append(obj.name, acc);
    }
    return acc;
  }, []), locale.id);

  const levelAfterParenthesis = /\(.+\)(?: [IVX]+)?$/;
  const insertLevelBeforeParenthesis = /\)((?: [IVX]+)?)$/;

	const finalList = listToString.reduce<EnhancedReduce>((previous, current) => {
		const prevElement = R.last(previous.final);
		if (
      isString(prevElement)
      && prevElement.split(' (')[0] === current.split(' (')[0]
      && levelAfterParenthesis.test(prevElement)
    ) {
			const prevElementSplitted = prevElement.split(/\)/);
			const optionalTier = prevElementSplitted.pop() || '';
			const beginning = `${prevElementSplitted.join(')')}${optionalTier}`;
			const currentSplitted = current.split(/\(/);
      const continuing = currentSplitted.slice(1).join('(')
        .replace(insertLevelBeforeParenthesis, '$1)');

			const other = previous.final.slice(0, -1);

			return {
				...previous,
				final: [ ...other, `${beginning}, ${continuing}` ]
			};
		}
		return {
			final: [ ...previous.final, current ],
			previousLowerTier: false
		};
	}, {
		final: [],
		previousLowerTier: false
	}).final.join(', ');

	return finalList;
};
