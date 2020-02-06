import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Category } from "../../../Constants/Categories"
import { BlessedGroup, MagicalGroup } from "../../../Constants/Groups"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { translate } from "../../../Utilities/I18n"
import { WikiProperty } from "../WikiProperty"

type NameKey = "castingtime"
             | "ritualtime"
             | "lengthoftime"
             | "liturgicaltime"
             | "ceremonialtime"

type ModKey = "youcannotuseamodificationonthisspellscastingtime"
            | "youcannotuseamodificationonthisspellsritualtime"
            | "youcannotuseamodificationonthischantsliturgicaltime"
            | "youcannotuseamodificationonthischantsceremonialtime"

const getNameKey =
  (category: Category) =>
  (gr: number): NameKey =>
    (category === Category.SPELLS
     && (gr === MagicalGroup.Rituals
         || gr === MagicalGroup.DominationRituals
         || gr === MagicalGroup.GeodeRituals
         || gr === MagicalGroup.ZibiljaRituals))
    ? "ritualtime"
    : (category === Category.SPELLS
       && (gr === MagicalGroup.MagicalMelodies || gr === MagicalGroup.MagicalDances))
    ? "lengthoftime"
    : category === Category.LITURGICAL_CHANTS && gr === BlessedGroup.LiturgicalChants
    ? "liturgicaltime"
    : category === Category.LITURGICAL_CHANTS && gr === BlessedGroup.Ceremonies
    ? "ceremonialtime"
    : "castingtime"

const nameKeyToModKey =
  (x: NameKey): ModKey =>
    x === "castingtime"
    ? "youcannotuseamodificationonthisspellscastingtime"
    : x === "ritualtime"
    ? "youcannotuseamodificationonthisspellsritualtime"
    : x === "lengthoftime"
    ? "youcannotuseamodificationonthisspellscastingtime"
    : x === "liturgicaltime"
    ? "youcannotuseamodificationonthischantsliturgicaltime"
    : "youcannotuseamodificationonthischantsceremonialtime"

interface Accessors<A extends RecordIBase<any>> {
  castingTime: (r: Record<A>) => string
  castingTimeNoMod: (r: Record<A>) => boolean
  category: (r: Record<A>) => Category
  gr: (r: Record<A>) => number
}

export interface WikiCastingTimeProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiCastingTimeProps<A>) => ReturnType<React.FC>

export const WikiCastingTime: FC = props => {
  const {
    x,
    acc,
    l10n,
  } = props

  const category = acc.category (x)
  const gr = acc.gr (x)
  const isNoModAllowed = acc.castingTimeNoMod (x)

  const key = getNameKey (category) (gr)
  const keyNoMod = nameKeyToModKey (key)

  return (
    <WikiProperty l10n={l10n} title={key}>
      {acc.castingTime (x)}
      {isNoModAllowed ? ` (${translate (l10n) (keyNoMod)})` : ""}
    </WikiProperty>
  )
}
