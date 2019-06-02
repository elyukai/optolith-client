import * as React from "react";

export interface PageProps {
  children?: React.ReactNode
  id?: string
}

export function Page (props: PageProps) {
  const { children, id } = props

  return (
    <div className="page" id={id}>
      {children}
    </div>
  )
}
