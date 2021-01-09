import { OrderedMap } from "../../Data/OrderedMap"
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { Record } from "../../Data/Record"
import { pipe, pipe_ } from "./pipe"
import { isJust, isNothing, mapMaybe, maybe, Maybe } from "../../Data/Maybe"
import { fmap } from "../../Data/Functor"
import { getAE, getDO, getINI, getKP, getLP, getMOV, getSPI, getTOU } from "../Selectors/derivedCharacteristicsSelectors"
import { AppStateRecord } from "../Models/AppState"
import { fromMaybe } from "../../Data/Maybe.bs"
import { getFatePointsModifier } from "../Selectors/activatableSelectors"
import { getArmors, getArmorZones, getFullItem, getMeleeWeapons, getRangedWeapons } from "../Selectors/equipmentSelectors"
import { MeleeWeapon } from "../Models/View/MeleeWeapon"
import { List } from "../../Data/List"
import { RangedWeapon } from "../Models/View/RangedWeapon"
import { getAllCombatTechniques } from "../Selectors/combatTechniquesSelectors"
import { CombatTechniqueWithRequirements } from "../Models/View/CombatTechniqueWithRequirements"
import { getWiki, getWikiAdvantages, getWikiDisadvantages, getWikiItemTemplates } from "../Selectors/stateSelectors"
import { Item } from "../Models/Hero/Item"
import { Advantage } from "../Models/Wiki/Advantage"
import { Disadvantage } from "../Models/Wiki/Disadvantage"
import { Skill } from "../Models/Wiki/Skill"
import { NumIdName } from "../Models/NumIdName"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { SkillGroup } from "../Models/Wiki/SkillGroup"
import { SkillDependent } from "../Models/ActiveEntries/SkillDependent"
import { Attribute } from "../Models/Wiki/Attribute"
import { Armor } from "../Models/View/Armor"
import { AttributeDependent } from "../Models/ActiveEntries/AttributeDependent"
import { HitZoneArmorForView } from "../Models/View/HitZoneArmorForView"
import { PrimaryAttributeDamageThreshold } from "../Models/Wiki/sub/PrimaryAttributeDamageThreshold"
import { isTuple, Pair } from "../../Data/Tuple"
import { CombatTechnique } from "../Models/Wiki/CombatTechnique"
import { getAPObjectMap } from "../Selectors/adventurePointsSelectors"
import { Spell } from "../Models/Wiki/Spell"
import { ReduxAction } from "../Actions/Actions"
import { showSaveDialog } from "./IOUtils"
import { Either, isLeft, isRight, Right } from "../../Data/Either"
import { flip } from "../../Data/Function"
import { addAlert, addDefaultErrorAlert, AlertOptions } from "../Actions/AlertActions"
import { translate } from "./I18n"
import { handleE } from "../../Control/Exception"
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant"
import { ActivatableSkillDependent } from "../Models/ActiveEntries/ActivatableSkillDependent"
import { StaticData } from "../Models/Wiki/WikiModel"
import { writeFile } from "../../System/IO"

type MapToolsEntry = {
  key: string
  value: string
}

enum MapToolsAttribute {
  MU, KL, IN, CH, FF, GE, KO, KK
}

type MapToolsSkill = {
  name: string
  value: number
  attr1: MapToolsAttribute
  attr2: MapToolsAttribute
  attr3: MapToolsAttribute
}

type GroupedMaptoolsSkill = MapToolsSkill & {
  gr: number
}

// Die folgeden beiden Typen können erweitert werden um z.B. AsP-Kosten oder Traditionen festzuhalten
type MapToolsSpell = GroupedMaptoolsSkill & {
}

type MapToolsChant = GroupedMaptoolsSkill & {
}

type MapToolsSkillGroup = {
  groupName: string
  skills: List<MapToolsSkill>
}

export function getPropertiesXML (): string {
  return "<?xml version=\"1.0\"?><map><entry><string>version</string><string>1.7.0</string></entry>"
  + "<entry><string>herolab</string><boolean>false</boolean></entry></map>"
}

