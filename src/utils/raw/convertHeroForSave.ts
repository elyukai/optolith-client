import { pipe } from 'ramda';
import * as Data from '../../types/data';
import * as Raw from '../../types/rawdata';
import { PrimaryAttributeDamageThreshold, WikiAll } from '../../types/wiki';
import { ActivatableDependentG } from '../activeEntries/activatableDependent';
import { ActivatableSkillDependentG } from '../activeEntries/activatableSkillDependent';
import { AttributeDependentG } from '../activeEntries/attributeDependent';
import { getAPObject } from '../adventurePoints/adventurePointsSumUtils';
import { HeroStateMapKey } from '../heroStateUtils';
import { ifElse } from '../ifElse';
import { PrimaryAttributeDamageThresholdG } from '../ItemUtils';
import { gt } from '../mathUtils';
import { Functn } from '../structures/Function';
import { List } from '../structures/List';
import { fmap, maybeToUndefined } from '../structures/Maybe';
import { foldl, foldlWithKey, OrderedMap, OrderedMapValueElement, toObjectWith, union } from '../structures/OrderedMap';
import { toArray } from '../structures/OrderedSet';
import { Record, StringKeyObject, toObject } from '../structures/Record';
import { UndoState } from '../undo';
import { BelongingsG, EnergiesG, HeroG } from './heroData';
import { currentVersion } from './VersionUtils';

const {
  attributes,
  attributeAdjustmentSelected,
  energies,
  advantages,
  disadvantages,
  specialAbilities,
  skills,
  combatTechniques,
  spells,
  cantrips,
  liturgicalChants,
  blessings,
  belongings,
} = HeroG

const { id, value } = AttributeDependentG
const { active } = ActivatableSkillDependentG
const { active: activeList } = ActivatableDependentG
const { items, armorZones, purse } = BelongingsG

const {
  addedArcaneEnergyPoints,
  addedKarmaPoints,
  addedLifePoints,
  permanentArcaneEnergyPoints,
  permanentKarmaPoints,
  permanentLifePoints,
} = EnergiesG

const getAttributesForSave = (hero: Record<Data.HeroDependent>): Raw.RawHero['attr'] =>
  ({
    values: foldl<Record<Data.AttributeDependent>, { id: string; value: number }[]>
      (acc => e => [...acc, { id: id (e), value: value (e) }])
      ([])
      (attributes (hero)),
    attributeAdjustmentSelected: attributeAdjustmentSelected (hero),
    ae: addedArcaneEnergyPoints (energies (hero)),
    kp: addedKarmaPoints (energies (hero)),
    lp: addedLifePoints (energies (hero)),
    permanentAE: toObject (permanentArcaneEnergyPoints (energies (hero))),
    permanentKP: toObject (permanentKarmaPoints (energies (hero))),
    permanentLP: toObject (permanentLifePoints (energies (hero))),
  })

const getActivatablesForSave = (hero: Record<Data.HeroDependent>) =>
  foldlWithKey<string, Record<Data.ActivatableDependent>, StringKeyObject<Data.ActiveObject[]>>
    (acc => key => obj => ({
      ...acc,
      [key]: List.foldl<Record<Data.ActiveObject>, Data.ActiveObject[]>
        (accActive => e => [...accActive, toObject (e)])
        ([])
        (activeList (obj)),
    }))
    ({})
    (union (advantages (hero)) (union (disadvantages (hero)) (specialAbilities (hero))))

const getValuesForSave = <T extends Data.HeroDependent[HeroStateMapKey]>(
  sliceGetter: (hero: Record<Data.HeroDependent>) => T,
  testFn: (obj: OrderedMapValueElement<T>) => boolean
) =>
  (hero: Record<Data.HeroDependent>) =>
    foldlWithKey<string, Data.ExtendedSkillDependent, StringKeyObject<number>>
      (acc => key => obj => {
        if (testFn (obj as OrderedMapValueElement<T>)) {
          return {
            ...acc,
            [key]: value (obj),
          };
        }

        return acc;
      })
      ({})
      (sliceGetter (hero) as OrderedMap<string, Data.ExtendedSkillDependent>)

const getSkillsForSave = getValuesForSave (skills, pipe (value, gt (0)))

