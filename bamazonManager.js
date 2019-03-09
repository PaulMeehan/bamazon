const inquirer = require("inquirer");
const mysql = require('mysql');
const cTable = require('console.table');

var strSQL = "";

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



function viewProducts () {
    strSQL = "select * from products";
    conn.query(strSQL, function (err, data) {
        if (err) throw err;
        console.table("\nCurrent Inventory:\n", data);
        getActivity();
    });
};

function viewLowInventory(lowVal) {
    strSQL = "select * from products where stock_quantity < " + lowVal;
    conn.query(strSQL, function (err, data) {
        if (err) throw err;
        console.table(`\nProducts with fewer than ${lowVal} stock quantity:\n`, data);
        getActivity();
    });
};

function addInventory (productID, numUnits) {
    strSQL = "update products set stock_quantity = stock_quantity + " + numUnits + " where item_id = " + productID;
    console.log (strSQL);
    conn.query(strSQL, function (err, data){
        if (err) throw err;
        console.log(`\n${numUnits} units were added to item_id ${productID}`);
        getActivity();
    });
};

function newProduct (name, department, price) {
    var numericPrice = parseFloat(price);
    strSQL = `insert into products (product_name, department_name, price, stock_quantity) `;
    strSQL = strSQL + `values ('${name}', '${department}', ${numericPrice}, 0)`;
    // console.log (strSQL);
    conn.query(strSQL, function (err, data) {
        if (err) throw err;
        console.log(`\nThe new product ${name} was added to the ${department} department with a price of $${numericPrice}.`);
        console.log("Don't forget to add inventory for this new product!");
        getActivity();
    });
};


function validateIsNumber(response) {
    var numericResponse = Number(response);
    if (isNaN(numericResponse)) {
        return false || "Please provide a numeric value";
    } else {
        return true;
    };
};

function validateIsInteger(response) {
    var numericResponse = Number(response);
    if (isNaN(numericResponse)) {
        return false || "Please provide a numeric value";
    } else if (!Number.isInteger(numericResponse)) {
        return false || "Please provide an integer value";
    } else {
        return true;
    };
};

function getActivity () {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose what you would like to do:",
            choices: ['View products for sale', 'View low intentory', 'Add to inventory', 'Add new product', 'Exit']
        }
    ]).then(function (results) {
        var continueProcess = true;
        switch (results.choice) {
            case 'View products for sale':
                viewProducts();
                break;
            case 'View low intentory':
                inquirer.prompt([
                    {
                        type: "input",
                        name: "lowValue",
                        message: "What stock quantity is considered 'low'?",
                        validate: validateIsNumber
                    }
                ]).then(function (moreResults) {
                    viewLowInventory(moreResults.lowValue);
                });
                break;
            case 'Add to inventory':
                inquirer.prompt([
                    {
                        type: "input",
                        name: "productID",
                        message: "Enter the item_id for the product for which the items will be added:",
                        validate: validateIsInteger
                    },
                    {
                        type: "input",
                        name: "numUnits",
                        message: "Enter the number of units to be added to the stock quantity for this product:",
                        validate: validateIsInteger
                    }
                ]).then (function (moreResults) {
                    addInventory(moreResults.productID, moreResults.numUnits);
                });
                break;
            case 'Add new product':
                var departmentArr = [];
                strSQL = "select distinct department_name from departments order by department_name";
                conn.query(strSQL, function (err,data) {
                    if (err) throw err;
                    debugger;
                    for (var j=0; j < data.length; j++) {
                        departmentArr.push(data[j].department_name);
                    };
                    console.log ("departments = " + departmentArr);
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
                            choices: departmentArr
                        },
                        {
                            type: "input",
                            name: "price",
                            message: "Enter the price for this product:",
                            validate: validateIsNumber
                        }
                    ]).then(function (moreResults) {
                        newProduct(moreResults.productName, moreResults.departmentName, moreResults.price);
                    })
                });    
                break;
            case 'Exit':
                console.log("Thank you.")
                conn.end();
                break;
            default:
                console.log('Something went wrong here.');
        };
    });
};

getActivity();

