import { FC, useCallback, useMemo, useState } from "react"
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
import {
  compareImprovementCost,
  fromRaw,
} from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { SkillsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { compareAt, numAsc, reduceCompare } from "../../../../../shared/utils/compare.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import { DisplayedSkill, selectVisibleSkills } from "../../../../selectors/skillsSelectors.ts"
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
) =>
  sortOrder === "group" &&
  mprev !== undefined &&
  curr.static.group.id.skill_group !== mprev.static.group.id.skill_group

/**
 * Returns a page for managing skills.
 */
export const Skills: FC = () => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const cultureRatingVisibility = useAppSelector(selectSkillsCultureRatingVisibility)
  const handlSwitchCultureRatingVisibility = useCallback(
    () => dispatch(switchSkillsCultureRatingVisibility()),
    [dispatch],
  )

  const canRemove = useAppSelector(selectCanRemove)

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectSkillsSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: SkillsSortOrder) => dispatch(changeSkillsSortOrder(id)),
    [dispatch],
  )

  const visibleSkills = useAppSelector(selectVisibleSkills)

  const list = useMemo(
    () =>
      visibleSkills
        .filter(
          c =>
            translateMap(c.static.translations)
              ?.name.toLowerCase()
              .includes(filterText.toLowerCase()) ?? false,
        )
        .sort(
          (() => {
            switch (sortOrder) {
              case SkillsSortOrder.Name:
                return compareAt(
                  c => translateMap(c.static.translations)?.name ?? "",
                  localeCompare,
                )
              case SkillsSortOrder.Group:
                return reduceCompare(
                  compareAt(c => c.static.group.id.skill_group, numAsc),
                  compareAt(c => translateMap(c.static.translations)?.name ?? "", localeCompare),
                )
              case SkillsSortOrder.ImprovementCost:
                return reduceCompare(
                  compareAt(c => fromRaw(c.static.improvement_cost), compareImprovementCost),
                  compareAt(c => translateMap(c.static.translations)?.name ?? "", localeCompare),
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
                  key={x.static.id}
                  insertTopMargin={isTopMarginNeeded(sortOrder, x, list[i - 1])}
                  skill={x}
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
}
