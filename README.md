# Employee Manager

## Table of Contents
- [Description](#description-)
- [App Preview](#app-preview-)
- [Features](#features-)
- [Code Snippets](#code-snippets-)
- [Skills Improved](#skills-improved-️)
- [Future Improvements](#future-improvements-️)
- [Technologies](#technologies-️)
- [License](#license-)
- [Authors](#authors-️)

## Decription 📖
The Employee Manager is a command-line application that helps track departments, roles and employees within a business. It leverages MYSQL to allow users to effectively view, add, remove and update employee details along with their roles and departments.

## App Preview 👀
![alt text](<demo/employee manager demo.gif>)

## Features ✨
1. **View Employees/Departments/Roles** - Easily retrieve and display all employees, departments and roles within your organization.
2. **Add Employees/Departments/Roles** - Allows the user to add new employees, departments and roles to the database.
3. **Update Employee Roles** - Updating roles of a an existing employee is facilitated.

## Code Snippets 💻

Asynchronous function to add an employee 

```javascript
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
```

Asynchronous functions that facilitates the update of an employee role
```javascript
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
```

## Skills Improved 🛠️
- Node.js and npm (Node Package Manger)
- MySQL and relational DBMS
- Asynchronous programming
- Promise handling
- Error Handling
- Command-Line Development
- SQL queries and CRUD operations
- Git and Version control
- Modular programming

## Future Improvements 🔜
- Adding a GUI
- Integrating more complex queries
- Expansion of database schema to include more columns e.g. benefits

## Technologies 🔧
* [Node.js](https://nodejs.org/en)
* [MySQL](https://www.mysql.com/)
* [Inquirer.js](https://www.npmjs.com/package/inquirer)
* [Console.table](https://www.npmjs.com/package/console.table)

## License 📄
This project is licensed under the MIT License - see the LICENSE file for details.

## Authors 👤
### Ralph Molu
- [GitHub](https://github.com/ralphmolu)
- [LinkedIn](https://www.linkedin.com/in/ralph-molu)