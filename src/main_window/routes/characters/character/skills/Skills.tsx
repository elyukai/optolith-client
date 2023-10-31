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
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { compareAt, numAsc, reduceCompare } from "../../../../../shared/utils/compare.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import { DisplayedSkill, selectVisibleSkills } from "../../../../selectors/skillsSelectors.ts"
import { selectStaticSkillGroups } from "../../../../slices/databaseSlice.ts"
import {
  SkillsSortOrder,
  changeSkillsSortOrder,
  selectSkillsCultureRatingVisibility,
  selectSkillsSortOrder,
  switchSkillsCultureRatingVisibility,
} from "../../../../slices/settingsSlice.ts"
import { decrementSkill, incrementSkill } from "../../../../slices/skillsSlice.ts"
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
  const skillGroups = useAppSelector(selectStaticSkillGroups)

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

  const handleAdd = useCallback((id: number) => dispatch(incrementSkill(id)), [dispatch])

  const handleRemove = useCallback((id: number) => dispatch(decrementSkill(id)), [dispatch])

  const getGroupName = useCallback(
    (id: number) => translateMap(skillGroups[id]?.translations)?.name ?? "",
    [skillGroups, translateMap],
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
            {translate("skills.commonskills")}
          </Checkbox>
          {cultureRatingVisibility ? <RecommendedReference /> : null}
        </Grid>
      </Options>
      <Main>
        <ListHeader>
          <ListHeaderTag className="name">{translate("skills.header.name")}</ListHeaderTag>
          <ListHeaderTag className="group">{translate("skills.header.group")}</ListHeaderTag>
          <ListHeaderTag className="value" hint={translate("skills.header.skillrating.tooltip")}>
            {translate("skills.header.skillrating")}
          </ListHeaderTag>
          <ListHeaderTag className="check">{translate("skills.header.check")}</ListHeaderTag>
          <ListHeaderTag className="ic" hint={translate("skills.header.improvementcost.tooltip")}>
            {translate("skills.header.improvementcost")}
          </ListHeaderTag>
          {canRemove ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll stable>
          {list.length > 0 ? (
            <List>
              {list.map((x, i) => {
                const translation = translateMap(x.static.translations)
                return (
                  <SkillListItem
                    key={x.static.id}
                    id={x.static.id}
                    typ={cultureRatingVisibility && x.commonness === "common"}
                    untyp={cultureRatingVisibility && x.commonness === "uncommon"}
                    name={translation?.name ?? ""}
                    sr={x.dynamic.value}
                    check={x.static.check}
                    ic={fromRaw(x.static.improvement_cost)}
                    addDisabled={!x.isIncreasable}
                    addPoint={handleAdd}
                    removeDisabled={!x.isDecreasable}
                    removePoint={handleRemove}
                    addFillElement
                    insertTopMargin={isTopMarginNeeded(sortOrder, x, list[i - 1])}
                    group={x.static.group.id.skill_group}
                    getGroupName={getGroupName}
                  />
                )
              })}
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
