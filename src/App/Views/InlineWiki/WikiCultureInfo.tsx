import * as React from "react"
import { equals } from "../../../Data/Eq"
import { on } from "../../../Data/Function"
import { fmap, fmapF } from "../../../Data/Functor"
import { elemF, find, head, intercalate, List, map, notNull } from "../../../Data/List"
import { bindF, ensure, fromMaybe, mapMaybe, maybe, Maybe } from "../../../Data/Maybe"
import { compare } from "../../../Data/Num"
import { lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd } from "../../../Data/Tuple"
import { CultureId } from "../../Constants/Ids"
import { NumIdName } from "../../Models/NumIdName"
import { CultureCombined, CultureCombinedA_ } from "../../Models/View/CultureCombined"
import { L10n } from "../../Models/Wiki/L10n"
import { Skill } from "../../Models/Wiki/Skill"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { ndash } from "../../Utilities/Chars"
import { compareLocale, localizeOrList, translate, translateP } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { Locale } from "../../Utilities/Raw/JSON/Config"
import { renderMaybe } from "../../Utilities/ReactUtils"
import { comparingR, sortByMulti, sortStrings } from "../../Utilities/sortBy"
import { Markdown } from "../Universal/Markdown"
import { WikiSource } from "./Elements/WikiSource"
import { WikiBoxTemplate } from "./WikiBoxTemplate"
import { WikiProperty } from "./WikiProperty"

type ValueSkill = Pair<Record<Skill>, number>

const CCA = CultureCombined.A
const CCA_ = CultureCombinedA_
const SA = Skill.A
const SAA = SpecialAbility.A
const SOA = SelectOption.A
const SDA = StaticData.A

const isElvenCulture =
  elemF (List<string> (
    CultureId.GladeElves,
    CultureId.Firnelves,
    CultureId.WoodElves,
    CultureId.Steppenelfen
  ))

const getNativeTongueStr =
  (staticData: StaticDataRecord) =>
  (languages_wiki_entry: Maybe<Record<SpecialAbility>>) => pipe (
    CCA_.languages,
    mapMaybe (id => pipe_ (
                      languages_wiki_entry,
                      bindF (SAA.select),
                      bindF (find (pipe (SOA.id, equals<string | number> (id)))),
                      fmap (SOA.name)
                    )),
    sortStrings (staticData),
    localizeOrList (staticData)
  )

const getMainScriptStr =
  (staticData: StaticDataRecord) =>
  (scripts_wiki_entry: Maybe<Record<SpecialAbility>>) => pipe (
    CCA_.scripts,
    ensure (notNull),
    bindF (script_ids => {
            const names = pipe_ (
              script_ids,
              mapMaybe (id => pipe_ (
                                scripts_wiki_entry,
                                bindF (SAA.select),
                                bindF (find (pipe (SOA.id, equals<string | number> (id)))),
                                fmap (SOA.name)
                              )),
              sortStrings (staticData),
              localizeOrList (staticData)
            )

            const mcost = pipe_ (
              scripts_wiki_entry,
              bindF (SAA.select),
              bindF (find (pipe (SOA.id, equals<string | number> (head (script_ids))))),
              bindF (SOA.cost)
            )

            return fmapF (mcost)
                         ((cost: number) => translateP (staticData)
                                                       ("general.withapvalue")
                                                       (List<string | number> (names, cost)))
          }),
    fromMaybe (translate (staticData) ("general.none"))
  )

const getSocialStatusStr =
  (staticData: StaticDataRecord) => pipe (
    CCA_.socialStatus,
    ensure (notNull),
    maybe (translate (staticData) ("general.none"))
          (pipe (
            mapMaybe (pipe (
                       lookupF (SDA.socialStatuses (staticData)),
                       fmap (NumIdName.A.name)
                     )),
            intercalate (", ")
          ))
  )

const sortSkills =
  (staticData: StaticDataRecord) =>
    sortByMulti (L10n.A.id (SDA.ui (staticData)) === Locale.Dutch
                  ? [ comparingR (SA.gr) (compare),
                      comparingR (SA.name) (compareLocale (staticData)) ]
                  : [ comparingR (SA.name) (compareLocale (staticData)) ])

