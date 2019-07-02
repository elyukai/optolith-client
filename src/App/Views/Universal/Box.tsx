import classNames from "classnames";
import * as React from "react";

export interface BoxProps {
  children?: React.ReactNode
  className?: string
}

// export const Box = styled.div`
//   border: 0.3mm solid black;

//   #belongings .purse .top .labelbox & {
//     width: 28mm;
//     font: 500 10px/3.4mm Alegreya Sans;
//     padding: 0 1mm;
//   }

//   #belongings .purse .top .labelbox.money & {
//     height: 4mm;
//     text-align: center;
//   }

//   #belongings .purse .top .labelbox.specifics & {
//     height: 24mm;
//   }

//   #belongings .carrying-capacity .labelbox & {
//     width: 14mm;
//     height: 8mm;
//     font: bold 21px/8mm Alegreya Sans;
//     letter-spacing: 0.05em;
//     text-align: center;
//   }
// `

export function Box (props: BoxProps) {
  const { children, ...other } = props
  let { className } = props

  className = classNames ("box", className)

  return (
    <div {...other} className={className}>
      {children}
    </div>
  )
}
