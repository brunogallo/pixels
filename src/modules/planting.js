async function plantingPlots(mid, seeds, currentRoom) {
    if(seeds.quantity > 0){
        try{
            const plantingAction = {
                "item": {
                    "id": seeds.item,
                    "inventorySlot": seeds.slot
                },
                "target": {
                    "id": mid,
                    "mid": mid,
                    "type": "entity"
                }
            };
    
            await currentRoom.send('useItem', plantingAction);
            console.log(`CLIENT: Planting seed on ID: ${mid}`);
        }catch(e){
            console.error(e);
        }
    }
}

module.exports = {
    plantingPlots
};