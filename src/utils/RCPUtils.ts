import { DependentInstancesState } from '../reducers/dependentInstances';
import { get } from '../selectors/dependentInstancesSelectors';
import { CantripsSelection, CombatTechniquesSecondSelection, CombatTechniquesSelection, CursesSelection, LanguagesScriptsSelection, ProfessionInstance, ProfessionSelection, ProfessionSelectionIds, ProfessionVariantInstance, RaceInstance, SkillsSelection, SpecialisationSelection } from '../types/data.d';
import { Race, RaceVariant } from '../types/wiki';
import { dice } from './dice';
import { multiplyString } from './NumberUtils';

/**
 * Returns the AP cost difference between the given Races/Professions/Profession Variants. If you have to pay more, the returned number is positive and vice versa.
 * @param state All entries.
 * @param prevId The id of the previous RCP instance.
 * @param nextId The id of the next RCP instance.
 */
export function getDiffCost(state: DependentInstancesState, prevId?: string, nextId?: string) {
  const prev = prevId ? (get(state, prevId) as ProfessionInstance | ProfessionVariantInstance | RaceInstance).ap : 0;
  const next = nextId ? (get(state, nextId) as ProfessionInstance | ProfessionVariantInstance | RaceInstance).ap : 0;
  return next - prev;
}

export function rerollHairColor(current: Race, currentVariant: RaceVariant | undefined) {
  const result = dice(20);
  return (current.hairColors || currentVariant && currentVariant.hairColors)![result - 1];
}

export function rerollEyeColor(current: Race, currentVariant: RaceVariant | undefined) {
  const result = dice(20);
  return (current.eyeColors || currentVariant && currentVariant.eyeColors)![result - 1];
}

export function rerollSize(race: Race, raceVariant: RaceVariant | undefined) {
  const arr: number[] = [];
  for (const { amount, sides } of (race.sizeRandom || raceVariant && raceVariant.sizeRandom)!) {
    const elements = Array.from({ length: amount }, () => sides);
    arr.push(...elements);
  }
  const result = (race.sizeBase || raceVariant && raceVariant.sizeBase)! + arr.map(e => dice(e)).reduce((a, b) => a + b, 0);
  return result.toString();
}

export function rerollWeight(race: Race, raceVariant: RaceVariant | undefined, size: string = rerollSize(race, raceVariant)) {
  const { id, weightBase, weightRandom } = race;
  const arr: number[] = [];
  for (const { amount, sides } of weightRandom) {
    const elements = Array.from({ length: amount }, () => sides);
    arr.push(...elements);
  }
  const addFunc = id === 'R_1' ?
    (e: number) => {
      const result = dice(Math.abs(e));
      return result % 2 > 0 ? -result : result;
    } :
    (e: number) => {
      const result = dice(Math.abs(e));
      return e < 0 ? -result : result;
    };
  const add = arr.map(addFunc);
  const formattedSize = multiplyString(size);
  const result = Number.parseInt(formattedSize) + weightBase + add.reduce((a, b) => a + b, 0);
  return {
    weight: result.toString(),
    size: formattedSize
  };
}

export function isSpecialisationSelection(id: ProfessionSelectionIds, options: ProfessionSelection | undefined): options is SpecialisationSelection {
  return id === 'SPECIALISATION' && typeof options === 'object';
}

export function isCursesSelection(id: ProfessionSelectionIds, options: ProfessionSelection | undefined): options is CursesSelection {
  return id === 'CURSES' && typeof options === 'object';
}

export function isCantripsSelection(id: ProfessionSelectionIds, options: ProfessionSelection | undefined): options is CantripsSelection {
  return id === 'CANTRIPS' && typeof options === 'object';
}

export function isCombatTechniquesSecondSelection(id: ProfessionSelectionIds, options: ProfessionSelection | undefined): options is CombatTechniquesSecondSelection {
  return id === 'COMBAT_TECHNIQUES_SECOND' && typeof options === 'object';
}

export function isCombatTechniquesSelection(id: ProfessionSelectionIds, options: ProfessionSelection | undefined): options is CombatTechniquesSelection {
  return id === 'COMBAT_TECHNIQUES' && typeof options === 'object';
}

export function isLanguagesScriptsSelection(id: ProfessionSelectionIds, options: ProfessionSelection | undefined): options is LanguagesScriptsSelection {
  return id === 'LANGUAGES_SCRIPTS' && typeof options === 'object';
}

export function isSkillsSelection(id: ProfessionSelectionIds, options: ProfessionSelection | undefined): options is SkillsSelection {
  return id === 'SKILLS' && typeof options === 'object';
}
