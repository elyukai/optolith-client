import * as R from 'ramda';
import { ArmorZonesInstance, AttributeDependent, HeroDependent, ItemInstance } from '../types/data';
import { getAttack, getParry } from '../utils/CombatTechniqueUtils';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { List, Maybe, OrderedMap, Record, RecordInterface } from '../utils/dataUtils';
import { AllSortOptions, filterAndSortObjects, filterObjects, sortObjects } from '../utils/FilterSortUtils';
import { convertPrimaryAttributeToArray } from '../utils/ItemUtils';
import { isAvailable } from '../utils/RulesUtils';
import { Armor, ArmorZone, Item, MeleeWeapon, RangedWeapon, ShieldOrParryingWeapon } from '../utils/viewData/viewTypeHelpers';
import { Attribute, CombatTechnique, ItemTemplate, WikiAll } from '../utils/wikiData/wikiTypeHelpers';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getEquipmentSortOptions } from './sortOptionsSelectors';
import { getArmorZonesState, getCurrentHeroPresent, getEquipmentFilterText, getEquipmentState, getHigherParadeValues, getItemsState, getItemTemplatesFilterText, getLocaleAsProp, getWiki, getWikiItemTemplates, getZoneArmorFilterText } from './stateSelectors';

// export function get(state: EquipmentState, id: string) {
//   return state.items.get(id);
// }

// export function getTemplate(state: EquipmentState, id: string) {
//   return state.itemTemplates.get(id);
// }

// export function getZoneArmor(state: EquipmentState, id?: string) {
//   if (id) {
//     return getTemplate(state, id) || get(state, id);
//   }
//   return;
// }

// export function getZoneArmorFn(state: EquipmentState) {
//   return (id?: string) => {
//     if (id) {
//       return getTemplate(state, id) || get(state, id);
//     }
//     return;
//   };
// }

export const getFullItem = (items: RecordInterface<HeroDependent['belongings']>['items']) =>
  (templates: WikiAll['itemTemplates']) =>
    (id: string) =>
      items.lookup (id)
        .fmap<Record<ItemInstance>> (
          item => {
            const { isTemplateLocked, template, where, amount, loss } = item.toObject ();
            const maybeActiveTemplate =
              Maybe.bind<string, Record<ItemTemplate>>
                (Maybe.fromNullable (template))
                (templateId => OrderedMap.lookup<string, Record<ItemTemplate>> (templateId)
                                                                               (templates));

            return Maybe.fromMaybe (item)
                                   (Maybe.ensure<boolean> (R.identity) (isTemplateLocked)
                                     .then (maybeActiveTemplate)
                                     .fmap (
                                       activeTemplate => activeTemplate.merge (Record.of ({
                                         where,
                                         amount,
                                         loss,
                                         id,
                                       })) as Record<ItemInstance>
                                     )
                                   );
          }
        )
        .alt (templates.lookup (id) as Maybe<Record<ItemInstance>>);

export const getTemplates = createMaybeSelector (
  getWikiItemTemplates,
  OrderedMap.elems
);

export const getSortedTemplates = createMaybeSelector (
  getTemplates,
  getLocaleAsProp,
  (templates, locale) => sortObjects (templates, locale.get ('id'))
);

export const getAvailableItemTemplates = createMaybeSelector (
  getSortedTemplates,
  getRuleBooksEnabled,
  (list, maybeAvailablility) => maybeAvailablility.fmap (
    availablility => list.filter (isAvailable (availablility))
  )
);

export const getFilteredItemTemplates = createMaybeSelector (
  getAvailableItemTemplates,
  getItemTemplatesFilterText,
  (maybeItems, filterText) => maybeItems.fmap (items => filterObjects (items, filterText))
);

export const getItems = createMaybeSelector (
  getItemsState,
  getWikiItemTemplates,
  (maybeItems, templates) => maybeItems.fmap (
    items => R.pipe (
      (map: OrderedMap<string, Record<ItemInstance>>) => OrderedMap.elems (map),
      Maybe.mapMaybe (R.pipe (
        Record.get<ItemInstance, 'id'> ('id'),
        getFullItem (items) (templates)
      ))
    ) (items)
  )
);

