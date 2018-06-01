import { AdventurePointsObject } from '../selectors/adventurePointsSelectors';
import * as Data from '../types/data.d';
import { currentVersion } from '../utils/VersionUtils';
import { MapValueElement, StringKeyObject, convertMapToArray, convertMapToObject, mergeMaps } from './collectionUtils';
import { HeroStateMapKey } from './heroStateUtils';

const getAttributesForSave = (hero: Data.HeroDependent) => {
  const {
    addedArcaneEnergyPoints: ae,
    addedKarmaPoints: kp,
    addedLifePoints: lp,
    permanentArcaneEnergyPoints: permanentAE,
    permanentKarmaPoints: permanentKP
  } = hero.energies;

  return {
    values: [...hero.attributes.values()].map<[string, number, number]>(e => {
      return [e.id, e.value, e.mod];
    }),
    ae,
    kp,
    lp,
    permanentAE,
    permanentKP
  };
};

const getActivatablesForSave = (hero: Data.HeroDependent) => {
  return convertMapToArray(mergeMaps(
    hero.advantages,
    hero.disadvantages,
    hero.specialAbilities,
  ))
    .reduce<StringKeyObject<Data.ActiveObject[]>>((acc, [id, obj]) => {
      return {
        ...acc,
        [id]: obj.active,
      };
    }, {});
};

const getValuesForSave = <T extends HeroStateMapKey>(
  sliceKey: T,
  testFn: (obj: MapValueElement<Data.HeroDependent[T]>) => boolean,
) => {
  return (hero: Data.HeroDependent) => {
    return convertMapToArray(
      hero[sliceKey] as ReadonlyMap<string, Data.ExtendedSkillDependent>
    )
      .reduce<StringKeyObject<number>>((acc, [id, obj]) => {
        if (testFn(obj as MapValueElement<Data.HeroDependent[T]>)) {
          return {
            ...acc,
            [id]: obj.value,
          };
        }

        return acc;
      }, {});
  };
};

const getSkillsForSave = getValuesForSave(
  'skills',
  obj => obj.value > 0
);

const getCombatTechniquesForSave = getValuesForSave(
  'combatTechniques',
  obj => obj.value > 6,
);

const getSpellsForSave = getValuesForSave(
  'spells',
  obj => obj.active,
);

const getCantripsForSave = (hero: Data.HeroDependent) => [...hero.cantrips];

const getLiturgicalChantsForSave = getValuesForSave(
  'liturgicalChants',
  obj => obj.active,
);

const getBlessingsForSave = (hero: Data.HeroDependent) => [...hero.blessings];

const getBelongingsForSave = (hero: Data.HeroDependent) => {
  return {
    items: convertMapToObject(hero.belongings.items),
    armorZones: convertMapToObject(hero.belongings.armorZones),
    purse: hero.belongings.purse,
  };
};

const getPetsForSave = (hero: Data.HeroDependent) => {
  return convertMapToObject(hero.pets);
};

export const convertHeroForSave = (
  id: string,
  hero: Data.HeroDependent,
  adventurePoints: AdventurePointsObject,
): Data.HeroForSave => {
  const {
    dateCreated,
    dateModified,
    phase,
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
  } = hero;

  const obj: Data.HeroForSave = {
    clientVersion: currentVersion,
    dateCreated,
    dateModified,
    id,
    phase,
    name: name!,
    avatar,
    ap: {
      total: adventurePoints.total,
      spent: adventurePoints.spent,
    },
    el: experienceLevel,
    r: race,
    rv: raceVariant,
    c: culture,
    p: profession,
    professionName: profession === 'P_0' ? professionName : undefined,
    pv: professionVariant,
    sex: sex!,
    pers: personalData,
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
      ...hero.rules,
      enabledRuleBooks: [...hero.rules.enabledRuleBooks]
    },
    pets: getPetsForSave(hero)
  };

  return obj;
};
