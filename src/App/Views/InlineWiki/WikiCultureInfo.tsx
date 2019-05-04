import * as React from "react";
import { equals } from "../../../Data/Eq";
import { fmap, fmapF } from "../../../Data/Functor";
import { elemF, find, head, intercalate, List, map, notNull, subscript } from "../../../Data/List";
import { bindF, ensure, fromMaybe, mapMaybe, maybe } from "../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { IncreasableForView, increasableViewFrom } from "../../Models/View/IncreasableForView";
import { Book } from "../../Models/Wiki/Book";
import { Culture } from "../../Models/Wiki/Culture";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { IncreaseSkill } from "../../Models/Wiki/sub/IncreaseSkill";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { localizeOrList, translate, translateP } from "../../Utilities/I18n";
import { prefixC } from "../../Utilities/IDUtils";
import { dec } from "../../Utilities/mathUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { sortRecordsByName, sortStrings } from "../../Utilities/sortBy";
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
const IFVA = IncreasableForView.A
const SAA = SpecialAbility.A
const SOA = SelectOption.A

const isElvenCulture = elemF (List (prefixC (19), prefixC (20), prefixC (21)))

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

  const social_status =
    pipe_ (
      x,
      CA.socialStatus,
      ensure (notNull),
      maybe (translate (l10n) ("none"))
            (pipe (
              mapMaybe (pipe (dec, subscript (translate (l10n) ("socialstatuses")))),
              intercalate (", ")
            ))
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
        {social_status}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="commonprofessions">
        {isElvenCulture (CA.id (x)) ? CA.commonMagicProfessions (x) : null}
      </WikiProperty>
      {!isElvenCulture (CA.id (x))
        ? <ul>
            <li>
              <em>{translate (l10n) ("commonmundaneprofessions")}:</em>
              {" "}
              {fromMaybe ("–") (CA.commonMundaneProfessions (x))}</li>
            <li>
              <em>{translate (l10n) ("commonmagicprofessions")}:</em>
              {" "}
              {fromMaybe ("–") (CA.commonMagicProfessions (x))}</li>
            <li>
              <em>{translate (l10n) ("commonblessedprofessions")}:</em>
              {" "}
              {fromMaybe ("–") (CA.commonBlessedProfessions (x))}</li>
          </ul>
        : null}
      <WikiProperty l10n={l10n} title="commonadvantages">
        {fromMaybe (translate (l10n) ("none"))
                   (CA.commonAdvantagesText (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="commondisadvantages">
        {fromMaybe (translate (l10n) ("none"))
                   (CA.commonDisadvantagesText (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="uncommonadvantages">
        {fromMaybe (translate (l10n) ("none"))
                   (CA.uncommonAdvantagesText (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="uncommondisadvantages">
        {fromMaybe (translate (l10n) ("none"))
                   (CA.uncommonDisadvantagesText (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="commonskills">
        {pipe_ (
          x,
          CA.commonSkills,
          mapMaybe (pipe (lookupF (skills), fmap (Skill.A.name))),
          sortStrings (L10n.A.id (l10n)),
          intercalate (", ")
        )}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="uncommonskills">
        {pipe_ (
          x,
          CA.uncommonSkills,
          mapMaybe (pipe (lookupF (skills), fmap (Skill.A.name))),
          sortStrings (L10n.A.id (l10n)),
          intercalate (", ")
        )}
      </WikiProperty>
      <Markdown source={`**${translate (l10n) ("commonnames")}:**\n${CA.commonNames (x)}`} />
      <p className="cultural-package">
        <span>
          {translateP (l10n)
                      ("culturalpackageap")
                      (List<string | number> (CA.name (x), CA.culturalPackageAdventurePoints (x)))}
        </span>
        <span>
          {pipe_ (
            culturalPackageSkills,
            sortRecordsByName (L10n.A.id (l10n)),
            map (skill => `${IFVA.name (skill)} +${IFVA.value (skill)}`),
            intercalate (", ")
          )}
        </span>
      </p>
      <WikiSource {...props} acc={CA} />
    </WikiBoxTemplate>
  )
}
