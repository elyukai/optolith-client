import * as Data from '../types/data';
import * as View from '../types/view';
import * as Wiki from '../types/wiki';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Just, List, Maybe, Nothing, Record, Tuple } from '../utils/dataUtils';
import { flattenDependencies } from '../utils/flattenDependencies';
import { getNumericBlessedTraditionIdByInstanceId, getNumericMagicalTraditionIdByInstanceId } from '../utils/IDUtils';
import { getCurrentEl, getStartEl } from './elSelectors';
import { getBlessedTraditionFromState } from './liturgicalChantsSelectors';
import { getCurrentRace } from './rcpSelectors';
import { getMagicalTraditionsSelector } from './spellsSelectors';
import { getAttributes, getAttributeValueLimit, getCurrentHeroPresent, getPhase, getWiki, getWikiAttributes } from './stateSelectors';

export const getAttributeSum = createMaybeSelector(
  getAttributes,
  maybeAttributes => Maybe.fromMaybe(
    0,
    maybeAttributes
      .map(
        attributes => attributes.foldl(
          sum => e => sum + e.get('value'),
          0
        )
      )
  )
);

const justTrue = Just(true);
const lastPhase = Just(3);

const getAttributeMaximum = (
  startEl: Maybe<Record<Wiki.ExperienceLevel>>,
  currentEl: Maybe<Record<Wiki.ExperienceLevel>>,
  phase: Maybe<number>,
  mod: number,
  attributeValueLimit: Maybe<boolean>
): Maybe<number> => {
  if (phase.lt(lastPhase)) {
    return startEl.map(el => el.get('maxAttributeValue') + mod);
  }
  else if (attributeValueLimit.equals(justTrue)) {
    return currentEl.map(el => el.get('maxAttributeValue') + 2);
  }

  return Nothing();
};

const getAttributeMinimum = (
  wiki: Wiki.WikiRecord,
  state: Data.Hero,
  dependencies: Data.AttributeDependent['dependencies'],
): number =>
  flattenDependencies(
    wiki,
    state,
    dependencies
  )
    .append(8)
    .maximum();

/**
 * Returns a `List` of attributes including state, full wiki infos and a
 * minimum and optional maximum value.
 */
export const getAttributesForView = createMaybeSelector(
  getCurrentHeroPresent,
  getStartEl,
  getCurrentEl,
  getPhase,
  getAttributeValueLimit,
  getWiki,
  (
    maybeHero,
    startEl,
    currentEl,
    phase,
    attributeValueLimit,
    wiki
  ): (List<Record<View.AttributeWithRequirements>>) =>
    Maybe.fromMaybe(
      List.of(),
      maybeHero.map(
        hero => hero.get('attributes').foldl<(List<Record<View.AttributeWithRequirements>>)>(
          list => attribute => {
            const max = getAttributeMaximum(
              startEl,
              currentEl,
              phase,
              attribute.get('mod'),
              attributeValueLimit
            );

            const min = getAttributeMinimum(
              wiki,
              hero,
              attribute.get('dependencies'),
            );

            return Maybe.fromMaybe(
              list,
              wiki.get('attributes').lookup(attribute.get('id'))
                .map(
                  wikiAttribute => list.append(
                    attribute
                      .merge(wikiAttribute)
                      .merge(
                        Record.of({
                          max,
                          min,
                        })
                      )
                  )
                )
            );
          },
          List.of()
        )
      )
    )
);

/**
 * Returns a `List` of attributes containing the current state and full wiki
 * info.
 */
export const getForSheet = createMaybeSelector(
  getAttributes,
  getWikiAttributes,
  (maybeAttributes, wiki): (List<Record<View.AttributeCombined>>) =>
    Maybe.fromMaybe(
      List.of(),
      maybeAttributes.map(
        attributes => attributes.foldl<(List<Record<View.AttributeCombined>>)>(
          list => attribute => Maybe.fromMaybe(
            list,
            wiki.lookup(attribute.get('id'))
              .map(
                wikiAttribute => list.append(
                  attribute
                    .merge(wikiAttribute)
                )
              )
          ),
          List.of()
        )
      )
    )
);

