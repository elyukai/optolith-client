import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Category } from "../../../Constants/Categories"
import { BlessedGroup, MagicalGroup } from "../../../Constants/Groups"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { WikiProperty } from "../WikiProperty"

type NameKey = "inlinewiki.castingtime"
             | "inlinewiki.ritualtime"
             | "inlinewiki.lengthoftime"
             | "inlinewiki.liturgicaltime"
             | "inlinewiki.ceremonialtime"

type ModKey = "inlinewiki.youcannotuseamodificationonthisspellscastingtime"
            | "inlinewiki.youcannotuseamodificationonthisspellsritualtime"
            | "inlinewiki.youcannotuseamodificationonthischantsliturgicaltime"
            | "inlinewiki.youcannotuseamodificationonthischantsceremonialtime"

const getNameKey =
  (category: Category) =>
  (gr: number): NameKey =>
    (category === Category.SPELLS
     && (gr === MagicalGroup.Rituals
         || gr === MagicalGroup.DominationRituals
         || gr === MagicalGroup.GeodeRituals
         || gr === MagicalGroup.ZibiljaRituals))
    ? "inlinewiki.ritualtime"
    : (category === Category.SPELLS
       && (gr === MagicalGroup.MagicalMelodies || gr === MagicalGroup.MagicalDances))
    ? "inlinewiki.lengthoftime"
    : category === Category.LITURGICAL_CHANTS && gr === BlessedGroup.LiturgicalChants
    ? "inlinewiki.liturgicaltime"
    : category === Category.LITURGICAL_CHANTS && gr === BlessedGroup.Ceremonies
    ? "inlinewiki.ceremonialtime"
    : "inlinewiki.castingtime"

const nameKeyToModKey =
  (x: NameKey): ModKey =>
    x === "inlinewiki.castingtime"
    ? "inlinewiki.youcannotuseamodificationonthisspellscastingtime"
    : x === "inlinewiki.ritualtime"
    ? "inlinewiki.youcannotuseamodificationonthisspellsritualtime"
    : x === "inlinewiki.lengthoftime"
    ? "inlinewiki.youcannotuseamodificationonthisspellscastingtime"
    : x === "inlinewiki.liturgicaltime"
    ? "inlinewiki.youcannotuseamodificationonthischantsliturgicaltime"
    : "inlinewiki.youcannotuseamodificationonthischantsceremonialtime"

interface Accessors<A extends RecordIBase<any>> {
  castingTime: (r: Record<A>) => string
  castingTimeNoMod: (r: Record<A>) => boolean
  category: (r: Record<A>) => Category
  gr: (r: Record<A>) => number
}

export interface WikiCastingTimeProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiCastingTimeProps<A>) => ReturnType<React.FC>

export const WikiCastingTime: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  const category = acc.category (x)
  const gr = acc.gr (x)
  const isNoModAllowed = acc.castingTimeNoMod (x)

  const key = getNameKey (category) (gr)
  const keyNoMod = nameKeyToModKey (key)

  return (
    <WikiProperty staticData={staticData} title={key}>
      {acc.castingTime (x)}
      {isNoModAllowed ? ` (${translate (staticData) (keyNoMod)})` : ""}
    </WikiProperty>
  )
}
