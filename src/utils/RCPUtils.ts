import R from 'ramda';
import { Race, RaceVariant } from '../types/wiki';
import { Maybe, Record } from './dataUtils';
import { rollDice, rollDie } from './dice';
import { multiplyString } from './NumberUtils';

export const rerollHairColor = (
  race: Maybe<Record<Race>>,
  raceVariant: Maybe<Record<RaceVariant>>,
): Maybe<number> =>
  race
    .bind(e => e.lookup('hairColors'))
    .alt(raceVariant.bind(e => e.lookup('hairColors')))
    .bind(e => e.subscript(rollDie(20) - 1));

export const rerollEyeColor = (
  race: Maybe<Record<Race>>,
  raceVariant: Maybe<Record<RaceVariant>>,
  isAlbino: boolean,
): Maybe<number> =>
  isAlbino ? Maybe.Just(rollDie(2) + 18) : race
    .bind(e => e.lookup('eyeColors'))
    .alt(raceVariant.bind(e => e.lookup('eyeColors')))
    .bind(e => e.subscript(rollDie(20) - 1));

export const rerollSize = (
  race: Maybe<Record<Race>>,
  raceVariant: Maybe<Record<RaceVariant>>,
): Maybe<string> =>
  race
    .bind(e => e.lookup('sizeBase'))
    .alt(raceVariant.bind(e => e.lookup('sizeBase')))
    .map(R.add(
      Maybe.fromMaybe(0, race
        .bind(e => e.lookup('sizeRandom'))
        .alt(raceVariant.bind(e => e.lookup('sizeRandom')))
        .map(e => e.foldl(
          acc => die => acc + rollDice(
            die.get('amount'),
            die.get('sides')
          ),
          0
        ))
      )
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
  race: Maybe<Record<Race>>,
  raceVariant: Maybe<Record<RaceVariant>>,
  size: Maybe<string> = rerollSize(race, raceVariant),
): RerolledWeight => {
  const formattedSize = size.map(multiplyString);

  return {
    weight: race
      .map(justRace => {
        const addFunc = justRace.get('id') === 'R_1' ?
          (e: number) => (acc: number) => {
            const result = rollDie(Math.abs(e));

            return result % 2 > 0 ? acc - result : acc + result;
          } :
          (e: number) => (acc: number) => {
            const result = rollDie(Math.abs(e));

            return e < 0 ? acc - result : acc + result;
          };

        return justRace.get('weightRandom')
          .foldl(
            acc => die => {
              return acc + rollDice(
                die.get('amount'),
                die.get('sides'),
                addFunc(die.get('sides'))
              );
            },
            justRace.get('weightBase')
          );
      })
      .map(R.add(Maybe.fromMaybe(0, formattedSize.map(Number.parseInt))))
      .map(e => e.toString()),
    size: formattedSize
  };
};