/**
 * Returns the maximum attribute value of the list of given attribute ids.
 */
export const getMaxAttributeValueByID = (
  attributes: Data.HeroDependent['attributes'],
  ids: List<string>
) =>
  Maybe.mapMaybe(
    id => attributes
      .lookup(id)
      .map(attribute => attribute.get('value')),
    ids
  )
    .append(8)
    .maximum();

const getPrimaryMagicalAttributeInstance = (
  tradition: Record<Data.ActivatableDependent>,
  maybeAttributes: Maybe<Data.HeroDependent['attributes']>,
  wikiAttributes: Wiki.WikiAll['attributes']
): (Maybe<Record<View.AttributeCombined>>) => {
  switch (getNumericMagicalTraditionIdByInstanceId(tradition.get('id'))) {
    case 1:
    case 4:
    case 10:
      return maybeAttributes
        .bind(attributes => attributes.lookup('ATTR_2'))
        .bind(
          attribute => wikiAttributes.lookup('ATTR_2')
            .map(
              wikiAttribute => wikiAttribute.merge(attribute)
            )
        );
    case 3:
      return maybeAttributes
        .bind(attributes => attributes.lookup('ATTR_3'))
        .bind(
          attribute => wikiAttributes.lookup('ATTR_3')
            .map(
              wikiAttribute => wikiAttribute.merge(attribute)
            )
        );
    case 2:
    case 5:
    case 6:
    case 7:
      return maybeAttributes
        .bind(attributes => attributes.lookup('ATTR_4'))
        .bind(
          attribute => wikiAttributes.lookup('ATTR_4')
            .map(
              wikiAttribute => wikiAttribute.merge(attribute)
            )
        );

    default:
      return Nothing();
  }
};

export const getPrimaryMagicalAttribute = createMaybeSelector(
  getMagicalTraditionsSelector,
  getAttributes,
  getWikiAttributes,
  (maybeTraditions, maybeAttributes, wikiAttributes) =>
    maybeTraditions.bind(
      traditions => traditions.foldl<(Maybe<Record<View.AttributeCombined>>)>(
        highestAttribute => tradition => {
          const attribute = getPrimaryMagicalAttributeInstance(
            tradition,
            maybeAttributes,
            wikiAttributes,
          );

          return highestAttribute.map(x => x.get('value'))
            .lt(attribute.map(x => x.get('value')))
              ? attribute
              : highestAttribute;
        },
        Nothing()
      )
    )
);

export const getPrimaryMagicalAttributeForSheet = createMaybeSelector(
  getPrimaryMagicalAttribute,
  Maybe.map(Record.get<View.AttributeCombined, 'short'>('short'))
);

const getPrimaryBlessedAttributeInstance = (
  tradition: Record<Data.ActivatableDependent>,
  maybeAttributes: Maybe<Data.HeroDependent['attributes']>,
  wikiAttributes: Wiki.WikiAll['attributes']
): (Maybe<Record<View.AttributeCombined>>) => {
  switch (getNumericBlessedTraditionIdByInstanceId(tradition.get('id'))) {
    case 2:
    case 3:
    case 9:
    case 13:
    case 16:
    case 18:
      return maybeAttributes
        .bind(attributes => attributes.lookup('ATTR_1'))
        .bind(
          attribute => wikiAttributes.lookup('ATTR_1')
            .map(
              wikiAttribute => wikiAttribute.merge(attribute)
            )
        );
    case 1:
    case 4:
    case 8:
    case 17:
      return maybeAttributes
        .bind(attributes => attributes.lookup('ATTR_2'))
        .bind(
          attribute => wikiAttributes.lookup('ATTR_2')
            .map(
              wikiAttribute => wikiAttribute.merge(attribute)
            )
        );
    case 5:
    case 6:
    case 11:
    case 14:
      return maybeAttributes
        .bind(attributes => attributes.lookup('ATTR_3'))
        .bind(
          attribute => wikiAttributes.lookup('ATTR_3')
            .map(
              wikiAttribute => wikiAttribute.merge(attribute)
            )
        );
    case 7:
    case 10:
    case 12:
    case 15:
      return maybeAttributes
        .bind(attributes => attributes.lookup('ATTR_4'))
        .bind(
          attribute => wikiAttributes.lookup('ATTR_4')
            .map(
              wikiAttribute => wikiAttribute.merge(attribute)
            )
        );

    default:
      return Nothing();
  }
};

