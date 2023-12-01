async function harvestingPlots(mid, shears, currentRoom) {
    try{
        const harvestAction = {
            "item": {
                "id": shears.item,
                "inventorySlot": shears.slot
            },
            "target": {
                "id": mid,
                "mid": mid,
                "type": "entity"
            }
        };

        await currentRoom.send('useItem', harvestAction);
        console.log(`CLIENT: Harvesting ID: ${mid}`);
    }catch(e){
        console.error(e);
    }
}

module.exports = {
    harvestingPlots
};
