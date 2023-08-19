import { FC } from "react"
import { useTranslate } from "../../hooks/translate.ts"
import "./RecommendedReference.scss"

type Props = {
  strongly?: boolean
  unfamiliarSpells?: boolean
}

export const RecommendedReference: FC<Props> = props => {
  const { strongly, unfamiliarSpells } = props

  const translate = useTranslate()

  if (unfamiliarSpells === true) {
    return (
      <div className="recommended-ref">
        <div className="unrec">
          <div className="icon" />
          <div className="name">{translate("showfrequency.unfamiliarspells")}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="recommended-ref">
      {strongly === true ? (
        <div className="strongly-recommended">
          <div className="icon" />
          <div className="name">{translate("showfrequency.stronglyrecommended")}</div>
        </div>
      ) : null}
      <div className="rec">
        <div className="icon" />
        <div className="name">{translate("showfrequency.common")}</div>
      </div>
      <div className="unrec">
        <div className="icon" />
        <div className="name">{translate("showfrequency.uncommon")}</div>
      </div>
    </div>
  )
}
