import * as React from "react";
import { equals } from "../../../Data/Eq";
import { fmap, fmapF } from "../../../Data/Functor";
import { elemF, find, head, intercalate, List, map, notNull, subscript } from "../../../Data/List";
import { bindF, ensure, fromMaybe, mapMaybe, maybe, Maybe } from "../../../Data/Maybe";
import { dec } from "../../../Data/Num";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { CultureId } from "../../Constants/Ids";
import { CultureCombined, CultureCombinedA_ } from "../../Models/View/CultureCombined";
import { IncreasableForView } from "../../Models/View/IncreasableForView";
import { Book } from "../../Models/Wiki/Book";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { localizeOrList, translate, translateP } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { sortRecordsByName, sortStrings } from "../../Utilities/sortBy";
import { Markdown } from "../Universal/Markdown";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiCultureInfoProps {
  books: OrderedMap<string, Record<Book>>
  x: Record<CultureCombined>
  languages: Maybe<Record<SpecialAbility>>
  l10n: L10nRecord
  scripts: Maybe<Record<SpecialAbility>>
  skills: OrderedMap<string, Record<Skill>>
}

const CCA = CultureCombined.A
const CCA_ = CultureCombinedA_
const IFVA = IncreasableForView.A
const SAA = SpecialAbility.A
const SOA = SelectOption.A

const isElvenCulture =
  elemF (List<string> (
    CultureId.GladeElves,
    CultureId.Firnelves,
    CultureId.WoodElves,
    CultureId.Steppenelfen
  ))

export function WikiCultureInfo (props: WikiCultureInfoProps) {
  const { x, languages, l10n, scripts, skills, books } = props

  const culturalPackageSkills = CCA.mappedCulturalPackageSkills (x)

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
      CCA_.languages,
      mapMaybe (id => pipe_ (
                        languages,
                        bindF (SAA.select),
                        bindF (find (pipe (SOA.id, equals<string | number> (id)))),
                        fmap (SOA.name)
                      )),
      sortStrings (L10n.A.id (l10n)),
      localizeOrList (l10n)
    )

  const main_script =
    pipe_ (
      x,
      CCA_.scripts,
      ensure (notNull),
      bindF (script_ids => {
              const names = pipe_ (
                script_ids,
                mapMaybe (id => pipe_ (
                                  scripts,
                                  bindF (SAA.select),
                                  bindF (find (pipe (SOA.id, equals<string | number> (id)))),
                                  fmap (SOA.name)
                                )),
                sortStrings (L10n.A.id (l10n)),
                localizeOrList (l10n)
              )

              const mcost = pipe_ (
                scripts,
                bindF (SAA.select),
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
      CCA_.socialStatus,
      ensure (notNull),
      maybe (translate (l10n) ("none"))
            (pipe (
              mapMaybe (pipe (dec, subscript (translate (l10n) ("socialstatuses")))),
              intercalate (", ")
            ))
    )

  return (
    <WikiBoxTemplate className="culture" title={CCA_.name (x)}>
      <WikiProperty l10n={l10n} title="language">
        {native_tongue}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="script">
        {main_script}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="areaknowledge">
        {CCA_.areaKnowledge (x)}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="socialstatus">
        {social_status}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="commonprofessions">
        {isElvenCulture (CCA_.id (x)) ? renderMaybe (CCA_.commonMagicProfessions (x)) : null}
      </WikiProperty>
      {isElvenCulture (CCA_.id (x))
        ? null
        : (
          <ul>
            <li>
              <em>
                {translate (l10n) ("commonmundaneprofessions")}
                {":"}
              </em>
              {" "}
              {fromMaybe ("–") (CCA_.commonMundaneProfessions (x))}
            </li>
            <li>
              <em>
                {translate (l10n) ("commonmagicprofessions")}
                {":"}
              </em>
              {" "}
              {fromMaybe ("–") (CCA_.commonMagicProfessions (x))}
            </li>
            <li>
              <em>
                {translate (l10n) ("commonblessedprofessions")}
                {":"}
              </em>
              {" "}
              {fromMaybe ("–") (CCA_.commonBlessedProfessions (x))}
            </li>
          </ul>
        )}
      <WikiProperty l10n={l10n} title="commonadvantages">
        {fromMaybe (translate (l10n) ("none"))
                   (CCA_.commonAdvantagesText (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="commondisadvantages">
        {fromMaybe (translate (l10n) ("none"))
                   (CCA_.commonDisadvantagesText (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="uncommonadvantages">
        {fromMaybe (translate (l10n) ("none"))
                   (CCA_.uncommonAdvantagesText (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="uncommondisadvantages">
        {fromMaybe (translate (l10n) ("none"))
                   (CCA_.uncommonDisadvantagesText (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="commonskills">
        {pipe_ (
          x,
          CCA_.commonSkills,
          mapMaybe (pipe (lookupF (skills), fmap (Skill.A.name))),
          sortStrings (L10n.A.id (l10n)),
          intercalate (", ")
        )}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="uncommonskills">
        {pipe_ (
          x,
          CCA_.uncommonSkills,
          mapMaybe (pipe (lookupF (skills), fmap (Skill.A.name))),
          sortStrings (L10n.A.id (l10n)),
          intercalate (", ")
        )}
      </WikiProperty>
      <Markdown source={`**${translate (l10n) ("commonnames")}:**\n${CCA_.commonNames (x)}`} />
      <p className="cultural-package">
        <span>
          {translateP (l10n)
                      ("culturalpackageap")
                      (List<string | number> (
                        CCA_.name (x),
                        CCA_.culturalPackageAdventurePoints (x)
                      ))}
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
      <WikiSource
        acc={CCA_}
        books={books}
        l10n={l10n}
        x={x}
        />
    </WikiBoxTemplate>
  )
}
