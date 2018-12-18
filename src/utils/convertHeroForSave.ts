import * as R from 'ramda';
import * as Data from '../types/data';
import * as Raw from '../types/rawdata';
import { WikiAll } from '../types/wiki';
import { getAPObject } from './adventurePoints/adventurePointsSumUtils';
import { List, Maybe, OrderedMap, OrderedMapValueElement, Record, StringKeyObject } from './dataUtils';
import { HeroStateMapKey } from './heroStateUtils';
import { UndoState } from './undo';
import { currentVersion } from './VersionUtils';

const getAttributesForSave = (hero: Record<Data.HeroDependent>): Raw.RawHero['attr'] =>
  ({
    values: hero.get ('attributes').foldl<{ id: string; value: number }[]> (
      acc => e => [...acc, { id: e.get ('id'), value: e.get ('value') }]
    ) ([]),
    attributeAdjustmentSelected: hero .get ('attributeAdjustmentSelected'),
    ae: hero.get ('energies').get ('addedArcaneEnergyPoints'),
    kp: hero.get ('energies').get ('addedKarmaPoints'),
    lp: hero.get ('energies').get ('addedLifePoints'),
    permanentAE: hero.get ('energies').get ('permanentArcaneEnergyPoints').toObject (),
    permanentKP: hero.get ('energies').get ('permanentKarmaPoints').toObject (),
    permanentLP: hero.get ('energies').get ('permanentLifePoints').toObject (),
  });

const getActivatablesForSave = (hero: Record<Data.HeroDependent>) =>
  hero.get ('advantages')
    .union (hero.get ('disadvantages'))
    .union (hero.get ('specialAbilities'))
    .foldlWithKey<StringKeyObject<Data.ActiveObject[]>> (
      acc => id => obj => ({
        ...acc,
        [id]: obj.get ('active').foldl<Data.ActiveObject[]> (
          accActive => e => [...accActive, e.toObject ()]
        ) ([]),
      })
    ) ({});

const getValuesForSave = <T extends HeroStateMapKey>(
  sliceKey: T,
  testFn: (obj: OrderedMapValueElement<Data.HeroDependent[T]>) => boolean
) =>
  (hero: Record<Data.HeroDependent>) =>
    (hero.get (sliceKey) as OrderedMap<string, Data.ExtendedSkillDependent>)
      .foldlWithKey<StringKeyObject<number>> (
        acc => id => obj => {
          if (testFn (obj as OrderedMapValueElement<Data.HeroDependent[T]>)) {
            return {
              ...acc,
              [id]: obj.get ('value'),
            };
          }

          return acc;
        }
      ) ({});

const getSkillsForSave = getValuesForSave (
  'skills',
  obj => obj.get ('value') > 0
);

const getCombatTechniquesForSave = getValuesForSave (
  'combatTechniques',
  obj => obj.get ('value') > 6
);

const getSpellsForSave = getValuesForSave (
  'spells',
  obj => obj.get ('active')
);

const getCantripsForSave =
  (hero: Record<Data.HeroDependent>) => [...hero.get ('cantrips')];

const getLiturgicalChantsForSave = getValuesForSave (
  'liturgicalChants',
  obj => obj.get ('active')
);

const getBlessingsForSave =
  (hero: Record<Data.HeroDependent>) => [...hero.get ('blessings')];

const getBelongingsForSave = (hero: Record<Data.HeroDependent>) =>
  ({
    items: hero.get ('belongings').get ('items')
      .toKeyValueObjectWith<Raw.RawCustomItem> (
        obj => {
          const {
            improvisedWeaponGroup,
            damageBonus,
            range,
            ...other
          } = obj.toObject ();

          return {
            ...other,
            imp: improvisedWeaponGroup,
            primaryThreshold: damageBonus && {
              ...damageBonus.toObject (),
              threshold: damageBonus.get ('threshold') instanceof List
                ? (damageBonus.get ('threshold') as List<number>).toArray ()
                : (damageBonus.get ('threshold') as number),
            },
            range: range ? range.toArray () as [number, number, number] : undefined,
          };
        }
      ),
    armorZones: hero.get ('belongings').get ('armorZones')
      .toKeyValueObjectWith (x => x.toObject ()),
    purse: hero.get ('belongings').get ('purse').toObject (),
  });

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
