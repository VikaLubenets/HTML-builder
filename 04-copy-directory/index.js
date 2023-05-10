const path = require('path');
const fs = require('fs');

const pathFolderCurr = path.resolve(__dirname, 'files');
const pathFolderTarget = path.resolve(__dirname, 'files-copy');

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

fs.rm(pathFolderTarget, { recursive: true, force: true }, (err) => {
  if (err) {
    console.log(`Error deleting folder: ${err}`);
  } else {
    fs.mkdir(pathFolderTarget, { recursive: true }, (err) => {
      if (err) {
        console.log(`Error creating folder: ${err}`);
      } else {
        console.log('Folder created successfully!');
        copyDir(pathFolderCurr, pathFolderTarget);
      }
    });
  }
});