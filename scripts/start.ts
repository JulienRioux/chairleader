import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import lolcatjs from "lolcatjs";
import shell from 'shelljs';

lolcatjs.options.seed = Math.round(Math.random() * 1000);
lolcatjs.options.colors = true;

export const logWelcomeMessage = () => {
  lolcatjs.fromString(
    `${figlet.textSync("Chairleader\nCLI", {
      font: "doom",
      horizontalLayout: "default",
      verticalLayout: "controlled smushing",
    })}\nuse CTRL + C to quit\n`
  );
};

/**
 * Ask what platform to use
 */
export const askPlatform = () =>
  inquirer.prompt<{ platform: any }>([
    {
      name: 'platform',
      type: 'list',
      message: 'Choose the platform you want to work on?',
      choices: [
        {
          name: '🌎  Web',
          value: 'web',
        },
        {
          name: '🍎/🤖  Native',
          value: 'app',
        },
      ],
    },
  ]);

  /**
 * Ask what network to use
 */
export const askNetwork = () =>
  inquirer.prompt<{ network: any }>([
    {
      name: 'network',
      type: 'list',
      message: 'Choose the network you want to work on?',
      choices: [
        {
          name: '🛠️  Development',
          value: 'development',
        },
        {
          name: '🏭 Production',
          value: 'production',
        },
      ],
    },
  ]);

/**
 * Ask what platform to use
 */
export const askIsRunningLocalApi = () =>
  inquirer.prompt<{ isRunningLocalApi: any }>([
    {
      name: 'isRunningLocalApi',
      type: 'confirm',
      message: 'Do you want to run the API locally?',
      default: false,
    },
  ]);

enum CMD {
  LOCAL_STORE_API = "dev:local-store-api",
  REMOTE_STORE_API = "dev:remote-store-api"
}

const run = async () => {
  logWelcomeMessage();
  
  // const { platform } = await askPlatform();
  const { network } = await askNetwork();

  const networkCmd = network === "production" ? "REACT_APP_ENVIRONMENT=production" :  "REACT_APP_ENVIRONMENT=development"

  const { isRunningLocalApi } = await askIsRunningLocalApi();

  shell.exec(`cd .. && ${networkCmd} yarn ${isRunningLocalApi ? CMD.LOCAL_STORE_API : CMD.REMOTE_STORE_API}`)  
}

run()