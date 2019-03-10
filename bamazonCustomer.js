// Incorporate environment variables.
require("dotenv").config();

// Include dependencies
const inquirer = require("inquirer");
const mysql = require('mysql');
const cTable = require('console.table');

// Create connection to the database.
// Port number and password passed in from .env file.
var conn = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT,
    user: "root",
    password: process.env.DATABASE_PW,
    database: "bamazon"
});

// Connect to the database.
conn.connect(function (err) {
    if (err) throw err;
    // console.log(`Connected as id: ${conn.threadId}`);
});

function processSale (productID, numRequested) {
// Process the sale request.

    // Create the query string to pull all information from table for specified item number.
    var strSQL = "select * from products where item_id=" + productID;
    // console.log (strSQL);
    // Convert string value to numeric.
    var numberRequested = Number(numRequested);
    // Query the database.
    conn.query(strSQL, function (err, data) {
        if (err) throw err;
        // Provide feedback to the user.
        console.log(`You requested to purchase ${numberRequested} of our ${data[0].product_name}(s)`);
        // Provide error message and stop processing if number requested is more than number in stock.
        debugger;
        if (numberRequested > data[0].stock_quantity) {
            console.log ("Sorry, but we do not have enough in stock for that order.  Please try again.");
            // Start next transaction.
            showProducts();
        } else {
            // Provide feedback to user that request is being processed.
            console.log ("Your order is being processed.");
            var totalCost = (parseInt(numberRequested) * parseFloat(data[0].price));     // Calculate the total cost of the order.
            var totalProductSales = parseFloat(data[0].product_sales) + totalCost;       // Calculate the new total sales for this product.
            console.log ("The total cost for this transaction will be $" + totalCost);
            var newStockQuantity = data[0].stock_quantity - numberRequested;             // Calculate the new number that will be in stock after this transaction.
            // Create query string to update database record with calculated values.
            strSQL = `update products set stock_quantity=${newStockQuantity}, product_sales=${totalProductSales} where item_id=${productID}`;
            // console.log (strSQL);
            // Execute the query on the database.
            conn.query(strSQL, function (updateErr, updateData) {
                if (updateErr) throw updateErr;
                // Start next transaction.
                showProducts();
            });
        };
    });
};

function showProducts() {
// Query database and display full list of products.
    
    // Create query string to pull all information from products table.
    var strSQL = "select * from products";
    // Execute query.
    conn.query(strSQL, function (err, data) {
        if (err) throw err;
        // Display results on console in table format.
        console.table("\nCurrent Inventory:\n",data);
        // Prompt user for next action.
        promptUser();
    });
};

function validateChoice(choice) {
// Determines whether value entered by user is the Quit flag or an integer value.
// Returns True or error message.

    // If value entered is not the Quit flag, do the following:
    if (choice.toUpperCase() !=="Q") {
        var isValid = true;               // Inialize flag indicating value entered is valid.
        var numericVal = Number(choice);  // Determine numerical equivalent to value entered.

        // If value entered is not a number, set flag to false and provide error message.
        if (isNaN(numericVal)) {
            isValid = false;
            console.log("\nInvalid value.  Please enter an integer value");
        // If value entered is not an integer, set flag to false and provide error message.
        } else if (! Number.isInteger(numericVal)) {
            isValid = false;
            console.log("\nInvalid value.  Please enter an integer value");
        };
        // Return flag value.
        return isValid;
    } else {
        // If value entered is the Quit flag, return True.
        return true;
    };
};

function validateIsInteger(response) {
// Determines whether value entered by user is an integer.
// Returns True or error message.

    var isValid = true;                        // Initialize flag indicating value entered is valid.
    var numericResponse = Number(response);    // Determine numerical equivalent to value entered.
    // If value entered is not a number, change flag to False and provide error message.
    if (isNaN(numericResponse)) {
        isValid = false;
        console.log("\nInvalid value.  Please enter an integer value");
    // If value entered is not an integer, change flag to False and provide error message.
    } else if (!Number.isInteger(numericResponse)) {
        isValid = false;
        console.log("\nInvalid value.  Please enter an integer value");
    };
    // Return flag value.
    return isValid;
};

function promptUser () {
// Prompt user for desired action and call appropriate procedure.
    inquirer.prompt([
        {
            type: "input",
            name: "choice",
            message: "Please enter the ID of the product you would like to purchase [enter Q to quit]:",
            validate: validateChoice
        },
        {
            type: "input",
            name: "quantity",
            message: "How many of these items would you like to purchase?",
            when: function (answers) {                           // Only prompt for number of items when choice is not the Quit flag.
                return answers.choice.toUpperCase() !== "Q";
            },
            validate: validateIsInteger
        }
    ]).then(function (results) {
        // If user did not enter the Quit flag, process the sale request.
        if (results.choice.toUpperCase() !== "Q") {
            processSale(results.choice, results.quantity);
        } else {
            // Provide exiting message and close database connection.
            console.log("Thank you for shopping");
            conn.end();
        }
    });
};


// Start application by showing list of products.
showProducts();

