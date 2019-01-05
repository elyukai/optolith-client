import * as R from 'ramda';
import * as View from '../App/Models/View/viewTypeHelpers';
import * as Wiki from '../App/Models/Wiki/wikiTypeHelpers';
import { createMaybeSelector } from '../App/Utils/createMaybeSelector';
import { getNumericBlessedTraditionIdByInstanceId, getNumericMagicalTraditionIdByInstanceId } from '../App/Utils/IDUtils';
import * as Data from '../types/data';
import { createAttributeDependent } from '../utils/createEntryUtils';
import { Just, List, Maybe, Nothing, OrderedMap, Record, Tuple } from '../utils/dataUtils';
import { flattenDependencies } from '../utils/dependencies/flattenDependencies';
import { flip } from '../utils/flip';
import { getCurrentEl, getStartEl } from './elSelectors';
import { getBlessedTraditionFromState } from './liturgicalChantsSelectors';
import { getCurrentRace } from './rcpSelectors';
import { getMagicalTraditionsFromState } from './spellsSelectors';
import { getAttributes, getAttributeValueLimit, getCurrentAttributeAdjustmentId, getCurrentHeroPresent, getPhase, getWiki, getWikiAttributes } from './stateSelectors';

export const getAttributeSum = createMaybeSelector (
  getAttributes,
  R.pipe (
    Maybe.fmap (
      OrderedMap.foldl<Record<Data.AttributeDependent>, number> (sum => e =>
                                                                  sum + e.get ('value') - 8)
                                                                (64)
    ),
    Maybe.fromMaybe (0)
  )
);

const justTrue = Just (true);
const lastPhase = Just (3);

const getModIfSelectedAdjustment = (id: string) =>
  (race: Record<Wiki.Race>) =>
    R.pipe
      (
        Record.get<Wiki.Race, 'attributeAdjustmentsSelection'> ('attributeAdjustmentsSelection'),
        Tuple.snd,
        Maybe.ensure (List.elem (id)),
        Maybe.mapReplace (Tuple.fst (race .get ('attributeAdjustmentsSelection'))),
        Maybe.fromMaybe (0)
      )
      (race);

const getModIfStaticAdjustment = (id: string) => R.pipe (
  Record.get<Wiki.Race, 'attributeAdjustments'> ('attributeAdjustments'),
  List.lookup (id),
  Maybe.fromMaybe (0)
);

const getAttributeMaximum = (
  id: string,
  maybeRace: Maybe<Record<Wiki.Race>>,
  adjustmentId: string,
  startEl: Maybe<Record<Wiki.ExperienceLevel>>,
  currentEl: Maybe<Record<Wiki.ExperienceLevel>>,
  phase: Maybe<number>,
  attributeValueLimit: Maybe<boolean>
): Maybe<number> => {
  if (phase .lt (lastPhase)) {
    if (Maybe.isJust (maybeRace)) {
      const race = Maybe.fromJust (maybeRace);
      const selectedAdjustment = adjustmentId === id ? getModIfSelectedAdjustment (id) (race) : 0;
      const staticAdjustment = getModIfStaticAdjustment (id) (race);

      return startEl
        .fmap (
          el => el.get ('maxAttributeValue') + selectedAdjustment + staticAdjustment
        );
    }

    return Just (0);
  }
  else if (attributeValueLimit .equals (justTrue)) {
    return currentEl .fmap (el => el.get ('maxAttributeValue') + 2);
  }

  return Nothing ();
};

const getAttributeMinimum = (
  wiki: Wiki.WikiRecord,
  state: Data.Hero,
  dependencies: Data.AttributeDependent['dependencies']
): number =>
  flattenDependencies (
    wiki,
    state,
    dependencies
  )
    .cons (8)
    .maximum ();

/**
 * Returns a `List` of attributes including state, full wiki infos and a
 * minimum and optional maximum value.
 */
export const getAttributesForView = createMaybeSelector (
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
  ) =>
    Maybe.fromMaybe<List<Record<View.AttributeWithRequirements>>> (List.of ()) (
      maybeHero.fmap (
        hero => wiki .get ('attributes').foldr<List<Record<View.AttributeWithRequirements>>> (
          list => wikiEntry => {
            const stateEntry =
              Maybe.fromMaybe
                (createAttributeDependent (wikiEntry .get ('id')))
                (hero .get ('attributes') .lookup (wikiEntry .get ('id')));

            const max = getAttributeMaximum (
              wikiEntry .get ('id'),
              hero .lookup ('race') .bind (OrderedMap.lookup_ (wiki .get ('races'))),
              hero .get ('attributeAdjustmentSelected'),
              startEl,
              currentEl,
              phase,
              attributeValueLimit
            );

            const min = getAttributeMinimum (
              wiki,
              hero,
              stateEntry .get ('dependencies')
            );

            return list.cons (
              stateEntry
                .merge (wikiEntry)
                .merge (
                  Record.ofMaybe<{ max?: number; min: number }> ({
                    max,
                    min,
                  })
                )
            );
          }
        ) (List.of ())
      )
    )
);

