import * as Data from '../types/data.d';
import { DependentInstancesState } from './dependentInstances';

export function dependentInstancesClear(state: DependentInstancesState): DependentInstancesState {
  return {
    ...state,
    attributes: new Map([...state.attributes].map(([id, entry]): [string, Data.AttributeInstance] => {
      return [id, {...entry, dependencies: [], value: 8, mod: 0}];
    })),
    combatTechniques: new Map([...state.combatTechniques].map(([id, entry]): [string, Data.CombatTechniqueInstance] => {
      return [id, {...entry, dependencies: [], value: 6}];
    })),
    liturgies: new Map([...state.liturgies].map(([id, entry]): [string, Data.LiturgyInstance] => {
      return [id, {...entry, dependencies: [], value: 0, active: false}];
    })),
    spells: new Map([...state.spells].map(([id, entry]): [string, Data.SpellInstance] => {
      return [id, {...entry, dependencies: [], value: 0, active: false}];
    })),
    blessings: new Map([...state.blessings].map(([id, entry]): [string, Data.BlessingInstance] => {
      return [id, {...entry, dependencies: [], active: false}];
    })),
    cantrips: new Map([...state.cantrips].map(([id, entry]): [string, Data.CantripInstance] => {
      return [id, {...entry, dependencies: [], active: false}];
    })),
    talents: new Map([...state.talents].map(([id, entry]): [string, Data.TalentInstance] => {
      return [id, {...entry, dependencies: [], value: 0}];
    })),
    advantages: new Map([...state.advantages].map(([id, entry]): [string, Data.AdvantageInstance] => {
      return [id, {...entry, dependencies: [], active: []}];
    })),
    disadvantages: new Map([...state.disadvantages].map(([id, entry]): [string, Data.DisadvantageInstance] => {
      return [id, {...entry, dependencies: [], active: []}];
    })),
    specialAbilities: new Map([...state.specialAbilities].map(([id, entry]): [string, Data.SpecialAbilityInstance] => {
      return [id, {...entry, dependencies: [], active: []}];
    }))
  };
}
