import { Categories } from '../constants/Categories';
import * as Data from '../types/data.d';
import * as Raw from '../types/rawdata.d';
import { getCategoryById } from './IDUtils';
import { currentVersion } from './VersionUtils';
import { StringKeyObject, convertMapToArray, convertObjectToMap, setM } from './collectionUtils';
import * as CreateDependencyObjectUtils from './createEntryUtils';
import { exists } from './exists';

const getUnchangedProperties = (id: string, hero: Raw.RawHero) => {
  const {
    clientVersion,
    name,
    avatar,
    ap,
    r,
    rv,
    c,
    p,
    pv,
    professionName,
    sex,
    phase,
    el,
    pers,
  } = hero;

  return {
    id,
    clientVersion,
    phase,
    name,
    avatar,
    adventurePoints: ap,
    race: r,
    raceVariant: rv,
    culture: c,
    profession: p,
    professionName,
    professionVariant: pv,
    sex,
    experienceLevel: el,
    personalData: pers,
  };
};

const getPlayer = (hero: Raw.RawHero) => {
  const { player } = hero;
  return {
    player: player && player.id,
  };
};

const getDates = (hero: Raw.RawHero) => {
  const { dateCreated, dateModified } = hero;
  return {
    dateCreated: new Date(dateCreated),
    dateModified: new Date(dateModified),
  };
};

interface ActivatableMaps {
  advantages: ReadonlyMap<string, Data.ActivatableDependent>;
  disadvantages: ReadonlyMap<string, Data.ActivatableDependent>;
  specialAbilities: ReadonlyMap<string, Data.ActivatableDependent>;
}

const getActivatables = (hero: Raw.RawHero): ActivatableMaps => {
  const objectsInMap = getActivatableDependent(hero.activatable);

  return convertMapToArray(objectsInMap).reduce<ActivatableMaps>((acc, e) => {
    const [id, obj] = e;
    const category = getCategoryById(id);

    if (category === Categories.ADVANTAGES) {
      return {
        ...acc,
        advantages: setM(id, obj)(acc.advantages),
      };
    }
    else if (category === Categories.DISADVANTAGES) {
      return {
        ...acc,
        disadvantages: setM(id, obj)(acc.disadvantages),
      };
    }
    else if (category === Categories.SPECIAL_ABILITIES) {
      return {
        ...acc,
        specialAbilities: setM(id, obj)(acc.specialAbilities),
      };
    }

    return acc;
  }, {
    advantages: new Map(),
    disadvantages: new Map(),
    specialAbilities: new Map(),
  });
};

const getAttributes = (
  hero: Raw.RawHero
): ReadonlyMap<string, Data.AttributeDependent> => {
  return new Map(
    hero.attr.values.map<[string, Data.AttributeDependent]>(
      ([id, value, mod]) => {
        return [
          id,
          {
            id,
            value,
            mod,
            dependencies: [],
          }
        ];
      }
    )
  );
};

const getEnergies = (hero: Raw.RawHero): Data.Energies => {
  const {
    attr: {
      ae: addedArcaneEnergyPoints,
      kp: addedKarmaPoints,
      lp: addedLifePoints,
      permanentAE,
      permanentKP,
      permanentLP,
    },
  } = hero;

  return {
    addedArcaneEnergyPoints,
    addedKarmaPoints,
    addedLifePoints,
    permanentArcaneEnergyPoints: permanentAE,
    permanentKarmaPoints: permanentKP,
    permanentLifePoints: permanentLP || { lost: 0 }
  };
};

const getSkills = (
  hero: Raw.RawHero
): ReadonlyMap<string, Data.SkillDependent> => {
  return getDependentSkills(hero.talents);
};

const getCombatTechniques = (
  hero: Raw.RawHero
): ReadonlyMap<string, Data.SkillDependent> => {
  return getDependentSkills(hero.ct);
};

const getSpells = (
  hero: Raw.RawHero
): ReadonlyMap<string, Data.ActivatableSkillDependent> => {
  return getActivatableDependentSkills(hero.spells);
};

const getCantrips = (
  hero: Raw.RawHero
): ReadonlySet<string> => {
  return new Set(hero.cantrips);
};

const getLiturgicalChants = (
  hero: Raw.RawHero
): ReadonlyMap<string, Data.ActivatableSkillDependent> => {
  return getActivatableDependentSkills(hero.liturgies);
};

const getBlessings = (
  hero: Raw.RawHero
): ReadonlySet<string> => {
  return new Set(hero.blessings);
};

