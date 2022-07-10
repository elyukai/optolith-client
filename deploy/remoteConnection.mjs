// @ts-check
import { join } from "path"
import { join as joinPosix } from "path/posix"
import Client from "ssh2-sftp-client"

/**
 * @param {Client.ConnectOptions} options
 * @param {(client: Client) => Promise<void>} action
 */
export const run = async (options, action) => {
  const client = new Client()
  console.log("Connecting to server ...")
  await client.connect(options)
  console.log(`Server connection established.`)
  await action(client)
  await client.end ()
  console.log("Closed server connection.")
}

/**
 * @param {Client} client
 * @param {string} localDir
 * @param {string} remoteDir
 * @param {string} fileName
 */
export const upload = async (client, localDir, remoteDir, fileName) => {
  console.log(`Uploading ${fileName} ...`);

  await client.fastPut (
    join (localDir, fileName),
    joinPosix (remoteDir, fileName),
    {
      step: !process.env.CI ? (totalTransferred, _, total) => {
        const percent = Math.floor (totalTransferred / total * 100)
        console.log(`Progress: ${percent}%`);
      } : undefined
    }
  )

  console.log(`Upload done: ${fileName}.`);
}