function entry (mtentry: MapToolsEntry): string {
  return "<entry>"
  + `<string>${mtentry.key.toLowerCase ()}</string>`
  + "<net.rptools.CaseInsensitiveHashMap_-KeyValue>"
  + `<key>${mtentry.key}</key>`
  + `<value class="string">${mtentry.value}</value>`
  + "<outer-class reference=\"../../../..\"/>"
  + "</net.rptools.CaseInsensitiveHashMap_-KeyValue>"
  + "</entry>"
}

function getStaticDataXML (hero: HeroModelRecord): string {
  return "<id>"
  + "<baGUID>eIj9Afv6STWmcKmhxyfaJQ==</baGUID>"
  + "</id>"
  + "<beingImpersonated>false</beingImpersonated>"
  + "<exposedAreaGUID>"
  + "<baGUID>CgAADK1LundsAAAAAgAADA==</baGUID>"
  + "</exposedAreaGUID>"
  + "<imageAssetMap>"
  + "<entry>"
  + "<null/>"
  + "<net.rptools.lib.MD5Key>"
  + "<id>f427aa49b28500217ac46ba37c2998a4</id>"
  + "</net.rptools.lib.MD5Key>"
  + "</entry>"
  + "</imageAssetMap>"
  + "<anchorX>0</anchorX>"
  + "<anchorY>0</anchorY>"
  + "<sizeScale>1.0</sizeScale>"
  + "<snapToScale>true</snapToScale>"
  + "<width>50</width>"
  + "<height>50</height>"
  + "<isoWidth>50</isoWidth>"
  + "<isoHeight>50</isoHeight>"
  + "<scaleX>1.0</scaleX>"
  + "<scaleY>1.0</scaleY>"
  + "<sizeMap>"
  + "<entry>"
  + "<java-class>net.rptools.maptool.model.SquareGrid</java-class>"
  + "<net.rptools.maptool.model.GUID>"
  + "<baGUID>CgAADK1LundsAAAAAgAADA==</baGUID>"
  + "</net.rptools.maptool.model.GUID>"
  + "</entry>"
  + "</sizeMap>"
  + "<snapToGrid>false</snapToGrid>"
  + "<isVisible>true</isVisible>"
  + "<visibleOnlyToOwner>false</visibleOnlyToOwner>"
  + "<vblColorSensitivity>0</vblColorSensitivity>"
  + "<alwaysVisibleTolerance>0</alwaysVisibleTolerance>"
  + "<isAlwaysVisible>false</isAlwaysVisible>"
  + `<name>${hero.values.name}</name>`
  + "<ownerType>0</ownerType>"
  + "<tokenShape>CIRCLE</tokenShape>"
  + "<tokenType>PC</tokenType>"
  + "<layer>TOKEN</layer>"
  + "<propertyType>Basic</propertyType>"
  + "<tokenOpacity>1.0</tokenOpacity>"
  + "<terrainModifier>0.0</terrainModifier>"
  + "<terrainModifiersIgnored>"
  + "<net.rptools.maptool.model.Token_-TerrainModifierOperation>NONE"
  + "</net.rptools.maptool.model.Token_-TerrainModifierOperation>"
  + "</terrainModifiersIgnored>"
  + "<isFlippedX>false</isFlippedX>"
  + "<isFlippedY>false</isFlippedY>"
  + "<hasSight>false</hasSight>"
  + "<state/>"
}

