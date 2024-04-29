const inquirer = require('inquirer');
const consoleTable = require('console.table');
const query = require('../queryFunctions')

//function that will generate prompts
async function allPrompts() {
    const answers = await inquirer.prompt({
        type: 'list',
        name: 'userChoice',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    });


    //switch case for handling user choice
    switch (answers.userChoice) {
        case 'View all departments':
            await query.viewAllDepartments();
            break;
        case 'View all roles':
            await query.viewAllRoles();
            break;
        case 'View all employees':
            await query.viewAllEmployees();
            break;
        case 'Add a department':
            const newDepartment = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'newDpt',
                    message: 'What is the name of the new department?'
                }
            ])
            await query.addDepartment(newDepartment.newDpt);
            console.log(`Added ${newDepartment.newDpt} to the database.`);
            break;
        case 'Add a role':
            await query.addRole()
            break;
        case 'Add an employee':
            await query.addEmployee();
            break;
        case 'Update an employee role':
            await query.updateEmpRole();
            break;
        case 'Exit':
            console.log('Exiting. Goodbye!');
            process.exit(0);
        default:
            console.log('Invalid selection, please try again!');
            break;
    };

    // call this function again after an action has been taken by the user
    await allPrompts();

}


// call the allprompts() at the start of the application.
allPrompts();

