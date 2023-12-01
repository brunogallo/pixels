const Colyseus = require("colyseus.js");
const { SchemaSerializer } = require('colyseus.js');
const { getCurrencyBalance } = require('../utils/getCurrency');
const { getGrounds } = require('../utils/getGrounds');
const { getTools } = require('../utils/getTools');
const { getSeeds } = require('../utils/getSeeds');
const { landAction } = require('../utils/landAction');
const { harvestingPlots } = require('../modules/harvesting');
const { wateringPlots } = require('../modules/watering');
const { plantingPlots } = require('../modules/planting');
const { sellFruits } = require('../modules/sellFruits');
const { buySeeds } = require('../modules/buySeeds');

const JOIN_ROOM_MESSAGE = 'joinRoom';

async function wsConnect(currentRoom) {
    if (!currentRoom) {
        console.log('Failed to join the room. Check the error messages above.');
        return;
    }

    let playerState,
    roomData,
    playerEnergy,
    playerFarmPlots,
    playerFarmingLevel,
    playerInventory,
    playerQuests,
    playerTokens,
    playerTrustScore,
    playerAvatar,
    playerCurrentAvatar,
    mapPlots;

    const playerSerializer = new SchemaSerializer();

    function handleStateChange(data) {
        roomData = data;
        mapStateParsed = JSON.parse(JSON.stringify(data));
        playerTrustScore = mapStateParsed?.trustScore;
        mapPlots = getGrounds(mapStateParsed.entities);
    }
    
    function handleJoinRoom(data) {
        playerSerializer.handshake(data.handshake);
        playerSerializer.setState(data.serialPlayer);
        playerState = playerSerializer.getState();
        playerStateParsed = JSON.parse(JSON.stringify(playerState));
        playerFarmingLevel = playerStateParsed?.levels?.farming?.level;
        playerInventory = playerStateParsed?.inventory;
        playerQuests = playerStateParsed?.quests;
        playerEnergy = playerStateParsed?.energy?.level;
        playerFarmPlots = getGrounds(playerStateParsed?.entities);
        playerTokens = getCurrencyBalance(playerStateParsed, 'cur_berry');
    
        console.log("=============================================");
        console.log('SERVER: Welcome to', data.config.id);
        console.log("=============================================");
        return playerState;
    }
    
    function handleUpdatePlayer(data) {
        playerSerializer?.patch(data);
        playerStates = playerSerializer.getState();
        playerStateParsed = JSON.parse(JSON.stringify(playerStates));
        playerFarmingLevel = playerStateParsed?.levels?.farming?.level;
        playerInventory = playerStateParsed?.inventory;
        playerQuests = playerStateParsed?.quests;
        playerEnergy = playerStateParsed?.energy?.level;
        playerFarmPlots = getGrounds(playerStateParsed?.entities);
        playerTokens = getCurrencyBalance(playerStateParsed, 'cur_berry');
    }
    
    function handleUseItem(data) {
        const useItemNotification = JSON.parse(JSON.stringify(data));
        const useItemNotificationMap = {
            'coins': 'Token Berrys',
            'itm_rustyWateringCan': 'Watering Can',
            'itm_shears': 'Shears',
            'itm_popberryseeds': 'PopBerry Seeds',
            'itm_butterberryseeds': 'ButterBerry Seeds',
            'itm_grainbowseeds': 'ButterBerry Seeds',
            'itm_wintermintseeds': 'ButterBerry Seeds',
            'itm_popberryFruit': 'PopBerry Fruit',
            'itm_butterberry': 'ButterBerry Fruit',
            'itm_grainbow': 'ButterBerry Fruit',
            'itm_wintermintFruit': 'ButterBerry Fruit',
            'itm_gameticket': 'Game Ticket',
        };
        
        const sourceItemNotificationMapMap = {
            'coin': 'Got',
            'item': 'Got',
        };

        const itemName = useItemNotificationMap[useItemNotification.item.id] || useItemNotification.item.id;
        console.log(`SERVER: Using ${itemName}`);
    }
    
    function handlePlayerNotification(data) {
        const notificationItem = JSON.parse(JSON.stringify(data));

        const itemDisplayNameMap = {
            'coins': 'Token Berrys',
            'itm_popberryseeds_name': 'PopBerry Seeds',
            'itm_butterberryseeds_name': 'ButterBerry Seeds',
            'itm_grainbowseeds_name': 'ButterBerry Seeds',
            'itm_wintermintseeds_name': 'ButterBerry Seeds',
            'itm_popberryFruit_name': 'PopBerry Fruit',
            'itm_butterberry_name': 'ButterBerry Fruit',
            'itm_grainbow_name': 'ButterBerry Fruit',
            'itm_wintermintFruit_name': 'ButterBerry Fruit',
            'itm_gameticket_name': 'Game Ticket',
        };
        
        const sourceDisplayNameMap = {
            'coin': 'Got',
            'item': 'Got',
        };
        
        const source = sourceDisplayNameMap[notificationItem.source] || notificationItem.source;
        const itemName = itemDisplayNameMap[notificationItem.text.name] || notificationItem.text.name;
        console.log(`SERVER: ${source} ${notificationItem.text.count}x ${itemName}`);
    }
    
    currentRoom.onStateChange(handleStateChange);
    
    const roomDataPromise = new Promise((resolve) => {
        currentRoom.onStateChange((data) => {
            handleStateChange(data);
            resolve();
        });
    });
    
    const roomJoinPromise = new Promise((resolve) => {
        currentRoom.onMessage(JOIN_ROOM_MESSAGE, (data) => {
            resolve(handleJoinRoom(data));
        });
    });
    
    currentRoom.onMessage('updatePlayer', handleUpdatePlayer);
    currentRoom.onMessage('useItem', handleUseItem);
    currentRoom.onMessage('playerNotification', handlePlayerNotification);

    currentRoom.onMessage('*', (data) => {
        switch (data) {
            case 'updatePlayer':
                //playerSerializer?.patch(currentRoom);
                //playerState = playerSerializer.getState();
                //console.log('Energy: ', playerStates.energy.level);
                break;
            case 'talkToNPC':
                //o.ZP.sendEvent(o.fb.NPC_SPEAKS, t);
                console.log('talkToNPC');
                break;
            case 'receiveMessageInChat':
                //o.ZP.sendEvent(o.fb.CHAT_MESSAGE_RCV, { ...t, whisper: true });
                console.log('receiveMessageInChat');
                break;
            case 'getCraftingResult':
                    //o.ZP.sendEvent(o.fb.GET_CRAFTING_RESULT_COMPLETED, t);
                    console.log('getCraftingResult');
                    break;
            case 'startCrafting':
                //o.ZP.sendEvent(o.fb.START_CRAFTING_ERROR, t),
                console.log('startCrafting');
                break;
            case 'buildObject':
                console.log('buildObject');
                break;
            case 'buildTile':
                console.log('buildTile');
                break;
            case 'useItem':
                console.log('useItem');
                break;
            case 'useItemError':
                console.log('useItemError');
                break;
            case 'teleportPlayer':
                console.log('teleportPlayer');
                break;
            case 'playerAction':
                console.log('playerAction');
                break;
            case 'playerNotification':
                console.log('playerNotification');
                break;
            case 'clientCmd':
                console.log('clientCmd');
                //o.ZP.sendEvent(o.fb.CLIENT_CMD, t);
                break;
            case 'presentUI':
                console.log('presentUI');
                //o.ZP.sendEvent(o.fb.PRESENT_UI, t);
                break;
            case 'trade':
                console.log('trade');
                //o.ZP.sendEvent(o.fb.TRADE_RECEIVE, t);
                break;
            case 'marketplace':
                console.log('marketplace');
                //o.ZP.sendEvent(o.fb.MARKETPLACE_RECEIVE, t);
                break;
            case 'setAvatar':
                console.log('setAvatar');
                //o.ZP.sendEvent(o.fb.PLAYER_AVATAR, t);
                break;
            case 'bookmarkMap':
                console.log('bookmarkMap');
                //o.ZP.sendEvent(o.fb.BOOKMARK_MAP, t);
                break;
            case 'fetchMailbox':
                console.log('fetchMailbox');
                //o.ZP.sendEvent(o.fb.RECEIVE_MAIL, t);
                break;
            case 'collectMailboxItem':
                console.log('collectMailboxItem');
                //o.ZP.sendEvent(o.fb.COLLECT_MAIL_ITEM_RESPONSE, t);
                break;
            case 'findNFTs':
                console.log('findNFTs');
                //o.ZP.sendEvent(o.Yi.FOUND_NFT, t);
                break;
            case 'timeSync':
                //console.log('timeSync');
            default:
                //console.warn("SERVER: Unhandled server message", data)
        }
    });

    currentRoom.onMessage('useItemError', (data) => {
        const errorITem = JSON.parse(JSON.stringify(data));
        console.log(errorITem.message);
    });

    currentRoom.onError((code, message) => {
        console.log('SERVER: ', currentRoom.sessionId, "couldn't join", currentRoom.name);
    });

    currentRoom.onLeave((code) => {
        console.log('SERVER: ', currentRoom.sessionId, "has left from: ", currentRoom.name);
    });

    try {
        await Promise.all([roomDataPromise, roomJoinPromise]);
        wateringCan = await getTools(playerInventory.slots, 'itm_rustyWateringCan');
        shears = await getTools(playerInventory.slots, 'itm_shears');
        const { seeds, fruits, buyPrice } = await getSeeds(playerInventory.slots, playerFarmingLevel, currentRoom);
        const landPlots = await mapPlots;
        const playerPlots = await playerFarmPlots;
    
        //TODO: go to sauna
        //TODO: enchance energy check
        async function performActions() {
            while (playerEnergy !== 0) {
                await landAction(playerPlots, wateringPlots, wateringCan, currentRoom);
                await landAction(playerPlots, harvestingPlots, shears, currentRoom);

                if (seeds && seeds.quantity !== 0) {
                    await landAction(landPlots, plantingPlots, seeds, currentRoom);
                } else if(fruits && fruits.quantity !== 0){
                    await sellFruits(fruits, currentRoom);
                }else{
                    await buySeeds(seeds, playerTokens, buyPrice, currentRoom);
                }
                await new Promise(resolve => setTimeout(resolve, 300000));
            }
        }
        await performActions();
    } catch (error) {
        console.error("Error fetching MapFarmPlots:", error);
    }

    //TODO: easy content
    //playerAvatar = mapState.players.YuzxFDYiK.playerAvatar;
    //playerCurrentAvatar = mapState.players.YuzxFDYiK.currentAvatar
    //playerTrustScore = mapState.trustScore
    //mapPlots = mapState.entities
    //console.log(playerFarmingLevel);
    //console.log(playerInventory);
    //console.log(playerQuests);
    //console.log(playerEnergy);
    //console.log(playerFarmPlots);
    //console.log(mapPlots);
    //console.log(playerTokens);
}


module.exports = {
    wsConnect
};
