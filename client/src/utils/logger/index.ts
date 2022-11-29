/** Logger funstion that sent user and app info to the admin tool. */

enum LOG_TYPE {
  ERROR = 'Error',
  INFO = 'Info',
  SESSION_START = 'SessionStart',
}

const getErrorObject = (error: any) => {
  // Return null if there is no error object.
  if (typeof error !== 'object') {
    return '';
  }
  return Object.getOwnPropertyNames(error).reduce((acc: any, curr) => {
    acc[curr] = error[curr];
    return acc;
  }, {});
};

const getMessage = (log: any) => {
  let message = log;
  if (log.message) {
    if (log.name) {
      message = `${log.name}: ${log.message}`;
    } else {
      message = log.message;
    }
  }
  return message;
};

const logQuery = `
  mutation LogMessage(
    $message: String
    $fullErrorObject: String
    $description: String
    $stage: String
    $sourceLocation: String
    $type: String
    $userId: String
    $pathname: String
    $url: String
    $sessionId: String
    $logId: String
  ) {
    logMessage(
      message: $message
      fullErrorObject: $fullErrorObject
      description: $description
      stage: $stage
      sourceLocation: $sourceLocation
      type: $type
      userId: $userId
      pathname: $pathname
      url: $url
      sessionId: $sessionId
      logId: $logId
    ) {
      status
    }
  }
`;

const sendLog = async (variables: any) => {
  fetch(`https://admin-kooc.netlify.app/.netlify/functions/admin`, {
    body: JSON.stringify({ query: logQuery, variables }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
    .then((res) => res.json())
    .then((result) => result);
  // .catch((err) => console.log(err));
};

const getCurrentLog = async ({ description, log, type, logId }: any) => {
  // Send the full error object as string
  const fullErrorObject = JSON.stringify(getErrorObject(log));

  const { location } = window;
  const { href, pathname } = location;

  sendLog({
    description,
    fullErrorObject,
    logId,
    message: getMessage(log),
    pathname,
    sessionId: 'TODO',
    sourceLocation: 'Client',
    stage: process.env.REACT_APP_ENVIRONMENT,
    type,
    url: href,
    userId: 'TODO',
  });
};

interface ILoggerOption {
  description?: string;
  id?: string;
}

/** Logger funstion that sent user and app info to the admin tool. */
export class Logger {
  static async error(log: any, options?: ILoggerOption) {
    console.log('Sending error...');
    const description = options?.description ?? '';
    const id = options?.id ?? '';
    getCurrentLog({ description, log, logId: id, type: LOG_TYPE.ERROR });
  }

  static async info(log: any, options?: ILoggerOption) {
    const description = options?.description ?? '';
    const id = options?.id ?? '';
    getCurrentLog({ description, log, logId: id, type: LOG_TYPE.INFO });
  }
}
