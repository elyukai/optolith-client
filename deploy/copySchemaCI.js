const { copySchema } = require ("./getStaticData")
const { join } = require ("path")

copySchema (join ("app", "Database", "Schema"), join ("src", "App", "Utilities", "YAML", "Schema"))
copySchema (join ("app", "Database", "Schema"), join ("app", "Database", "Schema"))
