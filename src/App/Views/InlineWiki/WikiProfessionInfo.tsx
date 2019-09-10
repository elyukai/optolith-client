import * as React from "react";
import { equals } from "../../../Data/Eq";
import { flip, ident } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { append, cons, consF, deleteAt, find, findIndex, flength, foldr, imap, intercalate, intersperse, isList, List, ListI, map, NonEmptyList, notElem, notNull, reverse, snoc, sortBy, subscript, toArray, uncons, unconsSafe, unsafeIndex } from "../../../Data/List";
import { alt_, any, bind, bindF, catMaybes, ensure, fromJust, fromMaybe, fromMaybe_, isJust, Just, liftM2, mapMaybe, Maybe, maybe, maybeRNullF, maybeToList, maybe_, Nothing } from "../../../Data/Maybe";
import { compare, dec, gt } from "../../../Data/Num";
import { elems, lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { difference, fromList, insert, OrderedSet, toList } from "../../../Data/OrderedSet";
import { fromDefault, Record } from "../../../Data/Record";
import { show } from "../../../Data/Show";
import { fst, isTuple, Pair, snd } from "../../../Data/Tuple";
import { SpecialAbilityId } from "../../Constants/Ids";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { ActivatableNameCostIsActive, ActivatableNameCostIsActiveA_ } from "../../Models/View/ActivatableNameCostIsActive";
import { IncreasableForView } from "../../Models/View/IncreasableForView";
import { IncreasableListForView } from "../../Models/View/IncreasableListForView";
import { ProfessionCombined, ProfessionCombinedA_ } from "../../Models/View/ProfessionCombined";
import { ProfessionVariantCombined, ProfessionVariantCombinedA_ } from "../../Models/View/ProfessionVariantCombined";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Blessing } from "../../Models/Wiki/Blessing";
import { Book } from "../../Models/Wiki/Book";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { ProfessionRequireIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { RaceRequirement } from "../../Models/Wiki/prerequisites/RaceRequirement";
import { isSexRequirement, SexRequirement } from "../../Models/Wiki/prerequisites/SexRequirement";
import { CantripsSelection } from "../../Models/Wiki/professionSelections/CantripsSelection";
import { CombatTechniquesSelection } from "../../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { CursesSelection } from "../../Models/Wiki/professionSelections/CursesSelection";
import { LanguagesScriptsSelection } from "../../Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { ProfessionSelections } from "../../Models/Wiki/professionSelections/ProfessionAdjustmentSelections";
import { ProfessionVariantSelections } from "../../Models/Wiki/professionSelections/ProfessionVariantAdjustmentSelections";
import { isRemoveCombatTechniquesSelection } from "../../Models/Wiki/professionSelections/RemoveCombatTechniquesSelection";
import { isRemoveSpecializationSelection } from "../../Models/Wiki/professionSelections/RemoveSpecializationSelection";
import { CombatTechniquesSecondSelection } from "../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { SkillsSelection } from "../../Models/Wiki/professionSelections/SkillsSelection";
import { SpecializationSelection } from "../../Models/Wiki/professionSelections/SpecializationSelection";
import { TerrainKnowledgeSelection } from "../../Models/Wiki/professionSelections/TerrainKnowledgeSelection";
import { Race } from "../../Models/Wiki/Race";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { IncreaseSkill } from "../../Models/Wiki/sub/IncreaseSkill";
import { IncreaseSkillList } from "../../Models/Wiki/sub/IncreaseSkillList";
import { ProfessionSelectionIds } from "../../Models/Wiki/wikiTypeHelpers";
import { getSelectOptionName } from "../../Utilities/Activatable/selectionUtils";
import { ndash } from "../../Utilities/Chars";
import { localizeOrList, translate, translateP } from "../../Utilities/I18n";
import { getNumericId, prefixRace } from "../../Utilities/IDUtils";
import { signNeg } from "../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { getNameBySex, getNameBySexM } from "../../Utilities/rcpUtils";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { sortRecordsByName, sortStrings } from "../../Utilities/sortBy";
import { whilePred } from "../../Utilities/whilePred";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiProfessionInfoProps {
  attributes: OrderedMap<string, Record<Attribute>>
  blessings: OrderedMap<string, Record<Blessing>>
  books: OrderedMap<string, Record<Book>>
  cantrips: OrderedMap<string, Record<Cantrip>>
  x: Record<ProfessionCombined>
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>
  l10n: L10nRecord
  sex: Maybe<Sex>
  races: OrderedMap<string, Record<Race>>
  skills: OrderedMap<string, Record<Skill>>
  spells: OrderedMap<string, Record<Spell>>
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>
}

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

// tslint:disable-next-line: cyclomatic-complexity
export function WikiProfessionInfo (props: WikiProfessionInfoProps): JSX.Element {
  const {
    attributes,
    blessings,
    cantrips,
    x,
    liturgicalChants,
    l10n,
    races,
    sex,
    skills,
    spells,
    specialAbilities,
    books,
  } = props

  const selections = PCA.mappedSelections (x)

  const name = getNameBySex (fromMaybe<Sex> ("m") (sex)) (PCA_.name (x))
  const msubname = getNameBySexM (fromMaybe<Sex> ("m") (sex)) (PCA_.subname (x))

  const specializationSelectionString =
    getSpecializationSelection (l10n) (skills) (x)

  const skillsSelectionJoinedObject =
    getSkillSelection (l10n) (x)

  const cursesSelection =
    PSA[ProfessionSelectionIds.CURSES] (selections)

  const languagesLiteracySelection =
    PSA[ProfessionSelectionIds.LANGUAGES_SCRIPTS] (selections)

  const combatTechniquesSelectionString =
    getCombatTechniquesSelection (l10n) (x)

  const terrainKnowledgeSelectionString =
    getTerrainKnowledgeSelection (l10n) (specialAbilities) (x)

  const spellsString =
    getSpells (l10n) (cantrips) (spells) (x)

  const liturgicalChantsString =
    getLiturgicalChants (l10n) (blessings) (liturgicalChants) (x)

  const raceRequirement =
     pipe_ (x, PCA_.dependencies, find (RaceRequirement.is))

  const sexRequirement =
     pipe_ (x, PCA_.dependencies, find (isSexRequirement))

  const getRaceNameAP =
    (race: Record<Race>) =>
      `${Race.A.name (race)} (${Race.A.ap (race)} ${translate (l10n) ("adventurepoints.short")})`

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
                   fmap (localizeOrList (l10n))
                 )
               : pipe_ (value, prefixRace, lookupF (races), fmap (getRaceNameAP))
           },
           fmap (str => `${translate (l10n) ("race")}: ${str}`)
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
          const ap_tag = translate (l10n) ("adventurepoints.short")

          return Just (`${pr_name} (${pr_cost_str} ${ap_tag})`)
        }
      }),
      sortStrings (l10n)
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
            const sex_tag = translate (l10n) ("sex")
            const sex_value =
              SexRequirement.A.value (sex_dep) === "m"
                ? translate (l10n) ("male")
                : translate (l10n) ("female")

            return `${space_before}${sex_tag}: ${sex_value}`
          })

  const single_sas_strs =
    pipe_ (
      x,
      PCA.mappedSpecialAbilities,
      map (ANCIAA_.name),
      sortStrings (l10n)
    )

  const sas_str =
    pipe_ (
      List<string> (),
      maybe<ident<List<string>>> (ident)
                                 ((curss: Record<CursesSelection>) =>
                                   consF (translateP (l10n)
                                                     ("cursestotalingap")
                                                     (List (CursesSelection.A.value (curss)))))
                                 (cursesSelection),
      maybe<ident<List<string>>> (ident) <string> (consF) (terrainKnowledgeSelectionString),
      maybe<ident<List<string>>> (ident) <string> (consF) (specializationSelectionString),
      maybe<ident<List<string>>> (ident)
                                 ((curss: Record<LanguagesScriptsSelection>) =>
                                   consF (translateP (l10n)
                                                     ("languagesandliteracytotalingap")
                                                     (List (
                                                       LanguagesScriptsSelection.A.value (curss)
                                                     ))))
                                 (languagesLiteracySelection),
      sortStrings (l10n),
      flip (append) (single_sas_strs),
      ensure (notNull),
      maybe (translate (l10n) ("none")) (intercalate (", "))
    )

  const final_ap =
    fromMaybe_ (() => pipe_ (
                        x,
                        PCA.mappedVariants,
                        foldr (pipe (PVCA_.ap, insert))
                              (OrderedSet.empty),
                        toList,
                        sortBy (compare),
                        localizeOrList (l10n)
                      ))
               (fmapF (PCA_.ap (x)) (show))

  return (
    <WikiBoxTemplate
      className="profession"
      title={maybe (name) ((subname: string) => `${name} (${subname})`) (msubname)}
      >
      <WikiProperty l10n={l10n} title="apvalue">
        {final_ap}
        {" "}
        {translate (l10n) ("adventurepoints")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="prerequisites">
        {maybe (translate (l10n) ("none")) (intercalate (", ")) (ensure (notNull) (prerequisites))}
        {renderMaybe (sex_dep_str)}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="specialabilities">
        {sas_str}
      </WikiProperty>
      <CombatTechniques
        combatTechniquesSelectionString={combatTechniquesSelectionString}
        x={x}
        l10n={l10n}
        />
      <WikiProperty l10n={l10n} title="skills" />
      <SkillsList
        profession={x}
        l10n={l10n}
        skillsSelection={skillsSelectionJoinedObject}
        />
      {maybeRNullF (spellsString)
                   (str => (
                     <WikiProperty l10n={l10n} title="spells">
                       {str}
                     </WikiProperty>
                   ))}
      {maybeRNullF (liturgicalChantsString)
                   (str => (
                     <WikiProperty l10n={l10n} title="liturgicalchants">
                       {str}
                     </WikiProperty>
                   ))}
      <WikiProperty l10n={l10n} title="suggestedadvantages">
        {fromMaybe (translate (l10n) ("none")) (PCA_.suggestedAdvantagesText (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="suggesteddisadvantages">
        {fromMaybe (translate (l10n) ("none")) (PCA_.suggestedDisadvantagesText (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="unsuitableadvantages">
        {fromMaybe (translate (l10n) ("none")) (PCA_.unsuitableAdvantagesText (x))}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="unsuitabledisadvantages">
        {fromMaybe (translate (l10n) ("none")) (PCA_.unsuitableDisadvantagesText (x))}
      </WikiProperty>
      <VariantList
        attributes={attributes}
        combatTechniquesSelectionString={combatTechniquesSelectionString}
        liturgicalChants={liturgicalChants}
        l10n={l10n}
        profession={x}
        sex={sex}
        skills={skills}
        specializationSelectionString={specializationSelectionString}
        spells={spells}
        />
      <WikiSource
        books={books}
        x={x}
        l10n={l10n}
        acc={PCA_}
        />
    </WikiBoxTemplate>
  )
}

const getSpecializationSelection =
  (l10n: L10nRecord) =>
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
                    sortStrings (l10n),
                    localizeOrList (l10n)
                  ))
                )
              }
              else {
                return pipe_ (sid, lookupF (skills), fmap (Skill.A.name))
              }
            }),
      fmap (pipe (List.pure, translateP (l10n) ("skillspecialization")))
    )

