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


const copyL10n =
  async locale => {
    const src = join (src_dir, "Data", locale)

    if (existsSync (src)) {
      const dest = join ("app", "Database", locale)

      await remove (dest)
      await copy (src, dest)

      console.log (`"${src}" contents copied to "${dest}"!`)
    }
  }


const getStaticData = async () => {
  console.log ("Copying most recent static data files...")

  await copySchema (join ("app", "Database", "Schema"))
  await copySchema (join ("src", "App", "Utilities", "YAML", "Schema"))

  await copyL10n ("univ")
  await copyL10n ("de-DE")
  await copyL10n ("en-US")
  await copyL10n ("nl-BE")
  await copyL10n ("fr-FR")

  console.log ("All files copied!")
}


module.exports = {
  getStaticData
}


if (require.main === module) {
  getStaticData ()
}
