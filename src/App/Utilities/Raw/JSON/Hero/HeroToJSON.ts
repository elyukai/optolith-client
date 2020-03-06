import { ident } from "../../../../../Data/Function"
import { fmap, fmapF } from "../../../../../Data/Functor"
import { isList, List } from "../../../../../Data/List"
import { elem, maybeToUndefined } from "../../../../../Data/Maybe"
import { gt } from "../../../../../Data/Num"
import { foldl, foldlWithKey, OrderedMap, OrderedMapValueElement, toObjectWith, union } from "../../../../../Data/OrderedMap"
import { toArray } from "../../../../../Data/OrderedSet"
import { Record, StringKeyObject, toObject } from "../../../../../Data/Record"
import { isTuple, Pair, Tuple } from "../../../../../Data/Tuple"
import { ProfessionId } from "../../../../Constants/Ids"
import { ActivatableDependent } from "../../../../Models/ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent } from "../../../../Models/ActiveEntries/ActivatableSkillDependent"
import { ActiveObject } from "../../../../Models/ActiveEntries/ActiveObject"
import { AttributeDependent } from "../../../../Models/ActiveEntries/AttributeDependent"
import { Belongings } from "../../../../Models/Hero/Belongings"
import { Energies } from "../../../../Models/Hero/Energies"
import { HeroModel, HeroModelRecord } from "../../../../Models/Hero/HeroModel"
import { ExtendedSkillDependent } from "../../../../Models/Hero/heroTypeHelpers"
import { HitZoneArmor } from "../../../../Models/Hero/HitZoneArmor"
import { Item } from "../../../../Models/Hero/Item"
import { PersonalData } from "../../../../Models/Hero/PersonalData"
import { Rules } from "../../../../Models/Hero/Rules"
import { UndoableHero, UndoableHeroModelRecord } from "../../../../Models/Hero/UndoHero"
import { PrimaryAttributeDamageThreshold } from "../../../../Models/Wiki/sub/PrimaryAttributeDamageThreshold"
import { current_version } from "../../../../Selectors/envSelectors"
import { HeroStateMapKey } from "../../../heroStateUtils"
import { ifElse } from "../../../ifElse"
import { pipe, pipe_ } from "../../../pipe"
import { RawActiveObject, RawArmorZone, RawCustomItem, RawHero, RawPet, RawPrimaryAttributeDamageThreshold } from "../../RawData"

const HA = HeroModel.A

const { id, value } = AttributeDependent.AL
const { active } = ActivatableSkillDependent.AL
const { active: activeList } = ActivatableDependent.AL
const { items, hitZoneArmors: armorZones, purse } = Belongings.AL
const PDA = PersonalData.A
const PADTA = PrimaryAttributeDamageThreshold.A

const {
  addedArcaneEnergyPoints,
  addedKarmaPoints,
  addedLifePoints,
  permanentArcaneEnergyPoints,
  permanentKarmaPoints,
  permanentLifePoints,
} = Energies.AL

const { cost, sid, sid2, tier } = ActiveObject.AL

const getAttributesForSave = (hero: HeroModelRecord): RawHero["attr"] =>
  ({
    values: foldl<Record<AttributeDependent>, { id: string; value: number }[]>
      (acc => e => [ ...acc, { id: id (e), value: value (e) } ])
      ([])
      (HA.attributes (hero)),
    attributeAdjustmentSelected: HA.attributeAdjustmentSelected (hero),
    ae: addedArcaneEnergyPoints (HA.energies (hero)),
    kp: addedKarmaPoints (HA.energies (hero)),
    lp: addedLifePoints (HA.energies (hero)),
    permanentAE: toObject (permanentArcaneEnergyPoints (HA.energies (hero))),
    permanentKP: toObject (permanentKarmaPoints (HA.energies (hero))),
    permanentLP: toObject (permanentLifePoints (HA.energies (hero))),
  })

const getActivatablesForSave =
  (hero: HeroModelRecord) =>
    foldlWithKey ((acc: StringKeyObject<RawActiveObject[]>) =>
                  (key: string) =>
                  (obj: Record<ActivatableDependent>) => ({
                    ...acc,
                    [key]: List.foldl
                      ((accActive: RawActiveObject[]) => (e: Record<ActiveObject>) => [
                        ...accActive,
                        {
                          cost: maybeToUndefined (cost (e)),
                          sid2: maybeToUndefined (sid2 (e)),
                          sid: maybeToUndefined (sid (e)),
                          tier: maybeToUndefined (tier (e)),
                        },
                      ])
                      ([])
                      (activeList (obj)),
                  }))
                 ({})
                 (union (HA.advantages (hero))
                        (union (HA.disadvantages (hero)) (HA.specialAbilities (hero))))

const getValuesForSave =
  <T extends HeroModel[HeroStateMapKey]>
  (sliceGetter: (hero: HeroModelRecord) => T) =>
  (testFn: (obj: OrderedMapValueElement<T>) => boolean) =>
  (hero: HeroModelRecord) =>
    foldlWithKey
      ((acc: StringKeyObject<number>) => (key: string) => (obj: ExtendedSkillDependent) => {
        if (testFn (obj as OrderedMapValueElement<T>)) {
          return {
            ...acc,
            [key]: value (obj),
          }
        }

        return acc
      })
      ({})
      (sliceGetter (hero) as OrderedMap<string, ExtendedSkillDependent>)

