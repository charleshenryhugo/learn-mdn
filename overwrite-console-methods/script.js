const consoleLogs = [];
const consoleErrors = [];
const consoleWarns = [];
const consoleDebugs = [];

console.defaultLog = console.log.bind(console);
console.log = function() {
  console.defaultLog(arguments); // cannot keep the correct line number
  consoleLogs.push(Array.from(arguments));
}

console.defaultError = console.error.bind(console);
console.error = function() {
  console.defaultError(arguments); // cannot keep the correct line number
  consoleErrors.push(Array.from(arguments));
}

console.defaultWarn = console.warn.bind(console);
console.warn = function() {
  console.defaultWarn(arguments); // cannot keep the correct line number
  consoleWarns.push(Array.from(arguments));
}

console.defaultDebug = console.debug.bind(console);
console.debug = function() {
  console.defaultDebug(arguments); // cannot keep the correct line number
  consoleDebugs.push(Array.from(arguments));
}

const causeSomeErrors = () => {
  console.error('some errors happens at: ', new Date().toDateString())
  //error.all()
}

// window.onerror = function(event, lineno, colno) {
//   console.log(event, lineno, colno);
//   return false;
// }
