import { ActivatableDependent } from '../types/data';
import { Maybe, Record } from './dataUtils';
import { isActive } from './isActive';

export const getModifierByActiveLevel =
  (maybeIncrease: Maybe<Record<ActivatableDependent>>) =>
  (maybeDecrease: Maybe<Record<ActivatableDependent>>) =>
  (maybeBaseMod: Maybe<number>) => {
    const increaseObject = maybeIncrease
      .fmap (increase => increase.get ('active'))
      .bind (Maybe.listToMaybe);

    const decreaseObject = maybeDecrease
      .fmap (decrease => decrease.get ('active'))
      .bind (Maybe.listToMaybe);

    return Maybe.fromMaybe (0) (
      maybeBaseMod.fmap (
        baseMod => {
          const increaseTier = increaseObject.bind (obj => obj.lookup ('tier'));

          if (Maybe.isJust (increaseTier)) {
            return baseMod + Maybe.fromJust (increaseTier);
          }

          const decreaseTier = decreaseObject.bind (obj => obj.lookup ('tier'));

          if (Maybe.isJust (decreaseTier)) {
            return baseMod - Maybe.fromJust (decreaseTier);
          }

          return baseMod;
        }
      )
    );
  };

export const getModifierByIsActive =
  (maybeIncrease: Maybe<Record<ActivatableDependent>>) =>
  (maybeDecrease: Maybe<Record<ActivatableDependent>>) =>
  (maybeBaseMod: Maybe<number>) => {
    const hasIncrease = isActive (maybeIncrease);
    const hasDecrease = isActive (maybeDecrease);

    return Maybe.fromMaybe (0) (
      maybeBaseMod.fmap (
        baseMod => hasIncrease ? baseMod + 1 : hasDecrease ? baseMod - 1 : baseMod
      )
    );
  };
