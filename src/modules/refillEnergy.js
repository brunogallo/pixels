const { generateSessionToken, getUserID, getAuthToken } = require('../api');
const { readToken } = require('../utils/userToken');
const { Client } = require('colyseus.js');
const Colyseus = require("colyseus.js");
const client = new Colyseus.Client('wss://pixels-server.pixels.xyz');
const { connect } = require('./connect');

async function refillEnergy(playerState, roomData, currentRoom) {
    console.log('Going to Sauna!');
    console.log('=============================================');

    const {uEmail, sToken} = await readToken();
    const { sessionToken, player } = await generateSessionToken(sToken);
    let SaunaRoom = null;

    return new Promise(async (resolve) => {
        try {
            SaunaRoom = await connect('SaunaInterior', 54, client, currentRoom, sToken);
            let playerEnergy = playerState.energy.level;

            async function teleport(index) {
                SaunaRoom.onMessage('updatePlayer', (data) => {
                    const textDecoder = new TextDecoder('iso-8859-1');
                    const decodedString = textDecoder.decode(data);
                    console.log(JSON.parse(JSON.stringify(data)));
                    //console.log('updatePlayer', decodedString);
                    //console.log('updatePlayer', JSON.parse(JSON.stringify(data)));
                    //console.log('updatePlayer 2', JSON.stringify(data));
                    //console.log('updatePlayer serializer', data.serializer);
                });
        
                SaunaRoom.onError((code, message) => {
                    console.log(SaunaRoom.sessionId, "couldn't join", SaunaRoom.name);
                });
        
                SaunaRoom.onLeave((code) => {
                    console.log(SaunaRoom.sessionId, "has left from: ", SaunaRoom.name);
                });

                const energyFree = {
                    "velocity": {"x":0,"y":0},
                    "h": "3024",
                    "position": {"x":3003,"y":3038}
                }

                const energyVip = {
                    "velocity": {"x":0,"y":0},
                    "h": "8034",
                    "position": {"x":3003,"y":2899}
                }
                console.log('a');
                SaunaRoom.send('moveSelfPlayer', energyFree);
                console.log('b');
            }
            await teleport(0);
        } catch (err) {
            console.error(err);
            resolve();
        }
    });
}

module.exports = {
    refillEnergy
};