export const getFilteredItems = createMaybeSelector (
  getItems,
  getEquipmentFilterText,
  getEquipmentSortOptions,
  getLocaleAsProp,
  (maybeItems, filterText, sortOptions, locale) => maybeItems.fmap (
    items => filterAndSortObjects (
      items,
      locale.get ('id'),
      filterText,
      sortOptions as AllSortOptions<ItemInstance>
    )
  )
);

export const getArmorZoneInstances = createMaybeSelector (
  getArmorZonesState,
  Maybe.fmap (OrderedMap.elems)
);

export const getFilteredZoneArmors = createMaybeSelector (
  getArmorZoneInstances,
  getZoneArmorFilterText,
  getLocaleAsProp,
  (maybeZoneArmors, filterText, locale) => maybeZoneArmors.fmap (
    zoneArmors => filterAndSortObjects (zoneArmors, locale.get ('id'), filterText)
  )
);

export const getAllItems = createMaybeSelector (
  getItemsState,
  getArmorZonesState,
  getWikiItemTemplates,
  getLocaleAsProp,
  (maybeItems, maybeZoneArmors, templates, locale) =>
    Maybe.liftM2 ((items: RecordInterface<HeroDependent['belongings']>['items']) =>
                    (zoneArmors: RecordInterface<HeroDependent['belongings']>['armorZones']) => {
                      const rawItems = OrderedMap.elems (items);
                      const rawArmorZones = OrderedMap.elems (zoneArmors);

                      const mappedItems = R.pipe (
                        List.filter (R.pipe (
                          Record.lookup<ItemInstance, 'forArmorZoneOnly'> ('forArmorZoneOnly'),
                          Maybe.elem (true),
                          R.not
                        )),
                        Maybe.mapMaybe<Record<ItemInstance>, Record<Item>> (R.pipe (
                          Record.get<ItemInstance, 'id'> ('id'),
                          getFullItem (items) (templates) as any as
                            (id: string) => Maybe<Record<Item>>
                        ))
                      ) (rawItems);

                      const mappedArmorZones = rawArmorZones.map<Record<Item>> (zoneArmor => {
                        const headArmor = zoneArmor.lookup ('head').bind (
                          getFullItem (items) (templates)
                        );

                        const torsoArmor = zoneArmor.lookup ('torso').bind (
                          getFullItem (items) (templates)
                        );

                        const leftArmArmor = zoneArmor.lookup ('leftArm').bind (
                          getFullItem (items) (templates)
                        );

                        const rightArmArmor = zoneArmor.lookup ('rightArm').bind (
                          getFullItem (items) (templates)
                        );

                        const leftLegArmor = zoneArmor.lookup ('leftLeg').bind (
                          getFullItem (items) (templates)
                        );

                        const rightLegArmor = zoneArmor.lookup ('rightLeg').bind (
                          getFullItem (items) (templates)
                        );

                        const priceTotal = getPriceTotal (
                          headArmor,
                          leftArmArmor,
                          leftLegArmor,
                          rightArmArmor,
                          rightLegArmor,
                          torsoArmor
                        );

                        const weightTotal = getWeightTotal (
                          headArmor,
                          leftArmArmor,
                          leftLegArmor,
                          rightArmArmor,
                          rightLegArmor,
                          torsoArmor
                        );

                        return Record.of<Item> ({
                          id: zoneArmor.get ('id'),
                          name: zoneArmor.get ('name'),
                          amount: 1,
                          price: priceTotal,
                          weight: weightTotal,
                          gr: 4,
                        });
                      });

                      return mappedArmorZones.mappend (mappedItems);
                    })
                 (maybeItems)
                 (maybeZoneArmors)
      .fmap (list => sortObjects (list, locale .get ('id')))
);

export const getTotalPrice = createMaybeSelector (
  getAllItems,
  Maybe.fmap (
    List.foldr<Record<Item>, number> (item => R.add (item.get ('amount') * item.get ('price')))
                                     (0)
  )
);

export const getTotalWeight = createMaybeSelector (
  getAllItems,
  Maybe.fmap (
    List.foldr<Record<Item>, number> (item =>
                                        R.add (
                                          item.get ('amount')
                                          * item.lookupWithDefault<'weight'> (0) ('weight')
                                        ))
                                     (0)
  )
);

