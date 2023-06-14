const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: "localhost",
        user: process.env.DB_USER,
        password:process.env.DB_PASSWORD, 
        database: process.env.DB_NAME,
    },
    console.log(`Connected to the database.`)
);
const promptUser = async () => {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'view',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add A Department',
                'Add A Role',
                'Add An Employee',
                'Update An Employee Role'
            ]
        },

    ])
        .then((selection) => {
            console.log(selection);

      

// Check the user's selection and call the corresponding functions
if (selection.view === 'View All Departments') {
    getAllDepartments();
  } else if (selection.view === 'View All Roles') {
    getAllRoles();
  } else if (selection.view === 'View All Employees') {
    getAllEmployees();
  } else if (selection.view === 'Add A Department') {
    addDepartment();
  } else if (selection.view === 'Add A Role') {
    addRole();
  } else if (selection.view === 'Add An Employee') {
    addEmployee();
  } else if (selection.view === 'Update An Employee Role') {
    updateEmployeeRole();
  }
});
};

// Database query functions 

function getAllDepartments() {
// fetch and display all departments
}

function getAllRoles() {
//fetch and display all roles
}

function getAllEmployees() {
// fetch and display all employees
}

function addDepartment() {
//  add a department
}

function addRole() {
// add a role
}

function addEmployee() {
// add an employee
}

function updateEmployeeRole() {
// update an employee's role
}

promptUser();

