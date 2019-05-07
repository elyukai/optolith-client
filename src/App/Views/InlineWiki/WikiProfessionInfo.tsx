import * as React from "react";
import { ident } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { all, append, cons, consF, deleteAt, findIndex, flength, intercalate, isList, List, ListI, map, NonEmptyList, notNull, toArray, uncons, unsafeIndex } from "../../../Data/List";
import { ensure, fromJust, isJust, liftM2, mapMaybe, Maybe, maybe, maybeR, maybe_ } from "../../../Data/Maybe";
import { lookup, lookupF, member, memberF, OrderedMap } from "../../../Data/OrderedMap";
import { difference, fromList, OrderedSet } from "../../../Data/OrderedSet";
import { fst, snd } from "../../../Data/Pair";
import { fromDefault, Record } from "../../../Data/Record";
import { Tuple } from "../../../Data/Tuple";
import { sel1, sel2, sel3 } from "../../../Data/Tuple/Select";
import { upd1, upd2, upd3 } from "../../../Data/Tuple/Update";
import { Categories } from "../../Constants/Categories";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { ActivatableNameCostIsActive, ActivatableNameCostIsActiveA_ } from "../../Models/View/ActivatableNameCostIsActive";
import { IncreasableForView } from "../../Models/View/IncreasableForView";
import { IncreasableListForView } from "../../Models/View/IncreasableListForView";
import { ProfessionCombined } from "../../Models/View/ProfessionCombined";
import { ProfessionVariantCombined, ProfessionVariantCombinedA_ } from "../../Models/View/ProfessionVariantCombined";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Blessing } from "../../Models/Wiki/Blessing";
import { Book } from "../../Models/Wiki/Book";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { isRequiringIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { isRaceRequirement, RaceRequirement } from "../../Models/Wiki/prerequisites/RaceRequirement";
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
import { NameBySex } from "../../Models/Wiki/sub/NameBySex";
import { ProfessionSelectionIds } from "../../Models/Wiki/wikiTypeHelpers";
import { getSelectOptionName } from "../../Utilities/Activatable/selectionUtils";
import { localizeOrList, translate, translateP } from "../../Utilities/I18n";
import { getNumericId } from "../../Utilities/IDUtils";
import { add, gt } from "../../Utilities/mathUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { sortStrings } from "../../Utilities/sortBy";
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
const PSA = ProfessionSelections.A
const PVCA = ProfessionVariantCombined.A
const PVCA_ = ProfessionVariantCombinedA_
const PVSA = ProfessionVariantSelections.A
const ISA = IncreaseSkill.A
const IFVA = IncreasableForView.A
const IFVAL = IncreasableForView.AL
const ILFVA = IncreasableListForView.A
const ANCIAA = ActivatableNameCostIsActive.A
const ANCIAA_ = ActivatableNameCostIsActiveA_

// tslint:disable-next-line: cyclomatic-complexity
export function WikiProfessionInfo(props: WikiProfessionInfoProps) {
  const {
    attributes,
    blessings,
    cantrips,
    x,
    liturgicalChants,
    l10n,
    races,
    sex = "m",
    skills,
    spells,
    specialAbilities,
  } = props

  const {
    selections
  } = x

  let { name, subname } = x

  name = getName(name, sex)
  subname = getName(subname, sex)

  const specializationSelectionString = getSpecializationSelection(selections, skills, l10n)
  const skillsSelectionJoinedObject = getSkillSelection(selections, l10n)
  const cursesSelection = selections.find(e => e.id === "CURSES") as CursesSelection | undefined
  const languagesLiteracySelection = selections.find(e => e.id === "LANGUAGES_SCRIPTS") as LanguagesScriptsSelection | undefined
  const combatTechniquesSelectionString = getCombatTechniquesSelection(selections, l10n)
  const terrainKnowledgeSelectionString = getTerrainKnowledgeSelection(selections, specialAbilities, l10n)

  const spellsString = getSpells(x, selections, spells, cantrips, l10n)
  const liturgicalChantsString = getLiturgicalChants(x, liturgicalChants, blessings, l10n)

  const raceRequirement = x.dependencies.find(e => isRaceRequirement(e)) as RaceRequirement | undefined
  const sexRequirement = x.dependencies.find(e => isSexRequirement(e)) as SexRequirement | undefined

  if (["nl-BE"].includes(l10n.id)) {
    return (
      <WikiBoxTemplate className="profession" title={subname ? `${name} (${subname})` : name}>
        <WikiProperty l10n={l10n} title="info.apvalue">
          {x.ap} {translate(l10n, "aptext")}
        </WikiProperty>
        <CombatTechniques
          combatTechniquesSelectionString={combatTechniquesSelectionString}
          x={x}
          l10n={l10n}
          />
        <WikiProperty l10n={l10n} title="info.skills" />
        <SkillsList
          profession={x}
          l10n={l10n}
          skillsSelection={skillsSelectionJoinedObject}
          />
        {typeof spellsString === "string" ? (
          <WikiProperty l10n={l10n} title="info.spells">
            {spellsString}
          </WikiProperty>
        ) : null}
        {typeof liturgicalChantsString === "string" ? (
          <WikiProperty l10n={l10n} title="info.liturgicalchants">
            {liturgicalChantsString}
          </WikiProperty>
        ) : null}
        <VariantList
          {...props}
          combatTechniquesSelectionString={combatTechniquesSelectionString}
          profession={x}
          specializationSelectionString={specializationSelectionString}
          />
      </WikiBoxTemplate>
    )
  }

  const getRaceNameAP = (race: Race) => `${race.name} (${race.ap} ${translate(l10n, "apshort")})`

  const prerequisites = [
    ...(raceRequirement ? [`${translate(l10n, "race")}: ${Array.isArray(raceRequirement.value) ? raceRequirement.value.map(e => getRaceNameAP(races.get(`R_${e}`)!)).join(translate(l10n, "info.or")) : getRaceNameAP(races.get(`R_${raceRequirement.value}`)!)}`] : []),
    ...(x.prerequisitesStart ? [x.prerequisitesStart] : []),
    ...sortStrings(x.prerequisites.map(e => {
      if (isRequiringIncreasable(e)) {
        const instance = attributes.get(e.id) || skills.get(e.id)
        let name
        if (instance && instance.category === Categories.ATTRIBUTES) {
          name = instance.short
        }
        else if (instance) {
          name = instance.name
        }
        return `${name} ${e.value}`
      }
      return `${e.combinedName} (${e.currentCost} ${translate(l10n, "apshort")})`
    }), l10n.id),
    ...(x.prerequisitesEnd ? [x.prerequisitesEnd] : []),
  ]

  return (
    <WikiBoxTemplate className="profession" title={subname ? `${name} (${subname})` : name}>
      <WikiProperty l10n={l10n} title="info.apvalue">
        {x.ap} {translate(l10n, "aptext")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="info.prerequisites">
        {prerequisites.length > 0 ? prerequisites.join(", ") : translate(l10n, "info.none")}
        {sexRequirement && `${prerequisites.length > 0 ? " " : ""}${translate(l10n, "charactersheet.main.sex")}: ${sexRequirement.value === "m" ? translate(l10n, "herocreation.options.selectsex.male") : translate(l10n, "herocreation.options.selectsex.female")}`}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="info.specialabilities">
        {[
          ...(languagesLiteracySelection ? [translate(l10n, "info.specialabilitieslanguagesandliteracy", languagesLiteracySelection.value)] : []),
          ...(typeof specializationSelectionString === "string" ? [specializationSelectionString] : []),
          ...(typeof terrainKnowledgeSelectionString === "string" ? [terrainKnowledgeSelectionString] : []),
          ...(cursesSelection ? [translate(l10n, "info.specialabilitiescurses", cursesSelection.value)] : []),
          ...sortStrings(x.specialAbilities.map(e => e.combinedName), l10n.id)
        ].join(", ") || translate(l10n, "info.none")}
      </WikiProperty>
      <CombatTechniques
        combatTechniquesSelectionString={combatTechniquesSelectionString}
        x={x}
        l10n={l10n}
        />
      <WikiProperty l10n={l10n} title="info.skills" />
      <SkillsList
        profession={x}
        l10n={l10n}
        skillsSelection={skillsSelectionJoinedObject}
        />
      {typeof spellsString === "string" ? (
        <WikiProperty l10n={l10n} title="info.spells">
          {spellsString}
        </WikiProperty>
      ) : null}
      {typeof liturgicalChantsString === "string" ? (
        <WikiProperty l10n={l10n} title="info.liturgicalchants">
          {liturgicalChantsString}
        </WikiProperty>
      ) : null}
      <WikiProperty l10n={l10n} title="info.suggestedadvantages">
        {x.suggestedAdvantagesText || translate(l10n, "info.none")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="info.suggesteddisadvantages">
        {x.suggestedDisadvantagesText || translate(l10n, "info.none")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="info.unsuitableadvantages">
        {x.unsuitableAdvantagesText || translate(l10n, "info.none")}
      </WikiProperty>
      <WikiProperty l10n={l10n} title="info.unsuitabledisadvantages">
        {x.unsuitableDisadvantagesText || translate(l10n, "info.none")}
      </WikiProperty>
      <VariantList
        {...props}
        combatTechniquesSelectionString={combatTechniquesSelectionString}
        profession={x}
        specializationSelectionString={specializationSelectionString}
        />
      <WikiSource {...props} />
    </WikiBoxTemplate>
  )
}

function getName(nameProp: string | NameBySex, sex: "m" | "f"): string
function getName(nameProp: string | NameBySex | undefined, sex: "m" | "f"): string | undefined
function getName(nameProp: string | NameBySex | undefined, sex: "m" | "f"): string | undefined {
  if (typeof nameProp === "object") {
    return nameProp[sex]
  }

  return nameProp
}

function getSpecializationSelection(
  selections: ProfessionSelectionList,
  skills: Map<string, Skill>,
  l10n: UIMessages,
): string | undefined {
  const selection = selections.find(e => {
    return e.id === "SPECIALISATION"
  }) as SpecialisationSelection | undefined

  if (selection === undefined) {
    return
  }

  let value: string

  if (Array.isArray(selection.sid)) {
    const selectionArr = selection.sid.map(e => skills.get(e)!.name)
    const sortedArr = sortStrings(selectionArr, l10n.id)
    const separator = translate(l10n, "info.specialabilitiesspecializationseparator")
    value = sortedArr.intercalate(separator)
  }
  else {
    value = skills.get(selection.sid)!.name
  }

  return translate(l10n, "info.specialabilitiesspecialization", value)
}

interface CombatTechniquesProps {
  combatTechniquesSelectionString: string | undefined
  x: ProfessionCombined
  l10n: UIMessages
}

function CombatTechniques(props: CombatTechniquesProps): JSX.Element {
  const {
    combatTechniquesSelectionString: selectionString,
    x,
    l10n,
  } = props

  const combatTechniquesList = x.combatTechniques.map(e => {
    return `${e.name} ${e.value + 6}`
  })

  return (
    <WikiProperty l10n={l10n} title="info.combattechniques">
      {[
        ...sortStrings(combatTechniquesList, l10n.id),
        ...(selectionString ? [selectionString] : [])
      ].join(", ") || "-"}
    </WikiProperty>
  )
}

interface SkillsSelectionJoined {
  properties: SkillsSelection
  text: string
}

function getSkillSelection(
  selections: ProfessionSelectionList,
  l10n: UIMessages,
): SkillsSelectionJoined | undefined {
  const selection = selections.find(e => {
    return e.id === "SKILLS"
  }) as SkillsSelection | undefined

  if (selection === undefined) {
    return
  }

  const skillGroup = translate(l10n, "rcpselections.labels.skillgroups")[selection.gr || 0]

  return {
    properties: selection,
    text: translate(l10n, "info.skillsselection", selection.value, skillGroup)
  }
}

function getCombatTechniquesSelection(
  selections: ProfessionSelectionList,
  l10n: UIMessages,
): string | undefined {
  const selection = selections.find(e => {
    return e.id === "COMBAT_TECHNIQUES"
  }) as CombatTechniquesSelection | undefined

  const secondSelection = selections.find(e => {
    return e.id === "COMBAT_TECHNIQUES_SECOND"
  }) as CombatTechniquesSecondSelection | undefined

  if (selection === undefined) {
    return
  }

  const counter: keyof UIMessages = "info.combattechniquesselectioncounter"
  const firstCounter = translate(l10n, counter)[selection.amount - 1]
  const firstValue = selection.value + 6
  const entryList = sortStrings(selection.sid, l10n.id).intercalate(", ")

  let value: string

  if (typeof secondSelection === "object") {
    const mainString: keyof UIMessages = "info.combattechniquessecondselection"
    const secondCounter = translate(l10n, counter)[secondSelection.amount - 1]
    const secondValue = secondSelection.value + 6

    const precedingText = translate(
      l10n,
      mainString,
      firstCounter,
      firstValue,
      secondCounter,
      secondValue
    )

    value = `${precedingText}${entryList}`
  }
  else {
    const mainString: keyof UIMessages = "info.combattechniquesselection"
    const precedingText = translate(l10n, mainString, firstCounter, firstValue)

    value = `${precedingText}${entryList}`
  }

  return value
}

function getTerrainKnowledgeSelection(
  selections: ProfessionSelectionList,
  specialAbilities: Map<string, SpecialAbility>,
  l10n: UIMessages,
): string | undefined {
  const selection = selections.find(e => {
    return e.id === "TERRAIN_KNOWLEDGE"
  }) as TerrainKnowledgeSelection | undefined

  if (selection === undefined) {
    return
  }

  const terrainKnowledge = specialAbilities.get("SA_12")!

  const optionsString = selection.sid.map(sid => {
    return getSelectOptionName(terrainKnowledge, sid)!
  })

  const last = optionsString.pop()

  const joinedFirst = optionsString.intercalate(", ")
  const joined = `${joinedFirst} ${translate(l10n, "info.or")} ${last}`

  return `${terrainKnowledge.name} (${joined})`
}

function getSpells(
  profession: ProfessionCombined,
  selections: ProfessionSelectionList,
  spells: Map<string, Spell>,
  cantrips: Map<string, Cantrip>,
  l10n: UIMessages,
): string | undefined {
  const cantripsSelection = selections.find(e => {
    return e.id === "CANTRIPS"
  }) as CantripsSelection | undefined

  let cantripsString = ""

  if (typeof cantripsSelection === "object") {
    const mainMessage: keyof UIMessages = "info.spellscantrips"

    const counterMessage: keyof UIMessages = "info.spellscantripscounter"
    const counter = translate(l10n, counterMessage)[cantripsSelection.amount - 1]

    const precedingText = translate(l10n, mainMessage, counter)

    const options = cantripsSelection.sid.map(e => cantrips.get(e)!.name)
    const sortedOptions = sortStrings(options, l10n.id)

    cantripsString = `${precedingText}${sortedOptions.intercalate(", ")}, `
  }

  const spellsArr = profession.spells.map(e => `${spells.get(e.id)!.name} ${e.value}`)
  const sortedSpells = sortStrings(spellsArr, l10n.id)

  if (cantripsString.length === 0 || sortedSpells.length === 0) {
    return
  }

  return `${cantripsString}${sortedSpells.intercalate(", ")}`
}

function getLiturgicalChants(
  profession: ProfessionCombined,
  liturgicalChants: Map<string, LiturgicalChant>,
  blessings: Map<string, Blessing>,
  l10n: UIMessages,
): string | undefined {
  let blessingsArr = []

  const blessingsKey: keyof UIMessages = "info.thetwelveblessings"
  const blessingsMessage = translate(l10n, blessingsKey)
  const exceptionsKey: keyof UIMessages = "info.thetwelveblessingsexceptions"

  if (profession.blessings.length === 12) {
    blessingsArr.push(blessingsMessage)
  }
  else if (profession.blessings.length === 9) {
    const allBlessings = [...blessings.values()]
    const notIncluded = allBlessings.filter(e => {
      const numericId = getNumericId(e.id)
      return !profession.blessings.includes(e.id) && numericId <= 12
    })

    const blessingNameArr = notIncluded.map(e => e.name)
    const sortedBlessings = sortStrings(blessingNameArr, l10n.id)
    const exceptionsMessage = translate(l10n, exceptionsKey, ...sortedBlessings)

    blessingsArr.push(`${blessingsMessage}${exceptionsMessage}`)
  }

  const liturgicalChantsArr = profession.liturgicalChants.map(e => {
    return `${liturgicalChants.get(e.id)!.name} ${e.value}`
  })

  const sortedList = sortStrings([
    ...blessingsArr,
    ...liturgicalChantsArr
  ], l10n.id)

  return sortedList.length > 0 ? sortedList.intercalate(", ") : undefined
}

interface SkillsListProps {
  profession: ProfessionCombined
  l10n: UIMessages
  skillsSelection: SkillsSelectionJoined | undefined
}

function SkillsList(props: SkillsListProps): JSX.Element {
  const {
    profession,
    l10n,
    skillsSelection,
  } = props

  const list = [
    profession.physicalSkills,
    profession.socialSkills,
    profession.natureSkills,
    profession.knowledgeSkills,
    profession.craftSkills,
  ]

  return (
    <>
      {
        list.map((list, index) => (
          <Skills
            key={index}
            groupIndex={index}
            list={list}
            l10n={l10n}
            skillsSelection={skillsSelection}
            />
        ))
      }
    </>
  )
}

interface SkillProps {
  l10n: UIMessages
  groupIndex: number
  list: Increasable[]
  skillsSelection: SkillsSelectionJoined | undefined
}

function Skills(props: SkillProps) {
  const {
    groupIndex,
    list,
    l10n,
    skillsSelection,
  } = props

  const skillsArr = list.map(e => `${e.name} ${e.value}`)
  const sortedSkills = sortStrings(skillsArr, l10n.id)

  // Needs array to be able to add no element to the list
  const specialTextArr = []

  if (skillsSelection) {
    const hasGroup = typeof skillsSelection.properties.gr === "number"
    const isGroupValid = hasGroup && skillsSelection.properties.gr! - 1 === groupIndex

    if (isGroupValid) {
      specialTextArr.push(skillsSelection.text)
    }
  }

  const joinedText = [...sortedSkills, ...specialTextArr].join(", ")

  return (
    <p className="skill-group">
      <span>{translate(l10n, "skills.view.groups")[groupIndex]}</span>
      <span>{list.length > 0 ? joinedText : "-"}</span>
    </p>
  )
}

interface VariantListHeaderProps {
  l10n: UIMessages
}

function VariantListHeader(props: VariantListHeaderProps): JSX.Element {
  const {
    l10n,
  } = props

  return (
    <p className="profession-variants">
      <span>{translate(l10n, "info.variants")}</span>
    </p>
  )
}

interface VariantListProps {
  attributes: Map<string, Attribute>
  combatTechniquesSelectionString: string | undefined
  liturgicalChants: Map<string, LiturgicalChant>
  l10n: UIMessages
  profession: ProfessionCombined
  sex: "m" | "f" | undefined
  skills: Map<string, Skill>
  specializationSelectionString: string | undefined
  spells: Map<string, Spell>
}

function VariantList(props: VariantListProps): JSX.Element | null {
  const {
    l10n,
    profession
  } = props

  if (profession.variants.length > 0) {
    return (
      <>
        <VariantListHeader l10n={l10n} />
        <ul className="profession-variants">
          {
            profession.variants.map(variant => (
              <Variant
                {...props}
                key={variant.id}
                variant={variant}
                />
            ))
          }
        </ul>
      </>
    )
  }

  return null
}

interface VariantProps {
  attributes: Map<string, Attribute>
  combatTechniquesSelectionString: string | undefined
  liturgicalChants: Map<string, LiturgicalChant>
  l10n: UIMessages
  profession: ProfessionCombined
  sex: "m" | "f" | undefined
  skills: Map<string, Skill>
  specializationSelectionString: string | undefined
  spells: Map<string, Spell>
  variant: ProfessionVariantCombined
}

function Variant(props: VariantProps) {
  const {
    l10n,
    profession,
    sex = "m",
    variant
  } = props

  const { fullText } = variant
  let { name } = variant

  name = getName(name, sex)

  if (fullText) {
    return (
      <li>
        <span>{name}</span>
        <span>({profession.ap + variant.ap} {translate(l10n, "apshort")})</span>
        <span>{fullText}</span>
      </li>
    )
  }

  return (
    <li>
      <span>{name}</span>
      <span>({profession.ap + variant.ap} {translate(l10n, "apshort")})</span>
      <span>
        {variant.precedingText && <span>{variant.precedingText}</span>}
        <VariantPrerequisites {...props} />
        <VariantSpecialAbilities {...props} />
        <VariantLanguagesLiteracySelection {...props} mappedProfSelections={profession.selections} />
        <VariantSpecializationSelection {...props} selections={profession.selections} />
        <VariantCombatTechniquesSelection {...props} mappedProfSelections={profession.selections} />
        <VariantSkillsSelection {...props} />
        {variant.concludingText && ` ${variant.concludingText}`}
      </span>
    </li>
  )
}

interface VariantPrerequisitesProps {
  attributes: OrderedMap<string, Record<Attribute>>
  l10n: L10nRecord
  skills: OrderedMap<string, Record<Skill>>
  variant: Record<ProfessionVariantCombined>
}

interface VariantPrerequisiteIntermediate {
  id: string
  name: string
  active?: boolean
}

function VariantPrerequisites (props: VariantPrerequisitesProps): JSX.Element {
  const {
    attributes,
    l10n,
    skills,
    variant,
  } = props

  const reducedNameArr = variant.prerequisites.map<VariantPrerequisiteIntermediate>(e => {
    if (isRequiringIncreasable(e)) {
      const instance = attributes.get(e.id) || skills.get(e.id)
      let name
      if (instance && instance.category === Categories.ATTRIBUTES) {
        name = instance.short
      }
      else if (instance) {
        name = instance.name
      }
      return {
        id: e.id,
        name: `${name} ${e.value}`
      }
    }
    return {
      id: e.id,
      name: `${e.combinedName} (${e.currentCost} ${translate(l10n, "apshort")})`,
      active: e.active
    }
  })

  const sortedReducedNameArray = sortObjects(reducedNameArr, l10n.id)

  return (
    <span className="hard-break">
      {`${translate(l10n, "info.prerequisites")}: `}
      {
        sortedReducedNameArray.map(e => {
          if (e.active === false) {
            return <span key={e.id}>
              <span className="disabled">{e.name}</span>
            </span>
          }
          return <span key={e.id}>{e.name}</span>
        })
      }
    </span>
  )
}

interface VariantSpecialAbilitiesProps {
  variant: Record<ProfessionVariantCombined>
}

function VariantSpecialAbilities (props: VariantSpecialAbilitiesProps): JSX.Element {
  return (
    <>
      {pipe_ (
        props.variant,
        PVCA.mappedSpecialAbilities,
        map (e => (
          <span key={ANCIAA_.id (e)}>
            <span className={!ANCIAA.isActive (e) ? "disabled" : undefined}>
              {ANCIAA_.name (e)}
            </span>
          </span>
        )),
        toArray
      )}
    </>
  )
}

interface VariantLanguagesLiteracySelectionProps {
  l10n: L10nRecord
  mappedProfSelections: Record<ProfessionSelections>
  variant: Record<ProfessionVariantCombined>
}

function VariantLanguagesLiteracySelection (
  props: VariantLanguagesLiteracySelectionProps
): JSX.Element | null {
  const {
    l10n,
    mappedProfSelections,
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

      return (
        <span>
          <span>{main_str} {instead} {value}</span>
        </span>
      )
    }
    else {
      return (
        <span>
          <span>{main_str}</span>
        </span>
      )
    }
  }

  return null
}

interface VariantSpecializationSelectionProps {
  l10n: L10nRecord
  mappedProfSelections: Record<ProfessionSelections>
  skills: OrderedMap<string, Record<Skill>>
  specializationSelectionString: Maybe<string>
  variant: Record<ProfessionVariantCombined>
}

function VariantSpecializationSelection (
  props: VariantSpecializationSelectionProps
): JSX.Element | null {
  const {
    l10n,
    mappedProfSelections,
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
      return (
        <span>
          <span className="disabled">{renderMaybe (specializationSelectionString)}</span>
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
              sortStrings (L10n.A.id (l10n)),
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

        return (
          <span>
            <span>
              {renderMaybe (mmain_text)}
              {" "}
              {instead}
              {" "}
              {renderMaybe (specializationSelectionString)}
            </span>
          </span>
        )
      }
      else {
        return (
          <span>
            <span>{renderMaybe (mmain_text)}</span>
          </span>
        )
      }
    }
  }

  return null
}

interface VariantCombatTechniquesSelectionProps {
  combatTechniquesSelectionString: Maybe<string>
  l10n: L10nRecord
  mappedProfSelections: Record<ProfessionSelections>
  variant: Record<ProfessionVariantCombined>
}

function VariantCombatTechniquesSelection (
  props: VariantCombatTechniquesSelectionProps
): JSX.Element | null {
  const {
    combatTechniquesSelectionString,
    l10n,
    mappedProfSelections,
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
      return (
        <span>
          <span className="disabled">{renderMaybe (combatTechniquesSelectionString)}</span>
        </span>
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

        const joinedList = pipe_ (sid, sortStrings (L10n.A.id (l10n)), localizeOrList (l10n))

        return (
          <span>
            <span>{joinedList} {vvalue} {instead} {value}</span>
          </span>
        )
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

      const joinedList = pipe_ (vsid, sortStrings (L10n.A.id (l10n)), intercalate (", "))

      return (
        <span>
          <span>{tag}{joinedList}</span>
        </span>
      )
    }
  }

  return null
}

interface VariantSkillsSelectionProps {
  l10n: L10nRecord
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>
  spells: OrderedMap<string, Record<Spell>>
  variant: Record<ProfessionVariantCombined>
}

function VariantSkillsSelection (props: VariantSkillsSelectionProps): JSX.Element {
  const {
    l10n,
    liturgicalChants,
    spells,
    variant,
  } = props

  const instead = translate (l10n) ("insteadof")

  const combatTechniquesList =
    pipe_ (variant, PVCA.mappedCombatTechniques, mapVariantSkills (l10n) (6))

  const skillsList =
    pipe_ (variant, PVCA.mappedSkills, mapVariantSkills (l10n) (0))

  const combinedSpellsList = combineSpells (spells) (PVCA.mappedSpells (variant))

  const spellsList =
    mapMaybe ((e: ListI<CombinedSpells>) => {
               if (CombinedSpell.is (e)) {
                 const newId = CSA.newId (e)
                 const oldId = CSA.oldId (e)
                 const value = CSA.value (e)

                 const mnew_spell_name = mapSpellNames (l10n) (spells) (newId)
                 const mold_spell_name = mapSpellNames (l10n) (spells) (oldId)

                 return liftM2 ((new_spell_name: string) => (old_spell_name: string) =>
                                 `${new_spell_name} ${value} ${instead} ${old_spell_name} ${value}`)
                               (mnew_spell_name)
                               (mold_spell_name)
               }
               else if (IncreasableListForView.is (e)) {
                const ids = ILFVA.id (e)
                const value = ILFVA.value (e)
                const previous = Maybe.sum (ILFVA.previous (e))

                return fmapF (mapSpellNames (l10n) (spells) (ids))
                             (name => `${name} ${previous + value} ${instead} ${previous}`)
               }
               else {
                 const id = IFVA.id (e)
                 const value = IFVA.value (e)
                 const previous = Maybe.sum (IFVA.previous (e))

                 return fmapF (mapSpellNames (l10n) (spells) (id))
                              (name => `${name} ${previous + value} ${instead} ${previous}`)
               }
             })
             (combinedSpellsList)

  const combinedList =
    intercalate (", ")
                (List (
                  ...sortStrings (L10n.A.id (l10n)) (combatTechniquesList),
                  ...sortStrings (L10n.A.id (l10n)) (skillsList),
                  ...sortStrings (L10n.A.id (l10n)) (spellsList)
                ))

  return maybeR (<span>{combinedList}</span>)
                ((chants: NonEmptyList<CombinedMappedSpell>) => {
                  const blessings = translate (l10n) ("thetwelveblessings")

                  return pipe_ (
                    chants,
                    mapMaybe (e => {
                      if (IncreasableListForView.is (e)) {
                        const names = mapMaybe (lookupF (liturgicalChants)) (ILFVA.id (e))

                        return fmapF (ensure (pipe (flength, gt (1))) (names))
                                     (pipe (
                                       localizeOrList (l10n),
                                       name => `${name} ${ILFVA.value (e)}`
                                     ))
                      }
                      else {
                        const mname = lookup (IFVA.id (e)) (liturgicalChants)

                        return fmapF (mname)
                                     (name => `${name} ${IFVA.value (e)}`)
                      }
                    }),
                    flength (PVCA_.blessings (variant)) === 12 ? consF (blessings) : ident,
                    sortStrings (L10n.A.id (l10n)),
                    intercalate (", "),
                    xs => ` ${translate (l10n) ("liturgicalchants")}: ${xs}`,
                    str => <span>{combinedList}{str}</span>
                  )
                })
                (ensure (notNull) (PVCA.mappedLiturgicalChants (variant)))
}

const mapSpellNames =
  (l10n: L10nRecord) =>
  (spells: OrderedMap<string, Record<Spell>>) =>
  (ids: string | NonEmptyList<string>) =>
    isList (ids)
      ? pipe_ (
          ids,
          mapMaybe (pipe (lookupF (spells), fmap (Spell.A.name))),
          ensure (pipe (flength, gt (1))),
          fmap (localizeOrList (l10n))
        )
      : fmapF (lookup (ids) (spells)) (Spell.A.name)

const mapVariantSkills =
  (l10n: L10nRecord) =>
  (add_x: number) =>
    map ((e: Record<IncreasableForView>) => {
      const prev = maybe (6) (add (add_x)) (IFVA.previous (e))

      return `${IFVA.name (e)} ${prev + IFVA.value (e)} ${translate (l10n) ("insteadof")} ${prev}`
    })

interface CombinedSpell {
  newId: string | NonEmptyList<string>
  oldId: string | NonEmptyList<string>
  value: number
}

const CombinedSpell = fromDefault<CombinedSpell> ({ newId: "", oldId: "", value: 0 })

const CSA = CombinedSpell.A

type CombinedMappedSpell = Record<IncreasableForView> | Record<IncreasableListForView>

type CombinedSpells = List<CombinedMappedSpell | Record<CombinedSpell>>

type CombinedSpellsTriple = Tuple<[
                              List<CombinedMappedSpell>,
                              List<Record<CombinedSpell>>,
                              List<CombinedMappedSpell>
                            ]>

type CombinedSpellsTripleValid = Tuple<[
                                   NonEmptyList<CombinedMappedSpell>,
                                   List<Record<CombinedSpell>>,
                                   List<CombinedMappedSpell>
                                 ]>

const combineSpellsPred =
  (x: CombinedSpellsTriple): x is CombinedSpellsTripleValid =>
    pipe_ (x, sel1, notNull)

const getCombinedSpellId =
  (x: CombinedMappedSpell) => IncreasableListForView.is (x) ? ILFVA.id (x) : IFVA.id (x)

const combineSpells =
  (spells: OrderedMap<string, Record<Spell>>) =>
  (xs: List<CombinedMappedSpell>): CombinedSpells => {

  type CST = CombinedSpellsTriple

  return pipe_ (
    Tuple (xs, List<Record<CombinedSpell>> (), List<CombinedMappedSpell> ()),
    whilePred (combineSpellsPred)
              (t => {
                const olds = sel1 (t)
                const combined_spells = sel2 (t)
                const single_spells = sel3 (t)

                const olds_separate = fromJust (uncons (olds))

                const base = fst (olds_separate)
                const id = getCombinedSpellId (base)

                const value = IFVAL.value (base)

                const mprevious = IFVAL.previous (base)

                const olds_left = snd (olds_separate)

                const mbase_spell = lookup (id) (spells)

                return maybe<CST> (t)
                                  (_ =>
                                    maybe_ (() => {
                                             const mmatching_spell_index =
                                               findIndex ((e: CombinedMappedSpell) => {
                                                           const curr_id = getCombinedSpellId (e)
                                                           const curr_value = IFVAL.value (e)
                                                           const mcurr_previous = IFVAL.previous (e)

                                                           const matching_spell_exists =
                                                             isList (curr_id)
                                                               ? all (memberF (spells)) (curr_id)
                                                               : member (curr_id) (spells)

                                                           return Maybe.elem (value)
                                                                             (mcurr_previous)
                                                             && curr_value === 0
                                                             && matching_spell_exists
                                                         })
                                                         (olds_left)

                                             return maybe_ (() => pipe_ (
                                                                    t,
                                                                    upd1 (olds_left),
                                                                    upd3 (cons (single_spells)
                                                                               (base))
                                                                  ))
                                                           ((index: number) => {
                                                             const matching_spell =
                                                               unsafeIndex (olds_left) (index)

                                                             const oldId =
                                                               getCombinedSpellId (matching_spell)

                                                             return pipe_ (
                                                               t,
                                                               upd1 (deleteAt (index) (olds_left)),
                                                               upd2 (cons (combined_spells)
                                                                          (CombinedSpell ({
                                                                            oldId,
                                                                            newId: id,
                                                                            value,
                                                                          })))
                                                             )
                                                           })
                                                           (mmatching_spell_index)
                                           })
                                           ((previous: number) => {
                                             const mmatching_spell_index =
                                               findIndex ((e: CombinedMappedSpell) => {
                                                           const curr_id = getCombinedSpellId (e)
                                                           const curr_value = IFVAL.value (e)

                                                           const matching_spell_exists =
                                                             isList (curr_id)
                                                               ? all (memberF (spells)) (curr_id)
                                                               : member (curr_id) (spells)

                                                           return curr_value === previous
                                                             && matching_spell_exists
                                                         })
                                                         (olds_left)

                                             return maybe_ (() => pipe_ (
                                                                    t,
                                                                    upd1 (olds_left),
                                                                    upd3 (cons (single_spells)
                                                                               (base))
                                                                  ))
                                                           ((index: number) => {
                                                             const matching_spell =
                                                               unsafeIndex (olds_left) (index)

                                                             const newId =
                                                               getCombinedSpellId (matching_spell)

                                                             return pipe_ (
                                                               t,
                                                               upd1 (deleteAt (index) (olds_left)),
                                                               upd2 (cons (combined_spells)
                                                                          (CombinedSpell ({
                                                                            oldId: id,
                                                                            newId,
                                                                            value,
                                                                          })))
                                                             )
                                                           })
                                                           (mmatching_spell_index)
                                           })
                                           (mprevious))
                                  (mbase_spell)
              }),
    x => append<CombinedMappedSpell | Record<CombinedSpell>> (sel1 (x)) (sel2 (x))
  )
}
