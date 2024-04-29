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
        console.error("Failed to add new role", error);
    }
 

}
//segment to add an employee
    //helper function to get employees from database

//function to update an employee role

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    fetchDepartments,
    addEmployee
}