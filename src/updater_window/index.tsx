import type { UpdateInfo } from "electron-updater"
import { createRoot } from "react-dom/client"
import { preloadApi } from "./preload.ts"
import { Root } from "./root.tsx"

const domNode = document.getElementById("root")!
const root = createRoot(domNode)

console.log("loaded")
console.log(preloadApi)

preloadApi.on("update-available", (updateInfo: UpdateInfo) => {
  console.log("update sent")
  console.log(updateInfo)
  root.render(<Root updateInfo={updateInfo} />)
})
