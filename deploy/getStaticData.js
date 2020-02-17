const { copy, remove, existsSync } = require ("fs-extra")
const { join } = require ("path")
const { repository } = require ("./tablesSrc.json")


const src_dir = join (...repository, "Schema")


/**
 * Copy schemes from one directory to another.
 *
 * @param {string} src_dir Source directory containing all schemes
 * @param {string} dest_dir Destination directory where the contents will be
 * copied to
 */
export const copySchema =
  async (src_dir, dest_dir) => {
    const src = join (src_dir)

    if (existsSync (src)) {
      await remove (dest_dir)
      await copy (src, dest_dir)

      console.log (`"${src}" contents copied to "${dest_dir}"!`)
    }
  }


const copyData =
  async () => {
    const src = join (src_dir, "Data")

    if (existsSync (src)) {
      const dest = join ("app", "Database")

      await remove (dest)
      await copy (src, dest)

      console.log (`"${src}" contents copied to "${dest}"!`)
    }
  }


const getStaticData = async () => {
  console.log ("Copying most recent static data files...")

  await copyData ()
  await copySchema (src_dir, join ("app", "Database", "Schema"))
  await copySchema (src_dir, join ("src", "App", "Utilities", "YAML", "Schema"))

  console.log ("All files copied!")
}


module.exports = {
  getStaticData
}


if (require.main === module) {
  getStaticData ()
}
