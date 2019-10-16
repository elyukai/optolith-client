import { equals } from "../../../Data/Eq";
import { countWith, filter, List } from "../../../Data/List";
import { alt_, maybe } from "../../../Data/Maybe";
import { lookup } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Phase } from "../../Constants/Ids";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { TransferUnfamiliar } from "../../Models/Hero/TransferUnfamiliar";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { Spell } from "../../Models/Wiki/Spell";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { isUnfamiliarSpell } from "../Increasable/spellUtils";
import { pipe, pipe_ } from "../pipe";

const WA = WikiModel.A
const HA = HeroModel.A
const TUA = TransferUnfamiliar.A
const ADA = ActivatableDependent.A
const ASDA = ActivatableSkillDependent.A

/**
 * Check if an entry that allows tranferring unfamiliar entries into a familiar
 * tradition can be removed, because it might happen, that this is not allowed,
 * because otherwise you'd have more unfamiliar spells than allowed by the
 * selected experience level during creation phase.
 */
export const isEntryAllowingTransferUnfamiliarRemovable: (wiki: WikiModelRecord) =>
                                                         (hero: HeroModelRecord) =>
                                                         (id: string) => boolean =
  wiki => hero => src_id => {
    if (HA.phase (hero) >= Phase.InGame) {
      return true
    }

    const mcurrent_el = lookup (HA.experienceLevel (hero))
                               (WA.experienceLevels (wiki))



  }

const getUnfamiliarCountAfter

const getUnfamiliarCount: (wiki: WikiModelRecord) =>
                          (transferred_unfamiliar: List<Record<TransferUnfamiliar>>) =>
                          (trad_hero_entries: List<Record<ActivatableDependent>>) =>
                          (xs: List<Record<ActivatableSkillDependent>>) => number =
  wiki =>
  transferred_unfamiliar =>
  trad_hero_entries =>
    countWith ((x: Record<ActivatableSkillDependent>) =>
                pipe_ (
                  x,
                  ASDA.id,
                  id => alt_ <Record<Spell> | Record<Cantrip>>
                             (lookup (id) (WA.spells (wiki)))
                             (() => lookup (id) (WA.cantrips (wiki))),
                  maybe (false)
                        (isUnfamiliarSpell (transferred_unfamiliar)
                                           (trad_hero_entries))
                ))

const removeTraditionById = (id: string) => filter (pipe (ADA.id, equals (id)))

/**
 * Remove all unfamiliar deps by the specified entry.
 */
const removeUnfamiliarDepsById = (id: string) => filter (pipe (TUA.srcId, equals (id)))