function getAttributesXML (hero: HeroModelRecord, state: AppStateRecord): string {
  let xml: string = pipe_ (
    state.values.wiki.values.attributes,
    OrderedMap.elems,
    mapMaybe ((attr: Record<Attribute>) =>
      pipe_ (
        attr,
        Attribute.A.id,
        OrderedMap.lookupF (hero.values.attributes),
        fmap ((stateEntry: Record<AttributeDependent>) => entry ({
          key: Attribute.A.short (attr),
          value: AttributeDependent.A.value (stateEntry).toString (),
        }))
      )),
    List.intercalate ("")
  )

  const leP: number = fromMaybe (0, getLP (state, { hero }).values.value)
  const asp: number = fromMaybe (0, getAE (state, { hero }))
  const kap: number = fromMaybe (0, getKP (state, { hero }).values.value)
  const schips: number = 3 + getFatePointsModifier (state)
  const sk: number = fromMaybe (0, getSPI (state, { hero }).values.value)
  const zk: number = fromMaybe (0, getTOU (state, { hero }).values.value)
  const ini = fromMaybe (0, getINI (state, { hero }).values.value)
  const gs = fromMaybe (0, getMOV (state, { hero }).values.value)

  xml += entry ({ key: "LeP", value: leP.toString () })
  xml += entry ({ key: "MaxLeP", value: leP.toString () })

  xml += entry ({ key: "SchipsAktuell", value: schips.toString () })
  xml += entry ({ key: "SchipsMax", value: schips.toString () })

  // AsP und KaP nur eintragen wenn welche vorhanden sind. Wenn der Held kein Zauberer/Geweihter ist KEINE entries machen
  if (asp > 0) {
    xml += entry ({ key: "AsP", value: asp.toString () })
    xml += entry ({ key: "MaxAsP", value: asp.toString () })
  }
  if (kap > 0) {
    xml += entry ({ key: "KaP", value: kap.toString () })
    xml += entry ({ key: "MaxKaP", value: kap.toString () })
  }

  xml += entry ({ key: "SK", value: sk.toString () })
  xml += entry ({ key: "ZK", value: zk.toString () })

  xml += entry ({ key: "INI", value: ini.toString () })
  xml += entry ({ key: "GS", value: gs.toString () })

  const ap = getAPObjectMap (hero.values.id) (state, { hero })
  if (isJust (ap)) {
    const ap2 = ap.value
    if (isJust (ap2)) {
      xml += entry ({ key: "APgesamt", value: hero.values.adventurePointsTotal.toString () })
      xml += entry ({ key: "APausgegeben", value: ap2.value.values.spent.toString () })
      xml += entry ({ key: "APverfuegbar", value: ap2.value.values.available.toString () })
    }
  }

  return xml
}

function skillGroupNameForMapTool (group: Record<SkillGroup>): string {
  switch (group.values.id) {
    case 1:
      return "Koerper"
    case 2:
      return "Gesellschaft"
    case 3:
      return "Natur"
    case 4:
      return "Wissen"
    case 5:
      return "Handwerk"
    default:
      return "Gaben"
  }
}

function buildSkill (skillFromWiki: Record<Skill>):
(skillFromHero: Maybe<Record<SkillDependent>>) => MapToolsSkill {
  return skillFromHero => ({
    name: Skill.A.name (skillFromWiki),
    value: isJust (skillFromHero) ? SkillDependent.A.value (skillFromHero.value) : 0,
    attr1: (fromMaybe ("MU", List.subscript (Skill.A.check (skillFromWiki)) (0)) as MapToolsAttribute),
    attr2: (fromMaybe ("MU", List.subscript (Skill.A.check (skillFromWiki)) (1)) as MapToolsAttribute),
    attr3: (fromMaybe ("MU", List.subscript (Skill.A.check (skillFromWiki)) (2)) as MapToolsAttribute),
  })
}

function buildSpell (spellFromWiki: Record<Spell>):
(spellFromHero: Record<ActivatableSkillDependent>) => MapToolsSpell {
  return spellFromHero => ({
    name: Spell.A.name (spellFromWiki),
    value: ActivatableSkillDependent.A.value (spellFromHero),
    attr1: (fromMaybe ("MU", List.subscript (Spell.A.check (spellFromWiki)) (0)) as MapToolsAttribute),
    attr2: (fromMaybe ("MU", List.subscript (Spell.A.check (spellFromWiki)) (1)) as MapToolsAttribute),
    attr3: (fromMaybe ("MU", List.subscript (Spell.A.check (spellFromWiki)) (2)) as MapToolsAttribute),
    gr: Spell.A.gr (spellFromWiki),
  })
}

