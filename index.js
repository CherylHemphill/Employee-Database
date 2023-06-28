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
            'Update An Employee Role',
            'Delete A Department',
            'Delete A Role',
            'Delete An Employee'
          ]
        },
      ])

      .then((selection) => {
        if (selection.view === 'View All Departments') {
          getAllDepartments().then((departments) => {
            // console.log(departments);
          });
        } else if (selection.view === 'View All Roles') {
          getAllRoles().then((roles) => {
            // console.log(roles);
          });
        } else if (selection.view === 'View All Employees') {
          getAllEmployees().then((employees) => {
            // console.log(employees);
          });
        } else if (selection.view === 'Add A Department') {
          addDepartment();
        } else if (selection.view === 'Add A Role') {
          addRole().then((newRole) => {
            console.log(newRole);
          });
        } else if (selection.view === 'Add An Employee') {
          addEmployee();
        } else if (selection.view === 'Update An Employee Role') {
          updateEmployeeRole();
        } else if (selection.view === 'Delete A Department') {
          deleteDepartment();
        } else if (selection.view === 'Delete A Role') {
          deleteRole();
        } else if (selection.view === 'Delete An Employee') {
          deleteEmployee();
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
    const [rows] = await pool.query(query);
    console.table(rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

// fetch and display all roles
async function getAllRoles() {
  try {
    const query = 'SELECT * FROM role';
    const [rows] = await pool.query(query); 
    console.table(rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

// fetch and display all employees
async function getAllEmployees() {
  try {
    const query = 'SELECT * FROM employee';
    const [rows] = await pool.query(query); 
    console.table(rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

// fetch and add a department
function addDepartment() {
  try {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter the name of the new department:',
        },
      ])
      .then((department) => {
        const query = "INSERT INTO department (name) VALUES (?)";
        return pool.query(query, [department.name]);
      })
      .then((result) => {
        console.log('Department added successfully.');
        return result;
      });
  } catch (error) {
    throw error;
  }
};


// fetch and add a role
function addRole() {
  try {
    return getAllDepartments().then((departments) => {
      return inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the role title:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the role salary:',
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
      const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
      return pool.query(query, [role.title, role.salary, role.departmentId]);
    }).then((result) => {
      console.log('New role added successfully.');
      return result;
    });
  } catch (error) {
    throw error;
  }
}

// fetch and add an employee

function addEmployee() {
  getAllRoles()
    .then((roles) => {
      getAllEmployees()
        .then((employees) => {
          inquirer.prompt([
            {
              type: 'input',
              name: 'first_name',
              message: "Enter the new employee's first name:",
            },
            {
              type: 'input',
              name: 'last_name',
              message: "Enter the new employee's last name:",
            },
            {
              type: 'list',
              name: 'role_id',
              message: 'Select the role for the employee:',
              choices: roles.map((role) => ({
                name: role.title,
                value: role.id,
              })),
            },
            {
              type: 'list',
              name: 'manager_id',
              message: 'Select the manager for the employee:',
              choices: employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              })),
            },
          ]).then((employee) => {
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            return pool.query(query, [employee.first_name, employee.last_name, employee.role_id, employee.manager_id]);
          }).then((result) => {
            console.log('New employee added successfully.');
            return result;
          }).catch((error) => {
            console.error('Error adding employee:', error);
          });
        }).catch((error) => {
          console.error('Error getting employees:', error);
        });
    }).catch((error) => {
      console.error('Error getting roles:', error);
    });
};


//fetch and update an employees role
function updateEmployeeRole() {
  getAllEmployees()
    .then((employees) => {
      getAllRoles()
        .then((roles) => {
          inquirer.prompt([
            {
              type: 'list',
              name: 'employeeId',
              message: 'Select the employee to update:',
              choices: employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
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
          ]).then((employee) => {
            const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
            pool.query(query, [employee.roleId, employee.employeeId]);
          }).then((result) => {
            console.log('New employee updated successfully.');
            return result;
          }).catch((error) => {
            console.error('Error updating employee:', error);
          });
        }).catch((error) => {
          console.error('Error getting employees:', error);
        });
    }).catch((error) => {
      console.error('Error getting roles:', error);
    });
};

// Delete Department
function deleteDepartment() {
  getAllDepartments()
    .then((departments) => {
      inquirer.prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select the department to delete:',
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ]).then((department) => {
        const query = 'DELETE FROM department WHERE id = ?';
        pool.query(query, [department.departmentId]);
      }).then((result) => {
        console.log('Department Deleted Successfully.');
        return result;
      }).catch((error) => {
        console.error('Error deleting department:', error);
      });
    }).catch((error) => {
      console.error('Error getting departments:', error);
    });
};

// Delete Role
function deleteRole() {
  getAllRoles()
    .then((roles) => {
      inquirer.prompt([
        {
          type: 'list',
          name: 'roleId',
          message: 'Select the role to delete:',
          choices: roles.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
      ]).then((role) => {
        const query = 'DELETE FROM role WHERE id = ?';
        pool.query(query, [role.roleId]);
      }).then((result) => {
        console.log('Role Deleted Successfully.');
        return result;
      }).catch((error) => {
        console.error('Error deleting role:', error);
      });
    }).catch((error) => {
      console.error('Error getting roles:', error);
    });
};

//Delete Employee
function deleteEmployee() {
  getAllEmployees()
    .then((employees) => {
      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to delete:',
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
      ]).then((employee) => {
        const query = 'DELETE FROM employee WHERE id = ?';
        pool.query(query, [employee.employeeId]);
      }).then((result) => {
        console.log('Employee Deleted Successfully.');
        return result;
      }).catch((error) => {
        console.error('Error deleting employee:', error);
      });
    }).catch((error) => {
      console.error('Error getting employees:', error);
    });
};

promptUser();
// pool.end();



