import R from 'ramda';
import { Race, RaceVariant } from '../types/wiki';
import { multiplyString } from './NumberUtils';
import { rollDie } from './dice';

export const rerollHairColor = (
  race: Race,
  raceVariant: RaceVariant | undefined,
): number => {
  const result = rollDie(20);
  const hairColors = race.hairColors || raceVariant && raceVariant.hairColors;
  return hairColors![result - 1];
};

export const rerollEyeColor = (
  race: Race,
  raceVariant: RaceVariant | undefined,
  isAlbino: boolean,
): number => {
  if (isAlbino) {
    return rollDie(2) + 18;
  }

  const result = rollDie(20);
  const eyeColors = race.eyeColors || raceVariant && raceVariant.eyeColors;
  return eyeColors![result - 1];
};

export const rerollSize = (
  race: Race,
  raceVariant: RaceVariant | undefined,
): string => {
  const sizeBase = race.sizeBase || raceVariant && raceVariant.sizeBase;
  const sizeRandom = race.sizeRandom || raceVariant && raceVariant.sizeRandom;

  const arr: number[] = R.chain(dice => {
    return Array<number>(dice.amount).fill(dice.sides);
  }, sizeRandom!);

  const result = sizeBase! + arr.reduce((a, b) => a + rollDie(b), 0);
  return result.toString();
};

export const getWeightForRerolledSize = (
  weight: string,
  prevSize: string,
  newSize: string,
): string => {
  const diff = Number.parseInt(newSize) - Number.parseInt(prevSize);
  const newWeight = Number.parseInt(weight) + diff;
  return newWeight.toString();
};

interface RerolledWeight {
  size: string;
  weight: string;
}

export const rerollWeight = (
  race: Race,
  raceVariant: RaceVariant | undefined,
  size: string = rerollSize(race, raceVariant),
): RerolledWeight => {
  const { id, weightBase, weightRandom } = race;

  const arr: number[] = R.chain(dice => {
    return Array<number>(dice.amount).fill(dice.sides);
  }, weightRandom);

  const addFunc = id === 'R_1' ?
    (acc: number, e: number) => {
      const result = rollDie(Math.abs(e));
      return result % 2 > 0 ? acc - result : acc + result;
    } :
    (acc: number, e: number) => {
      const result = rollDie(Math.abs(e));
      return e < 0 ? acc - result : acc + result;
    };

  const formattedSize = multiplyString(size);
  const formattedSizeNum = Number.parseInt(formattedSize);
  const result = formattedSizeNum + weightBase + arr.reduce<number>(addFunc, 0);

  return {
    weight: result.toString(),
    size: formattedSize
  };
};