export const getMeleeWeapons = createMaybeSelector (
  getCurrentHeroPresent,
  getHigherParadeValues,
  getWiki,
  (maybeHero, higherParadeValues, wiki) => maybeHero.fmap (
    hero => {
      const items = hero.get ('belongings').get ('items');
      const rawItems = items.elems ();

      const filteredItems = rawItems.filter (
        item => (item.get ('gr') === 1 || !Maybe.elem (1) (item.lookup ('improvisedWeaponGroup')))
          && !Maybe.elem ('CT_10') (item.lookup ('combatTechnique'))
      );

      return Maybe.mapMaybe<Record<ItemInstance>, Record<MeleeWeapon>> (
        item => getFullItem (items) (wiki.get ('itemTemplates')) (item.get ('id'))
          .bind (
            fullItem => fullItem.lookup ('combatTechnique')
              .bind (
                id => OrderedMap.lookup<string, Record<CombatTechnique>>
                  (id)
                  (wiki.get ('combatTechniques'))
              )
              .bind (
                wikiEntry => {
                  const stateEntry = hero.get ('combatTechniques').lookup (wikiEntry.get ('id'));

                  const atBase = getAttack (hero) (wikiEntry) (stateEntry);
                  const at = atBase + Maybe.fromMaybe (0) (fullItem.lookup ('at'));

                  const paBase = getParry (hero) (wikiEntry) (stateEntry);
                  const pa = paBase.fmap (
                    R.add (Maybe.fromMaybe (0) (fullItem.lookup ('pa'))
                    + Maybe.fromMaybe (0) (higherParadeValues))
                  );

                  const primaryAttributeIds = fullItem.lookup ('damageBonus').fmap (
                    damageBonus => Maybe.fromMaybe (wikiEntry.get ('primary'))
                                                   (damageBonus.lookup ('primary')
                                                     .fmap (convertPrimaryAttributeToArray))
                  );

                  const maybePrimaryAttributes = primaryAttributeIds.fmap (
                    Maybe.mapMaybe (
                      id => OrderedMap.lookup<string, Record<Attribute>> (id)
                                                                         (wiki.get ('attributes'))
                    )
                  );

                  const maybePrimaryAttributeValues = primaryAttributeIds.fmap (
                    List.map (R.pipe (
                      (id: string) =>
                        OrderedMap.lookup<string, Record<AttributeDependent>>
                          (id)
                          (hero.get ('attributes')),
                      Maybe.fmap (Record.get<AttributeDependent, 'value'> ('value')),
                      Maybe.fromMaybe (8)
                    ))
                  );

                  type Thresholds = number | List<number>;

                  const damageThresholds =
                    Maybe.fromMaybe<Thresholds> (0)
                                                (fullItem.lookup ('damageBonus').fmap (
                                                  damageBonus => damageBonus.get ('threshold')
                                                ));

                  const damageFlatBonus = maybePrimaryAttributeValues.fmap (
                    primaryAttributeValues => damageThresholds instanceof List
                      ? primaryAttributeValues.imap (
                        index => e => Maybe.fromMaybe (0)
                                                      (damageThresholds.subscript (index).fmap (
                                                        R.subtract (e)
                                                      ))
                      )
                        .cons (0) .maximum ()
                      : primaryAttributeValues.map (R.flip (R.subtract) (damageThresholds))
                        .cons (0) .maximum ()
                  );

                  const damageFlat =
                    Maybe.fromMaybe (0)
                                    (Maybe.liftM2<number, number, number> (R.add)
                                                                          (fullItem
                                                                            .lookup ('damageFlat'))
                                                                          (damageFlatBonus));

                  return maybePrimaryAttributes.fmap (
                    primaryAttributes => Record.ofMaybe<MeleeWeapon> ({
                      id: fullItem.get ('id'),
                      name: fullItem.get ('name'),
                      combatTechnique: wikiEntry.get ('name'),
                      primary: primaryAttributes.map (e => e.get ('short')),
                      primaryBonus: damageThresholds,
                      damageDiceNumber: fullItem.lookup ('damageDiceNumber'),
                      damageDiceSides: fullItem.lookup ('damageDiceSides'),
                      damageFlat,
                      atMod: fullItem.lookup ('at'),
                      at,
                      paMod: fullItem.lookup ('pa'),
                      pa,
                      reach: fullItem.lookup ('reach'),
                      bf: wikiEntry.get ('bf')
                        + fullItem.lookupWithDefault<'stabilityMod'> (0) ('stabilityMod'),
                      loss: fullItem.lookup ('loss'),
                      weight: fullItem.lookup ('weight'),
                      isImprovisedWeapon: fullItem.member ('improvisedWeaponGroup'),
                      isTwoHandedWeapon:
                        fullItem.lookupWithDefault<'isTwoHandedWeapon'> (false)
                                                                        ('isTwoHandedWeapon'),
                    })
                  );
                }
              )
          )
      ) (filteredItems);
    }
  )
);

