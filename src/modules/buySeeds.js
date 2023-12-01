async function buySeeds(seeds, playerTokens, buyPrice, currentRoom) {
  let qtd = Math.floor(await playerTokens / buyPrice);
  if(qtd > 60){qtd = 60;}

  try{
      const seedsBox = {
        storeId: 'str_bucksGalore',
        itemId: seeds.item,
        quantity: qtd
      }

      await currentRoom.send('buyStoreItem', seedsBox);
      console.log(`CLIENT: Bought ${qtd}x ${seeds.item}`);
  }catch(e){
      console.error(e);
  }
}

module.exports = {
  buySeeds
};