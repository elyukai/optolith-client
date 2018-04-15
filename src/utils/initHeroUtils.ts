import { Categories } from '../constants/Categories';
import * as Data from '../types/data.d';
import * as Raw from '../types/rawdata.d';
import { convertObjectToMap } from './ListUtils';
import { getCategoryById } from './IDUtils';
import { currentVersion } from './VersionUtils';

export function getHeroInstance(id: string, hero: Raw.RawHero): Data.HeroDependent {
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
  };
}

function getUnchangedProperties(id: string, hero: Raw.RawHero) {
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
}

function getPlayer(hero: Raw.RawHero) {
  const { player } = hero;
  return {
    player: player && player.id,
  };
}

function getDates(hero: Raw.RawHero) {
  const { dateCreated, dateModified } = hero;
  return {
    dateCreated: new Date(dateCreated),
    dateModified: new Date(dateModified),
  };
}

interface ActivatableMaps {
  advantages: Map<string, Data.ActivatableDependent>;
  disadvantages: Map<string, Data.ActivatableDependent>;
  specialAbilities: Map<string, Data.ActivatableDependent>;
}

function getActivatables(hero: Raw.RawHero): ActivatableMaps {
  const objectsInMap = getActivatableDependent(hero.activatable);

  const stateObject: ActivatableMaps = {
    advantages: new Map(),
    disadvantages: new Map(),
    specialAbilities: new Map(),
  };

  for (const [id, obj] of objectsInMap) {
    const category = getCategoryById(id);

    if (category === Categories.ADVANTAGES) {
      stateObject.advantages.set(id, obj);
    }
    else if (category === Categories.DISADVANTAGES) {
      stateObject.disadvantages.set(id, obj);
    }
    else if (category === Categories.SPECIAL_ABILITIES) {
      stateObject.specialAbilities.set(id, obj);
    }
  }

  return stateObject;
}

function getAttributes(hero: Raw.RawHero): Map<string, Data.AttributeDependent> {
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
}

function getEnergies(hero: Raw.RawHero): Data.Energies {
  const {
    attr: {
      ae,
      kp,
      lp,
      permanentAE,
      permanentKP,
      permanentLP,
    },
  } = hero;

  return {
    ae,
    kp,
    lp,
    permanentArcaneEnergyPoints: permanentAE,
    permanentKarmaPoints: permanentKP,
    permanentLifePoints: permanentLP || { lost: 0 }
  };
}

function getSkills(hero: Raw.RawHero): Map<string, Data.SkillDependent> {
  return getDependentSkills(hero.talents);
}

function getCombatTechniques(hero: Raw.RawHero): Map<string, Data.SkillDependent> {
  return getDependentSkills(hero.ct);
}

function getSpells(hero: Raw.RawHero): Map<string, Data.ActivatableSkillDependent> {
  return getActivatableDependentSkills(hero.spells);
}

function getCantrips(hero: Raw.RawHero): Set<string> {
  return new Set(hero.cantrips);
}

function getLiturgicalChants(hero: Raw.RawHero): Map<string, Data.ActivatableSkillDependent> {
  return getActivatableDependentSkills(hero.liturgies);
}

function getBlessings(hero: Raw.RawHero): Set<string> {
  return new Set(hero.blessings);
}

function getBelongings(hero: Raw.RawHero): Data.Belongings {
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
}

function getRules(hero: Raw.RawHero): Data.Rules {
  return {
    ...hero.rules,
    enabledRuleBooks: new Set(hero.rules.enabledRuleBooks),
  };
}

function getPets(hero: Raw.RawHero): Map<string, Data.PetInstance> {
  return typeof hero.pets === 'object' ? convertObjectToMap(hero.pets) : new Map();
}

function getActivatableDependent(source: Data.ToListById<Data.ActiveObject[]>): Map<string, Data.ActivatableDependent> {
  return new Map(
    Object.entries(source).map<[string, Data.ActivatableDependent]>(
      ([id, value]) => {
        return [
          id,
          createActivatableDependent(id, value),
        ];
      }
    )
  );
}

function getDependentSkills(source: Data.ToListById<number>): Map<string, Data.SkillDependent> {
  return new Map(
    Object.entries(source).map<[string, Data.SkillDependent]>(
      ([id, value]) => {
        return [
          id,
          createDependentSkill(id, value),
        ];
      }
    )
  );
}

function getActivatableDependentSkills(source: Data.ToListById<number>): Map<string, Data.ActivatableSkillDependent> {
  return new Map(
    Object.entries(source).map<[string, Data.ActivatableSkillDependent]>(
      ([id, value]) => {
        return [
          id,
          createActivatableDependentSkill(id, value, true),
        ];
      }
    )
  );
}

export function createAttributeDependent(
  id: string,
  value = 8,
  mod = 0,
  dependencies: Data.AttributeInstanceDependency[] = [],
): Data.AttributeDependent {
  return {
    id,
    value,
    mod,
    dependencies,
  };
}

export function createActivatableDependent(
  id: string,
  active: Data.ActiveObject[] = [],
  dependencies: Data.ActivatableInstanceDependency[] = [],
): Data.ActivatableDependent {
  return {
    id,
    active,
    dependencies,
  };
}

export function createDependentSkill(
  id: string,
  value = 0,
  dependencies: Data.TalentInstanceDependency[] = [],
): Data.SkillDependent {
  return {
    id,
    value,
    dependencies,
  };
}

export function createActivatableDependentSkill(
  id: string,
  value = 0,
  active = false,
  dependencies: Data.SpellInstanceDependency[] = [],
): Data.ActivatableSkillDependent {
  return {
    id,
    value,
    active,
    dependencies,
  };
}

export function getInitialHeroObject(
  id: string,
  name: string,
  sex: 'm' | 'f',
  experienceLevel: string,
  totalAp: number,
  enableAllRuleBooks: boolean,
  enabledRuleBooks: Set<string>,
): Data.HeroDependent {
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
      ae: 0,
      kp: 0,
      lp: 0,
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
  };
}
