const Colyseus = require("colyseus.js");
const { Client } = require('colyseus.js');
const { generateSessionToken, getUserID, getAuthToken } = require('./api');
const { readToken, saveToken } = require('./utils/userToken');
const { connect } = require('./modules/connect');
const openUrl = require('./utils/openUrl');
const prompt = require('prompt-sync')();
const url = 'https://play.pixels.xyz/';
const fs = require('fs');
const { wsConnect } = require("./modules/wsConnect");
let room = null;

(async () => {
  console.log('Starting Pixels Bot');
    let {uEmail, sToken} = await readToken();
    const client = new Colyseus.Client('wss://pixels-server.pixels.xyz');
    const { sessionToken, player } = await generateSessionToken(sToken);

  if(!sessionToken){ 
    console.log('We need a new session token, lets do it!');
    const userID = await getUserID(uEmail);
    const emailID = userID.stytchUser.emails[0].email_id;
    await openUrl(url);
    console.log('The website will open, select email;');
    console.log('Type your email and submit;');
    console.log('Go to mailbox and get the code;');
    const codeMail = prompt('Insert the code here and press enter: ');
    const authToken = await getAuthToken(emailID, codeMail);
  if(!uEmail){
    const uEmail = prompt('Digite o e-mail da conta:');
  }
    saveToken(uEmail, authToken.sessionToken);
    const { sessionToken, player } = await generateSessionToken(authToken.sessionToken);
    sToken = authToken.sessionToken;
  }

  //TODO: check quests
  //TODO: go to sauna
  try{
    room = await connect('pixelsNFTFarm-1501', 55, client, room, sToken);
    await wsConnect(room, client, sToken);
  }catch(e){
    console.error(e);
  }
})();