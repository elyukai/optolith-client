type Empty = "EmptyIntSet"

type Node = {
  tag: "IntSetNode"
  value: { l: t; v: number; r: t; h: number }
}

export type t = Empty | Node
