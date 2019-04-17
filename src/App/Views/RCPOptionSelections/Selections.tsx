import * as React from "react";
import { Selections as SelectionsInterface } from "../../Models/Hero/heroTypeHelpers";
import { AnyProfessionSelection, Culture, Profession, ProfessionSelectionIds, ProfessionVariant, Race, WikiAll } from "../../Models/Wiki/wikiTypeHelpers";
import { translate, UIMessagesObject } from "../../Utilities/I18n";
import { sign } from "../../Utilities/NumberUtils";
import { getAllAdjustmentSelections, getBuyScriptElement, getCantripsElementAndValidation, getCombatTechniquesElementAndValidation, getCombatTechniquesSecondElementAndValidation, getCursesElementAndValidation, getLanguagesAndScriptsElementAndValidation, getMainScriptSelectionElement, getMotherTongueSelectionElement, getSkillsElementAndValidation, getSkillSpecializationElement, getTerrainKnowledgeElement } from "../../Utilities/rcpAdjustmentSelectionUtils";
import { BorderButton } from "../Universal/BorderButton";
import { Checkbox } from "../Universal/Checkbox";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { Scroll } from "../Universal/Scroll";
import { Slidein } from "../Universal/Slidein";

export interface SelectionsOwnProps {
  locale: UIMessagesObject
  close (): void
}

export interface SelectionsStateProps {
  currentRace: Maybe<Record<Race>>
  currentCulture: Maybe<Record<Culture>>
  currentProfession: Maybe<Record<Profession>>
  currentProfessionVariant: Maybe<Record<ProfessionVariant>>
  wiki: Record<WikiAll>
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
  specialization: Tuple<Maybe<number>, string> // first: selection id second: user input
  specializationSkillId: Maybe<string>
  terrainKnowledge: Maybe<number>
}