interface CombatTechniquesProps {
  combatTechniquesSelectionString: Maybe<string>
  x: Record<ProfessionCombined>
  l10n: L10nRecord
}

function CombatTechniques (props: CombatTechniquesProps): JSX.Element {
  const {
    combatTechniquesSelectionString: selectionString,
    x,
    l10n,
  } = props

  const cts =
    pipe_ (
      x,
      PCA.mappedCombatTechniques,
      map (e => `${IFVA.name (e)} ${IFVA.value (e) + 6}`),
      sortStrings (l10n),
      maybe<ident<List<string>>> (ident) <string> (consF) (selectionString),
      ensure (notNull),
      maybe (ndash) (intercalate (", "))
    )

  return (
    <WikiProperty l10n={l10n} title="combattechniques">
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
  (l10n: L10nRecord) =>
  (profession: Record<ProfessionCombined>): Maybe<Record<SkillsSelectionJoined>> =>
    pipe_ (
      profession,
      PCA.mappedSelections,
      PSA[ProfessionSelectionIds.SKILLS],
      fmap (sel => {
        const skill_gr = subscript (translate (l10n) ("skillgroups"))
                                   (fromMaybe (0) (SkillsSelection.A.gr (sel)))

        return SkillsSelectionJoined ({
          properties: sel,
          text: translateP (l10n)
                           ("skillsselection")
                           (List<string | number> (
                             SkillsSelection.A.value (sel),
                             fromMaybe ("...") (skill_gr)
                           )),
        })
      })
    )

const getCombatTechniquesSelection =
  (l10n: L10nRecord) =>
  (profession: Record<ProfessionCombined>): Maybe<string> => {
    const selections = PCA.mappedSelections (profession)

    const msel = PSA[ProfessionSelectionIds.COMBAT_TECHNIQUES] (selections)
    const msecond_sel = PSA[ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND] (selections)

    return fmapF (msel)
                 (sel => {
                   const fst_counter = subscript (translate (l10n) ("combattechniquecounter"))
                                                 (CTSA.amount (sel) - 1)

                   const firstValue = CTSA.value (sel) + 6

                   const entryList =
                     pipe_ (
                       sel,
                       CTSA.sid,
                       sortStrings (l10n),
                       intercalate (", ")
                     )

                   return maybe_ (() => {
                                   const precedingText =
                                     translateP (l10n)
                                                ("combattechniquesselection")
                                                (List<string | number> (
                                                  renderMaybe (fst_counter),
                                                  firstValue
                                                ))

                                   return `${precedingText}${entryList}`
                                 })
                                 ((second_sel: Record<CombatTechniquesSecondSelection>) => {
                                   const snd_counter =
                                     subscript (translate (l10n) ("combattechniquecounter"))
                                               (CTSSA.amount (second_sel) - 1)

                                   const secondValue = CTSSA.value (second_sel) + 6

                                   const precedingText =
                                     translateP (l10n)
                                                ("combattechniquessecondselection")
                                                (List<string | number> (
                                                  renderMaybe (fst_counter),
                                                  firstValue,
                                                  renderMaybe (snd_counter),
                                                  secondValue
                                                ))

                                   return `${precedingText}${entryList}`
                                 })
                                 (msecond_sel)
                 })
  }

const getTerrainKnowledgeSelection =
  (l10n: L10nRecord) =>
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
                 localizeOrList (l10n),
                 xs => `${SpecialAbility.A.name (terrain_knowledge)} (${xs})`
               ))
             (lookup<string> (SpecialAbilityId.TerrainKnowledge) (specialAbilities))
    )

