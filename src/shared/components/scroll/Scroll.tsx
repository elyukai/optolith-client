import { FC, HTMLAttributes } from "react"
import { Scrollbars } from "react-custom-scrollbars-2"
import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import "./Scroll.scss"

const ThumbHorizontal: FC = p => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...p} className="thumb thumb-horizontal">
    <div />
  </div>
)

const ThumbVertical: FC = p => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...p} className="thumb thumb-vertical">
    <div />
  </div>
)

const TrackHorizontal: FC<HTMLAttributes<HTMLDivElement>> = ({ style, ...p }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...p} style={{ ...style, height: 11 }} className="track track-horizontal" />
)

const TrackVertical: FC<HTMLAttributes<HTMLDivElement>> = ({ style, ...p }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...p} style={{ ...style, width: 11 }} className="track track-vertical" />
)

const View: FC = p => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...p} className="scroll-view" />
)

interface Props {
  className?: string
  noInnerElement?: boolean
}

export const Scroll: FCC<Props> = props => {
  const { className, children, noInnerElement } = props

  return (
    <Scrollbars
      className={classList("scroll", className)}
      renderThumbHorizontal={ThumbHorizontal}
      renderThumbVertical={ThumbVertical}
      renderTrackHorizontal={TrackHorizontal}
      renderTrackVertical={TrackVertical}
      renderView={View}
      >
      {noInnerElement === true
        ? children
        : (
          <div className="scroll-inner">
            {children}
          </div>
        )}
    </Scrollbars>
  )
}
