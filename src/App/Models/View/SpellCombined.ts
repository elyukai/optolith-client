import { elem, OrderedSet } from "../../../Data/OrderedSet";
import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent";
import { Cantrip } from "../Wiki/Cantrip";
import { Spell } from "../Wiki/Spell";

export interface SpellCombined {
  "@@name": "SpellCombined"
  wikiEntry: Record<Spell>
  stateEntry: Record<ActivatableSkillDependent>
}

export const SpellCombined =
  fromDefault ("SpellCombined")
              <SpellCombined> ({
                wikiEntry: Spell .default,
                stateEntry: ActivatableSkillDependent .default,
              })

export const SpellCombinedA_ = {
  id: pipe (SpellCombined.A.wikiEntry, Spell.A.id),
  name: pipe (SpellCombined.A.wikiEntry, Spell.A.name),
  check: pipe (SpellCombined.A.wikiEntry, Spell.A.check),
  checkmod: pipe (SpellCombined.A.wikiEntry, Spell.A.checkmod),
  ic: pipe (SpellCombined.A.wikiEntry, Spell.A.ic),
  gr: pipe (SpellCombined.A.wikiEntry, Spell.A.gr),
  value: pipe (SpellCombined.A.stateEntry, ActivatableSkillDependent.A.value),
  costShort: pipe (SpellCombined.A.wikiEntry, Spell.A.costShort),
  castingTimeShort: pipe (SpellCombined.A.wikiEntry, Spell.A.castingTimeShort),
  rangeShort: pipe (SpellCombined.A.wikiEntry, Spell.A.rangeShort),
  durationShort: pipe (SpellCombined.A.wikiEntry, Spell.A.durationShort),
  property: pipe (SpellCombined.A.wikiEntry, Spell.A.property),
  tradition: pipe (SpellCombined.A.wikiEntry, Spell.A.tradition),
}

export const isSpellCombined =
  (x: Record<SpellCombined> | Record<Cantrip>): x is Record<SpellCombined> =>
    elem<keyof SpellCombined> ("wikiEntry") (x .keys as OrderedSet<keyof SpellCombined>)
