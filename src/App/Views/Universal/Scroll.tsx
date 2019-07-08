import * as React from "react";
import Scrollbars from "react-custom-scrollbars";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface ScrollProps {
  children?: React.ReactNode
  className?: string
  noInnerElement?: boolean
}

export function Scroll (props: ScrollProps) {
  const { className, children, noInnerElement, ...other } = props

  return (
    <Scrollbars
      className={classListMaybe (List (Just ("scroll"), Maybe (className)))}
      renderThumbHorizontal={
        p => <div {...p} className="thumb thumb-horizontal"><div/></div>
      }
      renderThumbVertical={
        p => <div {...p} className="thumb thumb-vertical"><div/></div>
      }
      renderTrackHorizontal={
        p => <div {...p} style={{ ...p.style, height: 11 }} className="track track-horizontal" />
      }
      renderTrackVertical={
        p => <div {...p} style={{ ...p.style, width: 11 }} className="track track-vertical" />
      }
      renderView={
        p => <div {...p} className="scroll-view"></div>
      }
      >
      {noInnerElement !== true
        ? (
          <div {...other} className="scroll-inner">
            {children}
          </div>
        )
        : children}
    </Scrollbars>
  )
}
