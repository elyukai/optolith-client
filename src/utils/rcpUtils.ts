import * as R from 'ramda';
import { Sex } from '../types/data';
import { Profession, ProfessionVariant, Race, RaceVariant } from '../types/wiki';
import { Maybe, OrderedMap, Record } from './dataUtils';
import { rollDice, rollDie } from './dice';
import { translate, UIMessagesObject } from './I18n';
import { multiplyString } from './NumberUtils';

export const rerollHairColor = (
  race: Maybe<Record<Race>>,
  raceVariant: Maybe<Record<RaceVariant>>
): Maybe<number> =>
  race
    .bind (e => e.lookup ('hairColors'))
    .alt (raceVariant.bind (e => e.lookup ('hairColors')))
    .bind (e => e.subscript (rollDie (20) - 1));

export const rerollEyeColor = (
  race: Maybe<Record<Race>>,
  raceVariant: Maybe<Record<RaceVariant>>,
  isAlbino: boolean
): Maybe<number> =>
  isAlbino ? Maybe.pure (rollDie (2) + 18) : race
    .bind (e => e.lookup ('eyeColors'))
    .alt (raceVariant.bind (e => e.lookup ('eyeColors')))
    .bind (e => e.subscript (rollDie (20) - 1));

export const rerollSize = (
  race: Maybe<Record<Race>>,
  raceVariant: Maybe<Record<RaceVariant>>
): Maybe<string> =>
  race
    .bind (e => e.lookup ('sizeBase'))
    .alt (raceVariant.bind (e => e.lookup ('sizeBase')))
    .fmap (R.add (
      Maybe.fromMaybe (0) (race
        .bind (e => e.lookup ('sizeRandom'))
        .alt (raceVariant.bind (e => e.lookup ('sizeRandom')))
        .fmap (e => e.foldl<number> (
          acc => die => acc + rollDice (
            die.get ('amount'),
            die.get ('sides')
          )
        ) (0))
      )
    ))
    .fmap (e => e.toString ());

export const getWeightForRerolledSize = (
  weight: string,
  prevSize: string,
  newSize: string
): string => {
  const diff = Number.parseInt (newSize) - Number.parseInt (prevSize);
  const newWeight = Number.parseInt (weight) + diff;

  return newWeight.toString ();
};

interface RerolledWeight {
  size: Maybe<string>;
  weight: Maybe<string>;
}

export const rerollWeight = (
  race: Maybe<Record<Race>>,
  raceVariant: Maybe<Record<RaceVariant>>,
  size: Maybe<string> = rerollSize (race, raceVariant)
): RerolledWeight => {
  const formattedSize = size.fmap (multiplyString);

  return {
    weight: race
      .fmap (justRace => {
        const addFunc = justRace.get ('id') === 'R_1' ?
          (e: number) => (acc: number) => {
            const result = rollDie (Math.abs (e));

            return result % 2 > 0 ? acc - result : acc + result;
          } :
          (e: number) => (acc: number) => {
            const result = rollDie (Math.abs (e));

            return e < 0 ? acc - result : acc + result;
          };

        return justRace.get ('weightRandom')
          .foldl<number> (
            acc => die => acc + rollDice (
              die.get ('amount'),
              die.get ('sides'),
              addFunc (die.get ('sides'))
            )
          ) (justRace.get ('weightBase'));
      })
      .fmap (R.add (Maybe.fromMaybe (0) (formattedSize.fmap (Number.parseInt))))
      .fmap (e => e.toString ()),
    size: formattedSize,
  };
};

export const getFullProfessionName = (locale: UIMessagesObject) =>
  (wikiProfessions: OrderedMap<string, Record<Profession>>) =>
    (wikiProfessionVariants: OrderedMap<string, Record<ProfessionVariant>>) =>
      (sex: Sex) =>
        (professionId: Maybe<string>) =>
          (professionVariantId: Maybe<string>) =>
            (customProfessionName: Maybe<string>) => {
              if (Maybe.elem ('P_0') (professionId)) {
                return Maybe.fromMaybe (translate (locale, 'professions.ownprofession'))
                                      (customProfessionName);
              }

              const maybeProfession = professionId
                .bind (
                  id => OrderedMap.lookup<string, Record<Profession>>
                    (id)
                    (wikiProfessions)
                );

              const professionName = maybeProfession
                .fmap (profession => profession .get ('name'))
                .fmap (
                  name => name instanceof Record ? name .get (sex) : name
                );

              const professionSubName = maybeProfession
                .bind (profession => profession .lookup ('subname'))
                .fmap (
                  subname => subname instanceof Record ? subname .get (sex) : subname
                );

              const maybeProfessionVariant = professionVariantId
                .bind (
                  id => OrderedMap.lookup<string, Record<ProfessionVariant>>
                    (id)
                    (wikiProfessionVariants)
                );

              const professionVariantName = maybeProfessionVariant
                .fmap (professionVariant => professionVariant .get ('name'))
                .fmap (
                  name => name instanceof Record ? name .get (sex) : name
                );

              return Maybe.fromMaybe ('')
                                    (professionName
                                      .fmap (
                                        name => Maybe.fromMaybe (name)
                                                                (professionSubName
                                                                  .alt (professionVariantName)
                                                                  .fmap (
                                                                    addName =>
                                                                      `${name} (${addName})`
                                                                  ))
                                      ));
            };
