import { FC, useCallback, useState } from "react"
import { ListHeader } from "../../../../../shared/components/list/ListHeader.tsx"
import { ListHeaderTag } from "../../../../../shared/components/list/ListHeaderTag.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { RadioButtonGroup } from "../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { SkillsSortOrder } from "../../../../../shared/schema/config.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import { changeSkillsSortOrder, selectSkillsSortOrder } from "../../../../slices/settingsSlice.ts"
import "./Skills.scss"

// const isTopMarginNeeded =
//   (sortOrder: string) =>
//   (curr: Element) =>
//   (mprev: Maybe<Element>) =>
//     sortOrder === "group"
//     && maybe (false) (pipe (SWRA_.gr, notEquals (SWRA_.gr (curr)))) (mprev)

// export interface SkillsOwnProps {
//   staticData: StaticDataRecord
//   hero: HeroModelRecord
// }

// export interface SkillsStateProps {
//   attributes: List<Record<AttributeCombined>>
//   list: Maybe<List<Record<SkillWithRequirements>>>
//   isRemovingEnabled: boolean
//   sortOrder: SortNames
//   filterText: string
//   ratingVisibility: boolean
//   skillRating: OrderedMap<string, EntryRating>
// }

// export interface SkillsDispatchProps {
//   setSortOrder (sortOrder: SortNames): void
//   setFilterText (filterText: string): void
//   switchRatingVisibility (): void
//   addPoint (id: string): void
//   removePoint (id: string): void
// }

// type Props = SkillsStateProps & SkillsDispatchProps & SkillsOwnProps

// export interface SkillsState {
//   infoId: Maybe<string>
// }

export const Skills: FC = () => {
  // const {
  //   addPoint,
  //   attributes,
  //   staticData,
  //   isRemovingEnabled,
  //   ratingVisibility: is_rating_visible,
  //   removePoint,
  //   setSortOrder,
  //   sortOrder,
  //   switchRatingVisibility,
  //   skillRating,
  //   list,
  //   filterText,
  //   setFilterText,
  // } = props

  const translate = useTranslate()
  const dispatch = useAppDispatch()

  const canRemove = useAppSelector(selectCanRemove)

  const [ filterText, setFilterText ] = useState("")
  const sortOrder = useAppSelector(selectSkillsSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: SkillsSortOrder) => dispatch(changeSkillsSortOrder(id)),
    [ dispatch ]
  )

  // const showInfo = React.useCallback(
  //   (id: string) => setInfoId(Just(id)),
  //   [ setInfoId ]
  // )

  return (
    <Page id="skills">
      <Options>
        <TextField
          value={filterText}
          onChange={setFilterText}
          hint={translate("Search")}
          />
        <RadioButtonGroup
          active={sortOrder}
          label={translate("Sort By")}
          array={[
            {
              name: translate("Name"),
              value: SkillsSortOrder.Name,
            },
            {
              name: translate("Group"),
              value: SkillsSortOrder.Group,
            },
            {
              name: translate("Improvement Cost"),
              value: SkillsSortOrder.ImprovementCost,
            },
          ]}
          onClick={handleChangeSortOrder}
          />
        {/* <Checkbox
          checked={is_rating_visible}
          onClick={switchRatingVisibility}
          >
          {translate("skills.commonskills")}
        </Checkbox> */}
        {/* {is_rating_visible ? <RecommendedReference staticData={staticData} /> : null} */}
      </Options>
      <Main>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate("skills.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate("skills.header.group")}
          </ListHeaderTag>
          <ListHeaderTag
            className="value"
            hint={translate("skills.header.skillrating.tooltip")}
            >
            {translate("skills.header.skillrating")}
          </ListHeaderTag>
          <ListHeaderTag className="check">
            {translate("skills.header.check")}
          </ListHeaderTag>
          <ListHeaderTag
            className="ic"
            hint={translate("skills.header.improvementcost.tooltip")}
            >
            {translate("skills.header.improvementcost")}
          </ListHeaderTag>
          {canRemove ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll>
          {/* <List>
            {pipe_(
              list,
              bindF(ensure(notNull)),
              fmap(pipe(
                mapAccumL((mprev: Maybe<Element>) => (curr: Element) =>
                            Pair<Maybe<Element>, JSX.Element>(
                              Just(curr),
                              (
                                <SkillListItem
                                  key={SWRA_.id(curr)}
                                  id={SWRA_.id(curr)}
                                  typ={
                                    is_rating_visible
                                    && isSkillCommon(skillRating)(SWRA.wikiEntry(curr))
                                  }
                                  untyp={
                                    is_rating_visible
                                    && isSkillUncommon(skillRating)(SWRA.wikiEntry(curr))
                                  }
                                  name={SWRA_.name(curr)}
                                  sr={SWRA_.value(curr)}
                                  check={SWRA_.check(curr)}
                                  ic={SWRA_.ic(curr)}
                                  addDisabled={!SWRA.isIncreasable(curr)}
                                  addPoint={addPoint}
                                  removeDisabled={!isRemovingEnabled || !SWRA.isDecreasable(curr)}
                                  removePoint={removePoint}
                                  addFillElement
                                  insertTopMargin={isTopMarginNeeded(sortOrder)(curr)(mprev)}
                                  attributes={attributes}
                                  staticData={staticData}
                                  isRemovingEnabled={isRemovingEnabled}
                                  selectForInfo={showInfo}
                                  group={SWRA_.gr(curr)}
                                  getGroupName={pipe(
                                    lookupF(StaticData.A.skillGroups(staticData)),
                                    maybe("")(SkillGroup.A.name)
                                  )}
                                  selectedForInfo={infoId}
                                  />
                              )
                            ))
                          (Nothing),
                snd,
                toArray,
                arr => <>{arr}</>
              )),
              fromMaybe(<ListPlaceholder staticData={staticData} type="skills" noResults />)
            )}
          </List> */}
          <ListPlaceholder type="skills" message={translate("No Results")} />
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
}
