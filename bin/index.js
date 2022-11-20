#! /usr/bin/env node

/**
 * Entry point for the CLI
 */
const atm_interface = require("./atm_interface");
const { validateInput, parseInput } = require("./util");
const colors = require("colors");
const repl = require("repl");

function evalulateReplInput(input, context, filename, callback) {
  let [inputCommand, inputArguments] = parseInput(input);
  let [isValid, errorMessage, formattedArgs] = validateInput(
    inputCommand,
    inputArguments
  );
  if (isValid) {
    let [error, success] = atm_interface[inputCommand](formattedArgs);
    let message = error != null ? error.red : success.green;
    callback(null, message);
  } else {
    callback(null, errorMessage.red);
  }
}

function modifyOutput(output) {
  return `${output}`;
}

const r = repl.start({
  prompt: "ATM :>",
  eval: evalulateReplInput,
  writer: modifyOutput,
});