const getCombatTechniquesForSave = getValuesForSave (combatTechniques, pipe (value, gt (6)))

const getSpellsForSave = getValuesForSave (spells, active)

const getCantripsForSave = pipe (cantrips, toArray)

const getLiturgicalChantsForSave = getValuesForSave (liturgicalChants, active)

const getBlessingsForSave = pipe (blessings, toArray)

const { primary, threshold } = PrimaryAttributeDamageThresholdG

const getBelongingsForSave = (hero: Record<Data.HeroDependent>) =>
  ({
    items: toObjectWith<Record<Data.ItemInstance>, Raw.RawCustomItem>
      (obj => {
        const {
          improvisedWeaponGroup,
          damageBonus,
          range,
          ...other
        } = toObject (obj)

        return {
          ...other,
          imp: maybeToUndefined (improvisedWeaponGroup),
          primaryThreshold:
            fmap<Record<PrimaryAttributeDamageThreshold>, Raw.RawPrimaryAttributeDamageThreshold>
              (bonus => ({
                primary: maybeToUndefined (primary (bonus)) ,
                threshold:
                  ifElse<number | List<number>, List<number>, number | ReadonlyArray<number>>
                    (List.isList)
                    (List.toArray)
                    (Functn.id)
                    (threshold (bonus)),
              })),
          range: range ? range.toArray () as [number, number, number] : undefined,
        }
      })
      (items (belongings (hero))),
    armorZones:
      toObjectWith<Record<Data.ArmorZonesInstance>, Data.ArmorZonesInstance>
        (toObject)
        (armorZones (belongings (hero))),
    purse: toObject (purse (belongings (hero))),
  })

const getPetsForSave = (hero: Record<Data.HeroDependent>) =>
  hero.get ('pets').toKeyValueObjectWith (x => x.toObject ());

export const convertHeroForSave = (wiki: Record<WikiAll>) =>
  (locale: Record<Data.UIMessages>) =>
    (users: OrderedMap<string, Data.User>) =>
      (hero: Data.Hero): Raw.RawHero => {
        const {
          id,
          dateCreated,
          dateModified,
          phase,
          name,
          avatar,
          experienceLevel,
          race,
          raceVariant,
          culture,
          profession,
          professionName,
          professionVariant,
          sex,
          personalData,
          rules,
        } = hero.toObject ();

        const adventurePoints = getAPObject (wiki) (locale) (hero);

        const maybeUser = hero.lookup ('player')
          .bind (userId => OrderedMap.lookup<string, Data.User> (userId) (users));

        const obj: Raw.RawHero = {
          clientVersion: currentVersion,
          dateCreated: dateCreated.toJSON (),
          dateModified: dateModified.toJSON (),
          id,
          phase,
          player: Maybe.isJust (maybeUser) ? Maybe.fromJust (maybeUser) : undefined,
          name,
          avatar,
          ap: {
            total: adventurePoints.get ('total'),
            spent: adventurePoints.get ('spent'),
          },
          el: experienceLevel,
          r: race,
          rv: raceVariant,
          c: culture,
          p: profession,
          professionName: profession === 'P_0' ? professionName : undefined,
          pv: professionVariant,
          sex,
          pers: personalData.toObject (),
          attr: getAttributesForSave (hero),
          activatable: getActivatablesForSave (hero),
          talents: getSkillsForSave (hero),
          ct: getCombatTechniquesForSave (hero),
          spells: getSpellsForSave (hero),
          cantrips: getCantripsForSave (hero),
          liturgies: getLiturgicalChantsForSave (hero),
          blessings: getBlessingsForSave (hero),
          belongings: getBelongingsForSave (hero),
          rules: {
            ...rules.toObject (),
            enabledRuleBooks: [...rules.get ('enabledRuleBooks')],
          },
          pets: getPetsForSave (hero),
        };

        return obj;
      };

export const convertHeroesForSave = (wiki: Record<WikiAll>) =>
  (locale: Record<Data.UIMessages>) =>
    (users: OrderedMap<string, Data.User>) =>
      (heroes: OrderedMap<string, UndoState<Data.Hero>>) =>
        heroes.elems ().map<Raw.RawHero> (
          R.pipe (
            state => state.present,
            hero => convertHeroForSave (wiki) (locale) (users) (hero)
          )
        );
