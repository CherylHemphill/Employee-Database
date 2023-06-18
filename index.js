const inquirer = require('inquirer');
const mysql = require('mysql2');
const util = require('util');

// Connect to database
const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const dbQuery = util.promisify(db.query).bind(db);

const promptUser = async () => {
    try {
        const selection = await inquirer.prompt([
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
        ]);

        // Check the user's selection and call the corresponding functions
        if (selection.view === 'View All Departments') {
            const departments = await getAllDepartments();
            console.log(departments);
        } else if (selection.view === 'View All Roles') {
            const role = await getAllRoles();
            console.log(role);
        } else if (selection.view === 'View All Employees') {
            const employee = await getAllEmployees();
            console.log(employee);
        } else if (selection.view === 'Add A Department') {
            const newDepartment = await addDepartment();
            console.log(newDepartment);
        } else if (selection.view === 'Add A Role') {
            const newRole = await addRole();
            console.log(newRole);
        } else if (selection.view === 'Add An Employee') {
            const newEmployee = await addEmployee();
            console.log(newEmployee);
        } else if (selection.view === 'Update An Employee Role') {
            const updateEmployee = await updateEmployeeRole();
            console.log(updateEmployee);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
};


// Database query functions

 // fetch and display all departments
async function getAllDepartments() {
  try {
    const query = 'SELECT * FROM department';
    const results = await dbQuery(query);
    return results;
  } catch (error) {
    throw error;
  }
};

//fetch and display all roles
async function getAllRoles() {
  try {
    const query = 'SELECT * FROM role';
    const results = await dbQuery(query);
    return results;
  } catch (error){
    throw error;
  }
};

// fetch and display all employees
async function getAllEmployees() {
  try {
    const query = 'SELECT * FROM employee';
    const results = await dbQuery(query);
    return results;
  } catch (error) {
    throw error;
  }
};

// fetch and add a department
async function addDepartment() {
  try {
    const department = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the new department:',
      },
    ]);

    const query = 'INSERT INTO department SET name = ?';
    const result = await dbQuery(query, department.name);

    console.log('Department added successfully.');
    return result;
  } catch (error) {
    throw error;
  }
};

// fetch and add a role
async function addRole() {
  try {
    const departments = await getAllDepartments();
    const role = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the role title:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the role salary',
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department for the role:',
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
      },
      ]);

      const query = 'INSERT INTO role SET title = ?';
      const result = await dbQuery(query, role.title);

      console.log('New role added successfully.');
      return result;
     } catch (error) {
      throw error;
     }
};

// fetch and add an employee
async function addEmployee() {
  try {
    const roles = await getAllRoles();
    const employee = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the new employees first name:'
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the new employees last name:'
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the role for the employee:',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Select the manager for the employee:',
        choices: employees.map((employee) => ({
          name: `${employee.firstName} ${employee.lastName}`,
          value: employee.id,
        })),
      },
    ]);
    const query = 'INSERT INTO employee SET ?';
    const result = await dbQuery(query, employee);

    console.log('Employee added successfully.');
    return result;
  } catch (error) {
    throw error;
  }
  }

// fetch and update an employee's role
async function updateEmployeeRole() {
  try {
    const employees = await getAllEmployees();
    const roles = await getAllRoles();

    const employeeToUpdate = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employees.map((employee) => ({
          name: `${employee.firstName} ${employee.lastName}`,
          value: employee.id,
        })),
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the new role for the employee:',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
    ]);

    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
    const result = await dbQuery(query, [employeeToUpdate.roleId, employeeToUpdate.employeeId]);

    console.log('Employee role updated successfully.');
    return result;
  } catch (error) {
    throw error;
  }
};

promptUser();


