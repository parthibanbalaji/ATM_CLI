/**
 * THis file consist of constant used in app
 */
const commands = {
  login: {
    commandName: "login",
    aliasName: "l",
    description: "Provide user name to start the session",
    acceptedArguments: 1,
    type: "string",
  },
  deposit: {
    commandName: "deposit",
    aliasName: "d",
    description: "Provide amount to deposit",
    acceptedArguments: 1,
    type: "number",
  },
  withdraw: {
    commandName: "withdraw",
    aliasName: "w",
    description: "Provide amount to withdraw",
    acceptedArguments: 1,
    type: "number",
  },
  transfer: {
    commandName: "transfer",
    aliasName: "tr",
    description: "Provide user and amount to transfer",
    acceptedArguments: 2,
    type: "array",
  },
  logout: {
    commandName: "logout",
    aliasName: "logout",
    description: "logs user out of the session",
    acceptedArguments: 0,
    type: "boolean"
  },
};

const ERROR_MESSAGES = {
  NOT_VALID_ARG: "Please provide valid arguments",
  ARGUMENT_LENGTH_GREATER: "Please provide only required arguments",
  ARGUMENT_LENGTH_LESSER: "Please provide required arguments",
  ONE_COMMAND_ALLOWED: "Only one action is allowed at a time",
  SPECIFY_COMMAND: "Provide a valid command to continue",

  ANOTHER_SESSION_EXIST:"Another User session already exist",
  LOGIN_TO_CONTINUE: "Please login to continue",
  LOGOUT_ERROR: "No user logged in",

  ENTER_CORRECT_NUMBER: "Please enter valid number",
  INSUFFICIENT_BALANCE: "Insufficient balance",

  ENTER_VALID_USER: "Please enter valid user name to proceed transfer"
};



const commandUsageText = `
Usage: --login <name>
--deposit <amount>
--withdraw <amount>
--transfer <user> <amount>
--logout
`;

const storageFileName = "data.txt"

module.exports = {
  commands,
  ERROR_MESSAGES,
  commandUsageText,
  storageFileName
};
