import * as React from "react";
import { equals } from "../../../Data/Eq";
import { fmap, fmapF } from "../../../Data/Functor";
import { find, head, List, notNull } from "../../../Data/List";
import { bindF, ensure, fromMaybe, mapMaybe } from "../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { increasableViewFrom } from "../../Models/View/IncreasableForView";
import { Book } from "../../Models/Wiki/Book";
import { Culture } from "../../Models/Wiki/Culture";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { IncreaseSkill } from "../../Models/Wiki/sub/IncreaseSkill";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { localizeOrList, translate, translateP } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { sortStrings } from "../../Utilities/sortBy";
import { Markdown } from "../Universal/Markdown";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiCultureInfoProps {
  books: OrderedMap<string, Record<Book>>
  x: Record<Culture>
  languages: Record<SpecialAbility>
  l10n: L10nRecord
  scripts: Record<SpecialAbility>
  skills: OrderedMap<string, Record<Skill>>
}

const CA = Culture.A
const ISA = IncreaseSkill.A
const SAA = SpecialAbility.A
const SOA = SelectOption.A

export function WikiCultureInfo (props: WikiCultureInfoProps) {
  const { x, languages, l10n, scripts, skills } = props

  const culturalPackageSkills =
    mapMaybe ((a: Record<IncreaseSkill>) =>
               pipe_ (
                 a,
                 ISA.id,
                 lookupF (skills),
                 fmap (pipe (Skill.A.name, increasableViewFrom (a)))
               ))
             (CA.culturalPackageSkills (x))

  // if (["nl-BE"].includes(l10n.id)) {
  //   return (
  //     <WikiBoxTemplate className="culture" title={x.name}>
  //       <p className="cultural-package">
  //         <span>
  //           {translateP (l10n)
  //                       ("culturalpackageap")
  //                       (List<string | number> (
  //                         CA.name (x),
  //                         CA.culturalPackageAdventurePoints (x)
  //                       ))}
  //         </span>
  //         <span>
  //           {sortObjects(culturalPackageSkills, l10n.id).map(skill => {
  //             return `${skill.name} +${skill.value}`
  //           }).intercalate(", ")}
  //         </span>
  //       </p>
  //     </WikiBoxTemplate>
  //   )
  // }

  const native_tongue =
    pipe_ (
      x,
      CA.languages,
      mapMaybe (id => pipe_ (
                        languages,
                        SAA.select,
                        bindF (find (pipe (SOA.id, equals<string | number> (id)))),
                        fmap (SOA.name)
                      )),
      sortStrings (L10n.A.id (l10n)),
      localizeOrList (l10n)
    )

  const main_script =
    pipe_ (
      x,
      CA.scripts,
      ensure (notNull),
      bindF (script_ids => {
              const names = pipe_ (
                script_ids,
                mapMaybe (id => pipe_ (
                                  scripts,
                                  SAA.select,
                                  bindF (find (pipe (SOA.id, equals<string | number> (id)))),
                                  fmap (SOA.name)
                                )),
                sortStrings (L10n.A.id (l10n)),
                localizeOrList (l10n)
              )

              const mcost = pipe_ (
                scripts,
                SAA.select,
                bindF (find (pipe (SOA.id, equals<string | number> (head (script_ids))))),
                bindF (SOA.cost)
              )

              return fmapF (mcost)
                           ((cost: number) =>
                              `${names} (${cost} ${translate (l10n) ("adventurepoints.short")})`)
            }),
      fromMaybe (translate (l10n) ("none"))
    )

  return (
    <WikiBoxTemplate className="culture" title={CA.name (x)}>
      <WikiProperty l10n={l10n} title="language">
        {native_tongue}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="script">
        {main_script}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="areaknowledge">
        {CA.areaKnowledge (x)}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="socialstatus">
        {CA.socialStatus (x).length > 0 ? sortStrings(CA.socialStatus (x).map(e => translate(l10n, "socialstatus")[e - 1]), l10n.id).intercalate(", ") : translate(l10n, "none")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="commonprofessions">
        {["C_19", "C_20", "C_21"].includes(CA.id (x)) ? CA.commonMagicProfessions (x) : undefined}
      </WikiProperty>
      {!["C_19", "C_20", "C_21"].includes(CA.id (x)) ? <ul>
        <li><em>{translate(l10n, "commonmundaneprofessions")}:</em> {CA.commonMundaneProfessions (x) || "-"}</li>
        <li><em>{translate(l10n, "commonmagicprofessions")}:</em> {CA.commonMagicProfessions (x) || "-"}</li>
        <li><em>{translate(l10n, "commonblessedprofessions")}:</em> {CA.commonBlessedProfessions (x) || "-"}</li>
      </ul> : undefined}
      <WikiProperty l10n={l10n} title="commonadvantages">
        {CA.commonAdvantagesText (x) || translate(l10n, "none")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="commondisadvantages">
        {CA.commonDisadvantagesText (x) || translate(l10n, "none")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="uncommonadvantages">
        {CA.uncommonAdvantagesText (x) || translate(l10n, "none")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="uncommondisadvantages">
        {CA.uncommonDisadvantagesText (x) || translate(l10n, "none")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="commonskills">
        {sortStrings(CA.commonSkills (x).map(e => skills.get(e)!.name), l10n.id).intercalate(", ")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="uncommonskills">
        {sortStrings(CA.uncommonSkills (x).map(e => skills.get(e)!.name), l10n.id).intercalate(", ")}
      </WikiProperty>
      <Markdown source={`**${translate(l10n, "commonnames")}:**\n${x.commonNames || ""}`} />
      <p className="cultural-package">
        <span>
          {translateP (l10n)
                      ("culturalpackageap")
                      (List<string | number> (CA.name (x), CA.culturalPackageAdventurePoints (x)))}
        </span>
        <span>
          {sortObjects(culturalPackageSkills, l10n.id).map(skill => {
            return `${skill.name} +${skill.value}`
          }).intercalate(", ")}
        </span>
      </p>
      <WikiSource {...props} />
    </WikiBoxTemplate>
  )
}
