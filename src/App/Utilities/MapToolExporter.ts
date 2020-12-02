import { OrderedMap } from "../../Data/OrderedMap"
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { HeroModel } from "../Models/Hero/HeroModel"
import { Record } from "../../Data/Record"

export function getPropertiesXML (): string {
  return "<?xml version=\"1.0\"?><map><entry><string>version</string><string>1.7.0</string></entry>"
  + "<entry><string>herolab</string><boolean>false</boolean></entry></map>"
}

function separateValuesByComma (map: OrderedMap<string, Record<ActivatableDependent>>): string {
  let text = ""
  map.value.forEach ((value, key, map) => {
    text += ` ${value.name},`
  })

function entry (mtentry: MaptoolsEntry): string {
  let xml = ""
  xml += "<entry>"
  xml += `<string>${mtentry.key.toLowerCase ()}</string>`
  xml += "<net.rptools.CaseInsensitiveHashMap_-KeyValue>"
  xml += `<key>${mtentry.key}</key>`
  xml += `<value class="string">${mtentry.value}</value>`
  xml += "<outer-class reference=\"../../../..\"/>"
  xml += "</net.rptools.CaseInsensitiveHashMap_-KeyValue>"
  xml += "</entry>"

  return xml
}

function getStaticDataXML (hero: Readonly<Required<HeroModel>>): string {
  let xml = ""
  xml += "<id>"
  xml += "<baGUID>eIj9Afv6STWmcKmhxyfaJQ==</baGUID>"
  xml += "</id>"
  xml += "<beingImpersonated>false</beingImpersonated>"
  xml += "<exposedAreaGUID>"
  xml += "<baGUID>CgAADK1LundsAAAAAgAADA==</baGUID>"
  xml += "</exposedAreaGUID>"
  xml += "<imageAssetMap>"
  xml += "<entry>"
  xml += "<null/>"
  xml += "<net.rptools.lib.MD5Key>"
  xml += "<id>f427aa49b28500217ac46ba37c2998a4</id>"
  xml += "</net.rptools.lib.MD5Key>"
  xml += "</entry>"
  xml += "</imageAssetMap>"
  xml += "<anchorX>0</anchorX>"
  xml += "<anchorY>0</anchorY>"
  xml += "<sizeScale>1.0</sizeScale>"
  xml += "<snapToScale>true</snapToScale>"
  xml += "<width>50</width>"
  xml += "<height>50</height>"
  xml += "<isoWidth>50</isoWidth>"
  xml += "<isoHeight>50</isoHeight>"
  xml += "<scaleX>1.0</scaleX>"
  xml += "<scaleY>1.0</scaleY>"
  xml += "<sizeMap>"
  xml += "<entry>"
  xml += "<java-class>net.rptools.maptool.model.SquareGrid</java-class>"
  xml += "<net.rptools.maptool.model.GUID>"
  xml += "<baGUID>CgAADK1LundsAAAAAgAADA==</baGUID>"
  xml += "</net.rptools.maptool.model.GUID>"
  xml += "</entry>"
  xml += "</sizeMap>"
  xml += "<snapToGrid>false</snapToGrid>"
  xml += "<isVisible>true</isVisible>"
  xml += "<visibleOnlyToOwner>false</visibleOnlyToOwner>"
  xml += "<vblColorSensitivity>0</vblColorSensitivity>"
  xml += "<alwaysVisibleTolerance>0</alwaysVisibleTolerance>"
  xml += "<isAlwaysVisible>false</isAlwaysVisible>"
  xml += `<name>${hero.name}</name>`
  xml += "<ownerType>0</ownerType>"
  xml += "<tokenShape>CIRCLE</tokenShape>"
  xml += "<tokenType>PC</tokenType>"
  xml += "<layer>TOKEN</layer>"
  xml += "<propertyType>Basic</propertyType>"
  xml += "<tokenOpacity>1.0</tokenOpacity>"
  xml += "<terrainModifier>0.0</terrainModifier>"
  xml += "<terrainModifiersIgnored>"
  xml += "<net.rptools.maptool.model.Token_-TerrainModifierOperation>NONE</net.rptools.maptool.model.Token_-TerrainModifierOperation>"
  xml += "</terrainModifiersIgnored>"
  xml += "<isFlippedX>false</isFlippedX>"
  xml += "<isFlippedY>false</isFlippedY>"
  xml += "<hasSight>false</hasSight>"
  xml += "<state/>"

  return xml
}

function getAttributesXML (hero: Readonly<Required<HeroModel>>): string {
  // Attribute auf Minimalwert werden nicht exportiert. Liegt wohl daran dass nur Änderungen gespeichert werden
  // Das muss anders gemacht werden
  let xml = ""
  const attr: string[] = [ "MU", "KL", "IN", "CH", "FF", "GE", "KO", "KK" ]
  hero.attributes.value.forEach ((value, key, map) => {
    const index: number = Number (key.substring (key.length - 1, key.length)) - 1
    if (index >= 0 && index < 8) {
      xml += entry ({ key: attr[index], value: value.values.value.toString () })
  }
})

  // TODO: folgende Werte irgendwie ausrechnen und entries machen
  // const leP:number = Maybe.sum (fmapF (hero.race) (Race.A.lp))
  // da hero.race ein string ist funktioniert das so nicht
  const leP = 30, asp = 0, kap = 0
  const schips = 3
  const sk = 1, zk = 1
  const ini = 12
  const gs = 8

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

function getTalentsXML (hero: Readonly<Required<HeroModel>>): string {
  let xml = ""
  // TODO: Folgende Kategorien an 3W20-Proben herausfinden
  const groups: string[] = [ "Koerper", "Gesellschaft", "Natur", "Wissen", "Handwerk", "Zauber", "Rituale", "Liturgien", "Zeremonien" ]
  for (let i = 0; i < groups.length; i++) {
 xml += entry ({ key: groups[i], value: /* getTalentJSON( ... )*/"[]" })
}

  return xml
}

function getAdvantagesXML (hero: Readonly<Required<HeroModel>>): string {
  let xml = ""
  // Hier werden zwar die Vor- und Nachteile ausgelesen aber in der Ausgabe steht nur "ActivatableDependent"
  xml += entry ({ key: "Vorteile", value: separateValuesByComma (hero.advantages) })
  xml += entry ({ key: "Nachteile", value: separateValuesByComma (hero.disadvantages) })

  return xml
}

function getSpecialAbilitiesXML (hero: Readonly<Required<HeroModel>>): string {
  // TODO: Sonderfertigkeiten nach Kategorien gruppieren und in die xml schreiben
  // Kategorien als DSA4.1 waren:
  // "AllgemeineSF", "KampfSF", "NahkampfSF", "FernkampfSF", "Hand2HandStyles", "Hand2HandSF", "MagieSF", "KlerikaleSF"
  return ""
}

function getCombatXML (hero: Readonly<Required<HeroModel>>): string {
  let xml = ""
  // TODO: Kampftalente eintragen
  hero.combatTechniques.value.forEach ((value, key, map) => {
    // Ob die Bonuspunkte aus MU/GE/KK in maptools oder hier eingerechnet werden ist noch nicht entschieden.
    // Tendenz zu maptools weil es komfortabel wäre bei einem Attributo nicht nachrechnen zu müssen.
    // Die Leiteigenschaften müssen dann auch hier oder bei den Waffen ermittelt werden
    // Wir brauchen hier auch ALLE Kampftechniken, auch wenn keine AP darin investiert wurden
  })

  // TODO: Nahkampfwaffen eintragen
  // Für jede Waffe brauchen wir auch das zugehörige Kampftalent ODER die Leiteigenschaften
  let text = "WaffenLaufIndex=1;"
  // Für jede Waffe
  text += "Waffe1bezeichnung=Waffenlos;"
  text += "Waffe1RW=kurz;"
  text += "Waffe1TP=1W6;"
  // text += "Waffe1VERZ=P;"
  // text += "Waffe1AT=14;"
  // text += "Waffe1PA=8;"
  text += "Waffe1Talent=Raufen;"
  text += "Waffe1Schild=0;" // Ist die Waffe ein Schild?
  text += "Waffe1Parierbonus=0;" // Bonus als Parierwaffe
  // Schadensschwelle
  text += "Waffe1S=14;"
  text += "Waffe1ATMod=0;"
  text += "Waffe1PAMod=0;"
  text += "Waffe1BF=12;"
  text += "Waffe1ID=1"
  xml += entry ({ key: "Nahkampfwaffen", value: text })

  // TODO: Fernkampfwaffen eintragen
  // Wir brauchen hier den Namen, Kampftalent, Ladezeit, Entfernungen und TP

  // TODO: Ausweichen eintragen
  // Verbessertes Ausweichen sollte bereits eingerechnet sein. Belastung aber nicht.
  xml += entry ({ key: "AW", value: "6" })

  // TODO: Rüstung eintragen
  // Wie findet man die angelegt Rüstung heraus?
  // Was wenn mehrere Rüstungen im Inventar sind? Welche ist aktiv?
  // Evtl. müssen wir hier nochmal umbauen und alle "Rüstungssets" separat exportieren und in maptools eine auswählbar machen
  // Wir brauchen hier dann auch noch die BE + INI- und GS-Malus
  xml += entry ({ key: "RS", value: "0" })
  xml += entry ({ key: "RSKopf", value: "0" })
  xml += entry ({ key: "RSTorso", value: "0" })
  xml += entry ({ key: "RSBeinLinks", value: "0" })
  xml += entry ({ key: "RSBeinRechts", value: "0" })
  xml += entry ({ key: "RSArmLinks", value: "0" })
  xml += entry ({ key: "RSArmRechts", value: "0" })

  return xml
}

function getBelongingsXML (hero: Readonly<Required<HeroModel>>): string {
  let xml = ""
  const purse = hero.belongings.values.purse.values
  const imisc = `{"behaelter1":"Rucksack","behaelter2":"Guerteltasche","behaelter3":"Beutel","behaelter4":"Am Koerper getragen","behaelter5":"Satteltaschen","dukaten":${purse.d},"silbertaler":${purse.s},"heller":${purse.h},"kreuzer":${purse.k}}`
  xml += entry ({ key: "InventarMisc", value: imisc })
  const items: string[] = new Array (hero.belongings.values.items.value.size)
  let i = 0
  hero.belongings.values.items.value.forEach ((value, key, map) => {
    items[i] = "{"
    items[i] += `"gegenstand":"${value.values.name}",`
    items[i] += `"anzahl":${value.values.amount},`
    items[i] += `"gewicht":${value.values.weight},` // <- Hier wird das Gewicht nicht ausgegeben. Wie bekomme ich das heraus?
    items[i] += "\"beschreibung\":\"Keine Beschreibung vorhanden\","
    items[i] += "\"behaelter\":1}"
    i++
  })
  xml += entry ({ key: "Inventar", value: items.join (",") })

  return xml
}

  return text.substr (1, text.length - 2)
}

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

function getTalentJSON (skills: MaptoolsSkill[]): string {
  let json = "["
  skills.forEach ((skill, index, array) => {
    json += `{"Talentwert":${skill.value},`
    json += "\"Anzeigen\":\"checked\",\"Spezialisierungen\":\"\","
    json += `"Probe":{"Eigenschaft1":"${skill.attr1.toString ()}","Eigenschaft2":"${skill.attr2.toString ()}","Eigenschaft3":"${skill.attr3.toString ()}",`
    json += `"Talent":"${skill.name}"}`
    if (index < array.length - 1) {
 json += ","
}
  })

  return `${json}]`
}

export function getContentXML (hero: Readonly<Required<HeroModel>>): string {
  let contentXml = "<?xml version=\"1.0\"?>"
  contentXml += "<net.rptools.maptool.model.Token>"
  contentXml += getStaticDataXML (hero)
  contentXml += "<propertyMapCI><store>"
  contentXml += getAttributesXML (hero)
  contentXml += getTalentsXML (hero)
  contentXml += getAdvantagesXML (hero)
  contentXml += getSpecialAbilitiesXML (hero)
  contentXml += getCombatXML (hero)
  contentXml += getBelongingsXML (hero)
  contentXml += "</store></propertyMapCI>"
  contentXml += "</net.rptools.maptool.model.Token>"

  return contentXml
}