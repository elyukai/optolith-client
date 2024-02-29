import { FC } from "react"
import { useTranslate } from "../../hooks/translate.ts"
import "./RecommendedReference.scss"

type Props = {
  strongly?: boolean
  unfamiliarSpells?: boolean
}

/**
 * A reference for the recommended frequency of skills, advantages, spells and
 * other kinds of entries.
 */
export const RecommendedReference: FC<Props> = props => {
  const { strongly, unfamiliarSpells } = props

  const translate = useTranslate()

  if (unfamiliarSpells === true) {
    return (
      <div className="recommended-ref">
        <div className="unrec">
          <div className="icon" />
          <div className="name">{translate("Unfamiliar Spells")}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="recommended-ref">
      {strongly === true ? (
        <div className="strongly-recommended">
          <div className="icon" />
          <div className="name">{translate("Strongly Recommended")}</div>
        </div>
      ) : null}
      <div className="rec">
        <div className="icon" />
        <div className="name">{translate("Common")}</div>
      </div>
      <div className="unrec">
        <div className="icon" />
        <div className="name">{translate("Uncommon")}</div>
      </div>
    </div>
  )
}
