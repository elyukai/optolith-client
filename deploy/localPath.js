// @ts-check
import { join } from "path"

/**
 * @param {"prerelease" | "stable"} channel
 */
export const getLocalPath = channel => {
  switch (channel) {
    case "prerelease": return join("dist", "insider")
    case "stable":     return join("dist")
  }
}
