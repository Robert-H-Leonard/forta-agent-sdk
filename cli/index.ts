#!/usr/bin/env node
import yargs, { Argv } from 'yargs';
import configureContainer from './di.container';

export type CommandName = "init" | "run" | "publish"
export type CommandHandler = (args: any) => Promise<void>

async function executeCommand(commandName: CommandName, cliArgs: any) {
  const diContainer = configureContainer(commandName, cliArgs);
  const command = diContainer.resolve<CommandHandler>(commandName)
  try {
    await command(cliArgs)
  } catch (e) {
    console.error(`ERROR: ${e.message}`)
  }
}

yargs
  .command('init', 'Initialize a Forta Agent project', 
    (yargs: Argv) => {
      yargs.option('typescript', {
        description: 'Initialize as Typescript project',
      })
    },
    (cliArgs: any) => executeCommand("init", cliArgs)
  )
  .command('run', 'Run the Forta Agent with latest blockchain data',
    (yargs: Argv) => {
      yargs.option('tx', {
        description: 'Run with the specified transaction hash',
        type: 'string'
      }).option('block', {
        description: 'Run with the specified block hash/number',
        type: 'string'
      }).option('range', {
        description: 'Run with the specified block range (e.g. 15..20)',
        type: 'string'
      }).option('file', {
        description: 'Run with the specified json file',
        type: 'string'
      }).option('prod', {
        description: 'Run a server listening for events from a Forta Scanner'
      }).option('config', {
        description: 'Specify a config file (default: forta.config.json)',
        type: 'string',
      })
    },
    (cliArgs: any) => executeCommand("run", cliArgs)
  )
  .command('publish', 'Publish the Forta Agent to the network',
    (yargs: Argv) => {
      yargs.option('config', {
        description: 'Specify a config file (default: forta.config.json)',
        type: 'string',
      })
    },
    (cliArgs: any) => executeCommand("publish", cliArgs)
  )
  .strict()
  .argv