export const getRangedWeapons = createMaybeSelector (
  getCurrentHeroPresent,
  getWiki,
  (maybeHero, wiki) => maybeHero.fmap (
    hero => {
      const items = hero.get ('belongings').get ('items');
      const rawItems = items.elems ();

      const filteredItems = rawItems.filter (
        item => item.get ('gr') === 2 || !Maybe.elem (2) (item.lookup ('improvisedWeaponGroup'))
      );

      return Maybe.mapMaybe<Record<ItemInstance>, Record<RangedWeapon>> (
        item => getFullItem (items) (wiki.get ('itemTemplates')) (item.get ('id'))
          .bind (
            fullItem => fullItem.lookup ('combatTechnique')
              .bind (
                id => OrderedMap.lookup<string, Record<CombatTechnique>>
                  (id)
                  (wiki.get ('combatTechniques'))
              )
              .fmap (
                wikiEntry => {
                  const stateEntry = hero.get ('combatTechniques').lookup (wikiEntry.get ('id'));

                  const atBase = getAttack (hero) (wikiEntry) (stateEntry);
                  const at = atBase + Maybe.fromMaybe (0) (fullItem.lookup ('at'));

                  const ammunition = fullItem.lookup ('ammunition')
                    .bind (getFullItem (items) (wiki.get ('itemTemplates')))
                    .fmap (ammunitionItem => ammunitionItem.get ('name'));

                  return Record.ofMaybe<RangedWeapon> ({
                    id: fullItem.get ('id'),
                    name: fullItem.get ('name'),
                    combatTechnique: wikiEntry.get ('name'),
                    reloadTime: fullItem.lookup ('reloadTime'),
                    damageDiceNumber: fullItem.lookup ('damageDiceNumber'),
                    damageDiceSides: fullItem.lookup ('damageDiceSides'),
                    damageFlat: fullItem.lookup ('damageFlat'),
                    at,
                    range: fullItem.lookup ('range'),
                    bf: wikiEntry.get ('bf')
                      + fullItem.lookupWithDefault<'stabilityMod'> (0) ('stabilityMod'),
                    loss: fullItem.lookup ('loss'),
                    weight: fullItem.lookup ('weight'),
                    ammunition,
                  });
                }
              )
          )
      ) (filteredItems);
    }
  )
);

export const getStabilityByArmorTypeId = R.pipe (
  R.dec,
  List.subscript (List.of (4, 5, 6, 8, 9, 13, 12, 11, 10))
);

export const getEncumbranceZoneTier = List.of (0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8).subscript;

export const getArmors = createMaybeSelector (
  getItemsState,
  getWiki,
  (maybeItems, wiki) => maybeItems.fmap (
    items => {
      const rawItems = items.elems ();

      const filteredItems = rawItems.filter (item => item.get ('gr') === 4);

      return Maybe.mapMaybe<Record<ItemInstance>, Record<Armor>> (
        item => getFullItem (items) (wiki.get ('itemTemplates')) (item.get ('id'))
          .fmap (
            fullItem => {
              const addPenaltiesMod = Maybe.elem (true) (fullItem.lookup ('addPenalties')) ? -1 : 0;

              return Record.ofMaybe<Armor> ({
                id: fullItem.get ('id'),
                name: fullItem.get ('name'),
                st: fullItem.lookup ('armorType')
                  .bind (getStabilityByArmorTypeId)
                  .fmap (R.add (fullItem.lookupWithDefault<'stabilityMod'> (0) ('stabilityMod'))),
                loss: fullItem.lookup ('loss'),
                pro: fullItem.lookup ('pro'),
                enc: fullItem.lookup ('enc'),
                mov: addPenaltiesMod + fullItem.lookupWithDefault<'movMod'> (0) ('movMod'),
                ini: addPenaltiesMod + fullItem.lookupWithDefault<'iniMod'> (0) ('iniMod'),
                weight: fullItem.lookup ('weight'),
                where: fullItem.lookup ('where'),
              });
            }
          )
      ) (filteredItems);
    }
  )
);

