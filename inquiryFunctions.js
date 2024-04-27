const inquirer = require('inquirer');
const db = require('./db');

//function to view all departments
async function viewAllDepartments() {
    const dbconnection = await db();
    try {
        const [departments] = await db.query('SELECT id, name FROM departments');
        console.table(departments);
    } catch (error) {
        console.log('Error while retrieving department data: ', error);
    } finally {
    db.end();
    }
}

//function to view all roles
async function viewAllRoles(){
    const dbconnection = await db();
    try{
        const [roles] = await db.query('SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles INNER JOIN departments ON roles.department_id = departments.id');
        console.table(roles);
    } catch(error) {
        console.log("Error retrieving roles data: ", error);
    } finally {
        db.end()
    }
}
//function to view all employees

async function viewAllEmployees () {
    const dbconnection = await db();
    try{
        const [employees] = await db.query("SELECT e.id, e.first_name, e.last_name, r.title AS title, d.name, r.salary, CONCAT(m.first_name,' ', m.last_name) AS manager FROM employees e INNER JOIN roles r ON e.role_id = r.id INNER JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id" )
    }catch (error) {
        console.log("Error retrieving employee data: ", error);
    } finally {
        db.end();
    }
} 

//function to add a department
//function to add a role
//function to add an employee
//function to update an employee role