type Empty = "EmptySet"

type Node = {
  tag: "Node"
  value: { l: t; v: number; r: t; h: number }
}

export type t = Empty | Node
