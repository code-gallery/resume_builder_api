const cpinventoryService = require("../../services/cpinventory.service");
const { to, ReE, TE, ReS } = require("../../services/util.service");


const getInventories = async function (req, res) {
    let err;
    let start = new Date();
    const inventory = req.query;
    [err, inventories] = await to(cpinventoryService.getInventoryStock(inventory));
    if (err) return ReE(res, err, 200);
    return ReS(
        res, inventories, 200, start);
};

module.exports = { getInventories };
