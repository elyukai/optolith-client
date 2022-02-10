import { readFileSync } from "fs-extra"
import { handleE } from "../../Control/Exception"
import { fmap } from "../../Data/Functor"
import { List } from "../../Data/List"
import { fromMaybe, isJust, isNothing, mapMaybe, Maybe } from "../../Data/Maybe"
import { lookupF, OrderedMap } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { isTuple, Pair, Tuple } from "../../Data/Tuple"
import { writeFile } from "../../System/IO"
import { ReduxAction } from "../Actions/Actions"
import { addAlert, addDefaultErrorAlert, AlertOptions } from "../Actions/AlertActions"
import { Category } from "../Constants/Categories"
import { Property } from "../Constants/Groups"
import { CombatTechniqueId } from "../Constants/Ids.gen"
import { ActivatableSkillDependent } from "../Models/ActiveEntries/ActivatableSkillDependent"
import { AttributeDependent } from "../Models/ActiveEntries/AttributeDependent"
import { SkillDependent } from "../Models/ActiveEntries/SkillDependent"
import { AppStateRecord } from "../Models/AppState"
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { Item } from "../Models/Hero/Item"
import { NumIdName } from "../Models/NumIdName"
import { ActiveActivatable, ActiveActivatableA_ } from "../Models/View/ActiveActivatable"
import { Armor } from "../Models/View/Armor"
import { AttributeWithRequirements } from "../Models/View/AttributeWithRequirements"
import { CombatTechniqueWithRequirements } from "../Models/View/CombatTechniqueWithRequirements"
import { HitZoneArmorForView } from "../Models/View/HitZoneArmorForView"
import { MeleeWeapon } from "../Models/View/MeleeWeapon"
import { RangedWeapon } from "../Models/View/RangedWeapon"
import { Advantage } from "../Models/Wiki/Advantage"
import { Attribute } from "../Models/Wiki/Attribute"
import { CombatTechnique } from "../Models/Wiki/CombatTechnique"
import { Disadvantage } from "../Models/Wiki/Disadvantage"
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant"
import { Skill } from "../Models/Wiki/Skill"
import { SkillGroup } from "../Models/Wiki/SkillGroup"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { Spell } from "../Models/Wiki/Spell"
import { PrimaryAttributeDamageThreshold } from "../Models/Wiki/sub/PrimaryAttributeDamageThreshold"
import { StaticData } from "../Models/Wiki/WikiModel"
import { getActiveForEditView, getFatePointsModifier } from "../Selectors/activatableSelectors"
import { getAPObjectMap } from "../Selectors/adventurePointsSelectors"
import { getAttributesForView } from "../Selectors/attributeSelectors"
import { getAllCombatTechniques } from "../Selectors/combatTechniquesSelectors"
import { getAE, getDO, getINI, getKP, getLP, getMOV, getSPI, getTOU } from "../Selectors/derivedCharacteristicsSelectors"
import { current_version } from "../Selectors/envSelectors"
import { getArmors, getArmorZones, getFullItem, getMeleeWeapons, getRangedWeapons } from "../Selectors/equipmentSelectors"
import { getWiki, getWikiItemTemplates } from "../Selectors/stateSelectors"
import { getBlessedTradition } from "./Activatable/traditionUtils"
import { Either, Right } from "./Either"
import { translate } from "./I18n"
import { showSaveDialog } from "./IOUtils"
import { toNewMaybe } from "./Maybe"
import { pipe, pipe_ } from "./pipe"

type MapToolsEntry = {
  key: string
  value: string
}

enum MapToolsAttribute {
  MU="MU", KL="KL", IN="IN", CH="CH", FF="FF", GE="GE", KO="KO", KK="KK"
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
  property: string
}

type MapToolsChant = GroupedMaptoolsSkill & {
}

type MapToolsSkillGroup = {
  groupName: string
  skills: List<MapToolsSkill>
}

export function getPropertiesXML (): string {
  return "<?xml version=\"1.0\"?><map><entry><string>version</string><string>1.8.5</string></entry>"
  + "<entry><string>herolab</string><boolean>false</boolean></entry></map>"
}

function entry (mtentry: MapToolsEntry): string {
  return "<entry>"
  + `<string>${mtentry.key.toLowerCase ()}</string>`
  + "<net.rptools.CaseInsensitiveHashMap_-KeyValue>"
  + `<key>${mtentry.key}</key>`
  // Das Talent Bekehren & Überzeugen enthält ein Sonderzeichen. Die Inventar-Strings müssen wir auch aufbereiten da sonst kein valides XML entsteht
  + `<value class="string">${mtentry.value.replace (/ & /gu, " &amp; ").replace (/<br>/gu, "<br/>")}</value>`
  + "<outer-class reference=\"../../../..\"/>"
  + "</net.rptools.CaseInsensitiveHashMap_-KeyValue>"
  + "</entry>"
}

