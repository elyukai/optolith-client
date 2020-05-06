import * as React from "react"
import { fromLeft_, fromRight_, isLeft, Left, Right } from "../../../Data/Either"
import { fmap } from "../../../Data/Functor"
import { filter, flength, map } from "../../../Data/List"
import { isNothing, Just, Maybe, maybeToNullable } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd } from "../../../Data/Tuple"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { RadioOption } from "../../Models/View/RadioOption"
import { Skill } from "../../Models/Wiki/Skill"
import { Application } from "../../Models/Wiki/sub/Application"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { Dropdown } from "../Universal/Dropdown"
import { RadioButtonGroup } from "../Universal/RadioButtonGroup"
import { TextField } from "../Universal/TextField"

const SA = Skill.A
const AA = Application.A

const applicationsToDropdown = map ((e: Record<Application>) => DropdownOption ({
  id: Just (AA.id (e)),
  name: AA.name (e),
}))

const applicationsToRadio = map ((e: Record<Application>) => RadioOption ({
  name: AA.name (e),
  value: Just (AA.id (e)),
}))

interface Props {
  active: Pair<Maybe<number>, string>
  skill: Record<Skill>
  setApplicationId: (id: number) => void
  setApplicationString: (input: string) => void
}

export const SkillSpecializationSelectionApplications: React.FC<Props> = props => {
  const { active, setApplicationId, setApplicationString, skill } = props

  const applications = pipe_ (
                         SA.applications (skill),
                         filter (pipe (AA.prerequisite, isNothing))
                       )
  const mapplication_input = SA.applicationsInput (skill)

  const applicationOptions = React.useMemo (
    () => flength (applications) > 5
          ? Left (applicationsToDropdown (applications))
          : Right (applicationsToRadio (applications)),
    [ applications ]
  )

  const inputElement = pipe_ (
    mapplication_input,
    fmap (input => (
           <TextField
             hint={input}
             value={snd (active)}
             onChange={setApplicationString}
             />
         )),
    maybeToNullable
  )

  if (isLeft (applicationOptions)) {
    return (
      <div>
        <Dropdown<number>
          value={Maybe.sum (fst (active))}
          onChangeJust={setApplicationId}
          options={fromLeft_ (applicationOptions)}
          disabled={snd (active) .length > 0}
          />
        {inputElement}
      </div>
    )
  }

  return (
    <div>
      <RadioButtonGroup<number>
        active={Maybe.sum (fst (active))}
        array={fromRight_ (applicationOptions)}
        disabled={snd (active) .length > 0}
        onClickJust={setApplicationId}
        />
      {inputElement}
    </div>
  )
}
