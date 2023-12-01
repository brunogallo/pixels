const { generateSessionToken } = require('../api');

async function connect(themapId, theWorld, client, currentRoom, token = '') {
    let worldJoin = /\d+$/.test(themapId) ? "worldless" : "worldful";
    if(currentRoom){
        await currentRoom.leave(true);
    }

    try {
        const { sessionToken, player } = await generateSessionToken(token);
        const { mapId, world, username, lastSavedAt } = player;
        currentRoom = await client.join(worldJoin, {
        mapId: themapId,
        world: theWorld,
        username,
        lastSavedAt,
        isGuest: false,
        cryptoWallet: {},
        ver: 5.5,
        avatar: '',
        token: sessionToken,
    });

        return currentRoom;
    } catch (e) {
        console.log(e);
    const errorMessages = {
        4597: "Server in Maintenance",
        "room-is-full": "Room is Full",
        "player-is-banned": "Player is Banned",
        "invalid-token": "Invalid Token",
        "player-not-found": "Player not Found",
        "could-not-authenticate": "Could not Authenticate",
        "authentication-expired": "Authentication Expired",
        "invalid-permissions": "Invalid Permissions",
        "no-recaptcha-available": "No Recaptcha Available",
        "invalid-client-version": "Invalid Client Version",
        "transfer-in-progress": "Transfer in Progress",
        "user-already-logged-in": "User Already Logged in",
        "invalid-map": "Invalid Map",
        "invalid-world": "Invalid World",
    };

        const errorMessage = errorMessages[e.code] || errorMessages[e.message];
        console.log("=============================================");
        console.log(errorMessage);
        console.log("=============================================");

        return null;
    }
}

module.exports = {
    connect
};