/**
 * Returns a `List` of attributes containing the current state and full wiki
 * info.
 */
export const getAttributesForSheet = createMaybeSelector (
  getAttributes,
  getWikiAttributes,
  (maybeAttributes, wiki) =>
    Maybe.fromMaybe<List<Record<View.AttributeCombined>>> (List.of ()) (
      maybeAttributes.fmap (
        stateAttributes =>
          wiki
            .elems ()
            .map (
              wikiEntry => wikiEntry
                .merge (
                  Maybe.fromMaybe
                    (createAttributeDependent (wikiEntry .get ('id')))
                    (stateAttributes .lookup (wikiEntry .get ('id')))
                )
            )
        )
      )
);

/**
 * Returns the maximum attribute value of the list of given attribute ids.
 */
export const getMaxAttributeValueByID = (attributes: Data.HeroDependent['attributes']) => R.pipe (
  Maybe.mapMaybe<string, number> (
    id => attributes .lookup (id) .fmap (attribute => attribute.get ('value'))
  ),
  flip<List<number>, number, List<number>> (List.cons) (8),
  List.maximum
);

const getPrimaryMagicalAttributeInstance = (
  tradition: Record<Data.ActivatableDependent>,
  maybeAttributes: Maybe<Data.HeroDependent['attributes']>,
  wikiAttributes: Wiki.WikiAll['attributes']
): Maybe<Record<View.AttributeCombined>> =>
  getNumericMagicalTraditionIdByInstanceId (tradition.get ('id'))
    .bind (
      numericId => {
        switch (numericId) {
          case 1:
          case 4:
          case 10:
            return maybeAttributes
              .bind (attributes => attributes.lookup ('ATTR_2'))
              .bind (
                attribute => wikiAttributes.lookup ('ATTR_2')
                  .fmap (
                    wikiAttribute => wikiAttribute.merge (attribute)
                  )
              );
          case 3:
            return maybeAttributes
              .bind (attributes => attributes.lookup ('ATTR_3'))
              .bind (
                attribute => wikiAttributes.lookup ('ATTR_3')
                  .fmap (
                    wikiAttribute => wikiAttribute.merge (attribute)
                  )
              );
          case 2:
          case 5:
          case 6:
          case 7:
            return maybeAttributes
              .bind (attributes => attributes.lookup ('ATTR_4'))
              .bind (
                attribute => wikiAttributes.lookup ('ATTR_4')
                  .fmap (
                    wikiAttribute => wikiAttribute.merge (attribute)
                  )
              );

          default:
            return Nothing ();
        }
      }
    );

export const getPrimaryMagicalAttribute = createMaybeSelector (
  getMagicalTraditionsFromState,
  getAttributes,
  getWikiAttributes,
  (maybeTraditions, maybeAttributes, wikiAttributes) =>
    maybeTraditions.bind (
      traditions => traditions.foldl<(Maybe<Record<View.AttributeCombined>>)> (
        highestAttribute => tradition => {
          const attribute = getPrimaryMagicalAttributeInstance (
            tradition,
            maybeAttributes,
            wikiAttributes
          );

          return highestAttribute.fmap (x => x.get ('value'))
            .lt (attribute.fmap (x => x.get ('value')))
              ? attribute
              : highestAttribute;
        }
      ) (Nothing ())
    )
);

export const getPrimaryMagicalAttributeForSheet = createMaybeSelector (
  getPrimaryMagicalAttribute,
  Maybe.fmap (Record.get<View.AttributeCombined, 'short'> ('short'))
);

