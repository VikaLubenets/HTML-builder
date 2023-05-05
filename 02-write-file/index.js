const process = require('process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pathFile = path.resolve(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(pathFile, { flags: 'a', encoding: 'utf-8' });

console.log('Введите, пожалуйста, сообщение, которое нужно записать в файл text.txt');

readLine.on('line', (input) => {
  if (input === 'exit') {
    console.log('Выполнение программы завершено');
    writeStream.end();
    process.exit();
  }
  writeStream.write(`${input}\n`);
});

readLine.on('SIGINT', () => {
  console.log('Выполнение программы завершено');
  writeStream.end();
  process.exit();
});

process.on('SIGINT', () => {
  console.log('Выполнение программы завершено');
  writeStream.end();
  process.exit();
});