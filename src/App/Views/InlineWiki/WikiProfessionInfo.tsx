import * as React from "react";
import { all, append, cons, deleteAt, findIndex, isList, List, map, NonEmptyList, notNull, uncons, unsafeIndex } from "../../../Data/List";
import { fromJust, Maybe, maybe, maybe_ } from "../../../Data/Maybe";
import { lookup, member, memberF, OrderedMap } from "../../../Data/OrderedMap";
import { difference } from "../../../Data/OrderedSet";
import { fst, snd } from "../../../Data/Pair";
import { fromDefault, Record } from "../../../Data/Record";
import { Tuple } from "../../../Data/Tuple";
import { sel1, sel2, sel3 } from "../../../Data/Tuple/Select";
import { upd1, upd2, upd3 } from "../../../Data/Tuple/Update";
import { Categories } from "../../Constants/Categories";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { IncreasableForView } from "../../Models/View/IncreasableForView";
import { IncreasableListForView } from "../../Models/View/IncreasableListForView";
import { ProfessionCombined } from "../../Models/View/ProfessionCombined";
import { ProfessionVariantCombined } from "../../Models/View/ProfessionVariantCombined";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Blessing } from "../../Models/Wiki/Blessing";
import { Book } from "../../Models/Wiki/Book";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { isRequiringIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { isRaceRequirement, RaceRequirement } from "../../Models/Wiki/prerequisites/RaceRequirement";
import { isSexRequirement, SexRequirement } from "../../Models/Wiki/prerequisites/SexRequirement";
import { CantripsSelection } from "../../Models/Wiki/professionSelections/CantripsSelection";
import { CombatTechniquesSelection } from "../../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { CursesSelection } from "../../Models/Wiki/professionSelections/CursesSelection";
import { LanguagesScriptsSelection } from "../../Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { isRemoveCombatTechniquesSelection, RemoveCombatTechniquesSelection } from "../../Models/Wiki/professionSelections/RemoveCombatTechniquesSelection";
import { isRemoveSpecializationSelection, RemoveSpecializationSelection } from "../../Models/Wiki/professionSelections/RemoveSpecializationSelection";
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
import { getSelectOptionName } from "../../Utilities/Activatable/selectionUtils";
import { translate } from "../../Utilities/I18n";
import { getNumericId } from "../../Utilities/IDUtils";
import { add } from "../../Utilities/mathUtils";
import { pipe_ } from "../../Utilities/pipe";
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
const PVCA = ProfessionVariantCombined.A
const ISA = IncreaseSkill.A
const IFVA = IncreasableForView.A
const IFVAL = IncreasableForView.AL
const ILFVA = IncreasableListForView.A

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
        <VariantLanguagesLiteracySelection {...props} selections={profession.selections} />
        <VariantSpecializationSelection {...props} selections={profession.selections} />
        <VariantCombatTechniquesSelection {...props} selections={profession.selections} />
        <VariantSkillsSelection {...props} />
        {variant.concludingText && ` ${variant.concludingText}`}
      </span>
    </li>
  )
}

interface VariantPrerequisitesProps {
  attributes: Map<string, Attribute>
  l10n: UIMessages
  skills: Map<string, Skill>
  variant: ProfessionVariantCombined
}

interface VariantPrerequisiteIntermediate {
  id: string
  name: string
  active?: boolean
}

