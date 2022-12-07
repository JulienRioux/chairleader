const loggingText = `%c
                                                             
   Welcome to                                                
    _____ _           _      _                _              
   /  __ \\ |         (_)    | |              | |             
   | /  \\/ |__   __ _ _ _ __| | ___  __ _  __| | ___ _ __    
   | |   | '_ \\ / _\` | | '__| |/ _ \\/ _\` |/ _\` |/ _ \\ '__|   
   | \\__/\\ | | | (_| | | |  | |  __/ (_| | (_| |  __/ |      
    \\____/_| |_|\\__,_|_|_|  |_|\\___|\\__,_|\\__,_|\\___|_|      
                                                             `;

export const welcomeLog = () =>
  console.log(loggingText, 'color: #0f0; background: #000; font-weight: bold;');
