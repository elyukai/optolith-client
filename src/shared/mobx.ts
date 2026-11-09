import { getDependencyTree } from "mobx"

export const printDependencyTree = (object: object, property: string) => {
  const tree = getDependencyTree(object, property)

  const printTree = (node: typeof tree, depth: number) => {
    const indent = "  ".repeat(depth)
    console.log(`${indent}${node.name}`)
    if (node.dependencies) {
      node.dependencies.slice(0, 4).forEach(childNode => printTree(childNode, depth + 1))
      if (node.dependencies.length > 4) {
        console.log(`${indent}  ...and ${node.dependencies.length - 4} more dependencies`)
      }
    }
  }

  printTree(tree, 0)
}
