const fs = require('fs/promises');
const path = require('path');

async function readToken() {
  try {
    const filePath = path.resolve(__dirname, 'token.txt');
    const data = await fs.readFile(filePath, 'utf8');
    const linhas = data.split('\n');
    const primeiraLinha = linhas[0].trim();
    const [email, sessiontoken] = primeiraLinha.split(':');
    return { uEmail: email, sToken: sessiontoken };
  } catch (err) {
    console.error('Error reading token:', err);
    return { uEmail: null, sToken: null };
  }
}

async function saveToken(email, sessionToken) {
  try {
    const filePath = path.resolve(__dirname, 'token.txt');
    const data = `${email}:${sessionToken}\n`;
    await fs.writeFile(filePath, data, 'utf8');
    console.log('New token saved successfully.');
  } catch (err) {
    console.error('Error saving token:', err);
  }
}

module.exports = {
  readToken,
  saveToken,
};