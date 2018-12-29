import { pipe } from 'ramda';
import * as Data from '../../types/data';
import * as Raw from '../../types/rawdata';
import { ActivatableDependent, ActivatableDependentG, ActiveObjectG } from '../activeEntries/ActivatableDependent';
import { ActivatableSkillDependentG } from '../activeEntries/ActivatableSkillDependent';
import { AttributeDependent, AttributeDependentG } from '../activeEntries/AttributeDependent';
import { getAPObject } from '../adventurePoints/adventurePointsSumUtils';
import { BelongingsG } from '../heroData/Belongings';
import { EnergiesG } from '../heroData/Energies';
import { HeroModel, HeroModelG, HeroModelRecord } from '../heroData/HeroModel';
import { HitZoneArmor, HitZoneArmorG } from '../heroData/HitZoneArmor';
import { Item } from '../heroData/Item';
import { PersonalDataG } from '../heroData/PersonalData';
import { RulesG } from '../heroData/Rules';
import { UndoableHeroG, UndoableHeroModelRecord } from '../heroData/UndoHero';
import { HeroStateMapKey } from '../heroStateUtils';
import { ifElse } from '../ifElse';
import { gt } from '../mathUtils';
import { ident } from '../structures/Function';
import { List, map } from '../structures/List';
import { bind, elem, fmap, maybeToUndefined } from '../structures/Maybe';
import { elems, foldl, foldlWithKey, OrderedMap, OrderedMapValueElement, toObjectWith, union } from '../structures/OrderedMap';
import { toArray } from '../structures/OrderedSet';
import { Record, StringKeyObject, toObject } from '../structures/Record';
import { L10nRecord } from '../wikiData/L10n';
import { PrimaryAttributeDamageThreshold, PrimaryAttributeDamageThresholdG } from '../wikiData/sub/PrimaryAttributeDamageThreshold';
import { WikiModelRecord } from '../wikiData/WikiModel';
import { currentVersion } from './compatibilityUtils';

const {
  attributes,
  attributeAdjustmentSelected,
  energies,
  advantages,
  disadvantages,
  specialAbilities,
  skills,
  combatTechniques,
  spells,
  cantrips,
  liturgicalChants,
  blessings,
  belongings,
  pets,
  player,
} = HeroModelG

const { id, value } = AttributeDependentG
const { active } = ActivatableSkillDependentG
const { active: activeList } = ActivatableDependentG
const { items, armorZones, purse } = BelongingsG

const {
  addedArcaneEnergyPoints,
  addedKarmaPoints,
  addedLifePoints,
  permanentArcaneEnergyPoints,
  permanentKarmaPoints,
  permanentLifePoints,
} = EnergiesG

const { cost, sid, sid2, tier } = ActiveObjectG

const getAttributesForSave = (hero: HeroModelRecord): Raw.RawHero['attr'] =>
  ({
    values: foldl<Record<AttributeDependent>, { id: string; value: number }[]>
      (acc => e => [...acc, { id: id (e), value: value (e) }])
      ([])
      (attributes (hero)),
    attributeAdjustmentSelected: attributeAdjustmentSelected (hero),
    ae: addedArcaneEnergyPoints (energies (hero)),
    kp: addedKarmaPoints (energies (hero)),
    lp: addedLifePoints (energies (hero)),
    permanentAE: toObject (permanentArcaneEnergyPoints (energies (hero))),
    permanentKP: toObject (permanentKarmaPoints (energies (hero))),
    permanentLP: toObject (permanentLifePoints (energies (hero))),
  })

