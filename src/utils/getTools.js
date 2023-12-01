async function getTools(playerInventory, tool) {
    const inventoryArray = Object.values(playerInventory);
    const foundItem = inventoryArray.find(item => item.item === tool);

    if (foundItem) {
        return {
            slot: foundItem.slot,
            item: foundItem.item,
            quantity: foundItem.quantity
        };
    } else {
        console.error(`CLIENT: ${tool} not found in inventory.`);
        return null;
    }
}

module.exports = {
    getTools
};