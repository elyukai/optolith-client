param([switch]$insider)

$source = "..\..\OneDrive\TDE app\data"
$target = "..\tables"

if($insider) {
  $source = "..\..\OneDrive\TDE app\data\insider"
}

$filter = [regex] "TDE5(?:_[a-z]{2}-[A-Z]{2})\.xlsx"

if (!(Test-Path $target -PathType Container)) {
  New-Item -Path $target -ItemType Directory
}

Get-ChildItem -Path $target -Include *.* -File | foreach { $_.Delete()}

$allTables = Get-ChildItem -Path $source | Where-Object {$_.Name -match $filter}

foreach ($item in $allTables) {
  Copy-Item -Path $item.FullName -Destination $target
}

python .\encryptTables.py $target