function buildChant (chantFromWiki: Record<LiturgicalChant>):
(chantFromHero: Record<ActivatableSkillDependent>) => MapToolsChant {
  return chantFromHero => ({
    name: LiturgicalChant.A.name (chantFromWiki),
    value: ActivatableSkillDependent.A.value (chantFromHero),
    attr1: (fromMaybe ("MU", List.subscript (LiturgicalChant.A.check (chantFromWiki)) (0)) as MapToolsAttribute),
    attr2: (fromMaybe ("MU", List.subscript (LiturgicalChant.A.check (chantFromWiki)) (1)) as MapToolsAttribute),
    attr3: (fromMaybe ("MU", List.subscript (LiturgicalChant.A.check (chantFromWiki)) (2)) as MapToolsAttribute),
    gr: LiturgicalChant.A.gr (chantFromWiki),
  })
}

function getTalentsXML (hero: HeroModelRecord, state: AppStateRecord): string {
  const buildSkillList =
  pipe (
    SkillGroup.A.id,
    grid =>
      pipe_ (state.values.wiki.values.skills,
        OrderedMap.filter (skill => Skill.A.gr (skill) == grid),
        OrderedMap.elems,
        fmap ((skill: Record<Skill>) => pipe_ (skill,
          Skill.A.id,
          OrderedMap.lookupF (hero.values.skills),
          buildSkill (skill))))
  )

  const skills: List<MapToolsSkillGroup> =
  pipe_ (state.values.wiki.values.skillGroups,
    OrderedMap.elems,
    fmap (
      (g: Record<SkillGroup>) => ({
        groupName: skillGroupNameForMapTool (g),
        skills: buildSkillList (g),
      })
  ))

  let xml: string =
    pipe_ (skills,
      fmap ((sg: MapToolsSkillGroup) => entry({
        key: sg.groupName,
        value: `[${pipe_(sg.skills,
          fmap((skill: MapToolsSkill) =>
            `{"Talent":"${skill.name}","Talentwert":${skill.value}},"Probe":{`
            + `"Eigenschaft1":"${skill.attr1}",`
            + `"Eigenschaft2":"${skill.attr2}",`
            + `"Eigenschaft3":"${skill.attr3}"}}`),
          List.intercalate(","))}]`,
      })),
      List.intercalate("")
    )

  // TODO: Zauber/Rituale und Liturgien/Zeremonien noch herausfinden
  // AsP- bzw. KaP-Kosten könnte man auch exportieren

  const allSpells =
    pipe_ (
      hero,
      HeroModel.A.spells,
      OrderedMap.elems,
      Maybe.mapMaybe ((heroSpell: Record<ActivatableSkillDependent>) => pipe_ (
        heroSpell,
        ActivatableSkillDependent.A.id,
        OrderedMap.lookupF (StaticData.A.spells (state.values.wiki)),
        fmap ((staticSpell: Record<Spell>) => buildSpell (staticSpell) (heroSpell))
      )),
      List.partition (skill => skill.gr == 1)
    )

  const spells = allSpells.values [0]
  const rituals = allSpells.values [1]

  const entrySpell = (key: string, spells: List<MapToolsSkill>) => entry({
    key: key,
    value: "[" + pipe_ (spells,
    fmap ((spell: MapToolsSkill) =>
      `{"Talent":"${spell.name}","Talentwert":${spell.value}},"Probe":{`
      + `"Eigenschaft1":"${spell.attr1}",`
      + `"Eigenschaft2":"${spell.attr2}",`
      + `"Eigenschaft3":"${spell.attr3}"}}`
    ),
    List.intercalate(",")) + "]"
  })

  xml += entrySpell ("Zauber", spells)
  xml += entrySpell ("Rituale", rituals)

  const allChants =
    pipe_ (
      hero,
      HeroModel.A.liturgicalChants,
      OrderedMap.elems,
      Maybe.mapMaybe ((heroChant: Record<ActivatableSkillDependent>) => pipe_ (
        heroChant,
        ActivatableSkillDependent.A.id,
        OrderedMap.lookupF (StaticData.A.liturgicalChants (state.values.wiki)),
        fmap ((staticChant: Record<LiturgicalChant>) => buildChant (staticChant) (heroChant))
      )),
      List.partition (chant => chant.gr == 1)
    )

  const chants = allChants.values [0]
  const ceremonies = allChants.values [1]
  
  xml += entrySpell ("Liturgien", chants)
  xml += entrySpell ("Zeremonien", ceremonies)

  return xml
}

