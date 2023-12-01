async function landAction(landPlots, actionFunction, tool, currentRoom) {
    if (landPlots && Array.isArray(landPlots)) {
        for (const item of landPlots) {
            if(tool.item === 'itm_rustyWateringCan' && item.crop.canHarvest === false && item.crop.state === 'seed' && item.crop.waterLevel < 50){
                await actionFunction(item.mid, wateringCan, currentRoom);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }else if(tool.item === 'itm_shears' && item.crop.canHarvest === true && item.crop.state === 'ripe'){
                await actionFunction(item.mid, shears, currentRoom);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }else if(tool.item && tool.quantity > 1){
                await actionFunction(item.mid, tool, currentRoom);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
}

module.exports = {
    landAction
};