export const getArmorZones = createMaybeSelector (
  getEquipmentState,
  getWikiItemTemplates,
  (maybeBelongings, templates) => maybeBelongings.fmap (
    belongings => {
      const rawZoneArmors = belongings.get ('armorZones').elems ();

      const getZone = Maybe.bind_ (getFullItem (belongings.get ('items')) (templates));

      return rawZoneArmors.map (zoneArmor => {
        const headArmor = getZone (zoneArmor.lookup ('head'));
        const torsoArmor = getZone (zoneArmor.lookup ('torso'));
        const leftArmArmor = getZone (zoneArmor.lookup ('leftArm'));
        const rightArmArmor = getZone (zoneArmor.lookup ('rightArm'));
        const leftLegArmor = getZone (zoneArmor.lookup ('leftLeg'));
        const rightLegArmor = getZone (zoneArmor.lookup ('rightLeg'));

        const proTotal = getProtectionTotal (
          headArmor,
          leftArmArmor,
          leftLegArmor,
          rightArmArmor,
          rightLegArmor,
          torsoArmor
        );

        const weightTotal = getWeightTotal (
          headArmor,
          leftArmArmor,
          leftLegArmor,
          rightArmArmor,
          rightLegArmor,
          torsoArmor
        );

        const getPro = Maybe.bind_ (Record.lookup<ItemInstance, 'pro'> ('pro'));

        return Record.ofMaybe<ArmorZone> ({
          id: zoneArmor.get ('id'),
          name: zoneArmor.get ('name'),
          head: getPro (headArmor),
          leftArm: getPro (leftArmArmor),
          leftLeg: getPro (leftLegArmor),
          rightArm: getPro (rightArmArmor),
          rightLeg: getPro (rightLegArmor),
          torso: getPro (torsoArmor),
          enc: Maybe.fromMaybe (0) (getEncumbranceZoneTier (proTotal)),
          addPenalties: [1, 3, 5].includes (proTotal),
          weight: weightTotal,
        });
      });
    }
  )
);

export const getShieldsAndParryingWeapons = createMaybeSelector (
  getCurrentHeroPresent,
  getWiki,
  (maybeHero, wiki) => maybeHero.fmap (
    hero => {
      const items = hero.get ('belongings').get ('items');
      const rawItems = items.elems ();

      const filteredItems = rawItems.filter (
        item => item.get ('gr') === 1
          && (
            Maybe.elem ('CT_10') (item.lookup ('combatTechnique'))
            || Maybe.elem (true) (item.lookup ('isParryingWeapon'))
          )
      );

      return Maybe.mapMaybe<Record<ItemInstance>, Record<ShieldOrParryingWeapon>> (
        item => getFullItem (items) (wiki.get ('itemTemplates')) (item.get ('id'))
          .bind (
            fullItem => fullItem.lookup ('combatTechnique')
              .bind (
                id => OrderedMap.lookup<string, Record<CombatTechnique>>
                  (id)
                  (wiki.get ('combatTechniques'))
              )
              .fmap (
                wikiEntry => Record.ofMaybe<ShieldOrParryingWeapon> ({
                  id: fullItem.get ('id'),
                  name: fullItem.get ('name'),
                  stp: fullItem.lookup ('stp'),
                  bf: wikiEntry.get ('bf')
                    + fullItem.lookupWithDefault<'stabilityMod'> (0) ('stabilityMod'),
                  loss: fullItem.lookup ('loss'),
                  atMod: fullItem.lookup ('at'),
                  paMod: fullItem.lookup ('pa'),
                  weight: fullItem.lookup ('weight'),
                })
              )
          )
      ) (filteredItems);
    }
  )
);