function getAdvantagesXML (hero: HeroModelRecord, state: AppStateRecord): string {
  let xml = ""

  const getAdvantageName = pipe (
    ActivatableDependent.A.id,
    OrderedMap.lookupF (getWikiAdvantages (state)),
    fmap (Advantage.A.name)
  )

  xml += entry ({
    key: "Vorteile",
    value: pipe_ (
      hero.values.advantages,
      OrderedMap.elems,
      Maybe.mapMaybe (getAdvantageName),
      List.intercalate (", ")
    ) })

  const getDisadvantageName = pipe (
    ActivatableDependent.A.id,
    OrderedMap.lookupF (getWikiDisadvantages (state)),
    fmap (Disadvantage.A.name)
  )

  xml += entry ({
    key: "Nachteile",
    value: pipe_ (
      hero.values.disadvantages,
      OrderedMap.elems,
      Maybe.mapMaybe (getDisadvantageName),
      List.intercalate (", ")
    ) })

  return xml
}

function specialAbilityGroupForMapTool (group: Maybe<Record<NumIdName>>): string {
  const g: Record<NumIdName> = fromMaybe (null, group)
  if (g === null) {
    return "AllgemeineSF"
  }

  switch (g.values.id) {
    case 1:
    case 2:
    case 30:
    case 31:
    case 32:
    case 33:
    case 34:
    case 40:
    case 41:
      return "AllgemeineSF"
    case 4:
    case 5:
    case 6:
    case 8:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 22:
    case 28:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 42:
    case 43:
    case 44:
    case 45:
      return "MagieSF"
    case 3:
    case 9:
    case 10:
    case 11:
    case 12:
    case 21:
      return "KampfSF"
    case 7:
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
    case 29:
      return "KlerikaleSF"
    default:
      return "AllgemeineSF"
  }
}

function getSpecialAbilitiesXML (hero: HeroModelRecord, state: AppStateRecord): string {
  const ungrouped: List<MapToolsEntry> = pipe_ (
    hero.values.specialAbilities,
    OrderedMap.keys,
    Maybe.mapMaybe (OrderedMap.lookupF (state.values.wiki.values.specialAbilities)),
    fmap ((x: Record<SpecialAbility>) =>
      ({ key: pipe_ (x.values.gr,
                    OrderedMap.lookupF (state.values.wiki.values.specialAbilityGroups),
                    specialAbilityGroupForMapTool),
        value: x.values.name,
      }))
  )

  const groups: List<string> = List<string> ("AllgemeineSF", "MagieSF", "KampfSF", "KlerikaleSF")

  return pipe_ (groups,
    fmap ((group: string) => entry ({
      key: group,
      value: `[${
        pipe_ (
          ungrouped,
          List.filter ((e: MapToolsEntry) => e.key === group),
          fmap ((e: MapToolsEntry) => e.value),
          List.intercalate (", ")
        )
      }]`,
    })),
    List.intercalate (""))
}

let id = 0

function weaponForXML (weapon: Record<Item>): string {
  return `"ID":${id++},`
  + `"Name":"${weapon.values.name}",`
  + `"Improvisiert":"${isNothing (weapon.values.improvisedWeaponGroup) ? "0" : "1"},`
  + `"Technik":"${fromMaybe ("", weapon.values.combatTechnique)}",`
  + `"TP":"${fromMaybe (1, weapon.values.damageDiceNumber)}d${fromMaybe (6, weapon.values.damageDiceSides)}+${fromMaybe (0, weapon.values.damageFlat)}"`
}

