import * as React from "react";
import { not } from "../../../Data/Bool";
import { notEquals } from "../../../Data/Eq";
import { cnst } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { flength, List, notNullStr } from "../../../Data/List";
import { bindF, ensure, fromJust, isJust, isNothing, Just, liftM3, mapMaybe, Maybe, maybe, maybeToNullable, maybe_, Nothing, or } from "../../../Data/Maybe";
import { add, dec, gt, inc, lt, subtract } from "../../../Data/Num";
import { adjust, alter, lookup, lookupF, OrderedMap, size } from "../../../Data/OrderedMap";
import { OrderedSet } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { first, fst, Pair, second, snd } from "../../../Data/Tuple";
import { ProfessionId } from "../../Constants/Ids";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Selections as SelectionsInterface } from "../../Models/Hero/heroTypeHelpers";
import { Rules } from "../../Models/Hero/Rules";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Culture } from "../../Models/Wiki/Culture";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Profession } from "../../Models/Wiki/Profession";
import { ProfessionSelections } from "../../Models/Wiki/professionSelections/ProfessionAdjustmentSelections";
import { ProfessionVariant } from "../../Models/Wiki/ProfessionVariant";
import { Race } from "../../Models/Wiki/Race";
import { Skill } from "../../Models/Wiki/Skill";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { ProfessionSelectionIds } from "../../Models/Wiki/wikiTypeHelpers";
import { translate } from "../../Utilities/I18n";
import { getAllAdjustmentSelections } from "../../Utilities/mergeRcpAdjustmentSelections";
import { sign } from "../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { getBuyScriptElement, getCantripsElementAndValidation, getCombatTechniquesElementAndValidation, getCombatTechniquesSecondElementAndValidation, getCursesElementAndValidation, getGuildMageUnfamiliarSpellSelectionElement, getLanguagesAndScriptsElementAndValidation, getMainScriptSelectionElement, getMotherTongueSelectionElement, getSkillsElementAndValidation, getSkillSpecializationElement, getTerrainKnowledgeElement } from "../../Utilities/rcpAdjustmentSelectionUtils";
import { BorderButton } from "../Universal/BorderButton";
import { Checkbox } from "../Universal/Checkbox";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { Scroll } from "../Universal/Scroll";
import { Slidein } from "../Universal/Slidein";

export interface SelectionsOwnProps {
  hero: HeroModelRecord
  l10n: L10nRecord
  close (): void
}

export interface SelectionsStateProps {
  currentRace: Maybe<Record<Race>>
  currentCulture: Maybe<Record<Culture>>
  currentProfession: Maybe<Record<Profession>>
  currentProfessionVariant: Maybe<Record<ProfessionVariant>>
  wiki: WikiModelRecord
  munfamiliar_spells: Maybe<List<Record<DropdownOption>>>
  rules: Record<Rules>
}

export interface SelectionsDispatchProps {
  setSelections (selections: SelectionsInterface): void
}

export type SelectionsProps = SelectionsStateProps & SelectionsDispatchProps & SelectionsOwnProps

export interface SelectionsState {
  attributeAdjustment: string
  useCulturePackage: boolean
  motherTongue: number
  isBuyingMainScriptEnabled: boolean
  mainScript: number
  cantrips: OrderedSet<string>
  combatTechniques: OrderedSet<string>
  combatTechniquesSecond: OrderedSet<string>
  curses: OrderedMap<string, number>
  languages: OrderedMap<number, number>
  scripts: OrderedMap<number, number>
  skills: OrderedMap<string, number>
  // first: selection id, second: user input
  specialization: Pair<Maybe<number>, string>
  specializationSkillId: Maybe<string>
  terrainKnowledge: Maybe<number>
  selectedUnfamiliarSpell: Maybe<string>
}

const AttrA = Attribute.A
const PSA = ProfessionSelections.A

