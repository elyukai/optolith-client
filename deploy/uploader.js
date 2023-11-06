// @ts-check
import { join } from "path"
import { join as joinPosix } from "path/posix"
import Client from "ssh2-sftp-client"

/**
 * Create a new sftp/ssh client and use it for the callback. The connection will
 * be cleaned up afterwards.
 * @param {Client.ConnectOptions} options
 * @param {(client: Client) => Promise<void>} action
 */
export const run = async (options, action) => {
  const client = new Client()
  console.log("Connecting to server ...")
  await client.connect(options)
  console.log(`Server connection established.`)
  await action(client)
  await client.end()
  console.log("Closed server connection.")
}

/**
 * Uploads a file from a local directory to a remote directory using the given
 * client.
 * @param {Client} client
 * @param {string} localDir
 * @param {string} remoteDir
 * @param {string} fileName
 */
export const upload = async (client, localDir, remoteDir, fileName) => {
  console.log(`Uploading ${fileName} ...`)

  let didStep = false

  await client.fastPut(join(localDir, fileName), joinPosix(remoteDir, fileName), {
    step: !process.env.CI
      ? (totalTransferred, _, total) => {
          if (didStep) {
            process.stdout.clearLine(0)
            process.stdout.cursorTo(0)
          } else {
            didStep = true
          }
          const percent = Math.floor((totalTransferred / total) * 100)
          process.stdout.write(`Progress: ${percent}%`)
        }
      : undefined,
  })

  console.log(`Upload done: ${fileName}`)
}
