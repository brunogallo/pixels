async function getCurrencyBalance(userData, currencyId) {
    try {
        const curObject = userData.coinInventory.find(item => item.currencyId === currencyId);
        return curObject ? curObject.balance : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getCurrencyBalance
};