function getStaticDataXML (hero: HeroModelRecord, portraitID: string): string {
  return "<imageAssetMap>"
  + "<entry>"
  + "<null/>"
  + "<net.rptools.lib.MD5Key>"
  + `<id>${portraitID}</id>`
  + "</net.rptools.lib.MD5Key>"
  + "</entry>"
  + "</imageAssetMap>"
  + `<anchorX>0</anchorX>`
  + `<anchorY>0</anchorY>`
  + `<sizeScale>1.0</sizeScale>`
  + `<snapToScale>true</snapToScale>`
  + `<width>50</width>`
  + `<height>50</height>`
  + `<isoWidth>50</isoWidth>`
  + `<isoHeight>50</isoHeight>`
  + `<scaleX>1.0</scaleX>`
  + `<scaleY>1.0</scaleY>`
  + `<sizeMap>`
  + `  <entry>`
  + `    <string>net.rptools.maptool.model.SquareGrid</string>`
  + `    <net.rptools.maptool.model.GUID>`
  + `      <baGUID>fwABAc9lFSoFAAAAKgABAQ==</baGUID>`
  + `    </net.rptools.maptool.model.GUID>`
  + `  </entry>`
  + `</sizeMap>`
  + `<snapToGrid>false</snapToGrid>`
  + `<isVisible>true</isVisible>`
  + `<visibleOnlyToOwner>false</visibleOnlyToOwner>`
  + `<vblColorSensitivity>0</vblColorSensitivity>`
  + `<alwaysVisibleTolerance>0</alwaysVisibleTolerance>`
  + `<isAlwaysVisible>false</isAlwaysVisible>`
  + `<name>${hero.values.name}</name>`
  + `<ownerType>0</ownerType>`
  + `<tokenShape>CIRCLE</tokenShape>`
  + `<tokenType>PC</tokenType>`
  + `<layer>TOKEN</layer>`
  + `<propertyType>Basic</propertyType>`
  + `<tokenOpacity>1.0</tokenOpacity>`
  + `<terrainModifier>0.0</terrainModifier>`
  + `<terrainModifiersIgnored>`
  + `<net.rptools.maptool.model.Token_-TerrainModifierOperation>NONE`
  + `</net.rptools.maptool.model.Token_-TerrainModifierOperation>`
  + `</terrainModifiersIgnored>`
  + `<isFlippedX>false</isFlippedX>`
  + `<isFlippedY>false</isFlippedY>`
  + `<charsheetImage>`
  + `<id>${portraitID}</id>`
  + `</charsheetImage>`
  + `<portraitImage>`
  + `<id>${portraitID}</id>`
  + `</portraitImage>`
  + `<hasSight>false</hasSight>`
  + `<state/>`
}

