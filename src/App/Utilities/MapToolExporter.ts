import { OrderedMap } from "../../Data/OrderedMap"
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { HeroModelRecord } from "../Models/Hero/HeroModel"
import { Record } from "../../Data/Record"
import { pipe, pipe_ } from "./pipe"
import { mapMaybe, maybe, Maybe } from "../../Data/Maybe"
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
import { getWikiAdvantages, getWikiDisadvantages, getWikiItemTemplates } from "../Selectors/stateSelectors"
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
import { StaticData } from "../Models/Wiki/WikiModel"

type MaptoolsEntry = {
  key: string
  value: string
}

enum MaptoolsAttribute {
  MU, KL, IN, CH, FF, GE, KO, KK
}

type MaptoolsSkill = {
  name: string
  value: number
  attr1: MaptoolsAttribute
  attr2: MaptoolsAttribute
  attr3: MaptoolsAttribute
}

type MapToolsSkillGroup = {
  groupName: String
  skills: List<MaptoolsSkill>
}

export function getPropertiesXML (): string {
  return "<?xml version=\"1.0\"?><map><entry><string>version</string><string>1.7.0</string></entry>"
  + "<entry><string>herolab</string><boolean>false</boolean></entry></map>"
}

function entry (mtentry: MaptoolsEntry): string {
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

  xml += entry ({ key: "APgesamt", value: "1150" })
  xml += entry ({ key: "APausgegeben", value: "1100" })
  xml += entry ({ key: "APverfuegbar", value: "50" })

  return xml
}

function skillGroupNameForMapTool (group: Record<SkillGroup>): string {
  switch (group.values.name) {
    case "Körper":
      return "Koerper"
    case "Gesellschaft":
      return "Gesellschaft"
    case "Natur":
      return "Natur"
    case "Wissens":
      return "Wissen"
    case "Handwerk":
      return "Handwerk"
    default:
      return "Gaben"
  }
}

function buildSkill (skillFromWiki: Record<Skill>):
(skillFromHero: Maybe<Record<SkillDependent>>) => MaptoolsSkill {
  return skillFromHero => {
    const skillHero: Record<SkillDependent> = fromMaybe (null, skillFromHero)
    if (skillHero === null) {
      return {
        name: Skill.A.name (skillFromWiki),
        value: SkillDependent.A.value (skillHero),
        attr1: Skill.A.check (skillFromWiki)[0], // Wie kann ich auf die einzelnen Elemente der List zugreifen?
        attr2: Skill.A.check (skillFromWiki)[1],
        attr3: Skill.A.check (skillFromWiki)[2]
      }
    }
    else {
      return {
        name: Skill.A.name (skillFromWiki),
        value: 0,
        attr1: Skill.A.check (skillFromWiki)[0],
        attr2: Skill.A.check (skillFromWiki)[1],
        attr3: Skill.A.check (skillFromWiki)[2]
      }
    }
  }
}

