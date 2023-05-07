const path = require('path');
const fs = require('fs');
const process = require('process');

// Создаёт папку  **project-dist**
const pathFolderTarget = path.resolve(__dirname, 'project-dist');

fs.stat(pathFolderTarget, (err, stats) => {
    if (err) {
      fs.mkdir(pathFolderTarget, { recursive: true }, (err) => {
        if (err) {
          console.log(`Error creating directory: ${err}`);
        } else {
          console.log('Folder created successfully!');
        }
      });
    } else {
      console.log('Directory already exists');
    }
  });

// Собирает в единый файл стили из папки **styles** и помещает их в файл **project-dist/style.css**.

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

  const pathStyle = path.resolve(__dirname, 'project-dist/style.css');
  const writeStream = fs.createWriteStream(pathStyle, { flags: 'a', encoding: 'utf-8' });
  writeStream.on('error', (err) => console.log(`Error writing to file: ${err}`));
  writeStream.on('finish', () => console.log('Data written to file'));
  arr.forEach((stream) => stream.pipe(writeStream));
});

// Копирует папку **assets** в **project-dist/assets**

const pathFolderAssets = path.resolve(__dirname, 'assets');
const pathFolderCopy = path.resolve(__dirname, 'project-dist/assets');

function copyDir(source, target) {
  fs.readdir(source, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.log(`Error reading directory: ${err}`);
    }
    files.forEach((file) => {
      const pathSource = path.join(source, file.name);
      const pathTarget = path.join(target, file.name);
      if (file.isDirectory()) {
        fs.mkdir(pathTarget, { recursive: true }, (err) => {
          if (err) {
            console.log(`Error creating directory: ${err}`);
          } else {
            console.log(`Directory created: ${pathTarget}`);
            copyDir(pathSource, pathTarget);
          }
        });
      } else if (file.isFile()) {
        fs.copyFile(pathSource, pathTarget, (err) => {
          if (err) throw err;
          console.log(`file ${file.name} was copied to files-copy directory`);
        });
      }
    });
  });
}

fs.stat(pathFolderCopy, (err, stats) => {
  if (err) {
    fs.mkdir(pathFolderCopy, { recursive: true }, (err) => {
      if (err) {
        console.log(`Error creating directory: ${err}`);
      } else {
        console.log('Folder created successfully!');
        copyDir(pathFolderAssets, pathFolderCopy);
      }
    });
  } else {
    console.log('Directory already exists');
    copyDir(pathFolderAssets, pathFolderCopy);
  }
});