function getAttributesXML (hero: HeroModelRecord, state: AppStateRecord): string {
  // TODO: Hier werden Minimaleigenschaften leider noch nicht mit exportiert.

  let xml: string = pipe_ (
    getAttributesForView (state, { hero }),
    fromMaybe (List<Record<AttributeWithRequirements>> ()),
    mapMaybe ((attr: Record<AttributeWithRequirements>) =>
      pipe_ (
        attr,
        AttributeWithRequirements.A.wikiEntry,
        Attribute.A.id,
        OrderedMap.lookupF (hero.values.attributes),
        fmap ((stateEntry: Record<AttributeDependent>) => entry ({
          key: pipe_ (attr, AttributeWithRequirements.A.wikiEntry, Attribute.A.short),
          value: AttributeDependent.A.value (stateEntry).toString (),
        }))
      )),
    List.intercalate ("")
  )

  const leP: number = fromMaybe (0) (getLP (state, { hero }).values.value)
  const aspContainer = getAE (state, { hero })
  let asp = 0
  if (isJust (aspContainer)) {
    asp = fromMaybe (0) (aspContainer.value.values.value)
  }
  const kap: number = fromMaybe (0) (getKP (state, { hero }).values.value)
  const schips: number = 3 + getFatePointsModifier (state)
  const sk: number = fromMaybe (0) (getSPI (state, { hero }).values.value)
  const zk: number = fromMaybe (0) (getTOU (state, { hero }).values.value)
  const ini = fromMaybe (0) (getINI (state, { hero }).values.value)
  const gs = fromMaybe (0) (getMOV (state, { hero }).values.value)

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

  xml += entry ({ key: "Exporter", value: current_version })

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

function attrFromString (attr: string): MapToolsAttribute {
  switch (attr.split ("_")[1]) {
    case "1": return MapToolsAttribute.MU
    case "2": return MapToolsAttribute.KL
    case "3": return MapToolsAttribute.IN
    case "4": return MapToolsAttribute.CH
    case "5": return MapToolsAttribute.FF
    case "6": return MapToolsAttribute.GE
    case "7": return MapToolsAttribute.KO
    case "8": return MapToolsAttribute.KK
    default: return MapToolsAttribute.MU
  }
}

function attrFromMaybeString (attr: Maybe<string>): MapToolsAttribute {
  if (!isJust (attr)) {
    return MapToolsAttribute.MU
  }

  return attrFromString (attr.value)
}

function buildSkill (skillFromWiki: Record<Skill>):
(skillFromHero: Maybe<Record<SkillDependent>>) => MapToolsSkill {
  return skillFromHero => ({
    name: Skill.A.name (skillFromWiki),
    value: isJust (skillFromHero) ? SkillDependent.A.value (skillFromHero.value) : 0,
    attr1: attrFromMaybeString (List.subscript (Skill.A.check (skillFromWiki)) (0)),
    attr2: attrFromMaybeString (List.subscript (Skill.A.check (skillFromWiki)) (1)),
    attr3: attrFromMaybeString (List.subscript (Skill.A.check (skillFromWiki)) (2)),
  })
}

function propertyForMapTool (property: Property): string {
  switch (property) {
    case Property.AntiMagic: return "Antimagie"
    case Property.Clairvoyance: return "Hellsicht"
    case Property.Demonic: return "Dämonisch"
    case Property.Elemental: return "Elementar"
    case Property.Healing: return "Heilung"
    case Property.Illusion: return "Illusion"
    case Property.Influence: return "Einfluss"
    case Property.Objekt: return "Objekt"
    case Property.Spheres: return "Sphären"
    case Property.Telekinesis: return "Telekinese"
    case Property.Temporal: return "Temporal"
    case Property.Transformation: return "Verwandlung"
    default: return ""
  }
}

/*
function aspectForMapTool (aspect: Aspect): string {
  switch (aspect) {
    case Aspect.Agriculture: return "Landwirtschaft"
    case Aspect.AntiMagic: return "Antimagie"
    case Aspect.Begierde: return "Begierde"
    case Aspect.Bildung: return "Bildung"
    case Aspect.Commerce: return "Handel"
    case Aspect.Death: return "Tod"
    case Aspect.Dream: return "Traum"
    case Aspect.Ekstase: return "Ekstase"
    case Aspect.Erkenntnis: return "Erkenntnis"
    case Aspect.Feuer: return "Feuer"
    case Aspect.Freiheit: return "Freiheit"
    case Aspect.Freundschaft: return "Freundschaft"
    case Aspect.General: return "Allgemein"
    case Aspect.GuterKampf: return "Guter Kampf"
    case Aspect.GutesGold: return "Gutes Gold"
    case Aspect.Handwerk: return "Handwerk"
    case Aspect.Harmonie: return "Harmonie"
    case Aspect.Healing: return "Heilung"
    case Aspect.Heim: return "Heim"
    case Aspect.Hilfsbereitschaft: return "Hilfsbereitschaft"
    case Aspect.Jagd: return "Jagd"
    case Aspect.Kaelte: return "Kälte"
    case Aspect.Knowledge: return "Wissen"
    case Aspect.Kraft: return "Kraft"
    case Aspect.Magic: return "Magie"
    case Aspect.Natur: return "Natur"
    case Aspect.Order: return "Ordnung"
    case Aspect.Rausch: return "Rausch"
    case Aspect.Reise: return "Reise"
    case Aspect.ReissenderStrudel: return "Reißender Strudel"
    case Aspect.Schicksal: return "Schicksal"
    case Aspect.Shadow: return "Schatten"
    case Aspect.Shield: return "Schild"
    case Aspect.Storm: return "Sturm"
    case Aspect.Tapferkeit: return "Tapferkeit"
    case Aspect.UnendlicheTiefe: return "Unendliche Tiefe"
    case Aspect.Wandel: return "Wandel"
    case Aspect.Wind: return "Wind"
    case Aspect.Wogen: return "Wogen"
    default: return ""
  }
}
*/

function buildSpell (spellFromWiki: Record<Spell>):
(spellFromHero: Record<ActivatableSkillDependent>) => MapToolsSpell {
  return spellFromHero => ({
    name: Spell.A.name (spellFromWiki),
    value: ActivatableSkillDependent.A.value (spellFromHero),
    attr1: attrFromMaybeString (List.subscript (Spell.A.check (spellFromWiki)) (0)),
    attr2: attrFromMaybeString (List.subscript (Spell.A.check (spellFromWiki)) (1)),
    attr3: attrFromMaybeString (List.subscript (Spell.A.check (spellFromWiki)) (2)),
    gr: Spell.A.gr (spellFromWiki),
    property: pipe_ (spellFromWiki, Spell.A.property, propertyForMapTool),
  })
}

function buildChant (chantFromWiki: Record<LiturgicalChant>):
(chantFromHero: Record<ActivatableSkillDependent>) => MapToolsChant {
  return chantFromHero => ({
    name: LiturgicalChant.A.name (chantFromWiki),
    value: ActivatableSkillDependent.A.value (chantFromHero),
    attr1: attrFromMaybeString (List.subscript (LiturgicalChant.A.check (chantFromWiki)) (0)),
    attr2: attrFromMaybeString (List.subscript (LiturgicalChant.A.check (chantFromWiki)) (1)),
    attr3: attrFromMaybeString (List.subscript (LiturgicalChant.A.check (chantFromWiki)) (2)),
    gr: LiturgicalChant.A.gr (chantFromWiki),
  })
}

function getTalentsXML (hero: HeroModelRecord, state: AppStateRecord): string {
  const buildSkillList =
  pipe (
    SkillGroup.A.id,
    grid =>
      pipe_ (
        state.values.wiki.values.skills,
        OrderedMap.filter (skill => Skill.A.gr (skill) === grid),
        OrderedMap.elems,
        fmap ((skill: Record<Skill>) => pipe_ (
          skill,
          Skill.A.id,
          OrderedMap.lookupF (hero.values.skills),
          buildSkill (skill)
        ))
      )
  )

const skills: List<MapToolsSkillGroup> =
  pipe_ (
    state.values.wiki.values.skillGroups,
    OrderedMap.elems,
    fmap (
      (g: Record<SkillGroup>) => ({
        groupName: skillGroupNameForMapTool (g),
        skills: buildSkillList (g),
      })
    )
  )

  let xml: string =
    pipe_ (
skills,
      fmap ((sg: MapToolsSkillGroup) => entry ({
        key: sg.groupName,
        value: `[${pipe_ (
          sg.skills,
          fmap ((skill: MapToolsSkill) =>
            `{"Talent":"${skill.name}","Talentwert":${skill.value},"Probe":{`
            + `"Eigenschaft1":"${skill.attr1}",`
            + `"Eigenschaft2":"${skill.attr2}",`
            + `"Eigenschaft3":"${skill.attr3}"}}`),
          List.intercalate (",")
        )}]`,
      })),
      List.intercalate ("")
)

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
      List.partition (skill => skill.gr === 1)
    )

  const spells = allSpells.values [0]
  const rituals = allSpells.values [1]

  const entrySpell = (key: string, spellsliturgies: List<MapToolsSpell>) => entry ({
    key,
    value: `[${pipe_ (
      spellsliturgies,
      fmap ((spell: MapToolsSpell) =>
        `{"Talent":"${spell.name}","Talentwert":${spell.value},"Probe":{`
        + `"Eigenschaft1":"${spell.attr1}",`
        + `"Eigenschaft2":"${spell.attr2}",`
        + `"Eigenschaft3":"${spell.attr3}"},`
        + `"Merkmal": "${spell.property}"}`),
      List.intercalate (",")
    )}]`,
  })

  xml += entrySpell ("Zauber", spells)
  xml += entrySpell ("Rituale", rituals)

  const blessedTradition = getBlessedTradition (HeroModel.A.specialAbilities (hero))
  if (isJust (blessedTradition)) {
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
        List.partition (chant => chant.gr === 1)
      )

    const chants = allChants.values [0]
    const ceremonies = allChants.values [1]

    xml += entrySpell ("Liturgien", chants)
    xml += entrySpell ("Zeremonien", ceremonies)
  }

  return xml
}

