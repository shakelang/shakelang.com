import CodeMirror = require("codemirror");
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/addon/edit/matchbrackets.js';

// Shake Library
require('./shake_environment.js')

document.addEventListener('DOMContentLoaded', () => {
  const editor = CodeMirror.fromTextArea(<HTMLTextAreaElement>document.getElementById("try-shake"), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true
  });
}, false);