export const getPrimaryBlessedAttribute = createMaybeSelector(
  getBlessedTraditionFromState,
  getAttributes,
  getWikiAttributes,
  (maybeTradition, maybeAttributes, wikiAttributes) =>
    maybeTradition.bind(
      tradition => getPrimaryBlessedAttributeInstance(
        tradition,
        maybeAttributes,
        wikiAttributes
      )
    )
);

export const getPrimaryBlessedAttributeForSheet = createMaybeSelector(
  getPrimaryBlessedAttribute,
  Maybe.map(Record.get<View.AttributeCombined, 'short'>('short'))
);

export const getCarryingCapacity = createMaybeSelector(
  getAttributes,
  maybeAttributes => maybeAttributes
    .bind(attributes => attributes.lookup('ATTR_8'))
    .map(strength => strength.get('value') * 2)
);

export const getAdjustmentValue = createMaybeSelector(
  getCurrentRace,
  Maybe.map(race => Tuple.fst(race.get('attributeAdjustmentsSelection')))
);

export const getCurrentAdjustmentAttribute = createMaybeSelector(
  getAdjustmentValue,
  getAttributesForView,
  (maybeAdjustmentValue, attributesCalculated) => maybeAdjustmentValue.bind(
    adjustmentValue => attributesCalculated.find(
      attribute => attribute.get('mod') === adjustmentValue
    )
  )
);

export const getCurrentAdjustmentId = createMaybeSelector(
  getCurrentAdjustmentAttribute,
  Maybe.map(attribute => attribute.get('id'))
);

export const getAvailableAdjustmentIds = createMaybeSelector(
  getCurrentRace,
  getAdjustmentValue,
  getAttributesForView,
  getCurrentAdjustmentAttribute,
  (maybeRace, maybeAdjustmentValue, attributesCalculated, maybeCurrentAttribute) =>
    maybeRace.map(race => Tuple.snd(race.get('attributeAdjustmentsSelection')))
      .map<List<string>>(
        adjustmentIds => {
          if (Maybe.isJust(maybeCurrentAttribute)) {
            const currentAttribute = Maybe.fromJust(maybeCurrentAttribute);

            if (
              Maybe.fromMaybe(
                false,
                currentAttribute.get('max').bind(
                  max => maybeAdjustmentValue.map(
                    adjustmentValue => currentAttribute.get('value') > max - adjustmentValue
                  )
                )
              )
            ) {
              return List.of(currentAttribute.get('id'));
            }
          }

          return adjustmentIds.filter(id => {
            const maybeAttribute = attributesCalculated
              .find(e => e.get('id') === id);

            if (Maybe.isJust(maybeAttribute)) {
              const attribute = Maybe.fromJust(maybeAttribute);

              if (
                Maybe.isNothing(attribute.get('max')) ||
                maybeCurrentAttribute.map(x => x.get('id')).equals(Just(id))
              ) {
                return true;
              }
              else if (Maybe.isJust(maybeAdjustmentValue)) {
                return Maybe.fromMaybe(
                  true,
                  attribute.get('max')
                    .map(
                      max => max + Maybe.fromJust(maybeAdjustmentValue) >= attribute.get('value')
                    )
                );
              }
            }

            return false;
          });
        }
      )
);