/* function getReachText (reach: Maybe<number>, state: AppStateRecord): string {
  const reaches = StaticData.A.reaches (state.values.wiki)
  const x: Record<NumIdName> = fromMaybe (null, OrderedMap.lookupF (reaches) (fromMaybe (2, reach)))
  switch (x.values.id) {
    case 1:
      return "Kurz"
    case 2:
      return "Mittel"
    case 3:
      return "Lang"
    case 4:
      return "Überlang"
    default:
      return "Mittel"
  }
}*/

function LSPair (s: number): (l: string) => string {
  return l => `{"L":"${l}", "S":${s}}`
}

function getLS (state: AppStateRecord, weapon: Record<Item>): string {
  const damageBonus: PrimaryAttributeDamageThreshold =
    fromMaybe (null, weapon.values.damageBonus).values
  if (isJust (damageBonus.primary)) {
    if (damageBonus.primary.value === "string") {
      return `[${LSPair (damageBonus.threshold as number) (damageBonus.primary.value)}]`
    }
    else {
      return `[${LSPair ((damageBonus.threshold as Pair<number, number>).values[0]) ((damageBonus.primary.value as Pair<string, string>).values[0])}, `
      + `${LSPair ((damageBonus.threshold as Pair<number, number>).values[1]) ((damageBonus.primary.value as Pair<string, string>).values[1])}]`
    }
  }
  else {
    const technique: Record<CombatTechnique> = fromMaybe (null, OrderedMap.lookupF
      (state.values.wiki.values.combatTechniques)
      (fromMaybe ("", weapon.values.combatTechnique)))

    let i = 0

    const getThreshold =
      (num: number) =>
        isTuple (damageBonus.threshold)
          ? (damageBonus.threshold).values[num]
          : damageBonus.threshold

    return `[${pipe_ (technique.values.primary,
                fmap (LSPair (getThreshold (i++))),
                List.intercalate (", "))}]`
  }
}

function meleeWeaponForXML (state: AppStateRecord): (weapon: Record<Item>) => string {
  return weapon => `{${weaponForXML (weapon)},`
    + `"RW":"${fromMaybe (2, weapon.values.reach)}",`
    + `"AT":${fromMaybe (0, weapon.values.at)},`
    + `"PA":${fromMaybe (0, weapon.values.pa)},`
    + `"LS":${getLS (state, weapon)},`
    + `"Parierwaffe":${weapon.values.isParryingWeapon ? 1 : 0}}`
}

function rangedWeaponForXML (weapon: Record<Item>): string {
  return `{${weaponForXML (weapon)},`
  + `"RW1":${fromMaybe (0, weapon.values.range)[0]},`
  + `"RW2":${fromMaybe (0, weapon.values.range)[1]},`
  + `"RW3":${fromMaybe (0, weapon.values.range)[2]},`
  + `"Ladezeit":${fromMaybe (0, weapon.values.reloadTime)}}`
}

function combatTechniqueForXML (technique: Record<CombatTechniqueWithRequirements>): string {
  return "{"
  + `"Name":"${technique.values.wikiEntry.values.name}",`
  + `"FW":${technique.values.stateEntry.values.value},`
  + `"L":${List.intercalate (", ") (technique.values.wikiEntry.values.primary)}}`
}

function armorForXML (name: string, rshead: Maybe<number>, rstorso: Maybe<number>,
                      rsarmleft: Maybe<number>, rsarmright: Maybe<number>,
                      rslegleft: Maybe<number>, rslegright: Maybe<number>,
                      ini: number, mov: number, enc: number, type: string): string {
  const head: number = fromMaybe (0, rshead)
  const torso: number = fromMaybe (0, rstorso)
  const armleft: number = fromMaybe (0, rsarmleft)
  const armright: number = fromMaybe (0, rsarmright)
  const legleft: number = fromMaybe (0, rslegleft)
  const legright: number = fromMaybe (0, rslegright)
  const rs: number =
    Math.round ((head + armleft * 2 + armright * 2 + legleft * 2 + legright * 2 + torso * 5) / 14.0)

  return `{"ID":${id++},"Name":"${name}","RS":${rs}, "RSKopf":${head}, "RSTorso":${torso},`
  + `"RSArmLinks":${armleft}, "RSArmRechts":${armright},`
  + `"RSBeinLinks":${legleft}, "RSBeinRechts":${legright},`
  + `"GS":${mov}, "INI":${ini}, "Belastung":${enc}, "Typ":"${type}"}`
}


