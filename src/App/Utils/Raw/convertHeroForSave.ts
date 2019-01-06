import { pipe } from "ramda";
import { ident } from "../../../Data/Function";
import { List, map } from "../../../Data/List";
import { bind, elem, fmap, maybeToUndefined } from "../../../Data/Maybe";
import { elems, foldl, foldlWithKey, OrderedMap, OrderedMapValueElement, toObjectWith, union } from "../../../Data/OrderedMap";
import { toArray } from "../../../Data/OrderedSet";
import { Record, StringKeyObject, toObject } from "../../../Data/Record";
import * as Raw from "../../../types/rawdata";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { Belongings } from "../../Models/Hero/Belongings";
import { Energies } from "../../Models/Hero/Energies";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import * as Data from "../../Models/Hero/heroTypeHelpers";
import { HitZoneArmor } from "../../Models/Hero/HitZoneArmor";
import { Item } from "../../Models/Hero/Item";
import { PersonalData } from "../../Models/Hero/PersonalData";
import { Rules } from "../../Models/Hero/Rules";
import { UndoableHero, UndoableHeroModelRecord } from "../../Models/Hero/UndoHero";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { PrimaryAttributeDamageThreshold } from "../../Models/Wiki/sub/PrimaryAttributeDamageThreshold";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { getAPObject } from "../AdventurePoints/adventurePointsSumUtils";
import { HeroStateMapKey } from "../heroStateUtils";
import { ifElse } from "../ifElse";
import { gt } from "../mathUtils";
import { currentVersion } from "./compatibilityUtils";

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
} = HeroModel.A

const { id, value } = AttributeDependent.A
const { active } = ActivatableSkillDependent.A
const { active: activeList } = ActivatableDependent.A
const { items, armorZones, purse } = Belongings.A

const {
  addedArcaneEnergyPoints,
  addedKarmaPoints,
  addedLifePoints,
  permanentArcaneEnergyPoints,
  permanentKarmaPoints,
  permanentLifePoints,
} = Energies.A

const { cost, sid, sid2, tier } = ActiveObject.A

const getAttributesForSave = (hero: HeroModelRecord): Raw.RawHero["attr"] =>
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
        [key]: List.foldl<Record<ActiveObject>, Raw.RawActiveObject[]>
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

const { primary, threshold } = PrimaryAttributeDamageThreshold.A

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
          id: HitZoneArmor.A.id (obj),
          name: HitZoneArmor.A.name (obj),
          head: maybeToUndefined (HitZoneArmor.A.head (obj)),
          headLoss: maybeToUndefined (HitZoneArmor.A.headLoss (obj)),
          leftArm: maybeToUndefined (HitZoneArmor.A.leftArm (obj)),
          leftArmLoss: maybeToUndefined (HitZoneArmor.A.leftArmLoss (obj)),
          rightArm: maybeToUndefined (HitZoneArmor.A.rightArm (obj)),
          rightArmLoss: maybeToUndefined (HitZoneArmor.A.rightArmLoss (obj)),
          torso: maybeToUndefined (HitZoneArmor.A.torso (obj)),
          torsoLoss: maybeToUndefined (HitZoneArmor.A.torsoLoss (obj)),
          leftLeg: maybeToUndefined (HitZoneArmor.A.leftLeg (obj)),
          leftLegLoss: maybeToUndefined (HitZoneArmor.A.leftLegLoss (obj)),
          rightLeg: maybeToUndefined (HitZoneArmor.A.rightLeg (obj)),
          rightLegLoss: maybeToUndefined (HitZoneArmor.A.rightLegLoss (obj)),
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
                                              (OrderedMap.lookupF<string, Data.User> (users))

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
        total: adventurePoints.get ("total"),
        spent: adventurePoints.get ("spent"),
      },
      el: experienceLevel,
      r: maybeToUndefined (race),
      rv: maybeToUndefined (raceVariant),
      c: maybeToUndefined (culture),
      p: maybeToUndefined (profession),
      professionName: elem ("P_0") (profession) ? maybeToUndefined (professionName) : undefined,
      pv: maybeToUndefined (professionVariant),
      sex,
      pers: {
        family: maybeToUndefined (PersonalData.A.family (personalData)),
        placeofbirth: maybeToUndefined (PersonalData.A.placeOfBirth (personalData)),
        dateofbirth: maybeToUndefined (PersonalData.A.dateOfBirth (personalData)),
        age: maybeToUndefined (PersonalData.A.age (personalData)),
        haircolor: maybeToUndefined (PersonalData.A.hairColor (personalData)),
        eyecolor: maybeToUndefined (PersonalData.A.eyeColor (personalData)),
        size: maybeToUndefined (PersonalData.A.size (personalData)),
        weight: maybeToUndefined (PersonalData.A.weight (personalData)),
        title: maybeToUndefined (PersonalData.A.title (personalData)),
        socialstatus: maybeToUndefined (PersonalData.A.socialStatus (personalData)),
        characteristics: maybeToUndefined (PersonalData.A.characteristics (personalData)),
        otherinfo: maybeToUndefined (PersonalData.A.otherInfo (personalData)),
        cultureAreaKnowledge:
          maybeToUndefined (PersonalData.A.cultureAreaKnowledge (personalData)),
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
        enabledRuleBooks: toArray (Rules.A.enabledRuleBooks (rules)),
      },
      pets: getPetsForSave (hero),
    }

    return obj
  }

const { present } = UndoableHero.A

export const convertHeroesForSave =
  (wiki: WikiModelRecord) =>
  (locale: L10nRecord) =>
  (users: OrderedMap<string, Data.User>) =>
  (heroes: OrderedMap<string, UndoableHeroModelRecord>) =>
    map (pipe (present, convertHeroForSave (wiki) (locale) (users)))
        (elems (heroes))
