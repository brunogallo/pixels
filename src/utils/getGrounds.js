function getGrounds(data) {
    try {
        const grounds = Object.values(data)
            .filter(item => item.entity === "ent_soil" || (item.entity && item.entity.includes("ent_crop")));
        return grounds;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getGrounds
};
