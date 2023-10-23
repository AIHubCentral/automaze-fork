const dbManager = require('./database/dbManager.js');

const knex = dbManager.createInstance('./database/db.sqlite');

(async () => {
    try {
        const data = {
            users: [
                { id: '0000', name: 'Alice', credits: 100 },
                { id: '0001', name: 'Miguel'},
                { id: '0002', name: 'John', credits: 22 },
                { id: '0003', name: 'Kyle'},
                { id: '0004', name: 'Bob', credits: 5318 },
                { id: '0005', name: 'Ulyssa', credits: 100 },
                { id: '0006', name: 'Bailey', credits: 7899 },
                { id: '0007', name: 'Frank'},
                { id: '0008', name: 'Alice', credits: 9 },
                { id: '0009', name: 'Miguel', credits: 10000 },
            ],
            items: [
                { name: 'Banana'},
                { name: 'Grape', worth: 3 },
                { name: 'Strawberry', worth: 5 },
                { name: 'Mango', worth: 9 },
            ],
            inventory: [
                { 'user_id': '003', 'item_id': 1, 'quantity': 2 },
                { 'user_id': '003', 'item_id': 3, 'quantity': 9 },
                { 'user_id': '009', 'item_id': 2, 'quantity': 5 },
                { 'user_id': '006', 'item_id': 4, 'quantity': 6 },
                { 'user_id': '006', 'item_id': 3, 'quantity': 90 },
                { 'user_id': '006', 'item_id': 2, 'quantity': 3 },
                { 'user_id': '005', 'item_id': 2, 'quantity': 28 },
                { 'user_id': '009', 'item_id': 1, 'quantity': 1 },
                { 'user_id': '009', 'item_id': 4, 'quantity': 7 },
                { 'user_id': '008', 'item_id': 2, 'quantity': 3 },
            ]
        }

        //await dbManager.importData(knex, data);
        const dbData = await dbManager.exportData(knex);
        console.log(dbData);
        console.log('Data exported!');
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await knex.destroy();
        console.log('Connection closed');
    }
})();