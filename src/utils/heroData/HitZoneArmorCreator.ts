import { ArmorZonesInstance } from '../../types/data';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';

export const HitZoneArmorCreator =
  fromDefault<ArmorZonesInstance> ({
    id: '',
    name: '',
    head: Nothing,
    headLoss: Nothing,
    leftArm: Nothing,
    leftArmLoss: Nothing,
    rightArm: Nothing,
    rightArmLoss: Nothing,
    torso: Nothing,
    torsoLoss: Nothing,
    leftLeg: Nothing,
    leftLegLoss: Nothing,
    rightLeg: Nothing,
    rightLegLoss: Nothing,
  })

export const HitZoneArmorCreatorG = makeGetters (HitZoneArmorCreator)
