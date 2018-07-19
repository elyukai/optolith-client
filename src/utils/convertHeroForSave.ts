import { AdventurePointsObject } from '../selectors/adventurePointsSelectors';
import * as Data from '../types/data.d';
import * as Raw from '../types/rawdata';
import { currentVersion } from '../utils/VersionUtils';
import { StringKeyObject } from './collectionUtils';
import { OrderedMap, OrderedMapValueElement, Record } from './dataUtils';
import { HeroStateMapKey } from './heroStateUtils';

const getAttributesForSave = (hero: Record<Data.HeroDependent>) =>
  ({
    values: hero.get('attributes').foldl<[string, number, number][]>(
      acc => e => [...acc, [e.get('id'), e.get('value'), e.get('mod')]],
      []
    ),
    ae: hero.get('energies').get('addedArcaneEnergyPoints'),
    kp: hero.get('energies').get('addedKarmaPoints'),
    lp: hero.get('energies').get('addedLifePoints'),
    permanentAE: hero.get('energies').get('permanentArcaneEnergyPoints').toObject(),
    permanentKP: hero.get('energies').get('permanentKarmaPoints').toObject(),
    permanentLP: hero.get('energies').get('permanentLifePoints').toObject()
  });

const getActivatablesForSave = (hero: Record<Data.HeroDependent>) =>
  hero.get('advantages')
    .union(hero.get('disadvantages'))
    .union(hero.get('specialAbilities'))
    .foldlWithKey<StringKeyObject<Data.ActiveObject[]>>(
      acc => id => obj => ({
        ...acc,
        [id]: obj.get('active').foldl<Data.ActiveObject[]>(
          accActive => e => [...accActive, e.toObject()],
          []
        ),
      }),
      {}
    );

const getValuesForSave = <T extends HeroStateMapKey>(
  sliceKey: T,
  testFn: (obj: OrderedMapValueElement<Data.HeroDependent[T]>) => boolean,
) =>
  (hero: Record<Data.HeroDependent>) =>
    (hero.get(sliceKey) as OrderedMap<string, Data.ExtendedSkillDependent>)
      .foldlWithKey<StringKeyObject<number>>(
        acc => id => obj => {
          if (testFn(obj as OrderedMapValueElement<Data.HeroDependent[T]>)) {
            return {
              ...acc,
              [id]: obj.get('value'),
            };
          }

          return acc;
        },
        {}
      );

const getSkillsForSave = getValuesForSave(
  'skills',
  obj => obj.get('value') > 0
);

const getCombatTechniquesForSave = getValuesForSave(
  'combatTechniques',
  obj => obj.get('value') > 6,
);

const getSpellsForSave = getValuesForSave(
  'spells',
  obj => obj.get('active'),
);

const getCantripsForSave =
  (hero: Record<Data.HeroDependent>) => [...hero.get('cantrips')];

const getLiturgicalChantsForSave = getValuesForSave(
  'liturgicalChants',
  obj => obj.get('active'),
);

const getBlessingsForSave =
  (hero: Record<Data.HeroDependent>) => [...hero.get('blessings')];

const getBelongingsForSave = (hero: Record<Data.HeroDependent>) =>
  ({
    items: hero.get('belongings').get('items').toJSObjectBy(x => x.toObject()),
    armorZones: hero.get('belongings').get('armorZones').toJSObjectBy(x => x.toObject()),
    purse: hero.get('belongings').get('purse').toObject(),
  });

const getPetsForSave = (hero: Record<Data.HeroDependent>) =>
  hero.get('pets').toJSObjectBy(x => x.toObject());

export const convertHeroForSave = (
  id: string,
  hero: Record<Data.HeroDependent>,
  adventurePoints: Record<AdventurePointsObject>,
): Raw.RawHero => {
  const {
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
    rules
  } = hero.toObject();

  const obj: Raw.RawHero = {
    clientVersion: currentVersion,
    dateCreated: dateCreated.toJSON(),
    dateModified: dateModified.toJSON(),
    id,
    phase,
    name,
    avatar,
    ap: {
      total: adventurePoints.get('total'),
      spent: adventurePoints.get('spent'),
    },
    el: experienceLevel,
    r: race,
    rv: raceVariant,
    c: culture,
    p: profession,
    professionName: profession === 'P_0' ? professionName : undefined,
    pv: professionVariant,
    sex,
    pers: personalData.toObject(),
    attr: getAttributesForSave(hero),
    activatable: getActivatablesForSave(hero),
    talents: getSkillsForSave(hero),
    ct: getCombatTechniquesForSave(hero),
    spells: getSpellsForSave(hero),
    cantrips: getCantripsForSave(hero),
    liturgies: getLiturgicalChantsForSave(hero),
    blessings: getBlessingsForSave(hero),
    belongings: getBelongingsForSave(hero),
    rules: {
      ...rules.toObject(),
      enabledRuleBooks: [...rules.get('enabledRuleBooks')]
    },
    pets: getPetsForSave(hero)
  };

  return obj;
};