const getBelongings = (hero: Raw.RawHero): Data.Belongings => {
  const {
    items,
    armorZones,
    purse,
  } = hero.belongings;

  return {
    items: convertObjectToMap(items),
    armorZones: convertObjectToMap(armorZones),
    purse,
  };
};

const getRules = (hero: Raw.RawHero): Data.Rules => {
  return {
    ...hero.rules,
    enabledRuleBooks: new Set(hero.rules.enabledRuleBooks),
  };
};

const getPets = (hero: Raw.RawHero): ReadonlyMap<string, Data.PetInstance> => {
  return exists(hero.pets) ? convertObjectToMap(hero.pets) : new Map();
}

const getActivatableDependent = (
  source: StringKeyObject<Data.ActiveObject[]>
): ReadonlyMap<string, Data.ActivatableDependent> => {
  return new Map(
    Object.entries(source).map<[string, Data.ActivatableDependent]>(
      ([id, active]) => {
        return [
          id,
          CreateDependencyObjectUtils.createActivatableDependent(id, {
            active
          }),
        ];
      }
    )
  );
};

const getDependentSkills = (
  source: StringKeyObject<number>
): ReadonlyMap<string, Data.SkillDependent> => {
  return new Map(
    Object.entries(source).map<[string, Data.SkillDependent]>(
      ([id, value]) => {
        return [
          id,
          CreateDependencyObjectUtils.createDependentSkill(id, { value }),
        ];
      }
    )
  );
};

const getActivatableDependentSkills = (
  source: StringKeyObject<number>
): ReadonlyMap<string, Data.ActivatableSkillDependent> => {
  return new Map(
    Object.entries(source).map<[string, Data.ActivatableSkillDependent]>(
      ([id, value]) => {
        return [
          id,
          CreateDependencyObjectUtils.createActivatableDependentSkill(id, {
            active: true,
            value
          }),
        ];
      }
    )
  );
};

export const getHeroInstance = (
  id: string,
  hero: Raw.RawHero,
): Data.HeroDependent => {
  return {
    ...getUnchangedProperties(id, hero),
    ...getPlayer(hero),
    ...getDates(hero),
    ...getActivatables(hero),
    attributes: getAttributes(hero),
    energies: getEnergies(hero),
    skills: getSkills(hero),
    combatTechniques: getCombatTechniques(hero),
    spells: getSpells(hero),
    cantrips: getCantrips(hero),
    liturgicalChants: getLiturgicalChants(hero),
    blessings: getBlessings(hero),
    belongings: getBelongings(hero),
    rules: getRules(hero),
    pets: getPets(hero),
    combatStyleDependencies: [],
    magicalStyleDependencies: [],
    blessedStyleDependencies: [],
  };
};

export const getInitialHeroObject = (
  id: string,
  name: string,
  sex: 'm' | 'f',
  experienceLevel: string,
  totalAp: number,
  enableAllRuleBooks: boolean,
  enabledRuleBooks: Set<string>,
): Data.HeroDependent => {
  return {
    id,
    clientVersion: currentVersion,
    phase: 1,
    name,
    adventurePoints: {
      total: totalAp,
      spent: 0,
    },
    sex,
    experienceLevel,
    personalData: {},
    rules: {
      higherParadeValues: 0,
      attributeValueLimit: false,
      enableAllRuleBooks,
      enabledRuleBooks,
      enableLanguageSpecializations: false,
    },
    dateCreated: new Date(),
    dateModified: new Date(),
    advantages: new Map(),
    disadvantages: new Map(),
    specialAbilities: new Map(),
    attributes: new Map(),
    energies: {
      addedArcaneEnergyPoints: 0,
      addedKarmaPoints: 0,
      addedLifePoints: 0,
      permanentArcaneEnergyPoints: {
        lost: 0,
        redeemed: 0,
      },
      permanentKarmaPoints: {
        lost: 0,
        redeemed: 0,
      },
      permanentLifePoints: {
        lost: 0
      }
    },
    skills: new Map(),
    combatTechniques: new Map(),
    spells: new Map(),
    cantrips: new Set(),
    liturgicalChants: new Map(),
    blessings: new Set(),
    belongings: {
      items: new Map(),
      armorZones: new Map(),
      purse: {
        d: '',
        s: '',
        h: '',
        k: '',
      },
    },
    pets: new Map(),
    combatStyleDependencies: [],
    magicalStyleDependencies: [],
    blessedStyleDependencies: [],
  };
};
