// @ts-check
const { copy, remove, pathExists } = require ("fs-extra")
const { join, resolve } = require ("path")


/**
 * Copy schemes from one directory to another.
 *
 * @param {string} src_dir Source directory containing all schemes
 * @param {string} dest_dir Destination directory where the contents will be
 * copied to
 */
const copySchema =
  async (src_dir, dest_dir) => {
    if (await pathExists (src_dir)) {
      await remove (dest_dir)
      await copy (src_dir, dest_dir)

      console.log (`"${src_dir}" contents copied to "${dest_dir}"!`)
    }
  }


const copyData =
  async (src_dir) => {
    if (await pathExists (src_dir)) {
      const dest_dir = join ("app", "Database")

      await remove (dest_dir)
      await copy (src_dir, dest_dir)

      console.log (`"${src_dir}" contents copied to "${dest_dir}"!`)
    }
  }


const getStaticData = async () => {
  // @ts-ignore
  const { repository } = require ("./tablesSrc.json")
  const data_src_dir = join (...repository, "Data")
  const schema_src_dir = join (...repository, "Schema")
  console.log ("Copying most recent static data files...")

  await copyData (data_src_dir)
  await copySchema (schema_src_dir, join ("app", "Database", "Schema"))
  await copySchema (schema_src_dir, join ("src", "App", "Utilities", "YAML", "Schema"))

  console.log ("All files copied!")
}


module.exports = {
  getStaticData,
  copySchema
}


// @ts-ignore
if (require.main === module) {
  getStaticData ()
}
