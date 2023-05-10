const path = require('path');
const fs = require('fs');
const process = require('process');

const pathFolder = path.resolve(__dirname, 'styles');
const pathBundle = path.resolve(__dirname, 'project-dist/bundle.css');

async function mergeStyles(folder){

  try {
    await fs.promises.access(pathBundle);
    await fs.promises.unlink(pathBundle);
    console.log('Existing bundle.css file deleted.');
  } catch (err) {
  }

  const arr = [];
  const files = await fs.promises.readdir(folder, {withFileTypes: true});
  for (const file of files) {
    const ext = path.extname(file.name);
    if (ext === '.css') {
      const pathFile = path.resolve(pathFolder, file.name);
      const stream = fs.createReadStream(pathFile, 'utf-8');
      arr.push(stream);
    }
  }
  const writeStream = fs.createWriteStream(pathBundle, { flags: 'a', encoding: 'utf-8' });
  writeStream.on('error', (err) => console.log(`Error writing to file: ${err}`));
  writeStream.on('finish', () => console.log('Data written to file'));
  arr.forEach((stream) => stream.pipe(writeStream));
}

mergeStyles(pathFolder);