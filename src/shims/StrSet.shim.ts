type Empty = "EmptyStrSet"

type Node = {
  tag: "StrSetNode"
  value: { l: t; v: number; r: t; h: number }
}

export type t = Empty | Node
