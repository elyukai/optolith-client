import type {
  Character as RawCharacter,
  Character_ID as RawCharacter_ID,
} from "@optolith/character-schema/types"
import Debug from "debug"
import { app } from "electron"
import * as fs from "node:fs/promises"
import * as path from "node:path"
import { prerelease } from "semver"

const debug = Debug("main:saveData")

/**
 * Ensures that the user data path exists and returns it.
 */
export const constructUserDataPath = () => {
  const isPrerelease = prerelease(app.getVersion()) !== null
  const folderName = isPrerelease ? "Optolith Insider" : "Optolith"
  return path.join(app.getPath("appData"), folderName)
}

export const loadCharacters = async (
  userDataPath: string,
): Promise<[id: RawCharacter_ID, data: RawCharacter][]> => {
  try {
    const charactersPath = path.join(userDataPath, "characters")
    debug("Loading characters from %s", charactersPath)
    const characters = await fs.readdir(charactersPath, { withFileTypes: true })
    const characterFolders = characters.filter(character => character.isDirectory())
    debug("%d possible folders found", characterFolders.length)

    return Promise.all(
      characterFolders.map(async characterFolder => {
        const characterId = characterFolder.name
        const characterPath = path.join(charactersPath, characterId, "character.json")
        const characterData = await fs.readFile(characterPath, "utf-8")
        return [characterId, JSON.parse(characterData) as RawCharacter]
      }),
    )
  } catch (error) {
    debug("error during character load: %o", error)
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // If the characters folder does not exist, return an empty array
      return []
    }
    throw error
  }
}

export const saveCharacter = async (
  userDataPath: string,
  characterId: RawCharacter_ID,
  characterData: RawCharacter,
): Promise<void> => {
  const characterFolderPath = path.join(userDataPath, "characters", characterId)
  await fs.mkdir(characterFolderPath, { recursive: true })
  const characterFilePath = path.join(characterFolderPath, "character.json")
  await fs.writeFile(characterFilePath, JSON.stringify(characterData), "utf-8")
}
