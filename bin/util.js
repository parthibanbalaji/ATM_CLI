
/**
 * This file consist of utility function used in the app
 */
const {ERROR_MESSAGES, commands} = require('./const');
const parseInput = (input) => {
  let parsedCommand;
  let parsedArguments = [];
  if(input) {
    input = input.trim();
    let inputs = input.split(' ');
    if(inputs.length >= 1) {
      parsedCommand = inputs[0]?.trim();
    }
    if(inputs.length > 1) {
      for(let i=1; i<inputs.length; i++) {
        let ele = inputs[i];
        if(ele) {
          ele = ele.trim();
          if(ele) parsedArguments.push(ele)
        }
      }
    }
  } 
  return [parsedCommand,parsedArguments]
}

const validateInput = (inputCommand, inputArguments) => {
  let isValid = false
  errorMessage = ERROR_MESSAGES.SPECIFY_COMMAND;
  if(inputCommand) {
    for (let command in commands) {
      let commandObject = commands[command];
      if(command === inputCommand) {
        let validArgumentsLength = commandObject.acceptedArguments;
        if(inputArguments.length == validArgumentsLength) {
          isValid = true;
          errorMessage = "";
          if(validArgumentsLength == 1) {
            inputArguments = inputArguments[0]
          }
        } else {
          errorMessage = ERROR_MESSAGES.NOT_VALID_ARG;
          break;
        }
      }
    }
  } 
  return [isValid,errorMessage,inputArguments]
}
function utilToFormTransferReturnMessage(amount, username,currentUser) {
  let message = `Transferred $${amount} to ${username}\nYour balance is $${currentUser.balance}`;
  message = utilToFormOweMessage(currentUser,message)
  return message
}

function utilToFormOweMessage (currentUser,message) {
  if(currentUser.owed_to.length > 0) {
      for(let owe of currentUser.owed_to) {
          message = message+`\nOwed $${owe.amount} to ${owe.userName}`
      }
  }
  if(currentUser.owed_from.length > 0) {
      for(let owe of currentUser.owed_from) {
          message = message+`\nOwed $${owe.amount} from ${owe.userName}`
      }
  }
  return message
}
module.exports = {
  parseInput,
  validateInput,
  utilToFormTransferReturnMessage,
  utilToFormOweMessage
};
