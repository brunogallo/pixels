const { platform } = require('os');
const { exec } = require('child_process');

const WINDOWS_PLATFORM = 'win32';
const MAC_PLATFORM = 'darwin';

async function openUrl(url) {
  const osPlatform = platform();

  if (url === undefined) {
    console.error('Please enter a URL, e.g. "https://play.pixels.xyz/"');
    process.exit(0);
  }

  let command;

  if (osPlatform === WINDOWS_PLATFORM) {
    command = `start microsoft-edge:${url}`;
  } else if (osPlatform === MAC_PLATFORM) {
    command = `open -a "Google Chrome" ${url}`;
  } else {
    command = `google-chrome --no-sandbox ${url}`;
  }

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

module.exports = openUrl;
