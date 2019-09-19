import * as React from "react";
import { equals } from "../../../Data/Eq";
import { fmapF } from "../../../Data/Functor";
import { find, flength, intercalate, List, map, notNull, toArray } from "../../../Data/List";
import { bindF, ensure, fromMaybe, Just, listToMaybe, mapMaybe, Maybe, maybe, Nothing } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined";
import { CombatTechniqueWithRequirements, CombatTechniqueWithRequirementsA_ } from "../../Models/View/CombatTechniqueWithRequirements";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { ndash } from "../../Utilities/Chars";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { SkillListItem } from "../Skills/SkillListItem";
import { ListView } from "../Universal/List";
import { ListHeader } from "../Universal/ListHeader";
import { ListHeaderTag } from "../Universal/ListHeaderTag";
import { ListPlaceholder } from "../Universal/ListPlaceholder";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { SortNames, SortOptions } from "../Universal/SortOptions";
import { TextField } from "../Universal/TextField";

export interface CombatTechniquesOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface CombatTechniquesStateProps {
  attributes: List<Record<AttributeCombined>>
  list: Maybe<List<Record<CombatTechniqueWithRequirements>>>
  isRemovingEnabled: boolean
  sortOrder: SortNames
  filterText: string
}

export interface CombatTechniquesDispatchProps {
  setSortOrder (sortOrder: SortNames): void
  addPoint (id: string): void
  removePoint (id: string): void
  setFilterText (filterText: string): void
}

export type CombatTechniquesProps =
  CombatTechniquesStateProps
  & CombatTechniquesDispatchProps
  & CombatTechniquesOwnProps

export interface CombatTechniquesState {
  infoId: Maybe<string>
}

const ACA_ = AttributeCombinedA_
const CTWRA = CombatTechniqueWithRequirements.A
const CTWRA_ = CombatTechniqueWithRequirementsA_

export class CombatTechniques
  extends React.Component<CombatTechniquesProps, CombatTechniquesState> {
  state: CombatTechniquesState = {
    infoId: Nothing,
  }

  showInfo = (id: string) => this.setState ({ infoId: Just (id) })

  render () {
    const {
      addPoint,
      attributes,
      list,
      l10n,
      isRemovingEnabled,
      removePoint,
      setSortOrder,
      sortOrder,
      filterText,
      setFilterText,
    } = this.props

    const { infoId } = this.state

    return (
      <Page id="combattechniques">
        <Options>
          <TextField
            hint={translate (l10n) ("search")}
            value={filterText}
            onChange={setFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            l10n={l10n}
            options={List<SortNames> ("name", "group", "ic")}
            />
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (l10n) ("name")}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (l10n) ("group")}
              </ListHeaderTag>
            <ListHeaderTag className="value" hint={translate (l10n) ("skillrating")}>
              {translate (l10n) ("skillrating.short")}
            </ListHeaderTag>
            <ListHeaderTag className="ic" hint={translate (l10n) ("improvementcost")}>
              {translate (l10n) ("improvementcost.short")}
            </ListHeaderTag>
            <ListHeaderTag className="primary" hint={translate (l10n) ("primaryattribute")}>
              {translate (l10n) ("primaryattribute.short")}
            </ListHeaderTag>
            <ListHeaderTag className="at" hint={translate (l10n) ("attack")}>
              {translate (l10n) ("attack.short")}
            </ListHeaderTag>
            <ListHeaderTag className="pa" hint={translate (l10n) ("parry")}>
              {translate (l10n) ("parry.short")}
            </ListHeaderTag>
            {isRemovingEnabled ? <ListHeaderTag className="btn-placeholder" /> : null}
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <Scroll>
            <ListView>
              {pipe_ (
                list,
                bindF (ensure (notNull)),
                maybe<JSX.Element | JSX.Element[]>
                  (<ListPlaceholder l10n={l10n} type="combatTechniques" noResults />)
                  (pipe (
                    map (
                      (x: Record<CombatTechniqueWithRequirements>) => {
                        const primary =
                          pipe_ (
                            CTWRA_.primary (x),
                            mapMaybe ((id: string) => fmapF (find (pipe (ACA_.id, equals (id)))
                                                                  (attributes))
                                                            (ACA_.short)),
                            intercalate ("/")
                          )

                        const customClassName =
                          flength (CTWRA_.primary (x)) > 1
                            ? "ATTR_6_8"
                            : fromMaybe ("") (listToMaybe (CTWRA_.primary (x)))

                        const primaryClassName = `primary ${customClassName}`

                        return (
                          <SkillListItem
                            key={CTWRA_.id (x)}
                            id={CTWRA_.id (x)}
                            name={CTWRA_.name (x)}
                            sr={CTWRA_.value (x)}
                            ic={CTWRA_.ic (x)}
                            checkDisabled
                            addPoint={addPoint.bind (null, CTWRA_.id (x))}
                            addDisabled={CTWRA_.value (x) >= CTWRA.max (x)}
                            removePoint={
                              isRemovingEnabled
                                ? removePoint.bind (null, CTWRA_.id (x))
                                : undefined
                            }
                            removeDisabled={CTWRA_.value (x) <= CTWRA.min (x)}
                            addValues={List (
                              { className: primaryClassName, value: primary },
                              { className: "at", value: CTWRA.at (x) },
                              { className: "atpa" },
                              {
                                className: "pa",
                                value: fromMaybe<string | number> (ndash) (CTWRA.pa (x)),
                              }
                            )}
                            attributes={attributes}
                            l10n={l10n}
                            selectForInfo={this.showInfo}
                            groupIndex={CTWRA_.gr (x)}
                            groupList={translate (l10n) ("combattechniquegroups")}
                            selectedForInfo={infoId}
                            />
                        )
                      }
                    ),
                    toArray
                  ))
              )}
            </ListView>
          </Scroll>
        </MainContent>
        <WikiInfoContainer {...this.props} currentId={infoId}/>
      </Page>
    )
  }
}
