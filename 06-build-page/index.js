const path = require('path');
const fs = require('fs');

// Создаёт папку  **project-dist**
const pathFolderTarget = path.resolve(__dirname, 'project-dist');

fs.stat(pathFolderTarget, (err, stats) => {
  if (err) {
    fs.mkdir(pathFolderTarget, { recursive: true }, (err) => {
      if (err) {
        console.log(`Error creating directory: ${err}`);
      } else {
        console.log('Folder project-dist created successfully!');
      }
    });
  } else {
    console.log('Directory project-dist already exists');
  }
});

// Собирает в единый файл стили из папки **styles** и помещает их в файл **project-dist/style.css**.

const pathFolder = path.resolve(__dirname, 'styles');

fs.readdir(pathFolder, (err, files) => {
  const arr = [];
  if (err) {
    return console.log(`Error reading directory styles: ${err}`);
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
  writeStream.on('error', (err) => console.log(`Error writing to file style: ${err}`));
  writeStream.on('finish', () => console.log('Data written to file style'));
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
          console.log(`file ${file.name} was copied to assets directory`);
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
        console.log('Folder project-dist/assets created successfully!');
        copyDir(pathFolderAssets, pathFolderCopy);
      }
    });
  } else {
    console.log('Directory project-dist/assets already exists');
    copyDir(pathFolderAssets, pathFolderCopy);
  }
});

// Замена тэгов в файле **template.html** на содержимое одноимённых компонентов

const sourceFolder = path.resolve(__dirname, 'components');
const targetFolder = path.resolve(__dirname, 'project-dist');
const targetFile = path.resolve(__dirname, 'project-dist/index.html');
const templateFile = path.resolve(__dirname, 'template.html');

fs.stat(targetFile, (err, stats) => {
  if (err) {
    console.log('File index.html already exists!');
  } else {
    console.log('File index.html created successfully');
    copyDir(templateFile, targetFile);
  }
});

async function buildPage() {
  try {
    const files = await fs.promises.readdir(sourceFolder, { withFileTypes: true });
    let template = await fs.promises.readFile(templateFile, 'utf-8');
    for (const file of files) {
      const ext = path.extname(file.name);
      if (ext === '.html') {
        const pathSource = path.join(sourceFolder, file.name);
        const componentName = path.parse(file.name).name;
        const component = await fs.promises.readFile(pathSource, 'utf-8');
        template = template.split(`{{${componentName}}}`).join(component);
      } else {
        console.log(`Skipping file with extension ${ext}`);
      }
    }
    await fs.promises.mkdir(targetFolder, { recursive: true });
    await fs.promises.writeFile(targetFile, template, 'utf-8');
    console.log('index.html created successfully');
  } catch (err) {
    console.log(err);
  }
}

buildPage();