function getTalentsXML (hero: HeroModelRecord, state: AppStateRecord): string {
  const buildSkillList =
  pipe (
    SkillGroup.A.id,
    grid =>
      pipe_ (state.values.wiki.values.skills,
        OrderedMap.filter (skill => Skill.A.gr (skill) === grid),
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

  let xml = `[${
   pipe_ (skills,
      fmap ((sg: MapToolsSkillGroup) => ({
        key: sg.groupName,
        value: pipe_ (sg.skills,
          fmap ((skill: MaptoolsSkill) =>
            `{"Talent":"${skill.name}","Talentwert":${skill.value}},"Probe":{`
            + `"Eigenschaft1":"${skill.attr1}",`
            + `"Eigenschaft2":"${skill.attr2}",`
            + `"Eigenschaft3":"${skill.attr3}"}}`)),
      })))
   }]`

  // TODO: Zauber/Rituale und Liturgien/Zeremonien noch herausfinden
  // erstmal muss aber der code weiter oben funktionieren. Das wird dann ja so ähnlich ablaufen

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

function specialAbilityGroupForMapTool (group: Maybe<Record<NumIdName>>) : string {
  const g = fromMaybe (null, group)
  if (g === null) {
    return "AllgemeineSF"
  }

  switch (g.values.name) {
    case "Allgemein":
    case "Befehle":
    case "Lykanthropie":
    case "Paktgeschenke":
    case "Schicksal":
    case "Sex":
    case "Sex-Schicksal":
    case "Talent (erweitert)":
    case "Talentstile":
    case "Vampirismus":
      return "AllgemeineSF"
    case "Ahnenzeichen":
    case "Bann-/Schutzkreise":
    case "Bannschwert":
    case "Chronikzauber":
    case "Dolchrituale":
    case "Gewandzauber":
    case "Gildenmagische Kugelzauber":
    case "Hexe":
    case "Instrumentzauber":
    case "Kappenzauber":
    case "Kesselzauber":
    case "Magisch":
    case "Magisch (erweitert)":
    case "Magische Traditionen":
    case "Ringzauber":
    case "Schalenzauber":
    case "Scharlatanische Kugelzauber":
    case "Sichelrituale":
    case "Spielzeugzauber":
    case "Stabzauber":
    case "Steckenzauber":
    case "Waffenzauber (Animisten)":
    case "Zauberstile":
      return "MagieSF"
    case "Kampf":
    case "Kampf (erweitert)":
    case "Kampfstile (bewaffnet)":
    case "Kampfstile (unbewaffnet)":
    case "Prügel":
      return "KampfSF"
    case "Karmal":
    case "Karmal (erweitert)":
    case "Karmale Traditionen":
    case "Liturgiestile":
    case "Predigten":
    case "Visionen":
    case "Zeremonialgegenstände":
      return "KlerikaleSF"
    default:
      return "AllgemeineSF"
  }
}

function getSpecialAbilitiesXML (hero: HeroModelRecord, state: AppStateRecord): string {

  const ungrouped: List<MaptoolsEntry> = pipe_ (
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

  const groups: string[] = [ "AllgemeineSF", "MagieSF", "KampfSF", "KlerikaleSF" ]

  //Das hier funktioniert noch nicht.
  //Irgendein Typfehler. Keine Ahnung woran das liegt
  return pipe_ (groups,
    fmap ((group: string) => entry ({
      key: group,
      value: `[${
        pipe_ (
          ungrouped,
          List.filter ((entry: MaptoolsEntry) => entry.key === group),
          List.intercalate (", ")
        )
      }]`,
    })),
    List.intercalate(""))
}

type MapToolWeaponBase = {
  name: string
  isImprovisedWeapon: boolean
  combatTechnique: string
  damageDiceNumber: Maybe<number>
  damageDiceSides: Maybe<number>
  damageFlat: number
}

let id = 0

function weaponForXML (weapon: MapToolWeaponBase): string {
  return `"ID":${id++},`
  + `"Name":"${weapon.name}",`
  + `"Improvisiert":"${weapon.isImprovisedWeapon ? "1" : "0"},`
  + `"Technik":"${weapon.combatTechnique}",`
  + `"TP":"${weapon.damageDiceNumber}d${weapon.damageDiceSides}+${weapon.damageFlat}",`
}

function getReachText (reach: Maybe<number>, state: AppStateRecord): string {
  const reaches = StaticData.A.reaches(state.values.wiki)
  const x: Record<NumIdName> = fromMaybe (null, OrderedMap.lookupF (reaches) (fromMaybe(-1, reach)))
  return x.values.name
}

function meleeWeaponForXML (state: AppStateRecord) : (weapon: Record<MeleeWeapon>) => string {
  return weapon =>
    `{${
    weaponForXML (weapon.values)
    }"RW":"${getReachText(weapon.values.reach, state)}",` //Reach ist eine Number. Hier soll "Kurz, Mittel, Lang" stehen, je nachdem. Wie bekomme ich das heraus?
    + `"AT":${fromMaybe (0, weapon.values.atMod)},`
    + `"PA":${fromMaybe (0, weapon.values.paMod)},`
    + `"S":${fromMaybe (0, weapon.values.primaryBonus)},` //Wie bekomme ich die Schadensschwelle?
    + `"Parierwaffe":${weapon.values.}}` //Dieses Feld fehlt ja noch
}

function rangedWeaponForXML (weapon: Record<RangedWeapon>): string {
  return `{${
   weaponForXML (weapon.values) // geht nicht weil rangeWeapon kein isImprovised-Feld hat
   }"RW1":${fromMaybe (0, weapon.values.range)[0]},`
  + `"RW2":${fromMaybe (0, weapon.values.range)[1]},`
  + `"RW3":${fromMaybe (0, weapon.values.range)[2]},`
  + `"Ladezeit":${fromMaybe (0, weapon.values.reloadTime)}}`
}

function combatTechniqueForXML (technique: Record<CombatTechniqueWithRequirements>): string {

  return "{"
  + `"Name":"${technique.values.wikiEntry.values.name}",`
  + `"FW":${technique.values.stateEntry.values.value},`
  + `"L":${List.intercalate (", ") (technique.values.wikiEntry.values.primary)},`
}

function getCombatXML (hero: HeroModelRecord, state: AppStateRecord): string {
  let xml = ""

  const techniques: string = pipe_ (
    fromMaybe (List.empty, getAllCombatTechniques (state, { hero })),
    fmap (combatTechniqueForXML),
    List.intercalate (", ")
  )

  xml += entry ({ key: "Kampftechniken", value: techniques })

  id = 0
  const melee = `[${
   pipe_ (
    fromMaybe (List.empty, getMeleeWeapons (state, { hero })),
    fmap (meleeWeaponForXML (state)),
    List.intercalate (", ")
   )
  }]`

  id = 0
  const ranged = `[${
   pipe_ (
    getRangedWeapons (state),
    maybe ("")
          (pipe (
            fmap (rangedWeaponForXML),
            List.intercalate (", ")
          ))
   )
  }]`

  xml += entry ({ key: "Nahkampfwaffen", value: melee })
  xml += entry ({ key: "Fernkampfwaffen", value: ranged })

  xml += entry ({ key: "AW", value: `${getDO (state, { hero }).values.value}` })

  // TODO: Rüstung eintragen
  // Wie unterscheide ich zwischen Armors und ArmorZones?
  // Ich würde das gerne so machen dass ich jedes mögliche Rüstungsset exportiere
  // In maptools kann man dann anklicken ob man die Plattenrüstung oder die Winterkleidung trägt

  const armors: List<Record<Armor>> = fromMaybe (List.empty, getArmors (state))
  xml += pipe_ (armors,
    fmap ((armor: Armor) => `{hier ist noch nichts fertig}` ),
    List.intercalate (", "))

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
