require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

var strSQL = "";

var conn = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT,
    user: "root",
    password: process.env.DATABASE_PW,
    database: "bamazon"
})

conn.connect(function (err) {
    if (err) throw err;
    // console.log (`Connected as id: ${conn.threadId}`);
});


function viewProductSales () {
    strSQL = "select d.department_id, d.department_name, overhead_costs, sum(product_sales) as product_sales, (sum(product_sales) - overhead_costs) as total_profit ";
    strSQL = strSQL + "from departments d left join products p on d.department_name = p.department_name ";
    strSQL = strSQL + "group by d.department_id, d.department_name ";
    // console.log(strSQL);
    conn.query(strSQL, function(err, data) {
        if (err) throw err;
        console.table("\nTotal Product Sales by Department:\n", data);
        userInput();
    });
};

function createDepartment(newDeptName, newOHCosts) {
    strSQL = `insert into departments (department_name, overhead_costs) values ('${newDeptName}', ${newOHCosts})`;
    // console.log(strSQL);
    conn.query(strSQL, function(err, newData) {
        if (err) throw err;
        console.log (`\nThe new department '${newDeptName}' has been created with an overhead cost of ${newOHCosts}`);
        userInput();
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

function userInput () {
    inquirer.prompt ([
        {
            type: "list",
            name: "action",
            message: "Choose which action you want to take:",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }
    ]).then(function(data){
        switch (data.action) {
            case "View Product Sales by Department":
                viewProductSales();
                break;
            case "Create New Department":
                inquirer.prompt ([
                    {
                        type: "input",
                        name: "deptName",
                        message: "Enter the name of the new department:"
                    },
                    {
                        type: "input",
                        name: "ohCosts",
                        message: "What are the overhead costs for this new department?",
                        validate: validateIsNumber
                    }
                ]).then(function(moreData) {
                    createDepartment(moreData.deptName, moreData.ohCosts);
                });
                break;
            case "Exit":
                console.log("Exiting Supervisor");
                conn.end();
                break;
            default:
                console.log("Something went wrong here");
        };
    });
};

userInput();