const getSpells =
  (l10n: L10nRecord) =>
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
                const mcounter = subscript (translate (l10n) ("cantripcounter"))
                                           (CantripsSelection.A.amount (cantrips_sel) - 1)

                const precedingText =
                  fmapF (mcounter) (pipe (List.pure, translateP (l10n) ("cantripsfromlist")))

                const options =
                  pipe_ (
                    cantrips_sel,
                    CantripsSelection.A.sid,
                    mapMaybe (pipe (lookupF (cantrips), fmap (Cantrip.A.name))),
                    sortStrings (l10n),
                    intercalate (", ")
                  )

                return `${renderMaybe (precedingText)}${options}, `
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
              fmap (pipe (localizeOrList (l10n), names => `${names} ${value}`))
            )
          }
          else {
            const id = ISA.id (x)
            const value = ISA.value (x)

            return fmapF (lookup (id) (spells)) (spell => `${Spell.A.name (spell)} ${value}`)
          }
        }),
        sortStrings (l10n),
        intercalate (", ")
      )


    return cantrips_str.length === 0 || spells_str.length === 0
      ? Nothing
      : Just (`${cantrips_str}${spells_str}`)
  }

const getLiturgicalChants =
  (l10n: L10nRecord) =>
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
            fmap (pipe (localizeOrList (l10n), names => `${names} ${value}`))
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
          return cons (xs) (translate (l10n) ("thetwelveblessings"))
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
            sortStrings (l10n),
            translateP (l10n) ("thetwelveblessingsexceptions"),
            str => cons (xs) (str)
          )
        }

        return xs
      },
      sortStrings (l10n),
      ensure (notNull),
      fmap (intercalate (", "))
    )

