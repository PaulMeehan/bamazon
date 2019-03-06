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

function addInventory () {
    console.log("addInventory");
    getActivity();
};

function newProduct (name, department, price) {
    var numericPrice = parseFloat(price);
    strSQL = `insert into products (product_name, department_name, price, stock_quantity) `;
    strSQL = strSQL + `values ('${name}', '${department}', ${numericPrice}, 0)`;
    console.log (strSQL);
    conn.query(strSQL, function (err, data) {
        if (err) throw err;
        console.log(`\nThe new product ${name} was added to the ${department} department with a price of $${numericPrice}.`);
        console.log("Don't forget to add inventory for this new product!");
        getActivity();
    });
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
                    }
                ]).then(function (moreResults) {
                    viewLowInventory(moreResults.lowValue);
                });
                break;
            case 'Add to inventory':
                addInventory();
                break;
            case 'Add new product':
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
                        choices: ['Sporting Goods', 'Garden', 'Home', 'Hardware', 'Clothing']
                    },
                    {
                        type: "input",
                        name: "price",
                        message: "Enter the price for this product:"
                    }
                ]).then(function (moreResults) {
                    newProduct(moreResults.productName, moreResults.departmentName, moreResults.price);
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