function getAdvantagesXML (hero: HeroModelRecord, state: AppStateRecord): string {
  const xml =
    entry ({
    key: "Vorteile",
    value: `[${pipe_ (
      getActiveForEditView (Category.ADVANTAGES) (state, { hero }),
      fromMaybe (List<Record<ActiveActivatable<Advantage>>> ()),
      fmap ((a: Record<ActiveActivatable<Advantage>>) =>
        `{"Name":"${a.values.nameAndCost.values.naming.values.name}",`
        + `"Stufe":${(fromMaybe (0) (ActiveActivatableA_.level (a))).toString ()}}`),
      List.intercalate (", ")
    )}]` })
    + entry ({
    key: "Nachteile",
    value: `[${pipe_ (
      getActiveForEditView (Category.DISADVANTAGES) (state, { hero }),
      fromMaybe (List<Record<ActiveActivatable<Disadvantage>>> ()),
      fmap ((d: Record<ActiveActivatable<Disadvantage>>) =>
        `{"Name":"${d.values.nameAndCost.values.naming.values.name}",`
        + `"Stufe":${(fromMaybe (0) (ActiveActivatableA_.level (d))).toString ()}}`),
      List.intercalate (", ")
    )}]` })

  return xml
}

function specialAbilityGroupForMapTool (group: Maybe<Record<NumIdName>>): string {
  if (isJust (group)) {
    const g: Record<NumIdName> = group.value
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
  else {
    return "AllgemeineSF"
  }
}

function getSpecialAbilitiesXML (hero: HeroModelRecord, state: AppStateRecord): string {
  const ungrouped: List<MapToolsEntry> = pipe_ (
    getActiveForEditView (Category.SPECIAL_ABILITIES) (state, { hero }),
    fromMaybe (List<Record<ActiveActivatable<SpecialAbility>>> ()),
    fmap ((sf: Record<ActiveActivatable<SpecialAbility>>) =>
      ({
        key: pipe_ (
          sf.values.wikiEntry.values.gr,
          OrderedMap.lookupF (state.values.wiki.values.specialAbilityGroups),
          specialAbilityGroupForMapTool
        ),
        value: `{"Name":"${sf.values.nameAndCost.values.naming.values.name}",`
          + `"Stufe":${(fromMaybe (0) (ActiveActivatableA_.level (sf))).toString ()}}`,
      }))
  )

  const groups: List<string> = List<string> ("AllgemeineSF", "MagieSF", "KampfSF", "KlerikaleSF")

  const xml = pipe_ (
    groups,
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
    List.intercalate ("")
  )

  return xml
}

let id = 0

function weaponForXML (state: AppStateRecord): (weapon: Record<Item>) => string {
  return weapon => {
    let techniqueStr = ""
    const technique = pipe_ (
      weapon.values.combatTechnique,
      fromMaybe (""),
      lookupF (StaticData.A.combatTechniques (state.values.wiki))
    )
    if (isJust (technique)) {
      techniqueStr = technique.value.values.name
    }

    return `"ID":${id++},`
    + `"Name":"${weapon.values.name}",`
    + `"Improvisiert":${isNothing (weapon.values.improvisedWeaponGroup) ? "0" : "1"},`
    + `"Technik":"${techniqueStr}",`
    + `"TP":"${fromMaybe (1) (weapon.values.damageDiceNumber)}d${fromMaybe (6) (weapon.values.damageDiceSides)}+${fromMaybe (0) (weapon.values.damageFlat)}"`
  }
}

function LSPair (s: number): (l: string) => string {
  return l => `{"L":"${attrFromString (l).toString ()}", "S":${s}}`
}

function getLS (state: AppStateRecord, weapon: Record<Item>): string {
  if (isJust (weapon.values.damageBonus)) {
    const damageBonus: PrimaryAttributeDamageThreshold = weapon.values.damageBonus.value.values
    if (isJust (damageBonus.primary)) {
      if (typeof damageBonus.primary.value === "string"
      && typeof damageBonus.threshold === "number") {
        return `[${LSPair (damageBonus.threshold) (damageBonus.primary.value)}]`
      }
      else {
        const thresholdPair = damageBonus.threshold as Pair<number, number>
        const damageBonusPair = damageBonus.primary.value as Pair<string, string>

        return `[${LSPair (Tuple.fst (thresholdPair)) (Tuple.fst (damageBonusPair))}, `
        + `${LSPair (Tuple.snd (thresholdPair)) (Tuple.snd (damageBonusPair))}]`
      }
    }
    else {
      const maybeTechnique = OrderedMap.lookupF
        (state.values.wiki.values.combatTechniques)
        (fromMaybe ("") (weapon.values.combatTechnique))

      if (isJust (maybeTechnique)) {
        const technique: Record<CombatTechnique> = maybeTechnique.value

        let i = 0

        const getThreshold =
          (num: number) =>
            isTuple (damageBonus.threshold)
              ? (damageBonus.threshold).values[num]
              : damageBonus.threshold

        return `[${pipe_ (
          technique.values.primary,
          fmap (LSPair (getThreshold (i++))),
          List.intercalate (", ")
        )}]`
      }
    }
  }

  return "[]"
}

function meleeWeaponForXML (state: AppStateRecord): (weapon: Record<Item>) => string {
  return weapon => `{${weaponForXML (state) (weapon)},`
    + `"RW":${fromMaybe (2) (weapon.values.reach)},`
    + `"AT":${fromMaybe (0) (weapon.values.at)},`
    + `"PA":${fromMaybe (0) (weapon.values.pa)},`
    + `"LS":${getLS (state, weapon)},`
    // TODO: isTwoHandedWeapon scheint hier immer 0 zu liefern.
    // Ich habe das gerade mal im Inventar getestet. Dort scheint es so zu sein dass das Häckchen immer fehlt.
    // Wenn man jedoch die Sperre aufhebt und wieder reinmacht ist der Haken da.
    + `"Zweihand":${weapon.values.isTwoHandedWeapon ? 1 : 0},`
    + `"Parierwaffe":${weapon.values.isParryingWeapon ? 1 : 0}}`
}

function rangedWeaponForXML (state: AppStateRecord): (weapon: Record<Item>) => string {
  return weapon => {
    let rw1 = 0
    let rw2 = 0
    let rw3 = 0
    let reloadTime = 0
    if (isJust (weapon.values.range)) {
      rw1 = weapon.values.range.value.close
      rw2 = weapon.values.range.value.medium
      rw3 = weapon.values.range.value.far
    }
    if (isJust (weapon.values.reloadTime)) {
      // Prinzipiell gibt es Waffen mit mehreren Ladezeiten. Dies ist ein Sonderfall den wir erstmal ignorieren
      // Solche Waffen werden mit einer Ladezeit von 0 exportiert. Das muss man dann halt manuell nachtragen
      if (typeof weapon.values.reloadTime.value === "number") {
        reloadTime = weapon.values.reloadTime.value
      }
    }

    return `{${weaponForXML (state) (weapon)},`
    + `"RW1":${rw1},`
    + `"RW2":${rw2},`
    + `"RW3":${rw3},`
    + `"Ladezeit":${reloadTime}}`
  }
}

function combatTechniqueForXML (technique: Record<CombatTechniqueWithRequirements>): string {
  return "{"
  + `"Name":"${technique.values.wikiEntry.values.name}",`
  + `"FW":${technique.values.stateEntry.values.value},`
  + `"L":[${pipe_ (
    technique.values.wikiEntry.values.primary,
    fmap ((s: string) => `"${attrFromString (s).toString ()}"`),
    List.intercalate (", ")
  )}]}`
}

function armorForXML (
  name: string,
  rshead: Maybe<number>,
  rstorso: Maybe<number>,
  rsarmleft: Maybe<number>,
  rsarmright: Maybe<number>,
  rslegleft: Maybe<number>,
  rslegright: Maybe<number>,
  ini: number,
  mov: number,
  enc: number,
  type: string
): string {
  const head: number = fromMaybe (0) (rshead)
  const torso: number = fromMaybe (0) (rstorso)
  const armleft: number = fromMaybe (0) (rsarmleft)
  const armright: number = fromMaybe (0) (rsarmright)
  const legleft: number = fromMaybe (0) (rslegleft)
  const legright: number = fromMaybe (0) (rslegright)
  const rs: number =
    Math.round ((head + armleft * 2 + armright * 2 + legleft * 2 + legright * 2 + torso * 5) / 14.0)

  return `{"ID":${id++},"Name":"${name}","RS":${rs}, "RSKopf":${head}, "RSTorso":${torso},`
  + `"RSArmLinks":${armleft}, "RSArmRechts":${armright},`
  + `"RSBeinLinks":${legleft}, "RSBeinRechts":${legright},`
  + `"GS":${mov}, "INI":${ini}, "BE":${enc}, "Typ":"${type}"}`
}


function totalArmorForXML (armor: Armor): string {
  return armorForXML (
    armor.name,
    armor.pro,
    armor.pro,
    armor.pro,
    armor.pro,
    armor.pro,
    armor.pro,
    armor.ini,
    armor.mov,
    fromMaybe (0) (armor.enc),
    "gesamt"
  )
}

function zoneArmorForXML (armorZones: HitZoneArmorForView): string {
  const penalty: number = armorZones.addPenalties ? 1 : 0

  return armorForXML (
    armorZones.name,
    armorZones.head,
    armorZones.torso,
    armorZones.leftArm,
    armorZones.rightArm,
    armorZones.leftLeg,
    armorZones.rightLeg,
    penalty,
    penalty,
    armorZones.enc,
    "zone"
)
}

function getCombatXML (hero: HeroModelRecord, state: AppStateRecord): string {
  let xml = ""

  const techniques = getAllCombatTechniques (state, { hero })
  let techniquesForXML = "[]"
  if (isJust (techniques)) {
    techniquesForXML = `[${pipe_ (
      techniques.value,
      fmap (combatTechniqueForXML),
      List.intercalate (", ")
    )}]`
  }
  xml += entry ({ key: "Kampftechniken", value: techniquesForXML })

  const getItem = getFullItem
    (hero.values.belongings.values.items)
    (state.values.wiki.values.itemTemplates)

  id = 1
  // Waffenlos fügen wir manuell ein
  const brawlingTechnique =
    OrderedMap.lookup (CombatTechniqueId.brawling) (state.values.wiki.values.combatTechniques)
  let naturalWeapon = ""
  if (isJust (brawlingTechnique)) {
    naturalWeapon = `{"ID":0,"Name":"Waffenlos","RW":1,"AT":0,"PA":0,"Technik":"${brawlingTechnique.value.values.name}","Parierwaffe":0,"Improvisiert":0,"TP":"1d6","LS":[{"L":"GE","S":14},{"L":"KK","S":14}],"Zweihand":0}`
  }
  const meleeWeapons = getMeleeWeapons (state, { hero })
  let meleeWeaponsForXML = "[]"
  if (isJust (meleeWeapons)) {
    meleeWeaponsForXML = `[${
      [
        naturalWeapon,
        ...meleeWeapons
          .value
          .map (MeleeWeapon.A.id)
          .mapMaybe (weaponId => toNewMaybe (getItem (weaponId)))
          .map (weapon => meleeWeaponForXML (state) (weapon)),
      ]
        .join (", ")
    }]`
  }
  xml += entry ({ key: "Nahkampfwaffen", value: meleeWeaponsForXML })

  id = 0
  const rangedWeapons = getRangedWeapons (state)
  let rangedWeaponsForXML = "[]"
  if (isJust (rangedWeapons)) {
    rangedWeaponsForXML = `[${
      rangedWeapons
        .value
        .map (RangedWeapon.A.id)
        .mapMaybe (weaponId => toNewMaybe (getItem (weaponId)))
        .map (weapon => rangedWeaponForXML (state) (weapon))
        .join (", ")
    }]`
  }
  xml += entry ({ key: "Fernkampfwaffen", value: rangedWeaponsForXML })

  xml += entry ({ key: "AW", value: `${fromMaybe (0) (getDO (state, { hero }).values.value)}` })

  const armors = toNewMaybe (getArmors (state)).fromMaybe ([])
  const armorZones = getArmorZones (state).fromMaybe ([])

  id = 0
  xml += entry ({ key: "Ruestungen",
    value: `[${
      [
        armorForXML (
          "Keine Rüstung",
          Maybe (0),
          Maybe (0),
          Maybe (0),
          Maybe (0),
          Maybe (0),
          Maybe (0),
          0,
          0,
          0,
          "gesamt"
        ),
        ...armors.map (armor => totalArmorForXML (armor.values)),
        ...armorZones.map (armorZone => zoneArmorForXML (armorZone.values)),
      ]
        .join (", ")
    }]` })

  return xml
}

function getCurrencyNumber (value: string): string {
  if (value === "") {
    return "0"
  }
  else {
    return value
  }
}

function getBelongingsXML (hero: HeroModelRecord, state: AppStateRecord): string {
  let xml = ""
  const purse = hero.values.belongings.values.purse.values
  const imisc = `{"behaelter1":"Rucksack","behaelter2":"Guerteltasche","behaelter3":"Beutel","behaelter4":"Am Koerper getragen","behaelter5":"Satteltaschen","dukaten":${getCurrencyNumber (purse.d)},"silbertaler":${getCurrencyNumber (purse.s)},"heller":${getCurrencyNumber (purse.h)},"kreuzer":${getCurrencyNumber (purse.k)}}`
  xml += entry ({ key: "InventarMisc", value: imisc })
  const items: string[] = new Array (hero.values.belongings.values.items.value.size)
  let i = 0

  const getItem = getFullItem (hero.values.belongings.values.items) (getWikiItemTemplates (state))
  hero.values.belongings.values.items.value.forEach (value => {
    const item = getItem (value.values.id)
    if (isJust (item)) {
      items[i] = "{"
      items[i] += `"gegenstand":"${item.value.values.name}",`
      items[i] += `"anzahl":${value.values.amount},`
      items[i] += `"gewicht":${fromMaybe (0) (value.values.weight)},`
      // TODO: Hier scheint es Probleme mit einigen Gegenständen zu geben. Wir exportieren ja ein JSON Format.
      // Dort müssen "" in der gleichen Zeile geschlossen werden. Wenn sich in der Beschreibung Zeilenumbrüche befinden macht as Probleme
      // items[i] += `"beschreibung":"${(fromMaybe ("") (item.value.values.rules)).replace ("/[\r\n]+/gm", "")}",`
      items[i] += `"behaelter":1}`
      i++
    }
  })
  xml += entry ({ key: "Inventar", value: `[${items.join (",")}]` })

  return xml
}

export function getContentXML (hero: HeroModelRecord, state: AppStateRecord, portraitID: string):
string {
  const contentXml = `${"<?xml version=\"1.0\"?>"
  + "<net.rptools.maptool.model.Token>"}${
   getStaticDataXML (hero, portraitID)
   }<propertyMapCI><store>${
   getAttributesXML (hero, state)
   }${getTalentsXML (hero, state)
   }${getAdvantagesXML (hero, state)
   }${getSpecialAbilitiesXML (hero, state)
   }${getCombatXML (hero, state)
   }${getBelongingsXML (hero, state)
   }</store></propertyMapCI>`
  + `</net.rptools.maptool.model.Token>`

  return contentXml
}

function getAssetXML (id_: string, extension: string): string {
  const assetXml = "<net.rptools.maptool.model.Asset>"
  + "<id>"
  + `<id>${id_}</id>`
  + "</id>"
  + "<name>Image</name>"
  + `<extension>${extension}</extension>`
  + "<type>image</type>"
  + "<image/>"
  + "</net.rptools.maptool.model.Asset>"

  return assetXml
}

function getRptok (hero: HeroModelRecord, state: AppStateRecord): Buffer {
  const AdmZip = require ("adm-zip")
  const zip = new AdmZip ()
  let binaryAvatar: Buffer = Buffer.from ("")
  let type = ""

  if (isJust (hero.values.avatar)) {
    const avatar = hero.values.avatar.value
    const binaryPrefix = "data:image/"
    if (avatar.startsWith (binaryPrefix)) {
      const arr1 = avatar.split (",")
      const prefix = arr1[0]
      const arr2 = prefix.split ("/")
      const arr3 = arr2[1].split (";")
      type = arr3[0]
      binaryAvatar = Buffer.from (arr1[1], "base64")
    }
    else {
      binaryAvatar = readFileSync (avatar)
      type = avatar.split (".")[1]
    }
  }
  else {
    binaryAvatar = readFileSync ("app/images/default-token.png")
    type = "png"
  }

  const crypto = require ("crypto")
  const portraitID = crypto.createHash ("md5")
    .update (binaryAvatar)
    .digest ("hex")

  zip.addFile ("assets/", Buffer.from (""))
  zip.addFile (`assets/${portraitID}`, getAssetXML (portraitID, type))
  zip.addFile (`assets/${portraitID}.${type}`, binaryAvatar)

  zip.addFile (
    "content.xml",
    Buffer.from (getContentXML (hero, state, portraitID)),
    "Content of the hero"
  )
  zip.addFile ("properties.xml", Buffer.from (getPropertiesXML ()), "Properties")

  return zip.toBuffer ()
}

export const requestExportHeroAsRptok = (hero: HeroModelRecord): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState ()

    const staticData = getWiki (state)

    const data = getRptok (hero, state)

    const path = toNewMaybe (await showSaveDialog ({
                    title: translate (staticData) ("sheets.dialogs.rptokexportsavelocation.title"),
                    defaultPath: `${hero.values.name}.rptok`,
                    filters: [
                      { name: "Rptok", extensions: [ "rptok" ] },
                    ],
                  }))

    const res: Either<Error, void> = await path.maybe (
      Promise.resolve<Either<Error, void>> (Right (undefined)),
      async p => handleE (writeFile (p) (data))
    )

    if ((res.isRight) && (path.isJust)) {
      await dispatch (addAlert (AlertOptions ({
                                  message: translate (staticData) ("sheets.dialogs.rptoksaved"),
                                })))
    }
    else if ((res.isLeft)) {
      await dispatch (addDefaultErrorAlert (staticData)
                                           (translate (staticData)
                                                     ("sheets.dialogs.rptoksaveerror.title"))
                                           (res.value))
    }
  }