function totalArmorForXML (armor: Armor): string {
  return armorForXML (armor.name,
    armor.pro,
    armor.pro,
    armor.pro,
    armor.pro,
    armor.pro,
    armor.pro,
    armor.ini,
    armor.mov,
    fromMaybe (0, armor.enc),
    "gesamt")
}

function zoneArmorForXML (armorZones: HitZoneArmorForView): string {
  const penalty: number = armorZones.addPenalties ? 1 : 0

  return armorForXML (armorZones.name,
    armorZones.head,
    armorZones.torso,
    armorZones.leftArm,
    armorZones.rightArm,
    armorZones.leftLeg,
    armorZones.rightLeg,
    penalty,
    penalty,
    armorZones.enc,
    "zone")
}

function getCombatXML (hero: HeroModelRecord, state: AppStateRecord): string {
  let xml = ""

  const techniques: string = pipe_ (
    fromMaybe (List.empty, getAllCombatTechniques (state, { hero })),
    fmap (combatTechniqueForXML),
    List.intercalate (", ")
  )

  xml += entry ({ key: "Kampftechniken", value: techniques })

  const getItem = getFullItem
    (hero.values.belongings.values.items)
    (state.values.wiki.values.itemTemplates)

  id = 0
  const melee = `[${
   pipe_ (
    fromMaybe (List.empty, getMeleeWeapons (state, { hero })),
    fmap (MeleeWeapon.A.id),
    Maybe.mapMaybe (getItem),
    fmap (meleeWeaponForXML (state)),
    List.intercalate (", ")
   )
  }]`

  id = 0
  const ranged = `[${
   pipe_ (
    fromMaybe (List.empty, getRangedWeapons (state)),
    fmap (RangedWeapon.A.id),
    Maybe.mapMaybe (getItem),
    fmap (rangedWeaponForXML),
    List.intercalate (", ")
   )
  }]`

  xml += entry ({ key: "Nahkampfwaffen", value: melee })
  xml += entry ({ key: "Fernkampfwaffen", value: ranged })

  xml += entry ({ key: "AW", value: `${getDO (state, { hero }).values.value}` })

  const armors: List<Record<Armor>> = fromMaybe (List.empty, getArmors (state))
  const armorZones: List<Record<HitZoneArmorForView>> =
    fromMaybe (List.empty, getArmorZones (state))

  id = 0

  xml += entry ({ key: "Ruestungen",
    value: `[${
      pipe_ (List<List<string>> (
        List<string> (armorForXML
          ("Keine Rüstung", Maybe (0), Maybe (0), Maybe (0), Maybe (0), Maybe (0), Maybe (0), 0, 0, 0, "gesamt")),
        pipe_ (armors, fmap ((armor: Record<Armor>) => totalArmorForXML (armor.values))),
        pipe_ (armorZones, fmap ((armorZones: Record<HitZoneArmorForView>) =>
          zoneArmorForXML (armorZones.values)))
      ),
      List.join,
      List.intercalate (", "))
     }]` })

  return xml
}

