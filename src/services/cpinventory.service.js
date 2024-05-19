const { to, TE } = require("./util.service");
const Models = require("../models/model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const dbConnection = require("../data/database/db");
const _ = require("lodash");
const CommonService = require("./common.service");


const getInventoryStock = async (inventory) => {
    let limit = 10;
    inventoryQuery = {
        where: {},
        raw: true,
    };

    inventoryQuery.limit = limit;
    // if (_.isEmpty(inventory)) TE("Params are not set");
    let page = inventory.pageNumber != 0 ? inventory.pageNumber : 1;
    inventoryQuery.offset = (page - 1) * limit;
    inventoryQuery.raw = true;

    let [err, order] = await to(
        Models[process.env.BC_DB_NAME + '$Item Ledger Entry'].count(inventoryQuery)
    );

    if (err) TE(err.message);

    let query = "SELECT sum([Quantity]) as quantity,[Item No_] as item_code,[Variant Code] as size FROM [dbo].[" + process.env.BC_DB_NAME + "$Item Ledger Entry] " +
        "GROUP BY [Item No_],[Variant Code]";

    query += " ORDER BY [Item No_] DESC";

    query += " OFFSET " + (page - 1) * limit + " ROWS FETCH NEXT " + limit + " ROWS ONLY"

    try {

        const inventoryCounts = await dbConnection.query(query);

        var items = []
        await Promise.allSettled(
            /*
                This loop will fetch the 
               */
            inventoryCounts[0].map(async (product, index) => {


                [err, item] = await to(
                    Models[process.env.BC_DB_NAME + '$Item'].findOne({
                        where: { 'No_': product['item_code'], 'Product website Code' :inventory },
                        include: {
                            model: Models[process.env.BC_DB_NAME + '$Item Attributes'],
                            required: false
                        }
                    })
                );
                items.push({ ...product, 'product': item.dataValues })

                //console.log('item',items);

                return items;

            })).then(async result => {
                // console.log(items);
            }
            )
        paginationOutPut = await CommonService.paginationOutPut(
            items,
            page,
            limit,
            order.count
        );
        return paginationOutPut;

    } catch (error) {
        throw new Error(error);
    }


};


module.exports = { getInventoryStock };