interface SkillsListProps {
  profession: Record<ProfessionCombined>
  l10n: L10nRecord
  skillsSelection: Maybe<Record<SkillsSelectionJoined>>
}

function SkillsList (props: SkillsListProps): JSX.Element {
  const {
    profession,
    l10n,
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
                 l10n={l10n}
                 skillsSelection={skillsSelection}
                 />
             )),
        toArray
      )}
    </>
  )
}

interface SkillProps {
  l10n: L10nRecord
  groupIndex: number
  list: List<Record<IncreasableForView>>
  skillsSelection: Maybe<Record<SkillsSelectionJoined>>
}

function Skills (props: SkillProps) {
  const {
    groupIndex,
    list,
    l10n,
    skillsSelection: mskills_selection,
  } = props

  return pipe_ (
      list,
      map (e => `${IFVA.name (e)} ${IFVA.value (e)}`),
      sortStrings (l10n),
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
            {renderMaybe (subscript (translate (l10n) ("skillgroups")) (groupIndex))}
            {": "}
          </span>
          <span>{notNull (list) ? joined_text : ndash}</span>
        </p>
      )
    )
}

interface VariantListHeaderProps {
  l10n: L10nRecord
}

function VariantListHeader (props: VariantListHeaderProps): JSX.Element {
  const { l10n } = props

  return (
    <p className="profession-variants">
      <span>{translate (l10n) ("variants")}</span>
    </p>
  )
}