export class Selections extends React.Component<SelectionsProps, SelectionsState> {
  state: SelectionsState = {
    attributeAdjustment: "ATTR_0",
    isBuyingMainScriptEnabled: false,
    cantrips: OrderedSet.empty (),
    combatTechniquesSecond: OrderedSet.empty (),
    combatTechniques: OrderedSet.empty (),
    curses: OrderedMap.empty (),
    motherTongue: 0,
    languages: OrderedMap.empty (),
    scripts: OrderedMap.empty (),
    mainScript: 0,
    skills: OrderedMap.empty (),
    specialization: Tuple.of<Maybe<number>, string> (Nothing ()) (""),
    specializationSkillId: Nothing (),
    terrainKnowledge: Nothing (),
    useCulturePackage: false,
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

  adjustCurse = (id: string) => (maybeOption: Maybe<"add" | "remove">) => {
    if (Maybe.isJust (maybeOption)) {
      const option = Maybe.fromJust (maybeOption)

      if (option === "add") {
        this.setState (prevState => ({ curses: prevState .curses .adjust (R.inc) (id) }))
      }
      else {
        this.setState (prevState => ({ curses: prevState .curses .adjust (R.dec) (id) }))
      }
    }
    else {
      this.setState (
        prevState => ({
          curses: prevState .curses .alter (maybe => Maybe.isJust (maybe) ? Nothing () : Just (0))
                                           (id),
        })
      )
    }
  }

  adjustLanguage = (id: number) => (level: Maybe<number>) =>
    this.setState (prevState => ({ languages: prevState .languages .alter (() => level) (id) }))

  adjustScript = (id: number) => (ap: number) =>
    this.setState (
      prevState => ({
        scripts: prevState .scripts .alter (maybe => Maybe.isJust (maybe) ? Nothing () : Just (ap))
                                           (id),
      })
    )

  setSpecializationSkill = (id: string) => {
    this.setState ({
      specializationSkillId: Just (id),
      specialization: Tuple.of<Maybe<number>, string> (Nothing ()) (""),
    })
  }

  setSpecialization = (value: number | string) => {
    this.setState (
      prevState => ({
        specialization: typeof value === "number"
          ? Tuple.first<Maybe<number>, string> (() => Just (value))
                                               (prevState .specialization)
          : Tuple.second<Maybe<number>, string> (() => value)
                                                (prevState .specialization),
      })
    )
  }

  addSkillPoint = (id: string) =>
    this.setState (
      prevState => ({
        skills: prevState .skills
          .alter (
                   skill => this .props .wiki .get ("skills") .lookup (id)
                     .fmap (
                       wikiSkill => Maybe.fromMaybe (0) (skill) + wikiSkill .get ("ic")
                     )
                 )
                 (id),
      })
    )

  removeSkillPoint = (id: string) =>
    this.setState (
      prevState => ({
        skills: prevState .skills
          .alter (
                   skill => this .props .wiki .get ("skills") .lookup (id)
                     .bind (
                       wikiSkill => Maybe.elem (wikiSkill .get ("ic")) (skill)
                         ? Nothing ()
                         : skill .fmap (R.add (-wikiSkill .get ("ic")))
                     )
                 )
                 (id),
      })
    )

  setTerrainKnowledge = (terrainKnowledge: number) =>
    this.setState ({ terrainKnowledge: Just (terrainKnowledge) })

  assignRCPEntries = (selMap: OrderedMap<ProfessionSelectionIds, AnyProfessionSelection>) => {
    this.props.setSelections ({
      ...this.state,
      map: selMap,
      specialization: Tuple.snd (this.state.specialization) .length > 0
        ? Just (Tuple.snd (this.state.specialization))
        : Tuple.fst (this.state.specialization),
    })
  }

  render () {
    const {
      close,
      currentCulture: maybeCulture,
      currentProfession: maybeProfession,
      currentProfessionVariant: maybeProfessionVariant,
      currentRace: maybeRace,
      locale,
      wiki,
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
    } = this.state

    return Maybe.maybeToReactNode (
      Maybe.liftM3<Record<Race>, Record<Culture>, Record<Profession>, JSX.Element>
        (race => culture => profession => {
          const attributeAdjustmentValue = Tuple.fst (race .get ("attributeAdjustmentsSelection"))

          const isMotherTongueSelectionNeeded = culture .get ("languages") .length () > 1

          const scriptsListLength = culture .get ("scripts") .length ()

          /**
           * `Tuple.fst` &ndash if the culture has any script
           *
           * `Tuple.snd` &ndash if the culture has multiple possible scripts
           */
          const isScriptSelectionNeeded =
            Tuple.of<boolean, boolean> (scriptsListLength > 0) (scriptsListLength > 1)

          const professionSelections = getAllAdjustmentSelections (profession)
                                                                  (maybeProfessionVariant)

          const isAnyLanguageOrScriptSelected = languages .size () > 0 || scripts .size () > 0

          const buyScriptElement = getBuyScriptElement (locale)
                                                       (wiki)
                                                       (culture)
                                                       (isScriptSelectionNeeded)
                                                       (isBuyingMainScriptEnabled)
                                                       (isAnyLanguageOrScriptSelected)
                                                       (this.switchIsBuyingMainScriptEnabled)

          const languagesAndScripts =
            getLanguagesAndScriptsElementAndValidation (locale)
                                                       (wiki)
                                                       (culture)
                                                       (languages)
                                                       (scripts)
                                                       (professionSelections)
                                                       (mainScript)
                                                       (motherTongue)
                                                       (isBuyingMainScriptEnabled)
                                                       (isMotherTongueSelectionNeeded)
                                                       (isScriptSelectionNeeded)
                                                       (this.adjustLanguage)
                                                       (this.adjustScript)

          const curses = getCursesElementAndValidation (locale)
                                                       (wiki)
                                                       (professionSelections)
                                                       (cursesActive)
                                                       (this.adjustCurse)

          // Tuple.fst: isValidSelection
          const combatTechniques =
            getCombatTechniquesElementAndValidation (locale)
                                                    (wiki)
                                                    (professionSelections)
                                                    (combatTechniquesActive)
                                                    (combatTechniquesSecondActive)
                                                    (this.switchCombatTechnique)

          // Tuple.fst: isValidSelection
          const combatTechniquesSecond =
            getCombatTechniquesSecondElementAndValidation (locale)
                                                          (wiki)
                                                          (professionSelections)
                                                          (combatTechniquesActive)
                                                          (combatTechniquesSecondActive)
                                                          (this.switchSecondCombatTechnique)

          // Tuple.fst: isValidSelection
          const cantrips = getCantripsElementAndValidation (locale)
                                                           (wiki)
                                                           (professionSelections)
                                                           (cantripsActive)
                                                           (this.switchCantrip)

          const skillSpecialization = getSkillSpecializationElement (locale)
                                                                    (wiki)
                                                                    (professionSelections)
                                                                    (specialization)
                                                                    (specializationSkillId)
                                                                    (this.setSpecialization)
                                                                    (this.setSpecializationSkill)

          const skills = getSkillsElementAndValidation (locale)
                                                       (wiki)
                                                       (professionSelections)
                                                       (skillsActive)
                                                       (this.addSkillPoint)
                                                       (this.removeSkillPoint)

          const terrainKnowledge = getTerrainKnowledgeElement (wiki)
                                                              (professionSelections)
                                                              (terrainKnowledgeActive)
                                                              (this.setTerrainKnowledge)

          return (
            <Slidein isOpened close={close} className="rcp-selections">
              <Scroll>
                <h3>{translate (locale, "titlebar.tabs.race")}</h3>
                <Dropdown
                  hint={translate (locale, "rcpselections.labels.selectattributeadjustment")}
                  value={attributeAdjustment}
                  onChangeJust={this.setAttributeAdjustment}
                  options={
                    Maybe.mapMaybe<string, Record<DropdownOption>>
                      (R.pipe (
                        OrderedMap.lookup_ (wiki .get ("attributes")),
                        Maybe.fmap (
                          attribute => Record.of<DropdownOption> ({
                            id: attribute .get ("id"),
                            name: `${attribute .get ("name")} ${sign (attributeAdjustmentValue)}`,
                          })
                        )
                      ))
                      (Tuple.snd (race .get ("attributeAdjustmentsSelection")))
                  }
                  />

                <h3>{translate (locale, "titlebar.tabs.culture")}</h3>
                <Checkbox
                  checked={useCulturePackage}
                  onClick={this.switchIsCulturalPackageEnabled}
                  >
                  {translate (locale, "rcpselections.labels.buyculturalpackage")}
                  {" ("}
                  {culture .get ("culturalPackageAdventurePoints")}
                  {" AP)"}
                </Checkbox>
                {
                  getMotherTongueSelectionElement (locale)
                                                  (wiki)
                                                  (culture)
                                                  (isMotherTongueSelectionNeeded)
                                                  (motherTongue)
                                                  (isAnyLanguageOrScriptSelected)
                                                  (this.setMotherTongue)
                }
                {Maybe.maybeToReactNode (buyScriptElement)}
                {
                  getMainScriptSelectionElement (locale)
                                                (wiki)
                                                (culture)
                                                (isScriptSelectionNeeded)
                                                (mainScript)
                                                (isAnyLanguageOrScriptSelected)
                                                (isBuyingMainScriptEnabled)
                                                (this.setMainCulturalLiteracy)
                }

                {
                  profession .get ("id") !== "P_0"
                  && <h3>{translate (locale, "titlebar.tabs.profession")}</h3>
                }
                {Maybe.maybeToReactNode (skillSpecialization)}
                {Maybe.maybeToReactNode (languagesAndScripts .fmap (Tuple.snd))}
                {Maybe.maybeToReactNode (combatTechniques .fmap (Tuple.snd))}
                {Maybe.maybeToReactNode (combatTechniquesSecond .fmap (Tuple.snd))}
                {Maybe.maybeToReactNode (curses .fmap (Tuple.snd))}
                {Maybe.maybeToReactNode (cantrips .fmap (Tuple.snd))}
                {Maybe.maybeToReactNode (skills .fmap (Tuple.snd))}
                {Maybe.maybeToReactNode (terrainKnowledge)}
                <BorderButton
                  label={translate (locale, "rcpselections.actions.complete")}
                  primary
                  disabled={
                    attributeAdjustment === "ATTR_0"
                    || (isMotherTongueSelectionNeeded && motherTongue === 0)
                    || (
                      isBuyingMainScriptEnabled
                      && Tuple.snd (isScriptSelectionNeeded)
                      && mainScript === 0
                    )
                    || (
                      professionSelections .member ("SPECIALISATION")
                      && Tuple.snd (specialization) === ""
                      && Maybe.isNothing (Tuple.fst (specialization))
                    )
                    || Maybe.elem (true) (languagesAndScripts .fmap (R.pipe (Tuple.fst, R.lt (0))))
                    || Maybe.elem (true) (curses .fmap (R.pipe (Tuple.fst, R.lt (0))))
                    || Maybe.elem (true) (combatTechniques .fmap (R.pipe (Tuple.fst, R.not)))
                    || Maybe.elem (true) (combatTechniquesSecond .fmap (R.pipe (Tuple.fst, R.not)))
                    || Maybe.elem (true) (cantrips .fmap (R.pipe (Tuple.fst, R.not)))
                    || Maybe.elem (true) (skills .fmap (R.pipe (Tuple.fst, R.lt (0))))
                    || (
                      professionSelections .member ("TERRAIN_KNOWLEDGE")
                      && Maybe.isNothing (terrainKnowledgeActive)
                    )
                  }
                  onClick={this.assignRCPEntries.bind (null, professionSelections)}
                  />
              </Scroll>
            </Slidein>
          )
        })
        (maybeRace)
        (maybeCulture)
        (maybeProfession)
    )
  }
}
