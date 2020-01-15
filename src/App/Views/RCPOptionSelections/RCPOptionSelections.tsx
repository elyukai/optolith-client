import * as React from "react";
import { notEquals } from "../../../Data/Eq";
import { cnst } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { flength, List, notNullStr } from "../../../Data/List";
import { bindF, ensure, fromJust, isJust, isNothing, Just, mapMaybe, Maybe, maybe, maybeToNullable, maybe_, Nothing, or } from "../../../Data/Maybe";
import { add, dec, gt, inc, lt, subtract } from "../../../Data/Num";
import { adjust, alter, lookup, lookupF, OrderedMap, size } from "../../../Data/OrderedMap";
import { OrderedSet } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { first, fst, Pair, second, snd } from "../../../Data/Tuple";
import { ProfessionId } from "../../Constants/Ids";
import { Selections as SelectionsInterface } from "../../Models/Hero/heroTypeHelpers";
import { Rules } from "../../Models/Hero/Rules";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Culture } from "../../Models/Wiki/Culture";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Profession } from "../../Models/Wiki/Profession";
import { CombatTechniquesSelection } from "../../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { ProfessionSelections } from "../../Models/Wiki/professionSelections/ProfessionAdjustmentSelections";
import { CombatTechniquesSecondSelection } from "../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { ProfessionVariant } from "../../Models/Wiki/ProfessionVariant";
import { Race } from "../../Models/Wiki/Race";
import { Skill } from "../../Models/Wiki/Skill";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { ProfessionSelectionIds } from "../../Models/Wiki/wikiTypeHelpers";
import { translate } from "../../Utilities/I18n";
import { getAllAdjustmentSelections } from "../../Utilities/mergeRcpAdjustmentSelections";
import { sign } from "../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { getBuyScriptElement, getGuildMageUnfamiliarSpellSelectionElement, getLanguagesAndScriptsElementAndValidation, getMainScriptSelectionElement, getMotherTongueSelectionElement, getSkillsElementAndValidation, getSkillSpecializationElement, getTerrainKnowledgeElement } from "../../Utilities/rcpAdjustmentSelectionUtils";
import { getSelPair } from "../../Utilities/RCPSelectionsUtils";
import { BorderButton } from "../Universal/BorderButton";
import { Checkbox } from "../Universal/Checkbox";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { Scroll } from "../Universal/Scroll";
import { Slidein } from "../Universal/Slidein";
import { CantripSelectionList, isCantripsSelectionValid } from "./CantripSelectionList";
import { CombatTechniqueSelectionList, getFirstCombatTechniques, getSecondCombatTechniques, isFirstCombatTechniqueSelectionValid, isSecondCombatTechniqueSelectionValid } from "./CombatTechniqueSelectionList";
import { CursesSelectionList, isCursesSelectionValid } from "./CursesSelectionList";

export interface RCPOptionSelectionsProps {
  l10n: L10nRecord
  race: Record<Race>
  culture: Record<Culture>
  profession: Record<Profession>
  professionVariant: Maybe<Record<ProfessionVariant>>
  wiki: WikiModelRecord
  munfamiliar_spells: Maybe<List<Record<DropdownOption>>>
  rules: Record<Rules>
  close (): void
  setSelections (selections: SelectionsInterface): void
}

const AttrA = Attribute.A
const PSA = ProfessionSelections.A