const getActivatablesForSave =
  (hero: HeroModelRecord) =>
    foldlWithKey<string, Record<ActivatableDependent>, StringKeyObject<Raw.RawActiveObject[]>>
      (acc => key => obj => ({
        ...acc,
        [key]: List.foldl<Record<Data.ActiveObject>, Raw.RawActiveObject[]>
          (accActive => e => [
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
      (union (advantages (hero)) (union (disadvantages (hero)) (specialAbilities (hero))))

const getValuesForSave =
  <T extends HeroModel[HeroStateMapKey]>
  (sliceGetter: (hero: HeroModelRecord) => T) =>
  (testFn: (obj: OrderedMapValueElement<T>) => boolean) =>
  (hero: HeroModelRecord) =>
    foldlWithKey<string, Data.ExtendedSkillDependent, StringKeyObject<number>>
      (acc => key => obj => {
        if (testFn (obj as OrderedMapValueElement<T>)) {
          return {
            ...acc,
            [key]: value (obj),
          };
        }

        return acc;
      })
      ({})
      (sliceGetter (hero) as OrderedMap<string, Data.ExtendedSkillDependent>)

const getSkillsForSave = getValuesForSave (skills) (pipe (value, gt (0)))

const getCombatTechniquesForSave = getValuesForSave (combatTechniques) (pipe (value, gt (6)))

const getSpellsForSave = getValuesForSave (spells) (active)

const getCantripsForSave = pipe (cantrips, toArray)

const getLiturgicalChantsForSave = getValuesForSave (liturgicalChants) (active)

const getBlessingsForSave = pipe (blessings, toArray)

const { primary, threshold } = PrimaryAttributeDamageThresholdG

const getBelongingsForSave = (hero: HeroModelRecord) =>
  ({
    items: toObjectWith<Record<Item>, Raw.RawCustomItem>
      ((obj): Raw.RawCustomItem => {
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
          ...other
        } = toObject (obj)

        return {
          ...other,
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
          reloadTime: maybeToUndefined (reloadTime),
          stp: maybeToUndefined (stp),
          stabilityMod: maybeToUndefined (stabilityMod),
          ammunition: maybeToUndefined (ammunition),
          combatTechnique: maybeToUndefined (combatTechnique),
          damageDiceSides: maybeToUndefined (damageDiceSides),
          reach: maybeToUndefined (reach),
          template: maybeToUndefined (template),
          isParryingWeapon: maybeToUndefined (isParryingWeapon),
          where: maybeToUndefined (where),
          isTwoHandedWeapon: maybeToUndefined (isTwoHandedWeapon),
          loss: maybeToUndefined (loss),
          forArmorZoneOnly: maybeToUndefined (forArmorZoneOnly),
          addPenalties: maybeToUndefined (addPenalties),
          armorType: maybeToUndefined (armorType),
          imp: maybeToUndefined (improvisedWeaponGroup),
          primaryThreshold:
            maybeToUndefined (
              fmap<Record<PrimaryAttributeDamageThreshold>, Raw.RawPrimaryAttributeDamageThreshold>
                (bonus => ({
                  primary: maybeToUndefined (primary (bonus)) ,
                  threshold:
                    ifElse<number | List<number>, List<number>, number | number[]>
                      (List.isList)
                      (List.toArray)
                      (ident)
                      (threshold (bonus)),
                }))
                (damageBonus)
            ),
          range: maybeToUndefined (fmap<List<number>, number[]> (List.toArray) (range)),
        }
      })
      (items (belongings (hero))),
    armorZones:
      toObjectWith<Record<HitZoneArmor>, Raw.RawArmorZone>
        (obj => ({
          id: HitZoneArmorG.id (obj),
          name: HitZoneArmorG.name (obj),
          head: maybeToUndefined (HitZoneArmorG.head (obj)),
          headLoss: maybeToUndefined (HitZoneArmorG.headLoss (obj)),
          leftArm: maybeToUndefined (HitZoneArmorG.leftArm (obj)),
          leftArmLoss: maybeToUndefined (HitZoneArmorG.leftArmLoss (obj)),
          rightArm: maybeToUndefined (HitZoneArmorG.rightArm (obj)),
          rightArmLoss: maybeToUndefined (HitZoneArmorG.rightArmLoss (obj)),
          torso: maybeToUndefined (HitZoneArmorG.torso (obj)),
          torsoLoss: maybeToUndefined (HitZoneArmorG.torsoLoss (obj)),
          leftLeg: maybeToUndefined (HitZoneArmorG.leftLeg (obj)),
          leftLegLoss: maybeToUndefined (HitZoneArmorG.leftLegLoss (obj)),
          rightLeg: maybeToUndefined (HitZoneArmorG.rightLeg (obj)),
          rightLegLoss: maybeToUndefined (HitZoneArmorG.rightLegLoss (obj)),
        }))
        (armorZones (belongings (hero))),
    purse: toObject (purse (belongings (hero))),
  })

const getPetsForSave = pipe (
  pets,
  toObjectWith (
    (r): Raw.RawPet => {
      const obj = toObject (r)

      return {
        id: obj .id,
        name: obj .name,
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
  (wiki: WikiModelRecord) =>
  (locale: L10nRecord) =>
  (users: OrderedMap<string, Data.User>) =>
  (hero: HeroModelRecord): Raw.RawHero => {
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
    } = toObject (hero)

    const adventurePoints = getAPObject (wiki) (locale) (hero)

    const maybeUser = bind<string, Data.User> (player (hero))
                                              (OrderedMap.lookup_<string, Data.User> (users))

    const obj: Raw.RawHero = {
      clientVersion: currentVersion,
      dateCreated: dateCreated .toJSON (),
      dateModified: dateModified .toJSON (),
      id: id (hero),
      phase,
      player: maybeToUndefined (maybeUser),
      name,
      avatar: maybeToUndefined (avatar),
      ap: {
        total: adventurePoints.get ('total'),
        spent: adventurePoints.get ('spent'),
      },
      el: experienceLevel,
      r: maybeToUndefined (race),
      rv: maybeToUndefined (raceVariant),
      c: maybeToUndefined (culture),
      p: maybeToUndefined (profession),
      professionName: elem ('P_0') (profession) ? maybeToUndefined (professionName) : undefined,
      pv: maybeToUndefined (professionVariant),
      sex,
      pers: {
        family: maybeToUndefined (PersonalDataG.family (personalData)),
        placeofbirth: maybeToUndefined (PersonalDataG.placeOfBirth (personalData)),
        dateofbirth: maybeToUndefined (PersonalDataG.dateOfBirth (personalData)),
        age: maybeToUndefined (PersonalDataG.age (personalData)),
        haircolor: maybeToUndefined (PersonalDataG.hairColor (personalData)),
        eyecolor: maybeToUndefined (PersonalDataG.eyeColor (personalData)),
        size: maybeToUndefined (PersonalDataG.size (personalData)),
        weight: maybeToUndefined (PersonalDataG.weight (personalData)),
        title: maybeToUndefined (PersonalDataG.title (personalData)),
        socialstatus: maybeToUndefined (PersonalDataG.socialStatus (personalData)),
        characteristics: maybeToUndefined (PersonalDataG.characteristics (personalData)),
        otherinfo: maybeToUndefined (PersonalDataG.otherInfo (personalData)),
        cultureAreaKnowledge:
          maybeToUndefined (PersonalDataG.cultureAreaKnowledge (personalData)),
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
        enabledRuleBooks: toArray (RulesG.enabledRuleBooks (rules)),
      },
      pets: getPetsForSave (hero),
    }

    return obj
  }

const { present } = UndoableHeroG

export const convertHeroesForSave =
  (wiki: WikiModelRecord) =>
  (locale: L10nRecord) =>
  (users: OrderedMap<string, Data.User>) =>
  (heroes: OrderedMap<string, UndoableHeroModelRecord>) =>
    map (pipe (present, convertHeroForSave (wiki) (locale) (users)))
        (elems (heroes))
