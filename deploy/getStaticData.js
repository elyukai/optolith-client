const { copy, remove, existsSync } = require ("fs-extra")
const { join } = require ("path")
const { repository } = require ("./tablesSrc.json")


const src_dir = join (...repository)


const copySchema =
  async dest => {
    const src = join (src_dir, "Schema")

    if (existsSync (src)) {
      await remove (dest)
      await copy (src, dest)

      console.log (`"${src}" contents copied to "${dest}"!`)
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
  await copySchema (join ("app", "Database", "Schema"))
  await copySchema (join ("src", "App", "Utilities", "YAML", "Schema"))

  console.log ("All files copied!")
}


module.exports = {
  getStaticData
}


if (require.main === module) {
  getStaticData ()
}
