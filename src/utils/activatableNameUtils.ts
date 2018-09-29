/**
 * Generates the complete name of an active `Activatable`. Also provides helper
 * functions for compressing `Activatable` name lists and combining or
 * extracting parts of the name.
 *
 * @file src/utils/activatableNameUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { isNumber, isString } from 'util';
import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { List, Maybe, OrderedMap, Record } from './dataUtils';
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
export const getFullName =
  (obj: string | Record<Data.ActiveViewObject>): string => {
    if (typeof obj === 'string') {
      return obj;
    }

    const name = obj.get ('name');

    return Maybe.maybe (name) (tierName => name + tierName) (obj.lookup ('tierName'));
  }

/**
 * Accepts the full special ability name and returns only the text between
 * parentheses. If no parentheses have been found, returns an empty string.
 * @param name
 */
export const getBracketedNameFromFullName = (name: string): string => {
  const result = /\((.+)\)/.exec (name);

  if (result === null) {
    return '';
  }

  return result[1];
};

const getEntrySpecificNameAddition = (
  wikiEntry: Wiki.Activatable,
  instance: Record<Data.ActiveObjectWithId>,
  wiki: Record<Wiki.WikiAll>
): Maybe<string> => {
  return match<string, Maybe<string>> (instance.get ('id'))
    .on (
      List.elem_ (List.of (
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
        'SA_569'
      )),
      () =>
        (instance.lookup ('sid') as Maybe<string>)
          .bind (getWikiEntry<Wiki.Skillish> (wiki))
          .fmap (entry => entry.get ('name'))
    )
    .on ('ADV_68', () =>
      findSelectOption (wikiEntry, instance.lookup ('sid'))
        .bind (item =>
          instance.lookup ('sid2')
            .fmap (sid2 => `${sid2} (${item.get ('name')})`)
        )
    )
    .on ('DISADV_33', () =>
      getSelectOptionName (wikiEntry, instance.lookup ('sid'))
        .fmap (name => {
          return Maybe.fromMaybe (name) (
            instance.lookup ('sid')
              .bind (Maybe.ensure (x => isNumber (x) && List.of (7, 8).elem (x)))
              .bind (() => instance.lookup ('sid2'))
              .fmap (sid2 => `${name}: ${sid2}`)
          );
        })
    )
    .on ('SA_9', () =>
      (instance.lookup ('sid') as Maybe<string>)
        .bind (id => OrderedMap.lookup<string, Record<Wiki.Skill>> (id) (wiki.get ('skills')))
        .fmap (skill => {
          return Maybe.maybe (skill.get ('name')) (name => `${skill.get ('name')}: ${name}`) (
            instance.lookup ('sid2').bind (sid2 =>
              Maybe.ensure (isString) (sid2)
                .alt (
                  skill.lookup ('applications')
                    .bind (apps => apps.find (e => e.get ('id') === sid2))
                    .fmap (app => app.get ('name'))
                )
            )
          );
        })
    )
    .on (
      List.elem_ (List.of ('SA_414', 'SA_663')),
      () =>
        findSelectOption (wikiEntry, instance.lookup ('sid'))
          .bind (item =>
            item.lookup ('target')
              .bind<Record<Wiki.Spell> | Record<Wiki.LiturgicalChant>> (target => {
                if (instance.get ('id') === 'SA_414') {
                  return wiki.get ('spells').lookup (target);
                }
                else {
                  return wiki.get ('liturgicalChants').lookup (target);
                }
              })
              .fmap (target => `${target.get ('name')}: ${item.get ('name')}`)
          )
    )
    .on ('SA_680', () =>
      (instance.lookup ('sid') as Maybe<string>)
        .bind (id => OrderedMap.lookup<string, Record<Wiki.Skill>> (id) (wiki.get ('skills')))
        .fmap (entry => `: ${entry.get ('name')}`)
    )
    .on ('SA_699', () =>
      wiki.get ('specialAbilities').lookup ('SA_29')
        .bind (languages =>
          findSelectOption (languages, instance.lookup ('sid'))
            .fmap (item => {
              return `${item.get ('name')}: ${
                Maybe.fromMaybe ('') (instance.lookup ('sid2').bind (sid2 =>
                  Maybe.ensure (isString) (sid2)
                    .alt (
                      item.lookup ('spec')
                        .bind (spec => spec.subscript ((sid2 as number) - 1))
                    )
                ))
              }`;
            })
        )
    )
    .otherwise (() => {
      const sid = instance.lookup ('sid');
      const stringSid = sid.bind (Maybe.ensure (isString));

      if (
        Maybe.isJust (wikiEntry.lookup ('input'))
        && Maybe.isJust (stringSid)
      ) {
        return stringSid;
      }
      else if (Maybe.isJust (wikiEntry.lookup ('select'))) {
        return getSelectOptionName (wikiEntry, sid);
      }
      else {
        return Maybe.empty ();
      }
    });
};