interface VariantListProps {
  attributes: OrderedMap<string, Record<Attribute>>
  combatTechniquesSelectionString: Maybe<string>
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>
  l10n: L10nRecord
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
    l10n,
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
        <VariantListHeader l10n={l10n} />
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
                      l10n={l10n}
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
  l10n: L10nRecord
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
    l10n,
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
        <span>{name}</span>
        {" "}
        <span>
          {"("}
          {ap_sum}
          {" "}
          {translate (l10n) ("adventurepoints.short")}
          {"): "}
        </span>
        {fromJust (fullText)}
      </li>
    )
  }

  return (
    <li>
      <span>{name}</span>
      {" "}
      <span>
        {"("}
        {ap_sum}
        {" "}
        {translate (l10n) ("adventurepoints.short")}
        {"): "}
      </span>
      <span>
        {maybeRNullF (PVCA_.precedingText (variant))
                     (str => <span>{str}</span>)}
        {maybe (<></>)
               ((str: string) => (<>{str}</>))
               (getVariantPrerequisites (l10n)
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
  (l10n: L10nRecord) =>
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
                name: `${name} (${finalCost} ${translate (l10n) ("adventurepoints.short")})`,
                active: Just (active),
              })
            }
          }),
      sortRecordsByName (l10n),
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
      fmap (xs => `${translate (l10n) ("prerequisites")}: ${xs}; `)
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
  l10n: L10nRecord
  variant: Record<ProfessionVariantCombined>
}

const getVariantLanguagesLiteracySelection =
  (mappedProfSelections: Record<ProfessionSelections>) =>
  (props: VariantLanguagesLiteracySelectionProps): Maybe<string> => {
    const {
      l10n,
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

      const main_str = translateP (l10n) ("languagesandliteracytotalingap") (List (vvalue))

      if (isJust (msel)) {
        const value = LanguagesScriptsSelection.A.value (fromJust (msel))
        const instead = translate (l10n) ("insteadof")

        return Just (`${main_str} ${instead} ${value}`)
      }
      else {
        return Just (main_str)
      }
    }

    return Nothing
  }

interface VariantSpecializationSelectionProps {
  l10n: L10nRecord
  skills: OrderedMap<string, Record<Skill>>
  specializationSelectionString: Maybe<string>
  variant: Record<ProfessionVariantCombined>
}

