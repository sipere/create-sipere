const { execa } = require('execa');

module.exports = async function installDependencies(projectPath) {
    try {
        await execa('npm', ['install'], { 
            cwd: projectPath,
            stdio: 'inherit'
        });
        console.log('dependencies installed.');
    } catch (error) {
        console.error('Error! An error occurred during "npm install".', error);
        throw new Error('npm installation error.');
    }
}