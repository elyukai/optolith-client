import R from 'ramda';
import { Race, RaceVariant } from '../types/wiki';
import { multiplyString } from './NumberUtils';
import { rollDice, rollDie } from './dice';
import { Maybe } from './maybe';

export const rerollHairColor = (
  race: Maybe<Race>,
  raceVariant: Maybe<RaceVariant>,
): Maybe<number> =>
  race
    .map(e => e.hairColors)
    .alt(raceVariant.map(e => e.hairColors))
    .map(e => e[rollDie(20) - 1]);

export const rerollEyeColor = (
  race: Maybe<Race>,
  raceVariant: Maybe<RaceVariant>,
  isAlbino: boolean,
): Maybe<number> =>
  isAlbino ? Maybe.Just(rollDie(2) + 18) : race
    .map(e => e.eyeColors)
    .alt(raceVariant.map(e => e.eyeColors))
    .map(e => e[rollDie(20) - 1]);

export const rerollSize = (
  race: Maybe<Race>,
  raceVariant: Maybe<RaceVariant>,
): Maybe<string> =>
  race
    .map(e => e.sizeBase)
    .alt(raceVariant.map(e => e.sizeBase))
    .map(R.add(
      race
        .map(e => e.sizeRandom)
        .alt(raceVariant.map(e => e.sizeRandom))
        .map(R.reduce((acc, die) => acc + rollDice(die.amount, die.sides), 0))
        .valueOr(0)
    ))
    .map(e => e.toString());

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
  size: Maybe<string>;
  weight: Maybe<string>;
}

export const rerollWeight = (
  race: Maybe<Race>,
  raceVariant: Maybe<RaceVariant>,
  size: Maybe<string> = rerollSize(race, raceVariant),
): RerolledWeight => {
  const formattedSize = size.map(multiplyString);

  return {
    weight: race
      .map(e => {
        const addFunc = e.id === 'R_1' ?
          (e: number) => (acc: number) => {
            const result = rollDie(Math.abs(e));
            return result % 2 > 0 ? acc - result : acc + result;
          } :
          (e: number) => (acc: number) => {
            const result = rollDie(Math.abs(e));
            return e < 0 ? acc - result : acc + result;
          };

        return e.weightRandom.reduce((acc, die) => {
          return acc + rollDice(die.amount, die.sides, addFunc(die.sides));
        }, e.weightBase);
      })
      .map(R.add(formattedSize.map(Number.parseInt).valueOr(0)))
      .map(e => e.toString()),
    size: formattedSize
  };
};
