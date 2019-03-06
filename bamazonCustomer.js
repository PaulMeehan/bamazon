const inquirer = require("inquirer");
const mysql = require('mysql');
const cTable = require('console.table');

var conn = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "DataRules019283",
    database: 'bamazon'
});

conn.connect(function (err) {
    if (err) throw err;
    console.log(`Connected as id: ${conn.threadId}`);
});

function processSale (productID, numRequested) {
    var strSQL = "select * from products where item_id=" + productID;
    console.log (strSQL);
    conn.query(strSQL, function (err, data) {
        if (err) throw err;
        console.log(data);
        console.log(`You requested to purchase ${numRequested} of our ${data[0].product_name}(s)`);
        if (numRequested > data.stock_quantity) {
            console.log ("Sorry, but we do not have enough in stock for that order.  Please try again.");
            makeASale();
        } else {
            console.log ("Your order is being processed.");
            var totalCost = (parseInt(numRequested) * parseFloat(data[0].price));
            console.log ("The total cost for this transaction will be $" + totalCost);
            var newStockQuantity = data[0].stock_quantity - numRequested;
            strSQL = "update products set stock_quantity=" + newStockQuantity + " where item_id=" + productID;
            conn.query(strSQL, function (updateErr, updateData) {
                if (updateErr) throw updateErr;
                makeASale();
            });
        };
    });
};

function makeASale() {
    var strSQL = "select * from products";
    conn.query(strSQL, function (err, data) {
        if (err) throw err;
        console.table("\nCurrent Inventory:\n",data);
        promptUser();
    });
};

function promptUser () {

    inquirer.prompt([
        {
            type: "input",
            name: "choice",
            message: "Please enter the ID of the product you would like to purchase [enter Q to quit]:"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many of these items would you like to purchase?",
            when: function (answers) {
                return answers.choice.toUpperCase() !== "Q";
            }
        }
    ]).then(function (results) {
        if (results.choice.toUpperCase() !== "Q") {
            processSale(results.choice, results.quantity);
        } else {
            console.log("Thank you for shopping");
            conn.end();
        }
    });
};



makeASale();

