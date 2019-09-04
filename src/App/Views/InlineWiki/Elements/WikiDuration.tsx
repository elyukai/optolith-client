import * as React from "react";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Categories } from "../../../Constants/Categories";
import { MagicalGroup } from "../../../Constants/Groups";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  duration: (r: Record<A>) => string
  durationNoMod: (r: Record<A>) => boolean
  category: (r: Record<A>) => Categories
  gr: (r: Record<A>) => number
}

export interface WikiDurationProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiDuration<A extends RecordIBase<any>> (props: WikiDurationProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  const category = acc.category (x)
  const gr = acc.gr (x)
  const isNoModAllowed = acc.durationNoMod (x)

  const key =
    category === Categories.SPELLS
    && (gr === MagicalGroup.ElvenMagicalSongs || gr === MagicalGroup.Zaubermelodien)
    ? "skill"
    : "duration"

  const modKey =
    category === Categories.LITURGIES
    ? "youcannotuseamodificationonthischantsduration"
    : "youcannotuseamodificationonthisspellsduration"

  return (
    <WikiProperty l10n={l10n} title={key}>
      {acc.duration (x)}{isNoModAllowed ? ` (${translate (l10n) (modKey)})` : ""}
    </WikiProperty>
  )
}