const getSkillsForSave = getValuesForSave (HA.skills) (pipe (value, gt (0)))

const getCombatTechniquesForSave = getValuesForSave (HA.combatTechniques) (pipe (value, gt (6)))

const getSpellsForSave = getValuesForSave (HA.spells) (active)

const getCantripsForSave = pipe (HA.cantrips, toArray)

const getLiturgicalChantsForSave = getValuesForSave (HA.liturgicalChants) (active)

const getBlessingsForSave = pipe (HA.blessings, toArray)

const getBelongingsForSave = (hero: HeroModelRecord) =>
  ({
    items: toObjectWith
      ((obj: Record<Item>): RawCustomItem => {
        const {
          improvisedWeaponGroup,
          damageBonus,
          range,
          at,
          iniMod,
          movMod,
          damageDiceNumber,
          damageFlat,
          enc,
          length,
          pa,
          pro,
          reloadTime,
          stp,
          stabilityMod,
          note,
          rules,
          advantage,
          disadvantage,
          src,
          ammunition,
          combatTechnique,
          damageDiceSides,
          reach,
          template,
          isParryingWeapon,
          where,
          isTwoHandedWeapon,
          loss,
          forArmorZoneOnly,
          addPenalties,
          armorType,
          price,
          weight,
          ...other
        } = toObject (obj)

        type PNumNum = Pair<number, number>

        return {
          ...other,
          weight: maybeToUndefined (weight),
          price: maybeToUndefined (price),
          at: maybeToUndefined (at),
          iniMod: maybeToUndefined (iniMod),
          movMod: maybeToUndefined (movMod),
          damageDiceNumber: maybeToUndefined (damageDiceNumber),
          damageFlat: maybeToUndefined (damageFlat),
          enc: maybeToUndefined (enc),
          length: maybeToUndefined (length),
          pa: maybeToUndefined (pa),
          pro: maybeToUndefined (pro),
          reloadTime: pipe_ (
                        reloadTime,
                        fmap (x => isList (x)
                                   ? List.toArray (x)
                                   : x),
                        maybeToUndefined
                      ),
          stp: pipe_ (
                 stp,
                 fmap (x => isList (x)
                            ? List.toArray (x)
                            : x),
                 maybeToUndefined
               ),
          stabilityMod: maybeToUndefined (stabilityMod),
          ammunition: maybeToUndefined (ammunition),
          combatTechnique: maybeToUndefined (combatTechnique),
          damageDiceSides: maybeToUndefined (damageDiceSides),
          reach: maybeToUndefined (reach),
          template: maybeToUndefined (template),
          where: maybeToUndefined (where),
          loss: maybeToUndefined (loss),
          armorType: maybeToUndefined (armorType),
          imp: maybeToUndefined (improvisedWeaponGroup),
          primaryThreshold:
            maybeToUndefined (fmapF (damageBonus)
                             ((bonus): RawPrimaryAttributeDamageThreshold => {
                               const primary = PADTA.primary (bonus)
                               const threshold = PADTA.threshold (bonus)

                               return {
                                 primary: pipe_ (
                                            primary,
                                            fmap (x => isTuple (x)
                                                       ? Tuple.toArray (x)
                                                       : x),
                                            maybeToUndefined
                                          ),
                                 threshold: ifElse<number | PNumNum, PNumNum> (isTuple)
                                                                              <number | number[]>
                                                                              (Tuple.toArray)
                                                                              (ident)
                                                                              (threshold),
                               }
                             })),
          range: maybeToUndefined (fmap<List<number>, number[]> (List.toArray) (range)),
        }
      })
      (items (HA.belongings (hero))),
    armorZones:
      toObjectWith ((obj: Record<HitZoneArmor>): RawArmorZone => ({
                     id: HitZoneArmor.AL.id (obj),
                     name: HitZoneArmor.AL.name (obj),
                     head: maybeToUndefined (HitZoneArmor.AL.head (obj)),
                     headLoss: maybeToUndefined (HitZoneArmor.AL.headLoss (obj)),
                     leftArm: maybeToUndefined (HitZoneArmor.AL.leftArm (obj)),
                     leftArmLoss: maybeToUndefined (HitZoneArmor.AL.leftArmLoss (obj)),
                     rightArm: maybeToUndefined (HitZoneArmor.AL.rightArm (obj)),
                     rightArmLoss: maybeToUndefined (HitZoneArmor.AL.rightArmLoss (obj)),
                     torso: maybeToUndefined (HitZoneArmor.AL.torso (obj)),
                     torsoLoss: maybeToUndefined (HitZoneArmor.AL.torsoLoss (obj)),
                     leftLeg: maybeToUndefined (HitZoneArmor.AL.leftLeg (obj)),
                     leftLegLoss: maybeToUndefined (HitZoneArmor.AL.leftLegLoss (obj)),
                     rightLeg: maybeToUndefined (HitZoneArmor.AL.rightLeg (obj)),
                     rightLegLoss: maybeToUndefined (HitZoneArmor.AL.rightLegLoss (obj)),
                   }))
                   (armorZones (HA.belongings (hero))),
    purse: toObject (purse (HA.belongings (hero))),
  })

