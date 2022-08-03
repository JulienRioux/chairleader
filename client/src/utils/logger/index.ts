/** Logger funstion that sent user and app info to the admin tool. */
export class Logger {
  static async error(log: any) {
    console.log('Error: ', log);
  }

  static async info(log: any) {
    console.log('Info: ', log);
  }
}