const getVariantSpecializationSelection =
  (mappedProfSelections: Record<ProfessionSelections>) =>
  (props: VariantSpecializationSelectionProps): Maybe<NonNullable<React.ReactNode>> => {
    const {
      l10n,
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
                sortStrings (l10n),
                ensure (pipe (flength, gt (1))),
                fmap (localizeOrList (l10n))
              )
            : pipe_ (vsid, lookupF (skills), fmap (Skill.A.name))

        const mmain_text = fmapF (mskill_text)
                                 (skill_text => translateP (l10n)
                                                           ("skillspecialization")
                                                           (List (skill_text)))

        if (isJust (msel)) {
          const instead = translate (l10n) ("insteadof")
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
  l10n: L10nRecord
  variant: Record<ProfessionVariantCombined>
}

const getVariantCombatTechniquesSelection =
  (mappedProfSelections: Record<ProfessionSelections>) =>
  (props: VariantCombatTechniquesSelectionProps): Maybe<NonNullable<React.ReactNode>> => {
    const {
      combatTechniquesSelectionString,
      l10n,
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
          const instead = translate (l10n) ("insteadof")

          const joinedList = pipe_ (sid, sortStrings (l10n), localizeOrList (l10n))

          return Just (`${joinedList} ${vvalue} ${instead} ${value}`)
        }
      }
      else {
        const vsid = CombatTechniquesSelection.A.sid (variant_sel)
        const vamount = CombatTechniquesSelection.A.amount (variant_sel)
        const vvalue = CombatTechniquesSelection.A.value (variant_sel)

        const tag = translateP (l10n)
                               ("combattechniquesselection")
                               (List<string | number> (
                                 unsafeIndex (translate (l10n) ("combattechniquecounter"))
                                             (vamount - 1),
                                 vvalue + 6
                               ))

        const joinedList = pipe_ (vsid, sortStrings (l10n), intercalate (", "))

        return Just (`${tag}${joinedList}`)
      }
    }

    return Nothing
  }

interface VariantSkillsSelectionProps {
  l10n: L10nRecord
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>
  variant: Record<ProfessionVariantCombined>
}

const getVariantSkillsSelection =
  (props: VariantSkillsSelectionProps): string => {
    const {
      l10n,
      liturgicalChants,
      variant,
    } = props

    const instead = translate (l10n) ("insteadof")

    const combatTechniquesList =
      pipe_ (variant, PVCA.mappedCombatTechniques, mapVariantSkills (l10n) (6))

    const skillsList =
      pipe_ (variant, PVCA.mappedSkills, mapVariantSkills (l10n) (0))

    const combinedSpellsList = combineSpells (PVCA.mappedSpells (variant))

    const spellsList =
      map ((e: ListI<CombinedSpells>) => {
            if (isTuple (e)) {
              const old_entry = fst (e)
              const new_entry = snd (e)
              const value = IFVAL.value (new_entry)

              const old_name = getCombinedSpellName (l10n) (old_entry)
              const new_name = getCombinedSpellName (l10n) (new_entry)

              return `${new_name} ${value} ${instead} ${old_name} ${value}`
            }
            else {
              const value = IFVAL.value (e)
              const previous = Maybe.sum (IFVAL.previous (e))
              const name = getCombinedSpellName (l10n) (e)

              return `${name} ${value} ${instead} ${previous}`
            }
          })
          (combinedSpellsList)

    const combinedList =
      intercalate (", ")
                  (List (
                    ...sortStrings (l10n) (combatTechniquesList),
                    ...sortStrings (l10n) (skillsList),
                    ...sortStrings (l10n) (spellsList)
                  ))

    return maybe (combinedList)
                 ((chants: NonEmptyList<CombinedMappedSpell>) => {
                   const blessings = translate (l10n) ("thetwelveblessings")

                   return pipe_ (
                     chants,
                     mapMaybe (e => {
                       if (IncreasableListForView.is (e)) {
                         const names = mapMaybe (pipe (lookupF (liturgicalChants), fmap (LCA.name)))
                                                (ILFVA.id (e))

                         return fmapF (ensure (pipe (flength, gt (1))) (names))
                                      (pipe (
                                        localizeOrList (l10n),
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
                     sortStrings (l10n),
                     intercalate (", "),
                     xs => `${combinedList}, ${translate (l10n) ("liturgicalchants")}: ${xs}`
                   )
                 })
                 (ensure (notNull) (PVCA.mappedLiturgicalChants (variant)))
  }

const mapVariantSkills =
  (l10n: L10nRecord) =>
  (base: number) =>
    map ((e: Record<IncreasableForView>) => {
      const prev = fromMaybe (base) (IFVA.previous (e))

      return `${IFVA.name (e)} ${IFVA.value (e)} ${translate (l10n) ("insteadof")} ${prev}`
    })

const getCombinedSpellName =
  (l10n: L10nRecord) =>
  (x: CombinedMappedSpell): string =>
    IncreasableListForView.is (x) ? localizeOrList (l10n) (ILFVA.name (x)) : IFVA.name (x)

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