export const RCPOptionSelections: React.FC<RCPOptionSelectionsProps> = props => {
  const {
    close,
    race,
    culture,
    profession,
    professionVariant,
    l10n,
    rules,
    wiki,
    munfamiliar_spells,
    setSelections,
  } = props

  const [ attributeAdjustment, setAttributeAdjustment ] = React.useState<Maybe<string>> (Nothing)
  const [ useCulturePackage, setUseCulturePackage ] = React.useState<boolean> (false)
  const [ motherTongue, setMotherTongue ] = React.useState<number> (0)
  const [ isBuyingMainScriptEnabled, setIsBuyingMainScriptEnabled ] =
    React.useState<boolean> (false)
  const [ mainScript, setMainScript ] = React.useState<number> (0)
  const [ cantripsActive, setCantrips ] = React.useState<OrderedSet<string>> (OrderedSet.empty)
  const [ combatTechniquesActive, setCombatTechniques ] =
    React.useState<OrderedSet<string>> (OrderedSet.empty)
  const [ combatTechniquesSecondActive, setCombatTechniquesSecond ] =
    React.useState<OrderedSet<string>> (OrderedSet.empty)
  const [ cursesActive, setCurses ] = React.useState<OrderedMap<string, number>> (OrderedMap.empty)
  const [ languages, setLanguages ] = React.useState<OrderedMap<number, number>> (OrderedMap.empty)
  const [ scripts, setScripts ] = React.useState<OrderedMap<number, number>> (OrderedMap.empty)
  const [ skillsActive, setSkills ] = React.useState<OrderedMap<string, number>> (OrderedMap.empty)
  // first: selection id, second: user input
  const [ specialization, setSpecialization ] =
    React.useState<Pair<Maybe<number>, string>> (Pair (Nothing, ""))
  const [ specializationSkillId, setSpecializationSkillId ] =
    React.useState<Maybe<string>> (Nothing)
  const [ terrainKnowledgeActive, setTerrainKnowledge ] = React.useState<Maybe<number>> (Nothing)
  const [ selectedUnfamiliarSpell, setSelectedUnfamiliarSpell ] =
    React.useState<Maybe<string>> (Nothing)

  const handleSetAttributeAdjustment = React.useCallback (
    (option: string) => setAttributeAdjustment (Just (option)),
    []
  )

  const handleSwitchIsCulturalPackageEnabled = React.useCallback (
    () => setUseCulturePackage (!useCulturePackage),
    [ useCulturePackage ]
  )

  const handleSwitchIsBuyingMainScriptEnabled = React.useCallback (
    () => setIsBuyingMainScriptEnabled (!isBuyingMainScriptEnabled),
    [ isBuyingMainScriptEnabled ]
  )

  const handleSwitchCantrip = React.useCallback (
    (id: string) => setCantrips (OrderedSet.toggle (id) (cantripsActive)),
    [ cantripsActive ]
  )

  const handleSwitchCombatTechnique = React.useCallback (
    (id: string) => setCombatTechniques (OrderedSet.toggle (id) (combatTechniquesActive)),
    [ combatTechniquesActive ]
  )

  const handleSwitchSecondCombatTechnique = React.useCallback (
    (id: string) => setCombatTechniquesSecond (OrderedSet.toggle (id)
                                                                 (combatTechniquesSecondActive)),
    [ combatTechniquesSecondActive ]
  )

  const handleAdjustCurse = React.useCallback (
    (id: string) => (moption: Maybe<"add" | "remove">) => {
      if (isJust (moption)) {
        const option = fromJust (moption)

        if (option === "add") {
          setCurses (adjust (inc) (id) (cursesActive))
        }
        else {
          setCurses (adjust (dec) (id) (cursesActive))
        }
      }
      else {
        setCurses (alter (maybe<Maybe<number>> (Just (0)) (cnst (Nothing)))
                         (id)
                         (cursesActive))
      }
    },
    [ cursesActive ]
  )

  const handleAdjustLanguage = React.useCallback (
    (id: number) => (level: Maybe<number>) => {
      setLanguages (alter (cnst (level)) (id) (languages))
    },
    [ languages ]
  )

  const handleAdjustScript = React.useCallback (
    (id: number) => (ap: number) => {
      setScripts (alter (maybe<Maybe<number>> (Just (ap)) (cnst (Nothing)))
                        (id)
                        (scripts))
    },
    [ scripts ]
  )

  const handleSetSpecializationSkill = React.useCallback (
    (id: string) => {
      setSpecialization (Pair<Maybe<number>, string> (Nothing, ""))
      setSpecializationSkillId (Just (id))
    },
    []
  )

  const handleSetSpecialization = React.useCallback (
    (value: number | string) => {
      setSpecialization (typeof value === "number"
                         ? first (() => Just (value)) (specialization)
                         : second (() => value) (specialization))
    },
    [ specialization ]
  )

  const handleAddSkillPoint = React.useCallback (
    (id: string) => {
      setSkills (alter ((skill: Maybe<number>) =>
                         pipe_ (
                           wiki,
                           WikiModel.A.skills,
                           lookup (id),
                           fmap (pipe (Skill.A.ic, add (Maybe.sum (skill))))
                         ))
                       (id)
                       (skillsActive))
    },
    [ skillsActive, wiki ]
  )

  const handleRemoveSkillPoint = React.useCallback (
    (id: string) => {
      setSkills (alter ((skill: Maybe<number>) =>
                         pipe_ (
                           wiki,
                           WikiModel.A.skills,
                           lookup (id),
                           bindF (pipe (Skill.A.ic, subtract (Maybe.sum (skill)), ensure (gt (0))))
                         ))
                       (id)
                       (skillsActive))
    },
    [ skillsActive, wiki ]
  )

  const handleSetTerrainKnowledge = React.useCallback (
    (terrainKnowledge: number) => setTerrainKnowledge (Just (terrainKnowledge)),
    []
  )

  const handleSetGuildMageUnfamiliarSpellId = React.useCallback (
    (id: string) => setSelectedUnfamiliarSpell (Just (id)),
    []
  )

  const prof_sels = getAllAdjustmentSelections (profession) (professionVariant)

  const handleConfirmSelections = React.useCallback (
    () => {
      if (isJust (attributeAdjustment)) {
        setSelections ({
          attributeAdjustment: fromJust (attributeAdjustment),
          useCulturePackage,
          motherTongue,
          isBuyingMainScriptEnabled,
          mainScript,
          cantrips: cantripsActive,
          combatTechniques: combatTechniquesActive,
          combatTechniquesSecond: combatTechniquesSecondActive,
          curses: cursesActive,
          languages,
          scripts,
          skills: skillsActive,
          specializationSkillId,
          terrainKnowledge: terrainKnowledgeActive,
          map: prof_sels,
          specialization:
            maybe_ <Maybe<string | number>> (() => fst (specialization))
                                            (Just as (x: string) => Just<string>)
                                            (ensure (notNullStr) (snd (specialization))),
          unfamiliarSpell: selectedUnfamiliarSpell,
        })
      }
    },
    [
      attributeAdjustment,
      cantripsActive,
      combatTechniquesActive,
      combatTechniquesSecondActive,
      cursesActive,
      isBuyingMainScriptEnabled,
      languages,
      mainScript,
      motherTongue,
      prof_sels,
      scripts,
      selectedUnfamiliarSpell,
      setSelections,
      skillsActive,
      specialization,
      specializationSkillId,
      terrainKnowledgeActive,
      useCulturePackage,
    ]
  )

  const attributeAdjustmentSelection = Race.A.attributeAdjustmentsSelection (race)
  const attributeAdjustmentValue = fst (attributeAdjustmentSelection)
  const signed_attr_ajst_val = sign (attributeAdjustmentValue)

  const isMotherTongueSelectionNeeded = flength (Culture.A.languages (culture)) > 1

  const scriptsListLength = flength (Culture.A.scripts (culture))

  /**
   * `Tuple.fst` – if the culture has any script
   *
   * `Tuple.snd` – if the culture has multiple possible scripts
   */
  const isScriptSelectionNeeded = Pair (scriptsListLength > 0, scriptsListLength > 1)

  const isAnyLanguageOrScriptSelected = size (languages) > 0 || size (scripts) > 0

  const buyScriptElement = getBuyScriptElement (l10n)
                                               (wiki)
                                               (culture)
                                               (isScriptSelectionNeeded)
                                               (isBuyingMainScriptEnabled)
                                               (isAnyLanguageOrScriptSelected)
                                               (handleSwitchIsBuyingMainScriptEnabled)

  const languagesAndScripts =
    getLanguagesAndScriptsElementAndValidation (l10n)
                                               (wiki)
                                               (rules)
                                               (culture)
                                               (languages)
                                               (scripts)
                                               (prof_sels)
                                               (mainScript)
                                               (motherTongue)
                                               (isBuyingMainScriptEnabled)
                                               (isMotherTongueSelectionNeeded)
                                               (isScriptSelectionNeeded)
                                               (handleAdjustLanguage)
                                               (handleAdjustScript)

  const curses =
    getSelPair (isCursesSelectionValid (cursesActive))
               (selection => (
                 <CursesSelectionList
                   l10n={l10n}
                   wiki={wiki}
                   rules={rules}
                   active={cursesActive}
                   selection={selection}
                   adjustCurseValue={handleAdjustCurse}
                   />
               ))
               (PSA[ProfessionSelectionIds.CURSES])
               (prof_sels)

  const combatTechniques =
    getSelPair (isFirstCombatTechniqueSelectionValid (combatTechniquesActive))
               (selection => (
                 <CombatTechniqueSelectionList
                   l10n={l10n}
                   active={combatTechniquesActive}
                   amount={CombatTechniquesSelection.A.amount (selection)}
                   list={getFirstCombatTechniques (wiki) (selection)}
                   value={CombatTechniquesSelection.A.value (selection)}
                   setCombatTechniqueId={handleSwitchCombatTechnique}
                   />
               ))
               (PSA[ProfessionSelectionIds.COMBAT_TECHNIQUES])
               (prof_sels)

  const combatTechniquesSecond =
    getSelPair (isSecondCombatTechniqueSelectionValid (combatTechniquesSecondActive))
               (selection => (
                 <CombatTechniqueSelectionList
                   l10n={l10n}
                   active={combatTechniquesSecondActive}
                   disabled={combatTechniquesActive}
                   amount={CombatTechniquesSecondSelection.A.amount (selection)}
                   list={getSecondCombatTechniques (wiki) (selection)}
                   value={CombatTechniquesSecondSelection.A.value (selection)}
                   second
                   setCombatTechniqueId={handleSwitchSecondCombatTechnique}
                   />
               ))
               (PSA[ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND])
               (prof_sels)

  const cantrips =
    getSelPair (isCantripsSelectionValid (cantripsActive))
               (selection => (
                 <CantripSelectionList
                   l10n={l10n}
                   wiki={wiki}
                   active={cantripsActive}
                   selection={selection}
                   toggleCantripId={handleSwitchCantrip}
                   />
               ))
               (PSA[ProfessionSelectionIds.CANTRIPS])
               (prof_sels)

  const skillSpecialization =
   getSkillSpecializationElement (l10n)
                                 (wiki)
                                 (specialization)
                                 (specializationSkillId)
                                 (handleSetSpecialization)
                                 (handleSetSpecializationSkill)
                                 (prof_sels)

  const skills = getSkillsElementAndValidation (l10n)
                                               (wiki)
                                               (skillsActive)
                                               (handleAddSkillPoint)
                                               (handleRemoveSkillPoint)
                                               (prof_sels)

  const terrainKnowledge = getTerrainKnowledgeElement (wiki)
                                                      (terrainKnowledgeActive)
                                                      (handleSetTerrainKnowledge)
                                                      (prof_sels)

  const guildMageUnfamiliarSpell =
    getGuildMageUnfamiliarSpellSelectionElement (l10n)
                                                (munfamiliar_spells)
                                                (selectedUnfamiliarSpell)
                                                (handleSetGuildMageUnfamiliarSpellId)
                                                (profession)

  return (
    <Slidein isOpen close={close} className="rcp-selections">
      <Scroll>
        <h3>{translate (l10n) ("race")}</h3>
        <Dropdown
          hint={translate (l10n) ("selectattributeadjustment")}
          value={attributeAdjustment}
          onChangeJust={handleSetAttributeAdjustment}
          options={mapMaybe (pipe (
                              lookupF (WikiModel.A.attributes (wiki)),
                              fmap (attr => DropdownOption ({
                                  id: Just (AttrA.id (attr)),
                                  name: `${AttrA.name (attr)} ${signed_attr_ajst_val}`,
                                }))
                            ))
                            (snd (attributeAdjustmentSelection))}
          />

        <h3>{translate (l10n) ("culture")}</h3>
        <Checkbox
          checked={useCulturePackage}
          onClick={handleSwitchIsCulturalPackageEnabled}
          >
          {translate (l10n) ("buyculturalpackage")}
          {" ("}
          {Culture.A.culturalPackageAdventurePoints (culture)}
          {` ${translate (l10n) ("adventurepoints.short")})`}
        </Checkbox>
        {getMotherTongueSelectionElement (l10n)
                                         (wiki)
                                         (culture)
                                         (isMotherTongueSelectionNeeded)
                                         (motherTongue)
                                         (isAnyLanguageOrScriptSelected)
                                         (setMotherTongue)}
        {maybeToNullable (buyScriptElement)}
        {getMainScriptSelectionElement (l10n)
                                       (wiki)
                                       (culture)
                                       (isScriptSelectionNeeded)
                                       (mainScript)
                                       (isAnyLanguageOrScriptSelected)
                                       (isBuyingMainScriptEnabled)
                                       (setMainScript)}
        {pipe_ (
          profession,
          Profession.A.id,
          notEquals<string> (ProfessionId.CustomProfession)
        )
          ? <h3>{translate (l10n) ("profession")}</h3>
          : null}
        {maybeToNullable (skillSpecialization)}
        {maybeToNullable (fmapF (languagesAndScripts) (snd))}
        {maybeToNullable (snd (combatTechniques))}
        {maybeToNullable (snd (combatTechniquesSecond))}
        {maybeToNullable (snd (curses))}
        {maybeToNullable (guildMageUnfamiliarSpell)}
        {maybeToNullable (snd (cantrips))}
        {maybeToNullable (fmapF (skills) (snd))}
        {maybeToNullable (terrainKnowledge)}
        <BorderButton
          label={translate (l10n) ("complete")}
          primary
          disabled={
            !fst (combatTechniques)
            || !fst (combatTechniquesSecond)
            || !fst (cantrips)
            || !fst (curses)
            || isNothing (attributeAdjustment)
            || (isMotherTongueSelectionNeeded && motherTongue === 0)
            || (
              isBuyingMainScriptEnabled
              && snd (isScriptSelectionNeeded)
              && mainScript === 0
            )
            || (
              isJust (PSA[ProfessionSelectionIds.SPECIALIZATION] (prof_sels))
              && snd (specialization) === ""
              && isNothing (fst (specialization))
            )
            || or (fmapF (languagesAndScripts) (pipe (fst, lt (0))))
            || or (fmapF (skills) (pipe (fst, lt (0))))
            || (
             isJust (PSA[ProfessionSelectionIds.TERRAIN_KNOWLEDGE] (prof_sels))
              && isNothing (terrainKnowledgeActive)
            )
            || (
              PSA[ProfessionSelectionIds.GUILD_MAGE_UNFAMILIAR_SPELL] (prof_sels)
              && isNothing (selectedUnfamiliarSpell)
            )
          }
          onClick={handleConfirmSelections}
          />
      </Scroll>
    </Slidein>
  )
}
