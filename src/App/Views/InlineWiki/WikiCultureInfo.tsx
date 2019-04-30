import * as React from "react";
import { Book, Culture, Skill, SpecialAbility } from "../../Models/Wiki/wikiTypeHelpers";
import { translate, UIMessages } from "../../Utilities/I18n";
import { Markdown } from "../Universal/Markdown";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiCultureInfoProps {
  books: Map<string, Book>
  currentObject: Culture
  languages: SpecialAbility
  locale: UIMessages
  scripts: SpecialAbility
  skills: Map<string, Skill>
}

export function WikiCultureInfo(props: WikiCultureInfoProps) {
  const { currentObject, languages, locale, scripts, skills } = props

  const culturalPackageSkills = currentObject.culturalPackageSkills.map(e => {
    const { id, value } = e
    return {
      name: skills.get(id)!.name,
      value
    }
  })

  if (["nl-BE"].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="culture" title={currentObject.name}>
        <p className="cultural-package">
          <span>{translate(locale, "info.culturalpackage", currentObject.name, currentObject.culturalPackageAdventurePoints)}</span>
          <span>
            {sortObjects(culturalPackageSkills, locale.id).map(skill => {
              return `${skill.name} +${skill.value}`
            }).intercalate(", ")}
          </span>
        </p>
      </WikiBoxTemplate>
    )
  }

  return (
    <WikiBoxTemplate className="culture" title={currentObject.name}>
      <WikiProperty l10n={locale} title="info.language">
        {sortStrings(currentObject.languages.map(id => languages.select!.find(e => e.id === id)!.name), locale.id).intercalate(translate(locale, "info.or"))}
      </WikiProperty>
      <WikiProperty l10n={locale} title="info.script">
        {currentObject.scripts.length > 0 ? `${sortStrings(currentObject.scripts.map(id => scripts.select!.find(e => e.id === id)!.name), locale.id).intercalate(translate(locale, "info.or"))} (${scripts.select!.find(e => e.id === currentObject.scripts[0])!.cost} ${translate(locale, "apshort")})` : translate(locale, "info.none")}
      </WikiProperty>
      <WikiProperty l10n={locale} title="info.areaknowledge">
        {currentObject.areaKnowledge}
      </WikiProperty>
      <WikiProperty l10n={locale} title="info.socialstatus">
        {currentObject.socialStatus.length > 0 ? sortStrings(currentObject.socialStatus.map(e => translate(locale, "socialstatus")[e - 1]), locale.id).intercalate(", ") : translate(locale, "info.none")}
      </WikiProperty>
      <WikiProperty l10n={locale} title="info.commonprofessions">
        {["C_19", "C_20", "C_21"].includes(currentObject.id) ? currentObject.commonMagicProfessions : undefined}
      </WikiProperty>
      {!["C_19", "C_20", "C_21"].includes(currentObject.id) ? <ul>
        <li><em>{translate(locale, "info.commonmundaneprofessions")}:</em> {currentObject.commonMundaneProfessions || "-"}</li>
        <li><em>{translate(locale, "info.commonmagicprofessions")}:</em> {currentObject.commonMagicProfessions || "-"}</li>
        <li><em>{translate(locale, "info.commonblessedprofessions")}:</em> {currentObject.commonBlessedProfessions || "-"}</li>
      </ul> : undefined}
      <WikiProperty l10n={locale} title="info.commonadvantages">
        {currentObject.commonAdvantagesText || translate(locale, "info.none")}
      </WikiProperty>
      <WikiProperty l10n={locale} title="info.commondisadvantages">
        {currentObject.commonDisadvantagesText || translate(locale, "info.none")}
      </WikiProperty>
      <WikiProperty l10n={locale} title="info.uncommonadvantages">
        {currentObject.uncommonAdvantagesText || translate(locale, "info.none")}
      </WikiProperty>
      <WikiProperty l10n={locale} title="info.uncommondisadvantages">
        {currentObject.uncommonDisadvantagesText || translate(locale, "info.none")}
      </WikiProperty>
      <WikiProperty l10n={locale} title="info.commonskills">
        {sortStrings(currentObject.commonSkills.map(e => skills.get(e)!.name), locale.id).intercalate(", ")}
      </WikiProperty>
      <WikiProperty l10n={locale} title="info.uncommonskills">
        {sortStrings(currentObject.uncommonSkills.map(e => skills.get(e)!.name), locale.id).intercalate(", ")}
      </WikiProperty>
      <Markdown source={`**${translate(locale, "info.commonnames")}:**\n${currentObject.commonNames || ""}`} />
      <p className="cultural-package">
        <span>{translate(locale, "info.culturalpackage", currentObject.name, currentObject.culturalPackageAdventurePoints)}</span>
        <span>
          {sortObjects(culturalPackageSkills, locale.id).map(skill => {
            return `${skill.name} +${skill.value}`
          }).intercalate(", ")}
        </span>
      </p>
      <WikiSource {...props} />
    </WikiBoxTemplate>
  )
}
