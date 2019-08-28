// @ts-check
const { promises: { copyFile }, existsSync } = require ("fs")
const { join } = require ("path")

const copyL10nTable =
  /**
   * @param src_dir {string}
   * @param locale {string}
   */
  async (src_dir, locale) => {
    const src = join (src_dir, `TDE5_${locale}.xlsx`)
    if (existsSync (src)) {
      const dest = join ("app", "Database", locale, "l10n.xlsx")
      await copyFile (src, dest)
      console.log (`"TDE5_${locale}.xlsx" copied to "${dest}"!`)
    }
  }

module.exports = {
  copyTables: async () => {
    console.log ("Copy most recent insider tables...")
    // @ts-ignore
    const { stable } = require ("./tablesSrc.json")
    const src_dir = join (...stable)

    const dest = join ("app", "Database", "univ.xlsx")
    await copyFile (join (src_dir, `TDE5.xlsx`), dest)
    console.log (`"TDE5.xlsx" copied to "${dest}"!`)

    await copyL10nTable (src_dir, "de-DE")
    await copyL10nTable (src_dir, "en-US")
    await copyL10nTable (src_dir, "nl-BE")
    await copyL10nTable (src_dir, "fr-FR")
  },
  copyTablesInsider: async () => {
    console.log ("Copy most recent insider tables...")
    // @ts-ignore
    const { insider } = require ("./tablesSrc.json")
    const src_dir = join (...insider)

    const dest = join ("app", "Database", "univ.xlsx")
    await copyFile (join (src_dir, `TDE5.xlsx`), dest)
    console.log (`"TDE5.xlsx" copied to "${dest}"!`)

    await copyL10nTable (src_dir, "de-DE")
    await copyL10nTable (src_dir, "en-US")
    await copyL10nTable (src_dir, "nl-BE")
    await copyL10nTable (src_dir, "fr-FR")
  }
}
