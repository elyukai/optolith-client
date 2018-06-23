import fs from 'fs';

fs.readFile('src/locales/ui.de-DE.json', (err, raw) => {
  if (err) throw err;

  const data = JSON.parse(raw);

  const final = Object.entries(data).map(([key, value]) => {
    const convertedValue = typeof value === 'string' ? value : value.join('&&');

    return [
      key,
      convertedValue
    ];
  });

  fs.writeFile('src/locales/ui.de-DE.converted.json', JSON.stringify(final), (err) => {
    if (err)  throw err;
  });
});
