const fs = require('fs');
const path = require('node:path');

const pathFile = path.resolve(__dirname, 'text.txt');

const stream = fs.createReadStream(pathFile, 'utf-8');

stream.on('data', (chunk) => {
  console.log(chunk);
});
