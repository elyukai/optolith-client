import { equals } from "../../../Data/Eq"
import { cnst, ident } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { over } from "../../../Data/Lens"
import { append, countWith, filter, foldr, List, sdelete, subscriptF } from "../../../Data/List"
import { bindF, Just, liftM3, maybe, Maybe, Nothing } from "../../../Data/Maybe"
import { elems, lookup, lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Phase, SpecialAbilityId } from "../../Constants/Ids.gen"
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions"
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent"
import { ActiveObjectWithId, toActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId"
import { HeroModel, HeroModelL, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { TransferUnfamiliar, UnfamiliarGroup } from "../../Models/Hero/TransferUnfamiliar"
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel"
import { Spell } from "../../Models/Wiki/Spell"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { convertUIStateToActiveObject } from "../Activatable/activatableConvertUtils"
import { getMagicalTraditionsHeroEntries } from "../Activatable/traditionUtils"
import { prefixSA } from "../IDUtils"
import { isUnfamiliarSpell } from "../Increasable/spellUtils"
import { pipe, pipe_ } from "../pipe"
import { isStringM, misStringM } from "../typeCheckUtils"

const SDA = StaticData.A
const HA = HeroModel.A
const HL = HeroModelL
const ELA = ExperienceLevel.A
const TUA = TransferUnfamiliar.A
const ADA = ActivatableDependent.A
const ASDA = ActivatableSkillDependent.A
const AOWIA = ActiveObjectWithId.A
const AAOA = ActivatableActivationOptions.A
const ADOA = ActivatableDeactivationOptions.A
const SOA = SelectOption.A

const getTransferredUnfamiliarById: (active: Record<ActiveObjectWithId>) =>
                                    Maybe<List<Record<TransferUnfamiliar>>> =
  active => {
    const src_id = AOWIA.id (active)

    switch (src_id) {
      case prefixSA (SpecialAbilityId.traditionGuildMages):
      case SpecialAbilityId.madaschwesternStil:
      case SpecialAbilityId.scholarDesMagierkollegsZuHoningen:
        return pipe_ (
          active,
          AOWIA.sid,
          misStringM,
          fmap (id => List (TransferUnfamiliar ({ id, srcId: src_id })))
        )

      case SpecialAbilityId.zaubervariabilitaet:
        return Just (List (TransferUnfamiliar ({ id: UnfamiliarGroup.Spells, srcId: src_id })))

      case SpecialAbilityId.scholarDerHalleDesLebensZuNorburg:
      case SpecialAbilityId.scholarDesKreisesDerEinfuehlung:
        return liftM3 ((id1: string) => (id2: string) => (id3: string) =>
                        List (
                          TransferUnfamiliar ({ id: id1, srcId: src_id }),
                          TransferUnfamiliar ({ id: id2, srcId: src_id }),
                          TransferUnfamiliar ({ id: id3, srcId: src_id })
                        ))
                      (misStringM (AOWIA.sid (active)))
                      (misStringM (AOWIA.sid2 (active)))
                      (misStringM (AOWIA.sid3 (active)))

      default:
        return Nothing
    }
  }

/**
 * Adds new transferred unfamiliar spells if the entry to activate allows
 * transferring unfamiliar spells.
 */
export const addTransferUnfamiliarDependencies: (active: Record<ActiveObjectWithId>) =>
                                                ident<Record<HeroModel>> =
  pipe (
    getTransferredUnfamiliarById,
    maybe (ident as ident<HeroModelRecord>)
          ((new_spells: List<Record<TransferUnfamiliar>>) =>
            over (HL.transferredUnfamiliarSpells)
                 (append (new_spells)))
  )

export const activationOptionsToActiveObjectWithId =
  (active: Record<ActivatableActivationOptions>) =>
    toActiveObjectWithId (-1) (AAOA.id (active)) (convertUIStateToActiveObject (active))

/**
 * Adds new transferred unfamiliar spells if the entry to activate allows
 * transferring unfamiliar spells.
 */
export const addTransferUnfamiliarDependenciesByActivationOptions =
  pipe (
    activationOptionsToActiveObjectWithId,
    addTransferUnfamiliarDependencies
  )

/**
 * Removes transferred unfamiliar spells if the entry to deactivate allows
 * transferring unfamiliar spells.
 */
export const removeTransferUnfamiliarDependencies:
  (active: Record<ActivatableDeactivationOptions>) => ident<Record<HeroModel>> =
  active => hero => {
    const src_id = ADOA.id (active)
    const src_index = ADOA.index (active)

    const mnew_spells = pipe_ (
      lookup (src_id) (HA.specialAbilities (hero)),
      bindF (pipe (ADA.active, subscriptF (src_index))),
      bindF (pipe (toActiveObjectWithId (src_index) (src_id), getTransferredUnfamiliarById))
    )

    return maybe (hero)
                 ((new_spells: List<Record<TransferUnfamiliar>>) =>
                   over (HL.transferredUnfamiliarSpells)
                        (current => foldr (sdelete) (current) (new_spells))
                        (hero))
                 (mnew_spells)
  }

const removeTradById = (id: string) => filter (pipe (ADA.id, equals (id)))

/**
 * Remove all unfamiliar deps by the specified entry.
 */
const removeUnfamiliarDepsById = (id: string) => filter (pipe (TUA.srcId, equals (id)))

const getUnfamiliarCount: (wiki: StaticDataRecord) =>
                          (transferred_unfamiliar: List<Record<TransferUnfamiliar>>) =>
                          (trad_hero_entries: List<Record<ActivatableDependent>>) =>
                          (spells: List<Record<ActivatableSkillDependent>>) => number =
  wiki =>
  transferred_unfamiliar =>
  trad_hero_entries =>
    countWith ((x: Record<ActivatableSkillDependent>) =>
                pipe_ (
                  x,
                  ASDA.id,
                  lookupF (SDA.spells (wiki)),
                  maybe (false)
                        (isUnfamiliarSpell (transferred_unfamiliar)
                                           (trad_hero_entries))
                ))

const getUnfamiliarCountAfter: (wiki: StaticDataRecord) =>
                               (transferred_unfamiliar: List<Record<TransferUnfamiliar>>) =>
                               (trad_hero_entries: List<Record<ActivatableDependent>>) =>
                               (src_id: string) =>
                               (spells: List<Record<ActivatableSkillDependent>>) => number =
  wiki =>
  transferred_unfamiliar =>
  trad_hero_entries =>
  src_id =>
    getUnfamiliarCount (wiki)
                       (removeUnfamiliarDepsById (src_id) (transferred_unfamiliar))
                       (removeTradById (src_id) (trad_hero_entries))

/**
 * Check if an entry that allows transferring unfamiliar entries into a familiar
 * tradition can be removed, because it might happen, that this is not allowed,
 * because otherwise you'd have more unfamiliar spells than allowed by the
 * selected experience level during creation phase.
 */
export const isEntryAllowingTransferUnfamiliarRemovable: (wiki: StaticDataRecord) =>
                                                         (hero: HeroModelRecord) =>
                                                         (src_id: string) => boolean =
  wiki => hero => {
    if (HA.phase (hero) >= Phase.inGame) {
      return cnst (true)
    }

    const trad_hero_entries = getMagicalTraditionsHeroEntries (HA.specialAbilities (hero))
    const transferred_unfamiliar = HA.transferredUnfamiliarSpells (hero)
    const spells = elems (HA.spells (hero))

    return maybe (cnst (false) as (src_id: string) => boolean)
                 (pipe (
                   ELA.maxUnfamiliarSpells,
                   max_unfamiliar => src_id =>
                     max_unfamiliar >= getUnfamiliarCountAfter (wiki)
                                                               (transferred_unfamiliar)
                                                               (trad_hero_entries)
                                                               (src_id)
                                                               (spells)
                 ))
                 (lookup (HA.experienceLevel (hero))
                         (SDA.experienceLevels (wiki)))
  }

/**
 * From a list of spell select options, only return the **unfamiliar** ones.
 */
export const filterUnfamiliar =
  (pred: (x: Record<Spell>) => boolean) =>
  (static_data: StaticDataRecord) =>
    filter ((x: Record<SelectOption>) =>
              pipe_ (
                x,
                SOA.id,
                isStringM,
                bindF (lookupF (SDA.spells (static_data))),
                maybe (false) (pred)
              ))
