param([switch]$insider)

$source = ".\app\Database"

Write-Output "Source: $(Resolve-Path -Path $source)"

python .\encryptTables.py $source

Write-Output "Table encryption succeeded!"
