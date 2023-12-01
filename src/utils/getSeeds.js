async function getSeeds(playerInventory, playerLevel) {
    const seedsPerLevel = [
        { maxLevel: 1, seed: 'itm_popberrySeeds', fruit: 'itm_popberryFruit', buyPrice: 1 },
        { maxLevel: 5, seed: 'itm_butterberryseeds', fruit: 'itm_butterberry', buyPrice: 1 },
        { maxLevel: 11, seed: 'itm_grainseeds', fruit: 'itm_grainbow', buyPrice: 3 },
        { maxLevel: Infinity, seed: 'itm_wintermintSeeds', fruit: 'itm_wintermintFruit', buyPrice: 12 }
    ];

    const recommendedSeed = seedsPerLevel.find(range => playerLevel <= range.maxLevel) || seedsPerLevel[seedsPerLevel.length - 1];
    const defaultSeed = { slot: 0, item: recommendedSeed.seed, quantity: 0 };
    const defaultFruits = { slot: 0, item: recommendedSeed.fruit, quantity: 0 };

    const seedsFilter = Object.values(playerInventory).find(item => item.item === recommendedSeed.seed) || defaultSeed;
    const fruitsFilter = Object.values(playerInventory).find(item => item.item === recommendedSeed.fruit) || defaultFruits;

    return {
        seeds: seedsFilter,
        fruits: fruitsFilter,
        buyPrice: recommendedSeed.buyPrice
    };
}

module.exports = {
    getSeeds
};