function getBelongingsXML (hero: HeroModelRecord, state: AppStateRecord): string {
  let xml = ""
  const purse = hero.values.belongings.values.purse.values
  const imisc = `{"behaelter1":"Rucksack","behaelter2":"Guerteltasche","behaelter3":"Beutel","behaelter4":"Am Koerper getragen","behaelter5":"Satteltaschen","dukaten":${purse.d},"silbertaler":${purse.s},"heller":${purse.h},"kreuzer":${purse.k}}`
  xml += entry ({ key: "InventarMisc", value: imisc })
  const items: string[] = new Array (hero.values.belongings.values.items.value.size)
  let i = 0

  const getItem = getFullItem (hero.values.belongings.values.items) (getWikiItemTemplates (state))
  hero.values.belongings.values.items.value.forEach (value => {
    const item: Record<Item> = fromMaybe (0, getItem (value.values.id))
    items[i] = "{"
    items[i] += `"gegenstand":"${item.values.name}",`
    items[i] += `"anzahl":${value.values.amount},`
    items[i] += `"gewicht":${value.values.weight},`
    items[i] += "\"beschreibung\":\"Keine Beschreibung vorhanden\","
    items[i] += "\"behaelter\":1}"
    i++
  })
  xml += entry ({ key: "Inventar", value: items.join (",") })

  return xml
}

export function getContentXML (hero: HeroModelRecord, state: AppStateRecord): string {
  let contentXml = "<?xml version=\"1.0\"?>"

  contentXml += "<net.rptools.maptool.model.Token>"
  contentXml += getStaticDataXML (hero)
  contentXml += "<propertyMapCI><store>"
  contentXml += getAttributesXML (hero, state)
  contentXml += getTalentsXML (hero, state)
  contentXml += getAdvantagesXML (hero, state)
  contentXml += getSpecialAbilitiesXML (hero, state)
  contentXml += getCombatXML (hero, state)
  contentXml += getBelongingsXML (hero, state)
  contentXml += "</store></propertyMapCI>"
  contentXml += "</net.rptools.maptool.model.Token>"

  return contentXml
}

function getRptok (hero: HeroModelRecord, state: AppStateRecord): Buffer {
  const AdmZip = require ("adm-zip")
  const zip = new AdmZip ()
  zip.addFile ("content.xml", Buffer.from (getContentXML (hero, state)), "Content of the hero")
  zip.addFile ("properties.xml", Buffer.from (getPropertiesXML ()), "Properties")

  // TODO: Charakterbild noch exportieren und in die Zip-Datei packen
  // passend wäre es wenn wir das komplette Bild als Portrait und Handout setzen
  // als Token wäre ein kleines runden Thumbnail passend, so wie es in der Heldenliste angezeigt wird

  if (isJust (hero.values.avatar)) {
    const binaryAvatar = atob (hero.values.avatar.value)
    zip.addFile ("assets/", Buffer.from (""))
    zip.addFile ("assets/thumbkeyhashthing", Buffer.from (binaryAvatar))
  }

  return zip.toBuffer ()
}

// TODO: Das müsste sich mal jemand ansehen. Habe ich als Vorlage kopiert. Async brauche ich hier glaub ich gar nicht?
// Den aktuellen hero und state müsste ich mir irgendwo holen. Da weis ich noch nicht wie ich rankomme
// Den Text für den Button und das Export-Fenster müsste ich für die Lokalisierung auch irgendwo eintragen. Wo mache ich das?
export const requestExportHeroAsRptok = (hero: HeroModelRecord, state: AppStateRecord): ReduxAction<Promise<void>> =>
{
  async (dispatch, getState) => {
    const staticData = getWiki (state)

    const data = getRptok (hero, state)

    const path = showSaveDialog ({
                    title: translate (staticData) ("sheets.dialogs.rptokexportsavelocation.title"),
                    defaultPath: `${hero.name}.rptok`,
                    filters: [
                      { name: "Rptok", extensions: [ "rptok" ] },
                    ],
                  })

    const res = await maybe (Promise.resolve<Either<Error, void>> (Right (undefined)))
                            (pipe (flip (writeFile) (data), handleE))
                            (path)

    if (isRight (res) && isJust (path)) {
      await dispatch (addAlert (AlertOptions ({
                                  message: translate (staticData) ("sheets.dialogs.rptoksaved"),
                                })))
    }
    else if (isLeft (res)) {
      await dispatch (addDefaultErrorAlert (staticData)
                                            (translate (staticData)
                                                      ("sheets.dialogs.rptoksaveerror.title"))
                                            (res))
    }
  }
}
