const path = require('path');
const fs = require('fs');

const pathFolder = path.resolve(__dirname, 'secret-folder');

fs.readdir(pathFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    return console.log(`Unable to scan directory: ${err}`);
  }
  files.forEach((file) => {
    if (file.isFile()) {
      const pathFile = path.join(pathFolder, file.name);
      fs.stat(pathFile, (err, stats) => {
        if (err) {
          return console.log(`Unable to get file stats: ${err}`);
        }
        const sizeInBytes = stats.size;
        const { name, ext } = path.parse(file.name);
        const sizeInKb = sizeInBytes / 1024;
        console.log(`${name} - ${ext.slice(1)} - ${sizeInKb}kb`);
      });
    }
  });
});