export class RCPOptionSelections extends React.Component<SelectionsProps, SelectionsState> {
  state: SelectionsState = {
    attributeAdjustment: "ATTR_0",
    isBuyingMainScriptEnabled: false,
    cantrips: OrderedSet.empty,
    combatTechniquesSecond: OrderedSet.empty,
    combatTechniques: OrderedSet.empty,
    curses: OrderedMap.empty,
    motherTongue: 0,
    languages: OrderedMap.empty,
    scripts: OrderedMap.empty,
    mainScript: 0,
    skills: OrderedMap.empty,
    specialization: Pair<Maybe<number>, string> (Nothing, ""),
    specializationSkillId: Nothing,
    terrainKnowledge: Nothing,
    useCulturePackage: false,
    selectedUnfamiliarSpell: Nothing,
  }

  setAttributeAdjustment = (option: string) => this.setState ({ attributeAdjustment: option })

  switchIsCulturalPackageEnabled = () => this.setState (
    prevState => ({ useCulturePackage: !prevState .useCulturePackage })
  )

  setMotherTongue = (option: number) => this.setState ({ motherTongue: option })

  switchIsBuyingMainScriptEnabled = () => this.setState (
    prevState => ({ isBuyingMainScriptEnabled: !prevState .isBuyingMainScriptEnabled })
  )

  setMainCulturalLiteracy = (option: number) => this.setState ({ mainScript: option })

  switchCantrip = (id: string) => this.setState (
    prevState => ({ cantrips: OrderedSet.toggle (id) (prevState .cantrips) })
  )

  switchCombatTechnique = (id: string) => this.setState (
    prevState => ({ combatTechniques: OrderedSet.toggle (id) (prevState .combatTechniques) })
  )

  switchSecondCombatTechnique = (id: string) => this.setState (
    prevState => ({
      combatTechniquesSecond: OrderedSet.toggle (id) (prevState .combatTechniquesSecond),
    })
  )

  adjustCurse = (id: string) => (moption: Maybe<"add" | "remove">) => {
    if (isJust (moption)) {
      const option = fromJust (moption)

      if (option === "add") {
        this.setState (prevState => ({ curses: adjust (inc) (id) (prevState .curses) }))
      }
      else {
        this.setState (prevState => ({ curses: adjust (dec) (id) (prevState .curses) }))
      }
    }
    else {
      this.setState (
        prevState => ({
          curses: alter (maybe<Maybe<number>> (Just (0)) (cnst (Nothing)))
                        (id)
                        (prevState .curses),
        })
      )
    }
  }

  adjustLanguage = (id: number) => (level: Maybe<number>) =>
    this.setState (prevState => ({ languages: alter (cnst (level)) (id) (prevState .languages) }))

  adjustScript = (id: number) => (ap: number) =>
    this.setState (
      prevState => ({
        scripts: alter (maybe<Maybe<number>> (Just (ap)) (cnst (Nothing)))
                        (id)
                        (prevState .scripts),
      })
    )

  setSpecializationSkill = (id: string) => {
    this.setState ({
      specializationSkillId: Just (id),
      specialization: Pair<Maybe<number>, string> (Nothing, ""),
    })
  }

  setSpecialization = (value: number | string) => {
    this.setState (
      prevState => ({
        specialization: typeof value === "number"
          ? first (() => Just (value)) (prevState .specialization)
          : second (() => value) (prevState .specialization),
      })
    )
  }

  addSkillPoint = (id: string) =>
    this.setState (
      prevState => ({
        skills: alter ((skill: Maybe<number>) =>
                        pipe_ (
                          this .props .wiki,
                          WikiModel.A.skills,
                          lookup (id),
                          fmap (pipe (Skill.A.ic, add (Maybe.sum (skill))))
                        ))
                      (id)
                      (prevState .skills),
      })
    )

