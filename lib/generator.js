const fs = require('fs-extra');
const path = require('path');
const installDependencies = require('./utils');

const TARGET_DIR = process.cwd();

module.exports = async function createProject(projectName, options, CURRENT_DIR) {
  const envContent = `APP_PORT=8000
APP_KEY=
APP_LOG=console.log

DB_DIALECT=sqlite
DB_HOST=127.0.0.1
DB_NAME=
DB_USER=
DB_PASS=
DB_STORAGE=database.sqlite
`
  const gitignoreContent = `/node_modules
/access.log
/.env
/database.sqlite
`
    const isTypeScript = options.typescript;

    const templatePath = path.join(
        CURRENT_DIR, 
        'templates',
        isTypeScript ? 'ts-rest-api' : 'js-rest-api'
    );
    const targetPath = path.join(TARGET_DIR, projectName);
    if (fs.existsSync(targetPath)) {
        console.log(`${targetPath} already exists`);
        return;
    }

    try {
        console.log('creating project...');
        fs.mkdirSync(targetPath);
        console.log('copying files...');
        await fs.copy(templatePath, targetPath);
        await fs.writeFile(path.join(targetPath, '.env'), envContent);
        await fs.writeFile(path.join(targetPath, '.gitignore'), gitignoreContent);
        await updatePackageJson(targetPath, projectName);
        console.log('installing dependencies...');
        await installDependencies(targetPath);
        printBasicHelp(projectName);
    }catch (error) {
        console.error(error);
    }
}

async function updatePackageJson(targetPath, projectName) {
    const packageJsonPath = path.join(targetPath, 'package.json');
    if(fs.existsSync(packageJsonPath)) {
        let pkg = await fs.readJson(packageJsonPath);
        pkg.name = projectName;
        pkg.description = `REST API project for ${projectName}`;
        await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
    }
}

function printBasicHelp(name) {
    console.log(`
Sipere REST API skeleton created
Read docs/user_doc.md
Run next commands:
    cd ${name}
    node op key:generate
    npm run dev
Usable commands:
    node op make:model thing
    node op make:controller thing
    node op make:migration thing
    node op make:seeder thing
The model and controller names must be
given in the singular. More info:
    node op help
`);
}