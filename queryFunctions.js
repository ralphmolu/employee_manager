const inquirer = require('inquirer');
const db = require('./db/dbconnection');
const { newRoleDetails } = require('./main/inquirer'); // to import the user inputs from the inquirer.js file and use it in sql queries to the database

//function to view all departments
async function viewAllDepartments() {
    const dbconnection = await db;
    try {
        const [departments] = await dbconnection.query('SELECT id, name FROM departments');
        console.table(departments);
    } catch (error) {
        console.log('Error while retrieving department data: ', error);
    }
}

//function to view all roles
async function viewAllRoles() {
    const dbconnection = await db;
    try {
        const [roles] = await dbconnection.query('SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles INNER JOIN departments ON roles.department_id = departments.id');
        console.table(roles);
    } catch (error) {
        console.log("Error retrieving roles data: ", error);
    }
}

//function to view all employees
async function viewAllEmployees() {
    const dbconnection = await db;
    try {
        const [employees] = await dbconnection.query("SELECT e.id, e.first_name, e.last_name, r.title AS title, d.name, r.salary, CONCAT(m.first_name,' ', m.last_name) AS manager FROM employees e INNER JOIN roles r ON e.role_id = r.id INNER JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id");
        console.table(employees);
    } catch (error) {
        console.log("Error retrieving employee data: ", error);
    }
}

//function to add a department to the database
async function addDepartment(name) {
    const dbconnection = await db;
    try {
        const addDept = await dbconnection.query('INSERT INTO departments (name) VALUES (?)', [name]);
        console.log(`${name} successfully added!`);
    } catch (error) {
        console.log('Error adding to department: ', error);
    }
}
//segment to add a role 
// helper function to get all current departments in the database
async function fetchDepartments() {
    const dbconnection = await db;
    const [departments] = await dbconnection.query('SELECT id, name FROM departments');
    // the mapping function transforms elements in the array into a format suitable for inquirer i.e. a new object is created with properties name and value
    return departments.map(dept => ({
        name: dept.name,
        value: dept.id
    }));
}
// function to add a role
async function addRole(title, salary, department) {
    const dbconnection = await db;
    const departments = await fetchDepartments();

    // prompt the user for role details
    const newRoleDetails = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role you want to add?',
            validate: (input) => !!input || "You must enter a role title!"
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for the new role?',
            validate: (input) => !isNaN(parseFloat(input)) || 'Please enter a valid number'
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Which department does this role fall under?',
            choices: await fetchDepartments()  //retrieve departments from the database
        },

    ]);

    try {

        const newRole = await dbconnection.query('INSERT into roles (title, salary, department_id) VALUES (?,?,?)', [newRoleDetails.title, newRoleDetails.salary, newRoleDetails.departmentId]);
        console.log(`Added ${newRoleDetails.title} with salary: ${newRoleDetails.salary} to the database.`)
    } catch (error) {
        console.error("Failed to add new role: ", error);
    }


}

//helper function to get current roles from database
async function fetchRoles() {
    const dbconnection = await db;
    const [roles] = await dbconnection.query("SELECT id, title FROM roles");
    return roles.map((role) => ({
        name: role.title,
        value: role.id
    }));
}

//helper function to get a list of current employees from database
async function fetchEmployees() {
    const dbconnection = await db;
    const [employees] = await dbconnection.query('SELECT id, CONCAT (first_name, " ",last_name) AS name FROM employees');
    return employees.map((emp) => ({
        name: emp.name,
        value: emp.id
    }));
}

// function implementing the logic for adding a new employee
async function addEmployee() {
    const dbconnection = await db;
    const roles = await fetchRoles(); 
    const managers = await fetchEmployees();
    //adds the option of 'no manager' to the list of employees in case the employee has no managers
    managers.unshift(
        {
            name: 'None',
            value: null
        });

        // prompt the user for employee details
        const newEmp = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
                validate: (input) => !!input.trim() || "First name cannot be empty!"
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
                validate: (input) => !!input.trim() || "Last name cannot be empty!"
            },
            {
                type: 'list',
                name: 'roleId',
                message: "What is the employee's role?",
                choices: roles
            },
            {
                type: 'list',
                name: 'managerId',
                message: "Who is the employee's manager?",
                choices: managers
            }
        ]);

        try{
            await dbconnection.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [newEmp.firstName, newEmp.lastName, newEmp.roleId, newEmp.managerId]);
            console.log(`Successfully added ${newEmp.firstName} ${newEmp.lastName} into the database`);
        }catch(error){
            console.error("Failed to insert new employee into the database: ", error);
        }

}

//function to update an employee role
async function updateEmpRole(){
    const dbconnection = await db;

    const roles = await fetchRoles();
    const employees = await fetchEmployees();

    const updateRole = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: "Select the employee whose role you want to update: ",
            choices: employees
        },
        {
            type: 'list',
            name: 'roleId',
            message: "Select the new role of the you want to assign to the employee: ",
            choices: roles
        },
    ])

    try{
        await dbconnection.query('UPDATE employees SET role_id = ? WHERE id = ?', [updateRole.roleId,updateRole.employeeId]);
        console.log(`Successfully updated ${updateRole.employeeId} to ${updateRole.roleId}!`)

    }catch(error){
        console.error('Failed to update the employee role: ', error);
    }
}

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    fetchDepartments,
    fetchEmployees,
    fetchRoles,
    addEmployee,
    updateEmpRole
}