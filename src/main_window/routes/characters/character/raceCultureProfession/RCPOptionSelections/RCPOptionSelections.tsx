import { stripInlineMarkdown } from "@elyukai/markdown/render/strip"
import { isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { mapNullable } from "@elyukai/utils/nullable"
import { range } from "@elyukai/utils/range"
import { romanize } from "@elyukai/utils/roman"
import { minus } from "@elyukai/utils/string/number"
import type { ResolvedSkillApplicationIdentifier } from "@optolith/database-schema/cache"
import type {
  Attribute_ID,
  CombatTechniqueIdentifier,
  Skill_ID,
} from "@optolith/database-schema/gen"
import { parensIf } from "@optolith/entity-descriptions/entities/partial/rated/activatable/parensIf"
import { action } from "mobx"
import { observer, useLocalObservable } from "mobx-react-lite"
import type { FC } from "react"
import { fromUniformCase } from "tsondb/schema/gen"
import { Button } from "../../../../../../shared/components/button/Button.tsx"
import { Checkbox } from "../../../../../../shared/components/checkbox/Checkbox.tsx"
import { Dropdown } from "../../../../../../shared/components/dropdown/Dropdown.tsx"
import { Main } from "../../../../../../shared/components/main/Main.tsx"
import { RadioButtonGroup } from "../../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { Scroll } from "../../../../../../shared/components/scroll/Scroll.tsx"
import { Slidein } from "../../../../../../shared/components/slidein/Slidein.tsx"
import { equalsCase } from "../../../../../../shared/domain/databaseEnum.ts"
import { COMBAT_TECHNIQUE_START_RATING } from "../../../../../../shared/domain/rated/combatTechnique.ts"
import { useLocaleJoin } from "../../../../../../shared/hooks/localeJoin.ts"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import { IncompleteActivatable } from "./IncompleteActivatable.tsx"
import "./RCPOptionSelections.css"
import { SelectedRCPOptions } from "./SelectedRCPOptions.ts"

export const RCPOptionSelections: FC<{ close: () => void }> = observer(
  function RCPOptionSelections({ close }) {
    const translate = useTranslate()
    const localeJoin = useLocaleJoin()
    const characterState = useCharacterState()
    const { raceCultureProfessionSelectOptions } = characterState
    const { applyRaceCultureProfession } = useCharacterActions()
    const selectedRCPOptions = useLocalObservable(() => new SelectedRCPOptions(characterState))

    if (raceCultureProfessionSelectOptions === undefined) {
      return null
    }

    return (
      <Slidein isOpen close={close} className="rcp-selections">
        <Main>
          <Scroll>
            <section className="rcp-selectoptions--race">
              <h3>{translate("Race")}</h3>
              {raceCultureProfessionSelectOptions.race.attributeAdjustment === undefined ? null : (
                <Dropdown<Attribute_ID>
                  className="attribute-adjustment"
                  label={translate("Attribute Adjustment")}
                  hint={translate("Select Attribute Adjustment")}
                  options={raceCultureProfessionSelectOptions.race.attributeAdjustment}
                  getKey={option => option.id}
                  value={selectedRCPOptions.attributeAdjustment.attributeAdjustmentId}
                  onChange={action(id => {
                    selectedRCPOptions.attributeAdjustment.setAttributeAdjustmentId(id)
                  })}
                />
              )}
            </section>
            <hr />
            <section className="rcp-selectoptions--culture">
              <h3>{translate("Culture")}</h3>
              <Checkbox
                checked={selectedRCPOptions.buyCulturalPackage}
                onClick={action(() => {
                  selectedRCPOptions.toggleCulturalPackage()
                })}
              >
                {translate("Buy Cultural Package") +
                  parensIf(
                    raceCultureProfessionSelectOptions.culture.culturalPackageAPValue === undefined
                      ? undefined
                      : translate("{$value} AP", {
                          value:
                            raceCultureProfessionSelectOptions.culture.culturalPackageAPValue.toFixed(),
                        }),
                  )}
              </Checkbox>
              {raceCultureProfessionSelectOptions.culture.nativeTongue === undefined ||
              raceCultureProfessionSelectOptions.culture.nativeTongue.length === 1 ? null : (
                <RadioButtonGroup
                  active={selectedRCPOptions.nativeTongueAndScript.nativeTongue}
                  options={raceCultureProfessionSelectOptions.culture.nativeTongue.map(opt => ({
                    name: opt.name,
                    value: opt.id,
                    disabled: selectedRCPOptions.languagesAndLiteracy.languages.has(opt.id),
                  }))}
                  onClickJust={action(id => {
                    selectedRCPOptions.nativeTongueAndScript.setNativeTongue(id)
                  })}
                />
              )}
              {raceCultureProfessionSelectOptions.culture.scripts === undefined ? null : (
                <Checkbox
                  checked={selectedRCPOptions.nativeTongueAndScript.buyScript}
                  onClick={action(() => {
                    selectedRCPOptions.nativeTongueAndScript.toggleBuyScript()
                  })}
                  disabled={
                    raceCultureProfessionSelectOptions.culture.scripts.length === 1 &&
                    selectedRCPOptions.languagesAndLiteracy.scripts.has(
                      raceCultureProfessionSelectOptions.culture.scripts[0].id,
                    )
                  }
                >
                  {translate("Buy Script") +
                    parensIf(
                      raceCultureProfessionSelectOptions.culture.scripts.length > 1
                        ? undefined
                        : [
                            raceCultureProfessionSelectOptions.culture.scripts[0].name,
                            translate("{$value} AP", {
                              value:
                                raceCultureProfessionSelectOptions.culture.scripts[0].apValue.toFixed(),
                            }),
                          ].join(", "),
                    )}
                </Checkbox>
              )}
              {raceCultureProfessionSelectOptions.culture.scripts === undefined ||
              raceCultureProfessionSelectOptions.culture.scripts.length === 1 ||
              !selectedRCPOptions.nativeTongueAndScript.buyScript ? null : (
                <RadioButtonGroup
                  active={selectedRCPOptions.nativeTongueAndScript.script}
                  options={raceCultureProfessionSelectOptions.culture.scripts.map(opt => ({
                    name: opt.name,
                    value: opt.id,
                    disabled: selectedRCPOptions.languagesAndLiteracy.scripts.has(opt.id),
                  }))}
                  onClickJust={action(id => {
                    selectedRCPOptions.nativeTongueAndScript.setScript(id)
                  })}
                />
              )}
            </section>
            {raceCultureProfessionSelectOptions.profession.hasAnySelectOptions ? (
              <>
                <hr />
                <section className="rcp-selectoptions--profession">
                  <h3>{translate("Profession")}</h3>
                  {raceCultureProfessionSelectOptions.profession.skillSpecialization ===
                  undefined ? null : (
                    <div className="skill-specialization">
                      <h4>
                        {translate("Skill Specialization {$possibleSkills}", {
                          possibleSkills: localeJoin(
                            raceCultureProfessionSelectOptions.profession.skillSpecialization.map(
                              opt => opt.name,
                            ),
                            "disjunction",
                          ),
                        })}
                      </h4>
                      <div>
                        {raceCultureProfessionSelectOptions.profession.skillSpecialization
                          .length === 1 ? null : (
                          <Dropdown<Skill_ID>
                            value={selectedRCPOptions.skillSpecialization.skillSpecialization}
                            onChange={action(id => {
                              selectedRCPOptions.skillSpecialization.setSkillSpecialization(id)
                            })}
                            options={
                              raceCultureProfessionSelectOptions.profession.skillSpecialization
                            }
                            getKey={opt => opt.id}
                          />
                        )}
                        <Dropdown<ResolvedSkillApplicationIdentifier>
                          value={
                            selectedRCPOptions.skillSpecialization.skillSpecializationApplication
                          }
                          onChange={action(id => {
                            selectedRCPOptions.skillSpecialization.setSkillSpecializationApplication(
                              id,
                            )
                          })}
                          options={
                            selectedRCPOptions.skillSpecialization.skillSpecializationApplications
                          }
                          getKey={opt => fromUniformCase(opt.id)}
                          disabled={
                            selectedRCPOptions.skillSpecialization.skillSpecialization === undefined
                          }
                          equals={equalsCase}
                        />
                      </div>
                    </div>
                  )}
                  {raceCultureProfessionSelectOptions.profession.languagesLiteracy ===
                  undefined ? null : (
                    <div className="languages-literacy">
                      <h4>
                        {translate("Languages and Literacy totaling {$apValue} AP", {
                          apValue:
                            raceCultureProfessionSelectOptions.profession.languagesLiteracy.apValue.toFixed(),
                        }) +
                          parensIf(
                            translate("{$value} AP Remaining", {
                              value: selectedRCPOptions.languagesAndLiteracy.apLeft.toFixed(),
                            }),
                          )}
                      </h4>
                      <div className="languages-scripts">
                        <ul className="languages checkboxes" role="list">
                          {raceCultureProfessionSelectOptions.profession.languagesLiteracy.languages.map(
                            language => {
                              const activeLevel =
                                selectedRCPOptions.languagesAndLiteracy.languages.get(language.id)
                              const isActive = activeLevel !== undefined
                              const isNativeTongue =
                                selectedRCPOptions.nativeTongueAndScript.safeNativeTongue ===
                                language.id
                              return (
                                <li key={language.id}>
                                  <Checkbox
                                    checked={isNativeTongue || isActive}
                                    disabled={
                                      isNativeTongue ||
                                      (!isActive &&
                                        selectedRCPOptions.languagesAndLiteracy.apLeft - 2 < 0)
                                    }
                                    onClick={action(() =>
                                      selectedRCPOptions.languagesAndLiteracy.toggleLanguage(
                                        language.id,
                                      ),
                                    )}
                                  >
                                    {language.name}
                                  </Checkbox>
                                  {(() => {
                                    if (isNativeTongue) {
                                      return (
                                        <Dropdown
                                          className="levels"
                                          value={4}
                                          options={[
                                            {
                                              id: 4,
                                              name: translate("NT"),
                                            },
                                          ]}
                                          disabled
                                          getKey={opt => opt.id}
                                        />
                                      )
                                    } else if (isActive) {
                                      return (
                                        <Dropdown
                                          className="levels"
                                          options={range([
                                            1,
                                            Math.min(
                                              selectedRCPOptions.languagesAndLiteracy.apLeft / 2 +
                                                activeLevel,
                                              3,
                                            ),
                                          ]).map(l => ({ id: l, name: romanize(l) }))}
                                          getKey={opt => opt.id}
                                          value={activeLevel}
                                          onChange={level =>
                                            selectedRCPOptions.languagesAndLiteracy.setLanguageLevel(
                                              language.id,
                                              level,
                                            )
                                          }
                                        />
                                      )
                                    }

                                    return null
                                  })()}
                                </li>
                              )
                            },
                          )}
                        </ul>
                        {raceCultureProfessionSelectOptions.profession.languagesLiteracy.scripts ===
                        undefined ? null : (
                          <ul className="scripts" role="list">
                            {raceCultureProfessionSelectOptions.profession.languagesLiteracy.scripts.map(
                              script => {
                                const isActive =
                                  selectedRCPOptions.languagesAndLiteracy.scripts.has(script.id)
                                const isNativeScript =
                                  selectedRCPOptions.nativeTongueAndScript.safeNativeScript ===
                                  script.id
                                return (
                                  <li key={script.id}>
                                    <Checkbox
                                      checked={isNativeScript || isActive}
                                      disabled={
                                        isNativeScript ||
                                        (!isActive &&
                                          selectedRCPOptions.languagesAndLiteracy.apLeft -
                                            script.apValue <
                                            0)
                                      }
                                      onClick={action(() =>
                                        selectedRCPOptions.languagesAndLiteracy.toggleScript(
                                          script.id,
                                        ),
                                      )}
                                    >
                                      {script.name +
                                        parensIf(
                                          translate("{$value} AP", {
                                            value: script.apValue.toFixed(),
                                          }),
                                        )}
                                    </Checkbox>
                                  </li>
                                )
                              },
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                  {raceCultureProfessionSelectOptions.profession.skills === undefined ? null : (
                    <div className="skills">
                      <h4>
                        {translate("{$apValue} AP to improve other {$skillsOfGroup}", {
                          apValue:
                            raceCultureProfessionSelectOptions.profession.skills.apValue.toFixed(),
                          skillsOfGroup:
                            raceCultureProfessionSelectOptions.profession.skills.skillsName,
                        }) +
                          parensIf(
                            translate("{$value} AP Remaining", {
                              value: selectedRCPOptions.skills.apLeft.toFixed(),
                            }),
                          )}
                      </h4>
                      <ul className="rated" role="list">
                        {raceCultureProfessionSelectOptions.profession.skills.skills.map(skill => (
                          <li key={skill.id}>
                            <span className="name">{skill.name}</span>
                            {mapNullable(
                              selectedRCPOptions.skills.getDisplayRating(skill.id),
                              rating => (
                                <span className="value">{rating}</span>
                              ),
                            )}
                            <Button
                              disabled={!selectedRCPOptions.skills.canIncrement(skill.id)}
                              onClick={() => selectedRCPOptions.skills.increment(skill.id)}
                              aria-label={translate("Increment")}
                            >
                              +
                            </Button>
                            <Button
                              disabled={!selectedRCPOptions.skills.canDecrement(skill.id)}
                              onClick={() => selectedRCPOptions.skills.decrement(skill.id)}
                              aria-label={translate("Decrement")}
                            >
                              {minus}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {raceCultureProfessionSelectOptions.profession.combatTechniques === undefined ||
                  !isNotEmpty(
                    raceCultureProfessionSelectOptions.profession.combatTechniques.fixed,
                  ) ? null : (
                    <div className="combat-techniques">
                      <h4>
                        {(() => {
                          const {
                            fixed: [first, ...others],
                            restRatingModifier,
                          } = raceCultureProfessionSelectOptions.profession.combatTechniques

                          const firstText = translate(
                            ".input {$count :number} {{{$count} of the following combat techniques {$rating}}}",
                            {
                              count: first.number,
                              rating: (
                                first.rating_modifier + COMBAT_TECHNIQUE_START_RATING
                              ).toFixed(),
                            },
                          )

                          const fixedText = others.reduce(
                            (accText, other) =>
                              translate(
                                ".input {$count :number} {{{$previous}, {$count} others {$rating}}}",
                                {
                                  count: other.number,
                                  previous: accText,
                                  rating: (
                                    other.rating_modifier + COMBAT_TECHNIQUE_START_RATING
                                  ).toFixed(),
                                },
                              ),
                            firstText,
                          )

                          const completeText =
                            restRatingModifier === undefined
                              ? fixedText
                              : translate("{$previous}, the others {$rating}", {
                                  previous: fixedText,
                                  rating: (
                                    restRatingModifier + COMBAT_TECHNIQUE_START_RATING
                                  ).toFixed(),
                                })

                          return completeText
                        })()}
                      </h4>
                      {isNotEmpty(selectedRCPOptions.combatTechniques.slots) ? (
                        selectedRCPOptions.combatTechniques.slots.length === 1 ? (
                          <div className="combat-technique-slot">
                            <Dropdown<CombatTechniqueIdentifier>
                              value={selectedRCPOptions.combatTechniques.slots[0].current}
                              onChange={action(id => {
                                selectedRCPOptions.combatTechniques.setCombatTechnique(
                                  id,
                                  selectedRCPOptions.combatTechniques.slots[0]!.fixedIndex,
                                  selectedRCPOptions.combatTechniques.slots[0]!.optionIndex,
                                )
                              })}
                              options={selectedRCPOptions.combatTechniques.slots[0].available}
                              getKey={opt => fromUniformCase(opt.id)}
                              disabled={
                                selectedRCPOptions.combatTechniques.slots[0].available.length === 0
                              }
                              equals={equalsCase}
                            />{" "}
                            <span className="value">
                              {selectedRCPOptions.combatTechniques.slots[0].ratingModifier +
                                COMBAT_TECHNIQUE_START_RATING}
                            </span>
                          </div>
                        ) : (
                          <ul className="combat-techniques" role="list">
                            {selectedRCPOptions.combatTechniques.slots.map(slot => (
                              <li
                                key={`${slot.fixedIndex}-${slot.optionIndex}`}
                                className="combat-technique-slot"
                              >
                                <Dropdown<CombatTechniqueIdentifier>
                                  value={slot.current}
                                  onChange={action(id => {
                                    selectedRCPOptions.combatTechniques.setCombatTechnique(
                                      id,
                                      slot.fixedIndex,
                                      slot.optionIndex,
                                    )
                                  })}
                                  options={slot.available}
                                  getKey={opt => fromUniformCase(opt.id)}
                                  disabled={slot.available.length === 0}
                                  equals={equalsCase}
                                />{" "}
                                <span className="value">
                                  {slot.ratingModifier + COMBAT_TECHNIQUE_START_RATING}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )
                      ) : null}
                    </div>
                  )}
                  {raceCultureProfessionSelectOptions.profession.cantrips === undefined ? null : (
                    <div className="cantrips">
                      <h4>
                        {translate("{$count} from the following list", {
                          count: translate(".input {$count :number} {{{$count} cantrips}}", {
                            count: raceCultureProfessionSelectOptions.profession.cantrips.number,
                          }),
                        })}
                      </h4>
                      {raceCultureProfessionSelectOptions.profession.cantrips.number === 1 ? (
                        <RadioButtonGroup
                          active={selectedRCPOptions.cantrips.cantrips.values().next().value}
                          options={raceCultureProfessionSelectOptions.profession.cantrips.cantrips.map(
                            cantrip => ({
                              name: cantrip.name,
                              value: cantrip.id,
                            }),
                          )}
                          onClickJust={action(id => {
                            selectedRCPOptions.cantrips.switchCantrip(id)
                          })}
                        />
                      ) : (
                        <ul className="checkboxes" role="list">
                          {raceCultureProfessionSelectOptions.profession.cantrips.cantrips.map(
                            cantrip => (
                              <li key={cantrip.id}>
                                <Checkbox
                                  checked={selectedRCPOptions.cantrips.isActive(cantrip.id)}
                                  disabled={!selectedRCPOptions.cantrips.canToggle(cantrip.id)}
                                  onClick={action(() => {
                                    selectedRCPOptions.cantrips.toggleCantrip(cantrip.id)
                                  })}
                                >
                                  {cantrip.name}
                                </Checkbox>
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                  {raceCultureProfessionSelectOptions.profession.spellworks === undefined ? null : (
                    <div className="spellworks">
                      <h4>
                        {translate(
                          ".input {$count :number} {{{$count} more spellworks totaling {$apValue} AP}}",
                          {
                            count: raceCultureProfessionSelectOptions.profession.spellworks.number,
                            apValue:
                              raceCultureProfessionSelectOptions.profession.spellworks.apValue.toFixed(),
                          },
                        ) +
                          parensIf(
                            translate("{$value} AP Remaining", {
                              value: selectedRCPOptions.spellworks.apLeft.toFixed(),
                            }),
                          )}
                      </h4>
                      <ul className="rated rated--activatable" role="list">
                        {raceCultureProfessionSelectOptions.profession.spellworks.spellworks.map(
                          skill => {
                            const rating = selectedRCPOptions.spellworks.getRating(skill.id)
                            return (
                              <li key={fromUniformCase(skill.id)}>
                                <span className="name">{skill.name}</span>
                                {rating === undefined ? null : (
                                  <span className="value">{rating}</span>
                                )}
                                <Button
                                  disabled={!selectedRCPOptions.spellworks.canIncrement(skill.id)}
                                  onClick={() => selectedRCPOptions.spellworks.increment(skill.id)}
                                  aria-label={translate("Increment")}
                                >
                                  +
                                </Button>
                                <Button
                                  disabled={!selectedRCPOptions.spellworks.canDecrement(skill.id)}
                                  onClick={() => selectedRCPOptions.spellworks.decrement(skill.id)}
                                  aria-label={translate("Decrement")}
                                >
                                  {rating === 0 ? "x" : minus}
                                </Button>
                              </li>
                            )
                          },
                        )}
                      </ul>
                    </div>
                  )}
                  {raceCultureProfessionSelectOptions.profession.curses === undefined ? null : (
                    <div className="curses">
                      <h4>
                        {translate("Curses totaling {$apValue} AP", {
                          apValue:
                            raceCultureProfessionSelectOptions.profession.curses.apValue.toFixed(),
                        }) +
                          parensIf(
                            translate("{$value} AP Remaining", {
                              value: selectedRCPOptions.curses.apLeft.toFixed(),
                            }),
                          )}
                      </h4>
                      <ul className="rated rated--activatable" role="list">
                        {raceCultureProfessionSelectOptions.profession.curses.curses.map(curse => (
                          <li key={curse.id}>
                            <span className="name">{curse.name}</span>
                            {mapNullable(
                              selectedRCPOptions.curses.getDisplayRating(curse.id),
                              rating => (
                                <span className="value">{rating}</span>
                              ),
                            )}
                            <Button
                              disabled={!selectedRCPOptions.curses.canIncrement(curse.id)}
                              onClick={() => selectedRCPOptions.curses.increment(curse.id)}
                              aria-label={translate("Increment")}
                            >
                              +
                            </Button>
                            <Button
                              disabled={!selectedRCPOptions.curses.canDecrement(curse.id)}
                              onClick={() => selectedRCPOptions.curses.decrement(curse.id)}
                              aria-label={translate("Decrement")}
                            >
                              {selectedRCPOptions.curses.getRating(curse.id) === 0 ? "x" : minus}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {raceCultureProfessionSelectOptions.profession.liturgies === undefined ? null : (
                    <div className="liturgies">
                      <h4>
                        {translate("Liturgies totaling {$apValue} AP", {
                          apValue:
                            raceCultureProfessionSelectOptions.profession.liturgies.apValue.toFixed(),
                        }) +
                          parensIf(
                            translate("{$value} AP Remaining", {
                              value: selectedRCPOptions.liturgies.apLeft.toFixed(),
                            }),
                          )}
                      </h4>
                      <ul className="rated rated--activatable" role="list">
                        {raceCultureProfessionSelectOptions.profession.liturgies.liturgies.map(
                          liturgy => {
                            const rating = selectedRCPOptions.liturgies.getRating(liturgy.id)
                            return (
                              <li key={fromUniformCase(liturgy.id)}>
                                <span className="name">{liturgy.name}</span>
                                {rating === undefined ? null : (
                                  <span className="value">{rating}</span>
                                )}
                                <Button
                                  disabled={!selectedRCPOptions.liturgies.canIncrement(liturgy.id)}
                                  onClick={() => selectedRCPOptions.liturgies.increment(liturgy.id)}
                                  aria-label={translate("Increment")}
                                >
                                  +
                                </Button>
                                <Button
                                  disabled={!selectedRCPOptions.liturgies.canDecrement(liturgy.id)}
                                  onClick={() => selectedRCPOptions.liturgies.decrement(liturgy.id)}
                                  aria-label={translate("Decrement")}
                                >
                                  {rating === 0 ? "x" : minus}
                                </Button>
                              </li>
                            )
                          },
                        )}
                      </ul>
                    </div>
                  )}
                  {isNotEmpty(raceCultureProfessionSelectOptions.profession.separateSelects) ? (
                    <div className="separate-selects">
                      <h4>{translate("Other Selections")}</h4>
                      <ul className="separate">
                        {raceCultureProfessionSelectOptions.profession.separateSelects.map(
                          (select, optionIndex) => (
                            <li key={optionIndex}>
                              {Array.isArray(select) ? (
                                <RadioButtonGroup
                                  active={selectedRCPOptions.separate.indices.get(optionIndex)}
                                  options={select.map((optionOption, optionOptionIndex) =>
                                    optionOption.tag === "general"
                                      ? {
                                          name: stripInlineMarkdown(optionOption.name),
                                          value: optionOptionIndex,
                                        }
                                      : {
                                          name: (
                                            <IncompleteActivatable
                                              state={selectedRCPOptions.separate}
                                              config={optionOption}
                                              optionIndex={optionIndex}
                                              optionOptionIndex={optionOptionIndex}
                                            />
                                          ),
                                          value: optionOptionIndex,
                                        },
                                  )}
                                  onClickJust={action(selectedIndex =>
                                    selectedRCPOptions.separate.setSelectedOptionIndex(
                                      optionIndex,
                                      selectedIndex,
                                    ),
                                  )}
                                />
                              ) : (
                                <IncompleteActivatable
                                  state={selectedRCPOptions.separate}
                                  config={select}
                                  optionIndex={optionIndex}
                                  optionOptionIndex={0}
                                />
                              )}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  ) : null}
                </section>
              </>
            ) : null}
            <Button
              className="complete"
              primary
              disabled={!selectedRCPOptions.isValid}
              onClick={action(() => {
                applyRaceCultureProfession(selectedRCPOptions.toSerialized())
              })}
            >
              {translate("rcpselectoptions.completebtn")}
            </Button>
          </Scroll>
        </Main>
      </Slidein>
    )
  },
)
