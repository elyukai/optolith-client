import * as React from "react"
import { equals } from "../../../Data/Eq"
import { on } from "../../../Data/Function"
import { fmap, fmapF } from "../../../Data/Functor"
import { elemF, find, head, intercalate, List, map, notNull, subscript } from "../../../Data/List"
import { bindF, ensure, fromMaybe, mapMaybe, maybe, Maybe } from "../../../Data/Maybe"
import { compare, dec } from "../../../Data/Num"
import { lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd } from "../../../Data/Tuple"
import { CultureId } from "../../Constants/Ids"
import { CultureCombined, CultureCombinedA_ } from "../../Models/View/CultureCombined"
import { L10n, L10nRecord } from "../../Models/Wiki/L10n"
import { Skill } from "../../Models/Wiki/Skill"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
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
const WA = WikiModel.A

const isElvenCulture =
  elemF (List<string> (
    CultureId.GladeElves,
    CultureId.Firnelves,
    CultureId.WoodElves,
    CultureId.Steppenelfen
  ))

const getNativeTongueStr =
  (l10n: L10nRecord) =>
  (languages_wiki_entry: Maybe<Record<SpecialAbility>>) => pipe (
    CCA_.languages,
    mapMaybe (id => pipe_ (
                      languages_wiki_entry,
                      bindF (SAA.select),
                      bindF (find (pipe (SOA.id, equals<string | number> (id)))),
                      fmap (SOA.name)
                    )),
    sortStrings (l10n),
    localizeOrList (l10n)
  )

const getMainScriptStr =
  (l10n: L10nRecord) =>
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
              sortStrings (l10n),
              localizeOrList (l10n)
            )

            const mcost = pipe_ (
              scripts_wiki_entry,
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

const getSocialStatusStr =
  (l10n: L10nRecord) => pipe (
    CCA_.socialStatus,
    ensure (notNull),
    maybe (translate (l10n) ("none"))
          (pipe (
            mapMaybe (pipe (dec, subscript (translate (l10n) ("socialstatuses")))),
            intercalate (", ")
          ))
  )

const sortSkills =
  (l10n: L10nRecord) =>
    sortByMulti (L10n.A.id (l10n) === Locale.Dutch
                  ? [ comparingR (SA.gr) (compare), comparingR (SA.name) (compareLocale (l10n)) ]
                  : [ comparingR (SA.name) (compareLocale (l10n)) ])

const sortValueSkills =
  (l10n: L10nRecord) =>
    sortByMulti <ValueSkill>
                (L10n.A.id (l10n) === Locale.Dutch
                 ? [
                     on (compare) <ValueSkill> (pipe (fst, SA.gr)),
                     on (compareLocale (l10n)) <ValueSkill> (pipe (fst, SA.name)),
                   ]
                 : [ on (compareLocale (l10n)) <ValueSkill> (pipe (fst, SA.name)) ])

export interface WikiCultureInfoProps {
  l10n: L10nRecord
  wiki: WikiModelRecord
  x: Record<CultureCombined>
  languages: Maybe<Record<SpecialAbility>>
  scripts: Maybe<Record<SpecialAbility>>
}

export const WikiCultureInfo: React.FC<WikiCultureInfoProps> = props => {
  const { x, languages, l10n, scripts, wiki } = props

  const books = WA.books (wiki)
  const skills = WA.skills (wiki)

  const culturalPackageSkills = CCA.mappedCulturalPackageSkills (x)

  const native_tongue = getNativeTongueStr (l10n) (languages) (x)
  const main_script = getMainScriptStr (l10n) (scripts) (x)
  const social_status = getSocialStatusStr (l10n)

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
              {fromMaybe (ndash) (CCA_.commonMundaneProfessions (x))}
            </li>
            <li>
              <em>
                {translate (l10n) ("commonmagicprofessions")}
                {":"}
              </em>
              {" "}
              {fromMaybe (ndash) (CCA_.commonMagicProfessions (x))}
            </li>
            <li>
              <em>
                {translate (l10n) ("commonblessedprofessions")}
                {":"}
              </em>
              {" "}
              {fromMaybe (ndash) (CCA_.commonBlessedProfessions (x))}
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
          mapMaybe (lookupF (skills)),
          sortSkills (l10n),
          map (SA.name),
          intercalate (", ")
        )}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="uncommonskills">
        {pipe_ (
          x,
          CCA_.uncommonSkills,
          mapMaybe (lookupF (skills)),
          sortSkills (l10n),
          map (SA.name),
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
            sortValueSkills (l10n),
            map (p => `${SA.name (fst (p))} +${snd (p)}`),
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
