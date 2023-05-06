const path = require('path');
const fs = require('fs');
const process = require('process');

const pathFolder = path.resolve(__dirname, 'styles');

fs.readdir(pathFolder, (err, files) => {
  const arr = [];
  if (err) {
    return console.log(`Error reading directory: ${err}`);
  }
  for (const file of files) {
    const ext = path.extname(file);
    if (ext === '.css') {
      const pathFile = path.resolve(pathFolder, file);
      const stream = fs.createReadStream(pathFile, 'utf-8');
      arr.push(stream);
    }
  }

  const pathBundle = path.resolve(__dirname, 'project-dist/bundle.css');
  const writeStream = fs.createWriteStream(pathBundle, { flags: 'a', encoding: 'utf-8' });
  writeStream.on('error', (err) => console.log(`Error writing to file: ${err}`));
  writeStream.on('finish', () => console.log('Data written to file'));
  arr.forEach((stream) => stream.pipe(writeStream));
});