const sortValueSkills =
  (staticData: StaticDataRecord) =>
    sortByMulti <ValueSkill>
                (L10n.A.id (SDA.ui (staticData)) === Locale.Dutch
                 ? [ on (compare) <ValueSkill> (pipe (fst, SA.gr)),
                     on (compareLocale (staticData)) <ValueSkill> (pipe (fst, SA.name)) ]
                 : [ on (compareLocale (staticData)) <ValueSkill> (pipe (fst, SA.name)) ])

export interface WikiCultureInfoProps {
  staticData: StaticDataRecord
  x: Record<CultureCombined>
  languages: Maybe<Record<SpecialAbility>>
  scripts: Maybe<Record<SpecialAbility>>
}

export const WikiCultureInfo: React.FC<WikiCultureInfoProps> = props => {
  const { x, languages, scripts, staticData } = props

  const skills = SDA.skills (staticData)

  const culturalPackageSkills = CCA.mappedCulturalPackageSkills (x)

  const native_tongue = getNativeTongueStr (staticData) (languages) (x)
  const main_script = getMainScriptStr (staticData) (scripts) (x)
  const social_status = getSocialStatusStr (staticData)

  return (
    <WikiBoxTemplate className="culture" title={CCA_.name (x)}>
      <WikiProperty staticData={staticData} title="inlinewiki.language">
        {native_tongue}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.script">
        {main_script}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.areaknowledge">
        {CCA_.areaKnowledge (x)}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.socialstatus">
        {social_status}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.commonprofessions">
        {isElvenCulture (CCA_.id (x)) ? renderMaybe (CCA_.commonMagicProfessions (x)) : null}
      </WikiProperty>
      {isElvenCulture (CCA_.id (x))
        ? null
        : (
          <ul>
            <li>
              <em>
                {translate (staticData) ("inlinewiki.commonprofessions.mundane")}
                {":"}
              </em>
              {" "}
              {fromMaybe (ndash) (CCA_.commonMundaneProfessions (x))}
            </li>
            <li>
              <em>
                {translate (staticData) ("inlinewiki.commonprofessions.magic")}
                {":"}
              </em>
              {" "}
              {fromMaybe (ndash) (CCA_.commonMagicProfessions (x))}
            </li>
            <li>
              <em>
                {translate (staticData) ("inlinewiki.commonprofessions.blessed")}
                {":"}
              </em>
              {" "}
              {fromMaybe (ndash) (CCA_.commonBlessedProfessions (x))}
            </li>
          </ul>
        )}
      <WikiProperty staticData={staticData} title="inlinewiki.commonadvantages">
        {fromMaybe (translate (staticData) ("general.none"))
                   (CCA_.commonAdvantagesText (x))}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.commondisadvantages">
        {fromMaybe (translate (staticData) ("general.none"))
                   (CCA_.commonDisadvantagesText (x))}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.uncommonadvantages">
        {fromMaybe (translate (staticData) ("general.none"))
                   (CCA_.uncommonAdvantagesText (x))}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.uncommondisadvantages">
        {fromMaybe (translate (staticData) ("general.none"))
                   (CCA_.uncommonDisadvantagesText (x))}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.commonskills">
        {pipe_ (
          x,
          CCA_.commonSkills,
          mapMaybe (lookupF (skills)),
          sortSkills (staticData),
          map (SA.name),
          intercalate (", ")
        )}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.uncommonskills">
        {pipe_ (
          x,
          CCA_.uncommonSkills,
          mapMaybe (lookupF (skills)),
          sortSkills (staticData),
          map (SA.name),
          intercalate (", ")
        )}
      </WikiProperty>
      <Markdown
        source={`**${translate (staticData) ("inlinewiki.commonnames")}:**\n${CCA_.commonNames (x)}`}
        />
      <p className="cultural-package">
        <span>
          {translateP (staticData)
                      ("inlinewiki.culturalpackage")
                      (List<string | number> (
                        CCA_.name (x),
                        CCA_.culturalPackageAdventurePoints (x)
                      ))}
        </span>
        <span>
          {pipe_ (
            culturalPackageSkills,
            sortValueSkills (staticData),
            map (p => `${SA.name (fst (p))} +${snd (p)}`),
            intercalate (", ")
          )}
        </span>
      </p>
      <WikiSource
        acc={CCA_}
        staticData={staticData}
        x={x}
        />
    </WikiBoxTemplate>
  )
}
