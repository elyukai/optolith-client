import { fmap } from "../../Data/Functor";
import { foldr, subscriptF } from "../../Data/List";
import { altF, bindF, elem, fromMaybe, Just, liftM2, Maybe, sum } from "../../Data/Maybe";
import { add, lt, odd, subtract, subtractBy } from "../../Data/Num";
import { lookupF, OrderedMap } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { show } from "../../Data/Show";
import { ProfessionId, RaceId } from "../Constants/Ids";
import { Sex } from "../Models/Hero/heroTypeHelpers";
import { L10nRecord } from "../Models/Wiki/L10n";
import { Profession } from "../Models/Wiki/Profession";
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant";
import { Race } from "../Models/Wiki/Race";
import { RaceVariant } from "../Models/Wiki/RaceVariant";
import { Die } from "../Models/Wiki/sub/Die";
import { NameBySex, nameBySexDef } from "../Models/Wiki/sub/NameBySex";
import { rollDiceFold, rollDiceR, rollDie } from "./dice";
import { translate } from "./I18n";
import { ifElse } from "./ifElse";
import { multiplyString, toInt } from "./NumberUtils";
import { pipe, pipe_ } from "./pipe";

const { id, hairColors, eyeColors, sizeBase, sizeRandom, weightBase, weightRandom } = Race.AL
const { amount, sides } = Die.AL
const { name, subname } = Profession.AL

/**
 * Reroll the hair color based on the current race and race variant.
 */
export const rerollHairColor =
  (race: Maybe<Record<Race>>) =>
  (raceVariant: Maybe<Record<RaceVariant>>): Maybe<number> =>
    pipe (
           bindF (hairColors),
           altF (bindF (hairColors) (raceVariant)),
           bindF (subscriptF (rollDie (20) - 1))
         )
         (race)

/**
 * Reroll the eye color based on the current race and race variant.
 */
export const rerollEyeColor =
  (isAlbino: boolean) =>
  (race: Maybe<Record<Race>>) =>
  (raceVariant: Maybe<Record<RaceVariant>>): Maybe<number> =>
    isAlbino
    ? Just (rollDie (2) + 18)
    : pipe (
             bindF (eyeColors),
             altF (bindF (eyeColors) (raceVariant)),
             bindF (subscriptF (rollDie (20) - 1))
           )
           (race)

/**
 * Reroll the size based on the current race and race variant.
 */
export const rerollSize =
  (race: Maybe<Record<Race>>) =>
  (raceVariant: Maybe<Record<RaceVariant>>): Maybe<string> =>
    pipe (
      bindF (sizeBase),
      altF (bindF (sizeBase) (raceVariant)),
      fmap (pipe (
        pipe_ (
          race,
          bindF (sizeRandom),
          altF (bindF (sizeRandom) (raceVariant)),
          fmap (foldr (pipe (rollDiceR, add)) (0)),
          sum,
          add
        ),
        show
      ))
    )
    (race)

/**
 * Recalculate the weight if the size has been changed.
 */
export const getWeightForRerolledSize =
  (weight: string) =>
  (prevSize: string) =>
  (newSize: string): string => {
    const diff = liftM2 (subtract) (toInt (newSize)) (toInt (prevSize))
    const newWeight = liftM2 (add) (toInt (weight)) (diff)

    return fromMaybe ("") (fmap (show) (newWeight))
  }

/**
 * `randomWeightRace pred sides acc` takes a race-specific predicate and returns
 * a function that rolls a die based on the passed `sides` of the die. If the
 * predicate returns `True` for the result, it subtracts the value from `acc`,
 * otherwise it adds the value to `acc`.
 */
const randomWeightRace =
  (pred: (x: number) => boolean) =>
    pipe (
      Math.abs,
      rollDie,
      ifElse (pred) (subtractBy) (add)
    )

interface RerolledWeight {
  size: Maybe<string>
  weight: Maybe<string>
}

/**
 * Reroll the weight based on the current race and race variant.
 */
export const rerollWeight =
  (size: Maybe<string>) =>
  (mrace: Maybe<Record<Race>>): RerolledWeight => {
    const formattedSize = fmap (multiplyString) (size)

    const rerolled_weight =
      fmap (pipe (
             (race: Record<Race>) => {
               const f = id (race) === RaceId.Humans
                 ? randomWeightRace (odd)
                 : randomWeightRace (lt (0))

               return foldr
                 ((die: Record<Die>) => add (rollDiceFold (f (sides (die)))
                                                          (amount (die))))
                 (-weightBase (race))
                 (weightRandom (race))
             },
             add (sum (bindF (toInt) (formattedSize))),
             show
           ))
           (mrace)

    return {
      weight: rerolled_weight,
      size: formattedSize,
    }
  }

/**
 * Reroll size and weight based on the current race and race variant.
 */
export const rerollWeightAndSize =
  (race: Maybe<Record<Race>>) =>
  (raceVariant: Maybe<Record<RaceVariant>>) =>
    rerollWeight (rerollSize (race) (raceVariant)) (race)

export const getFullProfessionName =
  (l10n: L10nRecord) =>
  (wikiProfessions: OrderedMap<string, Record<Profession>>) =>
  (wikiProfessionVariants: OrderedMap<string, Record<ProfessionVariant>>) =>
  (sex: Sex) =>
  (professionId: Maybe<string>) =>
  (professionVariantId: Maybe<string>) =>
  (customProfessionName: Maybe<string>) => {
    if (elem<string> (ProfessionId.CustomProfession) (professionId)) {
      return fromMaybe (translate (l10n) ("ownprofession"))
                       (customProfessionName)
    }

    const maybeProfession = bindF (lookupF (wikiProfessions))
                                  (professionId)

    const professionName = fmap (pipe (name, nameBySexDef (sex)))
                                (maybeProfession)

    const professionSubName = pipe (bindF (subname), fmap (nameBySexDef (sex)))
                                   (maybeProfession)

    const maybeProfessionVariant = bindF (lookupF (wikiProfessionVariants))
                                         (professionVariantId)

    const professionVariantName = fmap (pipe (name, nameBySexDef (sex)))
                                       (maybeProfessionVariant)

    return pipe_ (
      professionName,
      fmap ((n: string) => fromMaybe (n)
                                     (pipe (
                                             altF (professionVariantName),
                                             fmap (addName => `${n} (${addName})`)
                                           )
                                           (professionSubName))),
      fromMaybe ("")
    )
  }

export const getNameBySex: (sex: Sex) => (name: string | Record<NameBySex>) => string =
  s => n => NameBySex.is (n) ? NameBySex.A[s] (n) : n

export const getNameBySexM: (sex: Sex) =>
                            (mname: Maybe<string | Record<NameBySex>>) => Maybe<string> =
  s => fmap (n => NameBySex.is (n) ? NameBySex.A[s] (n) : n)
