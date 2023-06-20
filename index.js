const inquirer = require('inquirer');
require('dotenv').config();
const { createPool } = require('mysql2/promise');

 // Connect to database

const pool = createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}, 
console.log('Database connection established successfully.')
);


const promptUser = () => {
  try {
    inquirer
      .prompt([
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
        if (selection.view === 'View All Departments') {
          getAllDepartments().then((departments) => {
            console.log(departments);
          });
        } else if (selection.view === 'View All Roles') {
          getAllRoles().then((roles) => {
            console.log(roles);
          });
        } else if (selection.view === 'View All Employees') {
          getAllEmployees().then((employees) => {
            console.log(employees);
          });
        } else if (selection.view === 'Add A Department') {
          addDepartment().then((newDepartment) => {
            console.log(newDepartment);
          });
        } else if (selection.view === 'Add A Role') {
          addRole().then((newRole) => {
            console.log(newRole);
          });
        } else if (selection.view === 'Add An Employee') {
          addEmployee().then((newEmployee) => {
            console.log(newEmployee);
          });
        } else if (selection.view === 'Update An Employee Role') {
          updateEmployeeRole().then((updateEmployee) => {
            console.log(updateEmployee);
          });
        }
      });
  } catch (error) {
    console.error('Error occurred:', error);
  }
};


// Database query functions

// fetch and display all departments
async function getAllDepartments() {
  try {
    const query = 'SELECT * FROM department';
    const [rows] = await pool.query(query); // Use await with async/await
    console.table(rows);
    return rows;
  } catch (error) {
    throw error;
  }
}

// fetch and display all roles
async function getAllRoles() {
  try {
    const query = 'SELECT * FROM role';
    const [rows] = await pool.query(query); // Use await with async/await
    return rows;
  } catch (error) {
    throw error;
  }
}

// fetch and display all employees
async function getAllEmployees() {
  try {
    const query = 'SELECT * FROM employee';
    const [rows] = await pool.query(query); // Use await with async/await
    return rows;
  } catch (error) {
    throw error;
  }
}

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

    const query = "INSERT INTO department (name) VALUES (?)";
    const [result] = await pool.query(query, [department.name]); 
    console.log('Department added successfully.');
    return result;
  } catch (error) {
    throw error;
  }
}

// fetch and add a role
function addRole() {
  try {
    return getAllDepartments().then((departments) => {
      return inquirer.prompt([
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
    }).then((role) => {
      const query = 'INSERT INTO role SET title = ?';
      return pool.query(query, role.title);
    }).then((result) => {
      console.log('New role added successfully.');
      return result;
    });
  } catch (error) {
    throw error;
  }
};


// fetch and add an employee
function addEmployee() {
  try {
    return getAllRoles().then((roles) => {
      return inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'Enter the new employee\'s first name:'
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'Enter the new employee\'s last name:'
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
      ]);
    }).then((employee) => {
      return getAllEmployees().then((employees) => {
        return inquirer.prompt([
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
      }).then((manager) => {
        const employeeData = {
          first_name: employee.first_name,
          last_name: employee.last_name,
          role_id: employee.roleId,
          manager_id: manager.managerId
        };

        const query = 'INSERT INTO employee SET ?';
        return pool.query(query, employeeData);
      });
    }).then((result) => {
      console.log('Employee added successfully.');
      return result;
    });
  } catch (error) {
    throw error;
  }
}

//fetch and update an employees role
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
    const [result] = await pool.query(query, [employeeToUpdate.roleId, employeeToUpdate.employeeId]); 
    console.log('Employee role updated successfully.');
    return result;
  } catch (error) {
    throw error;
  }
}

promptUser();
// pool.end();