const getPrimaryBlessedAttributeInstance = (
  tradition: Record<Data.ActivatableDependent>,
  maybeAttributes: Maybe<Data.HeroDependent['attributes']>,
  wikiAttributes: Wiki.WikiAll['attributes']
): Maybe<Record<View.AttributeCombined>> =>
  getNumericBlessedTraditionIdByInstanceId (tradition.get ('id'))
    .bind (
      numericId => {
        switch (numericId) {
          case 2:
          case 3:
          case 9:
          case 13:
          case 16:
          case 18:
            return maybeAttributes
              .bind (attributes => attributes.lookup ('ATTR_1'))
              .bind (
                attribute => wikiAttributes.lookup ('ATTR_1')
                  .fmap (
                    wikiAttribute => wikiAttribute.merge (attribute)
                  )
              );
          case 1:
          case 4:
          case 8:
          case 17:
            return maybeAttributes
              .bind (attributes => attributes.lookup ('ATTR_2'))
              .bind (
                attribute => wikiAttributes.lookup ('ATTR_2')
                  .fmap (
                    wikiAttribute => wikiAttribute.merge (attribute)
                  )
              );
          case 5:
          case 6:
          case 11:
          case 14:
            return maybeAttributes
              .bind (attributes => attributes.lookup ('ATTR_3'))
              .bind (
                attribute => wikiAttributes.lookup ('ATTR_3')
                  .fmap (
                    wikiAttribute => wikiAttribute.merge (attribute)
                  )
              );
          case 7:
          case 10:
          case 12:
          case 15:
            return maybeAttributes
              .bind (attributes => attributes.lookup ('ATTR_4'))
              .bind (
                attribute => wikiAttributes.lookup ('ATTR_4')
                  .fmap (
                    wikiAttribute => wikiAttribute.merge (attribute)
                  )
              );

          default:
            return Nothing ();
        }
      }
    );

export const getPrimaryBlessedAttribute = createMaybeSelector (
  getBlessedTraditionFromState,
  getAttributes,
  getWikiAttributes,
  (maybeTradition, maybeAttributes, wikiAttributes) =>
    maybeTradition.bind (
      tradition => getPrimaryBlessedAttributeInstance (
        tradition,
        maybeAttributes,
        wikiAttributes
      )
    )
);

export const getPrimaryBlessedAttributeForSheet = createMaybeSelector (
  getPrimaryBlessedAttribute,
  Maybe.fmap (Record.get<View.AttributeCombined, 'short'> ('short'))
);

export const getCarryingCapacity = createMaybeSelector (
  getAttributes,
  maybeAttributes => maybeAttributes
    .bind (attributes => attributes.lookup ('ATTR_8'))
    .fmap (strength => strength.get ('value') * 2)
);

export const getAdjustmentValue = createMaybeSelector (
  getCurrentRace,
  Maybe.fmap (race => Tuple.fst (race.get ('attributeAdjustmentsSelection')))
);

export const getCurrentAttributeAdjustment = createMaybeSelector (
  getAttributesForView,
  getCurrentAttributeAdjustmentId,
  (attributes, maybeId) => maybeId .bind (id => attributes .find (e => e .get ('id') === id))
);

export const getAvailableAdjustmentIds = createMaybeSelector (
  getCurrentRace,
  getAdjustmentValue,
  getAttributesForView,
  getCurrentAttributeAdjustment,
  (maybeRace, maybeAdjustmentValue, attributesCalculated, maybeCurrentAttribute) =>
    maybeRace.fmap (race => Tuple.snd (race.get ('attributeAdjustmentsSelection')))
      .fmap<List<string>> (
        adjustmentIds => {
          if (Maybe.isJust (maybeCurrentAttribute)) {
            const currentAttribute = Maybe.fromJust (maybeCurrentAttribute);

            if (
              Maybe.fromMaybe (false) (
                currentAttribute
                  .lookup ('max')
                  .bind (
                    max => maybeAdjustmentValue.fmap (
                      adjustmentValue => currentAttribute.get ('value') > max - adjustmentValue
                    )
                  )
              )
            ) {
              return List.of (currentAttribute.get ('id'));
            }
          }

          return adjustmentIds.filter (id => {
            const maybeAttribute = attributesCalculated
              .find (e => e.get ('id') === id);

            if (Maybe.isJust (maybeAttribute)) {
              const attribute = Maybe.fromJust (maybeAttribute);

              if (
                Maybe.isNothing (attribute .lookup ('max')) ||
                maybeCurrentAttribute.fmap (x => x.get ('id')).equals (Just (id))
              ) {
                return true;
              }
              else if (Maybe.isJust (maybeAdjustmentValue)) {
                return Maybe.fromMaybe (true) (
                  attribute
                    .lookup ('max')
                    .fmap (
                      max => max + Maybe.fromJust (maybeAdjustmentValue) >= attribute.get ('value')
                    )
                );
              }
            }

            return false;
          });
        }
      )
);