const getEntrySpecificNameReplacements = (
  wikiEntry: Wiki.Activatable,
  instance: Record<Data.ActiveObjectWithId>,
  maybeNameAddition: Maybe<string>,
  locale: Maybe<Record<Data.UIMessages>>
): string => {
  return Maybe.fromMaybe (wikiEntry.get ('name')) (
    match<string, Maybe<string>> (wikiEntry.get ('id'))
      .on (List.elem_ (List.of ('ADV_28', 'ADV_29')), () =>
        translate (locale, 'activatable.view.immunityto')
          .bind (name =>
            maybeNameAddition.fmap (nameAddition => `${name} ${nameAddition}`)
          )
      )
      .on ('ADV_68', () =>
        translate (locale, 'activatable.view.hatredof')
          .bind (name =>
            maybeNameAddition.fmap (nameAddition => `${name} ${nameAddition}`)
          )
      )
      .on ('DISADV_1', () =>
        translate (locale, 'activatable.view.afraidof')
          .bind (name =>
            maybeNameAddition.fmap (nameAddition => `${name} ${nameAddition}`)
          )
      )
      .on (List.elem_ (List.of ('DISADV_34', 'DISADV_50')), () =>
        instance.lookup ('tier')
          .bind (tier =>
            maybeNameAddition.fmap (nameAddition =>
              `${wikiEntry.get ('name')} ${getRoman (tier)} (${nameAddition})`
            )
          )
      )
      .on ('SA_639', () =>
        maybeNameAddition.fmap (nameAddition =>
          `${wikiEntry.get ('name')} ${nameAddition}`
        )
      )
      .on (List.elem_ (List.of ('SA_677', 'SA_678')), () => {
        const part = getBracketedNameFromFullName (wikiEntry.get ('name'));
        const maybeMusicTraditionLabels = translate (locale, 'musictraditions');

        return instance.lookup ('sid2')
          .bind (Maybe.ensure (isNumber))
          .bind (sid2 =>
            maybeMusicTraditionLabels
              .bind (musicTraditionLabels => musicTraditionLabels.subscript (sid2 - 1))
              .fmap (musicTradition =>
                wikiEntry.get ('name').replace (part, `${part}: ${musicTradition}`)
              )
          );
      })
      .otherwise (() =>
        maybeNameAddition.fmap (nameAddition => `${wikiEntry.get ('name')} (${nameAddition})`)
      )
  );
}

/**
 * Returns name, splitted and combined, of advantage/disadvantage/special
 * ability as a Maybe (in case the wiki entry does not exist).
 * @param instance The ActiveObject with origin id.
 * @param wiki The current hero's state.
 * @param locale The locale-dependent messages.
 */
export const getName = (
  instance: Record<Data.ActiveObjectWithId>,
  wiki: Record<Wiki.WikiAll>,
  locale: Maybe<Record<Data.UIMessages>>
): Maybe<Record<Data.ActivatableCombinedName>> => {
  return getWikiEntry<Wiki.Activatable> (wiki) (instance.get ('id'))
    .fmap (wikiEntry => {
      const maybeAddName = getEntrySpecificNameAddition (
        wikiEntry,
        instance,
        wiki
      );

      const name = getEntrySpecificNameReplacements (
        wikiEntry,
        instance,
        maybeAddName,
        locale
      );

      return Maybe.maybe<string, Record<Data.ActivatableCombinedName>> (
        Record.of ({
          name,
          baseName: wikiEntry.get ('name'),
        })
      ) (
        addName => Record.of<Data.ActivatableCombinedName> ({
          name,
          baseName: wikiEntry.get ('name'),
          addName,
        })
      ) (
        maybeAddName
      );
    });
};

interface EnhancedReduce {
  final: List<string>;
  previousLowerTier: boolean;
}

export const compressList = (
  list: List<Record<Data.ActiveViewObject> | string>,
  locale: Record<Data.UIMessages>
): string => {
  const listToString = sortStrings (
    list.foldl<List<string>> (
      acc => obj => {
        if (isString (obj)) {
          return acc.append (obj);
        }
        else if (!['SA_27', 'SA_29'].includes (obj.get ('id'))) {
          return acc.append (obj.get ('name'));
        }

        return acc;
      }
    ) (List.of ()),
    locale.get ('id')
  );

  const levelAfterParenthesis = /\(.+\)(?: [IVX]+)?$/;
  const insertLevelBeforeParenthesis = /\)((?: [IVX]+)?)$/;

  const initial: EnhancedReduce = {
    final: List.of (),
    previousLowerTier: false,
  };

  const finalList = listToString.foldl<EnhancedReduce> (
    previous => current =>
      Maybe.fromMaybe ({
        final: previous.final.append (current),
        previousLowerTier: false,
      }) (
        List.last_ (previous.final)
          .bind (Maybe.ensure (x =>
            x.split (' (')[0] === current.split (' (')[0]
            && levelAfterParenthesis.test (x)
          ))
          .bind (prevElement => {
            const prevElementSplitted = prevElement.split (/\)/);
            const optionalTier = prevElementSplitted.pop () || '';
            const beginning = `${prevElementSplitted.join (')')}${optionalTier}`;
            const currentSplitted = current.split (/\(/);
            const continuing = currentSplitted.slice (1).join ('(')
              .replace (insertLevelBeforeParenthesis, '$1)');

            return Maybe.fmap<List<string>, EnhancedReduce> (
              init => ({
                ...previous,
                final: init.append (`${beginning}, ${continuing}`),
              })
            ) (List.init_ (previous.final));
          })
      )
  ) (initial).final.intercalate (', ');

  return finalList;
};
