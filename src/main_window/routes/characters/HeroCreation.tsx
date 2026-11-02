import { parensIf } from "@optolith/entity-descriptions/entities/partial/rated/activatable/parensIf"
import { observer, useLocalObservable } from "mobx-react-lite"
import { useCallback, useContext, useState } from "react"
import { Checkbox } from "../../../shared/components/checkbox/Checkbox.tsx"
import { Dialog } from "../../../shared/components/dialog/Dialog.tsx"
import { Dropdown } from "../../../shared/components/dropdown/Dropdown.tsx"
import { Grid } from "../../../shared/components/grid/Grid.tsx"
import { RadioButtonGroup } from "../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { Scroll } from "../../../shared/components/scroll/Scroll.tsx"
import { TextField } from "../../../shared/components/textField/TextField.tsx"
import { DatabaseSettingsContext } from "../../../shared/contexts/databaseSettings.ts"
import { LocalizationContext } from "../../../shared/contexts/localization.ts"
import type { RuleBasedInterpretation, Sex } from "../../../shared/domain/sex.ts"
import { useTranslate } from "../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../shared/hooks/translateMap.ts"
import { ExternalAPI, SharedGlobalState } from "../../external.ts"
import { useCharacterState } from "../../hooks/characterState.ts"
import { AlternativeRules } from "./character/rules/AlternativeRules.tsx"
import { FocusRules } from "./character/rules/FocusRules.tsx"
import { OptionalRules } from "./character/rules/OptionalRules.tsx"
import { RuleSources } from "./character/rules/RuleSources.tsx"
import "./HeroCreation.scss"

export type Props = {
  isOpen: boolean
  close(): void
}

export type StartConfig = {
  name: string
  sexType?: Sex["type"]
  customSexName: string
  sexRuleBasedInterpretation: RuleBasedInterpretation
  experienceLevel: string
}

export type FinalStartConfig = {
  name: string
  sex: Sex
  experienceLevel: string
}

const toFinalConfig = (config: StartConfig): FinalStartConfig | undefined => {
  if (
    config.name.length === 0 ||
    config.sexType === undefined ||
    config.experienceLevel.length === 0
  ) {
    return undefined
  }

  const sex: Sex | undefined =
    config.sexType === "Custom"
      ? config.customSexName.length === 0
        ? undefined
        : {
            type: "Custom",
            name: config.customSexName,
            ruleBasedInterpretation: config.sexRuleBasedInterpretation,
          }
      : config.sexType === "BalThani" || config.sexType === "Tsajana"
        ? {
            type: config.sexType,
            ruleBasedInterpretation: config.sexRuleBasedInterpretation,
          }
        : { type: config.sexType }

  if (sex === undefined) {
    return undefined
  }

  return {
    name: config.name,
    sex,
    experienceLevel: config.experienceLevel,
  }
}

