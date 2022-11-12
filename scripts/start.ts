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
  LOCAL_DEV_STORE_API = "dev:local-dev-store-api",
  LOCAL_PROD_STORE_API = "dev:local-prod-store-api",
  REMOTE_STORE_API = "dev:remote-store-api"
}

const run = async () => {
  logWelcomeMessage();
  
  // const { platform } = await askPlatform();
  const { network } = await askNetwork();

  const IS_PROD = network === "production";

  const networkCmd = IS_PROD ? "REACT_APP_ENVIRONMENT=production" :  "REACT_APP_ENVIRONMENT=development"

  const { isRunningLocalApi } = await askIsRunningLocalApi();

  const LOCAL_CMD = IS_PROD ? CMD.LOCAL_PROD_STORE_API : CMD.LOCAL_DEV_STORE_API;

  shell.exec(`cd .. && ${networkCmd} yarn ${isRunningLocalApi ? LOCAL_CMD : CMD.REMOTE_STORE_API}`)  
}

run()