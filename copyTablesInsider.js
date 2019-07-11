const { promises: { copyFile }, existsSync } = require ("fs")
const { join } = require ("path")

const src_dir = join ("..", "..", "OneDrive", "TDE app", "data", "insider")

const copyL10nTable =
  async locale => {
    const src = join (src_dir, `TDE5_${locale}.xlsx`)
    if (existsSync (src)) {
      const dest = join ("app", "Database", locale, "l10n.xlsx")
      await copyFile (src, dest)
      console.log (`"TDE5_${locale}.xlsx" copied to "${dest}"!`)
    }
  }

module.exports = {
  copyTablesInsider: async () => {
    console.log ("Copy most recent insider tables...")

    const dest = join ("app", "Database", "univ.xlsx")
    await copyFile (join (src_dir, `TDE5.xlsx`), dest)
    console.log (`"TDE5.xlsx" copied to "${dest}"!`)

    await copyL10nTable ("de-DE")
    await copyL10nTable ("en-US")
    await copyL10nTable ("nl-BE")
    await copyL10nTable ("fr-FR")
  }
}