function VariantPrerequisites(props: VariantPrerequisitesProps): JSX.Element {
  const {
    attributes,
    l10n,
    skills,
    variant
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
  variant: ProfessionVariantCombined
}

function VariantSpecialAbilities(props: VariantSpecialAbilitiesProps): JSX.Element {
  return (
    <>
      {props.variant.specialAbilities.map(e => (
        <span key={e.id}>
          <span className={e.active === false ? "disabled" : undefined}>
            {e.combinedName}
          </span>
        </span>
      ))}
    </>
  )
}

interface VariantLanguagesLiteracySelectionProps {
  l10n: UIMessages
  selections: ProfessionSelectionList
  variant: ProfessionVariantCombined
}

function VariantLanguagesLiteracySelection(props: VariantLanguagesLiteracySelectionProps): JSX.Element | null {
  const {
    l10n,
    selections,
    variant: {
      selections: variantSelections
    }
  } = props

  const selection = selections.find(e => {
    return e.id === "LANGUAGES_SCRIPTS"
  }) as LanguagesScriptsSelection | undefined

  const variantSelection = variantSelections.find(e => {
    return e.id === "LANGUAGES_SCRIPTS"
  }) as LanguagesScriptsSelection | undefined

  if (typeof variantSelection === "object") {
    const mainKey: UIKey = "info.specialabilitieslanguagesandliteracy"
    const mainString = translate(l10n, mainKey, variantSelection.value)

    if (typeof selection === "object") {
      const insteadKey: UIKey = "info.variantsinsteadof"
      const insteadString = translate(l10n, insteadKey)

      return (
        <span>
          <span>{mainString} {insteadString} {selection.value}</span>
        </span>
      )
    }
    else {
      return (
        <span>
          <span>{mainString}</span>
        </span>
      )
    }
  }

  return null
}

interface VariantSpecializationSelectionProps {
  l10n: UIMessages
  selections: ProfessionSelectionList
  skills: Map<string, Skill>
  specializationSelectionString: string | undefined
  variant: ProfessionVariantCombined
}

function VariantSpecializationSelection(props: VariantSpecializationSelectionProps): JSX.Element | null {
  const {
    l10n,
    selections,
    skills,
    specializationSelectionString,
    variant: {
      selections: variantSelections
    }
  } = props

  const selection = selections.find(e => {
    return e.id === "SPECIALISATION"
  }) as SpecializationSelection | undefined

  const variantSelection = variantSelections.find(e => {
    return e.id === "SPECIALISATION"
  }) as SpecializationSelection | RemoveSpecializationSelection | undefined

  if (variantSelection) {
    if (isRemoveSpecializationSelection(variantSelection)) {
      if (variantSelection.active === false) {
        return (
          <span>
            <span className="disabled">{specializationSelectionString}</span>
          </span>
        )
      }
    }
    else {
      const mainKey: UIKey = "info.specialabilitiesspecialization"
      const separatorKey: UIKey = "info.specialabilitiesspecializationseparator"

      let skillText

      if (typeof variantSelection.sid === "object") {
        const skillList = variantSelection.sid.map(e => skills.get(e)!.name)
        const separator = translate(l10n, separatorKey)
        skillText = sortStrings(skillList, l10n.id).intercalate(separator)
      }
      else {
        skillText = skills.get(variantSelection.sid)!.name
      }

      const mainText = translate(l10n, mainKey, skillText)

      if (selection) {
        const instead = translate(l10n, "info.variantsinsteadof")
        return (
          <span>
            <span>{mainText} {instead} {specializationSelectionString}</span>
          </span>
        )
      }
      else {
        return (
          <span>
            <span>{mainText}</span>
          </span>
        )
      }
    }
  }

  return null
}

interface VariantCombatTechniquesSelectionProps {
  combatTechniquesSelectionString: string | undefined
  l10n: UIMessages
  selections: ProfessionSelectionList
  variant: ProfessionVariantCombined
}

function VariantCombatTechniquesSelection(props: VariantCombatTechniquesSelectionProps): JSX.Element | null {
  const {
    combatTechniquesSelectionString,
    l10n,
    selections,
    variant: {
      selections: variantSelections
    }
  } = props

  const selection = selections.find(e => {
    return e.id === "COMBAT_TECHNIQUES"
  }) as CombatTechniquesSelection | undefined

  const variantSelection = variantSelections.find(e => {
    return e.id === "COMBAT_TECHNIQUES"
  }) as CombatTechniquesSelection | RemoveCombatTechniquesSelection | undefined

  if (variantSelection) {
    if (isRemoveCombatTechniquesSelection(variantSelection)) {
      if (variantSelection.active === false) {
        return (
          <span>
            <span className="disabled">{combatTechniquesSelectionString}</span>
          </span>
        )
      }
    }
    else {
      if (selection) {
        const hasSameSids = difference(selection.sid, variantSelection.sid).length === 0
        const hasSameAmount = variantSelection.amount === variantSelection.amount

        if (hasSameSids && hasSameAmount) {
          const separator = translate(l10n, "info.or")
          const instead = translate(l10n, "info.variantsinsteadof")

          const joinedList = sortStrings(selection.sid, l10n.id).intercalate(separator)

          return (
            <span>
              <span>{joinedList} {variantSelection.value} {instead} {selection.value}</span>
            </span>
          )
        }
      }
      else {
        const newString = `${translate(l10n, "info.combattechniquesselection", translate(l10n, "info.combattechniquesselectioncounter")[variantSelection.amount - 1], variantSelection.value + 6)}${sortStrings(variantSelection.sid, l10n.id).intercalate(", ")}`
        return (
          <span>
            <span>{newString}</span>
          </span>
        )
      }
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
    variant
  } = props

  const instead = translate (l10n) ("insteadof")

  const combatTechniquesList =
    pipe_ (variant, PVCA.mappedCombatTechniques, mapVariantSkills (l10n) (6))

  const skillsList =
    pipe_ (variant, PVCA.mappedSkills, mapVariantSkills (l10n) (0))

  const combinedSpellsList = combineSpells (spells) (PVCA.mappedSpells (variant))

  const spellsList = combinedSpellsList.map(e => {
    if (isCombinedSpell(e)) {
      const { newId, oldId, value } = e
      const newSpellName = spells.has(newId) ? spells.get(newId)!.name : "..."
      const oldSpellName = spells.has(oldId) ? spells.get(oldId)!.name : "..."
      return `${newSpellName} ${value} ${instead} ${oldSpellName} ${value}`
    }
    else {
      const { id, value, previous = 0 } = e
      const name = spells.has(id) ? spells.get(id)!.name : "..."
      return `${name} ${previous + value} ${instead} ${previous}`
    }
  })

  const combinedList = [
    ...sortStrings(combatTechniquesList, l10n.id),
    ...sortStrings(skillsList, l10n.id),
    ...sortStrings(spellsList, l10n.id)
  ].join(", ")

  if (variant.liturgicalChants.length > 0) {
    const blessings = translate(l10n, "info.thetwelveblessings")

    const liturgicalChantsArr = []

    if (variant.blessings.length === 12)  {
      liturgicalChantsArr.push(blessings)
    }

    for (const e of variant.liturgicalChants) {
      const name = liturgicalChants.get(e.id)!.name
      liturgicalChantsArr.push(`${name} ${e.value}`)
    }

    const sortedLiturgicalChants = sortStrings(liturgicalChantsArr, l10n.id)

    const main = translate(l10n, "info.liturgicalchants")

    const liturgicalChantsString = ` ${main}: ${sortedLiturgicalChants.intercalate(", ")}`

    return (
      <span>{combinedList}{liturgicalChantsString}</span>
    )
  }

  return (
    <span>{combinedList}</span>
  )
}

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
                                                                            value
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
                                                                            value
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
