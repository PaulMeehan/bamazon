// Incorporate environment variables.
require("dotenv").config();

// Include dependencies.
const inquirer = require("inquirer");
const mysql = require('mysql');
const cTable = require('console.table');

// Create variable for building query strings.
var strSQL = "";

// Make connection to database.
// Port number and password passed in from .env file.
var conn = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT,
    user: "root",
    password: process.env.DATABASE_PW,
    database: 'bamazon'
});

// Connect to the database.
conn.connect(function (err) {
    if (err) throw err;
    console.log(`Connected as id: ${conn.threadId}`);
});


function viewProducts () {
// Displays a list of all products to the console in table format.
    
    // Build query string to include all fields and records from the table.
    strSQL = "select * from products";     
    // Execute the query.
    conn.query(strSQL, function (err, data) {
        if (err) throw err;
        // Display results on the console in table format.
        console.table("\nCurrent Inventory:\n", data);
        // Prompt user for next activity.
        getActivity();
    });
};

function viewLowInventory(lowVal) {
// Displays a list of all product that have a stock quantity below a specified number.

    // Build query to select all fields from the products table including records where the stock_quantity field is below the specified value.
    strSQL = "select * from products where stock_quantity < " + lowVal;
    // Execute query.
    conn.query(strSQL, function (err, data) {
        if (err) throw err;
        // Display results on the console in table format.
        console.table(`\nProducts with fewer than ${lowVal} stock quantity:\n`, data);
        // Prompt user for next activity.
        getActivity();
    });
};

function addInventory (productID, numUnits) {
// Updates specified record in products table to increase the stock_quantity by the specified amount.

    // Build query to update specified record stock_quantity field by specified amount.
    strSQL = "update products set stock_quantity = stock_quantity + " + numUnits + " where item_id = " + productID;
    // Execute query.
    conn.query(strSQL, function (err, data){
        if (err) throw err;
        // Provide message on console that record was updated.
        console.log(`\n${numUnits} units were added to item_id ${productID}`);
        // Prompt user for next activity.
        getActivity();
    });
};

function newProduct (name, department, price) {
// Adds a new record to the products table with the specified values.

    var numericPrice = parseFloat(price);   // Ensure the price value is a real number.
    // Build query to add a new record to the products table witht he specified values.
    strSQL = `insert into products (product_name, department_name, price, stock_quantity, product_sales) `;
    strSQL = strSQL + `values ('${name}', '${department}', ${numericPrice}, 0, 0)`;  // Stock_quantity and product_sales are set to 0 by default.
    // Execute query.    
    conn.query(strSQL, function (err, data) {
        if (err) throw err;
        //  Display message on console that record was added.
        console.log(`\nThe new product ${name} was added to the ${department} department with a price of $${numericPrice}.`);
        console.log("Don't forget to add inventory for this new product!");
        // Prompt user for next activity.
        getActivity();
    });
};


function validateIsNumber(response) {
// Determines whether value entered by user is numeric.
// Returns true if real or integer, otherwise False and provides error message.

    var isValid = true;                      // Initialize flag indicating value entered is valid.
    var numericResponse = Number(response);  // Determine numeric equivalent of value entered.
    // If value is not a number, change flag to false and provide error message.
    if (isNaN(numericResponse)) {
        isValid = false;
        console.log("\nInvalid value.  Please enter a numeric value");
    };
    // Return flag value.
    return isValid;
};

function validateIsInteger(response) {
// Determines whether value entered by user is an integer.
// Returns True or error message.
debugger;
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

function getActivity () {
// Prompt user for next activity, collect additional information if needed, and then call the appropriate procedure.

    // Prompt user to select from list of choices.
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose what you would like to do:",
            choices: ['View products for sale', 'View low intentory', 'Add to inventory', 'Add new product', 'Exit']
        }
    ]).then(function (results) {
        // Continue processing based on choice user selected.
        switch (results.choice) {
            case 'View products for sale':
                // Call procedure to display all products.
                viewProducts();
                break;
            case 'View low intentory':
                // Prompt user for maximum stock quantity value product must have to be included in results.
                inquirer.prompt([
                    {
                        type: "input",
                        name: "lowValue",
                        message: "What stock quantity is considered 'low'?",
                        validate: validateIsNumber      // Ensure value entered is numeric.
                    }
                ]).then(function (moreResults) {
                    // Call procedure to display products with low stock, passing in maximum value for product stock to be considered low.
                    viewLowInventory(moreResults.lowValue);
                });
                break;
            case 'Add to inventory':
                // Prompt user for item_id of product for which inventory will be increased as well as the number of units to be added.
                inquirer.prompt([
                    {
                        type: "input",
                        name: "productID",
                        message: "Enter the item_id for the product for which the items will be added:",
                        validate: validateIsInteger     // Ensure value entered is an integer.
                    },
                    {
                        type: "input",
                        name: "numUnits",
                        message: "Enter the number of units to be added to the stock quantity for this product:",
                        validate: validateIsInteger     // Ensure value entered is an integer.
                    }
                ]).then (function (moreResults) {
                    // Call procedure to update products table passing in the item_id and number of units to be added to stock quantity.
                    addInventory(moreResults.productID, moreResults.numUnits);
                });
                break;
            case 'Add new product':
                // First create an array containing the names of all the current departments.
                var departmentArr = [];     // Initialize an empty array.
                // Create a query to select the distinct department names from the departments table, order alphabetically by the department names.
                strSQL = "select distinct department_name from departments order by department_name";
                // Execute the query.
                conn.query(strSQL, function (err,data) {
                    if (err) throw err;
                    // For each department name returned by the query, do the following:
                    for (var j=0; j < data.length; j++) {
                        // Add the department name to the array.
                        departmentArr.push(data[j].department_name);
                    };
                    // Prompt the user for the name of the product, the department name, and the price of the product.
                    inquirer.prompt([
                        {
                            type: "input",
                            name: "productName",
                            message: "Enter the name of the new product:"
                        },
                        {
                            type: "list",
                            name: "departmentName",
                            message: "Select the department for this product:",
                            choices: departmentArr   // Use the array that was generated as the list of department names.
                        },
                        {
                            type: "input",
                            name: "price",
                            message: "Enter the price for this product:",
                            validate: validateIsNumber   // Validate that the value entered is a number.
                        }
                    ]).then(function (moreResults) {
                        // Call procedure to add record to the products table, passing in the product name, the department name, and the price.
                        newProduct(moreResults.productName, moreResults.departmentName, moreResults.price);
                    })
                });    
                break;
            case 'Exit':
                // Display message that application is ending.
                console.log("Thank you.")
                // End the connection to the database.
                conn.end();
                break;
            default:
                // Provide error message that unknown error occurred.
                console.log('Something went wrong here.');
        };
    });
};

// Prompt the user for the first activity.
getActivity();