function getProtectionTotal (
  head: Maybe<Record<ItemInstance>>,
  leftArm: Maybe<Record<ItemInstance>>,
  leftLeg: Maybe<Record<ItemInstance>>,
  rightArm: Maybe<Record<ItemInstance>>,
  rightLeg: Maybe<Record<ItemInstance>>,
  torso: Maybe<Record<ItemInstance>>
) {
  const getProtection = (maybeItem: Maybe<Record<ItemInstance>>) =>
    Maybe.fromMaybe (0) (maybeItem.bind (item => item.lookup ('pro')));

  const sum =
    List.of (
      getProtection (head) * 1,
      getProtection (torso) * 5,
      getProtection (leftArm) * 2,
      getProtection (rightArm) * 2,
      getProtection (leftLeg) * 2,
      getProtection (rightLeg) * 2
    )
      .sum ();

  return Math.ceil (sum / 14);
}

function getWeightTotal (
  head: Maybe<Record<ItemInstance>>,
  leftArm: Maybe<Record<ItemInstance>>,
  leftLeg: Maybe<Record<ItemInstance>>,
  rightArm: Maybe<Record<ItemInstance>>,
  rightLeg: Maybe<Record<ItemInstance>>,
  torso: Maybe<Record<ItemInstance>>
) {
  const getWeight = (maybeItem: Maybe<Record<ItemInstance>>) =>
    Maybe.fromMaybe (0) (maybeItem.bind (item => item.lookup ('weight')));

  const sum =
    List.of (
      getWeight (head) * 0.5,
      getWeight (torso) * 0.1,
      getWeight (leftArm) * 0.1,
      getWeight (rightArm) * 0.1,
      getWeight (leftLeg) * 0.1,
      getWeight (rightLeg) * 0.1
    )
      .sum ();

  return Math.floor (sum * 100) / 100;
}

function getPriceTotal (
  head: Maybe<Record<ItemInstance>>,
  leftArm: Maybe<Record<ItemInstance>>,
  leftLeg: Maybe<Record<ItemInstance>>,
  rightArm: Maybe<Record<ItemInstance>>,
  rightLeg: Maybe<Record<ItemInstance>>,
  torso: Maybe<Record<ItemInstance>>
) {
  const getPrice = (maybeItem: Maybe<Record<ItemInstance>>) =>
    Maybe.fromMaybe (0) (maybeItem.bind (item => item.lookup ('price')));

  const sum =
    List.of (
      getPrice (head) * 0.5,
      getPrice (torso) * 0.1,
      getPrice (leftArm) * 0.1,
      getPrice (rightArm) * 0.1,
      getPrice (leftLeg) * 0.1,
      getPrice (rightLeg) * 0.1
    )
      .sum ();

  return Math.floor (sum * 100) / 100;
}

export const getProtectionAndWeight = (
  zoneArmor: Record<ArmorZonesInstance>,
  getZoneArmor: (id: Maybe<string>) => Maybe<Record<ItemInstance>>
) => {
  const headArmor = getZoneArmor (zoneArmor.lookup ('head'));
  const torsoArmor = getZoneArmor (zoneArmor.lookup ('torso'));
  const leftArmArmor = getZoneArmor (zoneArmor.lookup ('leftArm'));
  const rightArmArmor = getZoneArmor (zoneArmor.lookup ('rightArm'));
  const leftLegArmor = getZoneArmor (zoneArmor.lookup ('leftLeg'));
  const rightLegArmor = getZoneArmor (zoneArmor.lookup ('rightLeg'));

  const getProtection = (maybeItem: Maybe<Record<ItemInstance>>) =>
    Maybe.fromMaybe (0) (maybeItem.bind (item => item.lookup ('pro')));

  const getWeight = (maybeItem: Maybe<Record<ItemInstance>>) =>
    Maybe.fromMaybe (0) (maybeItem.bind (item => item.lookup ('weight')));

  const protectionSum =
    List.of (
      getProtection (headArmor) * 1,
      getProtection (torsoArmor) * 5,
      getProtection (leftArmArmor) * 2,
      getProtection (rightArmArmor) * 2,
      getProtection (leftLegArmor) * 2,
      getProtection (rightLegArmor) * 2
    )
      .sum ();

  const weightSum =
    List.of (
      getWeight (headArmor) * 0.5,
      getWeight (torsoArmor) * 0.1,
      getWeight (leftArmArmor) * 0.1,
      getWeight (rightArmArmor) * 0.1,
      getWeight (leftLegArmor) * 0.1,
      getWeight (rightLegArmor) * 0.1
    )
      .sum ();

  return {
    pro: protectionSum,
    weight: weightSum,
  };
}