  removeSkillPoint = (id: string) =>
    this.setState (
      prevState => ({
        skills: alter ((skill: Maybe<number>) =>
                        pipe_ (
                          this .props .wiki,
                          WikiModel.A.skills,
                          lookup (id),
                          bindF (pipe (Skill.A.ic, subtract (Maybe.sum (skill)), ensure (gt (0))))
                        ))
                      (id)
                      (prevState .skills),
      })
    )

  setTerrainKnowledge = (terrainKnowledge: number) =>
    this.setState ({ terrainKnowledge: Just (terrainKnowledge) })

  setGuildMageUnfamiliarSpellId = (id: string) =>
    this.setState ({ selectedUnfamiliarSpell: Just (id) })

  assignRCPEntries = (selMap: Record<ProfessionSelections>) => {
    this.props.setSelections ({
      ...this.state,
      map: selMap,
      specialization:
        maybe_ <Maybe<string | number>> (() => fst (this.state.specialization))
                                        (Just as (x: string) => Just<string>)
                                        (ensure (notNullStr) (snd (this.state.specialization))),
      unfamiliarSpell: this.state.selectedUnfamiliarSpell,
    })
  }

  render () {
    const {
      close,
      currentCulture: maybeCulture,
      currentProfession: maybeProfession,
      currentProfessionVariant: maybeProfessionVariant,
      currentRace: maybeRace,
      l10n,
      rules,
      wiki,
      munfamiliar_spells,
    } = this.props

    const {
      attributeAdjustment,
      isBuyingMainScriptEnabled,
      cantrips: cantripsActive,
      combatTechniques: combatTechniquesActive,
      combatTechniquesSecond: combatTechniquesSecondActive,
      curses: cursesActive,
      motherTongue,
      languages,
      mainScript,
      scripts,
      skills: skillsActive,
      specialization,
      specializationSkillId,
      useCulturePackage,
      terrainKnowledge: terrainKnowledgeActive,
      selectedUnfamiliarSpell,
    } = this.state

    type R = Record<Race>
    type C = Record<Culture>
    type P = Record<Profession>

    return pipe_ (
      maybeProfession,
      // tslint:disable-next-line: cyclomatic-complexity
      liftM3 ((race: R) => (culture: C) => (profession: P) => {
               const attributeAdjustmentSelection = Race.A.attributeAdjustmentsSelection (race)
               const attributeAdjustmentValue = fst (attributeAdjustmentSelection)
               const signed_attr_ajst_val = sign (attributeAdjustmentValue)

               const isMotherTongueSelectionNeeded = flength (Culture.A.languages (culture)) > 1

               const scriptsListLength = flength (Culture.A.scripts (culture))

               /**
                * `Tuple.fst` &ndash if the culture has any script
                *
                * `Tuple.snd` &ndash if the culture has multiple possible scripts
                */
               const isScriptSelectionNeeded = Pair (scriptsListLength > 0, scriptsListLength > 1)

               const prof_sels = getAllAdjustmentSelections (profession) (maybeProfessionVariant)

               const isAnyLanguageOrScriptSelected = size (languages) > 0 || size (scripts) > 0

               const buyScriptElement = getBuyScriptElement (l10n)
                                                            (wiki)
                                                            (culture)
                                                            (isScriptSelectionNeeded)
                                                            (isBuyingMainScriptEnabled)
                                                            (isAnyLanguageOrScriptSelected)
                                                            (this.switchIsBuyingMainScriptEnabled)

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
                                                            (this.adjustLanguage)
                                                            (this.adjustScript)

               const curses = getCursesElementAndValidation (l10n)
                                                            (wiki)
                                                            (rules)
                                                            (cursesActive)
                                                            (this.adjustCurse)
                                                            (prof_sels)

               // Tuple.fst: isValidSelection
               const combatTechniques =
                 getCombatTechniquesElementAndValidation (l10n)
                                                         (wiki)
                                                         (combatTechniquesActive)
                                                         (combatTechniquesSecondActive)
                                                         (this.switchCombatTechnique)
                                                         (prof_sels)

               // Tuple.fst: isValidSelection
               const combatTechniquesSecond =
                 getCombatTechniquesSecondElementAndValidation (l10n)
                                                               (wiki)
                                                               (combatTechniquesActive)
                                                               (combatTechniquesSecondActive)
                                                               (this.switchSecondCombatTechnique)
                                                               (prof_sels)

               // Tuple.fst: isValidSelection
               const cantrips = getCantripsElementAndValidation (l10n)
                                                                (wiki)
                                                                (cantripsActive)
                                                                (this.switchCantrip)
                                                                (prof_sels)

               const skillSpecialization =
                getSkillSpecializationElement (l10n)
                                              (wiki)
                                              (specialization)
                                              (specializationSkillId)
                                              (this.setSpecialization)
                                              (this.setSpecializationSkill)
                                              (prof_sels)

               const skills = getSkillsElementAndValidation (l10n)
                                                            (wiki)
                                                            (skillsActive)
                                                            (this.addSkillPoint)
                                                            (this.removeSkillPoint)
                                                            (prof_sels)

               const terrainKnowledge = getTerrainKnowledgeElement (wiki)
                                                                   (terrainKnowledgeActive)
                                                                   (this.setTerrainKnowledge)
                                                                   (prof_sels)

               const guildMageUnfamiliarSpell =
                 getGuildMageUnfamiliarSpellSelectionElement (l10n)
                                                             (munfamiliar_spells)
                                                             (selectedUnfamiliarSpell)
                                                             (this.setGuildMageUnfamiliarSpellId)
                                                             (profession)

               return (
                 <Slidein isOpen close={close} className="rcp-selections">
                   <Scroll>
                     <h3>{translate (l10n) ("race")}</h3>
                     <Dropdown
                       hint={translate (l10n) ("selectattributeadjustment")}
                       value={attributeAdjustment}
                       onChangeJust={this.setAttributeAdjustment}
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
                       onClick={this.switchIsCulturalPackageEnabled}
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
                                                      (this.setMotherTongue)}
                     {maybeToNullable (buyScriptElement)}
                     {getMainScriptSelectionElement (l10n)
                                                    (wiki)
                                                    (culture)
                                                    (isScriptSelectionNeeded)
                                                    (mainScript)
                                                    (isAnyLanguageOrScriptSelected)
                                                    (isBuyingMainScriptEnabled)
                                                    (this.setMainCulturalLiteracy)}
                     {pipe_ (
                       profession,
                       Profession.A.id,
                       notEquals<string> (ProfessionId.CustomProfession)
                     )
                       ? <h3>{translate (l10n) ("profession")}</h3>
                       : null}
                     {maybeToNullable (skillSpecialization)}
                     {maybeToNullable (fmapF (languagesAndScripts) (snd))}
                     {maybeToNullable (fmapF (combatTechniques) (snd))}
                     {maybeToNullable (fmapF (combatTechniquesSecond) (snd))}
                     {maybeToNullable (fmapF (curses) (snd))}
                     {maybeToNullable (guildMageUnfamiliarSpell)}
                     {maybeToNullable (fmapF (cantrips) (snd))}
                     {maybeToNullable (fmapF (skills) (snd))}
                     {maybeToNullable (terrainKnowledge)}
                     <BorderButton
                       label={translate (l10n) ("complete")}
                       primary
                       disabled={
                         attributeAdjustment === "ATTR_0"
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
                         || or (fmapF (curses) (pipe (fst, lt (0))))
                         || or (fmapF (combatTechniques) (pipe (fst, not)))
                         || or (fmapF (combatTechniquesSecond) (pipe (fst, not)))
                         || or (fmapF (cantrips) (pipe (fst, not)))
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
                       onClick={this.assignRCPEntries.bind (null, prof_sels)}
                       />
                   </Scroll>
                 </Slidein>
               )
        })
        (maybeRace)
        (maybeCulture),
      maybeToNullable
    )
  }
}
