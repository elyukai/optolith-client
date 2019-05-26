import { writeFile } from 'fs';
import sass from 'sass';

sass .render (
  { file: 'src/Main.scss', outputStyle: 'compressed' },
  (err, result) => {
    if (err) {
      throw err;
    }

    writeFile ('app/main.css', result.css, err => {
      if (err) {
        throw err;
      }

      console.log('SCSS successfully bundled!');
    })
  })