export const HeroCreationDialog: React.FC<Props> = observer(props => {
  const { isOpen, close } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const { formatNumber } = useContext(LocalizationContext)
  const databaseSettings = useContext(DatabaseSettingsContext)
  const { showSexualCharacteristics } = useCharacterState()

  const startConfig = useLocalObservable((): StartConfig => ({
    name: "",
    customSexName: "",
    sexRuleBasedInterpretation: {
      asMale: false,
      asFemale: false,
      sexualCharacteristics: {
        hasPenis: false,
        hasVagina: false,
      },
    },
    experienceLevel: databaseSettings.defaultExperienceLevel,
  }))

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)

  const finalConfig = toFinalConfig(startConfig)
  const isValid = finalConfig !== undefined

  const handleSubmit = useCallback(() => {
    if (finalConfig !== undefined) {
      ExternalAPI.execute("createCharacter", finalConfig)
    }
  }, [finalConfig])

  const handleClear = useCallback(() => {
    startConfig.name = ""
    startConfig.sexType = undefined
    startConfig.customSexName = ""
    startConfig.sexRuleBasedInterpretation = {
      asMale: false,
      asFemale: false,
      sexualCharacteristics: {
        hasPenis: false,
        hasVagina: false,
      },
    }
    startConfig.experienceLevel = databaseSettings.defaultExperienceLevel
  }, [startConfig])

  const handleClose = useCallback(() => {
    close()
    handleClear()
  }, [handleClear, close])

  if (!isOpen && prevIsOpen) {
    handleClear()
    setPrevIsOpen(false)
  }

  return (
    <Dialog
      id="herocreation"
      title={translate("New Character")}
      close={handleClose}
      buttons={[
        {
          disabled: !isValid,
          label: translate("Create"),
          onClick: handleSubmit,
          primary: true,
        },
      ]}
      isOpen={isOpen}
    >
      <TextField
        label={translate("Name of Character")}
        value={startConfig.name}
        onChange={newName => {
          startConfig.name = newName
        }}
        fullWidth
        autoFocus
      />
      <hr />
      <Scroll>
        <Grid size="large">
          <RadioButtonGroup
            label={translate("Sex")}
            active={startConfig.sexType}
            onClick={sexType => {
              startConfig.sexType = sexType
            }}
            options={[
              {
                value: "Male",
                name: translate("Male"),
              },
              {
                value: "Female",
                name: translate("Female"),
              },
              {
                value: "BalThani",
                name: translate("Bal’Thani"),
              },
              {
                value: "Tsajana",
                name: translate("Tsajana"),
              },
              {
                value: "Custom",
                name: translate("Custom Sex"),
              },
            ]}
          />
          {startConfig.sexType === "Custom" && (
            <TextField
              label={translate("Custom Sex Name")}
              value={startConfig.customSexName ?? ""}
              onChange={newName => {
                startConfig.customSexName = newName
              }}
              fullWidth
            />
          )}
          {startConfig.sexType === "BalThani" ||
          startConfig.sexType === "Tsajana" ||
          startConfig.sexType === "Custom" ? (
            <Grid size="small">
              <Checkbox
                checked={startConfig.sexRuleBasedInterpretation.asMale}
                onClick={() => {
                  startConfig.sexRuleBasedInterpretation.asMale =
                    !startConfig.sexRuleBasedInterpretation.asMale
                }}
                label={translate("Counts as male when checking binary sex prerequisites")}
              />
              <Checkbox
                checked={startConfig.sexRuleBasedInterpretation.asFemale}
                onClick={() => {
                  startConfig.sexRuleBasedInterpretation.asFemale =
                    !startConfig.sexRuleBasedInterpretation.asFemale
                }}
                label={translate("Counts as female when checking binary sex prerequisites")}
              />
              {showSexualCharacteristics ? (
                <>
                  <Checkbox
                    checked={startConfig.sexRuleBasedInterpretation.sexualCharacteristics.hasPenis}
                    onClick={() => {
                      startConfig.sexRuleBasedInterpretation.sexualCharacteristics.hasPenis =
                        !startConfig.sexRuleBasedInterpretation.sexualCharacteristics.hasPenis
                    }}
                    label={translate(
                      "Counts as having a penis when checking sex characteristic prerequisites",
                    )}
                  />
                  <Checkbox
                    checked={startConfig.sexRuleBasedInterpretation.sexualCharacteristics.hasVagina}
                    onClick={() => {
                      startConfig.sexRuleBasedInterpretation.sexualCharacteristics.hasVagina =
                        !startConfig.sexRuleBasedInterpretation.sexualCharacteristics.hasVagina
                    }}
                    label={translate(
                      "Counts as having a vagina when checking sex characteristic prerequisites",
                    )}
                  />
                </>
              ) : null}
            </Grid>
          ) : null}
        </Grid>
        <hr />
        <Dropdown
          value={startConfig.experienceLevel}
          label={translate("Experience Level")}
          onChange={newExperienceLevel => {
            startConfig.experienceLevel = newExperienceLevel
          }}
          options={SharedGlobalState.experienceLevels.map(experienceLevel => ({
            id: experienceLevel.id,
            name:
              (translateMap(experienceLevel.translations)?.name ?? experienceLevel.id) +
              parensIf(
                translate("{$value} AP", { value: formatNumber(experienceLevel.adventurePoints) }),
              ),
          }))}
          fullWidth
          getKey={experienceLevel => experienceLevel.id}
        />
        <hr />
        <RuleSources />
        <FocusRules hideInfo />
        <OptionalRules hideInfo />
        <AlternativeRules hideInfo />
      </Scroll>
    </Dialog>
  )
})
