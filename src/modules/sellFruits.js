async function sellFruits(fruits, currentRoom) {
  try{
      const fruitBox = {
        storeId: 'str_bucksGalore',
        itemId: fruits.item,
        quantity: fruits.quantity,
        slot: fruits.slot
      }

      await currentRoom.send('sellStoreItem', fruitBox);
      console.log(`CLIENT: Sold ${fruits.quantity}x ${fruits.item}`);
  }catch(e){
      console.error(e);
  }
}

module.exports = {
  sellFruits
};