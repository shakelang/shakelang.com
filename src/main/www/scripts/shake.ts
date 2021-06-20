import CodeMirror = require("codemirror");
import 'codemirror/addon/display/fullscreen';
import 'codemirror/addon/scroll/simplescrollbars';

import './language-shake';

// Shake Library
const interpreter: { execute(source: String, input: String) : void; } = require('./shake_environment.js')
declare const global: { interpreter: any }

global.interpreter = interpreter;

document.addEventListener('DOMContentLoaded', () => {
  const editor = CodeMirror.fromTextArea(
    <HTMLTextAreaElement>document.getElementById('try-shake'),
    {
      mode: 'shake',
      tabSize: 2,
      lineNumbers: false,
      //firstLineNumber: 1,
      extraKeys: {
        "Ctrl-Space": "autocomplete",
        "Alt-F": "findPersistent",
        "F11": function(cm) {
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function(cm) {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        },
        /*
        "Ctrl-Q": function(cm) {
          cm.foldCode(cm.getCursor());
        }
         */
      },
      lineWrapping: true,
      // foldGutter: true,
      /*
      gutters: [

        "CodeMirror-linenumbers",
        "breakpoints",
        "CodeMirror-foldgutter"
      ],
      */
      scrollbarStyle: "simple",
      theme: "darcula"
    });

  function setConsoleOutput(e: String) {
      document.getElementById("shake-output").innerHTML = e
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/ /g, "&nbsp;")
          .replace(/\n/g, "\n<br/>");
  }

  document.getElementById("try-shake-execute-button").addEventListener('click', function() {
    try {
      interpreter.execute("<Try Shake>", editor.getValue());
    } catch (e) {
        console.error("Shake code execution threw an error", e);
        setConsoleOutput(`${e.name}: ${e.details}\n\nat ${e.marker.source}\n${e.marker.preview}\n${e.marker.marker}"\n`);
    }
  });
}, false);