const getPetsForSave = pipe (
  HA.pets,
  toObjectWith (
    (r): RawPet => {
      const obj = toObject (r)

      return {
        id: obj .id,
        name: obj .name,
        avatar: maybeToUndefined (obj .avatar),
        size: maybeToUndefined (obj .size),
        type: maybeToUndefined (obj .type),
        attack: maybeToUndefined (obj .attack),
        dp: maybeToUndefined (obj .dp),
        reach: maybeToUndefined (obj .reach),
        actions: maybeToUndefined (obj .actions),
        talents: maybeToUndefined (obj .talents),
        skills: maybeToUndefined (obj .skills),
        notes: maybeToUndefined (obj .notes),
        spentAp: maybeToUndefined (obj .spentAp),
        totalAp: maybeToUndefined (obj .totalAp),
        cou: maybeToUndefined (obj .cou),
        sgc: maybeToUndefined (obj .sgc),
        int: maybeToUndefined (obj .int),
        cha: maybeToUndefined (obj .cha),
        dex: maybeToUndefined (obj .dex),
        agi: maybeToUndefined (obj .agi),
        con: maybeToUndefined (obj .con),
        str: maybeToUndefined (obj .str),
        lp: maybeToUndefined (obj .lp),
        ae: maybeToUndefined (obj .ae),
        spi: maybeToUndefined (obj .spi),
        tou: maybeToUndefined (obj .tou),
        pro: maybeToUndefined (obj .pro),
        ini: maybeToUndefined (obj .ini),
        mov: maybeToUndefined (obj .mov),
        at: maybeToUndefined (obj .at),
        pa: maybeToUndefined (obj .pa),

      }
    }
  )
)

export const convertHeroForSave =
  (hero: HeroModelRecord): RawHero => {
    const {
      dateCreated,
      dateModified,
      phase,
      name,
      avatar,
      experienceLevel,
      race,
      raceVariant,
      culture,
      profession,
      professionName,
      professionVariant,
      sex,
      personalData,
      rules,
      pact,
      locale,
    } = toObject (hero)

    const obj: RawHero = {
      clientVersion: current_version,
      dateCreated: dateCreated .toJSON (),
      dateModified: dateModified .toJSON (),
      id: id (hero),
      phase,
      locale,
      name,
      avatar: maybeToUndefined (avatar),
      ap: {
        total: HeroModel.A.adventurePointsTotal (hero),
      },
      el: experienceLevel,
      r: maybeToUndefined (race),
      rv: maybeToUndefined (raceVariant),
      c: maybeToUndefined (culture),
      p: maybeToUndefined (profession),
      professionName: elem<string> (ProfessionId.CustomProfession) (profession)
        ? maybeToUndefined (professionName)
        : undefined,
      pv: maybeToUndefined (professionVariant),
      sex,
      pers: {
        family: maybeToUndefined (PDA.family (personalData)),
        placeofbirth: maybeToUndefined (PDA.placeOfBirth (personalData)),
        dateofbirth: maybeToUndefined (PDA.dateOfBirth (personalData)),
        age: maybeToUndefined (PDA.age (personalData)),
        haircolor: maybeToUndefined (PDA.hairColor (personalData)),
        eyecolor: maybeToUndefined (PDA.eyeColor (personalData)),
        size: maybeToUndefined (PDA.size (personalData)),
        weight: maybeToUndefined (PDA.weight (personalData)),
        title: maybeToUndefined (PDA.title (personalData)),
        socialstatus: maybeToUndefined (PDA.socialStatus (personalData)),
        characteristics: maybeToUndefined (PDA.characteristics (personalData)),
        otherinfo: maybeToUndefined (PDA.otherInfo (personalData)),
        cultureAreaKnowledge:
          maybeToUndefined (PDA.cultureAreaKnowledge (personalData)),
      },
      attr: getAttributesForSave (hero),
      activatable: getActivatablesForSave (hero),
      talents: getSkillsForSave (hero),
      ct: getCombatTechniquesForSave (hero),
      spells: getSpellsForSave (hero),
      cantrips: getCantripsForSave (hero),
      liturgies: getLiturgicalChantsForSave (hero),
      blessings: getBlessingsForSave (hero),
      belongings: getBelongingsForSave (hero),
      rules: {
        ...toObject (rules),
        enabledRuleBooks: toArray (Rules.AL.enabledRuleBooks (rules)),
      },
      pets: getPetsForSave (hero),
      pact: pipe_ (pact, fmap (toObject), maybeToUndefined),
    }

    return obj
  }

const { present } = UndoableHero.AL

export const convertHeroesForSave =
  (heroes: OrderedMap<string, UndoableHeroModelRecord>) =>
    toObjectWith (pipe (present, convertHeroForSave))
                 (heroes)
