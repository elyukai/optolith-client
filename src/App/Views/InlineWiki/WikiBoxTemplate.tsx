import * as React from "react";
import { Scroll } from "../Universal/Scroll";

export interface WikiBoxTemplateProps {
  children?: React.ReactNode
  className: string
  subtitle?: React.ReactNode
  title: string
}

export const WikiBoxTemplate: React.FC<WikiBoxTemplateProps> = props => {
  const {
    children,
    className,
    subtitle,
    title,
  } = props

  return (
    <Scroll>
      <div className={`info ${className}-info`}>
        <div className={`info-header ${className}-header`}>
          <p className="title">{title}</p>
          {subtitle}
        </div>
        {children}
      </div>
    </Scroll>
  )
}
