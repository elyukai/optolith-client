import { on } from "@elyukai/utils/function"
import { compareNumber, reduceCompare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { compareImprovementCost } from "@optolith/adventure-points/improvement-cost"
import { observer } from "mobx-react"
import { type FC, useCallback, useMemo, useState } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { Grid } from "../../../../../shared/components/grid/Grid.tsx"
import { List } from "../../../../../shared/components/list/List.tsx"
import { ListHeader } from "../../../../../shared/components/list/ListHeader.tsx"
import { ListHeaderTag } from "../../../../../shared/components/list/ListHeaderTag.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { RadioButtonGroup } from "../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { RecommendedReference } from "../../../../../shared/components/recommendedReference/RecommendedReference.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import type { DisplayedSkill } from "../../../../../shared/domain/rated/skill.ts"
import { SkillsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { SharedState } from "../../../../external.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary, InlineLibraryManager } from "../../../../inlineLibrary/InlineLibrary.tsx"
import {
  changeSkillsSortOrder,
  selectSkillsCultureRatingVisibility,
  selectSkillsSortOrder,
  switchSkillsCultureRatingVisibility,
} from "../../../../slices/settingsSlice.ts"
import { SkillListItem } from "./SkillListItem.tsx"
import "./Skills.scss"

const isTopMarginNeeded = (
  sortOrder: SkillsSortOrder,
  curr: DisplayedSkill,
  mprev: DisplayedSkill | undefined,
) => sortOrder === "group" && mprev !== undefined && curr.groupPosition !== mprev.groupPosition

/**
 * Returns a page for managing skills.
 */
export const Skills: FC = observer(() => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const cultureRatingVisibility = useAppSelector(selectSkillsCultureRatingVisibility)
  const handlSwitchCultureRatingVisibility = useCallback(
    () => dispatch(switchSkillsCultureRatingVisibility()),
    [dispatch],
  )

  const { canRemove, skills: visibleSkills, attributes } = SharedState

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectSkillsSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: SkillsSortOrder) => dispatch(changeSkillsSortOrder(id)),
    [dispatch],
  )

  const list = useMemo(
    () =>
      visibleSkills
        .filter(
          c =>
            translateMap(c.translations)?.name.toLowerCase().includes(filterText.toLowerCase()) ??
            false,
        )
        .sort(
          (() => {
            switch (sortOrder) {
              case SkillsSortOrder.Name:
                return on(c => translateMap(c.translations)?.name ?? "", localeCompare)
              case SkillsSortOrder.Group:
                return reduceCompare(
                  on(c => c.groupPosition, compareNumber),
                  on(c => translateMap(c.translations)?.name ?? "", localeCompare),
                )
              case SkillsSortOrder.ImprovementCost:
                return reduceCompare(
                  on(c => c.improvementCost, compareImprovementCost),
                  on(c => translateMap(c.translations)?.name ?? "", localeCompare),
                )
              default:
                return assertExhaustive(sortOrder)
            }
          })(),
        ),
    [filterText, localeCompare, sortOrder, translateMap, visibleSkills],
  )

  return (
    <Page id="skills">
      <Options>
        <TextField value={filterText} onChange={setFilterText} hint={translate("Search")} />
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
        <Grid size="medium">
          <Checkbox checked={cultureRatingVisibility} onClick={handlSwitchCultureRatingVisibility}>
            {translate("Common Skills")}
          </Checkbox>
          {cultureRatingVisibility ? <RecommendedReference /> : null}
        </Grid>
      </Options>
      <Main>
        <ListHeader>
          <ListHeaderTag className="name">{translate("Name")}</ListHeaderTag>
          <ListHeaderTag className="group">{translate("Group")}</ListHeaderTag>
          <ListHeaderTag className="value" hint={translate("Skill Rating")}>
            {translate("SR")}
          </ListHeaderTag>
          <ListHeaderTag className="check">{translate("Check")}</ListHeaderTag>
          <ListHeaderTag className="ic" hint={translate("Improvement Cost")}>
            {translate("IC")}
          </ListHeaderTag>
          {canRemove ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll stable>
          {list.length > 0 ? (
            <List>
              {list.map((x, i) => (
                <SkillListItem
                  key={x.id}
                  canRemove={canRemove}
                  insertTopMargin={isTopMarginNeeded(sortOrder, x, list[i - 1])}
                  skill={x}
                  attributes={attributes}
                  selectedInlineLibraryEntryId={InlineLibraryManager.instance.current}
                />
              ))}
            </List>
          ) : (
            <ListPlaceholder type="skills" message={translate("No Results")} />
          )}
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
})
