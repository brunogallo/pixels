async function wateringPlots(mid, wateringCan, currentRoom) {
    try{
        const wateringAction = {
            "item": {
                "id": wateringCan.item,
                "inventorySlot": wateringCan.slot
            },
            "target": {
                "id": mid,
                "mid": mid,
                "type": "entity"
            }
        };

        await currentRoom.send('useItem', wateringAction);
        console.log(`CLIENT: Watering ground on ID: ${mid}`);
    }catch(e){
        console.error(e);
    }
}

module.exports = {
    wateringPlots
};