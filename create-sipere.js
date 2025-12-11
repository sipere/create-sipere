#!/usr/bin/env node

const { Command } = require('commander');
const prompts = require('prompts');
const createProject = require('./lib/generator');

const program = new Command();

program
    .description('create a new sipere project')
    .argument('[project-name]', 'project name')
    .option('-t, --typescript', 'use typescript')
    .action(async (name, options) => {
        await startGenerator(name, options);
    });
program.parse(process.argv);

async function startGenerator(name, options) {
    let projectName;
    if(!name) {
        const questions = [
            {
                type: 'text',
                name: 'name',
                message: 'Project name?',
                initial: 'my-sipere'
            }
        ];
        const answer = await prompts(questions);
        projectName = answer.name;
    }else {
        projectName = name;
    }

    if (!projectName) return;
    const CURRENT_DIR = __dirname;
    await createProject(projectName, options, CURRENT_DIR);
}

