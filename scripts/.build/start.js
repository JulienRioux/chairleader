var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from 'inquirer';
import figlet from 'figlet';
import lolcatjs from "lolcatjs";
import shell from 'shelljs';
lolcatjs.options.seed = Math.round(Math.random() * 1000);
lolcatjs.options.colors = true;
export const logWelcomeMessage = () => {
    lolcatjs.fromString(`${figlet.textSync("Chairleader\nCLI", {
        font: "doom",
        horizontalLayout: "default",
        verticalLayout: "controlled smushing",
    })}\nuse CTRL + C to quit\n`);
};
/**
 * Ask what platform to use
 */
export const askPlatform = () => inquirer.prompt([
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
 * Ask what platform to use
 */
export const askIsRunningLocalApi = () => inquirer.prompt([
    {
        name: 'isRunningLocalApi',
        type: 'confirm',
        message: 'Do you want to run the API locally?',
    },
]);
var CMD;
(function (CMD) {
    CMD["LOCAL_STORE_API"] = "dev:local-store-api";
    CMD["REMOTE_STORE_API"] = "dev:remote-store-api";
})(CMD || (CMD = {}));
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    logWelcomeMessage();
    // const { platform } = await askPlatform();
    const { isRunningLocalApi } = yield askIsRunningLocalApi();
    shell.exec(`cd .. && yarn ${isRunningLocalApi ? CMD.LOCAL_STORE_API : CMD.REMOTE_STORE_API}`);
});
run();
//# sourceMappingURL=start.js.map