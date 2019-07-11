const { promises: { copyFile }, existsSync } = require ("fs")
const { join } = require ("path")

const src_dir = join ("..", "..", "OneDrive", "TDE app", "data")

const copyL10nTable =
  async locale => {
    const src = join (src_dir, `l10n_${locale}.xlsx`)
    if (existsSync (src)) {
      const dest = join ("app", "Database", locale, "l10n.xlsx")
      await copyFile (src, dest)
      console.log (`"l10n_${locale}.xlsx" copied to "${dest}"!`)
    }
  }

module.exports = {
  copyTables: async () => {
    console.log ("Copy most recent tables...")

    const dest = join ("app", "Database", "univ.xlsx")
    await copyFile (join (src_dir, `univ.xlsx`), dest)
    console.log (`"univ.xlsx" copied to "${dest}"!`)

    await copyL10nTable ("de-DE")
    await copyL10nTable ("en-US")
    await copyL10nTable ("nl-BE")
    await copyL10nTable ("fr-FR")
  }
}
