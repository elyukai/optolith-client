param([switch]$insider)

$source = "..\..\OneDrive\TDE app\data"
$target = "..\tables"

if($insider) {
  $source = "..\..\OneDrive\TDE app\data\insider"
}

Write-Output "Source: $(Resolve-Path -Path $source)"

$filter = [regex] "^TDE5(?:_[a-z]{2}-[A-Z]{2})?\.xlsx$"

if (!(Test-Path $target -PathType Container)) {
  New-Item -Path $target -ItemType Directory
}

Write-Output "Target: $(Resolve-Path -Path $target)"

Get-ChildItem -Path $target -Include *.* -File | ForEach-Object { $_.Delete() }

$allTables = Get-ChildItem -Path $source | Where-Object {$_.Name -match $filter}

foreach ($item in $allTables) {
  Copy-Item -Path $item.FullName -Destination $target
  Write-Output "Copied $($item.FullName) to $(Resolve-Path -Path $target)"
}

python .\encryptTables.py $target

Write-Output "Table encryption succeeded!"
