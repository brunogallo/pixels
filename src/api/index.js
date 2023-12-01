const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function getUserID(email) {
  try {
    const res = await fetch('https://pixels-server.pixels.xyz/v1/auth/check/stytch_user?email=' + email, {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'sec-ch-ua':
        '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        Referer: 'https://play.pixels.xyz/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      method: 'GET',
    });

    if (res.status === 200) {
      const json = await res.json();
      return json;
    } else {
      throw new Error(`Failed to get user ID. Status: ${res.status}`);
    }
  } catch (error) {
    console.error('Error getting user ID:', error.message);
    throw error;
  }
}

async function getAuthToken(emailID, theCode) {
  try {
    const res = await fetch('https://pixels-server.pixels.xyz/v1/auth/complete_onetime_authentication', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'sec-ch-ua':
        '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        Referer: 'https://play.pixels.xyz/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: JSON.stringify({
        id: emailID,
        code: theCode,
        mapId: "",
        tenant: "pixels"
      }),
      method: 'POST',
    });

    if (res.status === 200) {
      const json = await res.json();
      return json;
    } else {
      const json = await res.json();
      throw new Error(`Failed to get Auth Token. Status: ${json.error_message}`);
    }
  } catch (error) {
    console.error('Error getting Auth Token:', error.message);
    throw error;
  }
}

async function generateSessionToken(token) {
  try {
    const res = await fetch('https://pixels-server.pixels.xyz/v1/auth/initialize', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'sec-ch-ua':
        '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        Referer: 'https://play.pixels.xyz/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: JSON.stringify({
        authToken: token,
        tenant: "pixels",
        mapId: "",
        walletProvider: "otpc",
        ver: ":5.5"
      }),
      method: 'POST',
    });

    if (res.status === 200) {
      const json = await res.json();
      return json;
    } else {
      const json = await res.json();

      if(json === 'authentication-failed'){
        return json;
      }else{
        throw new Error(`Failed to get Session Token. Status: ${json}`);
      }
    }
  } catch (error) {
    console.error('Error getting Session Token:', error.message);
    throw error;
  }
}

module.exports = {
  fetch,
  getUserID,
  getAuthToken,
  generateSessionToken,
};