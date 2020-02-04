import * as React from "react"
import Scrollbars from "react-custom-scrollbars"
import { List } from "../../../Data/List"
import { Just, Maybe, orN } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"

const ThumbHorizontal: React.FC = p => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...p} className="thumb thumb-horizontal">
    <div />
  </div>
)

const ThumbVertical: React.FC = p => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...p} className="thumb thumb-vertical">
    <div />
  </div>
)

const TrackHorizontal: React.FC = p => (
  // @ts-ignore
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...p} style={{ ...p.style, height: 11 }} className="track track-horizontal" />
)

const TrackVertical: React.FC = p => (
  // @ts-ignore
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...p} style={{ ...p.style, width: 11 }} className="track track-vertical" />
)

const View: React.FC = p => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...p} className="scroll-view" />
)

interface Props {
  className?: string
  noInnerElement?: boolean
}

export const Scroll: React.FC<Props> = props => {
  const { className, children, noInnerElement } = props

  return (
    <Scrollbars
      className={classListMaybe (List (Just ("scroll"), Maybe (className)))}
      renderThumbHorizontal={ThumbHorizontal}
      renderThumbVertical={ThumbVertical}
      renderTrackHorizontal={TrackHorizontal}
      renderTrackVertical={TrackVertical}
      renderView={View}
      >
      {orN (noInnerElement)
        ? children
        : (
          <div className="scroll-inner">
            {children}
          </div>
        )}
    </Scrollbars>
  )
}
