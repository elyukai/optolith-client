import * as React from "react"
import { equals } from "../../../Data/Eq"
import { flip, ident } from "../../../Data/Function"
import { fmap, fmapF } from "../../../Data/Functor"
import { append, cons, consF, deleteAt, find, findIndex, flength, foldr, imap, intercalate, intersperse, isList, List, ListI, map, NonEmptyList, notElem, notNull, reverse, snoc, sortBy, toArray, uncons, unconsSafe, unsafeIndex } from "../../../Data/List"
import { alt_, any, bind, bindF, catMaybes, ensure, fromJust, fromMaybe, fromMaybe_, isJust, Just, liftM2, mapMaybe, Maybe, maybe, maybeRNullF, maybeToList, maybe_, Nothing } from "../../../Data/Maybe"
import { compare, dec, gt, inc } from "../../../Data/Num"
import { elems, lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap"
import { difference, fromList, insert, OrderedSet, toList } from "../../../Data/OrderedSet"
import { fromDefault, Record } from "../../../Data/Record"
import { show } from "../../../Data/Show"
import { fst, isTuple, Pair, snd } from "../../../Data/Tuple"
import { SpecialAbilityId } from "../../Constants/Ids"
import { Sex } from "../../Models/Hero/heroTypeHelpers"
import { ActivatableNameCostIsActive, ActivatableNameCostIsActiveA_ } from "../../Models/View/ActivatableNameCostIsActive"
import { IncreasableForView } from "../../Models/View/IncreasableForView"
import { IncreasableListForView } from "../../Models/View/IncreasableListForView"
import { ProfessionCombined, ProfessionCombinedA_ } from "../../Models/View/ProfessionCombined"
import { ProfessionVariantCombined, ProfessionVariantCombinedA_ } from "../../Models/View/ProfessionVariantCombined"
import { Attribute } from "../../Models/Wiki/Attribute"
import { Blessing } from "../../Models/Wiki/Blessing"
import { Cantrip } from "../../Models/Wiki/Cantrip"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { ProfessionRequireIncreasable } from "../../Models/Wiki/prerequisites/ProfessionRequireIncreasable"
import { RaceRequirement } from "../../Models/Wiki/prerequisites/RaceRequirement"
import { isSexRequirement, SexRequirement } from "../../Models/Wiki/prerequisites/SexRequirement"
import { CantripsSelection } from "../../Models/Wiki/professionSelections/CantripsSelection"
import { CombatTechniquesSelection } from "../../Models/Wiki/professionSelections/CombatTechniquesSelection"
import { CursesSelection } from "../../Models/Wiki/professionSelections/CursesSelection"
import { LanguagesScriptsSelection } from "../../Models/Wiki/professionSelections/LanguagesScriptsSelection"
import { ProfessionSelections } from "../../Models/Wiki/professionSelections/ProfessionAdjustmentSelections"
import { ProfessionVariantSelections } from "../../Models/Wiki/professionSelections/ProfessionVariantAdjustmentSelections"
import { isRemoveCombatTechniquesSelection } from "../../Models/Wiki/professionSelections/RemoveCombatTechniquesSelection"
import { isRemoveSpecializationSelection } from "../../Models/Wiki/professionSelections/RemoveSpecializationSelection"
import { CombatTechniquesSecondSelection } from "../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection"
import { SkillsSelection } from "../../Models/Wiki/professionSelections/SkillsSelection"
import { SpecializationSelection } from "../../Models/Wiki/professionSelections/SpecializationSelection"
import { TerrainKnowledgeSelection } from "../../Models/Wiki/professionSelections/TerrainKnowledgeSelection"
import { Race } from "../../Models/Wiki/Race"
import { Skill } from "../../Models/Wiki/Skill"
import { SkillGroup } from "../../Models/Wiki/SkillGroup"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { Spell } from "../../Models/Wiki/Spell"
import { IncreaseSkill } from "../../Models/Wiki/sub/IncreaseSkill"
import { IncreaseSkillList } from "../../Models/Wiki/sub/IncreaseSkillList"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { ProfessionSelectionIds } from "../../Models/Wiki/wikiTypeHelpers"
import { getSelectOptionName } from "../../Utilities/Activatable/selectionUtils"
import { ndash } from "../../Utilities/Chars"
import { localizeOrList, translate, translateP } from "../../Utilities/I18n"
import { getNumericId, prefixRace } from "../../Utilities/IDUtils"
import { signNeg } from "../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { getNameBySex, getNameBySexM } from "../../Utilities/rcpUtils"
import { renderMaybe, renderMaybeWith } from "../../Utilities/ReactUtils"
import { sortRecordsByName, sortStrings } from "../../Utilities/sortBy"
import { whilePred } from "../../Utilities/whilePred"
import { Markdown } from "../Universal/Markdown"
import { WikiSource } from "./Elements/WikiSource"
import { WikiBoxTemplate } from "./WikiBoxTemplate"
import { WikiProperty } from "./WikiProperty"

const SDA = StaticData.A
const PCA = ProfessionCombined.A
const PCA_ = ProfessionCombinedA_
const PSA = ProfessionSelections.A
const PVCA = ProfessionVariantCombined.A
const PVCA_ = ProfessionVariantCombinedA_
const PVSA = ProfessionVariantSelections.A
const ISA = IncreaseSkill.A
const ILSA = IncreaseSkillList.A
const IFVA = IncreasableForView.A
const IFVAL = IncreasableForView.AL
const ILFVA = IncreasableListForView.A
const ANCIAA = ActivatableNameCostIsActive.A
const ANCIAA_ = ActivatableNameCostIsActiveA_
const PRIA = ProfessionRequireIncreasable.A
const CTSA = CombatTechniquesSelection.A
const CTSSA = CombatTechniquesSecondSelection.A
const LCA = LiturgicalChant.A
const SGA = SkillGroup.A

const getSpecializationSelection =
  (staticData: StaticDataRecord) =>
  (skills: OrderedMap<string, Record<Skill>>) =>
  (profession: Record<ProfessionCombined>): Maybe<string> =>
    pipe_ (
      profession,
      PCA.mappedSelections,
      PSA[ProfessionSelectionIds.SPECIALIZATION],
      bindF (sel => {
              const sid = SpecializationSelection.A.sid (sel)

              if (isList (sid)) {
                return pipe_ (
                  sid,
                  mapMaybe (pipe (lookupF (skills), fmap (Skill.A.name))),
                  ensure (notNull),
                  fmap (pipe (
                    sortStrings (staticData),
                    localizeOrList (staticData)
                  ))
                )
              }
              else {
                return pipe_ (sid, lookupF (skills), fmap (Skill.A.name))
              }
            }),
      fmap (pipe (List.pure, translateP (staticData) ("inlinewiki.skillspecialization")))
    )

interface CombatTechniquesProps {
  combatTechniquesSelectionString: Maybe<string>
  x: Record<ProfessionCombined>
  staticData: StaticDataRecord
}

function CombatTechniques (props: CombatTechniquesProps): JSX.Element {
  const {
    combatTechniquesSelectionString: selectionString,
    x,
    staticData,
  } = props

  const cts =
    pipe_ (
      x,
      PCA.mappedCombatTechniques,
      map (e => `${IFVA.name (e)} ${IFVA.value (e) + 6}`),
      sortStrings (staticData),
      maybe<ident<List<string>>> (ident) <string> (consF) (selectionString),
      ensure (notNull),
      maybe (ndash) (intercalate (", "))
    )

  return (
    <WikiProperty staticData={staticData} title="inlinewiki.combattechniques">
      {cts}
    </WikiProperty>
  )
}

interface SkillsSelectionJoined {
  "@@name": "SkillsSelectionJoined"
  properties: Record<SkillsSelection>
  text: string
}

const SkillsSelectionJoined =
  fromDefault ("SkillsSelectionJoined") <SkillsSelectionJoined> ({
                properties: SkillsSelection.default,
                text: "",
              })

const getSkillSelection =
  (staticData: StaticDataRecord) =>
  (profession: Record<ProfessionCombined>): Maybe<Record<SkillsSelectionJoined>> =>
    pipe_ (
      profession,
      PCA.mappedSelections,
      PSA[ProfessionSelectionIds.SKILLS],
      fmap (sel => {
        const skill_gr = lookup (fromMaybe (0) (SkillsSelection.A.gr (sel)))
                                (SDA.skillGroups (staticData))

        return SkillsSelectionJoined ({
          properties: sel,
          text: translateP (staticData)
                           ("inlinewiki.skillsselection")
                           (List<string | number> (
                             SkillsSelection.A.value (sel),
                             maybe ("...") (SGA.fullName) (skill_gr)
                           )),
        })
      })
    )

const getCombatTechniquesSelection =
  (staticData: StaticDataRecord) =>
  (profession: Record<ProfessionCombined>): Maybe<string> => {
    const selections = PCA.mappedSelections (profession)

    const msel = PSA[ProfessionSelectionIds.COMBAT_TECHNIQUES] (selections)

    return fmapF (msel)
                 (sel => {
                   const fst_counter = CTSA.amount (sel) === 1
                                       ? translate (staticData) ("inlinewiki.combattechnique.one")
                                       : CTSA.amount (sel) === 2
                                       ? translate (staticData) ("inlinewiki.combattechnique.two")
                                       : "..."

                   const firstValue = CTSA.value (sel) + 6

                   const entryList =
                     pipe_ (
                       sel,
                       CTSA.sid,
                       sortStrings (staticData),
                       intercalate (", ")
                     )

                   return maybe_ (() => translateP (staticData)
                                                   ("inlinewiki.combattechniqueselection")
                                                   (List<string | number> (
                                                     fst_counter,
                                                     firstValue,
                                                     entryList
                                                   )))
                                 ((second_sel: Record<CombatTechniquesSecondSelection>) => {
                                   const snd_counter =
                                     CTSSA.amount (second_sel) === 1
                                     ? translate (staticData) ("inlinewiki.combattechnique.one")
                                     : CTSSA.amount (second_sel) === 2
                                     ? translate (staticData) ("inlinewiki.combattechnique.two")
                                     : "..."

                                   const secondValue = CTSSA.value (second_sel) + 6

                                   return translateP (staticData)
                                                ("inlinewiki.combattechniquesecondselection")
                                                (List<string | number> (
                                                  fst_counter,
                                                  firstValue,
                                                  snd_counter,
                                                  secondValue,
                                                  entryList
                                                ))
                                 })
                                 (CTSA.second (sel))
                 })
  }

const getTerrainKnowledgeSelection =
  (staticData: StaticDataRecord) =>
  (specialAbilities: OrderedMap<string, Record<SpecialAbility>>) =>
  (profession: Record<ProfessionCombined>): Maybe<string> =>
    pipe_ (
      profession,
      PCA_.selections,
      PSA[ProfessionSelectionIds.TERRAIN_KNOWLEDGE],
      liftM2 ((terrain_knowledge: Record<SpecialAbility>) =>
               pipe (
                 TerrainKnowledgeSelection.A.sid,
                 mapMaybe (pipe (Just, getSelectOptionName (terrain_knowledge))),
                 localizeOrList (staticData),
                 xs => `${SpecialAbility.A.name (terrain_knowledge)} (${xs})`
               ))
             (lookup<string> (SpecialAbilityId.TerrainKnowledge) (specialAbilities))
    )

const getSpells =
  (staticData: StaticDataRecord) =>
  (cantrips: OrderedMap<string, Record<Cantrip>>) =>
  (spells: OrderedMap<string, Record<Spell>>) =>
  (profession: Record<ProfessionCombined>): Maybe<string> => {
    const cantrips_str =
      pipe_ (
        profession,
        PCA_.selections,
        PSA[ProfessionSelectionIds.CANTRIPS],
        maybe ("")
              (cantrips_sel => {
                const counter =
                  CantripsSelection.A.amount (cantrips_sel) === 1
                  ? translate (staticData) ("inlinewiki.cantrip.one")
                  : CantripsSelection.A.amount (cantrips_sel) === 2
                  ? translate (staticData) ("inlinewiki.cantrip.two")
                  : "..."

                const options =
                  pipe_ (
                    cantrips_sel,
                    CantripsSelection.A.sid,
                    mapMaybe (pipe (lookupF (cantrips), fmap (Cantrip.A.name))),
                    sortStrings (staticData),
                    intercalate (", ")
                  )

                const text = translateP (staticData)
                                        ("inlinewiki.cantripsfromlist")
                                        (List (counter, options))

                return `${text}, `
              })
      )

    const spells_str =
      pipe_ (
        profession,
        PCA_.spells,
        mapMaybe (x => {
          if (IncreaseSkillList.is (x)) {
            const ids = ILSA.id (x)
            const value = ILSA.value (x)

            return pipe_ (
              ids,
              mapMaybe (pipe (lookupF (spells), fmap (Spell.A.name))),
              ensure (pipe (flength, gt (1))),
              fmap (pipe (localizeOrList (staticData), names => `${names} ${value}`))
            )
          }
          else {
            const id = ISA.id (x)
            const value = ISA.value (x)

            return fmapF (lookup (id) (spells)) (spell => `${Spell.A.name (spell)} ${value}`)
          }
        }),
        sortStrings (staticData),
        intercalate (", ")
      )


    return cantrips_str.length === 0 || spells_str.length === 0
      ? Nothing
      : Just (`${cantrips_str}${spells_str}`)
  }

const getLiturgicalChants =
  (staticData: StaticDataRecord) =>
  (blessings: OrderedMap<string, Record<Blessing>>) =>
  (liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>) =>
  (profession: Record<ProfessionCombined>): Maybe<string> =>
    pipe_ (
      profession,
      PCA_.liturgicalChants,
      mapMaybe (x => {
        if (IncreaseSkillList.is (x)) {
          const ids = ILSA.id (x)
          const value = ILSA.value (x)

          return pipe_ (
            ids,
            mapMaybe (pipe (lookupF (liturgicalChants), fmap (LiturgicalChant.A.name))),
            ensure (pipe (flength, gt (1))),
            fmap (pipe (localizeOrList (staticData), names => `${names} ${value}`))
          )
        }
        else {
          const id = ISA.id (x)
          const value = ISA.value (x)

          return fmapF (lookup (id) (liturgicalChants))
                       (chant => `${LiturgicalChant.A.name (chant)} ${value}`)
        }
      }),
      xs => {
        const incl_blessings = PCA_.blessings (profession)

        if (flength (incl_blessings) === 12) {
          return cons (xs) (translate (staticData) ("inlinewiki.thetwelveblessings"))
        }
        else if (flength (incl_blessings) === 9) {
          return pipe_ (
            blessings,
            elems,
            mapMaybe (pipe (
                       ensure (pipe (
                                Blessing.A.id,
                                id => notElem (id) (incl_blessings) && getNumericId (id) <= 12
                              )),
                       fmap (Blessing.A.name)
                     )),
            sortStrings (staticData),
            translateP (staticData) ("inlinewiki.thetwelveblessingsexceptions"),
            str => cons (xs) (str)
          )
        }
        else if (flength (incl_blessings) === 6) {
          return cons (xs) (translate (staticData) ("inlinewiki.sixblessings"))
        }

        return xs
      },
      sortStrings (staticData),
      ensure (notNull),
      fmap (intercalate (", "))
    )

interface SkillsListProps {
  profession: Record<ProfessionCombined>
  staticData: StaticDataRecord
  skillsSelection: Maybe<Record<SkillsSelectionJoined>>
}

function SkillsList (props: SkillsListProps): JSX.Element {
  const {
    profession,
    staticData,
    skillsSelection,
  } = props

  const xss = List (
    PCA.mappedPhysicalSkills (profession),
    PCA.mappedSocialSkills (profession),
    PCA.mappedNatureSkills (profession),
    PCA.mappedKnowledgeSkills (profession),
    PCA.mappedCraftSkills (profession)
  )

  return (
    <>
      {pipe_ (
        xss,
        imap (i => xs => (
               <Skills
                 key={i}
                 groupIndex={i}
                 list={xs}
                 staticData={staticData}
                 skillsSelection={skillsSelection}
                 />
             )),
        toArray
      )}
    </>
  )
}

interface SkillProps {
  staticData: StaticDataRecord
  groupIndex: number
  list: List<Record<IncreasableForView>>
  skillsSelection: Maybe<Record<SkillsSelectionJoined>>
}

function Skills (props: SkillProps) {
  const {
    groupIndex,
    list,
    staticData,
    skillsSelection: mskills_selection,
  } = props

  return pipe_ (
      list,
      map (e => `${IFVA.name (e)} ${IFVA.value (e)}`),
      sortStrings (staticData),
      xs => maybe (xs)
                  ((skills_selection: Record<SkillsSelectionJoined>) => {
                    const mgr =
                      pipe_ (
                        skills_selection,
                        SkillsSelectionJoined.A.properties,
                        SkillsSelection.A.gr
                      )

                    const is_group_valid = any (pipe (dec, equals (groupIndex))) (mgr)

                    return is_group_valid
                      ? snoc (xs) (SkillsSelectionJoined.A.text (skills_selection))
                      : xs
                  })
                  (mskills_selection),
      intercalate (", "),
      joined_text => (
        <p className="skill-group">
          <span>
            {pipe_ (
              groupIndex,
              inc,
              lookupF (SDA.skillGroups (staticData)),
              renderMaybeWith (SGA.name)
            )}
            {": "}
          </span>
          <span>{notNull (list) ? joined_text : ndash}</span>
        </p>
      )
    )
}

interface VariantPrerequisiteIntermediate {
  "@@name": "VariantPrerequisiteIntermediate"
  id: string
  name: string
  active: Maybe<boolean>
}

const VariantPrerequisiteIntermediate =
  fromDefault ("VariantPrerequisiteIntermediate") <VariantPrerequisiteIntermediate> ({
                id: "",
                name: "",
                active: Nothing,
              })

const getVariantPrerequisites =
  (staticData: StaticDataRecord) =>
  (attributes: OrderedMap<string, Record<Attribute>>) =>
  (skills: OrderedMap<string, Record<Skill>>) =>
  (variant: Record<ProfessionVariantCombined>) =>
    pipe_ (
      variant,
      PVCA.mappedPrerequisites,
      map (x => {
            if (ProfessionRequireIncreasable.is (x)) {
              const id = PRIA.id (x)
              const value = PRIA.value (x)

              type wiki_entry = Record<Attribute> | Record<Skill>

              const wiki_entry =
                alt_<wiki_entry> (lookup (id) (attributes)) (() => lookup (id) (skills))

              const mname = fmapF (wiki_entry)
                                  (e => Attribute.is (e) ? Attribute.A.short (e) : Skill.A.name (e))

              return VariantPrerequisiteIntermediate ({
                id,
                name: `${renderMaybe (mname)} ${value}`,
              })
            }
            else {
              const id = ANCIAA_.id (x)
              const active = ANCIAA.isActive (x)
              const name = ANCIAA_.name (x)
              const finalCost = ANCIAA_.finalCost (x)

              return VariantPrerequisiteIntermediate ({
                id,
                name: translateP (staticData)
                                 ("general.withapvalue")
                                 (List<string | number> (name, finalCost)),
                active: Just (active),
              })
            }
          }),
      sortRecordsByName (staticData),
      map (x => {
            if (Maybe.and (VariantPrerequisiteIntermediate.A.active (x))) {
              return VariantPrerequisiteIntermediate.A.name (x)
            }
            else {
              return (
                <span key={VariantPrerequisiteIntermediate.A.id (x)} className="disabled">
                  {VariantPrerequisiteIntermediate.A.name (x)}
                </span>
              )
            }
          }),
      intersperse<React.ReactNode> (", "),
      ensure (notNull),
      fmap (pipe (
        toArray,
        xs => (
          <>
            {translate (staticData) ("inlinewiki.prerequisites")}
            {": "}
            {xs}
            {"; "}
          </>
        )
      ))
    )

interface VariantSpecialAbilitiesProps {
  variant: Record<ProfessionVariantCombined>
}

const getVariantSpecialAbilities =
  (props: VariantSpecialAbilitiesProps): List<Maybe<NonNullable<React.ReactNode>>> =>
    pipe_ (
      props.variant,
      PVCA.mappedSpecialAbilities,
      map (e =>
        ANCIAA.isActive (e)
          ? Just (ANCIAA_.name (e))
          : Just (
              <span key={ANCIAA_.id (e)} className="disabled">
                {ANCIAA_.name (e)}
              </span>
            ))
    )

interface VariantLanguagesLiteracySelectionProps {
  staticData: StaticDataRecord
  variant: Record<ProfessionVariantCombined>
}

const getVariantLanguagesLiteracySelection =
  (mappedProfSelections: Record<ProfessionSelections>) =>
  (props: VariantLanguagesLiteracySelectionProps): Maybe<string> => {
    const {
      staticData,
      variant,
    } = props

    const mappedProfVariantSelections = PVCA.mappedSelections (variant)

    const msel =
      PSA[ProfessionSelectionIds.LANGUAGES_SCRIPTS] (mappedProfSelections)

    const mvariant_sel =
      PVSA[ProfessionSelectionIds.LANGUAGES_SCRIPTS] (mappedProfVariantSelections)

    if (isJust (mvariant_sel)) {
      const variant_sel = fromJust (mvariant_sel)
      const vvalue = LanguagesScriptsSelection.A.value (variant_sel)

      const main_str = translateP (staticData)
                                  ("inlinewiki.languagesandliteracytotalingap")
                                  (List (vvalue))

      if (isJust (msel)) {
        const value = LanguagesScriptsSelection.A.value (fromJust (msel))
        const instead = translate (staticData) ("inlinewiki.insteadof")

        return Just (`${main_str} ${instead} ${value}`)
      }
      else {
        return Just (main_str)
      }
    }

    return Nothing
  }

interface VariantSpecializationSelectionProps {
  staticData: StaticDataRecord
  skills: OrderedMap<string, Record<Skill>>
  specializationSelectionString: Maybe<string>
  variant: Record<ProfessionVariantCombined>
}

const getVariantSpecializationSelection =
  (mappedProfSelections: Record<ProfessionSelections>) =>
  (props: VariantSpecializationSelectionProps): Maybe<NonNullable<React.ReactNode>> => {
    const {
      staticData,
      skills,
      specializationSelectionString,
      variant,
    } = props

    const mappedProfVariantSelections = PVCA.mappedSelections (variant)

    const msel =
      PSA[ProfessionSelectionIds.SPECIALIZATION] (mappedProfSelections)

    const mvariant_sel =
      PVSA[ProfessionSelectionIds.SPECIALIZATION] (mappedProfVariantSelections)

    if (isJust (mvariant_sel)) {
      const variant_sel = fromJust (mvariant_sel)

      if (isRemoveSpecializationSelection (variant_sel)) {
        return Just (
          <span className="disabled">
            {renderMaybe (specializationSelectionString)}
          </span>
        )
      }
      else {
        const vsid = SpecializationSelection.A.sid (variant_sel)

        const mskill_text =
          isList (vsid)
            ? pipe_ (
                vsid,
                mapMaybe (pipe (lookupF (skills), fmap (Skill.A.name))),
                sortStrings (staticData),
                ensure (pipe (flength, gt (1))),
                fmap (localizeOrList (staticData))
              )
            : pipe_ (vsid, lookupF (skills), fmap (Skill.A.name))

        const mmain_text = fmapF (mskill_text)
                                 (skill_text => translateP (staticData)
                                                           ("inlinewiki.skillspecialization")
                                                           (List (skill_text)))

        if (isJust (msel)) {
          const instead = translate (staticData) ("inlinewiki.insteadof")
          const next = renderMaybe (mmain_text)
          const prev = renderMaybe (specializationSelectionString)

          return Just (`${next} ${instead} ${prev}`)
        }
        else {
          return Just (renderMaybe (mmain_text))
        }
      }
    }

    return Nothing
  }

interface VariantCombatTechniquesSelectionProps {
  combatTechniquesSelectionString: Maybe<string>
  staticData: StaticDataRecord
  variant: Record<ProfessionVariantCombined>
}

const getVariantCombatTechniquesSelection =
  (mappedProfSelections: Record<ProfessionSelections>) =>
  (props: VariantCombatTechniquesSelectionProps): Maybe<NonNullable<React.ReactNode>> => {
    const {
      combatTechniquesSelectionString,
      staticData,
      variant,
    } = props

    const mappedProfVariantSelections = PVCA.mappedSelections (variant)

    const msel =
      PSA[ProfessionSelectionIds.COMBAT_TECHNIQUES] (mappedProfSelections)

    const mvariant_sel =
      PVSA[ProfessionSelectionIds.COMBAT_TECHNIQUES] (mappedProfVariantSelections)

    if (isJust (mvariant_sel)) {
      const variant_sel = fromJust (mvariant_sel)

      if (isRemoveCombatTechniquesSelection (variant_sel)) {
        return Just (
          <span className="disabled">{renderMaybe (combatTechniquesSelectionString)}</span>
        )
      }
      else if (isJust (msel)) {
        const sel = fromJust (msel)
        const sid = CombatTechniquesSelection.A.sid (sel)
        const amount = CombatTechniquesSelection.A.amount (sel)
        const value = CombatTechniquesSelection.A.value (sel)
        const vsid = CombatTechniquesSelection.A.sid (variant_sel)
        const vamount = CombatTechniquesSelection.A.amount (variant_sel)
        const vvalue = CombatTechniquesSelection.A.value (variant_sel)

        const hasSameSids = OrderedSet.fnull (difference (fromList (sid)) (fromList (vsid)))
        const hasSameAmount = amount === vamount

        if (hasSameSids && hasSameAmount) {
          const instead = translate (staticData) ("inlinewiki.insteadof")

          const joinedList = pipe_ (sid, sortStrings (staticData), localizeOrList (staticData))

          return Just (`${joinedList} ${vvalue} ${instead} ${value}`)
        }
      }
      else {
        const vsid = CombatTechniquesSelection.A.sid (variant_sel)
        const vamount = CombatTechniquesSelection.A.amount (variant_sel)
        const vvalue = CombatTechniquesSelection.A.value (variant_sel)

        const joinedList = pipe_ (vsid, sortStrings (staticData), intercalate (", "))

        const tag = translateP (staticData)
                               ("inlinewiki.combattechniqueselection")
                               (List<string | number> (
                                 vamount === 1
                                 ? translate (staticData) ("inlinewiki.combattechnique.one")
                                 : vamount === 2
                                 ? translate (staticData) ("inlinewiki.combattechnique.two")
                                 : "...",
                                 vvalue + 6,
                                 joinedList
                               ))

        return Just (`${tag}`)
      }
    }

    return Nothing
  }

const mapVariantSkills =
  (staticData: StaticDataRecord) =>
  (base: number) =>
    map ((e: Record<IncreasableForView>) => {
      const prev = fromMaybe (base) (IFVA.previous (e))

      return `${IFVA.name (e)} ${IFVA.value (e)} ${translate (staticData) ("inlinewiki.insteadof")} ${prev}`
    })

const getCombinedSpellName =
  (staticData: StaticDataRecord) =>
  (x: CombinedMappedSpell): string =>
    IncreasableListForView.is (x) ? localizeOrList (staticData) (ILFVA.name (x)) : IFVA.name (x)

type CombinedMappedSpell = Record<IncreasableForView> | Record<IncreasableListForView>

/**
 * fst => old
 *
 * snd => new
 */
type SpellPair = Pair<CombinedMappedSpell, CombinedMappedSpell>

type CombinedSpells = List<CombinedMappedSpell | SpellPair>

type CombinedSpellsPair =
  Pair<List<CombinedMappedSpell>, List<CombinedMappedSpell | SpellPair>>

type CombinedSpellsPairValid =
  Pair<NonEmptyList<CombinedMappedSpell>, List<CombinedMappedSpell | SpellPair>>

const combineSpellsPred =
  (x: CombinedSpellsPair): x is CombinedSpellsPairValid =>
    pipe_ (x, fst, notNull)

const combineSpells: (mapped_spells: List<CombinedMappedSpell>) => CombinedSpells =
  pipe (
    mapped_spells => Pair (mapped_spells, List<CombinedMappedSpell | SpellPair> ()),
    whilePred (combineSpellsPred)
              (p => {
                const processeds = snd (p)
                const remainings_separate = fromJust ((uncons as unconsSafe) (fst (p)))
                const current = fst (remainings_separate)
                const current_value = IFVAL.value (current)
                const mcurrent_previous_value = IFVAL.previous (current)
                const remainings = snd (remainings_separate)

                // This is the previous spell, and we need the next to form a pair
                if (isJust (mcurrent_previous_value)) {
                  // Index of a spell to pair `current` with
                  const mmatching_spell_index =
                    findIndex ((e: CombinedMappedSpell) =>
                                IFVAL.value (e) === fromJust (mcurrent_previous_value)
                                && current_value === 0)
                              (remainings)

                  if (isJust (mmatching_spell_index)) {
                    // Index found, so we can pair
                    const index = fromJust (mmatching_spell_index)

                    return Pair (
                      deleteAt (index) (remainings),
                      cons (processeds)
                           (Pair (current, unsafeIndex (remainings) (index)))
                    )
                  }
                  else {
                    return Pair (remainings, cons (processeds) (current))
                  }
                }

                // Otherwise, this is the next and we need the previous to form a pair
                else {
                  // Index of a spell to pair `current` with
                  const mmatching_spell_index =
                    findIndex ((e: CombinedMappedSpell) =>
                                Maybe.elem (current_value) (IFVAL.previous (e))
                                && IFVAL.value (e) === 0)
                              (remainings)

                  if (isJust (mmatching_spell_index)) {
                    // Index found, so we can pair
                    const index = fromJust (mmatching_spell_index)

                    return Pair (
                      deleteAt (index) (remainings),
                      cons (processeds)
                           (Pair (unsafeIndex (remainings) (index), current))
                    )
                  }
                  else {
                    return Pair (remainings, cons (processeds) (current))
                  }
                }
              }),
    snd,
    reverse
  )

interface VariantSkillsSelectionProps {
  staticData: StaticDataRecord
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>
  variant: Record<ProfessionVariantCombined>
}

const getVariantSkillsSelection =
  (props: VariantSkillsSelectionProps): string => {
    const {
      staticData,
      liturgicalChants,
      variant,
    } = props

    const instead = translate (staticData) ("inlinewiki.insteadof")

    const combatTechniquesList =
      pipe_ (variant, PVCA.mappedCombatTechniques, mapVariantSkills (staticData) (6))

    const skillsList =
      pipe_ (variant, PVCA.mappedSkills, mapVariantSkills (staticData) (0))

    const combinedSpellsList = combineSpells (PVCA.mappedSpells (variant))

    const spellsList =
      map ((e: ListI<CombinedSpells>) => {
            if (isTuple (e)) {
              const old_entry = fst (e)
              const new_entry = snd (e)
              const value = IFVAL.value (new_entry)

              const old_name = getCombinedSpellName (staticData) (old_entry)
              const new_name = getCombinedSpellName (staticData) (new_entry)

              return `${new_name} ${value} ${instead} ${old_name} ${value}`
            }
            else {
              const value = IFVAL.value (e)
              const previous = Maybe.sum (IFVAL.previous (e))
              const name = getCombinedSpellName (staticData) (e)

              return `${name} ${value} ${instead} ${previous}`
            }
          })
          (combinedSpellsList)

    const combinedList =
      intercalate (", ")
                  (List (
                    ...sortStrings (staticData) (combatTechniquesList),
                    ...sortStrings (staticData) (skillsList),
                    ...sortStrings (staticData) (spellsList)
                  ))

    return maybe (combinedList)
                 ((chants: NonEmptyList<CombinedMappedSpell>) => {
                   const blessings = translate (staticData) ("inlinewiki.thetwelveblessings")

                   return pipe_ (
                     chants,
                     mapMaybe (e => {
                       if (IncreasableListForView.is (e)) {
                         const names = mapMaybe (pipe (lookupF (liturgicalChants), fmap (LCA.name)))
                                                (ILFVA.id (e))

                         return fmapF (ensure (pipe (flength, gt (1))) (names))
                                      (pipe (
                                        localizeOrList (staticData),
                                        name => `${name} ${ILFVA.value (e)}`
                                      ))
                       }
                       else {
                         const mname =
                           pipe_ (liturgicalChants, lookup (IFVA.id (e)), fmap (LCA.name))

                         return fmapF (mname)
                                      (name => `${name} ${IFVA.value (e)}`)
                       }
                     }),
                     flength (PVCA_.blessings (variant)) === 12 ? consF (blessings) : ident,
                     sortStrings (staticData),
                     intercalate (", "),
                     xs => `${combinedList}, ${translate (staticData) ("inlinewiki.liturgicalchants")}: ${xs}`
                   )
                 })
                 (ensure (notNull) (PVCA.mappedLiturgicalChants (variant)))
  }

interface VariantListHeaderProps {
  staticData: StaticDataRecord
}

function VariantListHeader (props: VariantListHeaderProps): JSX.Element {
  const { staticData } = props

  return (
    <p className="profession-variants">
      <span>{translate (staticData) ("inlinewiki.variants")}</span>
    </p>
  )
}

interface VariantListProps {
  attributes: OrderedMap<string, Record<Attribute>>
  combatTechniquesSelectionString: Maybe<string>
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>
  staticData: StaticDataRecord
  profession: Record<ProfessionCombined>
  sex: Maybe<Sex>
  skills: OrderedMap<string, Record<Skill>>
  specializationSelectionString: Maybe<string>
  spells: OrderedMap<string, Record<Spell>>
}

function VariantList (props: VariantListProps): JSX.Element | null {
  const {
    attributes,
    combatTechniquesSelectionString,
    liturgicalChants,
    staticData,
    profession,
    sex,
    skills,
    specializationSelectionString,
    spells,
  } = props

  const variants = PCA.mappedVariants (profession)

  if (notNull (variants)) {
    return (
      <>
        <VariantListHeader staticData={staticData} />
        <ul className="profession-variants">
          {
            pipe_ (
              variants,
              map (variant => (
                    <Variant
                      key={PVCA_.id (variant)}
                      attributes={attributes}
                      combatTechniquesSelectionString={combatTechniquesSelectionString}
                      liturgicalChants={liturgicalChants}
                      staticData={staticData}
                      profession={profession}
                      sex={sex}
                      skills={skills}
                      specializationSelectionString={specializationSelectionString}
                      spells={spells}
                      variant={variant}
                      />
                  )),
              toArray
            )
          }
        </ul>
      </>
    )
  }

  return null
}

interface VariantProps {
  attributes: OrderedMap<string, Record<Attribute>>
  combatTechniquesSelectionString: Maybe<string>
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>
  staticData: StaticDataRecord
  profession: Record<ProfessionCombined>
  sex: Maybe<Sex>
  skills: OrderedMap<string, Record<Skill>>
  specializationSelectionString: Maybe<string>
  spells: OrderedMap<string, Record<Spell>>
  variant: Record<ProfessionVariantCombined>
}

function Variant (props: VariantProps) {
  const {
    attributes,
    staticData,
    profession,
    sex: msex,
    skills,
    variant,
  } = props

  const fullText = PVCA_.fullText (variant)

  const name = getNameBySex (fromMaybe<Sex> ("m") (msex)) (PVCA_.name (variant))

  const ap_sum = Maybe.sum (PCA_.ap (profession)) + PVCA_.ap (variant)

  if (isJust (fullText)) {
    return (
      <li>
        <Markdown
          source={translateP (staticData)
                             ("general.withapvalue")
                             (List<string | number> (`*${name}*`, ap_sum))}
          noWrapper
          />
        {": "}
        {fromJust (fullText)}
      </li>
    )
  }

  return (
    <li>
      <Markdown
        source={translateP (staticData)
                           ("general.withapvalue")
                           (List<string | number> (`*${name}*`, ap_sum))}
        noWrapper
        />
      {": "}
      <span>
        {maybeRNullF (PVCA_.precedingText (variant))
                     (str => <span>{str}</span>)}
        {fromMaybe (<></>)
                   (getVariantPrerequisites (staticData)
                                            (attributes)
                                            (skills)
                                            (variant))}
        {pipe_ (
          List<Maybe<NonNullable<React.ReactNode>>> (
            ...getVariantSpecialAbilities (props),
            getVariantLanguagesLiteracySelection (PCA_.selections (profession)) (props),
            getVariantSpecializationSelection (PCA_.selections (profession)) (props),
            getVariantCombatTechniquesSelection (PCA_.selections (profession)) (props),
            Just (getVariantSkillsSelection (props)),
            PVCA_.concludingText (variant)
          ),
          catMaybes,
          intersperse<React.ReactNode> (", "),
          toArray
        )}
      </span>
    </li>
  )
}

export interface WikiProfessionInfoProps {
  staticData: StaticDataRecord
  x: Record<ProfessionCombined>
  sex: Maybe<Sex>
}

// tslint:disable-next-line: cyclomatic-complexity
export const WikiProfessionInfo: React.FC<WikiProfessionInfoProps> = props => {
  const { x, sex, staticData } = props

  const attributes = SDA.attributes (staticData)
  const blessings = SDA.blessings (staticData)
  const cantrips = SDA.cantrips (staticData)
  const liturgicalChants = SDA.liturgicalChants (staticData)
  const races = SDA.races (staticData)
  const skills = SDA.skills (staticData)
  const spells = SDA.spells (staticData)
  const specialAbilities = SDA.specialAbilities (staticData)

  const selections = PCA.mappedSelections (x)

  const name = getNameBySex (fromMaybe<Sex> ("m") (sex)) (PCA_.name (x))
  const msubname = getNameBySexM (fromMaybe<Sex> ("m") (sex)) (PCA_.subname (x))

  const specializationSelectionString =
    getSpecializationSelection (staticData) (skills) (x)

  const skillsSelectionJoinedObject =
    getSkillSelection (staticData) (x)

  const cursesSelection =
    PSA[ProfessionSelectionIds.CURSES] (selections)

  const languagesLiteracySelection =
    PSA[ProfessionSelectionIds.LANGUAGES_SCRIPTS] (selections)

  const combatTechniquesSelectionString =
    getCombatTechniquesSelection (staticData) (x)

  const terrainKnowledgeSelectionString =
    getTerrainKnowledgeSelection (staticData) (specialAbilities) (x)

  const spellsString =
    getSpells (staticData) (cantrips) (spells) (x)

  const liturgicalChantsString =
    getLiturgicalChants (staticData) (blessings) (liturgicalChants) (x)

  const raceRequirement =
     pipe_ (x, PCA_.dependencies, find (RaceRequirement.is))

  const sexRequirement =
     pipe_ (x, PCA_.dependencies, find (isSexRequirement))

  const getRaceNameAP =
    (race: Record<Race>) =>
      translateP (staticData)
                 ("general.withapvalue")
                 (List<string | number> (Race.A.name (race), Race.A.ap (race)))

  const mrace_depencency_str =
    bind (raceRequirement)
         (pipe (
           race_dep => {
             const value = RaceRequirement.A.value (race_dep)

             return isList (value)
               ? pipe_ (
                   value,
                   mapMaybe (pipe (prefixRace, lookupF (races), fmap (getRaceNameAP))),
                   ensure (notNull),
                   fmap (localizeOrList (staticData))
                 )
               : pipe_ (value, prefixRace, lookupF (races), fmap (getRaceNameAP))
           },
           fmap (str => `${translate (staticData) ("inlinewiki.race")}: ${str}`)
         ))

  const prereq_strs =
    pipe_ (
      x,
      PCA.mappedPrerequisites,
      mapMaybe (e => {
        if (ProfessionRequireIncreasable.is (e)) {
          const id = PRIA.id (e)
          const value = PRIA.value (e)
          const mwiki_entry =
            alt_<Record<Attribute> | Record<Skill>> (lookup (id) (attributes))
                                                    (() => lookup (id) (skills))

          return fmapF (mwiki_entry)
                       (wiki_entry =>
                         Attribute.is (wiki_entry)
                           ? `${Attribute.A.short (wiki_entry)} ${value}`
                           : `${Skill.A.name (wiki_entry)} ${value}`)
        }
        else {
          const pr_name = ANCIAA_.name (e)
          const pr_cost_str = signNeg (ANCIAA_.finalCost (e))

          return Just (translateP (staticData)
                                  ("general.withapvalue")
                                  (List<string | number> (pr_name, pr_cost_str)))
        }
      }),
      sortStrings (staticData)
    )

  const prerequisites = List (
    ...maybeToList (mrace_depencency_str),
    ...maybeToList (PCA_.prerequisitesStart (x)),
    ...prereq_strs,
    ...maybeToList (PCA_.prerequisitesEnd (x))
  )

  const sex_dep_str =
    fmapF (sexRequirement)
          (sex_dep => {
            const space_before = notNull (prerequisites) ? " " : ""
            const sex_tag = translate (staticData) ("inlinewiki.sex")
            const sex_value =
              SexRequirement.A.value (sex_dep) === "m"
                ? translate (staticData) ("inlinewiki.sex.male")
                : translate (staticData) ("inlinewiki.sex.female")

            return `${space_before}${sex_tag}: ${sex_value}`
          })

  const single_sas_strs =
    pipe_ (
      x,
      PCA.mappedSpecialAbilities,
      map (ANCIAA_.name),
      sortStrings (staticData)
    )

  const sas_str =
    pipe_ (
      List<string> (),
      maybe<ident<List<string>>> (ident)
                                 ((curss: Record<CursesSelection>) =>
                                   consF (translateP (staticData)
                                                     ("inlinewiki.cursestotalingap")
                                                     (List (CursesSelection.A.value (curss)))))
                                 (cursesSelection),
      maybe<ident<List<string>>> (ident) <string> (consF) (terrainKnowledgeSelectionString),
      maybe<ident<List<string>>> (ident) <string> (consF) (specializationSelectionString),
      maybe<ident<List<string>>> (ident)
                                 ((curss: Record<LanguagesScriptsSelection>) =>
                                   consF (translateP (staticData)
                                                     ("inlinewiki.languagesandliteracytotalingap")
                                                     (List (
                                                       LanguagesScriptsSelection.A.value (curss)
                                                     ))))
                                 (languagesLiteracySelection),
      sortStrings (staticData),
      flip (append) (single_sas_strs),
      ensure (notNull),
      maybe (translate (staticData) ("general.none")) (intercalate (", "))
    )

  const final_ap =
    fromMaybe_ (() => pipe_ (
                        x,
                        PCA.mappedVariants,
                        foldr (pipe (PVCA_.ap, insert))
                              (OrderedSet.empty),
                        toList,
                        sortBy (compare),
                        localizeOrList (staticData)
                      ))
               (fmapF (PCA_.ap (x)) (show))

  return (
    <WikiBoxTemplate
      className="profession"
      title={maybe (name) ((subname: string) => `${name} (${subname})`) (msubname)}
      >
      <WikiProperty staticData={staticData} title="inlinewiki.apvalue">
        {final_ap}
        {" "}
        {translate (staticData) ("inlinewiki.adventurepoints")}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.prerequisites">
        {maybe (translate (staticData) ("general.none"))
               (intercalate (", "))
               (ensure (notNull) (prerequisites))}
        {renderMaybe (sex_dep_str)}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.specialabilities">
        {sas_str}
      </WikiProperty>
      <CombatTechniques
        combatTechniquesSelectionString={combatTechniquesSelectionString}
        x={x}
        staticData={staticData}
        />
      <WikiProperty staticData={staticData} title="inlinewiki.skills" />
      <SkillsList
        profession={x}
        staticData={staticData}
        skillsSelection={skillsSelectionJoinedObject}
        />
      {maybeRNullF (spellsString)
                   (str => (
                     <WikiProperty staticData={staticData} title="inlinewiki.spells">
                       {str}
                     </WikiProperty>
                   ))}
      {maybeRNullF (liturgicalChantsString)
                   (str => (
                     <WikiProperty staticData={staticData} title="inlinewiki.liturgicalchants">
                       {str}
                     </WikiProperty>
                   ))}
      <WikiProperty staticData={staticData} title="inlinewiki.suggestedadvantages">
        {fromMaybe (translate (staticData) ("general.none")) (PCA_.suggestedAdvantagesText (x))}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.suggesteddisadvantages">
        {fromMaybe (translate (staticData) ("general.none")) (PCA_.suggestedDisadvantagesText (x))}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.unsuitableadvantages">
        {fromMaybe (translate (staticData) ("general.none")) (PCA_.unsuitableAdvantagesText (x))}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.unsuitabledisadvantages">
        {fromMaybe (translate (staticData) ("general.none")) (PCA_.unsuitableDisadvantagesText (x))}
      </WikiProperty>
      <VariantList
        attributes={attributes}
        combatTechniquesSelectionString={combatTechniquesSelectionString}
        liturgicalChants={liturgicalChants}
        staticData={staticData}
        profession={x}
        sex={sex}
        skills={skills}
        specializationSelectionString={specializationSelectionString}
        spells={spells}
        />
      <WikiSource
        x={x}
        staticData={staticData}
        acc={PCA_}
        />
    </WikiBoxTemplate>
  )
}
